import { useId } from 'react';
import { ArrowRight } from 'lucide-react';
import { LocalForm } from './LocalForm.jsx';
import { products, otherProducts } from './siteContent.js';

const solutions=[...products.map(p=>[p.title,p.name]),...otherProducts.map(p=>[p[1],p[1]]),['Consultancy / Other','Consultancy / Other']];

export function InquiryForm({ product='', contact=false, consultation=false }) {
  const id=useId();
  const field=(label,name,type='text',required=true,autoComplete)=> <label className="inquiry-field" htmlFor={`${id}-${name}`}>{label}{required?' *':' (optional)'}<input id={`${id}-${name}`} name={name} type={type} required={required} autoComplete={autoComplete} maxLength="200" /></label>;
  if(consultation)return <LocalForm attributes={{class:'strategy-form consultation-form', 'data-local-form':'true', 'data-inquiry-form':'consultation', 'aria-labelledby':`${id}-title`}}>
    <input type="hidden" name="source_page" value={location.pathname}/>
    <h3 id={`${id}-title`}>Talk to our team</h3>
    <p>Tell us how to reach you and what you need.</p>
    <fieldset className="consultation-purpose"><legend>How can we help? *</legend><div className="consultation-choices">
      {[['consultation','Consultation'],['demonstration','Software demo'],['quotation','Quotation']].map(([value,label])=><label key={value}><input type="radio" name="request_type" value={value} required defaultChecked={value===(product?'demonstration':'consultation')}/>{label}</label>)}
    </div></fieldset>
    <div className="inquiry-grid">
      {field('Your name','contact_person','text',true,'name')}
      {field('Institution name','institution','text',true,'organization')}
      {field('Email','email','email',true,'email')}
      {field('Phone number','telephone','tel',true,'tel')}
      <label className="inquiry-field inquiry-full" htmlFor={`${id}-solution`}>Which system? *<select id={`${id}-solution`} name="solution" required defaultValue={product}><option value="" disabled>Select a solution</option>{solutions.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
      <label className="inquiry-field inquiry-full" htmlFor={`${id}-message`}>What do you need? (optional)<textarea id={`${id}-message`} name="message" rows="3" maxLength="5000" placeholder="For example, loans or reports. Leave out private member and account details."/></label>
    </div>
    <label className="inquiry-consent"><input type="checkbox" name="contact_permission" required/> I agree to be contacted about this enquiry. *</label>
    <p className="strategy-small">We use your details to reply. We agree meeting and service details with you.</p>
    <button className="strategy-button consultation-submit" type="submit">Talk to our team<ArrowRight size={18} className="nav-arrow" aria-hidden="true"/></button>
  </LocalForm>;
  return <LocalForm attributes={{class:'strategy-form', 'data-local-form':'true', 'data-inquiry-form':contact?'contact':'demo'}}>
    <input type="hidden" name="source_page" value={location.pathname} />
    <div className="inquiry-grid">{field('Institution name','institution','text',true,'organization')}{field('Country','country','text',true,'country-name')}{field('Contact person','contact_person','text',true,'name')}{field('Your role','role','text',true,'organization-title')}{field('Email','email','email',true,'email')}{field('Telephone','telephone','tel',true,'tel')}{field('Current system','current_system','text',false)}
      <label className="inquiry-field" htmlFor={`${id}-solution`}>Which system? *<select id={`${id}-solution`} name="solution" required defaultValue={product}><option value="" disabled>Select a solution</option>{[...products.map(p=>p.title),...otherProducts.map(p=>p[1]),'Consultancy / Other'].map(p=><option key={p}>{p}</option>)}</select></label>
      <label className="inquiry-field" htmlFor={`${id}-format`}>How would you like to meet? *<select id={`${id}-format`} name="meeting_format" required defaultValue=""><option value="" disabled>Select a format</option><option>Online demonstration</option><option>Visit our Arusha office</option><option>Discuss an onsite visit</option><option>Telephone discussion</option></select></label>
      {field('Preferred date','preferred_date','date',false)}
      <label className="inquiry-field inquiry-full" htmlFor={`${id}-message`}>What do you need? (optional)<textarea id={`${id}-message`} name="message" rows="4" maxLength="5000" placeholder="Tell us about your main tasks or upgrade. Leave out private member and account details." /></label>
    </div><label className="inquiry-consent"><input type="checkbox" name="contact_permission" required /> I agree to be contacted about this enquiry. *</label><p className="strategy-small">We use your details to reply. Leave out private member data. We agree visits and service details with you.</p><button className="strategy-button" type="submit">{contact?'Send enquiry':'Request a demo'}</button>
  </LocalForm>;
}
