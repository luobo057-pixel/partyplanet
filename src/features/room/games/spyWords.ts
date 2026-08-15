/**
 * Who-is-Spy word bank.
 *
 * Each pair: civilians share one word, the spy gets the other.
 * hints describe the civilian word without saying it; the spy only
 * has vague lines to blend in.
 */

export interface SpyPair {
  civilian: string;
  spy: string;
  hints: string[];
}

/** Vague lines the spy uses to survive */
export const SPY_VAGUE = [
  'everyone knows this one',
  'pretty common, honestly',
  'I use it sometimes... it is nice',
  'you see it everywhere',
  'classic. never gets old',
  'depends on the person honestly',
];

export const SPY_PAIRS: SpyPair[] = [
  {
    civilian: 'coffee',
    spy: 'tea',
    hints: ['beans make it', 'you drink it to wake up', 'bitter unless you add milk'],
  },
  {
    civilian: 'cat',
    spy: 'dog',
    hints: ['it purrs', 'nine lives, they say', 'small and refuses commands'],
  },
  {
    civilian: 'summer',
    spy: 'winter',
    hints: ['school break season', 'you sweat in it', 'ice cream weather'],
  },
  {
    civilian: 'pizza',
    spy: 'burger',
    hints: ['round and sliced', 'cheese is the soul', 'born in Italy'],
  },
  {
    civilian: 'beach',
    spy: 'pool',
    hints: ['sand everywhere', 'waves crash there', 'bring sunscreen'],
  },
  {
    civilian: 'movie',
    spy: 'series',
    hints: ['about two hours long', 'you watch it in one sitting', 'popcorn partner'],
  },
  {
    civilian: 'sun',
    spy: 'moon',
    hints: ['it rises in the east', 'wear sunglasses for it', 'it sets in the evening'],
  },
  {
    civilian: 'book',
    spy: 'magazine',
    hints: ['chapters and pages', 'you read it for days', 'has a cover and a spine'],
  },
  {
    civilian: 'rain',
    spy: 'snow',
    hints: ['umbrella weather', 'clouds cry it', 'puddles after it'],
  },
  {
    civilian: 'phone',
    spy: 'tablet',
    hints: ['fits in your pocket', 'you charge it nightly', 'you are holding it too much'],
  },
];

export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
