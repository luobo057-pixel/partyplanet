import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

const TABS: { key: TabKey; label: string; icon: IconName }[] = [
  { key: 'overview', label: 'Home', icon: 'home' },
  { key: 'stats', label: 'Stats', icon: 'trophy' },
  { key: 'posts', label: 'Posts', icon: 'image' },
  { key: 'honors', label: 'Honors', icon: 'gift' },
  { key: 'assets', label: 'Assets', icon: 'shopping-bag' },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const player = usePlayerStore((s) => s.player);
  const [tab, setTab] = useState<TabKey>('overview');

  if (!player) {
    return (
      <div className="flex h-full items-center justify-center text-white/40">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold">Profile</h1>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70">
          <Icon name="settings" size={18} />
        </button>
      </header>

      {/* Scrollable body */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
        {/* Header: avatar + nickname + Lv + currencies */}
        <ProfileHeader player={player} />

        {/* Edit profile button */}
        <button
          onClick={() => navigate('/lobby')}
          className="btn-ghost mt-3 w-full"
        >
          <Icon name="pen" size={16} className="mr-1.5" />
          Edit Profile
        </button>

        {/* Tab bar */}
        <div className="no-scrollbar sticky top-0 z-10 -mx-4 mt-3 flex gap-1 overflow-x-auto border-b border-white/10 bg-night-900/90 px-4 py-2 backdrop-blur">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                tab === t.key
                  ? 'text-white'
                  : 'text-white/50'
              }`}
            >
              <Icon name={t.icon} size={14} />
              {t.label}
              {tab === t.key && (
                <motion.span
                  layoutId="profile-tab-active"
                  className="absolute inset-0 -z-10 rounded-full bg-white/10"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
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
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
