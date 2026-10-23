import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { htmlToDOM } from 'html-react-parser';
import { imagePlaceholder } from '../src/imagePlaceholder.js';

test('local raster images, including captured data-src images, have reservable dimensions', () => {
  const dimensions=JSON.parse(fs.readFileSync(new URL('../src/imageDimensions.json',import.meta.url)));
  const entries=JSON.parse(fs.readFileSync(new URL('../src/content/index.json',import.meta.url)));
  for (const entry of entries) {
    const page=JSON.parse(fs.readFileSync(new URL(`../src/content/${entry.file}.json`,import.meta.url)));
    function walk(nodes) {
      for (const node of nodes) {
        const source=node.name==='img' ? node.attribs.src || node.attribs['data-src'] : node.attribs?.['data-thumbnail'];
        if (source?.match(/\.(png|jpe?g|webp|gif)$/i)) {
          assert.ok(fs.existsSync(new URL('../public'+source,import.meta.url)),source);
          assert.ok(dimensions[source]?.every(n=>Number.isFinite(n)&&n>0),source);
        }
        if (node.children) walk(node.children);
      }
    }
    walk(htmlToDOM(page.html));
  }
});

test('loading and unavailable artwork retain the source aspect ratio without a network dependency', () => {
  for (const failed of [false,true]) {
    const uri=imagePlaceholder(1200,800,failed);
    assert.ok(uri.startsWith('data:image/svg+xml;'));
    const svg=decodeURIComponent(uri.split(',')[1]);
    assert.match(svg,/viewBox="0 0 1200 800"/);
    assert.ok(svg.includes(failed?'Image unavailable':'Loading image'));
    assert.ok(!svg.includes('<image'));
  }
});
