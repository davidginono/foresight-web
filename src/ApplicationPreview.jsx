import { useRef, useState } from 'react';
import { Play, RotateCcw, ArrowUpRight } from 'lucide-react';
import { ImageAsset } from './ImageAsset.jsx';

const videoUrl='/assets/media/foresight-financials-app.mp4';
const posterUrl='/assets/media/foresight-financials-app-poster.jpg';

export function ApplicationPreview() {
  const video=useRef(null);
  const [state,setState]=useState('preview');
  const preview=state==='preview' || state==='error';
  const play=()=>{
    setState('loading');
    if(video.current.error)video.current.load();
    video.current.play().catch(()=>setState('error'));
  };
  return <figure className="tw:m-0">
    <div className="tw:relative tw:isolate tw:aspect-video tw:overflow-hidden tw:rounded-2xl tw:bg-[#172030] tw:shadow-xl" data-application-preview={state}>
      <video ref={video} className="tw:block tw:h-full tw:w-full tw:object-contain" width="1280" height="720"
        src={videoUrl} poster={posterUrl} controls={!preview} preload="none" playsInline
        aria-label="Foresight Financials mobile application preview"
        onPlaying={()=>setState('ready')} onCanPlay={()=>setState(current=>current==='loading'?'ready':current)}
        onWaiting={()=>setState(current=>current==='preview'||current==='error'?current:'loading')}
        onError={()=>setState('error')} />
      {preview && <button type="button" onClick={play}
        className="training-video-play tw:absolute tw:inset-0 tw:h-full tw:w-full tw:rounded-none tw:border-0 tw:bg-[#172030] tw:p-0 tw:text-white"
        aria-label={state==='error'?'Retry Foresight Financials application preview':'Play Foresight Financials application preview'}>
        <ImageAsset src={posterUrl} alt="" width="1280" height="720" loading="lazy" className="tw:absolute tw:inset-0 tw:block tw:h-full tw:w-full tw:object-contain"/>
        <span className="tw:absolute tw:inset-0 tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-3 tw:bg-linear-to-t tw:from-[#172030]/70 tw:via-black/10 tw:to-transparent tw:p-4">
        <span className="tw:flex tw:size-16 tw:items-center tw:justify-center tw:rounded-full tw:bg-[#ff6900] tw:shadow-lg">{state==='error'?<RotateCcw size={26} aria-hidden="true"/>:<Play size={28} fill="currentColor" aria-hidden="true"/>}</span>
        <span className="tw:rounded-full tw:bg-[#172030]/90 tw:px-4 tw:py-2 tw:text-sm tw:font-semibold">{state==='error'?'Video couldn’t load. Try again.':'Watch the app preview · 6:48'}</span>
        </span>
      </button>}
      {state==='loading' && <div role="status" className="tw:pointer-events-none tw:absolute tw:top-4 tw:left-4 tw:rounded-lg tw:bg-[#172030]/90 tw:px-4 tw:py-2 tw:text-sm tw:text-white">Loading application preview…</div>}
    </div>
    <figcaption className="tw:mt-4 tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3 tw:text-sm tw:text-[#536175]">
      <span>Foresight Financials mobile application · 6 min 48 sec</span>
      <a className="strategy-text-link" href={videoUrl} target="_blank" rel="noreferrer">Open video<ArrowUpRight className="nav-arrow" size={16} aria-hidden="true"/></a>
    </figcaption>
  </figure>;
}
