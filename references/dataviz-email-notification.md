# Dataviz outside the app: email, notification, and embedded

> Reference for the dataviz-design skill. Load when: designing an email digest/report, a push/Slack/Teams alert, a server-side-rendered chart (PNG for email or a card), a notification deep-link into the dashboard, or embedded/white-label multi-tenant analytics.

## Email rendering constraints: the chart becomes a static image in a 1999 layout

No email client runs JavaScript, and the CSS they support is a fragmented subset: desktop Outlook renders HTML with the Microsoft Word engine (since 2007 — no flexbox, grid, border-radius, position, or reliable max-width), and Gmail clips messages above ~102KB of HTML. The design consequence: every chart in email is a pre-rendered raster image inside a nested-table layout with inline CSS. You lose tooltip, hover, zoom, and drill — everything the dashboard leans on for "details on demand" has to be baked into the pixels or turned into a link.

**Rules:**
- Treat every chart as a pre-rendered static PNG, never inline SVG, canvas, or a JS library, because email clients strip `<script>` and SVG support is inconsistent (Gmail and Outlook don't render inline SVG) — Litmus; Can I Email (Parmentier)
- Keep the email's total HTML under 102KB, because Gmail clips the message at that threshold and hides everything below it behind "[Message clipped]" — the last chart, the CTA, and the unsubscribe link all vanish — Gmail; Litmus; tabular.email 2026
- Build the layout with fixed-width nested tables and inline styles on every element, because desktop Outlook uses the Word engine (no flexbox/grid/border-radius) and several clients drop `<style>` blocks — Email on Acid "How to code emails for Outlook"; Knak 2026
- Don't treat "Outlook" as a single client: only classic Outlook (Windows desktop) uses the Word engine; new Outlook, Outlook.com, Outlook mobile, and Mac all use web engines — design to Word as the mandatory floor, but test both groups — Litmus; Can I Email
- Mark LAYOUT tables with `role="presentation"`, because without it the screen reader announces them as data tables ("table with N columns") and reads the layout grid as if it were content — W3C WAI; Litmus "Email Accessibility"
- Fix the body width at 600–640px, because that's the common denominator of desktop/webmail reading panes; wider charts get cropped or rescaled unpredictably — Campaign Monitor; tabular.email 2026
- Declare explicit width and height on each chart's `<img>`, because with images blocked (the default in Outlook and common in B2B) the client collapses the reserved space and wrecks the layout — Litmus "Email Image Blocking"
- Label values directly on the chart (data labels at the ends, an annotation on the peak) because there is no tooltip: any number that lives in a hover on the dashboard has to be printed into the image or the text beside it — Few 2004's direct-labeling principle applied to a channel with no interaction
- Keep critical text (title, key number, CTA) as live HTML text outside the image, at roughly a 60/40 text-to-image ratio, because image-only emails land in spam, go blank when images are blocked, and are unreadable to a screen reader — Litmus; Email on Acid "bulletproof"
- Build the CTA as a bulletproof button (live text + background-color + VML for Outlook), never a button image, because with images blocked an image button disappears and CTR collapses — Litmus "Bulletproof buttons"; buttons.cm (Campaign Monitor)

**Anti-patterns:** a live dashboard iframe in the email body (no client renders it); an interactive chart exported "as is" whose message depended on the tooltip; a 300KB HTML email (Gmail clips it and the summary at the end is never seen); a single screenshot of the whole dashboard (illegible at 600px, invisible with images blocked, zero accessibility); WebP or SVG as the chart format (desktop Outlook won't display it); a flexbox/grid layout that "worked in Gmail" and collapses into a single broken column in Outlook.

## Dark mode in email: forced color inversion and how to armor the chart

Email clients apply dark mode in three regimes: no change, partial inversion (light backgrounds only), and full inversion (backgrounds and text, including custom colors) — Apple Mail respects your CSS, but the Gmail app and Outlook (mobile and outlook.com) invert by force and ignore media queries. Pixels inside raster images aren't inverted, which makes the chart PNG simultaneously the most stable element (the data colors survive) and the most dangerous (a white-background chart becomes a glaring rectangle on a dark screen). About a third of email opens happen in a dark environment, so this is no edge case.

**Rules:**
- Declare `<meta name="color-scheme" content="light dark">` + `<meta name="supported-color-schemes">` and a `@media (prefers-color-scheme: dark)` block, because it's the only mechanism that gives you control where support exists (Apple Mail, part of Outlook) — Litmus "Ultimate Guide to Dark Mode", 2020
- Export the chart with a SOLID background (not transparent) in the card's color, because clients don't invert image pixels: a solid background freezes the figure-ground contrast you validated; a transparent PNG inherits the inverted background and dark text/axes disappear — Litmus; Email on Acid "Dark Mode for Email"
- If you use a transparent PNG (logos, icons), add a 1-2px light outline/halo around any dark stroke, because on inversion the background turns near-black and navy/black strokes disappear — Litmus dark mode guide, 2020
- Never encode the delta in the red/green of the live text alone: add a sign and an arrow (+12% ▲ / −8% ▼), because full inversion recomputes text colors and can flatten the perceptual difference between the two — WCAG 2.1 criterion 1.4.1 (use of color) + full-invert behavior documented by Litmus
- Test the email across all three regimes — Apple Mail (respects CSS), the Gmail app (partial/full inversion with no media query), and Outlook.com/mobile (aggressive full inversion) — before sending, because each produces a different result from your HTML — Litmus; Campaign Monitor "Dark Mode in Email"
- Choose data colors that pass ≥3:1 contrast against both the light background and the card's solid dark background (a "dual-safe" palette), because the same image will be seen in both contexts — WCAG 1.4.11 applied to the channel; Litmus
- Avoid large areas of pure white (#FFFFFF) in the chart PNG; use the theme's tinted (light-gray) background instead, because a white block in a dark client glares and gives away the "pasted-in" look — Email on Acid dark mode; Datawrapper's practice of a slightly tinted background

**Anti-patterns:** a transparent PNG with navy axes and labels (invisible in Gmail dark); trusting `@media (prefers-color-scheme: dark)` to solve everything (the Gmail app ignores it); a red/green stoplight as the sole encoder in live text that will be inverted; testing only in Apple Mail and calling it done; two image versions (light/dark) swapped via a media query in a client with no support — half the users see the wrong one.

## Anatomy of the email digest: BAN + delta + sparkline, one insight per block

A metrics digest is not a shrunken dashboard: it's a few seconds of linear reading, scanned top to bottom, with no exploration. The unit of composition is the number-first block — label, big number (BAN), delta with direction and period, an optional sparkline, and a one-sentence takeaway — and the whole email is a shallow stack of those blocks ordered by decision relevance. The chart, when there is one, plays second fiddle to the number, not the other way around.

**Rules:**
- Structure every block in the fixed sequence label → value → delta → period ("5xx errors — 47 — ▲12% vs previous week"), because a consistent anatomy lets you scan N blocks without re-reading; a value with no comparison is not an insight — Few, Information Dashboard Design, 2006; IBCS 1.2 (comparison required on every reported number)
- Limit the digest to 3-5 metrics with a "see all" link to the dashboard, because working memory holds ~4 chunks and each extra block dilutes the ones before it — Cowan 2001 (4±1); Few 2006
- One insight per block, with a one-sentence takeaway in business language ("the drop is concentrated in SP"), because the digest reader doesn't explore — the author does the interpreting — Knaflic, Storytelling with Data, 2015; Greg Meyer, "Build a better email digest", 2023
- Put the insight in the subject line ("Requests dropped 18% this week"), not "Weekly Report #34", because the subject is the most-read line — sometimes the only one — and decides the open — VandeHei/Allen/Schwartz, Smart Brevity, 2022
- Order the blocks by deviation/urgency (biggest anomaly first), never alphabetically or by schema order, because in linear reading position 1 gets disproportionate attention — Few 2006 (emphasis by position); Knaflic 2015
- Sparkline: word-sized, no axes or gridlines, one color, with the last point marked and (optionally) min/max highlighted, placed immediately after the number it contextualizes, because a sparkline is a "word-sized graphic" for trend, not an analytical chart — Tufte, Beautiful Evidence, 2006
- Render the BAN and the delta as live HTML text (not an image), with tabular-figure fonts and right-alignment when in a column, because text survives blocked images and dark mode, and tabular figures line the magnitudes up — Litmus image blocking; Few, Show Me the Numbers, 2004
- If a block carries a chart, use a single simple type (line chart or bar, ≤2 series) per block, with the takeaway already annotated on the image, because at 600px with no interaction any dense chart turns to noise — Knaflic 2015; Wilke, Fundamentals of Data Visualization, 2019

**Anti-patterns:** a digest with 20 KPIs (a spreadsheet by email that no one reads); a delta with no reference ("+12%" — against what? since when?); a sparkline with axes, gridlines, and a legend; a generic "Weekly Report" subject repeated every week (trains the reader to ignore it); a dashboard screenshot as the body; blocks with anatomies that differ from one another — it breaks the scan.

## Alerts in push/Slack/Teams: from number to context without an interactive chart

An alert is the most compressed format of dataviz: it has to carry "what broke, why it matters, what to do" on a surface that truncates to 1-2 lines (push) or into a fixed grammar of blocks (Slack Block Kit, Teams Adaptive Cards). It should be designed for the first on-call reader, not for whoever wrote the rule. There is no interactive chart: context comes from number + threshold + comparison in text, optionally a server-side image, and always a deep-link.

**Rules:**
- Write the alert around three pillars — what broke (metric + observed value + threshold breached), why it matters (impact/SLO), and what to do (action/runbook link) — because the reader is the on-call responder, not the rule's author — Grafana Alerting best practices, 2024-2026
- Make the first line self-sufficient with metric + value + delta ("Pipeline: 0 records processed today, expected ~140"), because push truncates at the first ~40-90 characters and the Slack notification preview shows a single line — Knock, "Guide to designing Slack notifications", 2024
- In Slack, use a header for the insight, a section with fields for metric-value pairs (max 10 fields, rendered in 2 columns), a context block for timestamp/source, and 2-3 buttons in the actions block — no more, because an obvious, limited action is what converts — Slack, "Designing with Block Kit"
- In Teams, use a FactSet for key-value pairs and TextBlock with size/weight for hierarchy; supply images at 2x with a transparent background, because the card renders in Teams' light/dark/high-contrast themes — Microsoft, "Designing Adaptive Cards for your app"
- Standardize a fixed severity vocabulary with emoji/symbols (🔴 critical / 🟡 warning / ▲▼ direction) redundant with the text, because Block Kit and push give you no control over type color and emoji is the only reliable chromatic channel — Slack Block Kit; WCAG 1.4.1
- Alert only on what requires action and group/deduplicate repeated firings (throttle, an "x3 in the last hour" summary), because a non-actionable alert trains the team to mute the channel — Google SRE Book, ch. 6 "Monitoring Distributed Systems", 2016 (every page should be actionable)
- If you need a visual trend, generate a server-side PNG and attach it via an image block with alt_text filled in — the mini-chart shows "where the number came from" (the last 7-30 points, threshold marked), not the full analysis — Slack API image block; Tufte 2006 (sparkline as context)
- Close every alert with a "View in dashboard" button/link pointing to the exact state (see the deep-link subtopic below), because the card is a hook, not a destination — Grafana annotations (`__dashboardUid__`/`__panelId__`)

**Anti-patterns:** "Threshold exceeded on metric X" with no value, no threshold, no link; dumping the webhook's JSON payload into the channel; a card with 6 buttons and 3 menus; a daily noise alert no one acts on (fatigue: the critical one dies with it); a screenshot of the whole dashboard as the card image (illegible on mobile); severity expressed only by attachment/border color (invisible to color-blind users and in high-contrast).

## Server-side-generated charts: headless rendering, retina, and mandatory alt text

Every email/Slack/PDF chart is born in a server-side renderer (a headless browser via CDP, or a native canvas like resvg/sharp/ECharts-SSR) and travels as a bitmap decoupled from the app. That imposes three disciplines: pixel density (render at 2x and display at the logical size), self-sufficiency (title, source, and date inside the image, because it will be forwarded on its own), and accessibility (the alt text is the only non-visual representation left).

**Rules:**
- Render at 2x the display size (devicePixelRatio=2 in headless/Chart.js) and fix the logical width in the HTML, because retina/HiDPI screens double the density and a 1x PNG shows up blurry exactly where the thin axis text is — Chart.js docs "Device Pixel Ratio"; retina-in-email practice (Martech Zone)
- Write alt text with the formula "[chart type] of [data], where [takeaway]" — e.g., "Line chart of p95 latency by week, where the last week drops 18% after 6 weeks of rise" — because a screen reader reads linearly and with no going back; describe the message, not the pixels — Amy Cesal, "Writing Alt Text for Data Visualization", Nightingale, 2020
- Install/embed the theme's exact font in the headless environment (the container image doesn't ship the theme fonts by default), because a font fallback changes text metrics and silently truncates/misaligns labels — Puppeteer/ECharts SSR practice; Rendex 2026
- Wait for a deterministic "render complete" signal (a library event, fonts.ready, network idle) and turn off entrance animations, because a fixed sleep captures bars halfway there and empty axes — headless practice (Puppeteer/Playwright); Rendex 2026
- Size typography for the final display size: labels ≥12px at the logical size (~600px of email), thickening strokes to match, because a chart designed for full screen and then shrunk becomes illegible text — Wilke, Fundamentals of Data Visualization, 2019 ("your axis labels are almost always too small")
- Use PNG for charts (never JPEG), because lossy compression creates artifacts on high-contrast edges — exactly lines, text, and axes; JPEG only for photography — Wilke 2019, ch. 27 (image formats)
- Include the title, a subtitle with the takeaway, the data source, and the cut-off timestamp INSIDE the image, because the PNG will be forwarded, downloaded, and pasted outside the HTML that contextualized it — Cairo, The Truthful Art, 2016 (provenance); Datawrapper's self-contained export practice
- Solid background in the theme's color (never transparent) for the dark-mode reason: image pixels aren't inverted, and transparency inherits an unpredictable background — Litmus dark mode, 2020

**Anti-patterns:** a blurry 1x screenshot on any phone; `alt="chart.png"` or empty alt on the email's only content; `sleep(5000)` and hope — intermittently captures half-rendered charts; a chart with no embedded title/date that becomes an "orphan screenshot" forwarded in a thread; rendering the app's dark theme into a light-background email (visual paste-in); serving the image from an auth-gated bucket — the email client has no session and shows a broken image.

## Text as fallback: when the sentence beats the image in the channel

In degraded channels (images blocked by default in Outlook, image-less push/SMS, screen readers, hostile dark mode), live text is the only element that always arrives — and for one or two magnitudes it's objectively better than a chart even without any degradation. The channel decision precedes the chart decision: first ask whether a sentence with the number does the job; the chart enters when there's a temporal pattern or a multi-category comparison that the sentence can't carry.

**Rules:**
- With 1-2 numbers, use plain text/a BAN with a few supporting words instead of a chart, because the chart adds ink and distance without adding information ("just because you have numbers doesn't mean you need a chart") — Knaflic, Storytelling with Data, 2015, ch. 2
- If the message is "nothing changed", say it in one line ("All stable: 5 metrics within range") and suppress the charts, because a flat line takes 400px of vertical space to communicate one word — an application of Tufte's data-ink principle, The Visual Display of Quantitative Information, 1983
- Write each block's headline as a sentence with the value embedded ("New orders: 47, +12% vs previous week") in live text, because with images blocked — the Outlook default and common in B2B — the sentence is all that's left — Litmus, "Email Image Blocking"
- When the reader needs exact values across a few rows (a statement, a top-5), use a native HTML table instead of a chart-image, because a table serves lookup of individual values and a chart serves pattern — and an HTML table is live text that always renders — Few, Show Me the Numbers, 2004
- Style the chart image's alt text (style with color and background on the `<img>`) to repeat the takeaway, because in clients that block images the styled alt becomes a readable "text card" in the reserved space — Litmus, "Ultimate Guide to Styled ALT Text", 2021
- In push/SMS, compose "metric + value + delta + period" in up to ~120 characters with the critical data in the first 40, because the banner truncates and there's no second paragraph — Knock/Courier notification guides, 2024
- Never put the key number inside the image without repeating it in text, because that hides it simultaneously from image-blockers, screen readers, and the email client's search — Litmus; WCAG 1.1.1

**Anti-patterns:** a two-slice pie chart to communicate "62% vs 38%" (a sentence would do); a BAN rendered as an image (invisible when blocked, not indexable, not copyable); a 100%-image email (high spam score, blank screen in Outlook, mute to the screen reader); a vague sentence with no number ("performance improved significantly"); a straight-line chart of 7 identical points taking up the digest's main block.

## Deep-link from email/alert to the live state: continuity with no dead end

Email, push, and card are the capture surface; the dashboard is where the investigation happens. The contract between the two is the deep-link with serialized state: whoever clicks a number should land on the dashboard already filtered to the same slice (period, filter, entity) that produced that number. A link to the home or to the dashboard in its default state is a dead end — it forces the user to manually rebuild the context the alert already had.

**Rules:**
- Make each number/chart in the message link to the dashboard with the SAME slice serialized in the URL (period, filters, entity), because landing on the default forces the user to re-derive the context and many give up — Grafana Alerting (DashboardURL/PanelURL with `__dashboardUid__`/`__panelId__`); Shneiderman 1996 (details-on-demand requires a continuous path from overview to detail)
- Freeze the period in the link with absolute timestamps (from=2026-07-10T08:00&to=...), not relative windows ("last 24h"), because someone clicking days later needs to see what triggered the alert, not the now — Grafana's practice of time range in the URL for alert notifications
- Make sure the deep-link survives login: after authenticating, redirect to the original state (next=/dashboard?region=SP&from=...), because a login that discards the destination and dumps the user on the default dashboard is the most common dead end — Nielsen's "visibility of system status / user control" heuristic, 1994, applied to an authenticated flow
- One primary CTA per message ("View in dashboard"), with discreet secondary links in text, because multiple equivalent buttons split the click and bury the main action — Slack Block Kit guidelines (2-3 actions max); email CTA practice
- On landing via an alert, show a marker of the event on the dashboard (a banner "you came from alert X of Jul 10" or a vertical annotation on the chart at the moment of firing), because the user needs to confirm they're looking at the same phenomenon — Grafana annotations linking alert to dashboard
- Correctly encode filter values with spaces/accents in the querystring and test the round-trip (URL → state → URL), because a deep-link that breaks on "São Paulo" is a silent continuity bug — URL-state practice (HX-Push-Url/history API)
- Instrument the links with origin (utm or a channel parameter), because without measuring which digest block drives clicks you don't know which metrics deserve the top — product practice (Knock/Courier notification analytics, 2024)

**Anti-patterns:** a link to the app's home or the login screen with no redirect back; an alert about Tuesday linking to the dashboard in "last 7 days" (the spike has already left the window); no link at all (the alert describes a state the user can't visit); a deep-link to a view the recipient's role/RLS can't see (403 as a dead end); a state URL that isn't stable/shareable (state only in the front-end's memory).

## Scheduled report: cadence, A4 page, and the boundary with export

A scheduled report is a recurring, paginated editorial artifact — not a frozen dashboard and not a data export. Its value lies in comparability from edition to edition (same structure, same notation, same scale) and in the message: IBCS requires every report to "say something" (Say), not merely show numbers. It differs from the export covered in dashboard-typology: an export pulls data from the current state for external analysis, whereas a scheduled report packages interpretation into paper/PDF for a decision cadence. The paginated-report mechanics live elsewhere; what's specific to this channel is how the report is delivered by email.

**Rules:**
- Cadence↔decision, paginated A4 layout, frozen notation/scale across editions, message-first summary, and data cut-off stamp follow references/dashboard-typology.md (reporting cadence and export/print/PDF sections) — do not restate here.
- In the email that delivers the report, put the number-first summary in the body (not just "see attached"), because some recipients decide from the first screen whether to open the attachment — Smart Brevity, 2022; digest practice

**Anti-patterns:** confusing it with an export — raw CSV when they wanted a read, or a narrative PDF when they wanted data.

## Embedded analytics and white-label: multi-tenant theming, iframe vs SDK, RLS as a design constraint

Dataviz embedded in a third party's product (or white-label multi-tenant) has to look native to the host — theme, font, locale — without sacrificing the chart's semantics or the data's security. The three structuring decisions: the embed mechanism (iframe = isolation and speed; SDK/components = deep integration and cross-filtering), per-tenant token theming, and row-level security applied server-side — which isn't just backend: RLS changes what the chart is allowed to show, and the design has to assume subsets, empties, and per-tenant scales.

**Rules:**
- Separate the DATA palette from the tenant's BRAND color: brand tokens dress the chrome (navbar, buttons), but semantic colors (negative/positive, sequential, diverging) come from your own validated scale, because a red-branded tenant can't have "red = the brand's neutral" colliding with "red = decline" — Few, "Practical Rules for Using Color in Charts", Perceptual Edge, 2008
- Automatically validate the contrast of tenant themes (text ≥4.5:1, graphical elements ≥3:1) at token intake, because you don't control the colors the white-label client picks and the illegible chart will be "your product's fault" — WCAG 2.1, 1.4.3/1.4.11
- Apply RLS at the query layer (BI/DB, with a signed token carrying the tenant), never by hiding elements on the front end, because a client-side filter is bypassable and leaks data across tenants — Holistics "Embedded Analytics for SaaS", 2026; Omni 2026
- Design empty and partial states as first-class citizens, because with RLS every tenant sees a subset: a chart with 0 rows or 1 category is a normal scenario and needs an explanatory message + an action, not a white area that looks like a bug — Wexler/Shaffer/Cotgreave, The Big Book of Dashboards, 2017; embedded practice
- Choose an iframe when analytics is an add-on (ship in days, CSS/JS isolation, branding via theme); choose the SDK/components when analytics is core to the workflow and needs the host's native cross-filtering, routing, and auth — Sumboard "iFrame vs SDK", 2026; Preset 2026
- In the iframe: sync height via postMessage/ResizeObserver (no double scroll), propagate the host's light/dark theme, and pass the tenant's locale/timezone/currency, because an ambiguous 07/12 date and the wrong decimal separator destroy trust in the number — IBCS 1.2 (consistent formatting); embed practice
- Audit metadata leakage: tooltips, drill, CSV export, auto-generated titles, and URLs must not expose internal IDs, names, or aggregates of other tenants (a "global top 10" in a single-tenant embed is a leak) — end-to-end RLS principle (Holistics 2026)
- Compute axis scales and "top N" within the tenant's slice, never globally, because an axis sized by the largest customer in the base reveals competitors' order of magnitude and flattens the small tenant's chart — a design consequence of RLS (embedded guides 2026)
- Use a signed embed with short expiry (JWT/signed URL per session and tenant), never a "public unlisted" dashboard, because a guessable URL is the embedded version of the editable-querystring filter — signed-embedding practice (Looker/Metabase)

**Anti-patterns:** a tenant identified by an editable URL parameter (?tenant_id=42) with no signed token; the tenant's brand palette applied as a diverging scale (institutional red read as "bad"); a visible "Powered by <vendor>" in a white-label contract; a fixed-height iframe with an internal scroll inside the page scroll; a CSV export that queries without the embed's RLS predicate; the BI's default font and number format clashing with the host; a generic empty state ("No data") that doesn't explain the tenant's slice has no records yet.

## Sources

- Litmus, "Ultimate Guide to Email Image Blocking"; "Guide to Bulletproof Buttons", 2021-2024; "The Ultimate Guide to Dark Mode", 2020 (updated); "The Ultimate Guide to Styled ALT Text in Email", 2021
- Email on Acid, "How to Code Emails for Outlook", 2024; "Master the Art of Dark Mode Email Design", 2023
- Rémi Parmentier, caniemail.com (CSS/HTML support matrix by client), 2019-
- tabular.email, "Email Template Size Guide", 2026
- Campaign Monitor, "The Developer's Guide to Dark Mode in Email", 2021; buttons.cm
- W3C, WCAG 2.1 (criteria 1.1.1, 1.4.1, 1.4.3, 1.4.11), 2018
- Edward Tufte, Beautiful Evidence, 2006; The Visual Display of Quantitative Information, 1983
- Stephen Few, Information Dashboard Design, O'Reilly, 2006; Show Me the Numbers, Analytics Press, 2004; "Practical Rules for Using Color in Charts", Perceptual Edge, 2008
- Cole Nussbaumer Knaflic, Storytelling with Data, Wiley, 2015
- Claus O. Wilke, Fundamentals of Data Visualization, O'Reilly, 2019
- Alberto Cairo, The Truthful Art, New Riders, 2016
- IBCS Association, International Business Communication Standards 1.2 (SUCCESS: Say, Unify, Check), 2021
- Jim VandeHei, Mike Allen, Roy Schwartz, Smart Brevity, 2022
- Greg Meyer, "Build a better email digest", Data Operations, 2023
- Nelson Cowan, "The magical number 4 in short-term memory", BBS, 2001
- Slack, "Designing with Block Kit", docs.slack.dev, 2024
- Microsoft, "Designing Adaptive Cards for your Teams app", Microsoft Learn, 2024
- Grafana Labs, "Alerting best practices"; "Labels and annotations", 2024-2026
- Beyer, Jones, Petoff, Murphy (eds.), Site Reliability Engineering, O'Reilly, 2016 (ch. 6, based on Rob Ewaschuk, "My Philosophy on Alerting")
- Knock, "The PM's guide to designing Slack notifications" / "Best practices for Slack notifications", 2024
- Ben Shneiderman, "The Eyes Have It: A Task by Data Type Taxonomy", IEEE VL, 1996
- Jakob Nielsen, "10 Usability Heuristics", 1994
- Chart.js docs, "Device Pixel Ratio" (devicePixelRatio configuration)
- Rendex, "Render a Chart to an Image on the Server", 2026
- Amy Cesal, "Writing Alt Text for Data Visualization", Nightingale/Medium, 2020
- Holistics, "Embedded Analytics for SaaS: A Practitioner Guide", 2026
- Sumboard, "iFrame vs SDK for Embedded Analytics: The Real Trade-offs", 2026
- Preset, "Open Source Embedded Analytics: Choosing a White-Label BI Platform", 2026
- Steve Wexler, Jeffrey Shaffer, Andy Cotgreave, The Big Book of Dashboards, Wiley, 2017
