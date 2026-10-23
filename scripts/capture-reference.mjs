import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve('playwright', {paths:[process.env.PLAYWRIGHT_MODULE_PATH || 'C:/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules']}));
const browser = await chromium.launch({channel:'chrome',headless:true});
const page = await browser.newPage({viewport:{width:1265,height:712},deviceScaleFactor:1});
page.setDefaultTimeout(60000);
const assets = [];
const jobs = [];
await fs.mkdir('reference/downloads', {recursive:true});
page.on('response', response => {
 const type=response.request().resourceType();
 if (!['image','font','stylesheet'].includes(type) || !response.ok()) return;
 const job=(async()=>{
  const url=response.url();
  const filename=crypto.createHash('sha256').update(url).digest('hex').slice(0,16)+path.extname(new URL(url).pathname);
  const file=path.resolve('reference/downloads',filename);
  await fs.writeFile(file,await response.body());
  assets.push({url,path:file,name:filename,kind:type==='image'?'image':type==='font'?'font':'stylesheet'});
 })().catch(()=>{});
 jobs.push(job);
});
const index=JSON.parse(await fs.readFile('src/content/index.json','utf8'));
const selected=process.argv.find(a=>a.startsWith('--pages='))?.slice(8).split(',');
try {
 for(const entry of index.filter(e=>!selected||selected.includes(e.file))){
  try {
   await page.goto('https://foresight.co.tz'+entry.path,{waitUntil:'load',timeout:60000});
   await page.locator('h1').first().waitFor();
   await page.evaluate(()=>document.fonts.ready);
   if(entry.file==='gallery'){
    for(let i=0;i<await page.locator('.e-gallery-item').count();i++){
     await page.locator('.e-gallery-item').nth(i).scrollIntoViewIfNeeded();
     await page.waitForFunction(index=>getComputedStyle(document.querySelectorAll('.e-gallery-image')[index]).backgroundImage!=='none',i,{timeout:10000}).catch(()=>{});
    }
   }
   const height=await page.evaluate(()=>document.documentElement.scrollHeight);
   for(let y=0;y<height;y+=600){await page.mouse.wheel(0,600);await page.waitForTimeout(90);}
   await page.waitForTimeout(300);
   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
   await fs.writeFile(`reference/${entry.file}.html`,await page.content());
   await page.screenshot({path:`reference/${entry.file}-desktop.png`,fullPage:true});
   await page.setViewportSize({width:390,height:844});
   await page.screenshot({path:`reference/${entry.file}-mobile.png`,fullPage:true});
   await page.setViewportSize({width:1265,height:712});
   if(entry.file==='gallery'){
    await page.locator('.e-gallery-item').first().click();
    await page.getByRole('button',{name:'Share',exact:true}).waitFor();
    await page.screenshot({path:'reference/gallery-lightbox.png'});
    await page.getByRole('button',{name:'Share',exact:true}).click();
    await page.screenshot({path:'reference/gallery-share.png'});
    console.log('Share menu:',await page.locator('.elementor-slideshow__share-menu').innerText());
    await fs.writeFile('reference/gallery-share.html',await page.locator('.elementor-lightbox').evaluate(e=>e.outerHTML));
    await page.getByRole('button',{name:'Close (Esc)'}).click();
   }
   console.log('Captured '+entry.file);
  } catch(error){console.log('Capture failed '+entry.file+': '+error.message);}
 }
 await Promise.race([Promise.all(jobs),new Promise(resolve=>setTimeout(resolve,5000))]);
 await fs.writeFile('reference/standalone-assets.json',JSON.stringify({assets},null,2));
} finally {await browser.close();}
