---
name: dataviz-design
description: "Use for ANY dashboard, chart, data table, KPI, map/heatmap, report, or analytics screen work — designing a new screen, reviewing an existing one, choosing a chart type, deciding interaction/drill, telling a story with data, reporting/scorecard, monitoring/alerting, data email/notification. Dataviz UX (anatomy, drill, cross-filtering, no dead ends) + chart design (choice by relationship/FT, Cleveland-McGill perception, data-ink/Tufte, storytelling/Knaflic, integrity/Cairo) + deep matrix in references/ (17 topics + worked examples)."
---

# /dataviz-design

Design patterns for any data surface (dashboard, chart, table, KPI, map).
Complements the `frontend-design` skill (visual identity) — this one covers the BEHAVIOR of the data.
Structure: §0-10 = surface UX (anatomy, drill, interaction); §11-15 = the chart itself
(choice, perception, noise, narrative, honesty); §16 = index of the deep matrix in
`references/` (18 files) — this file is the checklist; thresholds, canonical sources, and
debates live in the `references/` files, each rule citing its source.

## 0. Before you design (required questions)

1. **Is the data clean enough?** Dirty data in a pretty visual = a pretty lie.
2. **Who's looking, and in what context?** (daily expert × weekly manager × client in a demo)
3. **What TYPE of screen is it?** — this concretely changes what you design:
   - *Reporting* (tell a story, export/share) → linear layout, title=conclusion, fixed cadence, PDF export.
   - *Monitoring* (real-time, what demands action NOW) → big number + threshold/alert, auto-refresh, freshness stamp.
   - *Exploring* (investigative, deep drill) → rich filters + cross-filter + state in the URL.
   - *Functional/embedded* (data embedded in a flow) → 1-2 numbers at the point of action, zero chrome.
   - *Product home* (contextual index) → navigation + a few anchor numbers, no heavy analysis.
4. **What ACTIONS come out of this?** A dashboard with no executable action is a report.
5. **What does the user compile BY HAND today?** — the biggest time sink is the best module.

## 1. Anatomy (composition hierarchy)

Page = nav + filters + content area → sections → modules → data.

- **Orientation (leadspace)**: clear title + 1 line saying what the screen answers.
- **Grouping**: like with like; each section with its own heading and a "see all" action when there's detail.
- **Overview first**: top modules "zoomed out" (a calm view); detail comes via drill.
  Shneiderman's mantra: *overview → zoom & filter → details on demand*.
- **Jargon tooltips**: a technical term/acronym gets an ⓘ with the definition IN PLACE (never force
  a hunt). Classic mistake: GA4 shows DAU/MAU without defining them.
- **Filters**: prioritized by the page's content (the 2-3 that matter most open, the rest collapsed).
  Applied filter = double feedback: a visible "active filter" chip (removable) + the selected state
  on the control. Filtering in progress = skeleton/loading feedback on the affected modules.
- **Update stamp (as of)**: every number surface says *updated at X* / *data through Y* —
  a number with no reference date is neither trustworthy nor auditable (freshness/staleness: see monitoring-realtime).

## 2. Drill: 3 levels, each with its use

| Level | When | Form |
|---|---|---|
| Tooltip/hover | single value, quick comparison | progressive disclosure, dismisses itself |
| Drawer/modal | extra context or reference WITHOUT leaving the screen | side panel/modal with summary + "see details" CTA |
| Details page | a real deep dive | its own page with leadspace, tabs, sortable table — and it too follows these rules |

- Drill arrives **already filtered by the originating context** (drill-through with persistent state).
- Actionable tables: multi-select + "N selected" bar + Actions menu (bulk).

## 3. No dead ends (acceptance rule)

Every number/bar/cell/region answers **"what if I click?"** with one of:
(a) re-filters the live slice; (b) opens a drill; (c) anchors to the section with the detail.
A tooltip does NOT count as an answer.

- **Live slice = canonical querystring.** Every view is both a *reflection* (renders the slice) and a
  *door* (swaps ONE dimension while preserving the rest). The URL always reflects the state — refresh/share work.
- **Cross-filtering / CMV**: on an analytical screen, clicking a view (a state on the map, a segment bar,
  a period column) re-filters ALL coordinated views, not just one.
- Honest affordance: only what navigates looks clickable; the asymmetry teaches where to click.

## 4. Layout

- **F/Z scan**: top-left is the page's *prime real estate* — the #1 piece of information lives there.
  Order sections by decreasing importance, not by implementation order.
- **Consistent cards**: pick ONE card style (floating / bordered card / title accent)
  and repeat it. Within the card, fixed positions: title top-left, period control top-right,
  legend at the bottom. The user learns it ONCE.
- **One format per data type across the whole app** — N local variants of a table/chart is a bug.

## 5. Color, texture, accessibility

- Color CARRIES meaning; never decorate with it:
  - *Traffic light* (red/yellow/green) only for negative/neutral/positive.
  - *Intensity scale* of the brand color (10→100) for sequential/choropleth.
  - *Blues=positive / oranges=negative* as a vivid alternative to green/red
    (better for color vision deficiency).
- **Never color alone**: series are also distinguished by texture/hatching (fills) and line style
  (solid/dashed/dotted). Projection/future = dashed line after the "today" divider.
- State with meaning (failed/ok/pending) = color + icon/label, never color alone.

## 6. Numbers and comparison

- **A number with no baseline is noise.** Every KPI gets a delta: against the previous period, a target, or a benchmark.
- Delta formats: icon-first (arrow+color), textual ("+25.1% vs last month"), inline in a table.
  Better still: a "compare with" selector (week/month/year/benchmark).
- Typographic hierarchy: hero number in large display, small label above, delta as a chip.
- Big numbers answer a question; if the question is trend, pair them with a sparkline.
- A number only compares if the DEFINITION is the same and versioned — change the calculation and you've broken the series (see kpi-metrics).

## 7. Axes, labels, density

- **Fewer labels on the X axis**: dense labels rotated to the diagonal = DON'T; skip labels
  (every N) or raise the granularity (day→week→quarter). Rule: legible > complete.
- Truncation with predefined logic (ellipsis + title/tooltip with the full value).
- All-zero / empty series: a message in place of the dead area, with an ACTION ("clear filter", "create X")
  — an empty state is onboarding, not a dead end.

## 8. Chart interactivity

- Hover: single value in a chip; hovering the legend highlights the corresponding series (dims the others).
- **Legend as control**: a checkbox in the legend (or rows of the legend-table) toggles series on/off
  — table and chart as coordinated views of the same data, a toggled-off row fades.
- A data update ANIMATES between states (animated transition), it doesn't repaint from scratch — that's
  what makes the screen feel alive.
- Customization (drag/hide modules) only when the data IS the product and users diverge a lot;
  high cost, not a default.

## 9. Mobile

- Stacked horizontal bars → vertical on mobile; KPIs move above the chart.
- A dense chart that won't shrink: saying "best on a larger screen" + suggesting landscape IS a valid pattern
  (better than an illegible chart).
- Touch has no hover: the value needs a tap-target or an always-visible label.

## 10. Anti-patterns (check before shipping)

- [ ] **Data eyeball attack** — density beyond legibility; cut modules, not margins.
- [ ] **Data because it exists** — each module answers a nameable question; if not, out.
- [ ] **Number with no comparison** — vs period/target/benchmark, always.
- [ ] **Jargon with no explanation** — an acronym has an ⓘ.
- [ ] **Color encoding alone** — needs a redundant shape/text.
- [ ] **No alt/text equivalent** — a chart invisible to a screen reader (see accessibility-mobile).
- [ ] **Insufficient contrast** — <4.5:1 text, <3:1 graphical element (see color).
- [ ] **Number with no freshness / as-of stamp** — data with no reference date isn't auditable.
- [ ] **Dead end** — an element that displays and leads nowhere (section 3).
- [ ] **New local format** — a table/chart variation that diverges from the app's standard.
- [ ] **Filter with no feedback** — applied and nothing signaled what changed.
- [ ] **Pie chart for precise comparison** — angle is a weak encoding (§12); ordered bars.
- [ ] **Bar with a truncated axis** — length lies (§15); only a line truncates, and only when signaled.
- [ ] **Dual axis** — manufactures correlation (§15); two panels or base 100.
- [ ] **Everything colored** — with no context gray there's no highlight (§14).
- [ ] **Title that only names the variable** — where the data is static, the title is the conclusion (§14).

## 11. Chart choice by RELATIONSHIP (FT Visual Vocabulary)

First-order heuristic: **name the RELATIONSHIP the data expresses; the chart type follows from it.**
When torn between two, the simplest one that answers the question wins.

| Relationship | Question | Good forms |
|---|---|---|
| Change over time | "how did it evolve?" | line (continuous), column (discrete periods), area (sum) |
| Magnitude | "how much?" | column/bar (from zero), big number |
| Ranking | "who leads?" | bar ordered by VALUE (not alphabetical), lollipop, slope |
| Part-to-whole | "what share?" | stacked bar, treemap; pie chart only with few slices and an obvious difference |
| Distribution | "how does it spread?" | histogram, boxplot, strip/dot plot |
| Deviation | "above/below the reference?" | diverging bar from zero/target, line vs baseline |
| Correlation | "do they move together?" | scatterplot; bubble only when the 3rd variable is ordinal/approximate (area encodes an exact value poorly — see perception) |
| Many groups side by side | "how is each group doing?" | small multiples (same scale), faceted panel |
| Spatial | "where?" | choropleth (rate/intensity), proportional symbol (count) |
| Flow | "from where to where?" | sankey, chord — rare; only with REAL flow |

- Hard rules that live here: bars always from zero (§15); two series with different UNITS →
  two panels, not a dual axis (§15).
- Thresholds and cases (number of pie slices, ≤N periods → column, when to facet × overlay, rare
  types like slope/dumbbell/bump), **see references/chart-choice.md (canonical source)**.
- Time-shape (rebasing/base 100, seasonality, YoY × MoM, moving average, banking, forecast) →
  **references/time-series.md (canonical source)**.

## 12. Perception: Cleveland–McGill hierarchy + preattentive

First-order heuristic: **position > length > angle > area > color/saturation** for precise reading.
Hence **bar > pie**, **scatterplot > bubble**, **line > stacked area**.

- Spend ONE preattentive attribute (color, size, position, orientation) per chart to point at what matters;
  two competing = none.
- Color/intensity is for CATEGORY or highlight, never to read an exact value — a choropleth always
  comes with a tooltip/label carrying the number (palettes/CVD: see color).
- Order categories by magnitude (ranking) or by natural order (time, bands) — never alphabetical
  out of laziness.
- The full hierarchy of channels, aspect ratio/banking to 45°, and Gestalt, **see references/perception.md
  (canonical source)**.

## 13. Data-ink (Tufte): erase what isn't data

First-order heuristic: **maximize the data-ink ratio — remove everything that doesn't encode data**
(plot borders, backgrounds, shadows, 3D, heavy gridlines, redundant ticks). Method: remove
until it hurts, then add the last element back; every remaining pixel answers "what data do you encode?".

- Label the series directly instead of a legend when there are few series; Y axis with few ticks and
  compact labels. Thresholds (number of series before a legend; how many ticks) → **see
  references/perception.md**; number format/locale → **references/dashboard-design-process.md**.
- Redundancy only when it's accessibility (color+texture, §5) — that is NOT chartjunk (see accessibility-mobile).

## 14. Storytelling (Knaflic): the chart has ONE message

- **The title is the CONCLUSION, not the variable**: "Response time dropped 40% after the cache" instead
  of "Average monthly response time". The axis/target already states the variable; the title sells the finding.
  On a live dashboard (the number changes on its own) the declarative title doesn't work — there the kicker names
  the question the chart answers and the DELTA (§6) carries the conclusion.
- **Gray is the protagonist**: context series in gray/neutral, the story's series in the
  highlight color. Everything colored = nothing highlighted.
- Context before the chart: if no action is possible, question the chart (§10 "data because it exists").
- Arc (context → tension → resolution), on-the-point annotation, Segel & Heer genres and memorability,
  **see references/storytelling.md (canonical source)**.

## 15. Integrity (Tufte lie factor + Cairo)

Cairo's five qualities, in this order: **truthful → functional → beautiful → insightful
→ enlightening**. Beautiful doesn't make up for dishonest.

- **A bar starts at ZERO** always (length is the encoding). A line may truncate the axis
  to show variation — signal it, and never to dramatize noise.
- **A dual axis deceives** (the choice of scales manufactures the correlation) — prefer two panels,
  a common index (base 100), or a scatterplot.
- Projection/estimate VISUALLY distinct from the measured (dashed, §5) — never in the same stroke.
- Lie factor (visual effect ÷ effect in the data ≈ 1), area by VALUE not by radius, % always with
  the N, missing data × zero, uncertainty (CI/fan chart), **see references/integrity-uncertainty.md
  (canonical source)**; seasonality and time-shape → **references/time-series.md** (honest window/cherry-picking stays in integrity).

## 16. Deep knowledge matrix (`references/`)

Each file: concepts + actionable rules ("do X because Y — Source") + anti-patterns + sources.
**Read the file when the work touches the topic** — this SKILL.md is the summary; exact thresholds,
notations, and debates live there.

| File | Load when |
|---|---|
| `references/chart-choice.md` | deciding chart/table type; arbitrating chart vs table vs sparkline; rare types (slope, dumbbell, bump); small multiples; part-to-whole |
| `references/perception.md` | choosing an encoding; number of series/legends; line aspect ratio; Gestalt; preattentive attributes; auditing perceptual error |
| `references/color.md` | palette/ramp (sequential/diverging/qualitative); CVD/contrast; dark mode; gray as protagonist; how many colors |
| `references/tables.md` | any table — alignment, zebra, density, sticky/virtualization, in-cell heatmap/bars/sparkline, sort, totals |
| `references/kpi-metrics.md` | KPI/BAN row; bullet graph vs gauge; thresholds; targets/variance; YoY vs MoM; rate vs count |
| `references/maps.md` | choropleth (rate, Jenks/quantile classification), proportional symbol, tile grid/hexbin, map vs bar |
| `references/interaction.md` | dynamic filters, drill (down/through/across), cross-filter/CMV, zoom, tooltip, onboarding, URL as state |
| `references/storytelling.md` | titles/annotations, narrative arc, Segel & Heer genres, scrollytelling, memorability, gray-out and highlight |
| `references/dashboard-typology.md` | classifying/auditing a dashboard (Few: strategic/analytical/operational); management report; IBCS/SUCCESS; AC/PY/BU/FC notation; export/PDF; cadence |
| `references/integrity-uncertainty.md` | axis/aggregation honesty; uncertainty (CI, fan chart, HOPs); small N; Simpson; missing data |
| `references/time-series.md` | time-shape: rebasing/base 100, seasonality and seasonal adjustment, YoY × MoM, moving average, banking to 45°, gap/missing period, forecast/projection |
| `references/monitoring-realtime.md` | operational/NOC dashboard; USE/RED/golden signals; actionable alert; staleness; incomplete current period |
| `references/accessibility-mobile.md` | WCAG in a chart; alt text; keyboard/screen reader; mobile/touch; SVG vs canvas by volume |
| `references/dashboard-design-process.md` | starting a screen from scratch; brief/requirements (Kirk's 4 stages, Fry's pipeline, Munzner's levels); validating with real data; standardizing across screens |
| `references/dataviz-research.md` | interviewing/testing with a dashboard user; personas/literacy; telemetry and A/B of data surfaces |
| `references/performance-latency-states.md` | slow dashboard; spinner/skeleton/empty; downsampling/pre-aggregation; budgeting filter/brush/drill latency |
| `references/dataviz-email-notification.md` | email digest/report; Slack/push alert; server-side chart (PNG); notification deep-link; white-label embed |

Beyond the 17 thematic files, `references/examples.md` gathers **worked examples** (before→after, cases
solved end to end) — read it when you want to see the principles applied together in a concrete case.

## Usage

When designing/reviewing any data surface: walk 0→10 in order (section 3 is a hard acceptance
rule); when designing/reviewing a specific CHART, also go through 11→15
(11 chooses the form, 12 validates the encoding, 13 cleans up, 14 gives the message, 15 audits the
honesty). When the work goes deep on a topic, **read the matrix file (§16)** before
deciding — that's where the thresholds and trade-offs are. In review, list violations with file:line
and the fix. Combine with `frontend-design` for visual identity and, when the project has one,
with the product's own theme/component macros.
