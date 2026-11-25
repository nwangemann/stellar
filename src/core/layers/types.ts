import type { Moment } from '../astro/coordinates';
import type { SkyMark, SkyObject } from '../catalog/types';

export type ModeId = 'identify' | 'constellations' | 'layers';

/** What a lock refers to: usually the object itself, or the figure it belongs to. */
export interface Target {
  readonly kind: SkyObject['kind'] | 'constellation';
  readonly id: string;
  readonly name: string;
}

export interface InfoCard {
  readonly title: string;
  readonly rows: readonly { readonly label: string; readonly value: string }[];
}

/** Every mode implements this. Adding a mode must not require changes to the core. */
export interface LayerPlugin {
  readonly id: ModeId;
  readonly label: string;
  /** Objects to draw as points. */
  draw(marks: readonly SkyMark[]): readonly SkyMark[];
  /** Pairs of objects to join with lines. */
  lines(marks: readonly SkyMark[]): readonly (readonly [SkyMark, SkyMark])[];
  /** Whether the reticle may lock on to the object while it is above the horizon. */
  selects(object: SkyObject): boolean;
  target(object: SkyObject): Target;
  card(object: SkyObject, moment: Moment): InfoCard;
}
