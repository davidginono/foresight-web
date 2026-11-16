import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { htmlToDOM } from 'html-react-parser';
import { imagePlaceholder } from '../src/imagePlaceholder.js';
import variants from '../src/imageVariants.js';
import { heroForPath, heroPreloads } from '../src/heroImages.js';
import sharp from 'sharp';

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

test('responsive image files exist, match their width descriptors and preserve aspect ratios', async () => {
  for (const [original, variant] of Object.entries(variants)) {
    assert.ok(fs.existsSync(new URL('../public'+original,import.meta.url)), original);
    for (const candidate of variant.srcSet.split(', ')) {
      const [source, descriptor] = candidate.split(' ');
      const metadata = await sharp(fileURLToPath(new URL('../public'+source,import.meta.url))).metadata();
      assert.equal(metadata.format, 'webp', source);
      assert.equal(metadata.width, Number.parseInt(descriptor), source);
      assert.ok(Math.abs(metadata.height - variant.height * metadata.width / variant.width) <= 1, source);
      assert.match(source, /^\/assets\/images\/[a-f0-9]{16}-\d+\.webp$/);
    }
  }
});

test('every route preloads the same mobile and desktop photographs its hero displays', () => {
  const entries=JSON.parse(fs.readFileSync(new URL('../src/content/index.json',import.meta.url)));
  for (const {path} of entries) {
    const hero=heroForPath(path);
    const preloads=heroPreloads(path);
    assert.equal(preloads.find(link=>link.media==='(max-width: 767px)').href,hero.mobile,path);
    assert.equal(preloads.find(link=>link.media==='(min-width: 768px)').href,hero.src,path);
    assert.ok(hero.preview.startsWith('data:image/webp;base64,'),path);
    const html=fs.readFileSync(new URL(`../dist/client${path}index.html`,import.meta.url),'utf8');
    for(const {href} of preloads) assert.ok(html.includes(`href="${href}"`),path);
  }
});
