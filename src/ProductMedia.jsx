import { ImageAsset } from './ImageAsset.jsx';
import { company } from './siteContent.js';
import { CirclePlay } from 'lucide-react';

export function AppStoreLink() {
  return <a className="mobile-store-link" href={company.playStore} target="_blank" rel="noreferrer" aria-label="View Foresight Financials on Google Play"><ImageAsset src="/assets/wp-content/uploads/2024/09/5a902dbf7f96951c82922875.png" alt="Get it on Google Play" width="646" height="250" loading="lazy" /></a>;
}

export function MobileAppArtwork() {
  return <figure className="mobile-app-figure"><div className="mobile-app-art" data-parallax-slide><ImageAsset src="/assets/wp-content/uploads/2025/01/Computer-resources-limited-app.png" alt="Original Foresight Financials mobile application artwork showing member account and loan information" width="1528" height="1761" loading="lazy" sizes="(max-width: 767px) calc(100vw - 40px), 500px" /></div><figcaption>Original app preview. Check current features with your SACCO.</figcaption></figure>;
}

export function MobileAppShowcase() {
  return <div className="strategy-split mobile-app-showcase"><div className="mobile-app-copy"><h2>Download<br/>Our App!</h2><p>View your account and transactions on your phone.</p><div className="mobile-app-platforms"><AppStoreLink /><div className="mobile-ios-badge"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M17.05 12.54c.03 3.15 2.76 4.2 2.79 4.21-.02.07-.44 1.5-1.44 2.98-.87 1.28-1.78 2.56-3.2 2.59-1.39.03-1.84-.83-3.43-.83-1.59 0-2.09.8-3.41.86-1.37.05-2.41-1.39-3.29-2.66-1.79-2.6-3.16-7.35-1.32-10.55.92-1.59 2.56-2.6 4.34-2.63 1.36-.03 2.65.92 3.48.92.83 0 2.38-1.14 4.01-.97.68.03 2.59.27 3.81 2.05-.1.06-2.28 1.33-2.25 4.03ZM14.43 4.69c.73-.89 1.22-2.13 1.08-3.36-1.05.04-2.33.7-3.08 1.59-.67.77-1.26 2.01-1.1 3.2 1.17.09 2.37-.59 3.1-1.43Z" /></svg><span><span className="mobile-ios-caption">Available on</span><span className="mobile-ios-name">iOS</span></span></div></div><a className="strategy-text-link mobile-app-video-link" href="/saccos-microfinance-system/#application-preview"><CirclePlay size={20} aria-hidden="true"/>See Mobile app video</a><p className="strategy-small">For members of participating institutions. Features and access depend on your SACCO.</p></div><MobileAppArtwork /></div>;
}
