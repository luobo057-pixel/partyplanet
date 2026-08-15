import { useEffect, useReducer, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Player, PlayerId } from '@/types';
import { SimpleAvatar } from '@/shared/components/SimpleAvatar';
import { Icon } from '@/shared/components/Icon';
import { TRUTHS, DARES, NPC_ANSWERS, randomFrom } from './questions';

/**
 * Truth or Dare — the in-room game.
 *
 * Loop: spin (picking) → choose → question → answer → reveal → next round.
 * NPC players auto-choose and auto-answer; the real player gets buttons
 * and an input. All phase timers live in ONE effect keyed by phase —
 * no unstable deps, cleanup-safe, chatter-proof.
 */

type Phase = 'spin' | 'choose' | 'question' | 'answer' | 'reveal';
type Choice = 'truth' | 'dare';

interface TDState {
  phase: Phase;
  round: number;
  currentId: PlayerId | null;
  choice: Choice | null;
  question: string;
  answer: string;
}

type TDAction =
  | { type: 'LAND'; id: PlayerId }
  | { type: 'CHOOSE'; choice: Choice; question: string }
  | { type: 'TO_ANSWER' }
  | { type: 'SUBMIT'; answer: string }
  | { type: 'NEXT_ROUND' };

const initial: TDState = {
  phase: 'spin',
  round: 1,
  currentId: null,
  choice: null,
  question: '',
  answer: '',
};

function reducer(s: TDState, a: TDAction): TDState {
  switch (a.type) {
    case 'LAND':
      return { ...s, phase: 'choose', currentId: a.id };
    case 'CHOOSE':
      return { ...s, phase: 'question', choice: a.choice, question: a.question };
    case 'TO_ANSWER':
      return { ...s, phase: 'answer' };
    case 'SUBMIT':
      return { ...s, phase: 'reveal', answer: a.answer };
    case 'NEXT_ROUND':
      return { ...initial, round: s.round + 1 };
  }
}

interface Props {
  players: Player[];
  me: Player | null;
  onExit: () => void;
}

export function TruthOrDareGame({ players, me, onExit }: Props) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [spinIdx, setSpinIdx] = useState(0);
  const [draft, setDraft] = useState('');

  const current = players.find((p) => p.id === state.currentId) ?? null;
  const isMyTurn = current?.id === me?.id;

  /** Spin visual — cycles fast while phase is 'spin' */
  useEffect(() => {
    if (state.phase !== 'spin') return;
    const iv = setInterval(() => setSpinIdx((i) => (i + 1) % players.length), 90);
    const stop = setTimeout(() => {
      clearInterval(iv);
      dispatch({ type: 'LAND', id: randomFrom(players).id });
    }, 2200);
    return () => {
      clearInterval(iv);
      clearTimeout(stop);
    };
  }, [state.phase, state.round, players]);

  /** Phase driver — NPC actions + auto-advance (single timer per phase) */
  useEffect(() => {
    const { phase, currentId, choice } = state;
    let t: ReturnType<typeof setTimeout> | undefined;

    if (phase === 'choose' && currentId) {
      const chooser = players.find((p) => p.id === currentId);
      if (chooser?.isNpc) {
        t = setTimeout(() => {
          const c = randomFrom(['truth', 'dare'] as Choice[]);
          dispatch({ type: 'CHOOSE', choice: c, question: randomFrom(c === 'truth' ? TRUTHS : DARES) });
        }, 1400);
      }
    } else if (phase === 'question') {
      t = setTimeout(() => dispatch({ type: 'TO_ANSWER' }), 1300);
    } else if (phase === 'answer' && currentId) {
      const answerer = players.find((p) => p.id === currentId);
      if (answerer?.isNpc && choice) {
        t = setTimeout(() => {
          dispatch({ type: 'SUBMIT', answer: randomFrom(NPC_ANSWERS[choice]) });
        }, 1800 + Math.random() * 1200);
      }
    } else if (phase === 'reveal') {
      t = setTimeout(() => dispatch({ type: 'NEXT_ROUND' }), 4200);
    }

    return () => {
      if (t) clearTimeout(t);
    };
  }, [state.phase, state.currentId, state.choice, state.round, players]);

  const pick = (c: Choice) => {
    dispatch({ type: 'CHOOSE', choice: c, question: randomFrom(c === 'truth' ? TRUTHS : DARES) });
  };

  const submitMine = () => {
    if (!draft.trim()) return;
    dispatch({ type: 'SUBMIT', answer: draft.trim() });
    setDraft('');
  };

  return (
    <div className="relative mx-3 flex flex-1 flex-col overflow-hidden rounded-3xl border border-brand-500/20 bg-gradient-to-b from-brand-500/10 to-night-800/60">
      {/* ambient glow */}
      <div
        className="absolute left-1/4 top-1/4 h-40 w-40 rounded-full blur-3xl [animation:pulse_5s_ease-in-out_infinite]"
        style={{ background: 'rgba(244,63,94,0.18)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full blur-3xl [animation:pulse_7s_ease-in-out_1.5s_infinite]"
        style={{ background: 'rgba(139,92,246,0.14)' }}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-300">
          <Icon name="dice" size={14} />
          Truth or Dare · Round {state.round}
        </div>
        <button
          onClick={onExit}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 active:scale-90"
        >
          <Icon name="close" size={13} />
        </button>
      </div>

      {/* Players row with spin highlight */}
      <div className="relative mt-3 flex justify-center gap-2 px-4">
        {players.map((p, i) => {
          const spinning = state.phase === 'spin';
          const hot = spinning ? i === spinIdx : p.id === state.currentId;
          return (
            <motion.div
              key={p.id}
              animate={{ scale: hot ? 1.15 : 1, y: hot ? -2 : 0 }}
              transition={{ duration: spinning ? 0.08 : 0.2 }}
            >
              <SimpleAvatar
                nickname={p.nickname}
                config={p.avatar}
                size={34}
                circle
                ring={hot ? 'active' : 'idle'}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Phase body */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 pb-4 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${state.round}-${state.phase}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="flex w-full flex-col items-center"
          >
            {state.phase === 'spin' && (
              <p className="text-sm text-white/70">Spinning the wheel...</p>
            )}

            {state.phase === 'choose' && (
              isMyTurn ? (
                <>
                  <p className="mb-4 text-base font-semibold">Your turn! Pick one:</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => pick('truth')}
                      className="rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 px-8 py-4 font-bold shadow-[0_8px_24px_rgba(59,130,246,0.4)] active:scale-95"
                    >
                      Truth
                    </button>
                    <button
                      onClick={() => pick('dare')}
                      className="rounded-2xl bg-gradient-to-br from-brand-500 to-pink-600 px-8 py-4 font-bold shadow-[0_8px_24px_rgba(244,63,94,0.4)] active:scale-95"
                    >
                      Dare
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-white/70">
                  {current?.nickname} is choosing...
                </p>
              )
            )}

            {state.phase === 'question' && (
              <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-night-700/70 p-5">
                <span
                  className={`rounded-full px-2 py-0.5 text-micro font-bold uppercase tracking-wider ${
                    state.choice === 'truth'
                      ? 'bg-sky-500/20 text-sky-300'
                      : 'bg-brand-500/20 text-brand-300'
                  }`}
                >
                  {current?.nickname} · {state.choice}
                </span>
                <p className="mt-3 text-base leading-relaxed">{state.question}</p>
              </div>
            )}

            {state.phase === 'answer' && (
              isMyTurn ? (
                <div className="flex w-full max-w-xs items-center gap-2">
                  <input
                    autoFocus
                    value={draft}
                    maxLength={200}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitMine()}
                    placeholder={state.choice === 'truth' ? 'Tell the truth...' : 'Describe your dare...'}
                    className="flex-1 rounded-full bg-white/10 px-4 py-2.5 text-sm outline-none placeholder:text-white/40"
                  />
                  <button
                    onClick={submitMine}
                    disabled={!draft.trim()}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 active:scale-90 disabled:opacity-40"
                  >
                    <Icon name="send" size={17} />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-white/70">
                  {current?.nickname} is answering<span className="animate-pulse">...</span>
                </p>
              )
            )}

            {state.phase === 'reveal' && (
              <div className="w-full max-w-xs">
                <p className="text-micro uppercase tracking-wider text-white/40">
                  {state.choice} · {state.question}
                </p>
                <p className="mt-3 text-lg leading-relaxed">“{state.answer}”</p>
                <p className="mt-2 text-xs text-brand-300">— {current?.nickname}</p>
                {/* reaction burst */}
                <div className="pointer-events-none relative mt-4 h-12 w-full overflow-hidden">
                  {['😂', '🔥', '😱', '👏', '❤️', '🎉'].map((e, i) => (
                    <motion.span
                      key={`${state.round}-${i}`}
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: -30, opacity: [0, 1, 0] }}
                      transition={{ duration: 1.4, delay: i * 0.12 }}
                      className="absolute text-xl"
                      style={{ left: `${8 + i * 15}%` }}
                    >
                      {e}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
