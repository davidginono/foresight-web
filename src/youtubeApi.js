let pending;

export function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (pending) return pending;
  pending = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const previous = window.onYouTubeIframeAPIReady;
    const fail = () => {
      clearTimeout(timer); script.remove(); pending = null;
      reject(new Error('YouTube player could not be loaded'));
    };
    const timer = setTimeout(fail, 10000);
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timer);
      try { previous?.(); } finally { resolve(window.YT); }
    };
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true; script.onerror = fail;
    document.head.appendChild(script);
  });
  return pending;
}
