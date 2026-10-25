import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { SourcePage } from "./SourcePage.jsx";
import { Gallery } from "./Gallery.jsx";
import { PageLoader } from "./PageLoader.jsx";
import { ParticleBackground } from './ParticleBackground.jsx';
import { prepareRouteStyles } from "./routeStyles.js";
import pageIndex from "./content/index.json";
import { updateMetadata } from './metadata.js';
import { track } from './analytics.js';
import { products, nativePaths } from './siteContent.js';
import { heroForPath } from './heroImages.js';
import { loadImage } from './loadImage.js';

// Only retained media/history pages ship captured HTML. Superseded marketing
// claims stay in repository provenance rather than unused public JS chunks.
const pages = import.meta.glob([
  './content/training.json', './content/gallery.json',
  './content/general-version-release.json', './content/foresight-software-training-seminar.json',
  './content/2024-09-12.json', './content/author-foresight.json',
  './content/category-new-release.json', './content/category-training.json',
]);
const normalizePath = path => path === "/" ? path : path.replace(/\/+$/, "") + "/";
function alignAnchor(target, stillCurrent = () => true) {
  target.scrollIntoView({behavior:'instant'});
  // Scroll-linked section lifts settle on the next frame. Align once more
  // against the final geometry so headings stay below the sticky header.
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    if (target.isConnected && stillCurrent()) target.scrollIntoView({behavior:'instant'});
  }));
}

export function App() {
  const [path, setPath] = useState(normalizePath(location.pathname));
  const [page, setPage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [gallery, setGallery] = useState(null);
  const transition = useRef(null);
  const sequence = useRef(0);
  const visited = useRef(false);
  const closeGallery = useCallback(() => setGallery(null), []);
  const navigate = useCallback((destination, hash = "") => {
    const normalized = normalizePath(destination);
    if (normalized === normalizePath(location.pathname)) {
      if (hash) { history.replaceState(null, "", normalized + hash); const target=document.getElementById(hash.slice(1)); if(target)alignAnchor(target,()=>location.pathname===normalized&&location.hash===hash); }
      else window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    history.pushState(null, "", normalized + hash);
    setPath(normalized); setGallery(null);
  }, []);
  useEffect(() => {
    const pop = () => { setPath(normalizePath(location.pathname)); setGallery(null); };
    addEventListener("popstate", pop);
    return () => removeEventListener("popstate", pop);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    const request = ++sequence.current;
    let bundle;
    let committed = false;
    transition.current?.skipTransition();
    const current = () => !controller.signal.aborted && request === sequence.current;
    const entry = pageIndex.find(item => item.path === path);
    if (!entry) {
      document.title = "Page not found — Computer Resources";
      setError("not-found"); setLoading(false);
      return () => controller.abort();
    }
    setError(null); setLoading(true);
    (async () => {
      // Rewritten pages use the shared Tailwind layout and local Jost font;
      // avoid downloading their unused captured WordPress markup and styles.
      const data = nativePaths.has(path)
        ? {path,title:entry.title,styles:[{href:'/assets/wp-content/uploads/elementor/google-fonts/css/jost.css'}]}
        : (await pages[`./content/${entry.file}.json`]()).default;
      if (!current()) return;
      const styles = prepareRouteStyles(data.styles, controller.signal);
      // Start both requests together. Only the first visit waits for critical
      // imagery; slow or failed images fall back inside their own frame.
      const images = visited.current ? Promise.resolve() : Promise.all([
        loadImage('/assets/wp-content/uploads/2024/09/Computer-resources-logo.png', { signal: controller.signal }),
        loadImage(heroForPath(path).src, { signal: controller.signal }),
      ]);
      bundle = await styles;
      await images;
      if (!current()) { bundle.dispose(); return; }
      const commit = () => {
        if (!current()) return;
        // CSS, body context and React content change in one rendering frame.
        bundle.activate();
        document.body.className = nativePaths.has(path) ? 'foresight-native' : data.bodyClass;
        updateMetadata(path,data.title);
        flushSync(() => { setPage(data); setLoading(false); setError(null); });
        committed = true;
        let target;
        try { target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null; } catch { /* malformed fragment */ }
        if (target) alignAnchor(target,current);
        else window.scrollTo({ top: 0, behavior: "instant" });
        if (visited.current) document.querySelector("#main-content")?.focus({ preventScroll: true });
        visited.current = true;
        track('page_view',{path});
        const product=products.find(p=>path===`/${p.slug}/`);
        if(product)track('product_view',{path,product:product.slug});
      };
      if (visited.current && document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const active = document.startViewTransition(commit);
        transition.current = active;
        active.ready.catch(() => {});
        await active.updateCallbackDone;
        active.finished.catch(() => {});
      } else commit();
    })().catch(reason => {
      if (!current() || reason.name === "AbortError") return;
      bundle?.dispose(); console.error(reason);
      setError("load-failed"); setLoading(false);
    });
    return () => {
      controller.abort(); transition.current?.skipTransition();
      if (!committed) bundle?.dispose();
    };
  }, [path, attempt]);

  const missing = error === "not-found";
  return <>
    <ParticleBackground />
    {loading && <PageLoader initial={!page} label={pageIndex.find(item => item.path === path)?.title.split(" – ")[0] || "page"} />}
    {error && <section role="alert" className={missing || !page ? "tw:mx-auto tw:max-w-3xl tw:px-6 tw:py-32" : "tw:fixed tw:bottom-6 tw:left-1/2 tw:z-[100011] tw:w-[min(90vw,480px)] tw:-translate-x-1/2 tw:rounded-xl tw:bg-white tw:p-6 tw:shadow-xl tw:border tw:border-solid tw:border-slate-200"}>
      <h1 className="tw:text-2xl tw:font-semibold tw:text-[#333a52]!">{missing ? "Page not found" : "This page couldn’t be opened"}</h1>
      <p className="tw:my-3 tw:text-[#465166]">{missing ? "Please return home or choose another page." : "Your current page is still available. Please try again."}</p>
      {!missing && <button type="button" className="ux-primary tw:mr-3" onClick={() => setAttempt(value => value + 1)}>Try again</button>}<a href="/" className="ux-text-link">Return home</a>
    </section>}
    {!missing && <div id="site-page" aria-busy={loading} data-route={page?.path || ""}>{page && <SourcePage key={page.path} page={page} onNavigate={navigate} onGallery={setGallery} routes={pageIndex} />}</div>}
    {gallery && <Gallery images={gallery.images} initialIndex={gallery.index} onClose={closeGallery} />}
  </>;
}
