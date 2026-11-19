import test from 'node:test';
import assert from 'node:assert/strict';
import { copyTextSafely, createResettableTimer } from './clipboard.ts';

test('copyTextSafely resolves cleanly on success, missing clipboard, or rejection', async () => {
  let written = '';
  const ok = await copyTextSafely('danieltheo.73@gmail.com', {
    async writeText(val) {
      written = val;
    },
  });
  assert.equal(ok, true);
  assert.equal(written, 'danieltheo.73@gmail.com');

  assert.equal(await copyTextSafely('x', undefined), false);
  const failed = await copyTextSafely('x', {
    async writeText() {
      throw new Error('NotAllowedError');
    },
  });
  assert.equal(failed, false);
});

test('createResettableTimer resets expiration window on rapid repeated triggers', async () => {
  let expiredCount = 0;
  const timer = createResettableTimer(40, () => {
    expiredCount += 1;
  });
  timer.trigger();
  await new Promise((r) => setTimeout(r, 20));
  timer.trigger();
  await new Promise((r) => setTimeout(r, 25));
  assert.equal(expiredCount, 0, 'Should still be active after reset');
  await new Promise((r) => setTimeout(r, 30));
  assert.equal(expiredCount, 1, 'Should expire exactly once after extended window');
  timer.cancel();
});
