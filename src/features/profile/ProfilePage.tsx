import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { Icon, type IconName } from '@/shared/components/Icon';
import { ProfileHeader } from './ProfileHeader';
import { OverviewTab } from './tabs/OverviewTab';
import { StatsTab } from './tabs/StatsTab';
import { PostsTab } from './tabs/PostsTab';
import { HonorsTab } from './tabs/HonorsTab';
import { AssetsTab } from './tabs/AssetsTab';
import {
  MOCK_STATS,
  MOCK_POSTS,
  MOCK_GIFTS,
  MOCK_ACHIEVEMENTS,
  MOCK_ASSETS,
} from '@/services/mocks/profileData';

type TabKey = 'overview' | 'stats' | 'posts' | 'honors' | 'assets';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Home' },
  { key: 'stats', label: 'Stats' },
  { key: 'posts', label: 'Posts' },
  { key: 'honors', label: 'Honors' },
  { key: 'assets', label: 'Assets' },
];

/**
 * Profile page — hero-centric layout.
 *
 * Centered identity hero at top, text-only tab bar with underline
 * indicator, tab content below. Settings floats top-right.
 */
export default function ProfilePage() {
  const player = usePlayerStore((s) => s.player);
  const [tab, setTab] = useState<TabKey>('overview');
  const [menuOpen, setMenuOpen] = useState(false);

  if (!player) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-white/40">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col">
      {/* 点击遮罩关闭菜单 */}
      {menuOpen && (
        <div className="absolute inset-0 z-30" onClick={() => setMenuOpen(false)} />
      )}

      {/* 更多菜单（Edit Profile / Settings 综合于此） */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.12 }}
          className="absolute right-4 top-14 z-40 w-44 overflow-hidden rounded-xl border border-white/10 bg-night-700 shadow-card"
        >
          <MenuItem icon="pen" label="Edit Profile" onClick={() => setMenuOpen(false)} />
          <MenuItem icon="settings" label="Settings" onClick={() => setMenuOpen(false)} last />
        </motion.div>
      )}

      {/* 悬浮更多按钮 */}
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="absolute right-4 top-3 z-40 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition active:scale-95"
      >
        <Icon name="more" size={18} />
      </button>

      {/* 滚动主体 */}
      <div className="no-scrollbar flex-1 overflow-y-auto pb-6">
        {/* Hero：居中头像 + 昵称 + 统计 + 资产 */}
        <ProfileHeader player={player} stats={MOCK_STATS} />

        {/* Tab bar：纯文字 + 下划线指示器 */}
        <div className="sticky top-0 z-10 mt-4 border-b border-white/10 bg-night-900/90 backdrop-blur">
          <div className="no-scrollbar flex overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`relative flex-1 shrink-0 px-2 py-2.5 text-sm font-medium transition ${
                  tab === t.key ? 'text-white' : 'text-white/40'
                }`}
              >
                {t.label}
                {tab === t.key && (
                  <motion.span
                    layoutId="profile-tab-underline"
                    className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-brand-400"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 内容（切 tab 淡入，不用 exit 避免快速切换卡死） */}
        <div className="px-4 pt-4">
          <motion.div
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            {tab === 'overview' && (
              <OverviewTab
                stats={MOCK_STATS}
                recentPosts={MOCK_POSTS}
                achievements={MOCK_ACHIEVEMENTS}
                gifts={MOCK_GIFTS}
              />
            )}
            {tab === 'stats' && <StatsTab stats={MOCK_STATS} />}
            {tab === 'posts' && <PostsTab player={player} posts={MOCK_POSTS} />}
            {tab === 'honors' && (
              <HonorsTab gifts={MOCK_GIFTS} achievements={MOCK_ACHIEVEMENTS} />
            )}
            {tab === 'assets' && <AssetsTab assets={MOCK_ASSETS} />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/** 更多菜单里的一行 */
function MenuItem({
  icon,
  label,
  onClick,
  last,
}: {
  icon: IconName;
  label: string;
  onClick: () => void;
  last?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 px-4 py-3 text-sm text-white/90 transition active:bg-white/5 ${
        last ? '' : 'border-b border-white/10'
      }`}
    >
      <Icon name={icon} size={15} className="text-white/70" />
      {label}
    </button>
  );
}
