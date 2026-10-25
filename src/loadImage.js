// A failed or slow photograph must never hold the whole page behind a loader.
export function loadImage(source, { signal, timeoutMs = 6000, createImage = () => new Image() } = {}) {
  return new Promise(resolve => {
    if (signal?.aborted) { resolve(false); return; }
    const image = createImage();
    let settled = false;
    const finish = ready => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      image.onload = image.onerror = null;
      signal?.removeEventListener('abort', cancel);
      resolve(ready);
    };
    const cancel = () => finish(false);
    const ready = async () => {
      try {
        if (image.decode) await image.decode();
        finish(image.naturalWidth > 0);
      } catch { finish(false); }
    };
    const timer = setTimeout(cancel, timeoutMs);
    image.onload = ready;
    image.onerror = cancel;
    signal?.addEventListener('abort', cancel, { once: true });
    image.fetchPriority = 'high';
    image.src = source;
    if (image.complete) {
      if (image.naturalWidth) ready();
      else cancel();
    }
  });
}
