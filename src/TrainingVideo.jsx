import { useEffect, useRef, useState } from "react";
import { ImageAsset } from "./ImageAsset.jsx";
import sources from "./videoSources.json";
import { loadYouTubeApi } from "./youtubeApi.js";

export function TrainingVideo({ id, title }) {
  const [state, setState] = useState('preview');
  const source = sources[id];
  const opened = state === 'loading' || state === 'ready';
  const host = useRef(null);
  useEffect(() => {
    if (!opened) return;
    const container = host.current;
    let active = true;
    let player;
    const fail = () => { if (active) setState('error'); };
    const timer = setTimeout(fail, 12000);
    loadYouTubeApi().then(YT => {
      if (!active) return;
      const mount = document.createElement('div');
      container.appendChild(mount);
      player = new YT.Player(mount, {
        width:'100%', height:'100%', videoId:id,
        playerVars:{autoplay:1,controls:1,playsinline:1,rel:0,origin:location.origin},
        events:{
          onReady:() => { clearTimeout(timer); if (active) setState('ready'); },
          onError:() => { clearTimeout(timer); fail(); },
        },
      });
      const frame = player.getIframe();
      frame.title = `YouTube video: ${title}`;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
    }).catch(fail);
    return () => {
      active = false; clearTimeout(timer);
      player?.destroy(); container.replaceChildren();
    };
  }, [opened,id,title]);

  return <div className="elementor-widget-container">
    <div className="training-video tw:relative tw:isolate tw:aspect-video tw:min-h-[200px] tw:w-full tw:overflow-hidden tw:rounded-lg tw:bg-[#172030]" data-video-id={id} data-video-state={state}>
      {opened ? <div ref={host} className="tw:absolute tw:inset-0" /> : <button type="button"
          className="training-video-play tw:absolute tw:inset-0 tw:m-0 tw:h-full tw:w-full tw:rounded-none tw:border-0 tw:bg-transparent tw:p-0"
          aria-label={`${state === 'error' ? 'Try playing' : 'Play'} ${title}`}
          onClick={() => setState('loading')}>
          <ImageAsset src={source?.poster} alt="" loading="lazy" className="tw:block tw:h-full tw:w-full tw:object-cover" />
          <span className="tw:absolute tw:inset-0 tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-3 tw:bg-linear-to-t tw:from-black/55 tw:via-black/10 tw:to-transparent">
            <span className="training-video-icon tw:flex tw:size-14 tw:items-center tw:justify-center tw:rounded-full tw:bg-[#ff6900] tw:text-white tw:shadow-lg tw:transition-transform tw:duration-200">
              <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </span>
            <span className="tw:rounded-full tw:bg-black/60 tw:px-3 tw:py-1 tw:font-sans tw:text-xs tw:font-semibold tw:text-white">{state === 'error' ? 'Try again' : 'Play video'}</span>
          </span>
        </button>}
      {state === 'loading' && <div role="status" className="tw:pointer-events-none tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center tw:bg-[#172030]">
        <span className="tw:rounded-xl tw:bg-white tw:px-5 tw:py-3 tw:font-sans tw:text-sm tw:text-[#333a52]">Opening video…</span>
      </div>}
    </div>
    <div className="training-video-links tw:flex tw:flex-row tw:flex-wrap tw:items-center tw:gap-2 tw:pt-2 tw:font-sans tw:text-xs">
      {state === 'error' && <span role="status" className="tw:text-[#465166]">The video couldn’t be loaded here.</span>}
      <a href={source?.url || `https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer" className="tw:text-[#9b3b00]! tw:underline tw:underline-offset-2">Watch on YouTube <svg className="tw:inline tw:size-3 tw:align-baseline" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 3h7v7M21 3 10 14M10 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-6" /></svg></a>
    </div>
  </div>;
}
