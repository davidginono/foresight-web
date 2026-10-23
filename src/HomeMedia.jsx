import { ImageAsset } from './ImageAsset.jsx';
import { ArrowUpRight } from 'lucide-react';

const uploads='/assets/wp-content/uploads/2024/09/';

// Original homepage images and destinations, retained in src/content/home.json.
export const solutionImages={
  'saccos-microfinance-system':`${uploads}saccoss_members.jpg`,
  'union-management-system':`${uploads}group-happy-african-volunteers-hugs-park-africa-volunteering-charity-people-ecology-concept.jpg`,
  'amcos-management-system':`${uploads}field-5430070_1920.jpg`,
};

export const homepagePartners=[
  {name:'Tanzania Co-operative Development Commission',shortName:'TCDC',image:`${uploads}og.png`,href:'https://www.ushirika.go.tz/'},
  {name:'Tanzania Federation of Cooperatives',shortName:'TFC',image:`${uploads}TFC-LOGAL-logo.png`,href:'https://ushirika.co.tz/'},
];

export function PartnerLinks() {
  return <div className="homepage-partners tw:grid tw:grid-cols-1 tw:gap-6 tw:md:grid-cols-2">
    {homepagePartners.map(partner=><a key={partner.shortName} href={partner.href} target="_blank" rel="noopener noreferrer"
      className="homepage-partner" aria-label={`Visit ${partner.name} (${partner.shortName}) website (opens in a new tab)`}>
      <ImageAsset src={partner.image} alt={`${partner.shortName} logo`} loading="lazy" width="480" height="555"/>
      <h3>{partner.name} <span>({partner.shortName})</span></h3>
      <span className="strategy-text-link">Visit website<ArrowUpRight className="nav-arrow" size={18} aria-hidden="true"/></span>
    </a>)}
  </div>;
}

export function DeviceArtwork() {
  return <figure className="homepage-device-art">
    <div className="tw:grid tw:grid-cols-1 tw:gap-6 tw:md:grid-cols-2">
      <ImageAsset src={`${uploads}pngwing.com-1.png`} alt="Illustration of a laptop, tablet and mobile phone" loading="lazy"/>
      <ImageAsset src={`${uploads}pngegg.png`} alt="Illustration of desktop, laptop and handheld devices" loading="lazy"/>
    </div>
    <figcaption>Device illustration. We confirm the right setup with you.</figcaption>
  </figure>;
}
