import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { articles, products, nativePaths, navigation, faqs } from '../src/siteContent.js';
import { pageMetadata } from '../src/metadata.js';
import { safeEvent } from '../src/analytics.js';
const index=JSON.parse(fs.readFileSync(new URL('../src/content/index.json',import.meta.url)));
const paths=new Set(index.map(p=>p.path));

test('document navigation and all five guides lead to real pages',()=>{
  for(const item of navigation)for(const href of [item.href,...(item.links||[]).map(link=>link[1])])assert.ok(paths.has(href.split('#')[0]),href);
  assert.equal(articles.length,5);
  for(const article of articles){assert.ok(paths.has(`/resources/${article.slug}/`));assert.ok(article.sections.length>=3);}
  for(const path of nativePaths)assert.ok(paths.has(path),path);
  assert.equal(products.length,3);
  assert.ok(faqs.some(([q,a])=>q.includes('backup')&&a.includes('not assumed')));
});

test('all routes have unique search metadata and build-time canonical pages',()=>{
  const titles=new Set();
  for(const entry of index){
    const meta=pageMetadata(entry.path,entry.title);
    assert.ok(meta.description.length>70,entry.path);assert.ok(!titles.has(meta.title),meta.title);titles.add(meta.title);
    const file=new URL(`../dist/client${entry.path}index.html`,import.meta.url);
    const html=fs.readFileSync(file,'utf8');
    assert.ok(html.includes(`href="https://foresight.co.tz${entry.path}"`),entry.path);
    assert.ok(html.includes('application/ld+json'),entry.path);
  }
  const sitemap=fs.readFileSync(new URL('../dist/client/sitemap.xml',import.meta.url),'utf8');
  assert.equal((sitemap.match(/<loc>/g)||[]).length,index.length);
});

test('analytics accept known events and exclude personal contact details',()=>{
  assert.equal(safeEvent('unknown_event',{path:'/'}),null);
  assert.deepEqual(safeEvent('demo_request_sent',{path:'/request-demo/',email:'private@example.com',name:'Private name',telephone:'1234567',message:'Member information',form:'demo'}),{event:'demo_request_sent',path:'/request-demo/',form:'demo'});
});
