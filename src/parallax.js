export function parallaxShift(top, height, viewportHeight, travel) {
  // Use the complete visible journey, rather than hitting a small travel cap
  // while the photograph is still on screen.
  const progress = (viewportHeight - top) / Math.max(1, viewportHeight + height);
  return Math.max(-travel, Math.min(travel, (progress * 2 - 1) * travel));
}

export function sectionLift(top, viewportHeight, distance) {
  const progress = Math.max(0, Math.min(1, (viewportHeight - top) / (viewportHeight * .65)));
  return distance * (1 - progress) ** 1.35;
}

export function dampMotion(current, target, elapsed) {
  const next = current + (target - current) * (1 - Math.exp(-Math.min(64, elapsed) / 105));
  return Math.abs(target - next) < .12 ? target : next;
}

export function setupParallax(root) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let stop = () => {};
  function sync() {
    stop();
    if (preference.matches) { stop = () => {}; return; }
    const entries = [];
    // Only large photographic backgrounds receive a decorative moving layer.
    root.querySelectorAll('main .e-con,main .elementor-section,main .strategy-photo-hero').forEach(target => {
      const style = getComputedStyle(target);
      const rect = target.getBoundingClientRect();
      if (rect.width < 250 || rect.height < 240 || !/url\([^)]*\.(?:jpe?g|webp)[^)]*\)/i.test(style.backgroundImage)) return;
      const saved = { backgroundImage: target.style.backgroundImage, isolation: target.style.isolation, overflow: target.style.overflow };
      const layer = document.createElement('div');
      layer.className = 'parallax-background'; layer.setAttribute('aria-hidden', 'true');
      Object.assign(layer.style, { position: 'absolute', left: '0', right: '0', zIndex: '-2', pointerEvents: 'none', backgroundImage: style.backgroundImage, backgroundSize: style.backgroundSize, backgroundPosition: style.backgroundPosition, backgroundRepeat: style.backgroundRepeat, willChange: 'transform' });
      Object.assign(target.style, { backgroundImage: 'none', isolation: 'isolate', overflow: 'hidden' });
      target.prepend(layer); target.dataset.parallax = 'background';
      entries.push({ target, layer, kind: 'background', restore() { layer.remove(); Object.assign(target.style, saved); delete target.dataset.parallax; } });
    });
    root.querySelectorAll('[data-parallax-photo]').forEach(target => {
      const layer = target.querySelector('img');
      if (!layer) return;
      const saved = Object.fromEntries(['transform', 'willChange', 'position', 'top', 'left', 'width', 'height', 'maxWidth', 'objectFit'].map(key => [key, layer.style[key]]));
      Object.assign(layer.style, { position: 'absolute', left: '0', width: '100%', maxWidth: 'none', objectFit: 'cover' });
      layer.style.willChange = 'transform'; target.dataset.parallax = 'photo';
      entries.push({ target, layer, kind: 'photo', restore() { Object.assign(layer.style, saved); delete target.dataset.parallax; } });
    });
    root.querySelectorAll('[data-parallax-float],[data-parallax-slide]').forEach(target => {
      const layer = target.querySelector('img');
      if (!layer) return;
      const saved = { translate: layer.style.translate, willChange: layer.style.willChange };
      const kind=target.hasAttribute('data-parallax-slide')?'slide':'float';
      layer.style.willChange = 'translate'; target.dataset.parallax = kind;
      entries.push({target,layer,kind,restore(){Object.assign(layer.style,saved);delete target.dataset.parallax;}});
    });
    // Move section contents inside their natural layout. Backgrounds, anchor
    // targets and the sticky navigation keep stable geometry throughout.
    root.querySelectorAll('main > .e-parent, main > .elementor-top-section, main.ux-about > section, main.strategy-page > section').forEach(target => {
      if (target.dataset.parallax || target.getBoundingClientRect().top < innerHeight * .75) return;
      const layer = target.querySelector(':scope > .strategy-width,:scope > .e-con-inner,:scope > .elementor-container') || target;
      const saved = { translate: layer.style.translate, opacity: layer.style.opacity, willChange: layer.style.willChange };
      target.dataset.scrollSection = '';
      layer.style.willChange = 'translate, opacity';
      entries.push({ target, layer, kind: 'section', lift: 0, restore() { Object.assign(layer.style, saved); delete target.dataset.scrollSection; } });
    });
    // Let the browser move photographs with its scrolling compositor. Easing
    // a second scroll position on the main thread makes the photo lag, then
    // catch up after the document has already stopped (especially on reversal).
    const nativeImages = CSS.supports('animation-timeline', '--foresight-image')
      && CSS.supports('view-timeline-name', '--foresight-image')
      && CSS.supports('animation-range', 'cover 0% cover 100%');
    entries.filter(entry=>entry.kind!=='section').forEach(entry=>{
      entry.native=nativeImages;
      if(!nativeImages)return;
      const saved=Object.fromEntries(['viewTimelineName','viewTimelineAxis','viewTimelineInset'].map(key=>[key,entry.target.style[key]]));
      const restore=entry.restore;
      entry.restore=()=>{
        delete entry.target.dataset.scrollDriver;
        delete entry.layer.dataset.scrollImage;
        entry.layer.style.removeProperty('--parallax-travel');
        Object.assign(entry.target.style,saved);
        restore();
      };
      Object.assign(entry.target.style,{viewTimelineName:'--foresight-image',viewTimelineAxis:'block',viewTimelineInset:'0px'});
    });
    // Overscan and image sizing change only with layout/viewport size, never
    // during an ordinary scroll frame. Read all geometry before writing styles.
    const measureImages=()=>{
      const measurements=entries.filter(entry=>entry.kind!=='section').map(entry=>{
        const rect=entry.target.getBoundingClientRect();
        const travel=entry.kind==='slide' ? rect.width*.9
          : entry.kind==='float' ? (innerWidth<768?24:48)
          : entry.kind==='photo' ? Math.min(210,rect.height*.45,innerHeight*.2)
          : entry.target.classList.contains('editorial-hero-media') ? rect.height*.22
          : (rect.height+innerHeight)*(innerWidth<768?.21:.29);
        return {entry,travel,position:entry.kind==='background'?getComputedStyle(entry.target).backgroundPosition:null};
      });
      measurements.forEach(({entry,travel,position})=>{
        entry.travel=travel;
        if(entry.kind!=='float' && entry.kind!=='slide'){
          entry.layer.style.top=`${-travel-2}px`;
          entry.layer.style.height=`calc(100% + ${travel*2+4}px)`;
        }
        if(position)entry.layer.style.backgroundPosition=position;
        if(entry.native){
          entry.layer.style.setProperty('--parallax-travel',`${travel}px`);
          entry.target.dataset.scrollDriver='native';
          entry.layer.dataset.scrollImage=entry.kind;
        }
      });
    };
    measureImages();
    let frame = 0;
    let lastTime = 0;
    let lastScroll = scrollY;
    let disposed = false;
    const scriptedEntries=entries.filter(entry=>!entry.native);
    const visible = new Set(scriptedEntries);
    const render = (time = performance.now()) => {
      frame = 0;
      const elapsed = lastTime ? Math.max(1, time - lastTime) : 16;
      const jump = Math.abs(scrollY - lastScroll) > innerHeight * .7;
      lastTime = time; lastScroll = scrollY;
      // Read geometry before writing transforms; scroll never triggers React renders.
      const updates = [...visible].map(entry => {
        const rect = entry.target.getBoundingClientRect();
        if (entry.kind === 'section') {
          const distance = innerWidth < 768 ? 96 : 168;
          const top = rect.top - (entry.layer === entry.target ? entry.lift : 0);
          const focused = entry.target.contains(document.activeElement);
          return {entry,distance,snap:focused,offset:focused ? 0 : sectionLift(top,innerHeight,distance)};
        }
        if (entry.kind === 'slide') {
          // Arrive at the frame's center as it reaches the viewport center.
          const progress=Math.max(0,Math.min(1,(innerHeight-rect.top)/((innerHeight+rect.height)/2)));
          return {entry,offset:entry.travel*(1-progress)**3};
        }
        return { entry, offset: parallaxShift(rect.top, rect.height, innerHeight, entry.travel) };
      });
      let moving = false;
      updates.forEach(({entry,offset,distance,snap}) => {
        const current = entry.kind!=='section' || entry.current === undefined || jump || snap ? offset : dampMotion(entry.current,offset,elapsed);
        if (current !== offset) moving = true;
        entry.current = current;
        if (entry.kind === 'section') {
          entry.lift = current;
          entry.layer.style.translate = `0 ${current.toFixed(2)}px`;
          entry.layer.style.opacity = (1 - current / distance * .42).toFixed(3);
          return;
        }
        if (entry.kind === 'float') {
          entry.layer.style.translate = `0 ${current.toFixed(2)}px`;
          return;
        }
        if (entry.kind === 'slide') {
          entry.layer.style.translate = `${current.toFixed(2)}px 0`;
          return;
        }
        entry.layer.style.transform = `translate3d(0,${current.toFixed(2)}px,0)`;
      });
      if (moving && !disposed) frame = requestAnimationFrame(render);
      else lastTime=0;
    };
    const schedule = () => { if (!disposed && !frame) frame = requestAnimationFrame(render); };
    const observer = new IntersectionObserver(changes => {
      changes.forEach(change => {
        const entry = scriptedEntries.find(item => item.target === change.target);
        if (change.isIntersecting) visible.add(entry); else visible.delete(entry);
      });
      schedule();
    }, {rootMargin:'240px'});
    const layoutChanged=()=>{measureImages();schedule();};
    const resize = new ResizeObserver(layoutChanged);
    entries.forEach(entry => { if(!entry.native)observer.observe(entry.target); resize.observe(entry.target); });
    addEventListener('scroll', schedule, {passive:true});
    addEventListener('resize', layoutChanged, {passive:true});
    root.addEventListener('focusin',schedule);
    render();
    stop = () => {
      disposed = true;
      cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect();
      removeEventListener('scroll', schedule); removeEventListener('resize', layoutChanged);
      root.removeEventListener('focusin',schedule);
      entries.forEach(entry => entry.restore());
    };
  }
  sync(); preference.addEventListener('change', sync);
  return () => { stop(); preference.removeEventListener('change', sync); };
}
