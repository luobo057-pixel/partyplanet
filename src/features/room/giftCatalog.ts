/**
 * In-room gift catalog.
 *
 * Three tiers, each with a distinct send effect:
 * - normal:  floating bubbles above the input bar (light, cheap)
 * - room:    emoji confetti raining across the game stage
 * - global:  full-screen announcement takeover
 */

export type GiftTier = 'normal' | 'room' | 'global';

export interface GiftItem {
  id: string;
  name: string;
  emoji: string;
  tier: GiftTier;
  /** Price in coins */
  price: number;
}

export const GIFT_TIER_LABELS: Record<GiftTier, string> = {
  normal: 'Normal',
  room: 'Room FX',
  global: 'Announcement',
};

export const GIFT_CATALOG: GiftItem[] = [
  // Normal — light effects
  { id: 'rose', name: 'Rose', emoji: '🌹', tier: 'normal', price: 10 },
  { id: 'lollipop', name: 'Lollipop', emoji: '🍭', tier: 'normal', price: 20 },
  { id: 'cake', name: 'Cake', emoji: '🎂', tier: 'normal', price: 50 },
  // Room FX — stage-wide effects
  { id: 'fireworks', name: 'Fireworks', emoji: '🎆', tier: 'room', price: 120 },
  { id: 'heart-rain', name: 'Heart Rain', emoji: '💖', tier: 'room', price: 200 },
  { id: 'rocket', name: 'Rocket', emoji: '🚀', tier: 'room', price: 300 },
  // Announcement — full-screen takeover
  { id: 'castle', name: 'Castle', emoji: '🏰', tier: 'global', price: 480 },
  { id: 'crown', name: 'Crown', emoji: '👑', tier: 'global', price: 560 },
  { id: 'galaxy', name: 'Galaxy', emoji: '🌌', tier: 'global', price: 999 },
];
