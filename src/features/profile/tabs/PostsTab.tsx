import type { Player } from '@/types';
import type { Post } from '@/types/profile';
import { Icon } from '@/shared/components/Icon';
import { SimpleAvatar } from '@/shared/components/SimpleAvatar';

interface PostsTabProps {
  player: Player;
  posts: Post[];
}

/**
 * Posts tab — moments feed (朋友圈 style) + compose entry.
 */
export function PostsTab({ player, posts }: PostsTabProps) {
  return (
    <div className="space-y-3">
      {/* Compose button */}
      <button className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-left transition active:scale-[0.98]">
        <SimpleAvatar nickname={player.nickname} config={player.avatar} size={36} circle />
        <span className="flex-1 text-sm text-white/40">Share something...</span>
        <Icon name="pen" size={18} className="text-brand-400" />
      </button>

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-white/40">
          <Icon name="image" size={48} className="mb-2 text-white/20" />
          <p className="text-sm">No posts yet</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} player={player} post={post} />
        ))
      )}
    </div>
  );
}

function PostCard({ player, post }: { player: Player; post: Post }) {
  return (
    <div className="glass p-4">
      <div className="flex items-center gap-2">
        <SimpleAvatar nickname={player.nickname} config={player.avatar} size={32} circle />
        <div className="flex-1">
          <p className="text-sm font-medium">{player.nickname}</p>
          <p className="text-xs text-white/40">{formatDate(post.createdAt)}</p>
        </div>
      </div>

      <p className="mt-2.5 whitespace-pre-wrap text-sm text-white/90">{post.text}</p>
      {post.emoji && <span className="mt-2 block text-4xl">{post.emoji}</span>}

      <div className="mt-3 flex items-center gap-4 text-xs text-white/40">
        <button className="flex items-center gap-1 transition active:scale-90">
          <span>❤</span> {post.likes}
        </button>
        <button className="flex items-center gap-1 transition active:scale-90">
          <Icon name="chat" size={14} /> {post.comments}
        </button>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  if (diffH < 1) return 'just now';
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}
