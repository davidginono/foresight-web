import { useEffect, useRef, useState } from "react";
import { attributesToProps } from "html-react-parser";
import { track } from './analytics.js';
import { company } from './siteContent.js';

export function LocalForm({ attributes, children }) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const feedback = useRef(null);
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT ?? '/api/enquiries';
  const bundled = endpoint === '/api/enquiries';
  const [ready, setReady] = useState(bundled ? null : Boolean(endpoint));
  useEffect(() => {
    if (!bundled) { setReady(Boolean(endpoint)); return; }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    fetch(endpoint, { headers: { Accept: 'application/json' }, signal: controller.signal, cache: 'no-store' })
      .then(async response => { const configured = response.ok && (await response.json()).configured === true; if (!controller.signal.aborted) setReady(configured); })
      .catch(() => { if (!controller.signal.aborted) setReady(false); })
      .finally(() => clearTimeout(timeout));
    const onTimeout = () => setReady(false);
    controller.signal.addEventListener('abort', onTimeout);
    return () => { controller.signal.removeEventListener('abort', onTimeout); controller.abort(); clearTimeout(timeout); };
  }, [endpoint, bundled]);
  useEffect(()=>{if(submitted || result)feedback.current?.focus();},[submitted,result]);
  async function submit(event) {
    event.preventDefault();
    if(sending)return;
    const kind=attributes['data-inquiry-form'] || 'callback';
    track('demo_form_submit', {path:location.pathname,form:kind,mode:ready?'connected':'preview'});
    if (!ready) { setSubmitted(true); return; }
    const form = event.currentTarget;
    setSending(true);
    setResult(null);
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),15000);
    try {
      const body = new FormData(form);
      if (bundled) body.set('form_type', kind);
      const response = await fetch(endpoint, { method: "POST", body, headers: { Accept: "application/json" },signal:controller.signal });
      if (!response.ok || (bundled && (await response.json()).sent !== true)) throw new Error("Unable to send");
      setResult({sent:true,text:"Thank you. Your message was sent. Our team will contact you."});
      track(kind==='contact'||kind==='consultation'?'enquiry_sent':'demo_request_sent',{path:location.pathname,form:kind});
      form.reset();
    } catch {
      setResult({sent:false,text:`Message not sent. Email ${company.sales} or call +255 272 979 004.`});
    } finally { clearTimeout(timeout);setSending(false); }
  }
  return <form {...attributesToProps(attributes)} onSubmit={submit} aria-busy={sending} onChange={()=>{if(submitted)setSubmitted(false);if(result)setResult(null);}}>
    {ready !== true && <p className="ux-form-notice" role="status">{ready === null ? 'Checking online enquiries…' : 'Online enquiries are not available yet. Please email'} {ready !== null && <><a href={`mailto:${company.sales}`}>{company.sales}</a> or call <a href={`tel:${company.telephone}`}>{company.phone}</a>.</>}</p>}
    {bundled && <div hidden aria-hidden="true"><label>Leave this field empty<input name="website" type="text" autoComplete="off" tabIndex={-1}/></label></div>}
    <p className="ux-form-help">Fields marked <span aria-hidden="true">*</span> are required.</p>
    <fieldset className="local-form-fields" disabled={sending}>{children}</fieldset>
    {sending && <p role="status">Sending your message…</p>}
    {submitted && <p ref={feedback} tabIndex={-1} className="local-form-feedback" role="status">Message not sent. Online enquiries are not available yet. Email <a href={`mailto:${company.sales}`}>{company.sales}</a> or call <a href={`tel:${company.telephone}`}>{company.phone}</a> for help.</p>}
    {result && <p ref={feedback} tabIndex={-1} className="local-form-feedback" data-submission-status={result.sent?'success':'error'} role={result.sent?'status':'alert'}>{result.text}</p>}
  </form>;
}
