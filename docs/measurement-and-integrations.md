# Delivery, measurement and editorial handover

The user chose to prepare integrations and provide service details later. Both integrations are disabled when their environment values are empty. Rebuild after changing Vite environment values.

## Form delivery

Set `VITE_FORM_ENDPOINT` to an authorized HTTPS endpoint that accepts POST `FormData` and returns a 2xx response only after accepting the enquiry. It must support the website origin, validate input on the server, handle abuse and operate under the owner's retention/access arrangements. No email provider or production recipient has been configured by this task.

Detailed demo/contact fields: `institution`, `country`, `contact_person`, `role`, `email`, `telephone`, `current_system`, `solution`, `meeting_format`, `preferred_date`, `message`, `contact_permission`, `source_page`. The current-system, date and message fields are optional.

The shared consultation hub on marketing pages, cooperative product pages, Gallery and Training sends `contact_person`, `institution`, `email`, `telephone`, `solution`, `request_type`, optional `message`, `contact_permission` and `source_page`. `request_type` is `consultation`, `demonstration` or `quotation`; solution values retain the product's full title. Cooperative product pages preselect their solution and demonstration intent and preserve their `#product-enquiry` anchor. The number of fields is intentionally smaller than the detailed demo/contact form. The original Gallery/Training callback blocks are replaced at render time; the captured JSON remains unchanged for provenance.

An absent endpoint shows a preview notice before entry and explains that submission did not send a message. A configured endpoint has a 15-second timeout and success/failure feedback. Success appears only after a 2xx acceptance and resets the form; failures preserve entered details. Feedback clears when the visitor edits the form. Successful endpoint responses generate the sent event; preview submission and failed delivery do not count as sent requests. Consultation-hub acceptances use `enquiry_sent` with `form: consultation`; the chosen request type remains in the enquiry payload and is not sent to analytics.

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
