import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import AppShell from './AppShell';
import { usePlayerStore } from '@/stores/usePlayerStore';

// 页面（阶段 0 先占位，后续阶段填充）
import HomePage from '@/features/home/HomePage';
import LobbyPage from '@/features/lobby/LobbyPage';
import MatchingPage from '@/features/social/MatchingPage';
import FriendsPage from '@/features/social/FriendsPage';
import RoomPage from '@/features/room/RoomPage';
import ProfilePage from '@/features/profile/ProfilePage';

export default function App() {
  const ensureGuest = usePlayerStore((s) => s.ensureGuest);

  // 进入 App 即确保有游客身份
  useEffect(() => {
    ensureGuest();
  }, [ensureGuest]);

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/matching" element={<MatchingPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
