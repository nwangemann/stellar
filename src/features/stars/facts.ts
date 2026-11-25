import { starById } from '@/core/catalog/catalog';

/** Upper B−V limit for each colour. Measured colour is safer than the catalog's spectral type. */
const COLORS: readonly (readonly [number, string])[] = [
  [0, 'blue-white'],
  [0.3, 'white'],
  [0.58, 'yellow-white'],
  [0.81, 'yellow, Sun-like'],
  [1.4, 'orange'],
  [Infinity, 'red'],
];
const colorName = (bv: number) => COLORS.find(([limit]) => bv < limit)![1];
const LIGHT_YEARS_PER_PARSEC = 3.26156;

const significant = (n: number, digits: number) =>
  Number(n.toPrecision(digits)).toLocaleString('en-US', { maximumFractionDigits: 4 });

export interface Fact {
  readonly label: string;
  readonly value: string;
}

/** Facts in order of interest. Unknown values are left out rather than guessed. */
export function starFacts(id: string): Fact[] {
  const s = starById(id);
  if (!s) return [];
  const facts: Fact[] = [{ label: 'Designation', value: s.designation }];
  if (s.distanceParsecs !== null)
    facts.push({
      label: 'Distance',
      value: `${significant(s.distanceParsecs * LIGHT_YEARS_PER_PARSEC, 3)} light-years`,
    });
  if (s.colorIndex !== null) facts.push({ label: 'Color', value: colorName(s.colorIndex) });
  if (s.spectralType) facts.push({ label: 'Spectral type', value: s.spectralType });
  facts.push({ label: 'Brightness', value: `magnitude ${s.magnitude.toFixed(2)}` });
  if (s.luminosity !== null)
    facts.push({ label: 'Visual output', value: `${significant(s.luminosity, 3)} × Sun` });
  if (s.colorIndex !== null)
    facts.push({ label: 'Color index (B−V)', value: s.colorIndex.toFixed(2) });
  facts.push({ label: 'Right ascension', value: `${(s.position.ra / 15).toFixed(3)} h` });
  facts.push({ label: 'Declination', value: `${s.position.dec.toFixed(3)}°` });
  if (s.id.startsWith('hip-')) facts.push({ label: 'Hipparcos number', value: s.id.slice(4) });
  return facts;
}
