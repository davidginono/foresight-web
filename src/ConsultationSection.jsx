import { useLanguage } from './Language.jsx';
import { FileText, Mail, MessagesSquare, MonitorPlay, Phone } from 'lucide-react';
import { InquiryForm } from './InquiryForm.jsx';
import { company } from './siteContent.js';

export function ConsultationSection({id='consultation',product=''}) {
  const { t } = useLanguage();

  return <section id={id} className="strategy-page strategy-section strategy-closing consultation-section e-parent">
    <div className="strategy-width consultation-layout">
      <div className="consultation-copy">
        <p className="strategy-eyebrow">{t("Let’s talk")}</p>
        <h2>{t("How can we help?")}</h2>
        <p className="strategy-lead">{t("Tell us what you need.")}</p>
        <p>{t("Explore software, a demo or a price for your needs.")}</p>
        <p className="strategy-small">{t("For cooperatives, businesses and other institutions.")}</p>
        <ul className="consultation-benefits">
          <li><MonitorPlay size={24} aria-hidden="true"/><div><h3>{t("See a demo")}</h3><p>{t("See the tasks your team needs.")}</p></div></li>
          <li><MessagesSquare size={24} aria-hidden="true"/><div><h3>{t("Ask for advice")}</h3><p>{t("Talk about your daily work and reports.")}</p></div></li>
          <li><FileText size={24} aria-hidden="true"/><div><h3>{t("Ask for a price")}</h3><p>{t("Agree what you need before we quote.")}</p></div></li>
        </ul>
        <div className="consultation-next"><h3>{t("What happens next?")}</h3><p>{t("Once we receive your message, we contact you to agree the next step.")}</p></div>
        <div className="consultation-contacts"><a href={`mailto:${company.sales}`}><Mail size={18} aria-hidden="true"/>{company.sales}</a><a href={`tel:${company.telephone}`}><Phone size={18} aria-hidden="true"/>{company.phone}</a></div>
      </div>
      <InquiryForm consultation product={product}/>
    </div>
  </section>;
}
