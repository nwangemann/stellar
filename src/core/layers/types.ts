import type { SkyObject } from '../catalog/types';

export type ModeId = 'identify' | 'constellations' | 'layers';

/** What a lock refers to: usually the star itself, or the figure it belongs to. */
export interface Target {
  readonly kind: 'star' | 'constellation';
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
  draw(sky: readonly SkyObject[]): readonly SkyObject[];
  /** Pairs of objects to join with lines. */
  lines(sky: readonly SkyObject[]): readonly (readonly [SkyObject, SkyObject])[];
  /** Objects the reticle may lock on to. */
  selectable(sky: readonly SkyObject[]): readonly SkyObject[];
  target(object: SkyObject): Target;
  card(object: SkyObject): InfoCard;
}
