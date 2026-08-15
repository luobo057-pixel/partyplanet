import { useEffect, useReducer, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Player, PlayerId } from '@/types';
import { Icon } from '@/shared/components/Icon';
import type { PlayerGameStatus } from '../PlayerStrip';
import { Die } from './Die';

/**
 * Liar's Dice (大话骰) — bid, bluff, call it.
 *
 * Rules (no wilds, faces 1-6):
 * - Everyone starts with 5 dice, rolls hidden each round
 * - Bids: "at least N dice of face F" — each bid must raise
 *   (more dice, or same dice count at a higher face)
 * - Call the previous bid a lie → all dice reveal:
 *   actual >= N → caller loses a die, else bidder loses one
 * - Lose all dice = eliminated; last one standing wins
 *
 * Real player bids via steppers + dice face picker; NPCs use a
 * lightweight bluff heuristic. Phase timers in ONE effect per phase
 * (parent re-render safe, same pattern as TruthOrDare).
 */

type Phase = 'rolling' | 'bidding' | 'reveal' | 'gameover';

interface Bid {
  count: number;
  face: number;
  bidderId: PlayerId;
}

interface SeatState {
  id: PlayerId;
  /** remaining dice faces; empty = eliminated */
  dice: number[];
}

/** Speech-bubble action attached to a player (like chat) */
interface Bubble {
  text: string;
  kind: 'bid' | 'call';
}

interface LDState {
  phase: Phase;
  round: number;
  seats: SeatState[];
  /** real player's id — used to detect win/loss */
  meId: PlayerId | null;
  /** index into seats for whose turn (only alive seats act) */
  turn: number;
  /** seat index that opens the round's bidding (loser of a call opens next) */
  opener: number;
  bid: Bid | null;
  history: string[];
  /** latest action per player, rendered as avatar bubbles */
  lastBy: Record<PlayerId, Bubble>;
  reveal: null | {
    bid: Bid;
    callerId: PlayerId;
    actualCount: number;
    loserId: PlayerId;
  };
  iWon: boolean | null;
}

type Action =
  | { type: 'ROLL'; diceById: Record<PlayerId, number[]> }
  | { type: 'BID'; count: number; face: number }
  | { type: 'CALL' }
  | { type: 'ADVANCE' };

const START_DICE = 5;

function initialSeats(players: Player[]): SeatState[] {
  return players.map((p) => ({
    id: p.id,
    dice: Array.from({ length: START_DICE }, () => 1),
  }));
}

function init(players: Player[], meId: PlayerId | null): LDState {
  return {
    phase: 'rolling',
    round: 1,
    seats: initialSeats(players),
    meId,
    turn: 0,
    opener: 0,
    bid: null,
    history: [],
    lastBy: {},
    reveal: null,
    iWon: null,
  };
}

/** next alive seat index after i (cyclic) */
function nextAlive(s: LDState, from: number): number {
  for (let step = 1; step <= s.seats.length; step++) {
    const idx = (from + step) % s.seats.length;
    if (s.seats[idx].dice.length > 0) return idx;
  }
  return from;
}

function reducer(s: LDState, a: Action): LDState {
  switch (a.type) {
    case 'ROLL': {
      const seats = s.seats.map((seat) =>
        seat.dice.length > 0
          ? {
              ...seat,
              dice: seat.dice.map(() => a.diceById[seat.id]?.shift() ?? rnd()),
            }
          : seat,
      );
      return { ...s, phase: 'bidding', seats, turn: s.opener, bid: null, reveal: null, lastBy: {} };
    }

    case 'BID': {
      const seat = s.seats[s.turn];
      const bid: Bid = { count: a.count, face: a.face, bidderId: seat.id };
      return {
        ...s,
        bid,
        history: [...s.history.slice(-4), `${seat.id}|${a.count}× ${a.face}`],
        lastBy: { ...s.lastBy, [seat.id]: { text: `${a.count}×${a.face}`, kind: 'bid' } },
        turn: nextAlive(s, s.turn),
      };
    }

    case 'CALL': {
      if (!s.bid) return s;
      const { count, face, bidderId } = s.bid;
      const callerId = s.seats[s.turn].id;
      const actualCount = s.seats.reduce(
        (sum, seat) => sum + seat.dice.filter((d) => d === face).length,
        0,
      );
      // bid holds → caller pays; bid was a lie → bidder pays
      const loserId = actualCount >= count ? callerId : bidderId;
      const seats = s.seats.map((seat) =>
        seat.id === loserId ? { ...seat, dice: seat.dice.slice(0, -1) } : seat,
      );
      const meAlive = seats.some((seat) => seat.dice.length > 0 && seat.id === s.meId);
      const npcAlive = seats.filter((seat) => seat.dice.length > 0 && seat.id !== s.meId).length;
      const gameOver = !meAlive || npcAlive === 0;
      const loserIdx = seats.findIndex((seat) => seat.id === loserId);

      return {
        ...s,
        phase: gameOver ? 'gameover' : 'reveal',
        seats,
        reveal: { bid: s.bid, callerId, actualCount, loserId },
        lastBy: { ...s.lastBy, [callerId]: { text: 'LIE!', kind: 'call' } },
        iWon: gameOver ? npcAlive === 0 : s.iWon,
        opener: loserIdx >= 0 ? loserIdx : s.opener,
      };
    }

    case 'ADVANCE': {
      return { ...s, phase: 'rolling', round: s.round + 1 };
    }
  }
}

function rnd() {
  return 1 + Math.floor(Math.random() * 6);
}

// ============ Component ============

interface Props {
  players: Player[];
  me: Player | null;
  onExit: () => void;
  /** Report live seat status so the top player strip can render it */
  onStatus?: (m: Map<PlayerId, PlayerGameStatus> | null) => void;
}

export function LiarsDiceGame({ players, me, onExit, onStatus }: Props) {
  const [state, dispatch] = useReducer(
    reducer,
    { players: players, meId: me?.id ?? null },
    (arg) => init(arg.players, arg.meId),
  );

  const seatsWithPlayers = state.seats.map((seat) => ({
    seat,
    player: players.find((p) => p.id === seat.id)!,
  }));
  const currentSeat = seatsWithPlayers[state.turn];
  const myTurn = !!me && currentSeat?.seat.id === me.id;
  const totalAliveDice = state.seats.reduce((n, s) => n + s.dice.length, 0);

  // my bid draft (independent of reducer)
  const [draftCount, setDraftCount] = useState(1);
  const [draftFace, setDraftFace] = useState(2);

  /** Keep the draft a legal raise: the picker floors itself against the
   *  current bid (vs 2×5 → minimum 2×6 or 3×any), so combos like 1×5
   *  can't even be dialled. Idempotent — safe on every dep change. */
  useEffect(() => {
    const bid = state.bid;
    if (!bid) return;
    const minCount = bid.face === 6 ? bid.count + 1 : bid.count;
    setDraftCount((c) => Math.max(c, minCount));
    setDraftFace((f) =>
      draftCount > bid.count ? f : f > bid.face ? f : bid.face < 6 ? bid.face + 1 : f,
    );
  }, [state.bid?.count, state.bid?.face, draftCount]);

  /** Phase driver: roll timing, NPC decisions, reveal pacing */
  useEffect(() => {
    const { phase, turn, seats } = state;
    let t: ReturnType<typeof setTimeout> | undefined;

    if (phase === 'rolling') {
      t = setTimeout(() => {
        const diceById: Record<PlayerId, number[]> = {};
        for (const seat of seats) {
          if (seat.dice.length > 0) diceById[seat.id] = Array.from({ length: seat.dice.length }, rnd);
        }
        dispatch({ type: 'ROLL', diceById });
      }, 1300);
    } else if (phase === 'bidding') {
      const seat = seats[turn];
      const isNpc = players.find((p) => p.id === seat.id)?.isNpc;
      if (isNpc) {
        t = setTimeout(() => npcAct(state, dispatch, totalAliveDice), 1500 + Math.random() * 900);
      }
    } else if (phase === 'reveal') {
      t = setTimeout(() => dispatch({ type: 'ADVANCE' }), 4600);
    }

    return () => {
      if (t) clearTimeout(t);
    };
    // `state` covers all phase-driving fields; re-runs on every dispatch
    // which is exactly the turn-by-turn cadence we want
  }, [state, players, totalAliveDice]);

  const legalBid = (count: number, face: number) => {
    if (!state.bid) return count >= 1;
    const { count: pc, face: pf } = state.bid;
    return count > pc || (count === pc && face > pf);
  };

  /** Picker bounds derived from the current bid */
  const minCount = !state.bid
    ? 1
    : state.bid.face === 6
      ? state.bid.count + 1
      : state.bid.count;
  const faceLegal = (f: number) =>
    !state.bid || draftCount > state.bid.count || f > state.bid.face;

  const placeBid = () => {
    if (!legalBid(draftCount, draftFace)) return;
    dispatch({ type: 'BID', count: draftCount, face: draftFace });
  };

  const callLie = () => dispatch({ type: 'CALL' });

  /** Push seat status up — the top strip renders dots/bubbles/turn ring.
   *  Deps must stay [state, onStatus]: deriving the turn id inside keeps
   *  object identity stable, else every parent re-render re-fires this
   *  effect and setState loops forever. */
  useEffect(() => {
    if (!onStatus) return;
    const turnId = state.phase === 'bidding' ? state.seats[state.turn]?.id : undefined;
    const map = new Map<PlayerId, PlayerGameStatus>();
    for (const seat of state.seats) {
      const bubble = state.lastBy[seat.id];
      map.set(seat.id, {
        diceLeft: seat.dice.length,
        totalDice: START_DICE,
        isTurn: seat.id === turnId,
        bubble: bubble ? { text: bubble.text, kind: bubble.kind } : undefined,
        isLoser: state.phase === 'reveal' && state.reveal?.loserId === seat.id,
      });
    }
    onStatus(map);
  }, [state, onStatus]);

  useEffect(() => () => onStatus?.(null), [onStatus]);

  return (
    <div className="relative mx-3 flex flex-1 flex-col overflow-hidden rounded-3xl border border-violet-500/25 bg-gradient-to-b from-violet-500/10 to-night-800/60">
      {/* glow */}
      <div className="absolute left-1/4 top-1/4 h-40 w-40 rounded-full bg-violet-500/15 blur-3xl [animation:pulse_5s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl [animation:pulse_7s_ease-in-out_1.5s_infinite]" />

      {/* header */}
      <div className="relative flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-300">
          <Icon name="dice" size={14} />
          Liar's Dice · Round {state.round}
        </div>
        <button
          onClick={onExit}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 active:scale-90"
        >
          <Icon name="close" size={13} />
        </button>
      </div>

      {/* table */}
      <div className="relative flex flex-1 flex-col justify-center gap-4 px-4">
        {/* center: current bid / phase message */}
        <div className="flex min-h-[92px] flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${state.round}-${state.phase}-${state.history.length}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col items-center"
            >
              {state.phase === 'rolling' && (
                <p className="text-sm text-white/70">Rolling dice...</p>
              )}

              {(state.phase === 'bidding' || state.phase === 'reveal') && !state.reveal && (
                <div className="rounded-2xl border border-violet-400/30 bg-night-700/80 px-5 py-3 text-center">
                  {state.bid ? (
                    <>
                      <p className="text-micro uppercase tracking-wider text-white/40">Current bid</p>
                      <p className="mt-1 text-xl font-bold">
                        {state.bid.count} × <span className="text-violet-300">{state.bid.face}</span>'s
                      </p>
                      <p className="mt-0.5 text-micro text-white/40">
                        by {players.find((p) => p.id === state.bid?.bidderId)?.nickname}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-white/60">Opening bid — {currentSeat?.player.nickname}?</p>
                  )}
                </div>
              )}

              {state.reveal && (
                <div className="w-full text-center">
                  <p className="text-sm font-semibold text-brand-300">
                    {players.find((p) => p.id === state.reveal?.callerId)?.nickname} called LIE on{' '}
                    {state.reveal.bid.count}× {state.reveal.bid.face}
                  </p>
                  <p className="mt-1 text-lg font-bold">
                    Actual: {state.reveal.actualCount} dice{' '}
                    <span className={state.reveal.actualCount >= state.reveal.bid.count ? 'text-emerald-400' : 'text-brand-400'}>
                      ({state.reveal.actualCount >= state.reveal.bid.count ? 'bid holds' : 'it was a lie'})
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-white/50">
                    {players.find((p) => p.id === state.reveal?.loserId)?.nickname} loses a die
                  </p>
                </div>
              )}

              {state.phase === 'gameover' && (
                <div className="text-center">
                  <p className="text-3xl">{state.iWon ? '🏆' : '💀'}</p>
                  <p className="mt-2 text-xl font-bold">
                    {state.iWon ? 'You win the table!' : 'You are out of dice'}
                  </p>
                  <button onClick={onExit} className="btn-primary mt-4 px-8">
                    Back to room
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* my dice — with my own action bubble */}
        <div className="relative flex flex-col items-center gap-1.5">
          <span className="text-micro text-white/40">Your dice</span>
          <div className="flex gap-1.5">
            {(seatsWithPlayers.find((x) => x.player.id === me?.id)?.seat.dice ?? []).map((d, i) => (
              <Die
                key={i}
                face={d}
                size={34}
                shaking={state.phase === 'rolling'}
                highlight={
                  !!state.reveal && state.phase !== 'gameover' && d === state.reveal.bid.face
                }
              />
            ))}
          </div>
          {/* opponents' hidden dice, revealed only during reveal */}
          {(state.phase === 'reveal' || state.phase === 'gameover') && state.reveal && (
            <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
              {seatsWithPlayers
                .filter((x) => x.player.id !== me?.id && x.seat.dice.length > 0)
                .map(({ seat, player }) => (
                  <div key={player.id} className="flex items-center gap-1">
                    <span className="text-micro text-white/40">{player.nickname.slice(0, 6)}</span>
                    {seat.dice.map((d, i) => (
                      <Die
                        key={i}
                        face={d}
                        size={18}
                        highlight={d === state.reveal?.bid.face}
                        dim={d !== state.reveal?.bid.face}
                      />
                    ))}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* action bar — only on my bidding turn */}
      <div className="relative px-4 pb-4">
        <AnimatePresence>
          {state.phase === 'bidding' && myTurn && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="rounded-2xl border border-white/10 bg-night-700/80 p-3"
            >
              {/* reference: what you must beat */}
              {state.bid && (
                <div className="mb-2 flex justify-center">
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-micro text-white/50">
                    Beat{' '}
                    <b className="text-violet-300">
                      {state.bid.count}×{state.bid.face}
                    </b>{' '}
                    · e.g.{' '}
                    {state.bid.face < 6
                      ? `${state.bid.count}×${state.bid.face + 1}`
                      : `${state.bid.count + 1}×1`}{' '}
                    / {state.bid.count + 1}×any
                  </span>
                </div>
              )}

              {/* face picker — illegal faces at the current count are locked */}
              <div className="flex items-center justify-center gap-1.5">
                {[1, 2, 3, 4, 5, 6].map((f) => {
                  const ok = faceLegal(f);
                  return (
                    <button
                      key={f}
                      disabled={!ok}
                      onClick={() => setDraftFace(f)}
                      className={`rounded-xl p-1 transition active:scale-90 ${
                        draftFace === f && ok
                          ? 'bg-violet-400/25 ring-2 ring-violet-400'
                          : 'bg-white/5'
                      } ${ok ? '' : 'cursor-not-allowed opacity-25'}`}
                    >
                      <Die face={f} size={26} />
                    </button>
                  );
                })}
              </div>

              {/* count stepper + actions — stepper floors at the legal minimum */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex flex-1 items-center justify-between rounded-full bg-white/10 px-2 py-1.5">
                  <button
                    onClick={() => setDraftCount((c) => Math.max(minCount, c - 1))}
                    disabled={draftCount <= minCount}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 font-bold active:scale-90 disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="text-sm font-bold tabular-nums">{draftCount} × {draftFace}</span>
                  <button
                    onClick={() => setDraftCount((c) => Math.min(totalAliveDice, c + 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 font-bold active:scale-90"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={placeBid}
                  disabled={!legalBid(draftCount, draftFace)}
                  className="rounded-full bg-violet-500 px-5 py-2.5 text-sm font-bold active:scale-95 disabled:opacity-40"
                >
                  Bid
                </button>
                {state.bid && (
                  <button
                    onClick={callLie}
                    className="rounded-full bg-gradient-to-r from-brand-500 to-pink-600 px-5 py-2.5 text-sm font-bold active:scale-95"
                  >
                    LIE!
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {state.phase === 'bidding' && !myTurn && (
          <p className="pb-1 text-center text-xs text-white/40">
            {currentSeat?.player.nickname} is thinking<span className="animate-pulse">...</span>
          </p>
        )}
      </div>
    </div>
  );
}

// ============ NPC brain ============

function npcAct(s: LDState, dispatch: React.Dispatch<Action>, totalDice: number) {
  const seat = s.seats[s.turn];
  if (!seat || seat.dice.length === 0) return;

  const othersDice = totalDice - seat.dice.length;

  if (!s.bid) {
    // opening bid: most common own face, honest-ish count
    const counts = faceCounts(seat.dice);
    const best = bestFace(counts);
    dispatch({ type: 'BID', count: Math.max(1, best.count - (Math.random() < 0.4 ? 1 : 0)), face: best.face });
    return;
  }

  const { count, face } = s.bid;
  const mineHere = seat.dice.filter((d) => d === face).length;
  // optimistic expectation of others holding the face
  const expected = mineHere + (othersDice / 6) * 1.7;

  const feelsLikeLie = count > expected + 0.8;
  if (feelsLikeLie && Math.random() < 0.75) {
    dispatch({ type: 'CALL' });
    return;
  }

  // raise: 65% bump count on same face, else jump to own best face
  if (Math.random() < 0.65) {
    const nc = count + 1;
    if (nc <= totalDice) {
      dispatch({ type: 'BID', count: nc, face });
      return;
    }
  }
  const counts = faceCounts(seat.dice);
  const best = bestFace(counts);
  let nc = Math.max(count, best.count + Math.ceil(othersDice / 6));
  if (!isRaise(nc, best.face, count, face)) nc = count + 1;
  if (nc > totalDice) {
    dispatch({ type: 'CALL' });
    return;
  }
  dispatch({ type: 'BID', count: nc, face: best.face });
}

function isRaise(c: number, f: number, pc: number, pf: number) {
  return c > pc || (c === pc && f > pf);
}

function faceCounts(dice: number[]): Record<number, number> {
  const m: Record<number, number> = {};
  for (const d of dice) m[d] = (m[d] ?? 0) + 1;
  return m;
}

function bestFace(counts: Record<number, number>): { face: number; count: number } {
  let face = 2;
  let count = 0;
  for (const f of Object.keys(counts).map(Number)) {
    // prefer higher face for tie-break flexibility
    if (counts[f] > count || (counts[f] === count && f > face)) {
      face = f;
      count = counts[f];
    }
  }
  return { face, count: Math.max(count, 1) };
}
