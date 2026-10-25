import nodemailer from 'nodemailer';
import { company, products, otherProducts } from '../src/siteContent.js';

const MAX_BODY = 24 * 1024;
const emailPattern = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;
const solutions = new Set([...products.map(p => p.title), ...otherProducts.map(p => p[1]), 'Consultancy / Other']);
const fields = ['institution','country','contact_person','role','email','telephone','current_system','solution','meeting_format','preferred_date','message','contact_permission','source_page','request_type','form_type','website'];
const reply = (body, status = 200, headers = {}) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

export function mailConfiguration(env) {
  const port = Number(env.SMTP_PORT || 587);
  const from = env.MAIL_FROM?.trim();
  const to = (env.INQUIRY_TO || company.general).trim();
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS || !from
    || ![465,587].includes(port) || !emailPattern.test(from) || !emailPattern.test(to)) return null;
  return {
    transport: { host: env.SMTP_HOST, port, secure: port === 465, requireTLS: true,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      connectionTimeout: 4000, greetingTimeout: 4000, socketTimeout: 7000,
      disableFileAccess: true, disableUrlAccess: true },
    from: { name: company.name, address: from }, to,
  };
}

function validate(form) {
  const values = {};
  for (const key of fields) {
    const entries = form.getAll(key);
    if (entries.length > 1 || entries.some(value => typeof value !== 'string')) return null;
    const value = (entries[0] || '').trim();
    if (value.length > (key === 'message' ? 5000 : 200) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)
      || (key !== 'message' && /[\r\n]/.test(value))) return null;
    values[key] = value;
  }
  if (!['consultation','contact','demo'].includes(values.form_type)
    || !values.institution || !values.contact_person || !emailPattern.test(values.email)
    || !/^[+\d() .-]{5,40}$/.test(values.telephone) || !solutions.has(values.solution)
    || !['on','true'].includes(values.contact_permission)
    || !/^\/(?!\/)[^\s?#]*$/.test(values.source_page)) return null;
  if (values.form_type === 'consultation') {
    if (!['consultation','demonstration','quotation'].includes(values.request_type)) return null;
  } else if (!values.country || !values.role || !['Online demonstration','Visit our Arusha office','Discuss an onsite visit','Telephone discussion'].includes(values.meeting_format)) return null;
  if (values.preferred_date && (!/^\d{4}-\d{2}-\d{2}$/.test(values.preferred_date)
    || !Number.isFinite(Date.parse(values.preferred_date))
    || new Date(values.preferred_date).toISOString().slice(0,10) !== values.preferred_date)) return null;
  return values;
}

async function readForm(request) {
  const type = request.headers.get('content-type') || '';
  if (!/^(multipart\/form-data;|application\/x-www-form-urlencoded(?:;|$))/i.test(type)) throw new Error('type');
  if (Number(request.headers.get('content-length')) > MAX_BODY) throw new Error('size');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('empty');
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY) { await reader.cancel(); throw new Error('size'); }
    chunks.push(value);
  }
  return new Request(request.url, { method: 'POST', headers: { 'Content-Type': type }, body: Buffer.concat(chunks) }).formData();
}

// This small in-memory throttle is per function instance, not a distributed limit.
// It needs no extra hosting service. Platform firewall rules can supplement it.
export function createEnquiryHandler({ env = process.env, createTransport = nodemailer.createTransport, now = Date.now } = {}) {
  const attempts = new Map();
  return async request => {
    const config = mailConfiguration(env);
    if (request.method === 'GET') return reply({ configured: Boolean(config) });
    if (request.method !== 'POST') return reply({ sent: false }, 405, { Allow: 'GET, POST' });
    if (request.headers.get('origin') !== new URL(request.url).origin) return reply({ sent: false }, 403);
    if (!config) return reply({ sent: false, error: 'unconfigured' }, 503);
    const time = now();
    for (const [key, entry] of attempts) if (entry.expires <= time) attempts.delete(key);
    const ip = request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for') || 'local';
    const entry = attempts.get(ip) || { count: 0, expires: time + 600000 };
    if (entry.count >= 5 || (!attempts.has(ip) && attempts.size >= 1000)) return reply({ sent: false, error: 'rate_limit' }, 429, { 'Retry-After': '600' });
    entry.count++; attempts.set(ip, entry);
    let form;
    try { form = await readForm(request); }
    catch (error) { return reply({ sent: false, error: 'invalid_request' }, error.message === 'size' ? 413 : error.message === 'type' ? 415 : 400); }
    // Never acknowledge a trapped submission as delivered.
    if (form.get('website')) return reply({ sent: false, error: 'invalid_request' }, 400);
    const values = validate(form);
    if (!values) return reply({ sent: false, error: 'validation' }, 400);
    const intent = { consultation: 'Consultation', demonstration: 'Software demonstration', quotation: 'Quotation' }[values.request_type]
      || (values.form_type === 'demo' ? 'Software demonstration' : 'Enquiry');
    const text = [`${intent} request from the Foresight website`, '', ...fields.filter(key => values[key] && !['website','form_type'].includes(key)).map(key => `${key.replaceAll('_',' ')}: ${values[key]}`)].join('\n');
    let transport, timeout;
    try {
      transport = createTransport(config.transport);
      const result = await Promise.race([
        transport.sendMail({ from: config.from, to: config.to, replyTo: values.email,
          subject: `Foresight: ${intent}`, text, disableFileAccess: true, disableUrlAccess: true }),
        new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('timeout')), 10000); }),
      ]);
      if (!result.accepted?.some(address => address.toLowerCase() === config.to.toLowerCase())) throw new Error('not accepted');
      return reply({ sent: true });
    } catch {
      // Provider errors and personal enquiry contents must not enter public logs/responses.
      return reply({ sent: false, error: 'delivery_failed' }, 502);
    } finally { clearTimeout(timeout); transport?.close(); }
  };
}

export const handleEnquiry = createEnquiryHandler();
