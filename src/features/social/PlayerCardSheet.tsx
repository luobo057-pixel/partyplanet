import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Player } from '@/types';
import { SimpleAvatar } from '@/shared/components/SimpleAvatar';
import { Icon } from '@/shared/components/Icon';
import { useFriendsStore } from '@/stores/useFriendsStore';

/**
 * Player card bottom sheet — tap a player's avatar in a room to open.
 *
 * Shows identity + Add Friend action. NPC mock accepts instantly with
 * a confirmation state.
 */

interface PlayerCardSheetProps {
  player: Player | null;
  onClose: () => void;
}

export function PlayerCardSheet({ player, onClose }: PlayerCardSheetProps) {
  const addFriend = useFriendsStore((s) => s.addFriend);
  const isFriend = useFriendsStore((s) => s.isFriend);
  const [justAdded, setJustAdded] = useState(false);

  if (!player) return null;

  const alreadyFriend = isFriend(player.id) || justAdded;

  const handleAdd = () => {
    addFriend(player);
    setJustAdded(true);
  };

  return (
    <>
      {/* 遮罩 */}
      <div
        className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 底部弹卡 */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 36 }}
        className="absolute inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-white/10 bg-night-800 px-6 pb-8 pt-5"
      >
        {/* 拖拽指示条 */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />

        <div className="flex items-center gap-4">
          <SimpleAvatar
            nickname={player.nickname}
            config={player.avatar}
            size={72}
            circle
            ring="online"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-lg font-bold">{player.nickname}</h3>
              <span className="shrink-0 rounded-md bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 py-0.5 text-micro font-bold leading-none text-night-900">
                Lv.{player.level ?? 1}
              </span>
            </div>
            {player.bio && (
              <p className="mt-0.5 truncate text-sm text-white/40">{player.bio}</p>
            )}
          </div>
        </div>

        {/* 操作区 */}
        <div className="mt-5 flex gap-3">
          {alreadyFriend ? (
            <div className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 py-3 text-sm font-semibold text-emerald-300">
              <Icon name="heart-handshake" size={16} />
              Friends
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="btn-primary flex-1 active:scale-[0.98]"
            >
              <Icon name="user" size={16} className="mr-1.5 inline" />
              Add Friend
            </button>
          )}
          <button
            onClick={onClose}
            className="btn-ghost px-8"
          >
            Close
          </button>
        </div>

        {/* 加好友后的 NPC 回应提示 */}
        {justAdded && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-center text-xs text-white/40"
          >
            {player.nickname} accepted your friend request
          </motion.p>
        )}
      </motion.div>
    </>
  );
}
