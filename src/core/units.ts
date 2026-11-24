declare const unit: unique symbol;
type Unit<U extends string> = number & { readonly [unit]: U };

/** Branded units: a Degrees can't be passed where Radians is expected. */
export type Degrees = Unit<'deg'>;
export type Radians = Unit<'rad'>;
export type Pixels = Unit<'px'>;

export function deg(n: number): Degrees {
  'worklet';
  return n as Degrees;
}
export function px(n: number): Pixels {
  'worklet';
  return n as Pixels;
}
export function toRad(d: Degrees): Radians {
  'worklet';
  return ((d * Math.PI) / 180) as Radians;
}
export function toDeg(r: Radians): Degrees {
  'worklet';
  return ((r * 180) / Math.PI) as Degrees;
}
/** Wraps an angle into [0, 360). */
export function wrap360(d: Degrees): Degrees {
  'worklet';
  return deg(((d % 360) + 360) % 360);
}
