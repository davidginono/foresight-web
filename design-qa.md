# Foresight recreation QA

## 25 October 2026: first-page image loading

Initial page reveal now waits for the logo and hero image to decode, alongside staged route styles, with a six-second image deadline. Navigation cancellation releases that wait. The same original homepage photograph uses its existing 266,516-byte WebP instead of the 2,139,351-byte JPEG. Logo preload and explicit dimensions prevent late discovery and layout shifts. Hero frames retain their existing parallax backgrounds with contained loading/unavailable artwork until decoding completes.

Verified locally in the in-app browser: reload completes with a decoded hero, no opening loader remains, Home → Contact → Home retains working imagery, and blocking the homepage hero produces an unavailable state with accessible page content instead of a stuck opening loader. Blocking and cache overrides were reset. Mobile at 390 × 844 loads with no horizontal overflow; the viewport was reset. Screenshot: `qa/first-page-image-loader-fixed.png`. Production build and all 33 tests pass, including cached decoding, network/decode failures, stalled downloads and canceled navigation. No deployment is claimed.

## 25 October 2026: interactive particle body background

Source visual truth: `C:/Users/USER/Desktop/Foresight/reference/particle-wave-reference.png` (1015 × 352 pixels), copied from the user's selected attachment. Scope is its dotted, flowing ribbon effect integrated into the existing website, not a replacement for the page layout or typography. The effect is a functioning procedural canvas; the reference is not used as a static image pretending to be interactive.

Implementation evidence: `qa/particles-desktop.png` (1425 × 866 captured pixels, requested CSS viewport 1440 × 900, actual inner viewport 1440 × 900 and content width 1425), `qa/particles-mobile.png` (375 × 812 captured pixels, CSS viewport 390 × 844 and content width 375). Browser DPR was approximately 1. The capture service omits scrollbar/browser framing pixels. The side-by-side `qa/particles-comparison.png` contains the original source at 1015 × 352 and the desktop capture scaled proportionally to a 1015-pixel-wide pane, without stretching. The reference contains only a background effect; the implementation intentionally includes the site's foreground. These are not identical full-page designs or animation timestamps.

Comparison history: the first comparison (`qa/particles-comparison-before.png`, with `qa/particles-desktop-before.png`) found two P2 issues: the small, faint dots were weak on wide screens, and compressed folds merged into thin rays. Responsive dot sizing and stronger navy shading now make the ribbon visible; a positive minimum ribbon width prevents the line-like compression. The revised comparison was opened beside the source in a single contact sheet and shows rounded dots across a continuous broad wave. The lower opacity than the standalone reference is intentional behind readable page content.

Fidelity surfaces: DM Serif Display/Jost, heading hierarchy and copy remain unchanged. Section sizes, cards, navigation spacing and photo crops remain unchanged; only a 44-pixel fixed pause/resume control is added. Navy particles complement the existing orange/navy palette and white/blue/cream surfaces. Original photographs remain above the particle layer and are not tinted or obscured. Particle quality was checked in both full desktop and focused mobile hero captures; these views make the dot shape and text overlap readable without another crop. There are no new raster assets, icons, claims or product copy substitutions.

Interaction checks in the in-app browser: live frame hashes change while running and remain identical when paused. Keyboard Space resumes the animation. A pointer-move input exercises the ripple response without blocking links. Reduced-motion emulation produces a static frame and hides the animation control; repeated static captures remain identical. Home → Contact navigation retains one canvas and the paused state. Training loads one canvas and all three original video cards. Desktop and mobile have no horizontal overflow, and browser error logs are empty. The canvas has `pointer-events:none` and `aria-hidden:true`; section content, photographs and forms are layered above it. Mobile uses fewer dots, rendering is capped at 30 frames per second, and visibility cleanup cancels the animation loop; hidden-tab suspension is implemented but was not separately emulated in this pass.

Implementation checklist: source compared, P2 visibility/fold issues fixed and recaptured, desktop/mobile inspected, pause/resume and reduced motion checked, existing media/navigation retained. Remaining P3: no low-power-device or non-Chromium performance benchmark was run. Local preview remains open; no hosted deployment is claimed.

final result: passed

## 23 October 2026: customer-focused consultation hub

**Final result: passed.** Implemented the user's supplied replacement copy and form reference (`C:/Users/USER/AppData/Local/Temp/codex-clipboard-a74bbd96-7384-4959-a2d8-47ab8234760d.jpg`). The shared section uses “Let’s Talk About Your ICT Needs”, the institution-focused subheading and benefit paragraph, three practical consultation/demo/quotation paths, a next-step explanation and existing email/telephone contacts. The form includes visible labels for name, institution, business email, phone and solution, a request-type choice, optional priorities and contact consent. Product pages preserve the `#product-enquiry` destination and preselect the relevant solution and demonstration intent. Detailed `/request-demo/` and `/contact-us/` forms remain available. Gallery and Training's original callback blocks are replaced at render time without rewriting source captures.

The reference's pale form surface, white rounded fields and prominent orange action are retained within the existing navy/orange/cream website. Desktop uses two content columns and two short-field columns; mobile stacks them. Visible labels, consent, optional priorities, and the honest preview notice supplement the reference for accessibility and delivery clarity. A fixed reply time or WhatsApp account was not supplied, so neither is asserted. Initial comparison found inherited styles could override white inputs and affect legacy-page typography; explicit form/section scoping corrected both.

The flow under test is: Home → consultation section → choose consultation/demo/quotation → complete institution/contact/solution fields → submit → show preview feedback, or show success only after endpoint acceptance and a recoverable error on failure.

Chrome/Playwright used the approved fallback because the Browser plugin is not available. Production checks at `http://127.0.0.1:4173/` covered Home, About, Services, Technology, Testimonials, Gallery, Training and all three cooperative product pages. The new section appears once per page; old callback wording and premature feedback are absent. Page identity, meaningful content, no framework overlay, clean production console, screenshots and form interactions pass. Layout checks at 1440, 1024, 768, 390 and 320 pixels pass without horizontal overflow or controls escaping the form. Native labels/radio groups, required-field validation, all three intent choices, preview submission, feedback clearing on edit and product preselection pass.

An isolated local development configuration and Playwright-intercepted requests verified pending/disabled controls, institution/solution/intent payloads, success only after a 2xx acceptance, successful reset, failure feedback, retained values on failure, and no success on error. No live enquiry or real business data was sent; the normal preview keeps delivery and analytics disabled. The temporary mock server was stopped after verification. `npm run build`, all 21 `npm test` checks and all four `npm run test:sites` checks pass, including the required Sites outputs.

Screenshots and browser results are outside the repository at `C:/Users/USER/AppData/Local/Temp/foresight-consultation-qa/` (`consultation-1440.png`, `consultation-390.png`, `form-390.png`, `consultation-mobile-viewport.png`, `responsive.json`, `production.json`, and mock accepted/failed form evidence). Full element captures hide only the fixed header/skip link to avoid screenshot stitching artifacts; actual viewport captures retain them. Other browser engines and real delivery/response-time performance were not tested. Authorized backend details, WhatsApp destination and any response-time commitment remain business inputs.

## 23 October 2026: running client logos and displayed-logo counter

Source: the approved eight-logo strip in `src/content/testimonials.json` and the user's clarification that the number should count displayed logos. `src/Testimonials.jsx` now loops the eight original logos continuously and counts from zero to eight when the section first enters view. Decorative loop copies are hidden from assistive technology and excluded from the count. Existing testimonial wording, all nine attributions and the two homepage statements remain unchanged.

The flow under test is: Testimonials → scroll to Our Clients → number counts up to eight and logos move → pause/resume or use previous/next and keyboard arrows → reduced motion gives a static list and immediate final number.

Browser plugin not available; used bundled Chrome/Playwright with the previously approved fallback. Checked the production preview at `http://127.0.0.1:4173/testimonials/` at 1440 × 1000, 390 × 844 and 320 × 740, plus the local development build for the final screen-reader adjustment. Checks passed for page identity, meaningful content, no framework overlay, clean console, loaded local logos, visible counter progression, automatic movement, seamless loop boundary, pause/resume, hover/focus pause, offscreen pause, touch controls, keyboard arrows, manual reduced-motion scrolling, live reduced-motion changes and no horizontal page overflow. The accessible list contains exactly eight items, and a static accessible count avoids announcing each animation frame. Home → Testimonials → Home navigation retains two homepage and nine full-page statements and cleans up the section animation.

The production build, all 21 automated tests and all four Sites checks pass. Required `dist/client/index.html`, `dist/server/index.js` and `dist/.openai/hosting.json` are present. Screenshots and detailed browser results are saved outside the repository in `C:/Users/USER/AppData/Local/Temp/foresight-clients-qa/`. The original design used a manual-only strip after restoration; this mismatch is now fixed. The counter intentionally describes displayed logos, as clarified by the user, rather than the source's unsupported active-client total. Other browser engines and live business integrations were not tested in this focused change.

## 22 October 2026: supplied section references

**Source visual truth**

- Mobile-app reference: `C:/Users/USER/AppData/Local/Temp/codex-clipboard-fa708145-996f-48dd-ba1e-10a8409c02e5.png` (1261 × 454).
- Popular-services reference: `C:/Users/USER/AppData/Local/Temp/codex-clipboard-be5ec3e7-3c19-4a01-b117-79e8a26c8533.png` (1260 × 459).
- Both images are partial desktop section captures. The authorized scope is their section color, content and composition within the existing responsive website, retaining the phone scroll entrance and existing routes.

**Rendered evidence and normalization**

Chrome/Playwright was used with the existing approved fallback because the Browser plugin is not available. CSS viewports were 1261 × 1000, 768 × 1000, 390 × 1000 and 320 × 1000, device scale factor 1. Element captures use natural document height and remain at 1:1 CSS/pixel density. The sticky header and skip link are hidden only in element screenshots to prevent unrelated fixed controls covering the section; their live behavior is unchanged.

- Full section screenshots: `C:/Users/USER/AppData/Local/Temp/foresight-section-colors/services-1261.png`, `app-home-1261.png`, and corresponding 768/390/320 captures. SACCOS and Technology app sections have their own captures in the same directory.
- Same-input, side-by-side comparisons: `comparison-services.png` and `comparison-app.png` in that directory. The source's unrelated white top strips (15px / 33px) were removed; the matching upper 444px / 421px of each rendered section was placed alongside without scaling. The services source is one pixel narrower than the implementation.
- Focused typography, product titles, photographic crops, paragraph wrapping and orange/navy fills were inspected within those readable comparisons. Full element captures additionally verify the download control, qualification, promotional caption and retained links omitted by the partial source crops.
- Reduced motion was enabled for settled comparison captures. Native/fallback motion was verified separately in `C:/Users/USER/AppData/Local/Temp/foresight-phone-slide/results.json` (12 route/width/driver combinations, zero errors).

**Comparison history and findings**

1. [P2, fixed] Initial product titles used the site's generic Jost styling, and the services image row started lower than the supplied composition. `initial-comparison-services.png` records the mismatch. Restored the original local Roboto title treatment and tightened section/heading spacing. The revised `comparison-services.png` confirms the three unboxed photographs, centered white product labels, centered heading and matching navy fill.
2. [P2, fixed] Initial app body typography differed from the reference and changed paragraph wrapping. `initial-comparison-app.png` records that version. Applied the original local Open Sans body face at 18px and refined the heading scale; the revised `comparison-app.png` confirms the supplied paragraph and white download heading against the sampled orange background.
3. Expected content differences: only the working Google Play destination is displayed; the reference's iOS badge still has no approved listing. The participating-institution qualification and promotional-artwork caption remain. The full phone is retained in its frame, while the source image captures a partially scrolled/cropped phone. Useful other-business links remain below the three product photographs, beyond the source's cropped bottom edge.

**Required fidelity surfaces**

- Fonts/typography: original local Jost heading, Open Sans app explanation, and Roboto product labels; readable wrapping without truncation across the tested widths.
- Spacing/layout: three desktop photo columns and centered titles, no white card boxes; app copy and phone side by side on desktop and stacked on smaller screens. Backgrounds and anchor targets remain stable.
- Colors/tokens: sampled source navy `#323850` and orange `#fe6200`; white text on those requested panels. Homepage supporting sections alternate white, pale blue and warm cream. This visual check is not a WCAG conformance certification.
- Image quality/assets: all three original photographs, original phone artwork and original Google Play asset load locally, with reserved dimensions and existing loading/error handling. No generated or approximated product imagery was introduced.
- Copy/content: supplied download heading and explanation, original product titles and destinations, useful business links and both approved partner destinations retained. Existing qualification and evidence-dependent gaps remain in force.

**Verification checklist**

- [x] Correct titles, meaningful rendered content and no framework overlay.
- [x] All three orange app sections checked at four viewport widths; no horizontal overflow.
- [x] Three original product destinations, five other-business links, both partner destinations and the Google Play destination verified.
- [x] Clicking Cooperative Union commits the correct route in all four viewport checks.
- [x] Phone moves sideways and settles with native and fallback drivers; reduced motion restores static artwork.
- [x] Console/runtime checks report no errors; production build and all 21 automated tests pass.

No actionable P0/P1/P2 findings remain in the scoped changes. Other browser engines and actual store installation are outside this verification.

final result: passed

## Subsequent UX improvements

The user subsequently requested a UX review and implementation. The initial source-fidelity review below describes the recreation before that authorized work.

Current audit evidence was captured at desktop 1440×900 and mobile 390×844 in the approved standalone Chrome/Playwright fallback. Before/after captures and browser results are saved outside the project in `C:/Users/USER/AppData/Local/Temp/foresight-ux-review/`.

1. **Company information:** the source About Us screen had white text on a pale background, repeated headings, empty images and excessive space. Replaced its broken content layout with a readable company overview, mission/vision, core values and direct demo/service links. Preserved the source brand and existing factual company information; no new numerical performance claims were added.
2. **Find a solution:** replaced the unreliable mobile drawer with a scrollable dialog using native expandable groups, visible current-page state, a sticky Close control, keyboard containment, Escape handling and focus restoration. Cooperative products are listed first.
3. **Request a demo:** preview-delivery notice is visible before entry; optional scheduling/institution-size fields are identified; UNION and AMCOS options are available; required fields are marked; mobile fields are full-width with larger type and targets; result feedback receives focus. The browser verified submission with optional fields blank. A real submission endpoint remains necessary for delivery.
4. **Shared accessibility and navigation:** one H1 per reviewed page, main/header/footer landmarks, a skip link, visible keyboard focus, automatic focus on completed route changes, route-loading announcements, larger gallery buttons and reduced-motion-aware carousels. Gallery opening places focus on Close; fullscreen state tracks browser changes.

Browser verification passed for home, About Us, demo, services, gallery and FAQ identity/semantic structure, mobile reflow on the main journey, mobile menu navigation and keyboard closing, optional-field submission, route focus, reduced-motion autoplay, and console health. Production compilation and all seven existing automated checks passed. This is targeted UX verification, not a claim of full WCAG or cross-browser compliance.

## Initial recreation review

Review date: 20 October 2026.

**Scope and source**

24 discovered public routes on https://foresight.co.tz/. The original website, rather than the proposed PDF rewrite, is the visual and content target. Original logos, photos, fonts, icons, and styles are stored locally; 185 source assets were acquired.

Source visual truth: `reference/*-desktop.png`, `reference/*-mobile.png`, captured HTML, `reference/asset-inventory.json`, and gallery `data-settings` in `reference/gallery.html`.

Implementation screenshots: `qa/*-desktop.png`, `qa/*-mobile.png`, `qa/home-preview.png`, `qa/gallery-check.png`, `qa/gallery-lightbox.png`, and form/menu/FAQ state captures.

**Viewports and comparison evidence**

- Desktop CSS viewport: 1265 × 712, deviceScaleFactor 1.
- Mobile CSS viewport: 390 × 844, deviceScaleFactor 1.
- Viewport screenshots use those pixel dimensions; full-page image height follows each document. Early IAB captures include its scrollbar gutter. Core source pages were recaptured with the same standalone Chrome configuration used for implementation checks. No device-density scaling was applied.
- Combined inputs: `qa/compare-home-desktop.png`, `qa/compare-home-mobile.png`, their full-page counterparts, and corresponding gallery, services, request-demo, FAQ, and About Us comparisons.
- Focused regions: header/hero comparisons at readable size, demo fields, mobile menu, expanded FAQ, and gallery image viewer. Full-page overview comparisons check section order, spacing, media, and footer.
- Gallery source lazy loading was inconsistent during capture. Its documented settings specify 3 desktop columns, 2 tablet columns, 1 mobile column, 3:2 thumbnails, and 4px desktop / 10px smaller-screen gaps. These original settings and original photographs are used locally. `qa/gallery-check.png` verifies the resolved media state.

**Required fidelity surfaces**

- Fonts and typography: original local Jost, Roboto, Open Sans, Raleway and icon fonts; original font sizes, weights, line heights and desktop text wrapping are retained through source styles. Mobile overflow fixes constrain source elements that exceeded the viewport.
- Spacing and layout: original header, hero, framed headings, service cards, section spacing, forms, footer, shadows and radii. The gallery uses the source's responsive grid settings.
- Colors and tokens: original orange, dark blue/gray, pale workspace background, gradients and overlay opacity from the source CSS.
- Assets and image quality: original locally stored files, preserved logo transparency and image crops. No generated replacements or handmade logo/icon approximations. Eight gallery backgrounds are explicitly checked for visible images, beyond file existence.
- Copy and content: original headings, service descriptions, articles, testimonials and contact information. Placeholder service/demo links and clearly misdirected union links point to their corresponding local routes. The PDF's proposed copy was not published.

**Comparison history and fixes**

1. P2: captured Swiper clones and desktop widths were unsuitable at other screen sizes. Removed generated clones and measurements; initialized local Swiper carousels using source settings. Desktop/mobile homepage captures verify the resulting layout.
2. P2: gallery retained source column positions when resized. Implemented a responsive grid using the original gallery settings. Mobile overflow check passes.
3. P2: service dividers, product headings, and article containers extended outside mobile viewports. Constrained the affected elements. AMCOS, vehicle tracking, both articles, services and gallery were rechecked; no remaining overflow was observed.
4. P1: gallery backgrounds were hidden by Elementor's lazy-loading suppression rule despite valid files and links. Mark source containers loaded locally, initialize gallery backgrounds, and mark gallery images loaded. All eight computed backgrounds are present; `qa/gallery-check.png` shows the actual photos.
5. P2: source phone patterns were invalid under current HTML regex syntax, and the source's JavaScript date input needed a local implementation. Preserve required/type validation, use a native date field, and remove the invalid phone pattern. Browser form checks pass with no console errors.
6. P2: FAQ single-open state needed deterministic handling. Summary clicks now close the previously open item. Browser interaction check passes.

**Functional checks**

- All 24 routes rendered in desktop and mobile browser checks; original images resolve locally.
- Internal navigation and direct deep links, desktop service submenu, mobile menu/submenu and close behavior, and browser Back were exercised.
- Required form validation and explicit local-preview submission feedback pass. No production email was sent.
- FAQ expansion and gallery next/previous, zoom, share/download menu, and Escape-to-close pass.
- Browser interaction run reported no page or console errors.
- `npm test`: seven checks pass, covering all routes, local asset references, internal links, CSS image/font dependencies and static-host packaging behavior.
- Production build succeeds. Final output is `dist/client`, with the bundled static-host Worker and hosting metadata.

**Expected differences and limitations**

- This is a React frontend. Form email delivery requires an authorized endpoint; a configurable POST integration is included. Live WordPress administration, analytics and visitor-count service behavior are not copied.
- The source About Us page already has substantial missing styling and three empty image sources. Its content and source presentation were preserved; no replacement marketing layout or unsupported images were invented.
- Autoplay carousel frames and scroll-triggered animation timing vary between captures. The original media and carousel behavior are retained.
- The source has empty social destinations and an unavailable iOS destination; no destinations were invented.

**Follow-up polish**

- P3: revisit the source About Us layout and obsolete source copy as a separately requested redesign.
- P3: wire a real submission endpoint and live visitor-count provider if required for publication.

**Implementation checklist**

- [x] Git repository initialized in the requested folder.
- [x] React/Vite application with 24 public routes.
- [x] Source assets copied locally and dependency references validated.
- [x] Desktop/mobile captures and interaction checks.
- [x] Gallery visible-media verification and responsive corrections.
- [x] Production build and seven automated checks.

final result: passed

## UX and Tailwind follow-up

20 October 2026. This section supersedes the initial review's About Us and animation limitations. The user authorized UX improvements, then required Tailwind, replacement loading/motion and a fix for broken page transitions while preserving the current design and business logic.

- Replaced the inherited broken About Us presentation with a readable company overview using existing company facts, branding and photography.
- Added a scrollable mobile navigation dialog with grouped services, keyboard trapping, Escape and focus return. Improved required/optional field labels, UNION/AMCOS selection, native validation and explicit preview-only feedback. Forms still require a configured endpoint for delivery.
- Integrated Tailwind v4 through Vite, using prefixed utilities without Preflight. Shared layouts and loading/error states use Tailwind; original captured styles preserve the source pages.
- Replaced captured entrance classes with the company-logo reveal, slim loading line, native page transitions, drawer entrance and below-fold reveals. There is no artificial loading delay. Reduced motion disables animation and autoplay; browsers without View Transitions switch content directly.
- Fixed incoming CSS applying to the outgoing page. Styles now load with `media="not all"`; stylesheet activation, body classes and React content commit together. Cancelation guards prevent stale routes from committing. Failed loads retain the current page, offer retry and time out rather than loading indefinitely.
- Restored main content/focus targets on article and update pages. Constrained source full-width sections to include their outer margins, correcting desktop horizontal overflow without clipping content.

Browser evidence is in `%TEMP%/foresight-motion/`: loader, staged navigation, desktop/mobile About and mobile-menu screenshots, `results.json`, and the production route sweep. The audit's earlier before/after screenshots are in `%TEMP%/foresight-ux-review/`. Standalone Playwright with installed Chrome was used after the in-app and Chrome connectors timed out; the user explicitly approved this fallback.

Focused interaction checks pass: slow CSS leaves outgoing page content/body/style context intact; rapid navigation discards stale bundles; Back/Forward remain consistent; blocking a route stylesheet retains the old page and retry recovers; demo feedback and mobile keyboard behavior are preserved; reduced motion stops animations and autoplay. No unexpected console or runtime errors were observed.

Final production validation: all 24 routes pass at 1440 × 900 and 390 × 844 (48 route/viewport checks), including correct document title/body context, exact active stylesheet count, no staged styles left over, one primary heading, a main content target and no horizontal overflow. `npm run build` and all 11 automated tests pass, including four new stylesheet activation, cancellation, failure-cleanup and stale-commit regression checks. This is Chrome-based validation, not an exhaustive cross-browser or WCAG conformance certification.

final result: passed

## Editorial redesign and contact map · 23 October 2026

Selected visual: Option 1, refined with the user’s short-copy and floating-navigation requirements. Source visual truth: `C:/Users/USER/.codex/generated_images/01a167c2-f4c2-70a2-a850-4e98b590375d/exec-b5772300-7141-460d-bfcc-cedbf08cee00.png`.

Evidence directory: `C:/Users/USER/.codex/visualizations/2026/10/23/01a167c2-f4c2-70a2-a850-4e98b590375d/foresight-editorial-evidence/`.

- Source image: 940 × 1672 pixels, normalized to 1440 pixels wide. Final desktop capture: 1440 × 1600 pixels, captured beyond a 1440 × 1000 CSS viewport at 1× density. Compare settled, top-of-page, static states.
- Full-view comparison: `editorial-source-comparison-final.jpg` places source and rendered output together at equal 1440px widths. Focused header/type comparison: `editorial-type-comparison-final.jpg`.
- Final desktop: `editorial-home-desktop-final.png`. Mobile: `editorial-home-mobile-final.png` at 390 × 844. Additional inherited-page evidence: `editorial-route-contact-sheet.jpg`.
- Map reference: `contact-map-user-reference.png`. Rendered map: `editorial-contact-map-final.jpg`; desktop viewport 1440 × 1000, with a separate 390 × 844 mobile width check.

### Findings and fixes

1. The initial display font was too light for the selected concept. Replaced it with locally hosted DM Serif Display, regular and italic. Post-fix evidence is in the final focused comparison.
2. The initial photograph frame was too shallow. Increased its desktop height to match the source proportions, retaining scroll-driven overscan and the actual source photograph. Post-fix evidence is in the final full-view comparison.
3. Captured archive/media routes inherited footer grid minimum widths that overflowed on mobile. Set explicit zero-minimum grid tracks and child widths. All 31 routes subsequently passed the 390px width check.
4. The homepage title clipped at 320px. Reduced its minimum mobile display size and made the narrow-phone logo fit the header. Home, demo form, testimonials and gallery then passed 320px checks without heading clipping or page overflow.
5. Removed the header email/phone ribbon at the user’s explicit request. Footer, contact-page and enquiry contacts remain. Header measured about 77px at desktop after removal; anchor offsets include its sticky top inset.
6. Increased the unique eight-logo loop from 32 to 18 seconds. Counter, decorative duplicates, keyboard/manual controls, pause/resume and reduced-motion behavior remain.
7. Added a responsive Google Maps embed on Contact Us using the original captured query for Maliasili Street, Corridor Area, Themi, Arusha. Verified actual rendered Google map tiles/attribution and its external Maps link. Described as the office area, with a call-before-visiting instruction; no invented coordinates or verified office pin.

### Required fidelity surfaces

- Typography: local serif display headings and the existing local Jost body/UI. Short copy, clear hierarchy, readable controls and stable mobile wrapping. Original approved testimonial wording remains unchanged.
- Spacing/layout: centered editorial hero, broad photograph, floating navigation, generous section spacing, responsive forms and stacked map layout. Original product photographs, other-business links and later media sections intentionally extend the page beyond the concept crop.
- Colors: preserved orange/navy branding, white, pale blue and warm cream sections; orange shared app section.
- Images/assets: original hero/product photographs, device art, phone artwork, Google Play badge, partner logos, all approved testimonials/client logos, gallery originals, training posters and supplied app recording retained. No fabricated staff screenshots or product walkthroughs.
- Copy/content: simpler everyday wording and shorter repeated explanations; concise app/service/form qualifications remain visible. Original capture JSON and testimonial/client data are unchanged.

### Browser verification

Chromium in-app browser; no external browser fallback. All 31 desktop routes checked from top to bottom for meaningful page content, one H1, shared hero, sticky header, image failures, video counts and overflow. All 31 routes checked at 390 × 844 for page layout, menu availability and overflow; four critical surfaces additionally checked at 320px. Evidence: `route-checks-desktop.json`, `route-checks-mobile.json`, `route-checks-small-phone.json`.

Interactions verified: desktop mouse hover persists into dropdown links; Escape dismissal; short 420px viewport dropdown fits; mobile tap-to-expand and Technology/mobile anchor lands below header; required form fields and honest preview submission feedback; gallery open, next, zoom and Escape; supplied app video stays paused until clicked and then plays with controls; YouTube player reaches ready state; eight accessible client logos and nine testimonials; keyboard pause and pointer resume of client loop; normal native photo scroll transform changes with scroll; reduced motion removes decorative photo layers and hero entrance animation. No relevant application console errors in the final checks.

Preservation evidence: `preservation-check.json`. The only removed link instances are the two explicitly removed header-ribbon contacts; their destinations remain elsewhere. Added map links/iframe are authorized restorations. Form field names, required attributes, default values, media source references, original captures and testimonial/client logic remain intact.

Remaining limits: third-party map/video availability depends on those services and connectivity. Real enquiry delivery still awaits an authorized endpoint. No conversion results, exact office pin, staff screenshots, new endorsements or universal support/compliance promises were inferred. Minor raster/font differences from the generated mock remain P3; no actionable P0/P1/P2 findings remain.

final result: passed
