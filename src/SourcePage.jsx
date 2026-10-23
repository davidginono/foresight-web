import React, { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import parse, { attributesToProps, domToReact } from "html-react-parser";
import Swiper, { Autoplay, EffectFade, Navigation, Pagination, A11y } from "swiper";
import { LocalForm } from "./LocalForm.jsx";
import { MarketingPage, nativePaths } from "./MarketingPage.jsx";
import { SiteHeader, SiteFooter } from "./SiteChrome.jsx";
import { track } from "./analytics.js";
import { MobileMenu } from "./MobileMenu.jsx";
import { ImageAsset } from "./ImageAsset.jsx";
import { TrainingVideo } from "./TrainingVideo.jsx";
import { youtubeId } from "./videoSource.js";
import { setupParallax } from "./parallax.js";
import { PageHero } from './PageHero.jsx';
import { heroForPath } from './heroImages.js';
import { ConsultationSection } from './ConsultationSection.jsx';

const textOf = node => node.type === "text" ? node.data : (node.children || []).map(textOf).join("");
function pageParser(page) {
let headingCount=1; // The shared photograph hero owns the page's primary heading.
const parserOptions = { replace(node) {
  if(node.type === "text") {
    node.data=node.data.replace(/Send messege/g,"Request a demo").replace(/AMCOS Management Ssteym/g,"AMCOS Management System");
    const text=node.data.trim();
    if(text.startsWith('Our Comprehensive Training Programs are designed'))node.data='Watch our recorded sessions. Ask us about training for your team.';
    else if(text.startsWith('Explore our diverse range of projects'))node.data='See photos from our work, events and training.';
    else if(text.startsWith('This new update includes enhanced features'))node.data='A past release announcement from September 2024. Ask our team about the current version and available features.';
    else if(text.startsWith('Join us at our upcoming Foresight Software Training Seminar'))node.data='A past seminar announcement from September 2024. Ask our team about current training.';
    else if(['Our Comprehensive Training Programs','Our Training Programs'].includes(text))node.data='Watch & learn';
    else if(text==='Our Work in Action: Project Gallery')node.data='Our work in pictures';
    return;
  }
  if(node.type !== "tag") return;
  const classes=(node.attribs.class || "").split(" ");
  if(classes.includes('e-parent') && /GET A CALL BACK/i.test(textOf(node))) return <ConsultationSection />;
  if(classes.includes('entry-hero')) return <></>;
  const parentType=node.parent?.attribs?.['data-elementor-type'];
  if(['wp-page','single-post'].includes(parentType) && node===node.parent.children.find(child=>child.type==='tag')) return <></>;
  if (classes.includes('ekit-template-content-header')) return <SiteHeader path={page.path} />;
  if (node.attribs['data-elementor-type'] === 'footer') return <SiteFooter />;
  // Replace captured entrance animations with a single controlled motion system.
  node.attribs.class = classes.filter(name => !/^(animated|elementor-invisible|fadeIn\w*|zoomIn\w*|slideIn\w*)$/.test(name)).join(" ");
  if(classes.includes("flatpickr-calendar") || classes.includes("swiper-lazy-preloader")) return <></>;
  if(node.attribs['data-widget_type'] === 'video.default') {
    const settings = JSON.parse(node.attribs['data-settings'] || '{}');
    const id = youtubeId(settings.youtube_url);
    const heading = node.parent?.children?.find(child => child.attribs?.['data-widget_type'] === 'heading.default');
    const title = heading ? textOf(heading).trim() : 'Training video';
    if (id) return <div {...attributesToProps(node.attribs)}><TrainingVideo id={id} title={title} /></div>;
  }
  if(classes.includes("elementskit-menu-hamburger")) {node.attribs['aria-label']="Open navigation";node.attribs['aria-expanded']="false";}
  if(node.name === "h1") {
    headingCount++;
    if(headingCount > 1) {const props=attributesToProps(node.attribs);return <h2 {...props}>{domToReact(node.children,parserOptions)}</h2>;}
  }
  if(node.name === "a") {
    const image=node.children?.find(c=>c.name === "img");
    if(image && !image.attribs.alt) node.attribs['aria-label']=node.attribs.href === "/" ? "Computer Resources home" : node.attribs.href?.includes('play.google.com') ? "Download Foresight Financials on Google Play" : "View image";
    if(!node.attribs.href || node.attribs.href==="#") return <span {...attributesToProps({...node.attribs,href:undefined})} title="Currently unavailable">{domToReact(node.children,parserOptions)}</span>;
    if(node.attribs.href === page.path) node.attribs['aria-current']="page";
    if(node.attribs['data-elementor-open-lightbox']==="yes") node.attribs['aria-label']="Open project photo";
  }
  if (node.type === "tag" && (node.attribs.class || "").split(" ").includes("e-parent") && !(node.attribs.class || "").includes("e-lazyloaded")) {
    node.attribs.class += " e-lazyloaded";
  }
  if (node.type === "tag" && (node.attribs.class || "").split(" ").includes("e-gallery-image")) {
    const props = attributesToProps(node.attribs);
    return <div {...props} className={`${props.className} e-gallery-image-loaded`} style={{...props.style,backgroundImage:'none'}}><ImageAsset src={node.attribs['data-thumbnail']} alt="" loading="lazy" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} /></div>;
  }
  if (node.name === "img") {
    const props = attributesToProps(node.attribs);
    props.className = (props.className || '').split(' ').filter(name => !name.startsWith('swiper-lazy')).join(' ');
    return <ImageAsset {...props} src={props.src || node.attribs['data-src']} />;
  }
  if (node.type === "tag" && node.name === "input") {
    const optional=['form-field-field_0ce84a8','form-field-field_97babe8'];
    if(optional.includes(node.attribs.id)) delete node.attribs.required;
    const autocomplete={ 'form-field-name':'name','form-field-email':'email','form-field-field_f95db5e':'tel','form-field-field_250087a':'organization' };
    if(autocomplete[node.attribs.id]) node.attribs.autocomplete=autocomplete[node.attribs.id];
    if(node.attribs.id==='form-field-field_250087a')node.attribs.placeholder="Your institution or business";
    if(node.attribs.type === 'number')node.attribs.min='0';
    if (node.attribs.type === "tel") delete node.attribs.pattern;
    if ((node.attribs.class || "").includes("elementor-date-field")) {
      node.attribs.type = "date";
      delete node.attribs.readonly;
    }
  }
  if(node.name==='label') {
    const labels={'form-field-field_0ce84a8':'Number of members / clients (optional)','form-field-field_97babe8':'Preferred demo date (optional)','form-field-field_8e4ba01':'Institution type (optional)'};
    if(labels[node.attribs.for])return <label {...attributesToProps(node.attribs)}>{labels[node.attribs.for]}</label>;
    const group=node.parent;
    const required=group?.children?.some(c=>c.attribs?.required!==undefined && !['form-field-field_0ce84a8','form-field-field_97babe8','form-field-field_8e4ba01'].includes(c.attribs?.id));
    if(required)return <label {...attributesToProps(node.attribs)}>{domToReact(node.children,parserOptions)} <span aria-hidden="true">*</span></label>;
  }
  if(node.name==='select' && node.attribs.id==='form-field-field_8e4ba01')delete node.attribs.required;
  if(node.name==='select' && node.attribs.id==='form-field-field_b7c3c27')return <select {...attributesToProps(node.attribs)} defaultValue=""><option value="" disabled>Select a system</option>{domToReact(node.children,parserOptions)}<option value="UNION Management System">UNION Management System</option><option value="AMCOS Management System">AMCOS Management System</option></select>;
  if (node.name === "form") return <LocalForm attributes={node.attribs}>{domToReact(node.children, parserOptions)}</LocalForm>;
  if(node.name==='main' || ["wp-page","single-post","archive"].includes(node.attribs['data-elementor-type'])) {
    const hero=heroForPath(page.path);
    return <main {...attributesToProps(node.attribs)} className={`${node.attribs.class||''} editorial-retained-page`} id="main-content" tabIndex={-1}><PageHero image={hero} title={hero.title} eyebrow={hero.eyebrow} breakout={node.name==='main'}/>{domToReact(node.children,parserOptions)}</main>;
  }
  if(classes.includes('ekit-template-content-header')) return <header {...attributesToProps(node.attribs)}>{domToReact(node.children,parserOptions)}</header>;
  if(node.attribs['data-elementor-type'] === 'footer') return <footer {...attributesToProps(node.attribs)}>{domToReact(node.children,parserOptions)}</footer>;
} };
return parserOptions;
}

export const SourcePage = memo(function SourcePage({ page, onNavigate, onGallery, routes }) {
  const root = useRef(null);
  const [menuTrigger,setMenuTrigger] = useState(null);
  const content = useMemo(() => nativePaths.has(page.path)
    ? <><SiteHeader path={page.path}/><MarketingPage path={page.path}/><SiteFooter/></>
    : parse(page.html, pageParser(page)), [page]);
  useLayoutEffect(() => {
    const stopParallax = setupParallax(root.current);
    const header = root.current.querySelector('header.ekit-template-content-header');
    if (!header) return stopParallax;
    const measure = () => document.documentElement.style.setProperty('--foresight-header-height', `${header.getBoundingClientRect().height + Math.max(0,parseFloat(getComputedStyle(header).top)||0)}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => { observer.disconnect(); stopParallax(); };
  }, [page]);
  useEffect(() => {
    const element = root.current;
    if(!element.querySelector('#main-content')) {
      const main=element.querySelector('main,article,#primary');
      if(main){main.id='main-content';main.tabIndex=-1;}
    }
    const sliders = [];
    const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.querySelectorAll('[data-widget_type="image-carousel.default"]').forEach(widget => {
      const settings = JSON.parse(widget.dataset.settings || "{}");
      const slider = widget.querySelector(".swiper,.swiper-container");
      if (!slider) return;
      sliders.push(new Swiper(slider, {
        modules: [Autoplay, EffectFade, Navigation, Pagination, A11y],
        // Rewind wraps the carousel without cloning React-owned image handlers.
        slidesPerView: Number(settings.slides_to_show || 1), loop: false, rewind: settings.infinite === "yes",
        effect: settings.effect || "slide", speed: Number(settings.speed || 500),
        autoplay: !reducedMotion && settings.autoplay === "yes" ? { delay: Number(settings.autoplay_speed || 2000), pauseOnMouseEnter: true, disableOnInteraction: false } : false,
        navigation: { nextEl: widget.querySelector(".elementor-swiper-button-next"), prevEl: widget.querySelector(".elementor-swiper-button-prev") },
        pagination: { el: widget.querySelector(".swiper-pagination"), clickable: true },
      }));
    });
    element.querySelectorAll(".elementskit-testimonial-slider").forEach(widget => {
      const settings = JSON.parse(widget.dataset.config || "{}");
      const slider = widget.querySelector(".swiper,.swiper-container");
      if (!slider) return;
      sliders.push(new Swiper(slider, {
        modules: [Autoplay, Navigation, Pagination, A11y],
        slidesPerView: Number(settings.slidesPerView || 1), spaceBetween: Number(settings.spaceBetween || 15),
        loop: false, rewind: settings.loop || false, breakpoints: settings.breakpoints || {}, speed: 500,
        autoplay: !reducedMotion && settings.autoplay ? { delay: Number(settings.speed || 5000), pauseOnMouseEnter: true, disableOnInteraction: false } : false,
        navigation: { nextEl: widget.querySelector(".swiper-button-next"), prevEl: widget.querySelector(".swiper-button-prev") },
        pagination: { el: widget.querySelector(".swiper-pagination"), clickable: true },
      }));
    });
    const summaries = [...element.querySelectorAll("summary")];
    const toggle = event => {
      const detail = event.target;
      if (!detail.matches("details")) return;
      detail.querySelector("summary")?.setAttribute("aria-expanded", String(detail.open));
      if (detail.open) detail.parentElement.querySelectorAll("details[open]").forEach(other => { if (other !== detail) other.open = false; });
    };
    summaries.forEach(summary => summary.tabIndex = 0);
    element.addEventListener("toggle", toggle, true);
    const keyboard = event => {
      if (event.key === "Escape") {
        element.querySelectorAll(".elementskit-menu-container.active,.elementskit-menu-overlay.active").forEach(node => node.classList.remove("active"));
        element.querySelectorAll(".elementskit-menu-hamburger").forEach(node => node.setAttribute("aria-expanded", "false"));
      }
      if (event.target.matches("summary")) {
        const index = summaries.indexOf(event.target);
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          summaries[(index + (event.key === "ArrowDown" ? 1 : summaries.length - 1)) % summaries.length]?.focus();
        }
        if (event.key === "Escape") event.target.parentElement.open = false;
      }
    };
    element.addEventListener("keydown", keyboard);
    return () => {
      sliders.forEach(slider => slider.destroy(true, true));
      element.removeEventListener("toggle", toggle, true);
      element.removeEventListener("keydown", keyboard);
    };
  }, [page]);

  const click = event => {
    const target = event.target;
    const summary = target.closest("summary");
    if (summary) {
      event.preventDefault();
      const detail = summary.parentElement;
      const open = !detail.open;
      detail.parentElement.querySelectorAll("details[open]").forEach(item => item.open = false);
      detail.open = open;
      summary.setAttribute("aria-expanded", String(open));
      return;
    }
    const hamburger = target.closest(".elementskit-menu-hamburger");
    if (hamburger) {
      setMenuTrigger(hamburger);
      hamburger.setAttribute("aria-expanded", "true");
      return;
    }
    if (target.closest(".elementskit-menu-close,.elementskit-menu-overlay")) {
      root.current.querySelectorAll(".elementskit-menu-container.active,.elementskit-menu-overlay.active").forEach(node => node.classList.remove("active"));
      root.current.querySelectorAll(".elementskit-menu-hamburger").forEach(node => node.setAttribute("aria-expanded", "false"));
      return;
    }
    const indicator = target.closest(".elementskit-submenu-indicator");
    if (indicator && window.innerWidth <= 1024) {
      event.preventDefault();
      const link = indicator.closest("a");
      const panel = link.nextElementSibling;
      panel.classList.toggle("elementskit-dropdown-open");
      link.setAttribute("aria-expanded", String(panel.classList.contains("elementskit-dropdown-open")));
      return;
    }
    const anchor = target.closest("a[href]");
    if (!anchor || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (anchor.matches('[data-elementor-open-lightbox="yes"]')) {
      event.preventDefault();
      const gallery = anchor.closest(".elementor-gallery__container") || root.current;
      const images = [...gallery.querySelectorAll('[data-elementor-open-lightbox="yes"]')].map(a => ({ src: a.getAttribute("href"), alt: a.querySelector("img")?.alt || "Foresight project gallery" }));
      onGallery({ images, index: images.findIndex(image => image.src === anchor.getAttribute("href")) });
      return;
    }
    const url = new URL(anchor.href, location.origin);
    if (url.pathname === '/request-demo/' || url.hash === '#product-enquiry') track('demo_cta_click', {path:page.path});
    const path = url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "") + "/";
    if (url.origin === location.origin && routes.some(p => p.path === path)) {
      event.preventDefault(); onNavigate(url.pathname, url.hash);
    } else if (anchor.getAttribute("href") === "#") event.preventDefault();
  };
  return <><a className="ux-skip-link" href="#main-content" onClick={()=>root.current.querySelector('#main-content')?.focus()}>Skip to content</a><div ref={root} onClick={click}>{!nativePaths.has(page.path)&&['/general-version-release/','/foresight-software-training-seminar/','/2024/09/12/','/author/foresight/','/category/new-release/','/category/training/'].includes(page.path)&&<div className="strategy-archive-notice" role="note">Archive · September 2024. This is historical material; <a href="/updates/">view current resources</a> or <a href="/contact-us/">ask about the current release and training</a>.</div>}{content}</div>{menuTrigger && <MobileMenu path={page.path} routes={routes} trigger={menuTrigger} onNavigate={onNavigate} onClose={()=>{menuTrigger.setAttribute('aria-expanded','false');setMenuTrigger(null);}} />}</>;
});
