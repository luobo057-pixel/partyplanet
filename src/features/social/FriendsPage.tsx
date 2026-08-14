import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFriendsStore } from '@/stores/useFriendsStore';
import { SimpleAvatar } from '@/shared/components/SimpleAvatar';
import { Icon } from '@/shared/components/Icon';

/**
 * Friends list page — manage friendships.
 *
 * Entry: Profile hero "Friends" stat (tap to open).
 * Online status is mock-randomized per player (stable per session via id hash).
 */

export default function FriendsPage() {
  const navigate = useNavigate();
  const friends = useFriendsStore((s) => s.friends);
  const removeFriend = useFriendsStore((s) => s.removeFriend);

  return (
    <div className="flex h-full flex-col">
      {/* 顶栏 */}
      <header className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => navigate('/profile')}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition active:scale-95"
        >
          <Icon name="back" size={16} />
        </button>
        <h1 className="text-lg font-bold">Friends</h1>
        <span className="text-sm text-white/40">{friends.length}</span>
      </header>

      {/* 列表 */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-6">
        {friends.length === 0 ? (
          <div className="flex flex-col items-center pt-20 text-white/30">
            <Icon name="users" size={48} className="mb-3 text-white/20" />
            <p className="text-sm">No friends yet</p>
            <p className="mt-1 text-xs text-white/20">
              Join a room and tap a player's avatar to add friends
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {friends.map((entry, i) => (
              <motion.div
                key={entry.player.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass flex items-center gap-3 p-3"
              >
                <SimpleAvatar
                  nickname={entry.player.nickname}
                  config={entry.player.avatar}
                  size={48}
                  circle
                  ring={isOnline(entry.player.id) ? 'online' : 'idle'}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{entry.player.nickname}</p>
                  <p className="text-xs text-white/40">
                    Lv.{entry.player.level ?? 1} · friends since{' '}
                    {new Date(entry.since).toLocaleDateString()}
                  </p>
                </div>
                {/* 移除好友 */}
                <button
                  onClick={() => removeFriend(entry.player.id)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/40 transition active:scale-90"
                >
                  <Icon name="close" size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** 稳定的伪随机在线状态（同一玩家本次会话内一致） */
function isOnline(playerId: string): boolean {
  let hash = 0;
  for (let i = 0; i < playerId.length; i++) {
    hash = (hash * 31 + playerId.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 3 !== 0; // ~2/3 在线
}
