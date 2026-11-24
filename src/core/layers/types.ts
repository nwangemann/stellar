import type { SkyObject } from '../catalog/mockSky';

export type ModeId = 'identify' | 'constellations' | 'layers';

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
  card(object: SkyObject): InfoCard;
}
