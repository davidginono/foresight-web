import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

export function ParticleBackground() {
  const canvasRef = useRef(null);
  const clock = useRef(0);
  const pointer = useRef({ x: -1000, y: -1000, active: false, strength: 0 });
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, frame = 0, last = 0, previousPaint = 0;
    let scroll = window.scrollY;
    let points = [];
    const buckets = [[], [], [], []];
    let staticMotion = preference.matches;
    const moving = () => !paused && !staticMotion && !document.hidden;

    function paint() {
      context.clearRect(0, 0, width, height);
      const time = clock.current;
      const cursor = pointer.current;
      for (const bucket of buckets) bucket.length = 0;
      for (const [u, v] of points) {
        const phase = u * Math.PI * 3.1 - time * .19 + scroll * .00024;
        const depth = (Math.sin(phase + v * .65) + 1) * .5;
        const spread = .4 + .6 * (Math.cos(phase + time * .07) + 1) * .5;
        let x = width * (u + v * .035 * Math.sin(phase));
        let y = height * (.46 + .2 * Math.sin(phase) + v * .22 * spread);
        const dx = x - cursor.x, dy = y - cursor.y;
        const distance = Math.hypot(dx, dy);
        const influence = Math.max(0, 1 - distance / 170) ** 2 * cursor.strength;
        if (distance > 0) {
          x += dx / distance * influence * 38;
          y += dy / distance * influence * 38;
        }
        const radius = ((width < 640 ? .65 : .75) + depth * .9) * Math.min(1.5, Math.max(1, width / 1015));
        buckets[Math.min(3, Math.floor(depth * 4))].push(x, y, radius);
      }
      for (let level = 0; level < buckets.length; level++) {
        context.beginPath();
        const bucket = buckets[level];
        for (let index = 0; index < bucket.length; index += 3) {
          const x = bucket[index], y = bucket[index + 1], radius = bucket[index + 2];
          context.moveTo(x + radius, y);
          context.arc(x, y, radius, 0, Math.PI * 2);
        }
        context.fillStyle = `rgba(23,32,57,${.1 + level * .075})`;
        context.fill();
      }
    }

    function tick(now) {
      frame = 0;
      if (!moving()) return;
      if (!previousPaint || now - previousPaint >= 1000 / 30) {
        const elapsed = last ? Math.min(64, now - last) : 0;
        clock.current += elapsed / 1000;
        const cursor = pointer.current;
        cursor.strength += ((cursor.active ? 1 : 0) - cursor.strength) * (1 - Math.exp(-elapsed / 180));
        paint();
        last = now;
        previousPaint = now;
      }
      frame = requestAnimationFrame(tick);
    }

    function sync() {
      cancelAnimationFrame(frame);
      frame = 0;
      last = previousPaint = 0;
      canvas.dataset.motion = staticMotion ? 'static' : paused ? 'paused' : document.hidden ? 'hidden' : 'running';
      paint();
      if (moving()) frame = requestAnimationFrame(tick);
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const density = Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(4000000 / (width * height)));
      canvas.width = Math.round(width * density);
      canvas.height = Math.round(height * density);
      context.setTransform(density, 0, 0, density, 0, 0);
      const columns = width < 640 ? 90 : 160;
      const rows = width < 640 ? 20 : 30;
      points = [];
      for (let column = 0; column < columns; column++) {
        for (let row = 0; row < rows; row++) points.push([column / (columns - 1) * 1.2 - .1, row / (rows - 1) * 2 - 1]);
      }
      sync();
    }
    const move = event => {
      if (staticMotion || paused || event.pointerType === 'touch') return;
      Object.assign(pointer.current, { x: event.clientX, y: event.clientY, active: true });
    };
    const leave = () => { pointer.current.active = false; };
    const onScroll = () => { if (!staticMotion && !paused) scroll = window.scrollY; };
    const onPreference = () => { staticMotion = preference.matches; setReduced(staticMotion); sync(); };
    setReduced(staticMotion);
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', sync);
    preference.addEventListener('change', onPreference);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', sync);
      preference.removeEventListener('change', onPreference);
    };
  }, [paused]);

  return <>
    <canvas ref={canvasRef} className="particle-background" aria-hidden="true" />
    {!reduced && <button type="button" className="particle-motion-control" onClick={() => setPaused(value => !value)}
      aria-label={paused ? 'Resume background animation' : 'Pause background animation'} aria-pressed={paused}
      title={paused ? 'Resume background animation' : 'Pause background animation'}>
      {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
    </button>}
  </>;
}
