import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChatMessage, Player, PlayerId } from '@/types';
import { SimpleAvatar } from '@/shared/components/SimpleAvatar';
import { Icon } from '@/shared/components/Icon';

/**
 * Chat overlay — translucent bubbles over the lower half of the game stage.
 *
 * UX rules:
 * - Last 6 messages, entrance slide only (no `layout` — list reflow on rapid
 *   add/remove caused visible jitter)
 * - Text clamped to 3 lines (long pastes can't flood the stage)
 * - Emoji-only messages render large (emotion-first, WeChat style)
 * - Messages older than a minute show a light relative timestamp
 */

interface ChatOverlayProps {
  messages: ChatMessage[];
  playersById: Map<PlayerId, Player>;
  currentUserId: PlayerId | null;
  /** While a game runs, show fewer bubbles so the game owns the stage */
  compact?: boolean;
}

/** Max chat input length — guards bubble layout from pastes */
export const MAX_CHAT_LEN = 200;

export function ChatOverlay({ messages, playersById, currentUserId, compact }: ChatOverlayProps) {
  const recent = messages.slice(compact ? -2 : -6);

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end gap-1.5 px-4 pb-3 ${
        compact ? 'max-h-20 overflow-hidden opacity-80' : ''
      }`}
    >
      <AnimatePresence initial={false}>
        {recent.map((msg) => {
          const sender = playersById.get(msg.senderId);
          const isMe = msg.senderId === currentUserId;
          const big = isEmojiOnly(msg.text);
          const time = relTime(msg.createdAt);

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-end gap-1.5 ${isMe ? 'flex-row-reverse' : ''}`}
            >
              {sender && !isMe && (
                <SimpleAvatar
                  nickname={sender.nickname}
                  config={sender.avatar}
                  size={22}
                  circle
                />
              )}
              <div
                className={`max-w-[70%] rounded-2xl backdrop-blur-sm ${
                  isMe ? 'bg-brand-500/90 text-white' : 'bg-night-700/80 text-white/90'
                } ${compact ? 'px-2.5 py-1' : 'px-3 py-1.5'} ${big && !compact ? 'px-3.5 py-2' : ''}`}
              >
                {!isMe && sender && !compact && (
                  <p className="mb-0.5 text-micro font-medium text-white/40">
                    {sender.nickname}
                    {time && <span className="ml-1 text-white/20">{time}</span>}
                  </p>
                )}
                {big && !compact ? (
                  <p className="text-[28px] leading-normal">{msg.text}</p>
                ) : (
                  <p
                    className={`break-words leading-snug ${
                      compact ? 'text-xs line-clamp-1' : 'text-sm line-clamp-3'
                    }`}
                  >
                    {/* compact: nickname inline so bubbles stay one line over the game */}
                    {compact && !isMe && sender && (
                      <span className="font-medium text-white/40">{sender.nickname}: </span>
                    )}
                    {msg.text}
                  </p>
                )}
                {isMe && time && !compact && (
                  <p className="mt-0.5 text-right text-micro text-white/40">{time}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/**
 * Bottom input bar.
 */
interface ChatInputBarProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  /** Quick emoji tap — sends immediately */
  onEmoji?: (emoji: string) => void;
  /** Open the gift panel (button sits left of send) */
  onGift?: () => void;
}

const QUICK_EMOJIS = ['😀', '😂', '🥰', '🎉', '👍', '🔥', '😱', '💔'];

export function ChatInputBar({ value, onChange, onSend, onEmoji, onGift }: ChatInputBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Note: no auto-focus on mount — mobile keyboards shouldn't pop up
  // just from entering a room. Focus returns after sending instead.
  const handleSend = () => {
    if (!value.trim()) return;
    onSend();
    inputRef.current?.focus();
  };

  return (
    <div className="border-t border-white/10 bg-night-800/95 px-3 py-2 backdrop-blur">
      {/* Quick emoji row — tap to send instantly */}
      <div className="no-scrollbar mb-1.5 flex gap-1 overflow-x-auto">
        {QUICK_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onEmoji?.(emoji)}
            className="shrink-0 rounded-full px-2 py-0.5 text-lg active:scale-90"
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          value={value}
          maxLength={MAX_CHAT_LEN}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Say something..."
          className="flex-1 rounded-full bg-white/10 px-4 py-2 text-sm outline-none placeholder:text-white/40 focus:bg-white/10"
        />
        {/* Gift — opens panel (left of send) */}
        <button
          onClick={onGift}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70 transition active:scale-90"
        >
          <Icon name="gift" size={17} />
        </button>
        <button
          onClick={handleSend}
          disabled={!value.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white transition active:scale-90 disabled:opacity-40"
        >
          <Icon name="send" size={18} />
        </button>
      </div>
    </div>
  );
}

/** Emoji-only message? (extended pictographic + variation/joiner runs) */
function isEmojiOnly(text: string): boolean {
  return text.length <= 8 && /^[\p{Extended_Pictographic}\uFE0F\u200D]+$/u.test(text);
}

/** Relative timestamp — only surfaces after the first minute */
function relTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return '';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  return `${Math.floor(diff / 3_600_000)}h`;
}
