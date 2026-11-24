import { LOCK_MS, stepLock, UNLOCKED } from './lock';

test('locks after the dwell time, not before', () => {
  const a = stepLock(UNLOCKED, 'x', 1000);
  expect(stepLock(a, 'x', 1000 + LOCK_MS - 1).lockedId).toBeNull();
  expect(stepLock(a, 'x', 1000 + LOCK_MS).lockedId).toBe('x');
});
test('switching target restarts the dwell', () => {
  const a = stepLock(stepLock(UNLOCKED, 'x', 0), 'y', 399);
  expect(stepLock(a, 'y', 500).lockedId).toBeNull();
});
test('losing the target unlocks', () => {
  expect(stepLock({ candidateId: 'x', since: 0, lockedId: 'x' }, null, 900).lockedId).toBeNull();
});
