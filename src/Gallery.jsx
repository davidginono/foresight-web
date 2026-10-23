import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ImageAsset } from "./ImageAsset.jsx";

export function Gallery({ images, initialIndex, onClose }) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(false);
  const [share, setShare] = useState(false);
  const [full, setFull] = useState(false);
  const dialog = useRef(null);
  const imageUrl = new URL(images[index].src, location.origin).href;
  const pageUrl = location.href;
  const next = useCallback(delta => { setIndex(i => (i + delta + images.length) % images.length); setZoom(false); }, [images.length]);
  useEffect(() => {
    const focused = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current.querySelector('[aria-label="Close (Esc)"]').focus();
    const key = event => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") next(1);
      if (event.key === "ArrowLeft") next(-1);
      if (event.key === "Tab") {
        const controls = [...dialog.current.querySelectorAll('button,a[href]')];
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", key);
    const fullscreenChanged=()=>setFull(document.fullscreenElement===dialog.current);
    document.addEventListener('fullscreenchange',fullscreenChanged);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", key);document.removeEventListener('fullscreenchange',fullscreenChanged); focused?.focus(); };
  }, [onClose, next]);
  async function fullscreen() {
    if (!document.fullscreenElement) { await dialog.current.requestFullscreen?.(); setFull(true); }
    else { await document.exitFullscreen?.(); setFull(false); }
  }
  return createPortal(<div ref={dialog} className="foresight-lightbox" role="dialog" aria-modal="true" aria-label="Project gallery" tabIndex={-1} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="foresight-lightbox-counter" aria-live="polite">{index + 1} / {images.length}</div>
    <div className="foresight-lightbox-tools">
      <button aria-label="Fullscreen" aria-pressed={full} onClick={fullscreen}><i className="eicon-frame-expand" /></button>
      <button aria-label="Zoom" aria-pressed={zoom} onClick={() => setZoom(v => !v)}><i className={zoom ? "eicon-zoom-out-bold" : "eicon-zoom-in-bold"} /></button>
      <button aria-label="Share" aria-expanded={share} onClick={() => setShare(v => !v)}><i className="eicon-share-arrow" /></button>
      <button aria-label="Close (Esc)" onClick={onClose}><i className="eicon-close" /></button>
    </div>
    {share && <div className="foresight-lightbox-share">
      <a href={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noreferrer"><i className="eicon-facebook" /> Share on Facebook</a>
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noreferrer"><i className="eicon-twitter" /> Share on Twitter</a>
      <a href={`https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(pageUrl)}&media=${encodeURIComponent(imageUrl)}`} target="_blank" rel="noreferrer"><i className="eicon-pinterest" /> Pin it</a>
      <a href={images[index].src} download><i className="eicon-download-bold" /> Download image</a>
    </div>}
    <button className="foresight-lightbox-prev" aria-label="Previous slide" onClick={() => next(-1)}><i className="eicon-chevron-left" /></button>
    <ImageAsset src={images[index].src} alt={images[index].alt} className={zoom ? "zoomed" : ""} onClick={() => setZoom(v => !v)} />
    <button className="foresight-lightbox-next" aria-label="Next slide" onClick={() => next(1)}><i className="eicon-chevron-right" /></button>
  </div>, document.body);
}
