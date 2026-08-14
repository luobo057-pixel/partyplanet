import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChatMessage, Player, PlayerId } from '@/types';
import { SimpleAvatar } from '@/shared/components/SimpleAvatar';
import { Icon } from '@/shared/components/Icon';

/**
 * 聊天浮层
 *
 * 游戏中心型布局下的聊天呈现方式：
 * - 消息以半透明气泡叠在游戏舞台的下半部分
 * - 只显示最近几条（历史消息向上淡出）
 * - 自己的消息右对齐（品牌色），他人左对齐
 * - 不阻挡游戏画面顶部的主视觉
 *
 * 这样既保留了"热闹房间"的聊天氛围，又不喧宾夺主。
 */

interface ChatOverlayProps {
  messages: ChatMessage[];
  playersById: Map<PlayerId, Player>;
  currentUserId: PlayerId | null;
}

export function ChatOverlay({ messages, playersById, currentUserId }: ChatOverlayProps) {
  // 只显示最近的 6 条，避免堆积遮挡
  const recent = messages.slice(-6);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end gap-1.5 px-4 pb-3">
      <AnimatePresence initial={false}>
        {recent.map((msg) => {
          const sender = playersById.get(msg.senderId);
          const isMe = msg.senderId === currentUserId;
          return (
            <motion.div
              key={msg.id}
              layout
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
                className={`max-w-[70%] rounded-2xl px-3 py-1.5 text-sm backdrop-blur-sm ${
                  isMe
                    ? 'bg-brand-500/90 text-white'
                    : 'bg-night-700/80 text-white/90'
                }`}
              >
                {!isMe && sender && (
                  <p className="mb-0.5 text-micro font-medium text-white/40">
                    {sender.nickname}
                  </p>
                )}
                <p className="leading-snug">{msg.text}</p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/**
 * 底部输入栏
 * 点击后弹出完整输入（MVP 用原生 input 直接打字）
 */
interface ChatInputBarProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  /** 快捷表情点击 */
  onEmoji?: (emoji: string) => void;
}

const QUICK_EMOJIS = ['😀', '😂', '🥰', '🎉', '👍', '🔥', '😱', '💔'];

export function ChatInputBar({ value, onChange, onSend, onEmoji }: ChatInputBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动聚焦
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (!value.trim()) return;
    onSend();
    inputRef.current?.focus();
  };

  return (
    <div className="border-t border-white/10 bg-night-800/95 px-3 py-2 backdrop-blur">
      {/* 快捷表情行 */}
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
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Say something..."
          className="flex-1 rounded-full bg-white/10 px-4 py-2 text-sm outline-none placeholder:text-white/40 focus:bg-white/10"
        />
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
