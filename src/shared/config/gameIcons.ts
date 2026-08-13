import type { IconName } from '@/shared/components/Icon';
import type { GameType } from '@/types';

/**
 * 游戏类型 → SVG 图标映射（全 App 统一引用）
 * 替代之前散落各处的 emoji 映射
 */
export const GAME_ICON_MAP: Record<GameType, IconName> = {
  'truth-or-dare': 'dice',
  quiz: 'brain',
  'who-is-spy': 'spy',
  none: 'chat',
};
