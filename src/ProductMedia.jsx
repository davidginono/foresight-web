import { ImageAsset } from './ImageAsset.jsx';
import { company } from './siteContent.js';

export function AppStoreLink() {
  return <a className="mobile-store-link" href={company.playStore} target="_blank" rel="noreferrer" aria-label="View Foresight Financials on Google Play"><ImageAsset src="/assets/wp-content/uploads/2024/09/5a902dbf7f96951c82922875.png" alt="Get it on Google Play" width="646" height="250" loading="lazy" /></a>;
}

export function MobileAppArtwork() {
  return <figure className="mobile-app-figure"><div className="mobile-app-art" data-parallax-slide><ImageAsset src="/assets/wp-content/uploads/2025/01/Computer-resources-limited-app.png" alt="Original Foresight Financials mobile application artwork showing member account and loan information" width="1528" height="1761" loading="lazy" /></div><figcaption>Original app preview. Check current features with your SACCO.</figcaption></figure>;
}

export function MobileAppShowcase() {
  return <div className="strategy-split mobile-app-showcase"><div className="mobile-app-copy"><h2>Download<br/>Our App!</h2><p>View your account and transactions on your phone.</p><AppStoreLink /><p className="strategy-small">For members of participating institutions. Features and access depend on your SACCO.</p></div><MobileAppArtwork /></div>;
}
