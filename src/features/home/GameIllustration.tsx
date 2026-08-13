import type { GameType } from '@/types';

/**
 * Game card illustrations — SVG geometric art.
 *
 * Each game has a unique abstract pattern that blends into the gradient card
 * background. No art assets needed, pure code, designed to look polished.
 *
 * The illustration is positioned absolutely inside the card (right side,
 * partially clipped) so it acts as decorative art, not the main icon.
 */

interface GameIllustrationProps {
  gameType: GameType;
  /** Card size affects illustration scale */
  variant: 'full' | 'half';
}

export function GameIllustration({ gameType, variant }: GameIllustrationProps) {
  const scale = variant === 'full' ? 1 : 0.8;

  return (
    <div
      className="pointer-events-none absolute -right-4 -top-2 select-none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top right' }}
      aria-hidden="true"
    >
      <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
        {renderArt(gameType)}
      </svg>
    </div>
  );
}

function renderArt(gameType: GameType) {
  switch (gameType) {
    case 'truth-or-dare':
      // 骰子主题：多个半透明方块叠加，带圆点
      return (
        <g stroke="white" strokeWidth="1.5" opacity="0.9">
          {/* 主方块 */}
          <rect x="40" y="20" width="60" height="60" rx="14" fill="white" fillOpacity="0.18" />
          {/* 骰点 */}
          <circle cx="55" cy="35" r="4" fill="white" stroke="none" />
          <circle cx="85" cy="35" r="4" fill="white" stroke="none" />
          <circle cx="70" cy="50" r="4" fill="white" stroke="none" />
          <circle cx="55" cy="65" r="4" fill="white" stroke="none" />
          <circle cx="85" cy="65" r="4" fill="white" stroke="none" />
          {/* 装饰小方块 */}
          <rect x="90" y="75" width="28" height="28" rx="7" fill="white" fillOpacity="0.12" />
          <circle cx="104" cy="89" r="3" fill="white" stroke="none" />
          {/* 散落的点 */}
          <circle cx="20" cy="85" r="2.5" fill="white" stroke="none" opacity="0.6" />
          <circle cx="30" cy="100" r="1.8" fill="white" stroke="none" opacity="0.5" />
        </g>
      );

    case 'who-is-spy':
      // 卧底主题：放大镜 + 问号 + 神秘几何
      return (
        <g stroke="white" strokeWidth="1.5" fill="none" opacity="0.9">
          {/* 放大镜圆环 */}
          <circle cx="75" cy="50" r="26" fill="white" fillOpacity="0.12" />
          {/* 放大镜把手 */}
          <line x1="93" y1="68" x2="110" y2="85" strokeWidth="3" strokeLinecap="round" />
          {/* 问号 */}
          <path
            d="M68 42 Q68 32 75 32 Q82 32 82 42 Q82 48 75 50 L75 56"
            strokeWidth="2.5"
            strokeLinecap="round"
            stroke="white"
          />
          <circle cx="75" cy="62" r="2" fill="white" stroke="none" />
          {/* 装饰三角 */}
          <path d="M25 90 L40 90 L32.5 78 Z" fill="white" fillOpacity="0.15" stroke="none" />
          {/* 散点 */}
          <circle cx="115" cy="40" r="2" fill="white" stroke="none" opacity="0.5" />
          <circle cx="20" cy="50" r="1.8" fill="white" stroke="none" opacity="0.4" />
        </g>
      );

    case 'quiz':
      // 抢答主题：灯泡 + 闪电 + 知识几何
      return (
        <g stroke="white" strokeWidth="1.5" opacity="0.9">
          {/* 灯泡主体 */}
          <path
            d="M65 28 Q50 28 50 45 Q50 55 58 60 L58 68 L82 68 L82 60 Q90 55 90 45 Q90 28 75 28 Z"
            fill="white"
            fillOpacity="0.18"
            strokeLinejoin="round"
          />
          {/* 灯泡底座 */}
          <line x1="60" y1="72" x2="80" y2="72" strokeWidth="2" />
          <line x1="62" y1="76" x2="78" y2="76" strokeWidth="2" />
          {/* 闪电 */}
          <path
            d="M70 38 L62 52 L70 52 L66 64"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="white"
            fill="none"
          />
          {/* 光芒 */}
          <line x1="40" y1="35" x2="46" y2="40" strokeLinecap="round" opacity="0.6" />
          <line x1="100" y1="35" x2="94" y2="40" strokeLinecap="round" opacity="0.6" />
          <line x1="45" y1="25" x2="48" y2="32" strokeLinecap="round" opacity="0.5" />
          {/* 装饰小圆 */}
          <circle cx="25" cy="85" r="6" fill="white" fillOpacity="0.12" stroke="none" />
          <circle cx="110" cy="90" r="4" fill="white" fillOpacity="0.15" stroke="none" />
        </g>
      );

    case 'none':
      // 聊天主题：气泡 + 点点 + 波浪
      return (
        <g stroke="white" strokeWidth="1.5" opacity="0.9">
          {/* 主气泡 */}
          <path
            d="M35 30 Q35 18 50 18 L85 18 Q100 18 100 30 L100 55 Q100 67 85 67 L55 67 L42 78 L45 67 Q35 67 35 55 Z"
            fill="white"
            fillOpacity="0.18"
            strokeLinejoin="round"
          />
          {/* 气泡里的三个点 */}
          <circle cx="52" cy="42" r="3.5" fill="white" stroke="none" />
          <circle cx="67" cy="42" r="3.5" fill="white" stroke="none" />
          <circle cx="82" cy="42" r="3.5" fill="white" stroke="none" />
          {/* 小气泡 */}
          <path
            d="M90 80 Q90 72 100 72 L115 72 Q122 72 122 80 L122 92 Q122 98 116 98 L110 98 L104 104 L106 98 Q90 98 90 92 Z"
            fill="white"
            fillOpacity="0.12"
            strokeLinejoin="round"
          />
          <circle cx="100" cy="86" r="2" fill="white" stroke="none" />
          <circle cx="108" cy="86" r="2" fill="white" stroke="none" />
          {/* 散点 */}
          <circle cx="20" cy="60" r="2" fill="white" stroke="none" opacity="0.5" />
          <circle cx="25" cy="95" r="1.5" fill="white" stroke="none" opacity="0.4" />
        </g>
      );

    default:
      return null;
  }
}
