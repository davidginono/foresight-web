import { createContext, useContext } from 'react';
import { heroForPath } from './heroImages.js';

export const HeroImageContext=createContext(heroForPath('/'));

export function PageHero({eyebrow,title,children,photo=false,image,breakout=false}) {
  const contextualImage=useContext(HeroImageContext);
  const hero=image || contextualImage;
  return <section className={`strategy-intro editorial-hero ${photo?'editorial-home-hero':'strategy-inner-hero'} ${breakout?'strategy-hero-breakout':''}`}
    data-page-hero="" data-hero-image={hero.src}>
    <div className="strategy-width editorial-hero-copy">
      {eyebrow&&<p className="strategy-eyebrow">{eyebrow}</p>}
      <h1>{photo?<>Technology for<br/><em>stronger</em><br/>cooperatives<span className="editorial-period">.</span></>:title}</h1>
      {children}
    </div>
    <div className="editorial-hero-media strategy-photo-hero" aria-hidden="true"
      style={{backgroundImage:`url("${hero.src}")`,backgroundPosition:hero.position}} />
  </section>;
}
