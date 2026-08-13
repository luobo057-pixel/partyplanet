import type { NpcPersonality } from '@/types';

/**
 * NPC dialogue templates.
 * Categorized by personality so each NPC has a distinct voice.
 */

const DIALOGUES: Record<NpcPersonality, string[]> = {
  lively: [
    'hahahaha this is killing me',
    'come on new friends, raise your hands!',
    'this round is so intense 🔥',
    'anyone down to play till sunrise?',
    'so crowded in here today~',
    'that last answer was wild',
    "let's go go go!",
    'i\'m a regular here, everyone knows me 😎',
    'welcome newbie! don\'t be shy~',
    'i\'m loving this vibe',
  ],
  gentle: [
    'hey everyone~',
    'take your time, no rush',
    'welcome to the new friend',
    'that was a sweet question',
    'it\'s fun listening to you all',
    'how was everyone\'s day',
    'yeah i feel the same way',
    'don\'t be nervous, take your time',
    'one more round before bed',
    'this song is so nice',
  ],
  funny: [
    'that play was legendary, ngl',
    'i\'m dead lmaooo',
    'bet you five bucks we win this',
    'hidden talent in the chat',
    'oh i know this! ...nvm i don\'t',
    'anyone wanna carry me',
    'i\'m a pro companion (i mean i watch)',
    'chat armor, activate!',
    'who stepped on my mic 😂',
    'this is giving circus energy',
  ],
  shy: [
    '...first time here',
    '*lurking*',
    'um... can i pass',
    '*whispers* hi',
    'i\'m not very good at this...',
    'just watching is fun enough',
    'i... i\'m a bit nervous',
    '*nods*',
    'oh so that\'s how it works',
    'thanks everyone',
  ],
  flirty: [
    'who\'s keeping me company tonight~',
    'that answer was cute',
    'any single cuties here',
    'you melted my heart with that',
    'add me maybe 👀',
    'i like your vibe',
    'late night romance, anyone',
    'pick me pick me!',
    'you\'re quite the talker',
    'the moon is beautiful tonight, and so is this chat',
  ],
};

export function randomDialogue(personality: NpcPersonality): string {
  const pool = DIALOGUES[personality];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function randomAnyDialogue(): string {
  const allPersonalities = Object.keys(DIALOGUES) as NpcPersonality[];
  const p = allPersonalities[Math.floor(Math.random() * allPersonalities.length)];
  return randomDialogue(p);
}
