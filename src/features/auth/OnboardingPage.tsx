import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { SimpleAvatar } from '@/shared/components/SimpleAvatar';

/**
 * Onboarding (lightweight) — welcome screen, tap to enter.
 */
export default function OnboardingPage() {
  const navigate = useNavigate();
  const player = usePlayerStore((s) => s.player);

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-8 overflow-hidden px-8 text-center">
      {/* Decorative blobs */}
      <div className="absolute left-1/4 top-1/4 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-accent-500/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative space-y-2"
      >
        <h1 className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-5xl font-bold text-transparent">
          PartyPlanet
        </h1>
        <p className="text-white/70">Meet interesting souls here</p>
      </motion.div>

      {/* Avatar preview */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="relative"
      >
        {player && (
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <SimpleAvatar
              nickname={player.nickname}
              config={player.avatar}
              size={120}
              circle
              ring="active"
            />
          </motion.div>
        )}
      </motion.div>

      {player && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative text-lg font-medium text-white/90"
        >
          Hi, {player.nickname}
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative w-full"
      >
        <button
          className="btn-primary w-full text-lg"
          onClick={() => navigate('/')}
        >
          Let's Play
        </button>
      </motion.div>
    </div>
  );
}
