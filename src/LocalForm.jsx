import { useEffect, useRef, useState } from "react";
import { attributesToProps } from "html-react-parser";
import { track } from './analytics.js';
import { company } from './siteContent.js';

export function LocalForm({ attributes, children }) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const feedback = useRef(null);
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT;
  useEffect(()=>{if(submitted || result)feedback.current?.focus();},[submitted,result]);
  async function submit(event) {
    event.preventDefault();
    if(sending)return;
    const kind=attributes['data-inquiry-form'] || 'callback';
    track('demo_form_submit', {path:location.pathname,form:kind,mode:endpoint?'connected':'preview'});
    if (!endpoint) { setSubmitted(true); return; }
    const form = event.currentTarget;
    setSending(true);
    setResult(null);
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),15000);
    try {
      const response = await fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" },signal:controller.signal });
      if (!response.ok) throw new Error("Unable to send");
      setResult({sent:true,text:"Thank you. Your message was sent. Our team will contact you."});
      track(kind==='contact'||kind==='consultation'?'enquiry_sent':'demo_request_sent',{path:location.pathname,form:kind});
      form.reset();
    } catch {
      setResult({sent:false,text:`Message not sent. Email ${company.sales} or call +255 272 979 004.`});
    } finally { clearTimeout(timeout);setSending(false); }
  }
  return <form {...attributesToProps(attributes)} onSubmit={submit} aria-busy={sending} onChange={()=>{if(submitted)setSubmitted(false);if(result)setResult(null);}}>
    {!endpoint && <p className="ux-form-notice">Preview only — messages are not sent. Email <a href={`mailto:${company.sales}`}>{company.sales}</a> or call <a href="tel:+255272979004">+255 272 979 004</a>.</p>}
    <p className="ux-form-help">Fields marked <span aria-hidden="true">*</span> are required.</p>
    <fieldset className="local-form-fields" disabled={sending}>{children}</fieldset>
    {sending && <p role="status">Sending your message…</p>}
    {submitted && <p ref={feedback} tabIndex={-1} className="local-form-feedback" role="status">Message not sent in this preview. Email <a href={`mailto:${company.sales}`}>{company.sales}</a> or call <a href="tel:+255272979004">+255 272 979 004</a> for help.</p>}
    {result && <p ref={feedback} tabIndex={-1} className="local-form-feedback" data-submission-status={result.sent?'success':'error'} role={result.sent?'status':'alert'}>{result.text}</p>}
  </form>;
}
