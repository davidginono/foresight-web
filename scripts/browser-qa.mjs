import { createRequire } from 'node:module';
import fs from 'node:fs/promises';

const require = createRequire(import.meta.url);
const playwrightPath = require.resolve('playwright', { paths: [process.env.PLAYWRIGHT_MODULE_PATH || 'C:/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules'] });
const { chromium } = require(playwrightPath);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1265, height: 712 }, deviceScaleFactor: 1 });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
await fs.mkdir('qa', { recursive: true });
const index = JSON.parse(await fs.readFile('src/content/index.json', 'utf8'));
const results = [];
const selected = process.argv.find(a => a.startsWith('--pages='))?.slice(8).split(',');
const resultFile = selected ? 'qa/browser-selected-results.json' : 'qa/browser-results.json';
for (const entry of index.filter(e => !selected || selected.includes(e.file))) {
 try {
  await page.goto('http://localhost:4173' + entry.path, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.locator('h1').first().waitFor({ timeout: 90000 });
  await page.evaluate(async () => { await document.fonts.ready; });
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 650) { await page.mouse.wheel(0, 650); await page.waitForTimeout(70); }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: `qa/${entry.file}-desktop.png`, fullPage: true });
  if(entry.file==='home') await page.screenshot({path:'qa/home-preview.png'});
  const broken = await page.locator('img[src]').evaluateAll(images => images.filter(i => i.getAttribute('src') && i.complete && !i.naturalWidth).map(i => i.src));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: `qa/${entry.file}-mobile.png`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  const overflowElements = overflow ? await page.locator('body').evaluate(body=>[...body.querySelectorAll('*')].filter(el=>{const r=el.getBoundingClientRect();const s=getComputedStyle(el);return r.right>innerWidth+1 && r.width && s.display!=='none' && s.visibility!=='hidden';}).map(el=>({tag:el.tagName,cls:el.className?.baseVal??el.className,width:el.getBoundingClientRect().width,right:el.getBoundingClientRect().right})).slice(0,15)) : [];
  results.push({ path: entry.path, broken, mobileOverflow: overflow, ...(overflow ? {overflowElements}: {}) });
  await page.setViewportSize({ width: 1265, height: 712 });
  console.log(JSON.stringify(results.at(-1)));
 } catch(error) { results.push({path:entry.path,error:error.message}); console.log(JSON.stringify(results.at(-1))); }
 await fs.writeFile(resultFile, JSON.stringify({ results, errors }, null, 2));
}
await fs.writeFile(resultFile, JSON.stringify({ results, errors }, null, 2));
await browser.close();
if (errors.length || results.some(r => r.error || r.broken.length || r.mobileOverflow)) process.exitCode = 1;
