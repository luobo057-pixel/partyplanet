/**
 * Profile domain types.
 *
 * Covers: social relations, stats, posts, honors (gifts + achievements), assets.
 * All mock for MVP.
 */

import type { GameType } from './index';

// ============ Tab: Stats (战绩) ============

export interface GameStat {
  gameType: GameType;
  totalGames: number;
  wins: number;
  /** Rank points / ELO */
  rankPoints: number;
  /** Tier name */
  tier: string;
  /** Best streak */
  bestStreak: number;
}

// ============ Tab: Posts (动态) ============

export interface Post {
  id: string;
  text: string;
  /** ISO date string */
  createdAt: string;
  likes: number;
  comments: number;
  /** Optional image emoji */
  emoji?: string;
}

// ============ Tab: Honors (荣誉) ============

/** Gift in the gift wall */
export interface Gift {
  id: string;
  name: string;
  /** Emoji placeholder (or icon name in the future) */
  emoji: string;
  /** Count received */
  count: number;
  /** Sender nickname of the most recent */
  lastFrom?: string;
  /** Gift star value (礼物之星) */
  stars: number;
}

/** Achievement / title */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  /** Icon emoji */
  emoji: string;
  /** When earned (ISO), undefined = locked */
  earnedAt?: string;
  /** Rarity color */
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// ============ Tab: Assets (资产) ============

export type AssetCategory = 'avatar-frame' | 'theme' | 'prop' | 'emoji-pack' | 'ride';

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  emoji: string;
  /** Whether currently equipped */
  equipped?: boolean;
  /** Days remaining (for time-limited) */
  daysLeft?: number;
  /** Rarity */
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
