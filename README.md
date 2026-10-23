# Foresight React website

A React website based on the public foresight.co.tz capture of 20 October 2026, refreshed on 21 October against the user's website-advice PDF. All 24 original routes remain, with seven new technology/implementation/resource routes (31 total). The cooperative-focused rewrite keeps the original orange/navy identity, local assets and working interactions.

## Develop

```sh
npm install
npm run dev -- --port 4173
npm run build
npm test
```

The preview is served at http://localhost:4173. The production client is in `dist/client`. Configure the host to serve `index.html` for application routes. The bundled Worker also supports the Sites build format.

## Structure

- `src/App.jsx` and `src/routeStyles.js`: cancelable lazy routes and atomic content/stylesheet commits, with retry on failed asset loading.
- `src/tailwind.css`: Tailwind v4 utilities, responsive component recipes and shared motion. Preflight is omitted and utilities are prefixed `tw:` so original source styles remain intact.
- `src/PageLoader.jsx`: company-logo entrance and slim in-page loading indicator.
- `src/ImageAsset.jsx`: shared image loading/error states, captured lazy-source resolution and self-contained fallback artwork. `src/imageDimensions.json` reserves each local image's intrinsic dimensions before it loads.
- `src/TrainingVideo.jsx`: restores the captured YouTube training widgets with locally stored original thumbnails, playback on request, loading recovery and direct YouTube links. `src/videoSources.json` records their source and poster provenance.
- `src/parallax.js`: scroll-synchronized photographic parallax and floating app artwork use native view timelines where supported, with direct position updates as the fallback. Image motion has no delayed catch-up after scrolling stops. Section entrances retain frame-rate-aware easing; backgrounds/anchors stay stable, image overscan is measured on layout changes, and reduced motion restores static media without taking over native scrolling.
- `src/PageHero.jsx`, `src/heroImages.js`: shared photographic heroes for every public route, including captured gallery, training and archive pages. Route-specific WebP images in `public/assets/heroes/` are optimized from the original photographs recorded in `heroPhotos`; the home image and its brighter overlay are retained. All hero images use the existing scroll-linked parallax and static reduced-motion fallback.
- `src/ProductMedia.jsx`: original mobile-app promotional artwork and Google Play badge restored on Home, SACCOS and Technology, with two unique original YouTube recordings on Home. The phone artwork slides in from the right with scrolling and settles at the viewport midpoint; reduced motion keeps it static. The three original Training cards remain available. Promotional artwork is labeled as such, not passed off as current staff-system evidence.
- `src/ApplicationPreview.jsx`: user-supplied Foresight Financials mobile application recording on the SACCOS page, with an extracted poster, on-demand playback, native controls and retry feedback. Local assets are in `public/assets/media/`.
- `src/SourcePage.jsx`: source markup rendered as React elements, menus, carousels, navigation and FAQ behavior.
- `src/MarketingPage.jsx`, `src/siteContent.js`: document-led home, cooperative products, About, technology, services, guides, FAQ and enquiry pages. Rewritten routes load shared Tailwind styles and the local Jost font instead of unused captured WordPress CSS.
- `src/SiteChrome.jsx`, `src/MobileMenu.jsx`: one shared navigation hierarchy, Lucide arrow/chevron icons and consistent public contacts across old and new pages.
- `src/InquiryForm.jsx`: institution, country, contact, role, current system, solution and meeting-format qualification.
- `src/metadata.js`, `scripts/prepare-seo.mjs`: unique runtime/build-time titles, descriptions, canonical/Open Graph metadata, Organization data, sitemap and robots file.
- `src/analytics.js`: optional aggregate event collector, disabled until configured; excludes personal form content.
- `src/Gallery.jsx`: image viewer, keyboard navigation, zoom, fullscreen and downloads.
- `src/LocalForm.jsx`: native field validation, local preview feedback, and optional POST integration.
- `src/content/`: captured page content and per-route styling metadata.
- `public/assets/`: original locally stored logos, images, fonts, icons and stylesheets. Source assets are not hotlinked.
- `reference/`: source captures, screenshots, raw asset cache and provenance.
- `qa/`: browser screenshots and verification results.
- `scripts/import-source.py`: regenerate local content from the recorded captures (Python with beautifulsoup4).

The user explicitly authorized the PDF's proposed content changes and necessary design changes. The website now prioritizes cooperative solutions, explains the Foresight/company relationship, removes unsupported statistics and unapproved endorsements, qualifies deployment/mobile/compliance/support promises, provides implementation guidance and five educational articles, and marks historical 2024 announcements as archived. See `docs/document-implementation-review.md` for the recommendation-by-recommendation result and evidence-dependent gaps. Original JSON/captures remain as provenance; replaced marketing copy is not rendered. Do not use the import script to overwrite the document-led publishing layer.

Tailwind is compiled through its Vite plugin and controls the shared UI, loading/error states, navigation layout and responsive About layout. The captured source styles continue to preserve the original page designs. The motion system replaces captured entrance classes with a branded logo reveal, progress line, native page transitions where supported, drawer entrance and below-fold reveals. Reduced-motion preferences disable those animations and carousel autoplay. Navigation stages incoming styles with `media="not all"`, then changes CSS, body context and React content in the same frame. Stale requests are canceled; failed styles retain the current page and offer retry.

## Forms and external services

Forms validate locally. With no endpoint configured they explicitly explain that messages have not been sent. To enable delivery, set `VITE_FORM_ENDPOINT` to an authorized endpoint that accepts POST FormData and returns an HTTP success status. Delivery requires that service's own email, spam protection and validation setup.

Contacts retained by user confirmation: sales, general and support mailboxes, telephone and Maliasili Street office address. Google Play is linked without advertising an unverified iOS download. On 23 October the user confirmed approval of the original nine testimonials and client logos: these are restored on the original testimonials route, with the TCRA/ITV statements also restored on Home. New endorsements, numerical claims, current staff-system screenshots and a staff-system walkthrough still require business evidence. The user-supplied mobile-app recording is included on the SACCOS solution page.

The user requested preparing integrations with details to follow. `VITE_ANALYTICS_ENDPOINT` optionally accepts the documented JSON events; no provider is enabled by default. See `docs/measurement-and-integrations.md` for endpoint contracts, the monthly measurement process and which outcomes need CRM/company records. `docs/measurement-baseline.csv` is an empty template, not measured data.

Use the source branding and content only with the rights or permission required by its owner.
