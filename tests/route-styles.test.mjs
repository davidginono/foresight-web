import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareRouteStyles } from '../src/routeStyles.js';

function fixture() {
  const nodes = [];
  const document = {
    createElement: () => ({dataset:{}, remove(){const i=nodes.indexOf(this);if(i>=0)nodes.splice(i,1);}}),
    head: {
      appendChild: node => nodes.push(node),
      querySelectorAll: () => nodes.filter(node=>['active','true'].includes(node.dataset.sourceStyle)),
    },
  };
  const previous=document.createElement();
  previous.dataset.sourceStyle='active'; previous.media='all';
  nodes.push(previous);
  return {nodes,document,previous,controller:new AbortController()};
}

test('incoming CSS stays inactive until an atomic activation replaces the old bundle', async () => {
  const f=fixture();
  const pending=prepareRouteStyles([{href:'/a.css'},{href:'/a.css'},{href:'/b.css'}],f.controller.signal,f.document);
  const staged=f.nodes.filter(node=>node!==f.previous);
  assert.equal(staged.length,2);
  assert.ok(staged.every(node=>node.media==='not all'));
  staged.forEach(node=>node.onload());
  const bundle=await pending;
  assert.ok(f.nodes.includes(f.previous));
  bundle.activate();
  assert.ok(!f.nodes.includes(f.previous));
  assert.ok(staged.every(node=>node.media==='all'&&node.dataset.sourceStyle==='active'));
});

test('canceled navigation removes staged styles and retains the visible page', async () => {
  const f=fixture();
  const pending=prepareRouteStyles([{href:'/next.css'}],f.controller.signal,f.document);
  f.controller.abort();
  await assert.rejects(pending,{name:'AbortError'});
  assert.deepEqual(f.nodes,[f.previous]);
});

test('failed stylesheet keeps old styles and cleans up the rest of the pending bundle', async () => {
  const f=fixture();
  const pending=prepareRouteStyles([{href:'/missing.css'},{href:'/pending.css'}],f.controller.signal,f.document);
  const waiting=f.nodes[2];
  f.nodes[1].onerror();
  await assert.rejects(pending,/Unable to load page styles/);
  assert.deepEqual(f.nodes,[f.previous]);
  assert.equal(waiting.onload,null);
});

test('a fully loaded but superseded bundle cannot replace current styles', async () => {
  const f=fixture();
  const pending=prepareRouteStyles([{href:'/stale.css'}],f.controller.signal,f.document);
  f.nodes[1].onload();
  const bundle=await pending;
  f.controller.abort();
  assert.throws(()=>bundle.activate(),{name:'AbortError'});
  bundle.dispose();
  assert.deepEqual(f.nodes,[f.previous]);
});
