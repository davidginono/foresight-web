import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(require.resolve('playwright',{paths:['C:/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules']}));
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
const page=await browser.newPage({viewport:{width:1265,height:712}});
await page.goto('http://localhost:4173/gallery/',{waitUntil:'networkidle',timeout:90000});
await page.locator('.e-gallery-item').first().waitFor();
assert.equal(await page.locator('.e-gallery-image-loaded').count(),8);
const thumbnails=await page.locator('.e-gallery-image').evaluateAll(es=>es.map(e=>({background:getComputedStyle(e).backgroundImage,filter:getComputedStyle(e).filter})));
await page.screenshot({path:'qa/gallery-check.png',fullPage:true,timeout:90000});
assert.ok(thumbnails.every(t=>t.background!=='none'&&!t.filter.includes('opacity(0)')));
console.log('All 8 original gallery thumbnails are visible.');
}finally{await browser.close();}
