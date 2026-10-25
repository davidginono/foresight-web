import test from 'node:test';
import assert from 'node:assert/strict';
import { loadImage } from '../src/loadImage.js';

test('critical image readiness waits for decoding, including cached images', async () => {
  let decoded;
  const decoding = new Promise(resolve => { decoded = resolve; });
  const image = { complete: true, naturalWidth: 1200, decode: () => decoding };
  let finished = false;
  const ready = loadImage('/photo.webp', { createImage: () => image }).then(value => { finished = true; return value; });
  await Promise.resolve();
  assert.equal(finished, false);
  decoded();
  assert.equal(await ready, true);
  assert.equal(image.onload, null);
});

test('network errors, decoding errors and stalled downloads release the page loader', async () => {
  const failed = { complete: false, naturalWidth: 0 };
  const network = loadImage('/missing.webp', { createImage: () => failed });
  failed.onerror();
  assert.equal(await network, false);
  assert.equal(await loadImage('/corrupt.webp', { createImage: () => ({ complete: true, naturalWidth: 10, decode: async () => { throw new Error('decode'); } }) }), false);
  const stalled = { complete: false };
  assert.equal(await loadImage('/slow.webp', { createImage: () => stalled, timeoutMs: 5 }), false);
  assert.equal(stalled.onload, null);
});

test('canceled navigation releases critical-image waits and ignores late completion', async () => {
  const controller = new AbortController();
  const image = { complete: false, naturalWidth: 1200 };
  const ready = loadImage('/photo.webp', { signal: controller.signal, createImage: () => image });
  const lateLoad = image.onload;
  controller.abort();
  assert.equal(await ready, false);
  await lateLoad();
  assert.equal(image.onload, null);
  assert.equal(await loadImage('/photo.webp', { signal: controller.signal, createImage: () => { throw new Error('should not start'); } }), false);
});
