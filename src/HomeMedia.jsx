import { useLanguage } from './Language.jsx';
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
  const { t } = useLanguage();

  return <div className="homepage-partners tw:grid tw:grid-cols-1 tw:gap-6 tw:md:grid-cols-2">
    {homepagePartners.map(partner=><a key={partner.shortName} href={partner.href} target="_blank" rel="noopener noreferrer"
      className="homepage-partner" aria-label={`${t("Visit website")} · ${t(partner.name)} (${partner.shortName}) · ${t("opens in a new tab")}`}>
      <ImageAsset src={partner.image} alt={`${t("logo")} · ${partner.shortName}`} loading="lazy" width="480" height="555" sizes="180px"/>
      <h3>{t(partner.name)} <span>({partner.shortName})</span></h3>
      <span className="strategy-text-link">{t("Visit website")}<ArrowUpRight className="nav-arrow" size={18} aria-hidden="true"/></span>
    </a>)}
  </div>;
}

export function DeviceArtwork() {
  const { t } = useLanguage();

  return <figure className="homepage-device-art">
    <div className="tw:grid tw:grid-cols-1 tw:gap-6 tw:md:grid-cols-2">
      <ImageAsset src={`${uploads}pngwing.com-1.png`} alt={t("Illustration of a laptop, tablet and mobile phone")} loading="lazy" sizes="(max-width: 767px) calc(100vw - 40px), 620px"/>
      <ImageAsset src={`${uploads}pngegg.png`} alt={t("Illustration of desktop, laptop and handheld devices")} loading="lazy" sizes="(max-width: 767px) calc(100vw - 40px), 620px"/>
    </div>
    <figcaption>{t("Device illustration. We confirm the right setup with you.")}</figcaption>
  </figure>;
}
