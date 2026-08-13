import type {
  GameStat,
  Post,
  Gift,
  Achievement,
  Asset,
} from '@/types/profile';

/**
 * Mock profile data for the current player.
 */

// ============ Stats ============

export const MOCK_STATS: GameStat[] = [
  {
    gameType: 'truth-or-dare',
    totalGames: 86,
    wins: 52,
    rankPoints: 1840,
    tier: 'Gold III',
    bestStreak: 7,
  },
  {
    gameType: 'who-is-spy',
    totalGames: 64,
    wins: 41,
    rankPoints: 2100,
    tier: 'Platinum I',
    bestStreak: 9,
  },
  {
    gameType: 'quiz',
    totalGames: 38,
    wins: 18,
    rankPoints: 1450,
    tier: 'Silver II',
    bestStreak: 4,
  },
];

// ============ Posts ============

export const MOCK_POSTS: Post[] = [
  {
    id: 'post_1',
    text: 'Just had an epic Truth or Dare night! Met so many fun people 🎉',
    createdAt: '2026-08-10T22:30:00Z',
    likes: 24,
    comments: 6,
    emoji: '🎲',
  },
  {
    id: 'post_2',
    text: 'Hit Platinum I in Spy today! Grind pays off 💪',
    createdAt: '2026-08-09T18:12:00Z',
    likes: 51,
    comments: 12,
    emoji: '🕵️',
  },
  {
    id: 'post_3',
    text: 'Anyone down for late-night chat? Cozy Corner is open~',
    createdAt: '2026-08-08T01:45:00Z',
    likes: 8,
    comments: 2,
  },
];

// ============ Honors: gifts ============

export const MOCK_GIFTS: Gift[] = [
  { id: 'g1', name: 'Rose', emoji: '🌹', count: 142, lastFrom: 'Peachy', stars: 1420 },
  { id: 'g2', name: 'Crown', emoji: '👑', count: 38, lastFrom: 'Moonlight', stars: 1900 },
  { id: 'g3', name: 'Rocket', emoji: '🚀', count: 27, lastFrom: 'JokerJoe', stars: 1620 },
  { id: 'g4', name: 'Cake', emoji: '🎂', count: 19, lastFrom: 'Sunny', stars: 570 },
  { id: 'g5', name: 'Diamond', emoji: '💎', count: 8, lastFrom: 'Citrus', stars: 2400 },
  { id: 'g6', name: 'Lollipop', emoji: '🍭', count: 64, lastFrom: 'Panda', stars: 320 },
  { id: 'g7', name: 'Castle', emoji: '🏰', count: 3, lastFrom: 'Moonlight', stars: 3000 },
  { id: 'g8', name: 'Fireworks', emoji: '🎆', count: 22, lastFrom: 'Sunny', stars: 1100 },
];

/** Total gift stars (礼物之星) — derived metric */
export const TOTAL_GIFT_STARS = MOCK_GIFTS.reduce((sum, g) => sum + g.stars, 0);

// ============ Honors: achievements ============

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'a1',
    title: 'Icebreaker',
    description: 'Played 50 Truth or Dare games',
    emoji: '🎲',
    earnedAt: '2026-07-15',
    rarity: 'rare',
  },
  {
    id: 'a2',
    title: 'Spy Master',
    description: 'Reach Platinum tier in Who is Spy',
    emoji: '🕵️',
    earnedAt: '2026-08-09',
    rarity: 'epic',
  },
  {
    id: 'a3',
    title: 'Social Butterfly',
    description: 'Make 100 friends',
    emoji: '🦋',
    earnedAt: '2026-06-20',
    rarity: 'rare',
  },
  {
    id: 'a4',
    title: 'Night Owl',
    description: 'Play between 2AM-5AM for 7 days',
    emoji: '🦉',
    earnedAt: '2026-07-30',
    rarity: 'common',
  },
  {
    id: 'a5',
    title: 'Legend',
    description: 'Reach Diamond tier in any game',
    emoji: '💎',
    rarity: 'legendary',
    // earnedAt undefined = locked
  },
  {
    id: 'a6',
    title: 'Gift Magnate',
    description: 'Receive 5000 gift stars',
    emoji: '⭐',
    rarity: 'epic',
  },
];

// ============ Assets ============

export const MOCK_ASSETS: Asset[] = [
  {
    id: 'as1',
    name: 'Golden Frame',
    category: 'avatar-frame',
    emoji: '🖼️',
    equipped: true,
    rarity: 'rare',
  },
  {
    id: 'as2',
    name: 'Ocean Theme',
    category: 'theme',
    emoji: '🌊',
    daysLeft: 12,
    rarity: 'epic',
  },
  {
    id: 'as3',
    name: 'Confetti Pop',
    category: 'prop',
    emoji: '🎉',
    rarity: 'common',
  },
  {
    id: 'as4',
    name: 'Cat Emoji Pack',
    category: 'emoji-pack',
    emoji: '🐱',
    rarity: 'rare',
  },
  {
    id: 'as5',
    name: 'Phoenix Ride',
    category: 'ride',
    emoji: '🔥',
    daysLeft: 3,
    rarity: 'legendary',
  },
  {
    id: 'as6',
    name: 'Silver Frame',
    category: 'avatar-frame',
    emoji: '⚜️',
    rarity: 'common',
  },
];
