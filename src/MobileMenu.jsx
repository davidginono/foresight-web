import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ImageAsset } from "./ImageAsset.jsx";
import { company, navigation } from './siteContent.js';
import { track } from './analytics.js';
import { ChevronDown, ArrowRight, ArrowUpRight } from 'lucide-react';

export function MobileMenu({ routes, onClose, onNavigate, trigger, path }) {
  const panel = useRef(null);
  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current.querySelector("button").focus();
    return () => { document.body.style.overflow = overflow; trigger?.focus(); };
  }, [trigger]);
  const keyDown = event => {
    if(event.key === "Escape") {event.preventDefault(); onClose();}
    if(event.key !== "Tab") return;
    const controls = [...panel.current.querySelectorAll("a,button,summary")].filter(e=>e.getClientRects().length);
    const first=controls[0], last=controls.at(-1);
    if(event.shiftKey && document.activeElement===first){event.preventDefault(); last.focus();}
    if(!event.shiftKey && document.activeElement===last){event.preventDefault(); first.focus();}
  };
  const link=(route,label)=> <a href={route} aria-current={route===path?"page":undefined}><span>{label}</span><ArrowRight className="nav-arrow" size={18} aria-hidden="true" /></a>;
  return createPortal(<div className="ux-menu-backdrop" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <nav ref={panel} role="dialog" aria-modal="true" aria-label="Main navigation" className="ux-mobile-menu" onKeyDown={keyDown} onClick={e=>{const a=e.target.closest("a");if(a){e.preventDefault();const url=new URL(a.href);if(url.pathname==='/request-demo/')track('demo_cta_click',{path});onNavigate(url.pathname,url.hash);onClose();}}}>
      <div className="ux-menu-top"><ImageAsset src="/assets/wp-content/uploads/2024/09/Computer-resources-logo.png" alt="Computer Resources (T) Limited" /><button type="button" onClick={onClose} aria-label="Close navigation">Close</button></div>
      {navigation.map(item=>item.links?<details key={item.label}><summary><span>{item.label}</span><ChevronDown className="nav-chevron" size={18} aria-hidden="true" /></summary><div>{link(item.href,`Explore ${item.label.toLowerCase()}`)}{item.links.map(([label,href])=><span key={label}>{link(href,label)}</span>)}</div></details>:<a key={item.label} href={item.href} aria-current={item.href===path?'page':undefined}><span>{item.label}</span><ArrowRight className="nav-arrow" size={18} aria-hidden="true" /></a>)}
      {link('/contact-us/','Contact us')}
      <a className="ux-primary" href="/request-demo/">Request a demo<ArrowUpRight className="nav-arrow" size={19} aria-hidden="true" /></a><a className="ux-menu-phone" href={`tel:${company.telephone}`} onClick={e=>e.stopPropagation()}>{company.phone}</a>
    </nav>
  </div>,document.body);
}
