/**
 * Core domain types
 *
 * Shared vocabulary across feature modules. Defined here to avoid circular deps.
 */

// ============ Avatar ============

export type FaceStyle = 0 | 1 | 2 | 3;
export type HairStyle = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type EyeStyle = 0 | 1 | 2 | 3 | 4 | 5;
export type MouthStyle = 0 | 1 | 2 | 3 | 4;
export type OutfitStyle = 0 | 1 | 2 | 3 | 4 | 5;

/** Avatar config — 2D assembled avatar (placeholder, real avatar system TBD) */
export interface AvatarConfig {
  faceStyle: FaceStyle;
  hairStyle: HairStyle;
  eyeStyle: EyeStyle;
  mouthStyle: MouthStyle;
  outfitStyle: OutfitStyle;
  /** Skin tone index */
  skinTone: number;
  /** Hair color index */
  hairColor: number;
  /** Outfit color index */
  outfitColor: number;
}

// ============ Player ============

export type PlayerId = string;

export interface Player {
  id: PlayerId;
  nickname: string;
  avatar: AvatarConfig;
  /** System NPC (mock data) */
  isNpc?: boolean;
  /** Personality drives NPC dialogue */
  personality?: NpcPersonality;
  /** Player level */
  level?: number;
  /** Coins — common currency (gold) */
  coins?: number;
  /** Gems — premium currency (purple) */
  gems?: number;
  bio?: string;
}

/** NPC personality — affects dialogue templates */
export type NpcPersonality =
  | 'lively'
  | 'gentle'
  | 'funny'
  | 'shy'
  | 'flirty';

// ============ Room ============

export type RoomId = string;

/** Room vibe tag */
export type RoomVibe = 'hot' | 'late-night' | 'icebreak' | 'competitive' | 'chill';

/** Game types supported in a room */
export type GameType = 'truth-or-dare' | 'quiz' | 'who-is-spy' | 'none';

export interface Room {
  id: RoomId;
  name: string;
  /** Current game (none = chat-only room) */
  gameType: GameType;
  vibe: RoomVibe;
  /** Players currently in the room */
  players: Player[];
  /** Max players */
  maxPlayers: number;
  /** Host player id */
  hostId: PlayerId;
  /** Whether a game is in progress */
  isPlaying: boolean;
}

// ============ Chat ============

export type MessageId = string;

export interface ChatMessage {
  id: MessageId;
  roomId: RoomId;
  senderId: PlayerId;
  text: string;
  /** Emoji message (text empty when this is set) */
  emoji?: string;
  createdAt: number;
}
