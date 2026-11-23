import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { heroForPath } from './heroImages.js';
import { imagePlaceholder } from './imagePlaceholder.js';

export const HeroImageContext=createContext(heroForPath('/'));

function HeroMedia({hero}) {
  const image = useRef(null);
  const [state, setState] = useState('loading');
  useEffect(() => {
    let active = true;
    const element = image.current;
    const ready = async () => {
      try {
        if (element.decode) await element.decode();
        if (active) setState(element.naturalWidth ? 'loaded' : 'error');
      } catch { if (active) setState('error'); }
    };
    const failed = () => { if (active) setState('error'); };
    element.addEventListener('load', ready);
    element.addEventListener('error', failed);
    if (element.complete) element.naturalWidth ? ready() : failed();
    return () => {
      active = false;
      element.removeEventListener('load', ready);
      element.removeEventListener('error', failed);
    };
  }, [hero.src]);
  return <div className="editorial-hero-media strategy-photo-hero" aria-hidden="true"
    data-hero-state={state} style={{'--hero-desktop-image':`url("${hero.src}")`,'--hero-mobile-image':`url("${hero.mobile || hero.src}")`,backgroundPosition:hero.position}}>
    <picture>{hero.mobile&&<source media="(max-width: 767px)" srcSet={hero.mobile}/>}<img ref={image} src={hero.src} alt="" fetchPriority="high" decoding="async" className="hero-image-probe" /></picture>
    {state !== 'loaded' && <div className="hero-image-placeholder" data-preview={state==='loading'&&!!hero.preview||undefined} style={{backgroundImage:`url("${state==='loading'&&hero.preview ? hero.preview : imagePlaceholder(1200,600,state==='error')}")`,backgroundPosition:hero.position}} />}
  </div>;
}

export function PageHero({eyebrow,title,children,photo=false,image,breakout=false}) {
  const contextualImage=useContext(HeroImageContext);
  const hero=image || contextualImage;
  return <section className={`strategy-intro editorial-hero ${photo?'editorial-home-hero':'strategy-inner-hero'} ${breakout?'strategy-hero-breakout':''}`}
    data-page-hero="" data-hero-image={hero.src}>
    <div className="strategy-width editorial-hero-copy">
      {eyebrow&&<p className="strategy-eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {children}
    </div>
    <HeroMedia key={hero.src} hero={hero} />
  </section>;
}
