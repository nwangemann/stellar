import type { Target } from '@/core/layers/types';

const DETAILS = {
  star: '/star/[id]',
  body: '/body/[id]',
  constellation: '/constellation/[id]',
} as const;

type Details = Pick<Target, 'kind' | 'id'> & { kind: keyof typeof DETAILS };

/** Whether the target has a details screen. Satellites get theirs in backlog step 10.4. */
export const hasDetails = (t: Pick<Target, 'kind' | 'id'>): t is Details => t.kind in DETAILS;

/** The route to an object's details. `at` is the time the sky shows, if not the present. */
export function detailsRoute({ kind, id }: Details, at?: string) {
  return { pathname: DETAILS[kind], params: at ? { id, at } : { id } };
}
