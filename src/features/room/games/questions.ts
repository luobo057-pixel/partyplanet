/**
 * Truth or Dare question banks + NPC answer banks (English, party tone).
 */

export const TRUTHS: string[] = [
  'What is the most embarrassing song on your playlist?',
  'When was the last time you lied, and what was it?',
  'What is your biggest irrational fear?',
  'Who in this room would you swap lives with for a day?',
  'What is the cringiest thing you have ever posted online?',
  'What is a secret talent nobody here knows about?',
  'What is the longest you have gone without sleeping, and why?',
  'What is your most useless purchase this year?',
  'Which app do you waste the most time on? Be honest.',
  'What is the weirdest compliment you have ever received?',
  'Have you ever broken something and blamed someone else?',
  'What rumor would you start about yourself for fun?',
];

export const DARES: string[] = [
  'Send a voice note singing the chorus of your favorite song.',
  'Speak in an accent for the next two rounds.',
  'Compliment every player in the room, one by one.',
  'Tell us your worst joke and commit to the punchline.',
  'Change your nickname to "Potato" for the rest of the game.',
  'Describe your last meal like a Michelin food critic.',
  'Do ten push-ups... or type "I quit" dramatically.',
  'Confess your biggest red flag in exactly five words.',
  'Roast the player to your right (keep it friendly).',
  'Type your next three messages in ALL CAPS.',
  'Pretend to be the room DJ and hype the next round.',
  'Give a motivational speech about homework in 20 seconds.',
];

/** NPC filler answers by choice */
export const NPC_ANSWERS: Record<'truth' | 'dare', string[]> = {
  truth: [
    'okay fine... my playlist is 80% cartoon theme songs',
    'I once told my boss my cat was sick. the cat was fine. I was not.',
    'my fear? those robots that open doors. why do they NEED doors',
    'I can wiggle my ears. witness me',
    'I bought a $40 candle that smells like nothing. art, probably',
    'honestly? this app. I need help. send me a dare',
  ],
  dare: [
    '*clears throat* THIS BED IS ON FIRE... ok that is all you get',
    'you are all wonderful. ESPECIALLY the quiet one. I see you.',
    'a hor d oeuvre of despair, a symphony of salt... 10/10 would instant noodle again',
    'MY RED FLAG IS I ANSWER QUESTIONS IN FIVE WORDS EXACTLY',
    'potato mode activated. I am root vegetable now',
  ],
};

export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
