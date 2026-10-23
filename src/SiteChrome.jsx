import { useEffect, useRef } from 'react';
import { ImageAsset } from './ImageAsset.jsx';
import { company, navigation, products } from './siteContent.js';
import { ChevronDown, ArrowRight, ArrowUpRight, Menu } from 'lucide-react';
import { AppStoreLink } from './ProductMedia.jsx';
const logo='/assets/wp-content/uploads/2024/09/Computer-resources-logo.png';

export function SiteHeader({ path }) {
  const ref=useRef(null);
  const openMenu=menu=>{
    ref.current?.querySelectorAll('details[open]').forEach(other=>{if(other!==menu)other.open=false;});
    menu.open=true;
  };
  const usesHover=event=>event.pointerType==='mouse' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  useEffect(()=>{
    const close=event=>{if(event.type==='pointerdown' && ref.current?.contains(event.target))return;ref.current?.querySelectorAll('details[open]').forEach(e=>e.open=false);};
    const keyboard=e=>{if(e.key==='Escape'){const menu=e.target.closest('details');close(e);menu?.querySelector('summary')?.focus();}};
    document.addEventListener('pointerdown',close);document.addEventListener('keydown',keyboard);
    return()=>{document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',keyboard);};
  },[]);
  return <header ref={ref} className="ekit-template-content-header site-header" onClick={e=>{if(e.target.closest('a'))ref.current.querySelectorAll('details[open]').forEach(menu=>menu.open=false);}}>
    <div className="site-nav strategy-width"><a href="/" aria-label={`${company.name} home`} className="site-logo"><ImageAsset src={logo} alt={company.name} width="414" height="80" loading="eager" /></a>
      <nav aria-label="Main navigation" className="site-desktop-nav">{navigation.map(item=>item.links?<details key={item.label} className="site-dropdown"
        onPointerEnter={e=>{if(usesHover(e))openMenu(e.currentTarget);}}
        onPointerLeave={e=>{if(usesHover(e) && !e.currentTarget.contains(document.activeElement))e.currentTarget.open=false;}}
        onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))e.currentTarget.open=false;}}
        onToggle={e=>e.currentTarget.querySelector('summary')?.setAttribute('aria-expanded',String(e.currentTarget.open))}>
        <summary aria-expanded="false" onClick={e=>{
          // Own summary activation here; the captured-page handler also toggles details.
          e.preventDefault();e.stopPropagation();
          const menu=e.currentTarget.parentElement;
          if(e.detail>0 && window.matchMedia('(hover: hover) and (pointer: fine)').matches)openMenu(menu);
          else if(menu.open)menu.open=false;
          else openMenu(menu);
        }}>{item.label}<ChevronDown className="nav-chevron" size={16} aria-hidden="true" /></summary><div className="site-dropdown-panel"><a href={item.href}><span>Explore {item.label.toLowerCase()}</span><ArrowUpRight className="nav-arrow" size={17} aria-hidden="true" /></a>{item.links.map(([label,href])=><a key={label} href={href} aria-current={href===path?'page':undefined}><span>{label}</span><ArrowRight className="nav-arrow" size={17} aria-hidden="true" /></a>)}</div></details>:<a key={item.label} href={item.href} aria-current={item.href===path?'page':undefined}>{item.label}</a>)}</nav>
      <a className="strategy-button site-demo" href="/request-demo/">Request a Demo<ArrowUpRight className="nav-arrow" size={18} aria-hidden="true" /></a><button type="button" className="elementskit-menu-hamburger site-menu-toggle" aria-label="Open navigation" aria-expanded="false"><Menu size={20} aria-hidden="true" />Menu</button>
    </div>
  </header>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="strategy-width site-footer-grid"><div><a href="/" aria-label={`${company.name} home`}><ImageAsset src={logo} alt={company.name} width="414" height="80" loading="lazy" /></a><p>Technology for Stronger Cooperatives</p><p>Foresight is the cooperative software product brand of {company.name}.</p><AppStoreLink /></div><div><h2>Solutions</h2>{products.map(p=><a key={p.slug} href={`/${p.slug}/`}>{p.name}</a>)}<a href="/services/#other-solutions">Other Business Solutions</a></div><div><h2>Explore</h2><a href="/technology/">Technology</a><a href="/implementation-guide/">Implementation Guide</a><a href="/updates/">Resources</a><a href="/about-us/">About Us</a><a href="/faq/">FAQs</a></div><div><h2>Talk to our team</h2><a href={`mailto:${company.sales}`}>Sales: {company.sales}</a><a href={`mailto:${company.support}`}>Support: {company.support}</a><a href={`mailto:${company.general}`}>General: {company.general}</a><a href={`tel:${company.telephone}`}>{company.phone}</a><p>{company.address}</p><a href="/contact-us/">Contact & support arrangements</a></div></div><div className="strategy-width site-footer-bottom"><span>© {new Date().getFullYear()} {company.name}</span><span>Tanzania first. Regional requirements assessed individually.</span></div></footer>;
}
