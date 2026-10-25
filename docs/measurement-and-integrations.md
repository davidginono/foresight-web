# Delivery, measurement and editorial handover

On 25 October 2026 the user authorized email delivery within the existing Vite/Vercel project. The bundled endpoint is ready for private SMTP configuration; no live credentials or real emails were used. Analytics remain disabled until separately configured. Redeploy after configuration changes. See [email setup](email-setup.md).

## Form delivery

`VITE_FORM_ENDPOINT` defaults to `/api/enquiries`, served by the same Vercel project and by the Vite development middleware. Configure server-only `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` and optional `INQUIRY_TO`. An explicitly empty endpoint disables delivery. An authorized external HTTPS endpoint can still accept POST FormData using the previous 2xx acceptance contract.

Detailed demo/contact fields: `institution`, `country`, `contact_person`, `role`, `email`, `telephone`, `current_system`, `solution`, `meeting_format`, `preferred_date`, `message`, `contact_permission`, `source_page`. The current-system, date and message fields are optional.

The shared consultation hub on marketing pages, cooperative product pages, Gallery and Training sends `contact_person`, `institution`, `email`, `telephone`, `solution`, `request_type`, optional `message`, `contact_permission` and `source_page`. `request_type` is `consultation`, `demonstration` or `quotation`; solution values retain the product's full title. Cooperative product pages preselect their solution and demonstration intent and preserve their `#product-enquiry` anchor. The number of fields is intentionally smaller than the detailed demo/contact form. The original Gallery/Training callback blocks are replaced at render time; the captured JSON remains unchanged for provenance.

Unavailable SMTP configuration or an unreachable API shows honest unavailable feedback and public contacts. The bundled endpoint validates fields/consent and requires SMTP acceptance before responding `sent:true`. The browser keeps its 15-second timeout, resets only on success and preserves entries on failure. Feedback clears on edits. Only accepted submissions generate sent events, if analytics are separately configured. Consultation-hub acceptances use `enquiry_sent` with `form: consultation`; request type stays in the enquiry payload and is not sent to analytics. See email setup for the limitations of the per-instance throttle and timeout handling.

The consultation section explains that received enquiries are reviewed and followed up to agree the next step. It makes no fixed response-time promise. Keep the existing email/telephone contacts; add a WhatsApp link or service-level commitment only after the owner confirms it.

## Analytics collector

Set `VITE_ANALYTICS_ENDPOINT` to an approved collector accepting JSON POST. Configure origin access and retention at the service. The frontend uses `credentials: omit`, sends no cookies itself, and does not send events when the browser's Do Not Track value is `1`. Do not put secrets into `VITE_` variables; they are public build configuration.

| Event | Meaning |
| --- | --- |
| `page_view` | A route successfully committed. |
| `product_view` | One of the three main cooperative product pages committed. |
| `demo_cta_click` | A demo destination or embedded product-enquiry action was selected. |
| `demo_form_submit` | Browser-valid form submission; `mode` separates preview from connected delivery. |
| `demo_request_sent` | Demo/callback endpoint accepted an enquiry. |
| `enquiry_sent` | Contact or consultation endpoint accepted an enquiry. |

Only `path`, `product`, `form` and `mode` are allowed event properties. Names, email, telephone, institution, member data, message text, query strings and page referrers are not included. The collector may add an ingestion timestamp. Configure aggregate reporting without treating previews or failed requests as sales leads.

## Baseline and monthly review

No historical analytics or CRM baseline was supplied. Record it from the actual current provider or company records; a missing value is unknown, not zero. Use `measurement-baseline.csv` as a blank structure, not as an assertion of business activity.

| Metric from the document | Actual source |
| --- | --- |
| Product visits | Connected `product_view` events. |
| Demo requests | Accepted demo enquiries, deduplicated in the delivery/lead system. |
| Qualified enquiries | Sales review using institution fit and requirements; not inferred from browser clicks. |
| Demonstrations held | CRM or meeting records. |
| Quotations issued | Sales/proposal records. |
| Sales conversions | Confirmed sales records. |
| Search visibility | Authorized search-console impressions/clicks and indexing reports. |

Record the baseline period, review monthly, compare equivalent periods and set targets only after the baseline exists. Website analytics alone cannot establish whether meetings occurred or sales closed.

## Editorial cadence

The initial resources contain five substantive planning guides from the document's proposed topics. They contain no invented customer evidence or release claims. Review approximately two useful articles each month, with a named business owner responsible for accuracy. Release announcements need release/version evidence; events need an actual confirmed schedule; case studies need client permission. Archive dated announcements rather than presenting them as current.

Before posting country-specific pages, validate jurisdictional reporting, product availability, integrations and local delivery/support arrangements with the relevant technical and business owners.
