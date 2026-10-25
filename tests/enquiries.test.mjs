import test from 'node:test';
import assert from 'node:assert/strict';
import { createEnquiryHandler, mailConfiguration } from '../server/enquiries.js';
import { products } from '../src/siteContent.js';
import fs from 'node:fs';

const env = { SMTP_HOST: 'smtp.example.test', SMTP_PORT: '587', SMTP_USER: 'test', SMTP_PASS: 'test-only', MAIL_FROM: 'website@example.test' };
const valid = { form_type: 'consultation', institution: 'Test institution', contact_person: 'Test Person', email: 'visitor@example.test', telephone: '+255 700 000 000', solution: products[0].title, request_type: 'quotation', message: 'Please discuss reporting.', contact_permission: 'on', source_page: '/training/' };
function request(values = valid, options = {}) {
  const body = new FormData();
  for (const [key,value] of Object.entries(values)) body.append(key,value);
  return new Request('https://www.foresight.co.tz/api/enquiries', { method: 'POST', headers: { origin: 'https://www.foresight.co.tz', ...options.headers }, body });
}
function fixture(result = { accepted: ['info@foresight.co.tz'] }) {
  const messages = [], settings = [], closed = [];
  const handler = createEnquiryHandler({ env, createTransport: options => {
    settings.push(options);
    return { async sendMail(mail) { messages.push(mail); if (result instanceof Error) throw result; return result; }, close() { closed.push(true); } };
  } });
  return { handler, messages, settings, closed };
}

test('readiness reveals no secrets; absent or invalid SMTP fails closed without sending', async () => {
  const handler = createEnquiryHandler({ env: {}, createTransport() { assert.fail('must not send'); } });
  const status = await handler(new Request('https://www.foresight.co.tz/api/enquiries'));
  assert.deepEqual(await status.json(), { configured: false });
  assert.equal(status.headers.get('cache-control'), 'no-store');
  assert.equal((await handler(request())).status, 503);
  assert.equal(mailConfiguration({ ...env, SMTP_PORT: '25' }), null);
  assert.equal(mailConfiguration({ ...env, MAIL_FROM: 'bad\r\nBcc: attacker@example.test' }), null);
  const ready = await fixture().handler(new Request('https://www.foresight.co.tz/api/enquiries'));
  assert.deepEqual(await ready.json(), { configured: true });
});

test('acceptance sends to configured company mailbox with visitor Reply-To and TLS', async () => {
  const f = fixture();
  const response = await f.handler(request({ ...valid, to: 'attacker@example.test' }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { sent: true });
  assert.equal(f.messages[0].to, 'info@foresight.co.tz');
  assert.equal(f.messages[0].replyTo, valid.email);
  assert.equal(f.messages[0].from.address, env.MAIL_FROM);
  assert.match(f.messages[0].subject, /Quotation/);
  assert.match(f.messages[0].text, /Test institution/);
  assert.equal(f.messages[0].html, undefined);
  assert.equal(f.settings[0].requireTLS, true);
  assert.equal(mailConfiguration({ ...env, SMTP_PORT: '465' }).transport.secure, true);
  assert.equal(f.closed.length, 1);
});

test('SMTP rejection or errors never produce success or expose provider details', async () => {
  for (const result of [{ accepted: [], rejected: ['info@foresight.co.tz'] }, new Error('private SMTP credentials')]) {
    const f = fixture(result);
    const response = await f.handler(request());
    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { sent: false, error: 'delivery_failed' });
    assert.equal(f.closed.length, 1);
  }
});

test('rejects missing consent, invalid input, header injection and honeypot spam', async () => {
  for (const patch of [{contact_permission:''},{email:'visitor@example.test\r\nBcc:attacker@example.test'}, {institution:''}, {solution:'unknown'}, {request_type:'other'}, {website:'bot'}, {source_page:'//attacker.test/'}, {preferred_date:'2026-02-30'}, {message:'x'.repeat(5001)}, {telephone:'invalid'}]) {
    const f = fixture();
    assert.equal((await f.handler(request({ ...valid, ...patch }))).status, 400, JSON.stringify(Object.keys(patch)));
    assert.equal(f.messages.length, 0);
  }
  const duplicate = request();
  const body = await duplicate.formData(); body.append('email', 'attacker@example.test');
  assert.equal((await fixture().handler(new Request(duplicate.url, { method:'POST',headers:{origin:'https://www.foresight.co.tz'},body }))).status,400);
});

test('supports detailed contact/demo forms and validates their required fields', async () => {
  for (const form_type of ['demo','contact']) {
    const values = { ...valid, form_type, country:'Tanzania', role:'Manager', meeting_format:'Online demonstration', preferred_date:'2026-11-01' };
    assert.equal((await fixture().handler(request(values))).status,200);
    assert.equal((await fixture().handler(request({ ...values, role:'' }))).status,400);
  }
});

test('rejects foreign/missing Origin, wrong methods, oversized and unsupported bodies', async () => {
  const f = fixture();
  assert.equal((await f.handler(request(valid,{headers:{origin:'https://attacker.test'}}))).status,403);
  const noOrigin = request(); noOrigin.headers.delete('origin');
  assert.equal((await f.handler(noOrigin)).status,403);
  assert.equal((await f.handler(new Request('https://www.foresight.co.tz/api/enquiries',{method:'PUT'}))).status,405);
  assert.equal((await f.handler(request({...valid,message:'x'.repeat(25000)}))).status,413);
  assert.equal((await f.handler(new Request('https://www.foresight.co.tz/api/enquiries',{method:'POST',headers:{origin:'https://www.foresight.co.tz','Content-Type':'application/json'},body:'{}'}))).status,415);
  assert.equal(f.messages.length,0);
});

test('instance throttle expires and prevents excess submissions', async () => {
  let time=0, sent=0;
  const handler=createEnquiryHandler({env,now:()=>time,createTransport:()=>({sendMail:async()=>{sent++;return {accepted:['info@foresight.co.tz']};},close(){}})});
  for(let i=0;i<5;i++)assert.equal((await handler(request())).status,200);
  const limited=await handler(request()); assert.equal(limited.status,429); assert.ok(limited.headers.get('retry-after'));
  assert.equal(sent,5);time=600001;
  assert.equal((await handler(request())).status,200);
});

test('Vercel app-shell rewrite excludes API requests', () => {
  const config=JSON.parse(fs.readFileSync(new URL('../vercel.json',import.meta.url)));
  const fallback=new RegExp(`^${config.rewrites[0].source}$`);
  assert.equal(fallback.test('/api/enquiries'),false);
  assert.equal(fallback.test('/api/missing'),false);
  assert.equal(fallback.test('/training/'),true);
});

test('SMTP implementation and configuration are absent from shipped browser chunks', () => {
  const directory=new URL('../dist/client/assets/',import.meta.url);
  for(const file of fs.readdirSync(directory).filter(name=>name.endsWith('.js'))) {
    const text=fs.readFileSync(new URL(file,directory),'utf8');
    assert.equal(/SMTP_PASS|SMTP_USER|nodemailer/.test(text),false,file);
  }
});
