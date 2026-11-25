import type { Target } from '@/core/layers/types';

const DETAILS = {
  star: '/star/[id]',
  body: '/body/[id]',
  constellation: '/constellation/[id]',
} as const;

/** The route to an object's details. `at` is the time the sky shows, if not the present. */
export function detailsRoute({ kind, id }: Pick<Target, 'kind' | 'id'>, at?: string) {
  return { pathname: DETAILS[kind], params: at ? { id, at } : { id } };
}
