import { type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon, type IconName } from '@/shared/components/Icon';

/**
 * AppShell：移动端外壳
 * - 固定 480px 宽度模拟手机
 * - 在不需要底部 Tab 的页面（房间、匹配、编辑器）隐藏导航栏
 */

const HIDE_TAB_ROUTES = ['/onboarding', '/matching', '/friends'];
const HIDE_TAB_PREFIXES = ['/room/'];

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const showTab = !(
    HIDE_TAB_ROUTES.includes(location.pathname) ||
    HIDE_TAB_PREFIXES.some((p) => location.pathname.startsWith(p))
  );

  return (
    <div className="app-shell">
      {/* 页面主体 */}
      <main className="relative flex-1 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 底部 Tab 栏 */}
      <AnimatePresence>
        {showTab && (
          <motion.nav
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex h-16 shrink-0 items-center justify-around border-t border-white/10 bg-night-800/95 backdrop-blur"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <TabButton
              label="Home"
              icon="home"
              active={location.pathname === '/'}
              onClick={() => navigate('/')}
            />
            <TabButton
              label="Rooms"
              icon="game"
              active={location.pathname === '/lobby'}
              onClick={() => navigate('/lobby')}
            />
            <TabButton
              label="Me"
              icon="user"
              active={location.pathname === '/profile'}
              onClick={() => navigate('/profile')}
            />
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: IconName;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-0.5 py-1 transition ${
        active ? 'text-white' : 'text-white/40'
      }`}
    >
      <Icon name={icon} size={22} />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
