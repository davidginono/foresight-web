import { useLayoutEffect, useRef, useState } from "react";
import dimensions from "./imageDimensions.json";
import { imagePlaceholder } from "./imagePlaceholder.js";

// Keep a real <img> as the root so captured layouts and carousel selectors work.
export function ImageAsset(props) {
  const source = props.src || props['data-src'] || "";
  return <ImageResource key={source} {...props} source={source} />;
}

function ImageResource({ source, alt = "", className = "", style, onLoad, onError, ...props }) {
  const image = useRef(null);
  const [state, setState] = useState(source ? 'loading' : 'error');
  const [naturalWidth, naturalHeight] = dimensions[source.split(/[?#]/)[0]] || [];
  const width = props.width || naturalWidth;
  const height = props.height || naturalHeight;
  const failed = state === 'error';
  const pending = state === 'loading';
  const placeholder = pending || failed ? imagePlaceholder(width, height, failed) : null;
  useLayoutEffect(() => {
    // Cached images may finish before React attaches the load handler.
    if (source && image.current.complete) setState(image.current.naturalWidth ? 'loaded' : 'error');
  }, [source]);

  return <img {...props} ref={image} width={width} height={height}
    src={failed ? placeholder : source}
    srcSet={failed ? undefined : props.srcSet}
    alt={pending ? "" : failed ? `Image unavailable${alt ? `: ${alt}` : ""}` : alt}
    aria-label={pending ? (alt || props['aria-label']) : props['aria-label']}
    aria-busy={pending || undefined}
    data-image-state={state} data-image-source={source}
    className={`${className} media-image`}
    style={{ ...style, ...(pending ? { backgroundImage: `url("${placeholder}")` } : {}) }}
    onLoad={event => { if (!failed) setState('loaded'); onLoad?.(event); }}
    onError={event => { if (!failed) setState('error'); onError?.(event); }} />;
}
