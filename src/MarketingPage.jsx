import { useLanguage } from './Language.jsx';
import { company, officeMap, products, otherProducts, implementationSteps, faqs, articles, nativePaths } from './siteContent.js';
import { ImageAsset } from './ImageAsset.jsx';
import { InquiryForm } from './InquiryForm.jsx';
import { MobileAppShowcase } from './ProductMedia.jsx';
import { ArrowUpRight, ArrowRight, UsersRound, Wallet, HandCoins, ChartNoAxesCombined, Cloud, Monitor, DatabaseBackup, Plug, GraduationCap, LifeBuoy, KeyRound, CircleCheck } from 'lucide-react';
import { ApplicationPreview } from './ApplicationPreview.jsx';
import { PageHero as Intro, HeroImageContext } from './PageHero.jsx';
import { heroForPath } from './heroImages.js';
import { PartnerLinks, DeviceArtwork, solutionImages } from './HomeMedia.jsx';
import { Testimonials, ClientLogos } from './Testimonials.jsx';
import { ConsultationSection } from './ConsultationSection.jsx';
export { nativePaths };
const photo='/assets/wp-content/uploads/2024/09/pexels-fauxels-3183190.jpg';

function Buttons({primary='Request a demo', href='/request-demo/'}) {
  const { t } = useLanguage();
  return <div className="strategy-actions"><a className="strategy-button" href={href}>{t(primary)}<ArrowUpRight className="nav-arrow" size={19} aria-hidden="true" /></a><a className="strategy-button strategy-button-secondary" href="/contact-us/">{t("Talk to us")}<ArrowRight className="nav-arrow" size={19} aria-hidden="true" /></a></div>;}
function Section({eyebrow,title,children,id,className=''}) {return <section id={id} className={`strategy-section ${className}`}><div className="strategy-width">{eyebrow&&<p className="strategy-eyebrow">{eyebrow}</p>}{title&&<h2>{title}</h2>}{children}</div></section>;}
function FeatureGrid({items}) {
  const { t } = useLanguage();
  return <div className="strategy-grid">{items.map(([title,body])=>{
  const Icon=/member|farmer|people|institution/i.test(title)?UsersRound:/loan/i.test(title)?HandCoins:/saving|share|deposit|financial|account/i.test(title)?Wallet:/report|information/i.test(title)?ChartNoAxesCombined:/cloud/i.test(title)?Cloud:/office|server|infrastructure/i.test(title)?Monitor:/backup|recovery|record|data/i.test(title)?DatabaseBackup:/training|learn/i.test(title)?GraduationCap:/support|help/i.test(title)?LifeBuoy:/access|role|security/i.test(title)?KeyRound:/connection|integration/i.test(title)?Plug:CircleCheck;
  return <div className="strategy-feature" key={title}><Icon className="feature-icon" size={28} strokeWidth={1.5} aria-hidden="true"/><h3>{t(title)}</h3><p>{t(body)}</p></div>;
})}</div>;}
const popularSolutionTitles=['SACCOS & Microfinance Systems','Cooperative Union Management System','Cooperative AMCOS Management System'];
function SolutionCards() {
  const { t } = useLanguage();
  return <div className="popular-solutions-grid">{products.map((p,i)=><a className="popular-solution" href={`/${p.slug}/`} key={p.slug}><ImageAsset src={solutionImages[p.slug]} alt="" className="solution-card-image" loading="lazy" sizes="(max-width: 767px) calc(100vw - 40px), 420px"/><h3>{t(popularSolutionTitles[i])}</h3></a>)}</div>;}
function Steps() {
  const { t } = useLanguage();
  return <ol className="strategy-steps">{implementationSteps.map(([title,body])=><li key={title}><h3>{t(title)}</h3><p>{t(body)}</p></li>)}</ol>;}
const Closing=ConsultationSection;
function ScopeNote() {
  const { t } = useLanguage();
  return <p className="strategy-note">{t("We confirm modules, reports, connections, setup, cost and support with your team before you start.")}</p>;}

function Home() {
  const { t } = useLanguage();
  return <>
  <Intro eyebrow="Foresight · Computer Resources (T) Limited" title={<>{t("Technology for")} <em>{t("cooperatives")}</em> {t("and institutions")}<span className="editorial-period">.</span></>} photo><p className="strategy-lead">{t("Software for hospitals, pharmacies, SACCOS, microfinance institutions, schools, churches and supermarkets. We also offer point-of-sale (POS) software.")}</p><Buttons /></Intro>
  <Section id="solutions" eyebrow={t("What we're offering")} title={t("Our Solutions")} className="strategy-popular-solutions"><SolutionCards /><div id="other-solutions" className="homepage-other-solutions"><h3>{t("Other business solutions")}</h3><div className="strategy-topic-links">{otherProducts.map(([slug,title])=><a key={slug} href={`/${slug}/`}>{t(title)}<ArrowUpRight className="nav-arrow" size={16} aria-hidden="true"/></a>)}</div></div></Section>
  <Section id="mobile-app" className="strategy-tinted strategy-mobile-app"><MobileAppShowcase /></Section>
  <Section className="strategy-tinted" eyebrow={t("Practical technology")} title={t("Tools for your daily work")}><FeatureGrid items={[
    ['Flexible deployment','Choose a supported cloud or local setup with our team.'],
    ['Mobile access','Members can view supported account details through participating institutions.'],
    ['System integration','Link systems and reports where supported and agreed.'],
    ['Implementation and training','Train your team. Get help under your service agreement.'],
  ]} /><DeviceArtwork /><ScopeNote /><a className="strategy-text-link" href="/technology/">{t("Explore the technology →")}</a></Section>

  <Section id="partners" title={t("Our Partners")} className="strategy-cream"><PartnerLinks /></Section>
  <Section id="client-experiences" className="strategy-testimonials" eyebrow={t("Client experiences")} title={t("What Our Clients Say")}><Testimonials preview /><a className="strategy-text-link" href="/testimonials/">{t("Read all client testimonials")}<ArrowRight className="nav-arrow" size={18} aria-hidden="true"/></a></Section>
  <Section className="strategy-white" eyebrow={t("Helpful guides")} title={t("Plan your next step")}><ArticleCards limit={3} /><a className="strategy-text-link" href="/updates/">{t("Browse all resources →")}</a></Section>
  <Closing />
</>;}

function About() {
  const { t } = useLanguage();
  return <><Intro eyebrow={t("About Computer Resources (T) Limited")} title={t("Technology. People. Partnership.")}><p className="strategy-lead">{t("Software and support for cooperatives and institutions, from our team in Tanzania.")}</p><Buttons /></Intro><Section title={t("Meet your technology partner")} id="experience"><div className="strategy-split"><div><p>{t("Computer Resources (T) Limited is registered in Tanzania. We provide software, setup, training and IT support.")}</p><p>{t("We work with SACCOS, microfinance institutions, unions, AMCOS and other businesses.")}</p><p><strong>{t("Foresight is our software brand.")}</strong>{' '}{t("Computer Resources (T) Limited handles your setup and agreed services.")}</p></div><div className="parallax-photo-frame" data-parallax-photo><ImageAsset src={photo} alt={t("A collaborative working session around a shared desk")} loading="lazy" sizes="(max-width: 767px) calc(100vw - 40px), 620px" /></div></div></Section><Section id="approach" className="strategy-tinted" title={t("Our approach")}><p className="strategy-lead">{t("Help your team manage records and serve members.")}</p><p>{t("We listen, set up the system and train your team. Support follows your agreement.")}</p><FeatureGrid items={[
  ['Our mission','Make daily work and member services easier with practical software.'],
  ['Our vision','Be a trusted partner for cooperatives in Tanzania and East Africa.'],
]} /></Section><Section title={t("The values behind our work")}><FeatureGrid items={[
  ['Integrity','Be open. Keep clear promises.'],['Customer focus','Listen to what your team needs.'],['Quality','Test, set up and maintain with care.'],['Continuous improvement','Keep learning and improving.'],['Partnership','Work together and build trust.'],
]} /></Section><Closing /></>;}

function Product({product:p}) {
  const { t } = useLanguage();
  return <><Intro eyebrow={`${t("Cooperative solutions")} · ${t(p.name)}`} title={t(p.name)}><p className="strategy-lead">{t(p.headline)}</p><p>{t(p.summary)}</p><Buttons primary="See a demo" href="#product-enquiry" /></Intro><Section title={t("Manage your daily work")}><p className="strategy-small">{t("Designed around the work of")}{' '}{t(p.audience)}.</p><FeatureGrid items={p.features} /><ScopeNote /></Section>{p.slug==='saccos-microfinance-system'&&<Section id="application-preview" eyebrow="Foresight Financials" title={t("Watch the member app")}><p>{t("Watch the member app. Check features and access with your SACCO.")}</p><ApplicationPreview /></Section>}{p.slug==='saccos-microfinance-system'&&<Section id="mobile-app" className="strategy-tinted strategy-mobile-app"><MobileAppShowcase /><a className="strategy-text-link" href="/technology/#mobile">{t("Learn about Foresight Financials →")}</a></Section>}<Section title={t("Setup and training")}><p>{t("Together we check devices, hosting, internet, moving records, staff access and support.")}</p><Steps /></Section>{p.slug==='saccos-microfinance-system'&&<Section className="strategy-tinted" title={t("Planning an upgrade?")}><p>{t("New development builds on the existing Oracle-based SACCO system and its business rules.")}</p><p>{t("Ask which version is ready. Check how an upgrade affects your setup and records. Planned features may not be available yet.")}</p></Section>}<Section title={t("See the work your team needs")}><p>{t("Ask us to show your key tasks using examples without real member details. Check what works now and what needs extra setup.")}</p><p>{t("Ask about references where clients have given permission.")}</p><a className="strategy-text-link" href="/resources/prepare-software-demonstration/">{t("Prepare for your demo →")}</a></Section><ConsultationSection id="product-enquiry" product={p.title}/></>;}

function Technology() {
  const { t } = useLanguage();
  return <><Intro eyebrow={t("Technology")} title={t("Work with the right setup.")}><p className="strategy-lead">{t("Choose the setup that fits your team, devices and internet.")}</p></Intro><Section id="cloud" title={t("Cloud & hosting")}><FeatureGrid items={[
  ['At your office','Check servers, power, network, devices and staff access. Confirm the supported setup before buying equipment.'],
  ['In the cloud','Agree internet needs, hosting location, access, upkeep, cost and availability.'],
  ['Backups and recovery','Agree when backups run, where they are kept and how recovery is tested. Set clear responsibilities.'],
]} /></Section><Section id="mobile" className="strategy-tinted strategy-mobile-app"><MobileAppShowcase /></Section><Section id="integration" title={t("Integration & reporting")}><p>{t("Tell us which systems and reports need to work together. We check supported connections before agreeing the work.")}</p><FeatureGrid items={[
  ['Reporting requirements','Check the reports available for your setup and local rules.'],
  ['System connections','Check data, access, testing and upkeep for each connection. Confirm payment and regulatory links separately.'],
  ['Access and security','Agree staff access and safeguards for your setup. Local security and legal needs must be checked.'],
]} /><ScopeNote /></Section><Closing /></>;}

function ArticleCards({limit=articles.length}) {
  const { t } = useLanguage();
  return <div className="strategy-grid">{articles.slice(0,limit).map(a=><a className="strategy-solution" key={a.slug} href={`/resources/${a.slug}/`}><span className="strategy-eyebrow">{t(a.category)}</span><h3>{t(a.title)}</h3><p>{t(a.description)}</p><span className="strategy-text-link">{t("Read the guide →")}</span></a>)}</div>;}

function Resources() {
  const { t } = useLanguage();
  return <><Intro eyebrow={t("Resources")} title={t("Learn. Plan. Choose.")}><p className="strategy-lead">{t("Simple guides and past news.")}</p></Intro><Section title={t("Explore by topic")}><div className="strategy-topic-links"><a href="#education">{t("Cooperative education")}</a><a href="#product-updates">{t("Product updates")}</a><a href="#client-experiences">{t("Client experiences")}</a></div></Section><Section id="education" className="strategy-tinted" title={t("Cooperative education")}><ArticleCards /></Section><Section id="product-updates" title={t("Product updates")}><p>{t("Ask to see the current version. Past news below may describe older features.")}</p><a className="strategy-text-link" href="/saccos-microfinance-system/">{t("Explore the current product information →")}</a></Section><Section id="client-experiences" title={t("Client experiences")}><p>{t("Read what our clients say.")}</p><a className="strategy-text-link" href="/testimonials/">{t("Read client testimonials →")}</a></Section><Section id="archive" className="strategy-tinted" title={t("Announcement archive")}><p>{t("Past news at its original links.")}</p><div className="strategy-grid">{[['Foresight Software Training Seminar','foresight-software-training-seminar'],['General Version Release','general-version-release']].map(([name,slug])=><a className="strategy-solution" href={`/${slug}/`} key={slug}><span className="strategy-eyebrow">{t("Archive · 12 September 2024")}</span><h3>{t(name)}</h3><p>{t("Past news. Ask us for current details.")}</p></a>)}</div></Section><Closing /></>;}
function Article({article:a}) {
  const { t } = useLanguage();
  return <><Intro eyebrow={`${t("Resources")} · ${t(a.category)}`} title={t(a.title)}><p className="strategy-lead">{t(a.description)}</p><p className="strategy-small">{t("A planning guide. Confirm setup and services with our team.")}</p></Intro>{a.sections.map(([title,body])=><Section title={t(title)} key={title} className="strategy-article-section"><p>{t(body)}</p></Section>)}<Section className="strategy-tinted" title={t("Find your system")}><div className="strategy-topic-links">{products.map(p=><a href={`/${p.slug}/`} key={p.slug}>{t(p.name)}</a>)}</div></Section><Closing /></>;}

function Contact({demo=false}) {
  const { t } = useLanguage();
  return <><Intro eyebrow={demo?t("Request a demonstration"):t("Contact our team")} title={demo?t("Let’s find the right fit."):t("Talk to our team.")}><p className="strategy-lead">{demo?t("Tell us what you need. We will plan the demo with you."):t("Ask our Arusha team about software, setup, training or support.")}</p></Intro><Section title={demo?t("Request a demo"):t("Send an enquiry")}><div className="strategy-contact-layout"><InquiryForm contact={!demo} /><aside className="strategy-contact-card"><h2>Computer Resources (T) Limited</h2><p>{company.address}</p><h3>{t("Sales & demonstrations")}</h3><a href={`mailto:${company.sales}`}>{company.sales}</a><h3>{t("Technical support")}</h3><a href={`mailto:${company.support}`}>{company.support}</a><p className="strategy-small">{t("Help follows your service agreement.")}</p><h3>{t("General enquiries")}</h3><a href={`mailto:${company.general}`}>{company.general}</a><a href={`tel:${company.telephone}`}>{company.phone}</a><h3>{t("Office hours")}</h3><p>{t("Monday–Friday, 08:00–17:00 East Africa Time")}</p><a href={officeMap.search} target="_blank" rel="noreferrer">{t("Find us on Google Maps →")}</a><p className="strategy-small">{t("Call before visiting.")}</p></aside></div></Section>{!demo&&<Section id="location" eyebrow={t("Visit us")} title={t("Find us in Arusha.")} className="strategy-tinted"><div className="office-map-layout"><div className="office-map-copy"><h3>{t("Our office")}</h3><p>{company.address}</p><a className="strategy-button" href={officeMap.search} target="_blank" rel="noreferrer">{t("Open in Maps")}<ArrowUpRight className="nav-arrow" size={18} aria-hidden="true"/></a><p className="strategy-small">{t("Call before visiting to confirm directions.")}</p></div><div className="office-map-frame"><iframe title={t("Map of the Foresight office in Arusha")} aria-label={t("Map of the Foresight office in Arusha")} src={officeMap.embed} loading="lazy" width="800" height="440" allowFullScreen referrerPolicy="no-referrer-when-downgrade"/></div></div></Section>}</>;}
function References() {
  const { t } = useLanguage();
  return <><Intro eyebrow={t("Client experiences")} title={t("What Our Clients Say")}><p className="strategy-lead">{t("Hear from the SACCOS using our systems.")}</p></Intro><Section id="testimonials" className="strategy-testimonials"><Testimonials /></Section><Section id="clients" className="strategy-white"><ClientLogos /></Section><Closing /></>;}
function OtherProduct({data:[slug,title,summary]}) {
  const { t } = useLanguage();
  const isBulkSms = slug === 'bulk-sms';
  return <>
    <Intro eyebrow={t("Other Business Solutions")} title={t(title)}>
      <p className="strategy-lead">{t(summary)}</p>
      <Buttons href={isBulkSms ? '#product-enquiry' : undefined} />
    </Intro>
    {slug==='hospital-management-system' && <Section id="system-walkthrough" className="strategy-tinted" title={t("Watch the system walkthrough")}>
      <ApplicationPreview recording="hospital" />
    </Section>}
    {isBulkSms ? <Section title={t("Plan your SMS messages")}>
      <p>{t("Tell us what you want to send, how often and how many people you need to reach. Ask our team about rates, sender names and network coverage.")}</p>
    </Section> : <Section title={t("Is it right for you?")}>
      <p>{t("Tell us about your team and daily work. See a demo. Agree features, setup, connections and support before you commit.")}</p>
      <ScopeNote />
    </Section>}
    <Closing id={isBulkSms ? 'product-enquiry' : undefined} product={isBulkSms ? title : undefined} />
  </>;
}

export function MarketingPage({path}) {
  const { t } = useLanguage();

  let content;
  const product=products.find(p=>path===`/${p.slug}/`), article=articles.find(p=>path===`/resources/${p.slug}/`), other=otherProducts.find(p=>path===`/${p[0]}/`);
  if(product)content=<Product product={product}/>;
  else if(article)content=<Article article={article}/>;
  else if(other)content=<OtherProduct data={other}/>;
  else content=({'/':<Home/>,'/about-us/':<About/>,'/technology/':<Technology/>,'/updates/':<Resources/>,'/testimonials/':<References/>,'/contact-us/':<Contact/>,'/request-demo/':<Contact demo/>,'/faq/':<><Intro eyebrow={t("FAQs")} title={t("Your questions, answered.")}/><Section title={t("Common questions")}><div className="strategy-faq">{faqs.map(([q,a])=><details key={q}><summary>{t(q)}</summary><p>{t(a)}</p></details>)}</div></Section><Closing/></>})[path];
  return <HeroImageContext.Provider value={heroForPath(path)}><main id="main-content" tabIndex={-1} className="strategy-page">{content}</main></HeroImageContext.Provider>;
}
