// Rebuilds src/data/*.json from downloaded sources. See docs/data-sources.md.
// Usage: node scripts/build-catalog.mjs <dir with hyg/, sc/ and api/>
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';

const dir = process.argv[2];
if (!dir) throw new Error('Pass the source directory');
const json = (p) => JSON.parse(readFileSync(join(dir, p), 'utf8'));
const MAG_LIMIT = 6;

function parseCsv(text) {
  const rows = text
    .trim()
    .split(/\r?\n/)
    .map((line) =>
      [...line.matchAll(/("(?:[^"]|"")*"|[^,]*)(?:,|$)/g)].map((m) =>
        m[1].replace(/^"|"$/g, '').replaceAll('""', '"'),
      ),
    );
  const head = rows.shift();
  return rows.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}

const GREEK = Object.fromEntries(
  'Alp α Bet β Gam γ Del δ Eps ε Zet ζ Eta η The θ Iot ι Kap κ Lam λ Mu μ Nu ν Xi ξ Omi ο Pi π Rho ρ Sig σ Tau τ Ups υ Phi φ Chi χ Psi ψ Ome ω'
    .split(' ')
    .reduce((a, x, i, all) => (i % 2 ? a : [...a, [x, all[i + 1]]]), []),
);
function designation(r) {
  if (r.bayer) {
    const [letter, n] = r.bayer.split('-');
    return `${GREEK[letter] ?? letter}${n ? ('⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(n)] ?? n) : ''} ${r.con}`;
  }
  if (r.flam) return `${r.flam} ${r.con}`;
  if (r.hd) return `HD ${r.hd}`;
  return r.hip ? `HIP ${r.hip}` : `HYG ${r.id}`;
}

const cultures = ['western', 'boorong', 'blackfoot', 'chinese', 'hawaiian_starlines'].concat(
  'indian maori mongolian norse sami'.split(' '),
);
const figures = {};
const constellations = [];
for (const culture of cultures) {
  for (const c of json(`sc/${culture}/index.json`).constellations) {
    const lines = (c.lines ?? []).map((l) => l.filter(Number.isInteger));
    if (culture === 'western')
      constellations.push({
        id: c.iau,
        name: c.common_name.native,
        english: c.common_name.english,
        lines,
      });
    else figures[c.id.replace(/^CON /, '')] = lines;
  }
}
// Only the culture figures that a story uses are bundled.
const stories = readFileSync('src/data/mythology.ts', 'utf8');
const usedIds = new Set([...stories.matchAll(/figure: '([^']+)'/g)].map((m) => m[1]));
for (const id of usedIds) if (!figures[id]) throw new Error(`Unknown figure ${id}`);
for (const id of Object.keys(figures)) if (!usedIds.has(id)) delete figures[id];
constellations.push({
  id: 'Ple',
  name: 'Pleiades',
  english: 'Seven Sisters (star cluster)',
  lines: figures['indian N03'],
});
constellations.sort((a, b) => a.name.localeCompare(b.name));

const needed = new Set(
  [...constellations.flatMap((c) => c.lines), ...Object.values(figures).flat()].flat(),
);
const rows = parseCsv(gunzipSync(readFileSync(join(dir, 'hyg/hyg_v44.csv.gz'))).toString('utf8'));
const num = (s, digits) => (s === '' || s === undefined ? null : Number(Number(s).toFixed(digits)));
const stars = rows
  .filter((r) => r.id !== '0' && (Number(r.mag) <= MAG_LIMIT || needed.has(Number(r.hip))))
  .map((r) => [
    r.hip ? `hip-${r.hip}` : `hyg-${r.id}`,
    r.proper || designation(r),
    designation(r),
    num(String(Number(r.ra) * 15), 5),
    num(r.dec, 5),
    num(r.mag, 2),
    // HYG uses 100000 parsecs for a missing or unreliable distance.
    Number(r.dist) >= 100000 ? null : num(r.dist, 2),
    r.spect || null,
    num(r.ci, 2),
    Number(r.dist) >= 100000 ? null : num(r.lum, 3),
    r.con || null,
  ])
  .sort((a, b) => a[5] - b[5]);
const ids = new Set(stars.map((s) => s[0]));
for (const h of needed) if (!ids.has(`hip-${h}`)) throw new Error(`Line star HIP ${h} is missing`);

// Title matches that are about an instrument, a code, a place or a moving group.
const NOT_THE_STAR =
  /ANTARES|POLLUX :|Pollux on LUVOIR|MImOSA|Observatory, Merak|Moving Group|stellar kinematic groups|high proper-motion stars/;
const byName = new Map(stars.map((s) => [s[1], s[0]]));
const papers = {};
for (const [name, list] of Object.entries(json('api/papers.json'))) {
  const good = list.filter((p) => !NOT_THE_STAR.test(p.title));
  if (good.length && byName.has(name))
    papers[byName.get(name)] = good.map((p) => ({
      ...p,
      title: p.title.replaceAll('$', ''),
    }));
}
const planets = {};
for (const p of json('api/planets.json')) {
  const id = `hip-${/\d+/.exec(p.hip_name)[0]}`;
  if (!ids.has(id)) continue;
  (planets[id] ??= []).push({
    name: p.pl_name,
    year: p.disc_year,
    method: p.discoverymethod,
    periodDays: p.pl_orbper,
  });
}
const save = (name, data) => writeFileSync(`src/data/${name}.json`, JSON.stringify(data) + '\n');
save('stars', stars);
save('constellations', constellations);
save('figures', figures);
save('papers', papers);
save('planets', planets);
console.log({
  stars: stars.length,
  constellations: constellations.length,
  figures: usedIds.size,
  papers: Object.keys(papers).length,
  planets: Object.keys(planets).length,
});
