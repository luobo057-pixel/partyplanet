import type { Player, NpcPersonality, AvatarConfig } from '@/types';

/**
 * NPC database — the "other players" in mock mode.
 * Used for: matching animation, in-room interaction, chat simulation.
 */

const NPC_AVATARS: AvatarConfig[] = [
  { faceStyle: 0, hairStyle: 2, eyeStyle: 1, mouthStyle: 0, outfitStyle: 0, skinTone: 1, hairColor: 5, outfitColor: 0 },
  { faceStyle: 1, hairStyle: 3, eyeStyle: 0, mouthStyle: 2, outfitStyle: 4, skinTone: 2, hairColor: 1, outfitColor: 1 },
  { faceStyle: 2, hairStyle: 1, eyeStyle: 4, mouthStyle: 1, outfitStyle: 5, skinTone: 0, hairColor: 3, outfitColor: 5 },
  { faceStyle: 0, hairStyle: 6, eyeStyle: 2, mouthStyle: 4, outfitStyle: 2, skinTone: 3, hairColor: 0, outfitColor: 2 },
  { faceStyle: 3, hairStyle: 7, eyeStyle: 5, mouthStyle: 3, outfitStyle: 3, skinTone: 1, hairColor: 4, outfitColor: 3 },
  { faceStyle: 1, hairStyle: 4, eyeStyle: 3, mouthStyle: 0, outfitStyle: 1, skinTone: 4, hairColor: 2, outfitColor: 4 },
];

export interface NpcProfile extends Player {
  isNpc: true;
  personality: NpcPersonality;
}

export const NPC_PROFILES: NpcProfile[] = [
  {
    id: 'npc_001',
    nickname: 'Sunny',
    avatar: NPC_AVATARS[0],
    isNpc: true,
    personality: 'lively',
    level: 8,
    coins: 1200,
    gems: 45,
    bio: 'Good vibes only!',
  },
  {
    id: 'npc_002',
    nickname: 'Moonlight',
    avatar: NPC_AVATARS[1],
    isNpc: true,
    personality: 'gentle',
    level: 12,
    coins: 3400,
    gems: 88,
    bio: 'Listening to the rain',
  },
  {
    id: 'npc_003',
    nickname: 'JokerJoe',
    avatar: NPC_AVATARS[2],
    isNpc: true,
    personality: 'funny',
    level: 20,
    coins: 9800,
    gems: 210,
    bio: 'Pro comedian (self-proclaimed)',
  },
  {
    id: 'npc_004',
    nickname: 'Panda',
    avatar: NPC_AVATARS[3],
    isNpc: true,
    personality: 'shy',
    level: 3,
    coins: 120,
    gems: 5,
    bio: 'Mostly lurking',
  },
  {
    id: 'npc_005',
    nickname: 'Peachy',
    avatar: NPC_AVATARS[4],
    isNpc: true,
    personality: 'flirty',
    level: 15,
    coins: 5600,
    gems: 130,
    bio: 'Sweetness overload ⚠️',
  },
  {
    id: 'npc_006',
    nickname: 'Citrus',
    avatar: NPC_AVATARS[5],
    isNpc: true,
    personality: 'funny',
    level: 7,
    coins: 890,
    gems: 22,
    bio: 'Life is hard but I got you',
  },
];

export function getNpcById(id: string): NpcProfile | undefined {
  return NPC_PROFILES.find((n) => n.id === id);
}

export function pickNpcsWithout(n: number, excludeIds: string[] = []): NpcProfile[] {
  const pool = NPC_PROFILES.filter((p) => !excludeIds.includes(p.id));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, shuffled.length));
}
