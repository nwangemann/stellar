import type { RaDec } from '../astro/coordinates';
import { deg, toRad } from '../units';

/** Flattens a figure around its centre, north up and east left, scaled to fit a box. */
export function fitFigure(
  positions: readonly RaDec[],
  width: number,
  height: number,
  padding: number,
): { x: number; y: number }[] {
  if (positions.length === 0) return [];
  const vectors = positions.map((p) => {
    const ra = toRad(p.ra);
    const dec = toRad(p.dec);
    return [Math.cos(dec) * Math.cos(ra), Math.cos(dec) * Math.sin(ra), Math.sin(dec)] as const;
  });
  const sum = (i: 0 | 1 | 2) => vectors.reduce((a, v) => a + v[i], 0);
  const ra0 = Math.atan2(sum(1), sum(0));
  const dec0 = Math.atan2(sum(2), Math.hypot(sum(0), sum(1)));
  // Lambert azimuthal equal-area, which stays finite for very large figures.
  const flat = positions.map((p) => {
    const dRa = toRad(p.ra) - ra0;
    const dec = toRad(p.dec);
    const cos = Math.sin(dec0) * Math.sin(dec) + Math.cos(dec0) * Math.cos(dec) * Math.cos(dRa);
    const k = Math.sqrt(2 / Math.max(1e-6, 1 + cos));
    return {
      x: -k * Math.cos(dec) * Math.sin(dRa),
      y: -k * (Math.cos(dec0) * Math.sin(dec) - Math.sin(dec0) * Math.cos(dec) * Math.cos(dRa)),
    };
  });
  const xs = flat.map((p) => p.x);
  const ys = flat.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const spanX = Math.max(...xs) - minX;
  const spanY = Math.max(...ys) - minY;
  const tiny = toRad(deg(0.01));
  const scale = Math.min(
    (width - 2 * padding) / Math.max(spanX, tiny),
    (height - 2 * padding) / Math.max(spanY, tiny),
  );
  return flat.map((p) => ({
    x: width / 2 + (p.x - minX - spanX / 2) * scale,
    y: height / 2 + (p.y - minY - spanY / 2) * scale,
  }));
}
