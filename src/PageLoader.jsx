import { ImageAsset } from "./ImageAsset.jsx";
export function PageLoader({ initial, label }) {
  return initial ? <div className="brand-loader tw:fixed tw:inset-0 tw:z-[100010] tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-8 tw:bg-[#f5f9fc] tw:px-6" role="status">
    <div className="brand-loader-logo tw:overflow-hidden"><ImageAsset src="/assets/wp-content/uploads/2024/09/Computer-resources-logo.png" alt="Computer Resources (T) Limited" className="tw:block tw:w-[min(340px,75vw)] tw:h-auto" /></div>
    <div className="tw:h-px tw:w-48 tw:overflow-hidden tw:bg-[#d8dee8]"><span className="brand-loader-line tw:block tw:h-full tw:w-1/2 tw:bg-[#ff6900]" /></div>
    <span className="tw:font-sans tw:text-xs tw:tracking-[.22em] tw:uppercase tw:text-[#4b556b]">Loading your experience</span>
  </div> : <div className="route-loader tw:pointer-events-none tw:fixed tw:inset-x-0 tw:top-0 tw:z-[100010] tw:h-[3px] tw:overflow-hidden tw:bg-[#ff6900]/15" role="status">
    <span className="brand-loader-line tw:block tw:h-full tw:w-1/3 tw:bg-[#ff6900]" /><span className="tw:sr-only">Opening {label}…</span>
  </div>;
}
