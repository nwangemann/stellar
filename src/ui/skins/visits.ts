/** How often, and as what, an alien drops by in the Starship look. Pure, so it can be tested. */

/** Time between dice rolls while the sky screen is open. */
export const ROLL_MS = 20_000;
/** At 8% per roll, a visit comes about every four minutes on average. */
export const CHANCE = 0.08;
/** Never two visits closer together than this. */
export const COOLDOWN_MS = 120_000;

export const ENTRANCES = ['side', 'ceiling', 'saucer'] as const;
export const SKIN_TONES = ['#B58CFF', '#FFB347', '#FF8FC7', '#8FE3FF'] as const;
export const LINES = [
  'Is this the line for the bathroom?',
  'I parked on your moon. Is that okay?',
  'Take me to your snacks.',
  'Nice telescope. I was in it.',
  'Do you validate parking?',
  'We come in peace. Mostly for pizza.',
  'Have you seen my other eye?',
  'Blorp? Sorry, wrong planet.',
  'Act natural. They are watching. I am they.',
  'Five stars. Would orbit again.',
] as const;

export interface Visit {
  entrance: (typeof ENTRANCES)[number];
  color: (typeof SKIN_TONES)[number];
  eyes: 1 | 2 | 3;
  line: (typeof LINES)[number];
}

type Random = () => number;

const pick = <T>(list: readonly T[], random: Random): T =>
  list[Math.floor(random() * list.length)] as T;

/** `sinceLast` is the time since the previous visit, or Infinity if there was none. */
export const shouldVisit = (sinceLast: number, random: Random = Math.random): boolean =>
  sinceLast >= COOLDOWN_MS && random() < CHANCE;

/** Never repeats the previous line. */
export const pickVisit = (previous?: Visit, random: Random = Math.random): Visit => ({
  entrance: pick(ENTRANCES, random),
  color: pick(SKIN_TONES, random),
  eyes: pick([1, 2, 3] as const, random),
  line: pick(
    LINES.filter((l) => l !== previous?.line),
    random,
  ),
});
