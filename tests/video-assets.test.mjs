import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { htmlToDOM } from 'html-react-parser';
import { youtubeId } from '../src/videoSource.js';
import { parallaxShift, sectionLift, dampMotion } from '../src/parallax.js';

test('captured video widgets have valid original YouTube IDs and local poster assets', () => {
  const sources = JSON.parse(fs.readFileSync(new URL('../src/videoSources.json',import.meta.url)));
  const index = JSON.parse(fs.readFileSync(new URL('../src/content/index.json',import.meta.url)));
  let count = 0;
  for (const entry of index) {
    const page = JSON.parse(fs.readFileSync(new URL(`../src/content/${entry.file}.json`,import.meta.url)));
    function walk(nodes) {
      for (const node of nodes) {
        if (node.attribs?.['data-widget_type'] === 'video.default') {
          const id = youtubeId(JSON.parse(node.attribs['data-settings']).youtube_url);
          assert.ok(id,entry.path); assert.ok(sources[id],id);
          assert.equal(youtubeId(sources[id].url),id);
          assert.ok(fs.existsSync(new URL('../public'+sources[id].poster,import.meta.url)),id);
          count++;
        }
        if (node.children) walk(node.children);
      }
    }
    walk(htmlToDOM(page.html));
  }
  assert.equal(count,3);
});

test('video parsing accepts supported YouTube URLs and rejects unrelated or malformed inputs', () => {
  for (const url of ['https://youtu.be/9R3i_w-DFZw','https://www.youtube.com/watch?v=9R3i_w-DFZw','https://www.youtube.com/embed/9R3i_w-DFZw']) assert.equal(youtubeId(url),'9R3i_w-DFZw');
  for (const url of ['https://example.com/watch?v=9R3i_w-DFZw','javascript:alert(1)','https://youtu.be/invalid','not a URL']) assert.equal(youtubeId(url),null);
});

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
