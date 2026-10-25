import test from 'node:test';
import assert from 'node:assert/strict';
import { parallaxShift, sectionLift, dampMotion } from '../src/parallax.js';

test('parallax keeps moving across the entire visible journey within image overscan', () => {
  const start=parallaxShift(185,700,900,252);
  const scrolled=parallaxShift(-165,700,900,252);
  assert.ok(scrolled-start>100);
  assert.ok(parallaxShift(-550,700,900,252) > parallaxShift(-350,700,900,252), 'must not plateau before the photo leaves the viewport');
  assert.equal(parallaxShift(900,700,900,252),-252);
  assert.equal(parallaxShift(-700,700,900,252),252);
  assert.equal(parallaxShift(-2000,700,900,252),252);
  assert.equal(parallaxShift(2000,700,900,252),-252);
});

test('section entrances follow scroll position, settle for reading and reverse consistently', () => {
  assert.equal(sectionLift(1000,1000,76),76);
  assert.ok(sectionLift(800,1000,76) > sectionLift(600,1000,76));
  assert.equal(sectionLift(350,1000,76),0);
  assert.equal(sectionLift(-500,1000,76),0);
});

test('scroll damping responds smoothly, converges and is independent of frame rate', () => {
  assert.ok(dampMotion(0,200,16)>0&&dampMotion(0,200,16)<200);
  let fast=0,slow=0;
  for(let i=0;i<60;i++)fast=dampMotion(fast,200,1000/60);
  for(let i=0;i<30;i++)slow=dampMotion(slow,200,1000/30);
  assert.equal(fast,200);
  assert.equal(slow,200);
  assert.ok(dampMotion(200,-200,16)<200);
});
