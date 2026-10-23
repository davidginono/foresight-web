// Load incoming styles without changing the visible page; activate at commit.
export async function prepareRouteStyles(styles, signal, documentRef = document) {
  const links = [];
  const pending = [];
  const cancelLoads = new AbortController();
  const relayAbort = () => cancelLoads.abort();
  signal.addEventListener("abort", relayAbort, { once: true });
  const dispose = () => { cancelLoads.abort(); links.forEach(link => link.remove()); };
  const abortError = () => new DOMException("Navigation canceled", "AbortError");
  try {
    if (signal.aborted) throw abortError();
    for (const href of new Set(styles.map(style => style.href))) {
      const link = documentRef.createElement("link");
      link.rel = "stylesheet"; link.href = href; link.media = "not all";
      link.dataset.sourceStyle = "staged";
      links.push(link);
      pending.push(new Promise((resolve, reject) => {
        const timer = setTimeout(() => { cleanup(); reject(new Error(`Page styles timed out: ${href}`)); }, 15000);
        const cleanup = () => { clearTimeout(timer); cancelLoads.signal.removeEventListener("abort", abort); link.onload = link.onerror = null; };
        const abort = () => { cleanup(); reject(abortError()); };
        link.onload = () => { cleanup(); resolve(); };
        link.onerror = () => { cleanup(); reject(new Error(`Unable to load page styles: ${href}`)); };
        cancelLoads.signal.addEventListener("abort", abort, { once: true });
      }));
      documentRef.head.appendChild(link);
    }
    await Promise.all(pending);
    if (signal.aborted) throw abortError();
    return {
      activate() {
        if (signal.aborted) throw abortError();
        const previous = [...documentRef.head.querySelectorAll('[data-source-style="active"],[data-source-style="true"]')];
        links.forEach(link => { link.media = "all"; link.dataset.sourceStyle = "active"; });
        previous.forEach(link => link.remove());
      }, dispose,
    };
  } catch (error) { dispose(); throw error; }
  finally { signal.removeEventListener("abort", relayAbort); }
}
