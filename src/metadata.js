import { articles, products, otherProducts, company } from './siteContent.js';
const descriptions = {
  '/':['Technology for Stronger Cooperatives','Foresight software for SACCOS, microfinance institutions, cooperative unions and AMCOS in Tanzania. Explore solutions, implementation, training and support.'],
  '/about-us/':['About Computer Resources (T) Limited','Meet the Tanzania-based company behind Foresight cooperative software. Learn about our approach, mission, values and agreed implementation and support services.'],
  '/services/':['Cooperative Solutions & IT Services','Explore Foresight SACCOS, cooperative union and AMCOS systems, implementation, data migration, training, support and other business solutions.'],
  '/technology/':['Cloud, Mobile & Integration','Explore Foresight deployment, member mobile access, reporting and integration. Availability and responsibilities are confirmed for each institution.'],
  '/implementation-guide/':['Cooperative Software Implementation Guide','Plan requirements, data migration, infrastructure, testing, training, handover and ongoing support for your cooperative software implementation.'],
  '/updates/':['Resources, Guides & Announcement Archive','Practical cooperative software guides, recorded training and clearly dated Foresight announcements. Prepare for migration, upgrades and demonstrations.'],
  '/request-demo/':['Request a Foresight Demonstration','Tell us about your institution, current system, required solution and preferred meeting format to arrange a relevant Foresight software discussion.'],
  '/contact-us/':['Contact Sales & Technical Support','Contact Computer Resources (T) Limited in Arusha, Tanzania for sales, demonstrations, general enquiries and assistance under your support agreement.'],
  '/faq/':['Frequently Asked Questions','Answers about Foresight solutions, deployment, member mobile access, implementation, backups, reporting and support arrangements.'],
  '/testimonials/':['Client Testimonials','Read approved testimonials from SACCOS using Computer Resources (T) Limited systems, and explore client experiences with Foresight software and support.'],
  '/training/':['Recorded Training & Events','Explore recorded Foresight training videos and contact the team about available workshops, institution-specific training and current event arrangements.'],
  '/gallery/':['Foresight Photo Gallery','Browse original photos from Foresight activities and events. Contact our team to discuss cooperative software and training requirements.'],
  '/software-consultancy-and-service/':['Software Consultancy & Implementation Planning','Discuss operational requirements, data migration, system integration, training and support with Computer Resources (T) Limited in Arusha.'],
};
export function pageMetadata(path, fallback='Foresight') {
  const p=products.find(p=>path===`/${p.slug}/`), a=articles.find(a=>path===`/resources/${a.slug}/`), other=otherProducts.find(p=>path===`/${p[0]}/`);
  let [name,description]=descriptions[path] || (p?[p.title,p.summary]:a?[a.title,a.description]:other?[other[1],other[2]]:[fallback.replace(/\s*[–—].*$/,''),`Historical Foresight information from ${company.name}. For current product capabilities and services, contact our team in Arusha, Tanzania.`]);
  if(description.length<80)description+=' Discuss your needs with our team in Arusha, Tanzania.';
  if(['/general-version-release/','/foresight-software-training-seminar/','/2024/09/12/','/category/new-release/','/category/training/','/author/foresight/'].includes(path))name=`Archive: ${name}`;
  return {title:`${name} | Foresight`,description};
}
export const organizationData = { '@context':'https://schema.org', '@type':'Organization', name:company.name, alternateName:'Foresight', url:'https://foresight.co.tz/', email:company.sales, telephone:company.telephone, address:{'@type':'PostalAddress',streetAddress:'Maliasili Street, Corridor Area, Themi',addressLocality:'Arusha',addressCountry:'TZ'} };
export function updateMetadata(path, fallback) {
  const meta=pageMetadata(path,fallback);
  document.title=meta.title;
  const set=(selector,tag,attrs)=>{let el=document.head.querySelector(selector);if(!el){el=document.createElement(tag);document.head.append(el);}Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,value));};
  set('meta[name="description"]','meta',{name:'description',content:meta.description});
  set('link[rel="canonical"]','link',{rel:'canonical',href:`https://foresight.co.tz${path}`});
  set('meta[property="og:title"]','meta',{property:'og:title',content:meta.title});
  set('meta[property="og:description"]','meta',{property:'og:description',content:meta.description});
  set('meta[property="og:url"]','meta',{property:'og:url',content:`https://foresight.co.tz${path}`});
}
