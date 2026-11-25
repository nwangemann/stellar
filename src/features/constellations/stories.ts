import { STORIES, type Story } from '@/data/mythology';

export const storiesFor = (constellation: string): readonly Story[] =>
  STORIES.filter((s) => s.constellation === constellation);
