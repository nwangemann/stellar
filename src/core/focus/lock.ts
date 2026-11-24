export const LOCK_MS = 400;

export interface LockState {
  readonly candidateId: string | null;
  readonly since: number;
  readonly lockedId: string | null;
}

export const UNLOCKED: LockState = { candidateId: null, since: 0, lockedId: null };

/** A target must stay under the reticle for LOCK_MS before it locks. */
export function stepLock(state: LockState, candidateId: string | null, now: number): LockState {
  'worklet';
  if (candidateId === null) return { candidateId: null, since: 0, lockedId: null };
  if (candidateId !== state.candidateId) return { candidateId, since: now, lockedId: null };
  if (state.lockedId === null && now - state.since >= LOCK_MS) {
    return { candidateId, since: state.since, lockedId: candidateId };
  }
  return state;
}
