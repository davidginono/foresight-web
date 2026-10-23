import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play, Quote } from 'lucide-react';
import { ImageAsset } from './ImageAsset.jsx';
import testimonials from './testimonialContent.json';

// Original published statements; the user confirmed approval on 23 October 2026.
export function Testimonials({ preview=false }) {
  return <div className="testimonial-grid tw:grid tw:grid-cols-1 tw:gap-7 tw:lg:grid-cols-2">
    {(preview?testimonials.slice(0,2):testimonials).map(item=><figure className="testimonial-card" key={item.name}>
      <Quote className="testimonial-quote" size={36} aria-hidden="true" />
      <blockquote><p>{item.quote}</p></blockquote>
      <figcaption><ImageAsset src={item.image} alt={`${item.name} logo`} width="80" height="80" loading="lazy" />
        <div><h3>{item.href?<a href={item.href} target="_blank" rel="noopener noreferrer" aria-label={`${item.name} website (opens in a new tab)`}>{item.name}<ArrowUpRight size={16} className="nav-arrow" aria-hidden="true"/></a>:item.name}</h3><p>{item.role}</p></div>
      </figcaption>
    </figure>)}
  </div>;
}

const uploads='/assets/wp-content/uploads/2024/09/';
const clients=[['TCRA','tcra2.png'],['ITV Tanzania','itv2.png'],['Mwananchi Communications','MWANANCHI.png'],['PPF Pensions Fund','ppf2.png'],['TAHA','taha2.png'],['Tanzania Wildlife Research Institute','taw.png'],['TBC','tbc2.png'],['Tanzania Breweries','tbl2.png']];

export function ClientLogos() {
  const showcase=useRef(null), track=useRef(null), belt=useRef(null), counter=useRef(null);
  const counted=useRef(false);
  const [paused,setPaused]=useState(false);
  const [inView,setInView]=useState(false);
  const [visible,setVisible]=useState(()=>!document.hidden);
  const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(()=>{
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    const change=()=>setReduced(preference.matches);
    const visibility=()=>setVisible(!document.hidden);
    preference.addEventListener('change',change);
    document.addEventListener('visibilitychange',visibility);
    return ()=>{
      preference.removeEventListener('change',change);
      document.removeEventListener('visibilitychange',visibility);
    };
  },[]);
  useEffect(()=>{
    let frame;
    if(reduced) { counter.current.textContent=clients.length; counted.current=true; }
    else if(!counted.current) counter.current.textContent='0';
    const observer=new IntersectionObserver(([entry])=>{
      setInView(entry.isIntersecting);
      if(!entry.isIntersecting || counted.current)return;
      counted.current=true;
      const start=performance.now();
      const update=now=>{
        const progress=Math.min(1,(now-start)/2000);
        counter.current.textContent=Math.floor(clients.length*(1-(1-progress)**3));
        if(progress<1)frame=requestAnimationFrame(update);
      };
      frame=requestAnimationFrame(update);
    },{threshold:.25});
    observer.observe(showcase.current);
    return ()=>{
      observer.disconnect();cancelAnimationFrame(frame);
      // A live motion-preference change must never leave a partial count.
      if(counter.current)counter.current.textContent=clients.length;
    };
  },[reduced]);
  const scroll=direction=>{
    const animation=belt.current.getAnimations()[0];
    if(animation){
      const duration=Number(animation.effect.getTiming().duration);
      const distance=track.current.clientWidth*.8;
      const step=duration*distance/(belt.current.getBoundingClientRect().width/2);
      animation.currentTime=((Number(animation.currentTime)+direction*step)%duration+duration)%duration;
    }else track.current.scrollBy({left:direction*track.current.clientWidth*.8,behavior:'instant'});
  };
  return <div ref={showcase} className="client-showcase" data-running={!paused&&inView&&visible}>
    <div className="client-showcase-heading"><h2 id="client-logos-title">Our Clients</h2>
      <div className="client-logo-count"><span className="tw:sr-only">{clients.length} client logos shown</span><span ref={counter} className="client-logo-number" aria-hidden="true">{clients.length}</span><span aria-hidden="true">Client logos<br/>shown below</span></div>
    </div>
    <div className="client-logo-controls">
      {!reduced&&<button type="button" onClick={()=>setPaused(value=>!value)} aria-label={paused?'Resume client animation':'Pause client animation'} aria-pressed={paused} aria-controls="client-logos">{paused?<Play size={20} aria-hidden="true"/>:<Pause size={20} aria-hidden="true"/>}</button>}
      <button type="button" onClick={()=>scroll(-1)} aria-label="Previous clients" aria-controls="client-logos"><ArrowLeft size={20} aria-hidden="true"/></button>
      <button type="button" onClick={()=>scroll(1)} aria-label="Next clients" aria-controls="client-logos"><ArrowRight size={20} aria-hidden="true"/></button>
    </div>
    <div ref={track} id="client-logos" className="client-logo-track" tabIndex={0} role="region" aria-labelledby="client-logos-title" onKeyDown={event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();scroll(event.key==='ArrowLeft'?-1:1);}}}>
      <div ref={belt} className="client-logo-belt">
        {[false,true].map(duplicate=><ul className="client-logo-group" key={String(duplicate)} aria-hidden={duplicate||undefined}>
          {clients.map(([name,file])=><li key={name}><ImageAsset src={uploads+file} alt={duplicate?'':name} width="104" height="104" loading="eager" /></li>)}
        </ul>)}
      </div>
    </div>
  </div>;
}
