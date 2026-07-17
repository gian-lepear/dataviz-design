# KPIs, metrics, and targets

> Reference for the dataviz-design skill. Load when: designing/reviewing a KPI row, BANs, bullet graphs, gauges, targets/variance, state thresholds, temporal comparisons (YoY/MoM), normalized rates, metric definition/governance, or re-aggregation (summing snapshots, averaging rates, Simpson's paradox) in dashboards.

## Metric design: leading vs lagging, North Star, counter-metric/guardrail

Before you design the chart, the metric itself has to be well designed. Lagging metrics (revenue, realized churn) confirm the outcome but don't point to where to act; leading metrics (drivers: activation, weekly usage, pipeline) are actionable and predict the outcome. The North Star is the single metric that captures the value delivered to the customer and precedes revenue, fed by 3-5 inputs. Any metric that becomes a target degenerates without a counter-metric (guardrail) watching what it can cannibalize — that's Goodhart's Law applied to the dashboard.

**Rules:**
- Pair every outcome (lagging) metric with 1-3 drivers (leading) on the same screen, because a lagging metric only confirms the past and doesn't tell you where to act — Kaplan & Norton, The Balanced Scorecard, 1996 (outcome measures vs performance drivers)
- Structure the executive dashboard as 1 North Star at the top + 3-5 input metrics below, because input is what the team can actually move this week; the NSM only moves with a lag — Amplitude/John Cutler, The North Star Playbook, 2019
- Test the candidate North Star: if it rises, does revenue rise months later? If that causal link isn't there, it's a vanity metric and doesn't deserve the top of the screen — Amplitude, What Makes a Good vs Bad North Star Metric, 2019
- For every metric with a target on display, show the counter-metric it can degrade right next to it (delivery velocity × defect rate; orders shipped × return rate), because a quantity target with no quality pair invites gaming — Grove via Doerr, Measure What Matters, 2018; Kohavi/Tang/Xu, Trustworthy Online Controlled Experiments, 2020 (guardrail metrics)
- Don't grant KPI status to ever-growing cumulative totals (all-time signups, total pageviews), because they never fall and so never trigger a decision — Ries, The Lean Startup, 2011 (vanity metrics)
- Every KPI on the screen must answer "what decision changes if this number changes?"; if nobody knows, remove it — Few, Information Dashboard Design, 2006 (KPI tied to an objective, not to data availability)
- Pick 2-3 fixed guardrails (cancellation, support tickets, NPS) and treat a drop in them as a veto on the primary metric's "success," because growing the NSM while wrecking retention is failure in disguise — Amplitude, North Star Playbook, 2019; Mixpanel, Guardrail Metrics, 2023

**Anti-patterns:** A 100%-lagging dashboard (revenue, cumulative total, and historical counts only — pretty, unactionable); a chart of cumulative users since day one (a line that only rises) passed off as product health; a volume target (orders shipped/month) with no quality guardrail (return rate, negative reviews); 12 "KPIs" with equal visual weight — if everything is key, nothing is; a North Star that is revenue itself (too lagging to steer the product).

## Metric definition: single source and versioning

A number is trustworthy only if "the metric" has a single, certified definition — not one per dashboard, not one per analyst. When every screen recomputes "active customers" or "recurring revenue" with its own SQL, the same label starts meaning different things and the user loses faith in the whole dataset, not just that one number. The semantic layer (metrics layer) exists to centralize the definition once and serve it to every screen; and because definitions change, it has to be versioned and deprecated with a date — otherwise the historical series quietly shifts meaning mid-stream. A consistent definition is the precondition for the rest: without it, the baseline and delta from SKILL §6 compare different things.

**Rules:**
- Certify ONE definition per metric in a semantic layer / metrics layer (e.g., dbt Semantic Layer, LookML, Cube) as the single source, and have every screen consume it instead of reimplementing the calculation, because each dashboard that rewrites "active customers" in its own SQL produces a distinct number under the same label — semantic-layer / headless-BI practice (dbt Labs; Looker)
- Use the SAME definition of each metric on every screen (same numerator, denominator, filters, and window), just as the same value uses the same format on every screen, because a divergence in definition erodes trust in the whole dataset and not just that one number — see references/dashboard-design-process.md (multi-screen governance); Barr, PuMP, 2017
- Version and deprecate the definition when it changes, noting the change date on the metric itself, because silently redefining "revenue" or "active user" breaks the historical comparison — the series gains a step where only the ruler moved — metric-governance practice (Barr, PuMP, 2017)
- Show the freshness stamp on the screen ("data as of {date}" / "updated at"), because a KPI with no reference date is unauditable: the reader can't tell whether they're looking at yesterday's close or one from a month ago — provenance / trustworthiness practice

**Anti-patterns:** Five dashboards with five definitions of "active customer" (each squad its own) and nobody knows which one goes up to the board; redefining the metric (swapping the denominator, adding a new segment) without deprecating the old one or dating the change — the series quietly starts comparing apples to oranges; each screen recomputing the KPI in its own SQL instead of pulling from the semantic layer; a KPI with no "updated at" stamp.

## Few's bullet graph: anatomy and exact specification

The bullet graph (Few, 2005) replaces gauges: a linear bar showing a featured measure + a comparative measure (target/previous year) + qualitative ranges, in a narrow, stackable strip. Five components: a text label, a quantitative scale, the featured measure, 1-2 comparative measures (optional), and 2-5 qualitative ranges (optional). The linear form reads faster than a radial one and lets dozens of measures line up on a common scale.

**Rules:**
- Encode the featured measure as a bar about 1/3 the thickness of the container, darker than everything else (100% black / accent color), because it's the primary data and should dominate visually — Few, Bullet Graph Design Specification, 2013 (perceptualedge.com)
- Encode the target/comparative as a short stroke PERPENDICULAR to the bar (not a second bar), behind the measure where they cross; a second comparative at 75% black — Few, spec, 2013
- Use 2-5 qualitative ranges, ideally 3, never more than 5, because beyond that perceptual reasoning stops being efficient on a dashboard — Few, spec, 2013
- Fill the ranges with intensities of ONE single hue (3 ranges: 40%/25%/10% black; 5 ranges: 50/35/20/10/3%), dark = bad and light = good, because distinct hues (green/yellow/red) fail for color-blind readers — Few, spec, 2013
- Start the scale at zero; if you must cut the zero for focus, swap the bar for a symbol (an X or a dot), because a truncated bar's length lies about the proportion — Few, spec, 2013; proportional-ink principle in Wilke, Fundamentals of Data Visualization, 2019
- For "lower is better" metrics (expenses, defects, cancellations), reverse the order of the ranges (dark on the right), because the good/bad semantics should be read without consulting a legend — Few, spec, 2013
- When comparing against a future target (e.g., today vs the quarter's target), add a projection segment based on the current pace, because distance to target doesn't tell you whether you're on pace — Few, spec, 2013 (optional features)
- Stack bullets on a common scale and alignment when the units match; about 10 bullets fit in the space of 1 gauge — Few, Information Dashboard Design, 2006

**Anti-patterns:** Ranges in saturated green/yellow/red (breaks for ~8% of men and shouts louder than the data); a measure bar the same thickness as the background (measure and context can't be told apart); the target as a second parallel bar instead of a perpendicular stroke; a bullet with no quantitative scale or value label; more than 5 qualitative ranges ("excellent/great/good/fair/watch/bad/critical").

## Why the gauge/speedometer wastes space (and what to use instead)

The radial gauge shows a single number filling a large square of screen, surrounded by skeuomorphic decoration (bezel, needle, gloss) that is pure non-data ink. Beyond the space cost, it reads worse: judging an angle is perceptually less precise than judging position on a common scale. A gauge also rarely carries history or context beyond the target.

**Rules:**
- Replace each gauge with a bullet graph, because it delivers the same information (value + target + ranges) in a narrow strip — about 10 bullets fit in the space of 1 gauge — Few, Dashboard Design: Beyond Meters, Gauges, and Traffic Lights, 2005
- Prefer linear encodings (position/length) over angular ones, because in the perceptual hierarchy position on a common scale > length > angle, with visibly larger estimation error for angle — Cleveland & McGill, Graphical Perception, JASA, 1984
- If the space fits only one number, show number + delta + sparkline instead of a gauge, because a gauge shows no trend and the bare number at least shows the value precisely — Few, Information Dashboard Design, 2006; Tufte, Beautiful Evidence, 2006
- Drop the metallic bezel, 3D needle, reflection, and decorative gradient: it's ink with no data; maximize the data-ink ratio — Tufte, The Visual Display of Quantitative Information, 1983
- Never use a gauge to compare several units (one gauge per salesperson/state), because comparing angles across separate dials is the worst possible perceptual task; use stacked bullets or sorted bars — Cleveland & McGill, 1984; Few, 2006

**Anti-patterns:** A grid of 6 speedometers filling the dashboard's top fold; a 3D gauge with gloss and a chrome needle (skeuomorphism); a donut-gauge with % in the center for a metric that has a target and ranges (the ring adds nothing to the number); a gauge with no ranges or target — just a needle on an arc, the information of a bare number in 60× the area.

## Thresholds and state bands (good/watch/critical)

Qualitative bands translate a number into a judgment — but they only work if the thresholds have a defensible origin (a contracted target, an SLA, historical percentiles, statistical control limits) and if the visual encoding survives color blindness. The dominant mistake is a pure red/green traffic light with magic, sourceless thresholds. The second mistake is coloring natural process variation as if it were signal.

**Rules:**
- Limit to 3 states (5 absolute maximum), because more states exceed efficient perceptual discrimination in a monitoring context — Few, Bullet Graph Design Specification, 2013
- Never encode state with red vs green alone: use the intensity of one hue and/or a redundant shape icon (▲/●/✖), because ~8% of men have a red-green deficiency — Few, Information Dashboard Design, 2006; Okabe & Ito, Color Universal Design, 2008
- Signal by exception: an alert color/icon appears only when the metric leaves the acceptable band, because a preattentive attribute only works if it's rare — if everything is colored, nothing pops — Ware, Information Visualization, 2004; Few, 2006
- Document the origin of each threshold on the screen itself (tooltip or legend: "contractual target," "p75 of the last 12 months"), because a sourceless threshold breeds debate about the threshold instead of action on the metric — Stacey Barr, Prove It!/PuMP, 2017
- Before painting a swing red, check whether it exceeds the process's natural variation (XmR / 3-sigma limits), because reacting to common-cause noise causes tampering — it makes the process worse — Wheeler, Understanding Variation, 1993
- Each state must map to a distinct action (watch = investigate; critical = intervene now); if two bands trigger the same action, merge them — Barr, PuMP, 2017
- Band states belong to the background (context), never to the data: light band behind, dark measure in front — Few, spec, 2013

**Anti-patterns:** A saturated red/yellow/green traffic light in every table cell (Excel-style), the screen turning into a Christmas tree; a magic threshold (why 80%? nobody knows) with no record of its origin; 7 rainbow-gradient bands for "granularity"; painting red a 2% dip that sits within normal weekly variation; a dashboard where 80% of items are "in alert" — the worst item becomes invisible.

## Big number (BAN): typographic hierarchy, delta, and sparkline

When the message is one or two numbers, a big, direct number communicates better than any chart — it's the BAN (Big-Ass Number) from the Big Book of Dashboards. But a number with no comparison isn't information: every BAN carries a delta against a named baseline and, ideally, a word-sized sparkline that gives the shape of the story (trend, volatility, spike) in a square centimeter.

**Rules:**
- If the message fits in 1-2 numbers, show the big number as text, not a single-bar chart or a one-slice pie — Knaflic, Storytelling with Data, 2015 (simple text)
- Tile typographic hierarchy: small label on top (uppercase/gray), value 2-4× larger in the middle, context (delta + baseline period) smaller at the bottom, because the eye should land on the value and find the context adjacent without scanning — Wexler, Shaffer & Cotgreave, The Big Book of Dashboards, 2017 (BANs)
- Every BAN requires an explicit comparison (vs target, vs prior period, vs same date last year), because an isolated measure doesn't say whether it's good or bad — Few, Information Dashboard Design, 2006
- Write the delta with sign, value, and named baseline ("+12% vs Jun/25"), never just a colored arrow, because a change with no baseline is unauditable — IBCS Standards (Hichert & Faisst), 2017
- Map the delta's color to the judgment, not the direction: churn falling is green, cost rising is red — The Big Book of Dashboards, 2017
- Attach a word-sized sparkline to the number: no axes or gridlines, a point marked only on the last value (and min/max if relevant), because it answers "is this a trend or a hiccup?" without costing space — Tufte, Beautiful Evidence, 2006
- Give each sparkline its own vertical scale (don't force a common scale across metrics of different units), because a sparkline shows shape, not comparable magnitude — Tufte, 2006
- Round to 2-3 significant digits ($1.24M, not $1,243,567.89), because excess precision slows reading without changing the decision — Ehrenberg, Rudiments of Numeracy, JRSS, 1977; Few, Show Me the Numbers, 2004
- Limit the KPI row to ~5 tiles with one of them dominant, because rows of 8+ identical tiles cancel the BAN's job of standing out — Big Book of Dashboards, 2017

**Anti-patterns:** An orphan BAN (a big number with no delta, no target, no period); a green up-arrow on a bad-is-up metric (complaints +30% shown "green"); a grid of 12 identical tiles with no hierarchy — none is truly "big"; a number with cent-level precision on a value in the millions; sparklines of distinct metrics tied to a common scale, flattening them all; a "+15%" delta that never says against what (prior month? same month last year? target?).

## Targets and variance: absolute vs percent-of-the-way, actual/plan notation

Showing progress against a target means choosing the unit of comparison: absolute variance, relative variance (%), or percent-of-the-way. Each one alone lies: % attained hides magnitude, absolute hides scale, and comparing a partial running total against the full-period target produces a false alarm or false comfort. The IBCS standard solves this with a fixed scenario notation (see references/dashboard-typology.md) and variances shown explicitly in both absolute AND relative terms.

**Rules:**
- Show the variance precomputed (absolute Δ and Δ%) instead of putting actual and plan side by side for the reader to subtract in their head, because making the reader do arithmetic wastes attention — IBCS Standards, 2017 (variance charts); Few, 2006
- Apply the standardized scenario notation to KPI tiles and variance bars too (actual, plan, previous year — solid light gray — and forecast, distinguishable by fill; see references/dashboard-typology.md), because a plan or forecast value that looks like actual corrupts the reading of the target in the KPI itself — IBCS (Hichert & Faisst), v1.1, 2017
- Compare the running total against the target pro-rated to elapsed time (target-to-date), not against the full-period target, because 40% of the annual target by March can mean excellent pace — IBCS practice; Few, Bullet Graph Design Specification, 2013
- Add an end-of-period projection at the current pace (a lighter/hatched segment after the actual), because "$300k to go" doesn't say whether you'll get there — Few, spec, 2013 (optional features)
- On a %-of-target bar, extend the scale past 100% with a visible marker at 100%, because a bar that saturates at 100% hides overshoot (and overshoot is information too: a badly calibrated target) — Few, 2006
- For "lower is better" metrics (cost, churn, delinquency), invert the variance semantics: coming in below plan is favorable (green), above is unfavorable — IBCS, 2017
- Don't report a percentage change alone on a small base (+100% may be 1→2); always pair it with the absolute value — Cairo, How Charts Lie, 2019; Huff, How to Lie with Statistics, 1954

**Anti-patterns:** A "% of target" donut that visually caps at 100% and can't distinguish 100% from 180%; "target hit at 320%" celebrated (that's a sandbagged target, not performance); a Jan-Mar running total compared against the ANNUAL target — "25% of target" looking like a shortfall; plan and actual in the same solid color, distinguishable only by the legend; a variance the reader has to compute in their head across two columns of numbers.

## Seasonality in comparisons: YoY vs MoM vs same-day-of-week

Every temporal comparison embeds an assumption about seasonality. MoM mixes monthly seasonality with calendar size (28-31 days); YoY neutralizes annual seasonality but hides recent inflections and breaks on an anomalous base year (base effect); metrics with a weekly cycle can only be compared same-day-of-week. The dashboard should choose the right comparison per metric, not apply "vs prior period" blindly.

**Rules:**
- For metrics with a weekly cycle (traffic, sales, usage, orders), compare today vs the same weekday last week (or the average of the last 4 same-weekdays), never vs yesterday, because Monday ≠ Sunday as a rule — Kohavi, Tang & Xu, Trustworthy Online Controlled Experiments, 2020 (day-of-week effects; analyze in whole weeks)
- Use YoY for metrics with strong annual seasonality, but check the base year: huge growth over a depressed base (e.g., Apr/2021 vs Apr/2020) is a base effect, not a trend — Cairo, How Charts Lie, 2019; Graban, Lean Blog: Misleading Year-Over-Year Charts, 2020
- Before comparing MoM, normalize by days in the month (or business days), because Feb→Mar carries up to +10.7% of growth from the calendar alone (28→31 days) — standard web-analytics practice; IBCS
- Smooth daily series with a 7- or 28-day moving average (28, not 30: it holds exactly 4 whole weeks), because a window that isn't a multiple of 7 leaves a residue of the weekly cycle — Kohavi et al., 2020
- When the SHAPE of the seasonality matters, overlay one line per year on a Jan-Dec axis, current year highlighted and prior years in gray, labeled at the end — Datawrapper, What to consider when creating line charts, 2021; Few, Show Me the Numbers, 2004 (direct labeling)
- Visibly mark an incomplete period (a hatched/lighter bar or a "month in progress" annotation), because the reader reads the partial current month as a collapse of the metric — IBCS forecast notation, 2017
- Compare YTD against prior-year YTD (the same window of days), never YTD vs a full year, because the asymmetric comparison always "loses" — Graban, Lean Blog, 2020

**Anti-patterns:** A red alert of "40% drop" comparing Sunday with Friday; a "best month ever" that's just the 31-day month vs the 30-day one; an incomplete current month plotted as closed — the last bar always "plummets"; YoY over an anomalous base year sold as structural growth; a 30-day moving average that ripples with the residual weekly cycle; a "vs prior period" delta applied uniformly to every metric on the dashboard, ignoring each one's cycle.

## Rate vs count: normalization and the small-base problem

A raw count reflects the size of the base (population, customer book, order volume); a rate isolates the phenomenon. The choice changes the story: a totals map becomes a population map, a totals ranking becomes a size ranking. But a rate on a small base is unstable — the variance grows with 1/n, so the smallest units dominate both the top and the bottom of any rate ranking.

**Rules:**
- Normalize before comparing units of different sizes (per 100k population, per customer, per order), because a raw count recreates the population ranking/map, not the phenomenon — Dougherty & Ilyankou, Hands-On Data Visualization, 2021; Cairo, How Charts Lie, 2019
- A choropleth NEVER with absolute totals — only rates, percentages, or per capita; an absolute total goes on a proportional-symbol map — Datawrapper Academy (Lisa Charlotte Muth); Dougherty & Ilyankou, 2021
- Show the rate AND n together when the decision depends on both ("50% conversion · n=4"), because a rate with no visible denominator is neither auditable nor trustworthy — Few, Show Me the Numbers, 2004
- Filter rate rankings by a minimum n (or use Bayesian smoothing), because variance ∝ 1/n makes tiny bases occupy both extremes of the ranking — Wainer, The Most Dangerous Equation, American Scientist, 2007 (de Moivre's equation; the small-schools case)
- Write the denominator in the metric's label ("returns per 100 orders delivered"), because "return rate" with no base allows three different readings — IBCS, 2017; Datawrapper Academy
- Distinguish percentage points from percent: 10%→12% is +2 pp and +20%; always name the unit, because the confusion shifts the perceived magnitude by 10× — Cairo, How Charts Lie, 2019
- If the denominator also varies over time, show numerator, denominator, and rate (or annotate the change in base), because the rate can "improve" with the numerator falling less than the base — Wheeler, Understanding Variation, 1993
- Don't headline relative growth off a tiny base ("we doubled!" = from 1 to 2); lead with the absolute and give the relative as context — Huff, How to Lie with Statistics, 1954

**Anti-patterns:** A choropleth of absolute totals (a population map in disguise); a conversion ranking led by a salesperson with n=3; a rate KPI with n nowhere on the screen; pp and % used interchangeably on the same dashboard; "we grew 100%" off a base of 2 units; a rising rate celebrated while numerator and denominator plummet together.

## Re-aggregation: don't sum snapshots, don't average rates

Rolling a metric up — summing days into a month, branches into a chain, segments into a total — looks trivial and breaks silently in two cases. Stock snapshots (balance, inventory, headcount, active subscribers) are already cumulative: summing them over time counts the same value multiple times. And a rate is not an average of rates — the overall rate is a ratio of sums, not the arithmetic mean of the pieces' rates, because ignoring the size of each base gives equal weight to unequal groups. When the mix of bases changes across the compared groups or periods, this becomes Simpson's paradox: every segment improves and the total gets worse.

**Rules:**
- Don't sum snapshots of a stock metric (balance, inventory, headcount, active subscribers) over time — aggregate by end-of-period, average, or last value, never by sum — because a stock is already cumulative and summing it double-counts the same value (stock vs flow distinction) — the concept of stock vs flow variables (economics/accounting)
- Compute an aggregate rate as Sum(numerator)/Sum(denominator), NEVER as the mean of the partial rates, because the mean of rates gives equal weight to unequal bases (10% of 1,000 and 5% of 10,000 give 5.45%, not 7.5%) — statistical-weighting practice; Cairo, How Charts Lie, 2019 (aggregation paradoxes)
- Store numerator and denominator (additive measures) in the data layer, not the precomputed rate, because a ratio is not re-aggregable — only numerator and denominator sum correctly across groups — semantic-layer practice (additive vs non-additive measures)
- Flag Simpson's-paradox risk when the mix of sub-bases changes across the compared groups/periods: the aggregate can flip the sign of every segment — investigate segmented before reporting the total — Kohavi, Tang & Xu, Trustworthy Online Controlled Experiments, 2020 (Simpson's paradox); Cairo, How Charts Lie, 2019 (amalgamation paradox)
- Before comparing two rate totals across periods, check whether the composition of the sub-bases changed (new segments, different weights); if it did, decompose, because the aggregate's change can be pure mix effect, not the phenomenon — Kohavi et al., 2020; Wheeler, Understanding Variation, 1993

**Anti-patterns:** Summing each month's end-of-period balance to get "the quarter's total" (double-counting a stock); "average conversion for the year" = the mean of the 12 monthly rates (ignoring that December had 10× the traffic); reporting the precomputed rate and then trying to sum it across branches; a rate total improving while every segment gets worse, with no look at the mix (Simpson); a "cumulative actives" KPI summing each day's snapshot.

## Sources

- Robert Kaplan & David Norton, The Balanced Scorecard, 1996
- John Cutler / Amplitude, The North Star Playbook, 2019
- Amplitude, What Makes a Good vs Bad North Star Metric, 2019
- John Doerr, Measure What Matters, 2018
- Ron Kohavi, Diane Tang, Ya Xu, Trustworthy Online Controlled Experiments, 2020
- Eric Ries, The Lean Startup, 2011
- Charles Goodhart, 1975 / Marilyn Strathern, 1997 (Goodhart's Law)
- Mixpanel, Guardrail Metrics, 2023
- Stephen Few, Information Dashboard Design, 2006 (2nd ed. 2013)
- Stephen Few, Bullet Graph Design Specification (rev. Oct/2013), Perceptual Edge, 2006-2013
- Stephen Few, Dashboard Design: Beyond Meters, Gauges, and Traffic Lights, Business Intelligence Journal, 2005
- Stephen Few, Show Me the Numbers, 2004
- Claus Wilke, Fundamentals of Data Visualization, 2019
- William Cleveland & Robert McGill, Graphical Perception, JASA vol. 79, 1984
- Edward Tufte, The Visual Display of Quantitative Information, 1983
- Edward Tufte, Beautiful Evidence (sparklines), 2006
- Donald Wheeler, Understanding Variation: The Key to Managing Chaos, 1993
- Stacey Barr, Prove It! How to Create a High-Performance Culture and Measurable Success, 2017 (PuMP)
- Colin Ware, Information Visualization: Perception for Design, 2004
- Masataka Okabe & Kei Ito, Color Universal Design, 2008
- Steve Wexler, Jeffrey Shaffer, Andy Cotgreave, The Big Book of Dashboards, 2017
- Cole Nussbaumer Knaflic, Storytelling with Data, 2015
- Andrew Ehrenberg, Rudiments of Numeracy, Journal of the Royal Statistical Society, 1977
- Rolf Hichert & Jürgen Faisst, IBCS — International Business Communication Standards (SUCCESS rules), v1.1 2017
- Alberto Cairo, How Charts Lie, 2019
- Darrell Huff, How to Lie with Statistics, 1954
- Mark Graban, Be Careful With Misleading Year-Over-Year Charts, Lean Blog, 2020
- Datawrapper Blog, What to consider when creating line charts, 2021
- Jack Dougherty & Ilya Ilyankou, Hands-On Data Visualization, 2021
- Lisa Charlotte Muth / Datawrapper Academy (choropleth and normalization guides)
- Howard Wainer, The Most Dangerous Equation, American Scientist vol. 95, 2007
- dbt Labs (dbt Semantic Layer / MetricFlow), Looker (LookML), Cube — semantic layers / metrics layer (single source for a metric's definition)
- The concept of stock vs flow variables (macroeconomics/accounting) — stock snapshots don't sum over time
