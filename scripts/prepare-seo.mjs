import fs from 'node:fs/promises';
import path from 'node:path';
import { pageMetadata, organizationData } from '../src/metadata.js';
const index=JSON.parse(await fs.readFile('src/content/index.json','utf8'));
const template=await fs.readFile('dist/client/index.html','utf8');
const escape=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for(const entry of index){
  const meta=pageMetadata(entry.path,entry.title);
  const html=template.replace(/<title>.*?<\/title>/s,`<title>${escape(meta.title)}</title>`).replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${escape(meta.description)}" />`).replace('</head>',`<link rel="canonical" href="https://foresight.co.tz${entry.path}" /><meta property="og:title" content="${escape(meta.title)}" /><meta property="og:description" content="${escape(meta.description)}" /><meta property="og:url" content="https://foresight.co.tz${entry.path}" /><meta property="og:type" content="website" /><script type="application/ld+json">${JSON.stringify(organizationData).replaceAll('<','\\u003c')}</script></head>`);
  const directory=path.join('dist/client',entry.path);
  await fs.mkdir(directory,{recursive:true});await fs.writeFile(path.join(directory,'index.html'),html);
}
await fs.writeFile('dist/client/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${index.map(e=>`<url><loc>https://foresight.co.tz${e.path}</loc></url>`).join('')}</urlset>`);
await fs.writeFile('dist/client/robots.txt','User-agent: *\nAllow: /\nSitemap: https://foresight.co.tz/sitemap.xml\n');
console.log(`Prepared unique search metadata and sitemap for ${index.length} routes.`);
