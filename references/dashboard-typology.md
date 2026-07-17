# Dashboard typology and corporate reporting

> Reference for the dataviz-design skill. Load when: classifying/auditing a dashboard, designing a management report or KPI scorecard, applying IBCS notation/variances, or deciding cadence/export (PDF, board deck).

## Typology by role: strategic / analytical / operational

Stephen Few argues that a dashboard's role (strategic, analytical, or operational) is the single factor that most shapes its visual design — ahead of any chart choice. Each role implies a different user, data latency, density, and degree of interaction. Wayne Eckerson offers a parallel taxonomy (operational/tactical/strategic) and the MAD pyramid (Monitor, Analyze, Drill to detail) that sizes how many metrics live in each layer.

**Rules:**
- Classify the dashboard as strategic/analytical/operational BEFORE designing any component, because the role dictates latency, density, and interaction — you can't audit a screen without knowing which role it serves — Few, Information Dashboard Design, 2006
- Strategic dashboard: use high-level aggregate measures with simple comparisons (vs target, vs prior period, forecast) and a static snapshot (not real-time), because the executive is monitoring business health and strategic decisions don't react to intraday swings — Few 2006
- Analytical dashboard: provide rich context (history, multiple comparisons) and a drill path down to detail, because the goal is to investigate cause, not just observe state — Few 2006
- Operational dashboard: real-time/near-real-time data, with deviations flagged loudly and normal items kept visually quiet, because the response to a deviation is immediate and attention is the scarce resource — Few 2006
- In the operational case, the alert must carry enough detail to act on without extra navigation (what, where, how much), because every click between detection and action costs response time — Few 2006
- Size the metric count by the MAD pyramid: ~10 metrics at the monitoring layer, ~100 at analysis, ~1,000 at detail, because inverting the pyramid (100 KPIs on the landing screen) kills the at-a-glance read — Eckerson, Performance Dashboards, 2nd ed., 2010
- Don't mix the three roles on one screen: separate executive monitoring from analytical investigation into distinct layers/routes, because their density and interaction requirements are contradictory — Few 2006; Eckerson 2010
- Recognize the WALLBOARD/NOC subtype of the operational dashboard (wall-mounted TV, ops room, big screen): size everything to reading DISTANCE (several meters), not desktop density — large type, high contrast, zero interaction, one dominant alarm color and everything else quiet; complements monitoring-realtime.md — Few 2006 (operational); NOC/observability practice
- Design the operational dashboard as exception reporting: under normal conditions the screen stays visually silent and only the deviation draws the eye, because on a glanceable wallboard the eye should land on the problem without scanning the normal — Few 2006

**Anti-patterns:** A dashboard "for everyone" with no defined role/persona; a strategic KPI updating in real time (invites micro-reactions to noise); an operational screen dominated by 3 giant gauges where 30 dense measures would fit; a single screen trying to serve monitoring, analysis, and lookup all at once.

## Dashboard ≠ report ≠ analytical tool

Few defines a dashboard ("Dashboard Confusion", Intelligent Enterprise, Mar 2004) as "a visual display of the most important information needed to achieve one or more objectives, consolidated and arranged on a single screen so the information can be monitored at a glance." A report serves lookup and sequential reading (may paginate, demands precision); a dashboard serves monitoring (pattern and state); an analytical tool (faceted analytical display) serves interactive investigation. Confusing the three is the root of most bad dashboards.

**Rules:**
- Everything on one screen, with no scrolling or mandatory tabs for the essentials, because at-a-glance monitoring breaks the moment critical information falls outside the viewport — it's #1 of Few's 13 mistakes — Few 2004/2006
- If the user's dominant task is finding a specific number (lookup), deliver a table/report with search and sorting, not charts, because a table gives precision and point lookup; a chart gives pattern — Few, Show Me the Numbers, 2004
- Structure navigation as MAD: a monitoring layer at the top with drill into analysis and detail, because the dashboard is the mouth of a funnel, not the final destination — Eckerson 2010
- Don't call a screen a dashboard when it requires configuring N filters before it shows anything: that's a query tool and should be designed as such (form + result) — Few 2006
- Audit by task-time: a good dashboard minimizes "time to detect a deviation"; a good report minimizes "time to find the exact number" — if your success metric is the second, the artifact is a report — derived from Few 2004/2006

**Anti-patterns:** A dashboard that scrolls five screens tall; a 30-page paginated report nicknamed a "dashboard"; a grid of raw table data with 15 filters sold as an "executive panel"; hiding the critical KPI behind a secondary tab.

## The 13 common dashboard mistakes (Few's audit checklist)

Few catalogued the 13 most frequent mistakes in "Common Pitfalls in Dashboard Design" (whitepaper, 2006) and in the book chapter of the same name. Inverted, they work as an auditable checklist for any monitoring screen — from screen overload to poor use of color.

**Rules:**
- Give every displayed number context — target, prior period, acceptable range — because an isolated number ("Sales: 1.2M") supports no judgment; it's mistake #2 (inadequate context) — Few 2006
- Cut precision to the level of the decision: no 2 decimal places on values in the millions, because surplus digits raise reading time without changing the decision (mistake #3) — Few 2006
- Use the SAME chart type for the same kind of data across the whole screen; don't add variety "to avoid monotony", because each new format costs re-decoding (mistake #6, meaningless variety) — Few 2006
- Place the most important content in the top-left quadrant and the least important in the bottom-right, because ocular scanning in Western cultures favors top-left (mistake #9, arranging the data poorly) — Few 2006
- Highlight only what demands action: if everything has strong color and a border, nothing stands out (mistake #10) — Few 2006
- Eliminate non-informative decoration (large logos, frames, background gradients, 3D effects), because it competes for space and attention with the data — mistake #11; Tufte's data-ink ratio principle — Few 2006; Tufte, The Visual Display of Quantitative Information, 1983
- Reserve red for alert conditions and never use it decoratively, because color with inconsistent meaning trains the reader to ignore it (mistake #12) — Few 2006
- Replace gauges/speedometers with bullet graphs, because a gauge shows 1 measure in the space where a bullet shows the measure + target + qualitative ranges (mistakes #5 and #7) — Few 2005/2006

**Anti-patterns:** A 3D pie chart with 12 slices; a speedometer per KPI eating a quarter of the screen; a background with gradients and shadows "for polish"; 40 numbers on screen, all the same size and weight; red used as both a brand color and an alert color.

## IBCS / Hichert's SUCCESS formula

IBCS (International Business Communication Standards) is the open corporate-communication standard started by Rolf Hichert (the SUCCESS formula since ~2004; IBCS v1.0 in 2015, v1.1 in 2017, v1.2 in 2021, v2.0 in 2026 — the latter aligned with ISO 24896 "Notation for business reporting", published 2026-06-11), with ~98 rules organized into 7 principles: SAY and STRUCTURE (conceptual), EXPRESS, SIMPLIFY, CONDENSE and CHECK (perceptual), and UNIFY (semantic). It is the dominant body of rules for management reporting in Europe and the basis of the Zebra BI/Inforiver plugins.

**Rules:**
- SAY: every report, page, and chart carries ONE explicit message written as an assertion ("Margin fell 3pp in the South on product mix"), not as a topic ("Margin by region"), because a topic title hands interpretation off to the reader — Hichert, IBCS SUCCESS, rule SA
- STRUCTURE: organize content in MECE form (mutually exclusive, collectively exhaustive) and keep the same hierarchy throughout the document, because overlapping categories prevent summing and comparison — IBCS, ST rules
- EXPRESS: time series in vertical columns (time runs horizontally); structural comparisons (products, regions, customers) in horizontal bars, because the axis carries semantics: horizontal = time, vertical = structure — IBCS, EX rules
- CHECK: bars and columns always start at zero and compared charts use the same scale, because a truncated axis and mixed scales lie about proportion (lie factor) — IBCS CH rules; Tufte 1983; Cairo, The Truthful Art, 2016
- SIMPLIFY: remove borders, backgrounds, shadows, redundant axes, and repeated labels, because ink without data dilutes the message — IBCS SI rules; Tufte 1983
- CONDENSE: concentrate everything that supports the message on a single page (small multiples, sparklines, integrated tables) instead of spreading it across several, because comparison requires visual co-presence — IBCS CO rules
- When building a report, apply them in the order Unify → Say → Structure → Express → Simplify → Condense → Check, because the notation and the message precede the layout — Hichert/IBCS
- Adopt the rules as a company standard (template), not as a per-analyst choice, because the IBCS payoff comes from instant reading across reports — IBCS, UNIFY principle

**Anti-patterns:** Topic titles with no message ("Q3 Overview"); a chart chosen for aesthetics or novelty rather than the message; every analyst/team with its own palette and format; a Y axis cut "to make the difference pop"; one idea spread across 6 slides that would fit on 1 dense page.

## IBCS semantic notation: AC/PY/BU/FC scenarios and variances

The core of the UNIFY principle: "what means the same should look the same." The notation fixes the appearance of business scenarios — AC (Actual), PY (Previous Year), BU and PL (Budget and Plan) and FC (Forecast) — and of variances, eliminating legends and surviving black-and-white printing. It is the standard visual vocabulary of variance reporting. **This is the skill's canonical definition of scenarios — keep it as the primary source; the other files cite it rather than restate the encoding in full.**

Canonical fill table (stable from v1.0/2015 to v2.0/2026·ISO 24896):

| Scenario | Code | Fill |
|---|---|---|
| Actual | AC | solid dark (dark gray/black) |
| Previous Year | PY | solid light gray |
| Budget/Plan | BU/PL | hollow outline (no fill) |
| Forecast | FC | hatched (diagonal lines) |

**Rules:**
- Encode scenarios by fill, always with this same mapping: AC = solid dark; PY = solid light gray; BU/PL = hollow outline with no fill; FC = diagonal hatch — because the reader identifies the scenario without a legend, the distinction is by form (not hue, so immune to color vision deficiency), and the encoding survives B&W photocopying — IBCS, UNIFY principle (Hichert & Faisst's "filled, framed, hatched" notation, stable from v1.0/2015 to v2.0/2026·ISO 24896)
- Absolute variance (ΔBU, ΔPY in value) in a bar chart; relative variance (Δ%) in pins/lollipops — because the difference in form stops % being read as an absolute value — IBCS, UN rules
- Color variance by its impact on the result, not by mathematical sign: green = good for profit, red = bad (a cost above budget goes RED even with a positive Δ) — IBCS; a classic audit case on expense screens
- Standardize the chart title into 3 elements: entity | measure with unit | period with scenarios (e.g., "ACME Corp | Net revenue in $ mn | 2026: AC, FC vs BU"), because a structured title replaces legend and axis — IBCS, UN/ST rules
- Use an identical scale across all comparable charts on the same page; when that's impossible, flag the scale break visually, because the eye automatically compares heights between neighboring charts — IBCS, CH/UN rules
- Don't use a brand color as a data color: the visual identity lives in the frame/title; inside the chart only the semantic notation applies — IBCS UNIFY
- Label variances with an explicit sign (+/−) next to the value, because direction implied by color alone excludes color-blind readers and B&W — IBCS; Few 2006

**Anti-patterns:** Corporate blue for actual and orange for budget, shifting report to report; green for a cost overrun because "the number went up"; a separate legend to tell AC from BU when fill would resolve it; forecast and actual sharing the same solid look (the reader mistakes projection for fact).

## Management reporting and variance reporting

The recurring management report answers "where are we vs where we should be, why, and what we'll do about it." Its central unit is the variance (AC vs BU, AC vs PY, FC vs BU) decomposed into causes. It differs from a dashboard by including management narrative (commentary) integrated with the evidence.

**Rules:**
- Every reported KPI comes with at least two comparison bases — vs budget AND vs prior year — in both absolute AND percentage terms, because a single base hides both seasonality and a loose (sandbagged) budget — IBCS/FP&A practice; Few 2006 (context)
- Use a waterfall/bridge to decompose total variance into components (price, volume, mix, FX), because explaining the cause is the report's job, not the reader's — Zelazny, Say It With Charts, 1985; IBCS EX
- Put the management comment next to the chart/table it explains, never in a separate appendix, because integrating text and evidence is what separates a report from a data dump — IBCS SAY; Tufte 1983 (integrate words, numbers, and images)
- Report the full-year view (AC YTD + FC for the remaining months) against BU, not just the current month, because the manager decides on the fiscal year, not on the closed month — management reporting/IBCS practice
- Sort variance-table rows by the size of the deviation (not alphabetically) when the question is "where is the problem", because alphabetical ordering forces a full scan — Few, Show Me the Numbers, 2004
- Compare units/regions with shared-scale small multiples, because N small identical charts compare better than 1 chart with N interwoven series — Tufte 1983; IBCS CO
- Define a materiality threshold in writing (e.g., comment only on deviations > 5% or > $100k) before writing any comments, because commenting on noise trains the reader to ignore all comments — FP&A practice/IBCS SAY

**Anti-patterns:** A 40-row mega-table with no highlight on the material deviations; a generic comment ("performance in line with expectations") that explains no cause; showing only % variance (hides the absolute size) or only absolute (hides the proportion); comments on one slide and numbers on another, forcing back-and-forth; a monthly report with no full-year projection.

## Scorecards and KPIs: Balanced Scorecard, bullet graph, status

A scorecard measures performance against strategic targets on a monthly/quarterly cadence; the canonical model is Kaplan & Norton's Balanced Scorecard (HBR Jan-Feb 1992; book 1996) with 4 perspectives — financial, customer, internal processes, learning & growth — and ~20-25 measures. A scorecard is not a dashboard: a scorecard compares actual against a strategic target; a dashboard monitors current state.

**Rules:**
- Limit the scorecard to ~20-25 measures spread across the 4 perspectives, because beyond that it degenerates into an operational report and the strategy vanishes — Kaplan & Norton, The Balanced Scorecard, 1996
- Each KPI shows four elements together: current value + target + variance + trend (sparkline), because an isolated status (traffic light) says neither how far from target nor in which direction — Few 2006; Tufte, Beautiful Evidence, 2006 (sparklines)
- Use a bullet graph in place of a gauge: measure bar + target marker + 2 to 5 qualitative ranges (3 is ideal) in shades of gray, because it delivers 3 layers of information in ~1/10 the space of a speedometer — Few, bullet graph specification, 2006 (created in 2005)
- Qualitative ranges (bad/ok/good) in intensity gradation (light→dark), not saturated green/yellow/red, because ~8% of men have a color vision deficiency and three saturated hues pollute the whole screen — Few 2006
- If you use a RAG traffic light, add redundant shape or text (▲/▼, "+3%"/"−3%"), because a purely chromatic encoding fails for color-blind readers and in B&W print — Few 2006; Ware, Information Visualization, 2004
- Every KPI has a named owner, a numeric target, and status thresholds defined in writing before it goes on screen, because an implicit threshold produces an arbitrary traffic light no one challenges — Eckerson 2010 (characteristics of effective KPIs)
- Don't show a mean without dispersion when the distribution matters (e.g., SLA), because the mean hides the tail that blows the contract — Few, Show Me the Numbers, 2004

**Anti-patterns:** A wall of green/red traffic lights with no numbers or trend; gauges/speedometers hogging the top fold; a KPI with no explicit target ("NPS: 42" — against what?); 50+ "KPIs" where none is key; a green status computed with a threshold nobody knows.

## Export, print, and PDF: static reporting

An interactive dashboard and a PDF/printout are distinct media: the PDF freezes a state and loses tooltip, drill, and filter; the printed page follows document typography, not screen typography. IBCS was born in the printed-report world — its notation (solid/outline/hatch) is print-safe by design. Exporting well means designing the static artifact, not photographing the interactive one.

**Rules:**
- Build a dedicated print layout (paginated A4, header and columns repeated per page, controlled breaks) rather than a screenshot of the dashboard, because filter state, content under scroll, and tooltips are lost in the capture — derived from Few 2006 (a dashboard is a screen medium) + reporting practice
- Convert every piece of information that lives in a hover/tooltip into a label or table column in the PDF, because hover doesn't exist on paper — direct audit: search for "hover over" in printed material
- Encode scenarios and status with fill/outline/hatch and +/− signs (IBCS notation), not color alone, because B&W printing and photocopying destroy the green/red distinction — IBCS UNIFY, 2017/2021
- Stamp every exported page with: generation date/time, data cut-off period, and source, because the PDF circulates for months and frozen data with no stamp becomes misinformation — reporting practice; Few 2006 (context)
- Printed numeric tables: numbers right-aligned, the same number of decimals per column, tabular (fixed-width) figures, and a thousands separator, because decimal alignment is what lets you compare magnitudes vertically — Few, Show Me the Numbers, 2004
- Separate the reading artifact (pre-read/board report: self-sufficient page, full text) from the live-presentation artifact (sparse, progressive); the "slideument" hybrid fails at both — Knaflic, Storytelling with Data, 2015; Duarte, Slide:ology, 2008
- Export charts as vector (SVG/native PDF), not a screen bitmap, because zoom and high-resolution printing jag a PNG — technical practice

**Anti-patterns:** An "Export PDF" button that generates a screenshot of the viewport; a "click for details" legend visible in the printed document; a report with no data cut-off date; red/green traffic lights indistinguishable in a B&W photocopy; a deck too dense to present and too shallow to read alone.

## Reporting cadence: real-time, daily, weekly, monthly, board deck

Each artifact type has its own latency and ritual: operational in right-time/intraday, tactical in daily/weekly, strategic in monthly/quarterly with a board deck. The golden rule is to match update frequency to decision frequency — data fresher than the decision it feeds only adds noise and cost.

**Rules:**
- Update at the frequency of the decision, not the frequency that's technically possible: operational right-time/minutes, tactical daily/weekly, strategic monthly/quarterly — Eckerson 2005/2010 (latency by type); Few 2006
- Show "data through DD/MM hh:mm" visibly on the screen/page, because without an update stamp the reader assumes real time and decides on stale data — Few 2006 (inadequate context, mistake #2)
- Monthly board deck: open with a 1-page summary-message (what changed, why, what we'll do), because the board has minutes per agenda item and the rest of the deck is supporting material — IBCS SAY; Duarte 2008
- Always compare against the same point in the cycle (YoY, same week of the year), not just MoM, because seasonality contaminates any raw month-over-month comparison — FP&A practice; Few 2004 (appropriate comparisons)
- In a recurring report (weekly/monthly), freeze structure, order, and scales between editions, because the recurring reader scans by difference and each layout change resets that learning — IBCS UNIFY
- Distribute the report as a pre-read and use the meeting for decisions, not for an assisted read-through of the deck (Amazon's narrative/6-pager pattern is the extreme case), because reading as a group wastes synchronous time — Duarte 2008; executive practice
- Only invest in a real-time pipeline where someone can actually act within minutes; otherwise a daily snapshot suffices and costs a fraction — Few 2006; Eckerson 2010

**Anti-patterns:** A strategic KPI "live"-blinking in the boardroom; a MoM comparison of a seasonal business with no YoY base; a 60-slide board deck with no executive summary; a weekly report that changes format every edition; a screen with no indication of when the data was last updated.

## Sources

- Stephen Few, "Dashboard Confusion", Intelligent Enterprise, March 2004
- Stephen Few, Show Me the Numbers, Analytics Press 2004 (2nd ed. 2012)
- Stephen Few, Information Dashboard Design, O'Reilly 2006 (2nd ed. Analytics Press 2013)
- Stephen Few, "Common Pitfalls in Dashboard Design", Perceptual Edge/ProClarity whitepaper, 2006
- Stephen Few, Bullet Graph specification, Perceptual Edge, 2006 (created in 2005)
- Wayne Eckerson, Performance Dashboards: Measuring, Monitoring, and Managing Your Business, Wiley 2005 (2nd ed. 2010)
- Rolf Hichert & Jürgen Faisst, IBCS Standards, IBCS Association — v1.0 2015, v1.1 2017, v1.2 2021, v2.0 2026 (v2.0 aligned with ISO 24896 "Notation for business reporting", published 2026-06-11); ibcs.com (full text of the rules)
- Rolf Hichert & Jürgen Faisst, Gefüllt, gerahmt, schraffiert ("filled, framed, hatched" — basis of the AC/PY/BU-PL/FC scenario notation)
- Zebra BI / Inforiver (reference implementations of the notation in Power BI)
- Edward Tufte, The Visual Display of Quantitative Information, 1983
- Edward Tufte, Beautiful Evidence, 2006
- Alberto Cairo, The Truthful Art, 2016
- Gene Zelazny, Say It With Charts, 1985
- Robert Kaplan & David Norton, "The Balanced Scorecard — Measures That Drive Performance", Harvard Business Review, 1992; The Balanced Scorecard, HBS Press, 1996
- Colin Ware, Information Visualization: Perception for Design, 2004
- Cole Nussbaumer Knaflic, Storytelling with Data, 2015
- Nancy Duarte, Slide:ology, 2008
