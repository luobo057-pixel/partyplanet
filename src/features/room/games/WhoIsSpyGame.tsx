import { useEffect, useReducer, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Player, PlayerId } from '@/types';
import { SimpleAvatar } from '@/shared/components/SimpleAvatar';
import { Icon } from '@/shared/components/Icon';
import { SPY_PAIRS, SPY_VAGUE, randomFrom } from './spyWords';
import type { PlayerGameStatus } from '../PlayerStrip';

/**
 * Who is Spy (谁是卧底) — single-round MVP.
 *
 * Deal (see your word & role) → Describe in turn (one line each, never
 * say the word) → Vote (tap a player; NPCs vote heuristically) →
 * Reveal (most-voted is outed; spy caught → civilians win, else spy
 * wins) → Play again / Exit. Descriptions collect in an in-game log.
 *
 * Phase timers live in ONE effect keyed by phase — chatter-proof.
 */

type Phase = 'deal' | 'describe' | 'vote' | 'reveal';

interface SpyState {
  phase: Phase;
  pairIdx: number;
  /** spy's word is pair.spy; civilians share pair.civilian */
  spyId: PlayerId;
  order: PlayerId[];
  turnIdx: number;
  descriptions: Record<PlayerId, string>;
  votes: Record<PlayerId, PlayerId>;
  myVoteDone: boolean;
  /** filled at reveal */
  outedId: PlayerId | null;
}

type Action =
  | { type: 'TO_DESCRIBE' }
  | { type: 'DESCRIBE'; text: string }
  | { type: 'NEXT_SPEAKER' }
  | { type: 'TO_VOTE' }
  | { type: 'VOTE'; voterId: PlayerId; targetId: PlayerId }
  | { type: 'TALLY' }
  | { type: 'AGAIN'; pairIdx: number; spyId: PlayerId };

function init(players: Player[]): SpyState {
  // spy: any player, me included
  const spyId = randomFrom(players).id;
  return {
    phase: 'deal',
    pairIdx: Math.floor(Math.random() * SPY_PAIRS.length),
    spyId,
    order: players.map((p) => p.id),
    turnIdx: 0,
    descriptions: {},
    votes: {},
    myVoteDone: false,
    outedId: null,
  };
}

function reducer(s: SpyState, a: Action): SpyState {
  switch (a.type) {
    case 'TO_DESCRIBE':
      return { ...s, phase: 'describe', turnIdx: 0 };

    case 'DESCRIBE':
      return {
        ...s,
        descriptions: { ...s.descriptions, [s.order[s.turnIdx]]: a.text },
      };

    case 'NEXT_SPEAKER': {
      const next = s.turnIdx + 1;
      return next >= s.order.length
        ? { ...s, phase: 'vote' }
        : { ...s, turnIdx: next };
    }

    case 'TO_VOTE':
      return { ...s, phase: 'vote' };

    case 'VOTE':
      return {
        ...s,
        votes: { ...s.votes, [a.voterId]: a.targetId },
        ...(a.voterId === s.order[0] && a.voterId === a.voterId ? {} : {}),
      };

    case 'TALLY': {
      const tally: Record<PlayerId, number> = {};
      for (const t of Object.values(s.votes)) tally[t] = (tally[t] ?? 0) + 1;
      let top: PlayerId | null = null;
      let topN = 0;
      let tie = false;
      for (const [pid, n] of Object.entries(tally)) {
        if (n > topN) {
          top = pid;
          topN = n;
          tie = false;
        } else if (n === topN) tie = true;
      }
      // tie or empty → nobody outed → spy survives
      return { ...s, phase: 'reveal', outedId: tie ? null : top };
    }

    case 'AGAIN':
      return {
        phase: 'deal',
        pairIdx: a.pairIdx,
        spyId: a.spyId,
        order: s.order,
        turnIdx: 0,
        descriptions: {},
        votes: {},
        myVoteDone: false,
        outedId: null,
      };
  }
}

interface Props {
  players: Player[];
  me: Player | null;
  onExit: () => void;
  onStatus?: (m: Map<PlayerId, PlayerGameStatus> | null) => void;
}

export function WhoIsSpyGame({ players, me, onExit, onStatus }: Props) {
  const [state, dispatch] = useReducer(
    reducer,
    { players, meId: me?.id ?? null },
    (arg) => init(arg.players),
  );
  const [draft, setDraft] = useState('');
  const [myPick, setMyPick] = useState<PlayerId | null>(null);

  const pair = SPY_PAIRS[state.pairIdx % SPY_PAIRS.length];
  const speaker = players.find((p) => p.id === state.order[state.turnIdx]) ?? null;
  const myTurn = state.phase === 'describe' && speaker?.id === me?.id;
  const iAmSpy = me?.id === state.spyId;
  const byId = (id: PlayerId | null | undefined) => players.find((p) => p.id === id);

  /** Phase driver — deal countdown, NPC describe, NPC votes */
  useEffect(() => {
    const { phase, turnIdx, votes } = state;
    let t: ReturnType<typeof setTimeout> | undefined;

    if (phase === 'deal') {
      t = setTimeout(() => dispatch({ type: 'TO_DESCRIBE' }), 3200);
    } else if (phase === 'describe') {
      const who = players.find((p) => p.id === state.order[turnIdx]);
      if (who?.isNpc) {
        t = setTimeout(() => {
          const isSpy = who.id === state.spyId;
          const text = isSpy ? randomFrom(SPY_VAGUE) : randomFrom(pair.hints);
          dispatch({ type: 'DESCRIBE', text });
          dispatch({ type: 'NEXT_SPEAKER' });
        }, 1600 + Math.random() * 1000);
      }
    } else if (phase === 'vote') {
      // NPC votes staggered; tally once everyone (incl. me) voted
      const npcVoters = players.filter((p) => p.isNpc && !(p.id in votes));
      const mePending = !!me && !(me.id in votes);
      if (npcVoters.length > 0) {
        const npc = npcVoters[0];
        t = setTimeout(() => {
          const isSpy = npc.id === state.spyId;
          let target: PlayerId;
          if (isSpy) {
            // spy frames a random civilian
            target = randomFrom(players.filter((p) => p.id !== npc.id && p.id !== state.spyId)).id;
          } else {
            // civilians: 45% sniff the spy (vague descriptions), else random
            const others = players.filter((p) => p.id !== npc.id);
            target =
              Math.random() < 0.45 && others.some((p) => p.id === state.spyId)
                ? state.spyId
                : randomFrom(others).id;
          }
          dispatch({ type: 'VOTE', voterId: npc.id, targetId: target });
        }, 700 + Math.random() * 700);
      } else if (mePending) {
        // waiting for my tap — no timer
      } else {
        t = setTimeout(() => dispatch({ type: 'TALLY' }), 600);
      }
    }

    return () => {
      if (t) clearTimeout(t);
    };
  }, [state, players, me, pair]);

  /** Report turn highlight to the top strip */
  useEffect(() => {
    if (!onStatus) return;
    const map = new Map<PlayerId, PlayerGameStatus>();
    if (state.phase === 'describe') {
      for (const p of players) {
        map.set(p.id, {
          diceLeft: 1,
          totalDice: 1,
          isTurn: p.id === speaker?.id,
        });
      }
    }
    onStatus(map.size > 0 ? map : null);
  }, [state.phase, state.turnIdx, players, speaker?.id, onStatus]);

  useEffect(() => () => onStatus?.(null), [onStatus]);

  const submitDescription = () => {
    if (!draft.trim()) return;
    dispatch({ type: 'DESCRIBE', text: draft.trim() });
    dispatch({ type: 'NEXT_SPEAKER' });
    setDraft('');
  };

  const confirmVote = () => {
    if (!myPick || !me) return;
    dispatch({ type: 'VOTE', voterId: me.id, targetId: myPick });
    setMyPick(null);
  };

  const spyCaught = state.outedId === state.spyId;
  const again = () => {
    const spyId = randomFrom(players).id;
    const pairIdx = Math.floor(Math.random() * SPY_PAIRS.length);
    dispatch({ type: 'AGAIN', pairIdx, spyId });
  };

  return (
    <div className="relative mx-3 flex flex-1 flex-col overflow-hidden rounded-3xl border border-indigo-500/25 bg-gradient-to-b from-indigo-500/10 to-night-800/60">
      {/* glow */}
      <div className="absolute left-1/4 top-1/4 h-40 w-40 rounded-full bg-indigo-500/15 blur-3xl [animation:pulse_5s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl [animation:pulse_7s_ease-in-out_1.5s_infinite]" />

      {/* header */}
      <div className="relative flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
          <Icon name="spy" size={14} />
          Who is Spy
        </div>
        <button
          onClick={onExit}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 active:scale-90"
        >
          <Icon name="close" size={13} />
        </button>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.phase + state.pairIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="flex w-full flex-col items-center"
          >
            {state.phase === 'deal' && (
              <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-night-700/80 p-5 text-center">
                <p className="text-micro uppercase tracking-wider text-white/40">Your word</p>
                <p className="mt-1.5 text-3xl font-bold text-indigo-300">
                  {iAmSpy ? pair.spy : pair.civilian}
                </p>
                <p
                  className={`mt-2 text-xs font-semibold ${
                    iAmSpy ? 'text-brand-300' : 'text-white/50'
                  }`}
                >
                  {iAmSpy ? '🕵️ You are the SPY — blend in!' : 'You are a civilian — find the spy'}
                </p>
                <p className="mt-3 text-micro text-white/30">Remember it, never say it.</p>
              </div>
            )}

            {state.phase === 'describe' && (
              <div className="w-full">
                {/* description log */}
                <div className="no-scrollbar max-h-44 overflow-y-auto rounded-2xl border border-white/10 bg-night-700/60 p-3">
                  {state.order.map((pid, i) => {
                    const p = byId(pid);
                    const d = state.descriptions[pid];
                    const isSpeaker = i === state.turnIdx;
                    return (
                      <div key={pid} className="flex items-start gap-2 py-1">
                        {p && (
                          <SimpleAvatar nickname={p.nickname} config={p.avatar} size={20} circle />
                        )}
                        <p className="text-xs leading-snug">
                          <span className={isSpeaker ? 'font-bold text-indigo-300' : 'text-white/50'}>
                            {p?.nickname}
                          </span>
                          {d ? (
                            <span className="text-white/90"> — {d}</span>
                          ) : isSpeaker ? (
                            <span className="animate-pulse text-white/40"> speaking...</span>
                          ) : null}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* my input or waiting */}
                <div className="mt-3">
                  {myTurn ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        value={draft}
                        maxLength={120}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && submitDescription()}
                        placeholder="Describe your word — don't say it!"
                        className="flex-1 rounded-full bg-white/10 px-4 py-2.5 text-sm outline-none placeholder:text-white/40"
                      />
                      <button
                        onClick={submitDescription}
                        disabled={!draft.trim()}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 active:scale-90 disabled:opacity-40"
                      >
                        <Icon name="send" size={17} />
                      </button>
                    </div>
                  ) : (
                    <p className="text-center text-xs text-white/40">
                      {speaker?.nickname} is describing<span className="animate-pulse">...</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {state.phase === 'vote' && (
              <div className="w-full">
                <p className="mb-3 text-center text-sm font-semibold">Who is the spy?</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {players.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setMyPick(p.id)}
                      disabled={!!me && me.id in state.votes}
                      className={`flex flex-col items-center gap-1 rounded-2xl border p-2 transition active:scale-95 ${
                        myPick === p.id
                          ? 'border-indigo-400 bg-indigo-400/15'
                          : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <SimpleAvatar nickname={p.nickname} config={p.avatar} size={36} circle />
                      <span className="max-w-[56px] truncate text-micro text-white/60">
                        {p.id === me?.id ? 'Me' : p.nickname}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  {me && !(me.id in state.votes) ? (
                    <button
                      onClick={confirmVote}
                      disabled={!myPick}
                      className="rounded-full bg-indigo-500 px-8 py-2.5 text-sm font-bold active:scale-95 disabled:opacity-40"
                    >
                      Vote
                    </button>
                  ) : (
                    <p className="text-xs text-white/40">Votes are in, tallying...</p>
                  )}
                </div>
              </div>
            )}

            {state.phase === 'reveal' && (
              <div className="w-full text-center">
                <p className="text-4xl">{spyCaught ? '🎯' : '🕵️'}</p>
                <p className="mt-2 text-lg font-bold">
                  {spyCaught ? (
                    <span className="text-emerald-400">Civilians win!</span>
                  ) : (
                    <span className="text-brand-300">The spy survives...</span>
                  )}
                </p>
                <p className="mt-1 text-sm text-white/70">
                  The spy was <b>{byId(state.spyId)?.nickname}</b> (
                  {iAmSpy ? 'you!' : pair.spy})
                  {state.outedId && !spyCaught && (
                    <> — <b>{byId(state.outedId)?.nickname}</b> got outed instead</>
                  )}
                </p>

                {/* vote tally */}
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {Object.entries(state.votes).map(([voter, target]) => (
                    <span
                      key={voter}
                      className={`rounded-full px-2 py-0.5 text-micro ${
                        target === state.spyId
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {byId(voter)?.nickname} → {byId(target)?.nickname}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex justify-center gap-3">
                  <button onClick={again} className="btn-primary px-8">
                    Play Again
                  </button>
                  <button onClick={onExit} className="btn-ghost px-6">
                    Exit
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
