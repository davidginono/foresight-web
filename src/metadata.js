import { articles, products, otherProducts, company } from './siteContent.js';
import { translate } from './locale.js';
import { heroForPath } from './heroImages.js';
const descriptions = {
  '/':['Technology for Cooperatives and Institutions','Foresight software for cooperatives and institutions in Tanzania, including hospitals, pharmacies, SACCOS, microfinance institutions and schools.'],
  '/about-us/':['About Computer Resources (T) Limited','Meet the Tanzania-based company behind Foresight software. Learn about our approach, mission, values and agreed implementation and support services.'],
  '/technology/':['Cloud, Mobile & Integration','Explore Foresight deployment, member mobile access, reporting and integration. Availability and responsibilities are confirmed for each institution.'],
  '/updates/':['Resources, Guides & Announcement Archive','Practical cooperative software guides, training information and clearly dated Foresight announcements. Prepare for migration, upgrades and demonstrations.'],
  '/request-demo/':['Request a Foresight Demonstration','Tell us about your institution, current system, required solution and preferred meeting format to arrange a relevant Foresight software discussion.'],
  '/contact-us/':['Contact Sales & Technical Support','Contact Computer Resources (T) Limited in Arusha, Tanzania for sales, demonstrations, general enquiries and assistance under your support agreement.'],
  '/faq/':['Frequently Asked Questions','Answers about Foresight solutions, deployment, member mobile access, implementation, backups, reporting and support arrangements.'],
  '/testimonials/':['Client Testimonials','Read approved testimonials from SACCOS using Computer Resources (T) Limited systems, and explore client experiences with Foresight software and support.'],
  '/gallery/':['Foresight Photo Gallery','Browse original photos from Foresight activities and events. Contact our team to discuss cooperative software and training requirements.'],
};
export function pageMetadata(path, fallback='Foresight', locale='en') {
  const p=products.find(p=>path===`/${p.slug}/`), a=articles.find(a=>path===`/resources/${a.slug}/`), other=otherProducts.find(p=>path===`/${p[0]}/`);
  let [name,description]=descriptions[path] || (p?[p.title,p.summary]:a?[a.title,a.description]:other?[other[1],other[2]]:[fallback.replace(/\s*[–—].*$/,''),`Historical Foresight information from ${company.name}. For current product capabilities and services, contact our team in Arusha, Tanzania.`]);
  if(locale==='sw') name=translate(locale,heroForPath(path).title || name);
  description=translate(locale,description);
  if(description.length<80)description+=' '+translate(locale,'Discuss your needs with our team in Arusha, Tanzania.');
  if(['/general-version-release/','/foresight-software-training-seminar/','/2024/09/12/','/category/new-release/','/category/training/','/author/foresight/'].includes(path))name=`${translate(locale,'Archive')}: ${name}`;
  return {title:`${name} | Foresight`,description};
}
export const organizationData = { '@context':'https://schema.org', '@type':'Organization', name:company.name, alternateName:'Foresight', url:'https://foresight.co.tz/', email:company.sales, telephone:company.telephone, address:{'@type':'PostalAddress',streetAddress:company.streetAddress,addressLocality:'Arusha',addressCountry:'TZ'} };
export function updateMetadata(path, fallback, locale) {
  const meta=pageMetadata(path,fallback,locale);
  document.title=meta.title;
  const set=(selector,tag,attrs)=>{let el=document.head.querySelector(selector);if(!el){el=document.createElement(tag);document.head.append(el);}Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,value));};
  set('meta[name="description"]','meta',{name:'description',content:meta.description});
  set('link[rel="canonical"]','link',{rel:'canonical',href:`https://foresight.co.tz${path}`});
  set('meta[property="og:title"]','meta',{property:'og:title',content:meta.title});
  set('meta[property="og:description"]','meta',{property:'og:description',content:meta.description});
  set('meta[property="og:url"]','meta',{property:'og:url',content:`https://foresight.co.tz${path}`});
}
