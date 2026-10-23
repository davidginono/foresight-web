const allowedEvents = new Set(['page_view', 'product_view', 'demo_cta_click', 'demo_form_submit', 'demo_request_sent', 'enquiry_sent']);
const allowedKeys = new Set(['path', 'product', 'form', 'mode']);

export function safeEvent(name, details = {}) {
  if (!allowedEvents.has(name)) return null;
  return { event: name, ...Object.fromEntries(Object.entries(details).filter(([key,value])=>allowedKeys.has(key) && typeof value === 'string').map(([key,value])=>[key,value.slice(0,160)])) };
}

export function track(name, details) {
  const event = safeEvent(name, details);
  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
  if (!event || !endpoint || navigator.doNotTrack === '1') return;
  // No form values, member data, full URLs, query strings or contact details.
  fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(event), keepalive:true, credentials:'omit' }).catch(()=>{});
}
