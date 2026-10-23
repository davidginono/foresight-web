import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { htmlToDOM } from 'html-react-parser';

const root = path.resolve(import.meta.dirname, '..');
const index = JSON.parse(fs.readFileSync(path.join(root, 'src/content/index.json'), 'utf8'));
const routes = new Set(index.map(page => page.path));
function walk(nodes, visit) {
  for (const node of nodes) { if (node.type === 'tag') visit(node); if (node.children) walk(node.children, visit); }
}
test('all 24 original routes and seven document-led resource routes have content and styling', () => {
  assert.equal(index.length, 31);
  assert.equal(routes.size, index.length);
  for (const entry of index) {
    const page = JSON.parse(fs.readFileSync(path.join(root, `src/content/${entry.file}.json`), 'utf8'));
    assert.ok(page.html.includes('<h1'), entry.path);
    assert.ok(page.styles.length > 0, entry.path);
    for (const style of page.styles) assert.ok(fs.existsSync(path.join(root, 'public', decodeURIComponent(style.href))), `${entry.path}: ${style.href}`);
  }
});
test('images, gallery originals, and internal navigation resolve locally', () => {
  const issues = [];
  for (const entry of index) {
    const page = JSON.parse(fs.readFileSync(path.join(root, `src/content/${entry.file}.json`), 'utf8'));
    walk(htmlToDOM(page.html), node => {
      const a = node.attribs || {};
      if (node.name === 'script') issues.push(`${entry.path}: unexpected script`);
      for (const [attribute, value] of Object.entries(a)) {
        if ((attribute === 'src' && node.name !== 'iframe') || attribute === 'data-thumbnail' || (attribute === 'href' && value.startsWith('/assets/'))) {
          if (value.startsWith('data:') || value.startsWith('#') || !value) continue;
          if (!value.startsWith('/assets/')) issues.push(`${entry.path}: remote asset ${value}`);
          else if (!fs.existsSync(path.join(root, 'public', decodeURIComponent(value.split(/[?#]/)[0])))) issues.push(`${entry.path}: missing asset ${value}`);
        }
      }
      if (node.name === 'a' && a.href?.startsWith('/') && !a.href.startsWith('/assets/')) {
        const target = a.href.split(/[?#]/)[0];
        if (target && !routes.has(target)) issues.push(`${entry.path}: missing route ${target}`);
      }
      if (node.name === 'form') assert.equal(a['data-local-form'], 'true', entry.path);
    });
  }
  assert.deepEqual([...new Set(issues)], []);
});
test('every local CSS image and font reference exists', () => {
  const issues = [];
  function scan(directory) {
    for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
      const filename = path.join(directory, item.name);
      if (item.isDirectory()) scan(filename);
      else if (filename.endsWith('.css')) {
        const css = fs.readFileSync(filename, 'utf8');
        for (const match of css.matchAll(/url\(["']?(\/assets\/[^"')]+)["']?\)/g)) {
          const asset = decodeURIComponent(match[1].split(/[?#]/)[0]);
          if (!fs.existsSync(path.join(root, 'public', asset))) issues.push(asset);
        }
      }
    }
  }
  scan(path.join(root, 'public/assets'));
  assert.deepEqual([...new Set(issues)], []);
});
