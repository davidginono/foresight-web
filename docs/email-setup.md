# Email setup in the existing Vercel project

**Configuration status, 25 October 2026:** owner-supplied settings are stored in ignored `.env.local` and the existing Vercel project's Production environment. SMTP settings use Vercel's Secret type; the public API path uses Config. TLS SMTP authentication succeeded. With the owner's explicit approval, one configuration-test email was sent and accepted by SMTP with no rejected recipients. Inbox arrival has not been independently confirmed. Deployment of the new API is still pending. Never put credential values in this document.

The React/Vite/Tailwind website and `/api/enquiries` deploy together. No separate NestJS application, database, paid service, provider account or analytics integration was added. Nodemailer uses your mail provider's authenticated SMTP. Hosting and email-provider allowances still apply.

## Enter configuration

In the existing Vercel project, open **Settings → Environment Variables**. Add these to **Production**, then redeploy:

| Variable | Value |
| --- | --- |
| `SMTP_HOST` | Your provider's outgoing SMTP hostname. |
| `SMTP_PORT` | `587` for STARTTLS, or `465` for TLS from connection start. |
| `SMTP_USER` | Provider's SMTP login, often the full mailbox address. |
| `SMTP_PASS` | SMTP/app password. Enter directly in Vercel, never in chat or Git. |
| `MAIL_FROM` | A single sender email address authorized by your provider. |
| `INQUIRY_TO` | Optional recipient; defaults to `info@foresight.co.tz` from shared company configuration. |

`VITE_FORM_ENDPOINT` defaults to `/api/enquiries`. If Vercel already defines it as empty, remove that empty variable or set it to `/api/enquiries`. **Never prefix SMTP secrets with `VITE_`.** Redeploy after configuration changes. Keep credentials out of Preview environments unless you want those deployments to send email too.

For local development, copy `.env.example` to `.env.local`, enter values privately and restart `npm run dev`. `.env.local` is ignored by Git. `npm run preview` and Sites hosting are static-only and do not execute this Vercel API.

Provider credentials, app passwords and any sender/domain verification remain owner inputs. No mailbox or MX/SPF/DKIM/DMARC changes were made. Use the mail provider's instructions for domain verification.

## Behaviour and verification

- `GET /api/enquiries` returns only `{"configured":true}` or `{"configured":false}`, without caching. It checks configuration format, not SMTP login or inbox delivery. Missing/unreachable configuration shows an honest unavailable notice and public contacts.
- POST accepts bounded FormData and validates fields, consent, solution, request type and dates. It rejects cross-origin requests, duplicate fields, header injection and a filled honeypot.
- Recipients come only from server configuration. The visitor's validated email is Reply-To, never From or To. Mail is plain text, with no attachments or remote content.
- Success requires SMTP acceptance for the configured recipient and returns `sent:true`. Rejection, invalid input and delivery errors cannot count as success. Failures preserve form entries. SMTP acceptance does not prove inbox arrival; check spam and delivery logs during a real test.
- After configuration, use your own contact details for one clearly labelled test enquiry, confirm receipt and Reply-To. No real email was sent during implementation.

The five-attempt-per-ten-minute IP throttle is **per function instance**, uses bounded memory, resets on cold starts and is not a distributed abuse guarantee. Origin checks and a honeypot supplement it. Platform firewall rules or a separately agreed CAPTCHA can add stronger protection without pretending these checks stop all bots.

SMTP has a ten-second deadline and the browser retains its fifteen-second timeout. There is no durable queue, automatic retry or enquiry archive. Do not automatically retry a timeout: SMTP might already have accepted it. Application code does not log contact details, message contents, credentials or provider errors; hosting/mail providers may retain their own logs.

An explicitly empty `VITE_FORM_ENDPOINT` disables submission. An authorized external endpoint retains the previous POST FormData/2xx contract. The bundled API additionally requires explicit `sent:true`, so an HTML fallback cannot be mistaken for success. Analytics remain separate and disabled.

References: [Vite Functions](https://vercel.com/docs/frameworks/frontend/vite), [Node.js entry points](https://vercel.com/docs/functions/runtimes/node-js), [SMTP on Vercel](https://vercel.com/kb/guide/serverless-functions-and-smtp), [Nodemailer](https://nodemailer.com/smtp).
