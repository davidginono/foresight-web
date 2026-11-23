import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { heroForPath } from './heroImages.js';
import { imagePlaceholder } from './imagePlaceholder.js';
import { useLanguage } from './Language.jsx';

export const HeroImageContext=createContext(heroForPath('/'));

function HeroMedia({hero}) {
  const { t } = useLanguage();
  const screenshot = Boolean(hero.alt);
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
  const style = screenshot
    ? {'--hero-aspect': `${hero.width} / ${hero.height}`}
    : {'--hero-desktop-image':`url("${hero.src}")`,'--hero-mobile-image':`url("${hero.mobile || hero.src}")`,backgroundPosition:hero.position};
  return <div className={`editorial-hero-media ${screenshot ? 'editorial-hero-screenshot' : 'strategy-photo-hero'}`}
    aria-hidden={screenshot ? undefined : true} data-hero-state={state} style={style}>
    <picture>
      {hero.mobile && <source media="(max-width: 767px)" srcSet={hero.mobile} />}
      <img ref={image} src={hero.src} alt={screenshot ? t(hero.alt) : ""} fetchPriority="high" decoding="async"
        width={screenshot ? hero.width : undefined} height={screenshot ? hero.height : undefined}
        className={screenshot ? undefined : "hero-image-probe"} />
    </picture>
    {state !== 'loaded' && <div className="hero-image-placeholder" role={screenshot && state==='error' ? 'img' : undefined}
      aria-label={screenshot && state==='error' ? t("Image unavailable") : undefined} data-preview={state==='loading'&&!!hero.preview||undefined} style={{backgroundImage:`url("${state==='loading'&&hero.preview ? hero.preview : imagePlaceholder(screenshot ? hero.width : 1200,screenshot ? hero.height : 600,state==='error')}")`,backgroundPosition:hero.position}} />}
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
