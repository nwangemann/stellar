import type { SkinId } from '../tokens/tokens';

const NOISE = `
uniform float2 res;
uniform float time;
uniform float3 look;   // sin(az), cos(az), altitude in radians
uniform float decor;   // 1 away from the sky screen, where invented stars cannot mislead
float hash(float2 p) { p = fract(p * float2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(float2 p) {
  float2 i = floor(p); float2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + float2(1, 0)), f.x), mix(hash(i + float2(0, 1)), hash(i + float2(1, 1)), f.x), f.y);
}
float fbm(float2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 17.0; a *= 0.5; }
  return v;
}
`;

const STARSHIP = `${NOISE}
half4 main(float2 p) {
  float2 uv = p / res.x;
  float2 q = uv * 1.8 + float2(look.x, look.y * 0.5 - look.z) * 0.9;
  float a = fbm(q + time * 0.015);
  float b = fbm(q * 1.4 + a * 1.6 - time * 0.02);
  float3 c = float3(0.027, 0.008, 0.10);
  c += float3(0.40, 0.10, 0.75) * smoothstep(0.35, 0.85, a) * 0.8;
  c += float3(0.95, 0.15, 0.60) * smoothstep(0.50, 0.95, b) * 0.65;
  c += float3(0.05, 0.75, 0.62) * smoothstep(0.50, 0.90, a * b * 2.2) * 0.45;
  if (decor > 0.5) {
    float2 g = uv * 34.0; float2 cell = floor(g);
    float h = hash(cell);
    float d = length(fract(g) - 0.5 - (float2(hash(cell + 7.1), hash(cell + 3.7)) - 0.5) * 0.7);
    c += step(0.86, h) * smoothstep(0.13, 0.0, d) * (0.55 + 0.45 * sin(time * 2.0 + h * 90.0));
    float2 o = uv - float2(0.84, res.y / res.x - 0.22);
    float r = 0.19; float l = length(o);
    float3 planet = mix(float3(0.16, 0.85, 0.66), float3(0.98, 0.42, 0.72), smoothstep(-0.2, 0.2, o.y + 0.03 * sin(o.x * 22.0 + time * 0.3)));
    planet *= 0.75 + 0.25 * step(0.0, sin(o.y * 70.0 + o.x * 12.0));
    planet *= smoothstep(0.30, 0.02, length(o + float2(0.07, 0.07)));
    c += float3(0.30, 0.75, 0.70) * 0.5 * smoothstep(0.34, 0.15, l);
    c = mix(c, planet, smoothstep(r, r - 0.006, l));
    float ring = length(float2(o.x + o.y * 0.35, (o.y - o.x * 0.35) * 3.4));
    float band = smoothstep(0.27, 0.28, ring) * smoothstep(0.36, 0.35, ring);
    float front = max(step(r, l), step(0.0, o.y - o.x * 0.35));
    c = mix(c, float3(1.0, 0.86, 0.45), band * front * 0.85);
    c *= 0.85;
  } else { c *= 0.72; }
  return half4(half3(c), 1.0);
}`;

const GLASS = `${NOISE}
float soft(float2 p) { return noise(p) * 0.65 + noise(p * 2.1 + 9.0) * 0.28 + noise(p * 4.3 + 3.0) * 0.07; }
float height(float2 q) {
  float2 w = float2(soft(q + time * 0.05), soft(q + 5.2 - time * 0.04));
  return soft(q * 0.9 + w * 1.7);
}
half4 main(float2 p) {
  float2 uv = p / res.x;
  float2 q = uv * 2.1 + float2(look.x, look.y * 0.5 - look.z) * 0.9;
  float h = height(q);
  float2 e = float2(0.03, 0.0);
  float3 n = normalize(float3(h - height(q + e.xy), h - height(q + e.yx), 0.024));
  // A studio reflected in liquid metal: dark floor, bright horizon, cool sky.
  float v = n.y * 0.9 + n.x * 0.35;
  float3 c = mix(float3(0.01, 0.015, 0.03), float3(0.10, 0.13, 0.19), smoothstep(-0.9, 0.0, v));
  c = mix(c, float3(0.36, 0.43, 0.56), smoothstep(0.05, 0.55, v));
  c += float3(0.95, 0.98, 1.0) * smoothstep(0.50, 0.60, v) * smoothstep(0.82, 0.64, v);
  c += float3(0.75, 0.85, 1.0) * smoothstep(-0.50, -0.44, v) * smoothstep(-0.34, -0.42, v) * 0.55;
  float3 rainbow = 0.5 + 0.5 * cos(6.2831 * (n.x * 1.3 + h * 1.6 + float3(0.0, 0.33, 0.67)));
  c += rainbow * pow(1.0 - n.z, 1.5) * 0.38;
  // On the sky screen the chrome is only a hint, so the stars stay in charge.
  c = mix(float3(0.043, 0.059, 0.086) * 0.7 + min(c, float3(0.5)) * 0.06, c * 0.52, decor);
  return half4(half3(c), 1.0);
}`;

const NEEDLEPOINT = `${NOISE}
half4 main(float2 p) {
  float2 g = p / 3.2; float2 cell = floor(g); float2 f = fract(g) - 0.5;
  float over = mod(cell.x + cell.y, 2.0);
  float across = mix(f.x, f.y, over);
  float along = mix(f.y, f.x, over);
  float t = 1.0 - across * across * 1.5 - along * along * 0.5;
  float slub = noise(float2(p.x * 0.02, p.y * 0.5)) * 0.5 + noise(float2(p.x * 0.5, p.y * 0.02)) * 0.5;
  float3 c = float3(0.955, 0.910, 0.815) * (0.86 + 0.12 * t) * (0.955 + 0.09 * slub);
  return half4(half3(c), 1.0);
}`;

export const SHADERS: Partial<Record<SkinId, { source: string; animated: boolean }>> = {
  starship: { source: STARSHIP, animated: true },
  glass: { source: GLASS, animated: true },
  needlepoint: { source: NEEDLEPOINT, animated: false },
};
