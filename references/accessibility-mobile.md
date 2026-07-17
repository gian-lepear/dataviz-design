# Accessibility and responsive design in dataviz

> Reference for the dataviz-design skill. Load when: shipping/auditing a chart or dashboard that must work on mobile/touch, pass WCAG, be navigable by keyboard/screen reader, or choosing a renderer (SVG/canvas) by point count.

## Chartability: the POUR+CAF audit framework for dataviz

Chartability (Frank Elavsky, with Cynthia Bennett and Dominik Moritz, EuroVis/Computer Graphics Forum 2022) is the only framework of testable heuristics specific to data-visualization accessibility: ~50 heuristics organized into 7 principles — WCAG's 4 (Perceivable, Operable, Understandable, Robust) plus 3 dataviz-specific extensions of its own (Compromising, Assistive, Flexible). It covers visual, motor, vestibular, neurological, and cognitive disabilities — not just blindness. It works both for designing and for auditing: the shortlist is the 14 tests flagged as critical (minimum target = 0 critical failures), runnable in 20–40 minutes, and here it is — **Perceivable:** low contrast, visual-only encoding (no redundant text/shape), small text, seizure risk from flashes; **Operable:** interaction through a single input type (mouse only), no interaction cues/instructions, controls that override those of assistive technology; **Understandable:** no explanation of purpose or of how to read it, no title/summary/legend, inappropriate reading level; **Compromising:** no alternative data table; **Assistive:** inappropriate data density, tedious navigation/interaction; **Flexible:** the user's style/preference not respected. (Robust has no critical test of its own.)

**Rules:**
- Audit every new chart against the 14 critical tests listed above before shipping, because in 20–40 min they cover the most frequent blockers (contrast, alt text, keyboard operation, non-reliance on color, seizure risk) — Elavsky, Chartability, 2021/v2 2022
- Treat the 4 POUR principles as the floor and the 3 CAF ones as the differentiator: Compromising = the accessible solution must not degrade anyone's experience (e.g., a data table available to everyone, not just to the screen reader); Assistive = the chart actively cooperates with assistive technology; Flexible = the user can adjust (contrast, size, motion) — Elavsky et al., "How accessible is my visualization?", EuroVis 2022
- Check accessibility in EVERY state of the chart (hover, selection, filter applied, empty, error), not just the initial state, because interactions create new states that break contrast and focus — Elavsky, Chartability (Operable principle), 2022
- Offer the data in more than one modality (visual + table + text), because no single representation serves low vision, blindness, cognition, and motor at once — Elavsky, Chartability (Flexible principle), 2022
- Honor prefers-reduced-motion: turn off chart entrance animation and morphing transitions when the OS asks, because motion triggers vestibular discomfort — Chartability (perception/vestibular criteria), 2022; WCAG 2.3.3
- Don't invent your own chart-accessibility review process from scratch: Chartability has already compiled WCAG standards, research, and community practice into a single checklist — Elavsky, chartability.fizz.studio, 2022

**Anti-patterns:** Auditing only the HTML page with axe/Lighthouse and assuming the chart passed (automated tools don't see data encoding, only the DOM); treating accessibility as a "version for the blind" while ignoring motor (touch target), vestibular (animation), and cognitive criteria; building a hidden "separate accessible version" — it violates the Compromising principle; auditing only the default state and ignoring tooltips, filtered states, and drill-downs.

## WCAG applied to charts: 3:1 contrast for graphics, 4.5:1 for text, never color alone

WCAG has exact numbers that apply directly to graphical marks: SC 1.4.11 (Non-text Contrast, AA) requires 3:1 between graphical objects that carry information and the adjacent colors; SC 1.4.3 requires 4.5:1 for text (labels, values, axes) and 3:1 for large text (≥24px or ≥18.5px bold); SC 1.4.1 forbids color as the only way to tell series apart. The gotcha: "adjacent colors" includes both the background AND the neighboring marks — touching pie slices need 3:1 against each other, lines against the background.

**Rules:**
- Ensure 3:1 between each bar/line/slice and the chart background, because data marks are "graphical objects required to understand the content" — W3C, WCAG 2.1 SC 1.4.11, 2018
- On pie/donut and stacked bars, add a white gap (a 1–2px stroke in the background color) between adjacent segments, because touching segments would otherwise need 3:1 against each other and the gap removes that requirement — W3C, Understanding SC 1.4.11, 2018
- Lines in a line chart need 3:1 against the background but NOT against each other (overlap is momentary); decorative gridlines are exempt — use that to keep gridlines subtle (~#ddd) without violating anything — W3C, Understanding SC 1.4.11, 2018
- If each mark carries a visible text value (a direct label on the bar), the graphical-object contrast requirement drops — the official exception: "a graphic with text conveying the same information" is exempt; direct labeling is a conformance route — W3C, Understanding SC 1.4.11, 2018
- Axis labels, values, and annotations: 4.5:1 against the background; never use gray lighter than ~#767676 on white, because that is the exact 4.5:1 limit — W3C, WCAG SC 1.4.3, 2008/2018
- Distinguish series by more than one channel — color + shape marker, color + dash pattern, or a direct label at the line end — because 1.4.1 forbids color as the sole differentiator and ~4.5% of the population has color vision deficiency (8% of men) — W3C, WCAG SC 1.4.1; Wilke, Fundamentals of Data Visualization (redundant coding ch.), 2019
- Tooltips that appear on hover must be dismissible (Esc closes them), hoverable (the pointer can move into the tooltip), and persistent (they don't disappear on their own), because that's the trio required by SC 1.4.13 — W3C, WCAG 2.1 SC 1.4.13, 2018
- Test the layout at 200% zoom and a 320px viewport: chart text must stay legible without horizontal page scroll (the chart may have its own internal scroll — the two-dimensional-layout exception) — W3C, WCAG SC 1.4.4 and 1.4.10, 2018

**Anti-patterns:** A corporate pastel palette with bars at 2:1 against a tinted light background — pretty and illegal under AA; light yellow/gold as a data color on a light background with no text label — it almost never reaches 3:1; a legend distinguishing 6 series by hue alone; dark gridlines "to pass contrast" (a gridline is decorative and exempt — darkening it only adds noise, violating Tufte's data-ink without gaining conformance); a tooltip that closes when the mouse tries to enter it (violates 1.4.13) or that exists only on hover with no keyboard equivalent.

## Respect the user's environment: flashes (2.3.1), motion, and forced-colors

The OS and the browser carry the user's accessibility preferences — seizure safety, less motion, forced high contrast. Chartability's Flexible principle (and its critical test "the user's style not respected") requires the chart to honor that environment instead of imposing its own. Two of these are matters of health, not taste: a flash above the threshold can trigger a seizure, and a chart that distinguishes series only by fill color collapses into a single block when the OS forces the palette.

**Rules:**
- Nothing in the chart may flash more than 3× per second — this covers an alert blink, an animated looping point/line, a blinking live-update cursor, and bursty transitions — because above that there is a photosensitive-seizure risk; it's Level A, covers the whole page, and saturated red has an even lower threshold — W3C, WCAG SC 2.3.1 Three Flashes or Below Threshold (A), 2008/2018
- Map Chartability's critical "seizure risk" test to this SC: if an alert indicator flashes, swap the flashing for a persistent color/icon change or cap it at ≤3 flashes/s, because flashing is the one audit item that causes immediate physical harm, not just discomfort — Elavsky, Chartability (Perceivable/seizure), 2022; W3C SC 2.3.1
- Beyond turning off the entrance animation with prefers-reduced-motion (see the Chartability section), also suppress state-to-state morphing transitions and the auto-scroll/auto-play of a panel carousel when reduced-motion is active, because the vestibular trigger is large on-screen movement, not just the entrance — W3C, WCAG SC 2.3.3 Animation from Interactions, 2018
- Style `@media (forced-colors: active)`: use `currentColor` and the system-color keywords (`CanvasText`, `Canvas`, `LinkText`, `Highlight`/`HighlightText`) on the marks, the axis, and the focus ring, because in that mode the OS discards the SVG's `background` and `fill` and the series color vanishes — without it the chart flattens into a single block — MDN, forced-colors; Microsoft Edge team, "Styling for Windows High Contrast", 2020
- Under forced-colors, reading comes to depend on a redundant channel (hatching/dash pattern/shape marker/direct label), not hue — the same requirement as 1.4.1 and IBCS notation; the palette and the redundancy logic are owned by color.md — see color.md; W3C SC 1.4.1
- Test by actually turning on Windows High Contrast Mode (or emulating forced-colors in DevTools), because it's the only way to see the flattened SVG; "it has good contrast" in the normal theme doesn't predict the forced-colors flattening — MDN, forced-colors

**Anti-patterns:** An alert badge that blinks "to grab attention" (violates 2.3.1 and is the physical-harm item on the list); an animated morph between filters that ignores prefers-reduced-motion; series that differ only by `fill` color, indistinguishable under forced-colors; hardcoded hex `background`/`fill` that survives forced-colors and covers the system text; declaring something "accessible" without ever having opened Windows High Contrast.

## Alt text for charts: the formula type + variables + trend + link to the data

Chart alt text doesn't describe pixels, it describes the insight. Amy Cesal's canonical formula (Nightingale, 2020): "[Chart type] of [type of data] where [reason for including the chart]" — and Datawrapper adds: make the raw data available via a link in the surrounding text. Lundgard & Satyanarayan's research (IEEE VIS 2021) refines this: descriptions have 4 semantic levels (1: construction/axes, 2: statistics/extremes, 3: trends and perceptual patterns, 4: domain context) and blind readers rank levels 2–3 as the most useful — level 1 on its own is nearly useless.

**Rules:**
- Write the alt in the formula "chart type + what the data is + why the chart is here", e.g.: "Line chart of price in USD/kWh for renewables and fossil fuels, 2010–2023: in 2020 solar became cheaper than fossil fuels" — Amy Cesal, "Writing Alt Text for Data Visualization", Nightingale, 2020
- Prioritize level 2–3 content (extremes, trend, key comparison) over level 1 (axes and encoding), because blind readers rated trends and statistics as the most useful content and mere construction description as the least — Lundgard & Satyanarayan, "Accessible Visualization via Natural Language Descriptions", IEEE VIS, 2021
- Put the takeaway a sighted reader gets in 5 seconds ("X doubled since 2020") into the alt, because the purpose of alt is insight parity, not pixel parity — Datawrapper Academy, "How to write good alternative descriptions", 2021
- Keep the alt short (~125–150 characters as a practical target; older screen readers fragment beyond that) and move the long description to visible text or aria-describedby — Cesal, Nightingale, 2020; WebAIM, Alternative Text
- Always offer a path to the underlying data (a link to a table/CSV in the page body), because no alt can hold every value and the SR user needs to be able to verify exact numbers — Datawrapper Academy, 2021; Chartability (Robust), 2022
- On a self-updating dashboard, write generic-structural alt ("daily evolution of campaign clicks over the last 30 days") + dynamic values generated from the data, because static alt becomes a lie on the second refresh — Datawrapper Academy, 2021
- Don't write "image of" or "chart showing" as a dead prefix — the screen reader already announces "image/img"; start straight at the type and the finding — WebAIM, Alternative Text; Cesal, 2020
- The chart's title and subtitle should carry the message (a declarative headline, not a variable label), because they are read by everyone, including SR, before the alt — Knaflic, Storytelling with Data, 2015; Datawrapper Academy

**Anti-patterns:** alt="chart" or alt="chart.png" — worse than empty; pure level-1 alt ("the X axis shows months…") with no trend or number; dumping the entire table (50 values) into the alt attribute instead of linking the data; static alt on a dynamic chart; trusting automatic LLM-generated alt without reviewing the cited number — a numeric hallucination in a description is direct harm.

## Screen reader: a summarized role=img vs. a hidden navigable table

Raw SVG exposed to a screen reader is noise: the SR tries to read every `<path>` and `<text>` with no semantic order. The two robust patterns are: (a) treat the chart as a single image — role="img" + aria-labelledby pointing to `<title>`/`<desc>` — with a text summary; (b) hide the chart from the SR (aria-hidden="true") and offer a real HTML table, visually hidden or toggleable, that the user navigates with the screen reader's native table commands. The canonical case is Sara Soueidan's Khan Academy annual report (2019). The table wins when the user needs exact values and cell-by-cell comparison; the summary wins when the message is a trend.

**Rules:**
- Never leave the chart's SVG "naked" in the accessibility tree: either role="img" with an accessible name/description, or aria-hidden="true" with an adjacent text/tabular alternative, because an SR reading loose paths produces unintelligible soup — Soueidan, "Accessible Data Charts for Khan Academy 2018 Annual Report", 2019
- For a simple static chart, use `<svg role='img' aria-labelledby='t d'>` with `<title id='t'>` (headline) and `<desc id='d'>` (trend + extremes), because it's the pattern most consistently supported across browsers/SRs — TPGi/Vispero, "Using ARIA to enhance SVG accessibility", 2018; W3C SVG Accessibility Wiki
- For a value-rich chart (time series, ranking), provide a real HTML table as the alternative — visually hidden with CSS clip/sr-only OR visible behind a "view data" toggle — because the SR's table-navigation commands (cell, row, header) give the non-linear access no paragraph can — Soueidan, 2019; data.europa.eu, "Accessible SVG and ARIA"
- Hide the table with the .sr-only pattern (position:absolute + clip), never display:none or visibility:hidden, because those remove the content from the accessibility tree too — WebAIM, "Invisible Content Just for Screen Reader Users"
- Prefer a visible "chart | table" toggle over an SR-only table when it fits, because a visible table also serves people who want to copy values and low-vision users — Chartability's Compromising principle — Elavsky, 2022; Soueidan, 2019
- Use a semantic `<table>` with correct `<th scope>` in the alternative, and keep the SAME ordering and units as the chart, because a divergence between chart and table breaks trust and cross-verification — Soueidan, 2019
- In a library with an accessibility module (Highcharts), turn it on: it exposes series as navigable regions and points with announced values, solving the problem without a parallel table — Highcharts Accessibility Module docs, 2020+
- Decorative elements (gradients, watermarks, icons redundant with the text) get aria-hidden="true", because every announced node with no information is pure cognitive cost for the SR user — W3C ARIA Authoring Practices
- A compact formatted value that the SR voices wrong — a KPI "$1.4M", a phone number, "30 000" read as "thirty zero zero zero", a hyphen read as "minus" — needs an unambiguous accessible name; fix it in the visible text or with semantic markup and reserve aria-label for the irreducible case, because aria-label REPLACES the content and overrides the user's number-reading preference — TPGi, "Making Numbers in Web Content Accessible"; AccessibilityOz, 2021
- A numeric date is ambiguous and the SR doesn't unpack it ("07/12" is read digit-by-digit and could be Jul 12 or Dec 7): spell the month out ("12 Jul 2026") or use `<time datetime="2026-07-12">`, because the unabbreviated format serves SR and cognition at once — AccessibilityOz, "The trouble with blind dates", 2021; W3C Cognitive pattern "Use Clear, Unambiguous Formatting and Punctuation"
- Locale number formatting (thousands/decimal separator, currency symbol) is owned by dashboard-design-process.md; here, all that matters is that the chosen separator doesn't wreck the SR's speech (a space as a thousands separator breaks it) — see dashboard-design-process.md

**Anti-patterns:** A giant interactive SVG with no role (the SR announces dozens of "group, group, path"); role="img" on a chart with interactive tooltips/filters — it hides the keyboard/SR interaction; an alternative table with display:none (invisible even to the SR); a fallback table out of sync with the chart; an 800-character aria-label on the container as a substitute for navigable structure; a numeric aria-label that silently overrides the user's reading preference; a "07/12" date served raw to the SR in an axis or table with no spelled-out month and no `<time>`.

## Keyboard navigation in an interactive chart

Every mouse-accessible feature must exist via keyboard (WCAG 2.1.1) — in a chart that means reaching the chart with Tab, moving through the points with arrows, and getting what the tooltip shows. The reference pattern is Highcharts' accessibility module (Tab between chart elements, ←/→ between points in a series, ↑/↓ between series, Esc exits); for canvas rendering or libraries with no support, Data Navigator (Elavsky, Nagel & Moritz, IEEE VIS 2023) provides a graph-based navigation structure decoupled from the render — which is what Highcharts itself adopted for canvas.

**Rules:**
- Put the interactive chart in the Tab order (1 tabstop for the whole chart, not 1 per point) and use arrows to navigate points within it, because 200 point tabstops make the page unnavigable — Highcharts Accessibility Module docs; W3C ARIA APG (composite widget pattern)
- Implement the script: Tab focuses the chart → ←/→ moves through points announcing "category, value" → ↑/↓ switches series → Esc returns focus to the page, because it's the mapping consolidated by the market's reference library — Highcharts keyboardNavigation docs, 2020+
- Every datum shown in a hover tooltip must be announced when the point receives keyboard focus, because hover-only violates WCAG 2.1.1 (Keyboard) — W3C WCAG SC 2.1.1, 2008
- A focus indicator on the active point/bar with 3:1 contrast and not covered by other elements, because invisible focus = a lost keyboard user — W3C WCAG SC 2.4.7 Focus Visible and 2.4.11 Focus Not Obscured (WCAG 2.2), 2023
- In a canvas or custom-D3 chart, use the Data Navigator pattern: a structure of navigable nodes (dimensions → series → points) separate from the rendering, with a description per node, because canvas has no DOM and will never be accessible "for free" — Elavsky, Nagel, Moritz, "Data Navigator", IEEE VIS, 2023
- Offer hierarchical navigation (overview → series → point), not just linear point-by-point, because arrowing through 365 points to find a peak is torture; letting the user jump by aggregation (month, series) cuts the cost — Elavsky, Data Navigator, 2023; MIT Visualization Group, "Rich Screen Reader Experiences", 2022
- Don't capture the page's global keys (arrows scrolling, Tab trapped inside the chart) — a keyboard trap is a WCAG 2.1.2 failure — W3C WCAG SC 2.1.2 No Keyboard Trap
- Filters and drill-downs triggered by clicking a chart element must be real `<button>`/`<a>` elements or have a role and an Enter/Space handler, because a div with onClick is invisible to the keyboard — W3C ARIA APG

**Anti-patterns:** A rich hover tooltip and nothing on keyboard focus (the norm in 90% of dashboards); each bar as an individual tabstop — Tab becomes a conveyor belt of 50 stops; focus with no visual indicator (a global outline: none kills the chart along with everything else); an "interactive" canvas chart where the keyboard reaches no point; a drill-down from clicking a pie slice with no keyboard equivalent and no text link.

## Sonification and non-visual representations (a mention)

Sonification maps data to sound — typically the X axis to time and Y to pitch — and is exceptionally good at conveying trend, seasonality, and outliers in long series, things a linear table hides. It's leaving the niche: Apple Audio Graphs is a native iOS API for VoiceOver (WWDC 2021) and Highcharts maintains a sonification module with the Georgia Tech Sonification Lab. It's a complement to the other modalities, not a substitute for the table and the description.

**Rules:**
- Consider sonification when the message is the shape of the curve (trend, peak, cycle) in a long series, because hearing 365 points in 5 seconds beats navigating 365 table cells — Highcharts Sonification docs; Apple, "Bring accessibility to charts in your app", WWDC 2021
- Use the conventional mapping Y→pitch (high value = high-pitched sound) and X→time, because it's the convention Audio Graphs/Highcharts users have already learned — Apple Audio Graphs docs, 2021; Highcharts Sonification module
- In a native iOS app with charts, implement AXChart/Audio Graphs, because VoiceOver gains audio playback and a summary at no cost in custom UI — Apple Developer, Audio Graphs, 2021
- Offer sonification as an additional layer with play/pause/speed controls, never as the only non-visual alternative, because sound gives neither exact values nor usability in a noisy environment / for deafness — Chartability (Flexible principle), 2022
- In an ordinary web app, treat it as a mention/roadmap item and prioritize table + alt + keyboard first, because sonification's cost-benefit only pays off once the basics are in place — Elavsky, Chartability, 2022

**Anti-patterns:** Sonification as a demo flourish while the chart doesn't even have alt text; sound autoplay on focusing the chart (violates WCAG 1.4.2); an inverted/exotic mapping (high value = low-pitched) with no explanation; replacing the table of exact values with "there's audio" — sound doesn't answer "how much was it in March?".

## Mobile: chart reflow, labels without hover, and small multiples

A responsive chart isn't a shrunken chart: it's a chart redrawn for the width. The canonical adaptations (the Datawrapper pattern, the editorial market's reference): vertical columns with long categorical labels become horizontal bars (the label reads horizontally, the list scrolls vertically); direct labels that don't fit become a compact legend at the top; annotations leave the plot and become a numbered list below; small multiples reduce to a curated subset of stacked panels — not a carousel, which kills the simultaneous comparison that is the small multiple's reason to exist.

**Rules:**
- On narrow screens, convert a categorical column chart (>~6 categories or long labels) into a horizontal bar chart, because horizontal bars give the label full width and grow downward with natural scroll — Datawrapper Academy/Blog (established editorial practice), 2018+; Few, Show Me the Numbers, 2004 (horizontal bars for long labels)
- Time series stay horizontal (line/column over time) even on mobile — reduce tick density (e.g., 1 label every 3 months) instead of rotating the chart, because time read top-to-bottom violates convention — Datawrapper, responsive height control, 2023
- Label directly on the chart on desktop and accept degrading to a compact color key at the top on mobile (Datawrapper's default behavior), but keep direct labeling when there are ≤3 series, because a separate legend forces the eye back and forth — Datawrapper (responsive line/pie labels); Few, Show Me the Numbers, 2004
- Move text annotations below the chart as a numbered list on mobile (a numbered marker in the plot + text below), because an annotation inside a 320px plot covers the data — Datawrapper Blog, "better more responsive annotations", 2022
- Small multiples on mobile: define a separate mobile layout and select a SUBSET of the most important panels (Datawrapper supports this natively) stacked in 1–2 columns; don't use a carousel, because a small multiple exists for simultaneous side-by-side comparison — Datawrapper Blog, "Small multiple column/line charts", 2022–2023; Tufte, Envisioning Information, 1990 (small multiples = comparison within the same visual field)
- Prefer a fixed aspect ratio (height proportional to width) for lines and a fixed height for horizontal bars (height = f(number of categories)), because a squashed line distorts slope perception and a cut-off bar hides categories — Datawrapper Blog, "responsive height control", 2023
- Set the breakpoint by testing at a real 320px width (iPhone SE), because it's the floor of both WCAG 1.4.10 and real traffic — W3C WCAG SC 1.4.10, 2018
- KPI numbers and the chart headline come before the plot in the document flow, because on mobile the user decides in 1 screen whether to scroll — Knaflic, Storytelling with Data, 2015 (headline first); Datawrapper practice

**Anti-patterns:** Scaling the desktop SVG with viewBox and leaving 6px text illegible; an 8-column chart with labels rotated 90° on mobile instead of becoming a horizontal bar; a 3×4 small-multiples grid crammed into 360px (12 illegible stamps) or a 12-slide carousel no one swipes; a crucial annotation ("target") that vanishes at the breakpoint with no alternative version; a wide table with no overflow-x of its own forcing horizontal page scroll (a 1.4.10 failure); depending on hover as the only path to the exact value on a device with no hover.

## Touch: 44px targets, tap instead of hover, pinch/pan on a long series

Touch changes three things about a chart: there's no hover (every tooltip becomes a tap or a permanent label), the finger is imprecise (the minimum target is bigger than the visual point), and exploration gestures compete with the page scroll. The numbers: WCAG 2.5.8 (AA, WCAG 2.2/2023) requires a minimum 24×24px CSS target; Apple HIG asks for 44×44pt; Material Design asks for 48×48dp — for a chart in a real product, aim for 44–48, with the hit area larger than the visual mark.

**Rules:**
- Give every touchable chart element (point, bar, slice) a hit area of ≥44×44px CSS even if the visual mark is smaller — use an invisible hit area (a transparent rect/circle) or snap-to-nearest-point via Voronoi/bisect on the X axis, because an average finger covers ~44px — Apple HIG (44pt), 2008+; WCAG 2.5.8 (24px legal floor), 2023; Material Design (48dp)
- Replace hover with tap-for-tooltip, where a tap anywhere in the plot selects the nearest point (don't require hitting the point), because demanding pixel precision from a finger produces rage taps — Datawrapper (native tap behavior); Smashing Magazine, "Accessible Target Sizes Cheatsheet", 2023
- Label the key points (first, last, peak, trough) directly as permanent text on mobile, because the main insight must not depend on any tap — Datawrapper Academy; Knaflic, Storytelling with Data, 2015
- On a long series with zoom: implement pinch-to-zoom on the X axis + a two-finger drag (or a dedicated handle/brush outside the plot), leaving the one-finger drag for the page scroll, because hijacking the one-finger pan traps the user inside the chart — Highcharts touch/zoom behavior; established library pattern (ECharts dataZoom)
- Always offer a visible "reset zoom" button and a gesture-free alternative (+/− buttons or a 1M/6M/1Y period selector), because pinch is unfeasible for users with motor limitations and WCAG 2.5.1 requires an alternative to multipoint gestures — W3C WCAG SC 2.5.1 Pointer Gestures, 2018
- Space adjacent interactive elements (points on a dense line, heatmap cells) by ≥8px or group the interaction one level up (the day's column, not the cell), because touching targets produce mis-taps with no feedback — Material Design (8dp spacing); WCAG 2.5.8 (spacing as an alternative to size)
- Touch tooltips close with a tap outside and with an explicit X button, and never cover the finger/selected point (position them above the touch point), because the finger hides ~2cm² of the screen — Apple HIG; Highcharts mobile tooltip placement

**Anti-patterns:** A scatterplot with 4px points as the only touch target; a chart that captures the one-finger pan and locks the page scroll; pinch zoom as the ONLY path to detail, with no buttons and no period selector (a WCAG 2.5.1 failure); a tooltip that opens on tap but doesn't close (neither tap-outside nor X); a destructive action/navigation on the first tap with no intermediate selection state; treating WCAG 2.5.8's 24px as the target — it's a legal floor, not usability.

## Render performance: SVG vs. canvas vs. WebGL and the cost of accessibility

SVG creates one DOM node per mark — great for accessibility, CSS styling, and interaction, but it degrades with the element count; canvas draws a bitmap directly and scales far beyond. The practical knee sits in the ~1,000-2,000 point range (see `performance-latency-states.md`, owner of the renderer threshold): below it, the difference is negligible and SVG wins on the DOM; above it, canvas (canvas renders 10,000 points in <100ms where SVG takes seconds); above ~100k, WebGL. The central trade-off: every performance step loses the accessibility tree — canvas requires rebuilding it by hand (Data Navigator, a parallel table).

**Rules:**
- Use SVG by default up to ~1,000-2,000 visible marks, because in that range performance ties and SVG gives you an accessible DOM, focus, CSS, and testing for free — Apache ECharts Handbook, "Canvas vs. SVG best practices", 2021
- Above ~2,000 simultaneous marks (a dense scatterplot, years of data at daily resolution, a map with thousands of polygons), switch to canvas, because 10k SVG nodes cause seconds of render and scroll jank — ECharts Handbook, 2021; SitePoint/JointJS benchmarks
- Above ~100k points or 60fps animation of tens of thousands of marks, only WebGL (deck.gl, regl), because the GPU draws 100k+ elements where canvas 2D already chokes — Dev3lop/tapflare benchmarks; deck.gl docs
- Before switching the renderer, reduce the data: LTTB downsampling (Largest-Triangle-Three-Buckets) preserves the series' visual shape with ~10× fewer points, because no 400px screen shows 50k distinguishable points anyway — Steinarsson, "Downsampling Time Series for Visual Representation", U. of Iceland, 2013; Tufte (data density has a perceptual ceiling)
- When adopting canvas, budget in the accessibility cost: a Data Navigator navigation structure or a parallel table + description, because canvas has no DOM and the chart is born invisible to SR and keyboard — Elavsky, Data Navigator, 2023 (this was Highcharts' own path for canvas)
- Interaction in a dense canvas: hit-testing via quadtree/Voronoi (d3-quadtree, d3-delaunay), not linear per-point iteration on every mousemove, because O(n) hit-testing over 50k points freezes the frame — Bostock, d3-quadtree/d3-delaunay docs
- In a multi-chart dashboard (the typical app case), 6 SVG charts of 200 points each beat 1 heroic canvas: keep SVG and gain accessibility — premature optimization to canvas is a11y debt with no measurable gain — ECharts Handbook ("negligible difference <1k"), 2021
- Measure on the real target device (a mid-range Android phone, not M-series), because the desktop's 1k-point knee may be 300 on mobile — standard web-performance practice (RAIL/Core Web Vitals)

**Anti-patterns:** A 20,000-point scatterplot in SVG "because that's how D3 has always been done"; migrating everything to canvas in a dashboard whose largest chart has 90 points, throwing away accessibility for free; rendering 50k raw points with no downsampling and calling it "high fidelity"; an interactive canvas with no spatial hit-testing (a linear loop on mousemove); forgetting that canvas disappears from the screen reader and the keyboard, and finding out in the audit.

## Sources

- Frank Elavsky, Chartability (chartability.fizz.studio), 2021, v2 2022
- Elavsky, Bennett, Moritz, "How accessible is my visualization? Evaluating visualization accessibility with Chartability", Computer Graphics Forum / EuroVis, 2022
- Elavsky, Nagel, Moritz, "Data Navigator: An Accessibility-Centered Data Navigation Toolkit", IEEE VIS, 2023
- W3C, WCAG 2.1/2.2 — SC 1.4.1, 1.4.3, 1.4.4, 1.4.10, 1.4.11, 1.4.13, 2.1.1, 2.1.2, 2.3.1, 2.3.3, 2.4.7, 2.4.11, 2.5.1, 2.5.5, 2.5.8 (2008–2023); WAI Understanding SC 1.4.11 and 2.3.1, 2018
- W3C WAI, Cognitive Accessibility Design Pattern "Use Clear, Unambiguous Formatting and Punctuation"
- W3C, SVG Accessibility / ARIA roles for charts (wiki); ARIA Authoring Practices Guide
- MDN Web Docs, "forced-colors" media feature; HTML `<time>` element
- Microsoft Edge team, "Styling for Windows high contrast with new standards for forced colors", 2020
- TPGi, "Making Numbers in Web Content Accessible", 2021
- AccessibilityOz, "The trouble with blind dates: screen readers and date formatting", 2021
- Amy Cesal, "Writing Alt Text for Data Visualization", Nightingale/Medium, 2020
- Lundgard & Satyanarayan, "Accessible Visualization via Natural Language Descriptions: A Four-Level Model of Semantic Content", IEEE VIS/TVCG, 2021
- Datawrapper Academy/Blog (Lisa Charlotte Muth and team): alt descriptions 2021, color and accessibility 2020–2022, responsive annotations 2022, small multiples 2022–2023, responsive height 2023, tap/tooltip touch 2020+
- Sara Soueidan, "Accessible Data Charts for Khan Academy 2018 Annual Report" (case study), 2019
- TPGi/Vispero, "Using ARIA to enhance SVG accessibility", 2018
- WebAIM, Alternative Text; "Invisible Content Just for Screen Reader Users"
- Highcharts, Accessibility Module / keyboardNavigation / Sonification (partnership with the Georgia Tech Sonification Lab) docs, 2020+
- data.europa.eu Data Visualisation Guide, "Accessible SVG and ARIA", 2022
- Zong, Lee, Lundgard et al. (MIT Vis Group), "Rich Screen Reader Experiences for Accessible Data Visualization", EuroVis, 2022
- Apple, Human Interface Guidelines (hit target 44×44pt), 2008+; "Audio Graphs" API / WWDC21 session 10122, 2021
- Google, Material Design (touch target 48×48dp, 8dp spacing), 2014+
- Smashing Magazine, "Accessible Target Sizes Cheatsheet", 2023
- Claus Wilke, Fundamentals of Data Visualization, O'Reilly, 2019
- Cole Nussbaumer Knaflic, Storytelling with Data, 2015
- Stephen Few, Show Me the Numbers, 2004
- Edward Tufte, Envisioning Information, 1990; The Visual Display of Quantitative Information, 1983
- Apache ECharts Handbook, "Canvas vs. SVG — Best Practices", 2021
- Sveinn Steinarsson, "Downsampling Time Series for Visual Representation" (LTTB algorithm), U. of Iceland thesis, 2013
- SitePoint "Canvas vs SVG"; JointJS "SVG versus Canvas" (benchmarks), 2022–2023
