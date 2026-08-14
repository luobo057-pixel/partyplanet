import type { GameType } from '@/types';

/**
 * Game tile icon — compact emblem for room list cards.
 *
 * Mirrors the home-page GameIllustration art language (dice / magnifier /
 * lightbulb / chat bubbles) but bolder: thicker strokes + soft white fills,
 * sized to sit inside the 64px gradient tile of a room card.
 */

interface GameTileIconProps {
  gameType: GameType;
  size?: number;
}

export function GameTileIcon({ gameType, size = 40 }: GameTileIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="white"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {renderArt(gameType)}
    </svg>
  );
}

function renderArt(gameType: GameType) {
  switch (gameType) {
    // 骰子 —— 与首页插画同款 5 点布局
    case 'truth-or-dare':
      return (
        <>
          <rect x="8" y="8" width="32" height="32" rx="8" fill="white" fillOpacity="0.12" />
          <circle cx="17" cy="17" r="2.6" fill="white" stroke="none" />
          <circle cx="31" cy="17" r="2.6" fill="white" stroke="none" />
          <circle cx="24" cy="24" r="2.6" fill="white" stroke="none" />
          <circle cx="17" cy="31" r="2.6" fill="white" stroke="none" />
          <circle cx="31" cy="31" r="2.6" fill="white" stroke="none" />
        </>
      );

    // 放大镜 + 镜片星光 —— 侦探意象
    case 'who-is-spy':
      return (
        <>
          <circle cx="21" cy="21" r="11" fill="white" fillOpacity="0.12" />
          <line x1="29.5" y1="29.5" x2="39" y2="39" strokeWidth={3.4} />
          <path
            d="M21 14.5l1.5 3.8 3.8 1.5-3.8 1.5-1.5 3.8-1.5-3.8-3.8-1.5 3.8-1.5z"
            fill="white"
            stroke="none"
          />
        </>
      );

    // 灯泡 + 内部闪电 —— 答题灵感
    case 'quiz':
      return (
        <>
          <path
            d="M24 7c-7.2 0-12 5.2-12 11.4 0 4.4 2.3 7 4.2 9 1.2 1.3 1.8 2.4 1.8 3.8v1.3h12v-1.3c0-1.4.6-2.5 1.8-3.8 1.9-2 4.2-4.6 4.2-9C36 12.2 31.2 7 24 7Z"
            fill="white"
            fillOpacity="0.12"
          />
          <path d="M19 36.5h10" />
          <path d="M20.5 40.5h7" />
          <path
            d="M25.5 13.5 19 23h4.5L22 30.5l6.5-9.5H24z"
            fill="white"
            stroke="none"
          />
        </>
      );

    // 聊天气泡 + 三点 —— 默认聊天房
    case 'none':
      return (
        <>
          <path
            d="M10 14c0-3.3 2.7-6 6-6h16c3.3 0 6 2.7 6 6v10c0 3.3-2.7 6-6 6H22l-7 6 1.5-6H16c-3.3 0-6-2.7-6-6V14Z"
            fill="white"
            fillOpacity="0.12"
          />
          <circle cx="18" cy="19" r="2.1" fill="white" stroke="none" />
          <circle cx="24" cy="19" r="2.1" fill="white" stroke="none" />
          <circle cx="30" cy="19" r="2.1" fill="white" stroke="none" />
        </>
      );

    default:
      return null;
  }
}
