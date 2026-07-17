# Perceived performance, latency, and loading states in data

> Reference for the dataviz-design skill. Load when: a dashboard/chart is slow, choosing spinner/skeleton/empty state, deciding downsampling/pre-aggregation/cache, choosing a chart lib or SVG/Canvas/WebGL, budgeting filter/brush/drill latency.

## Response-time limits: 0.1s / 1s / 10s (and the 500ms step in dataviz)

Three perceptual thresholds, stable since Miller (1968), formalized by Card, Robertson & Mackinlay (1991) and popularized by Nielsen (1993): ~0.1s reads as instantaneous (direct manipulation), ~1s keeps the train of thought going even when the delay is noticed, and ~10s is the limit of attention before the user switches tasks. In exploratory visualization the working threshold is tighter: Liu & Heer (2014) measured that a mere +500ms of latency per operation significantly reduces activity, dataset coverage, and the rate of observations/hypotheses. Each class of interaction should be budgeted against its own threshold, not against a global page average.

**Rules:**
- Budget brushing, hover/tooltip, pan, and cross-filtering for <100ms of visual response, because past that the user loses the sense of directly manipulating the data — Card, Robertson & Mackinlay, The Information Visualizer, 1991; Nielsen 1993
- Budget filter changes, drill-down, and loading a panel for <1s, because up to 1s the train of reasoning holds without special feedback; past that a loading indicator is mandatory — Nielsen, Response Times: The 3 Important Limits, 1993
- Treat 500ms as the ceiling for operations repeated in an exploratory loop (not 1s), because +500ms per operation significantly cut the number of interactions, data coverage, and insights/minute in a controlled experiment — Liu & Heer, InfoVis 2014
- Never let an interaction run past 10s without a partial result or percent progress, because 10s is the point where the user mentally abandons the task — Miller 1968; Nielsen 1993
- Prioritize the latency of frequent interactions (hover, brush, filter) over that of the initial load, because high latency has a residual effect: users exposed to delay keep exploring less even after the system becomes fast — Liu & Heer 2014
- If the backend can't hit <500ms, degrade the operation to something cheaper (e.g., a brush updates only the focused view and lets the rest race asynchronously), because users switch strategies and start avoiding expensive operations, biasing the analysis — Liu & Heer 2014
- Use 400ms as an aggressive target when productivity matters (daily use by an operator), because below the Doherty threshold productivity grows more than proportionally to the time saved — Doherty & Thadani, IBM, The Economic Value of Rapid Response Time, 1982
- Measure and report latency per interaction class (p95 of hover, p95 of filter, p95 of load), because a page average hides exactly the operations that break the exploratory loop — Shneiderman, Response Time and Display Rate, 1984

**Anti-patterns:** The same 2s spinner for a hover and a month change (interaction classes have different budgets); accepting 900ms on a cross-filter because "it's under 1s" — the behavioral cost already showed up at 500ms; a 500ms+ debounce on every input "just to be safe," stacked on top of server latency; optimizing only the initial load while ignoring that every filter click re-runs the whole query in 3s.

## Progressive visual analytics: a partial result before the final one

When the computation doesn't fit the interactive budget, the alternative to blocking is to process in chunks and show partial results that refine over time, keeping the user in the loop (Stolper, Perer & Gotz 2014; Fekete & Primet 2016). Zgraggen et al. (2017) showed experimentally that users of progressive visualization generate insights at a rate comparable to the instantaneous condition and clearly better than the blocking condition (6s/12s delays). The design challenge is updating without disorienting: the partial has to be interpretable, signal uncertainty, and not rearrange the layout on every refresh.

**Rules:**
- Prefer showing a partial aggregate with a progress and completeness indicator ("34% of records processed") over blocking with a spinner, because progressive keeps the insight rate comparable to instantaneous while blocking degrades coverage and engagement — Zgraggen et al., TVCG 2017; Stolper et al. 2014
- Ensure partial results are "increasingly meaningful": each chunk should refine the estimate, not flip the answer's sign without warning — an explicit design goal for progressive algorithms — Stolper, Perer & Gotz, VAST/TVCG 2014
- Don't reorder bars/lines or rescale axes on each partial update; freeze the scale and ordering (or animate with an explicit transition) because updates that rearrange the layout destroy the mental map and distract from the analysis — Stolper et al. 2014 (design goal: minimize distracting changes)
- Visually signal where new data landed (a temporary highlight, an update badge), because without a cue the user can't tell whether what changed was the data or their perception of it — Stolper et al. 2014
- Show the partial's uncertainty (confidence interval, band, opacity) while it refines, because users decide on the partial as if it were final if nothing indicates otherwise — Fekete & Primet 2016; Zgraggen et al. 2017
- Give control: pause/resume the refinement and let the user interact with the partial (filter, prioritize a subspace), because the value of the paradigm is the user steering the computation, not just watching — Stolper et al. 2014
- Cap chunk latency (e.g., first partial in <1s, updates every 1-3s), because the progressive paradigm is defined by guaranteeing a latency quota per iteration, not by "finishing fast" — Fekete & Primet, Progressive Analytics, 2016

**Anti-patterns:** A bar growing and swapping rank positions on every chunk, with no fixed scale; a partial visually identical to the final (no completeness % and no uncertainty) — decisions made on 10% of the sample; fake-progressive that freezes all interaction until the end; streaming individual points causing continuous repaint and jank instead of chunks at a fixed cadence.

## Honest time-series downsampling: LTTB and M4

Rendering more points than available pixels only costs bandwidth and frames without adding information; the trick is to reduce without lying about the shape. LTTB (Steinarsson 2013) splits the series into equal buckets and picks, in each one, the point that forms the largest triangle with its neighbors, preserving the line's perceptual shape. M4 (Jugel et al., VLDB 2014) selects min, max, first, and last per pixel column and proves this yields the pixel-perfect line chart (error-free at the canvas resolution) with reductions of up to ~100x in the volume transferred. Decimating — reducing points while preserving shape — is a rendering problem and lives here; transforming the series' time-shape (rebasing, seasonal adjustment, YoY, moving average, banking, forecast) is a different decision and belongs in references/time-series.md.

**Rules:**
- For line charts over long series, do the aggregation in the database with M4 (min/max/first/last per pixel-column bucket), because it produces the same image as the full series at the given resolution, with up to two orders of magnitude less data — Jugel, Jerzak, Hackenbroich & Markl, VLDB 2014
- Never downsample by bucket average for a line display, because averaging flattens peaks and valleys — exactly the features (spikes, outages) the reader is looking for — Jugel et al. 2014
- Use LTTB when you want a visually smooth line with a fixed target N (e.g., a threshold of 500-2000 points for a ~1000px chart), because it preserves the global shape better than uniform sampling or averaging — Steinarsson, Downsampling Time Series for Visual Representation, MSc U. Iceland, 2013
- If isolated peaks are critically important (alerts, anomalies), prefer M4 or MinMaxLTTB over pure LTTB, because LTTB can discard extremes when a bucket holds multiple candidates — Van Der Donckt et al., MinMaxLTTB, 2023; Jugel et al. 2014
- Recompute the downsampling on every zoom (server-side, with the new interval), because resampling the already-sampled accumulates error and negates the benefit of zooming — Jugel et al. 2014 (query rewriting by resolution)
- Size the number of points by the container width in pixels (e.g., 4 tuples per pixel column in M4), not by a magic constant, because the information limit is the device resolution, not the dataset — Jugel et al. 2014; Liu, Jiang & Heer 2013
- Declare in the UI when the series is aggregated/decimated (e.g., "resolution: 5min" or "showing 2k of 1.2M points"), because silent downsampling erodes trust when the user exports and sees different numbers — graphical integrity principle, Tufte 1983; Cairo, The Truthful Art, 2016

**Anti-patterns:** Shipping 500k raw points to the browser and blaming the lib; a bucket average that erases the 3am error spike; random sampling of a time series (breaks continuity and creates false features); zoom that just stretches the same decimated points; a decimation threshold hard-coded at 10k points in a 120px sparkline.

## Pre-computed aggregation and prefetch for big-data viz: imMens, nanocubes, Falcon

The imMens principle (Liu, Jiang & Heer 2013): perceptual and interactive scalability should be bounded by the chosen resolution of the visualization, not by the number of records — binned aggregation + multivariate data tiles sustain 50fps brushing over billions of rows. Nanocubes (Lins, Klosowski & Scheidegger 2013) materialize spatiotemporal aggregations in an in-memory index that answers in milliseconds and fits on a laptop. Falcon (Moritz, Howe & Heer 2019) adds interaction-driven prefetch: on focusing a view, it precomputes brush indices, making the cost of brushing constant and independent of selection size (cold start over ~1.7 billion records).

**Rules:**
- Design the query by the chart's resolution (bins, not rows): a 40-bin histogram needs 40 numbers, never the table — because visual resolution, not cardinality, is the right scalability limit — Liu, Jiang & Heer, imMens, EuroVis 2013
- For dashboards with frequent cross-filtering, precompute cubes/tiles of the brushed dimension combinations, because live aggregation per interaction blows the 100ms brushing budget — Liu, Jiang & Heer 2013; Lins et al., Nanocubes, TVCG 2013
- Prioritize the latency of the interaction in progress over that of the passive views: update the view under the cursor in <100ms and let the rest refine afterward, because the user only perceives the latency of what they're manipulating — Moritz, Howe & Heer, Falcon, CHI 2019
- Use hover/focus as a prefetch signal (load the brush index when the mouse enters the chart), because the time between focusing and brushing hides the indexing latency — Moritz, Howe & Heer 2019
- Accept trading resolution for latency explicitly (coarser bins during the drag, refinement on mouse-up), because constant latency is worth more to the exploratory loop than pixel precision during the gesture — Moritz, Howe & Heer 2019; Liu & Heer 2014
- Cancel stale queries when a new interaction arrives (last write wins), because out-of-order responses paint old state over the current one — standard practice derived from crossfilter/Falcon — Moritz et al. 2019
- In a server-rendered app (SQL behind it), apply the same principle with GROUP BY at the chart's resolution + indexes/materialized views on the filterable dimensions, because the imMens/nanocubes insight is stack-agnostic — Liu, Jiang & Heer 2013; Kimball & Ross 2013 (aggregate tables)

**Anti-patterns:** SELECT * of 2M rows for the browser to aggregate in JavaScript; a cross-filter firing a full query across every view on each pixel of the drag; out-of-order responses overwriting the current filter; pre-aggregating every dimension combination (combinatorial explosion) instead of the ones actually brushable; refusing pre-aggregation "because the data changes" when the refresh is daily and the live query costs 8s.

## A hierarchy of loading states: skeleton vs spinner vs blank, and zero layout shift

The right loading indicator depends on the expected duration: nothing up to ~1s, an indeterminate indicator (spinner/skeleton) from ~1s to ~10s, and percent progress above ~10s (Nielsen 1993; Myers 1985). Skeletons are no silver bullet: the Viget test (2017, n=136) found the skeleton worse than a spinner and than a blank screen for perceived wait, whereas the ECCE study (2018) and Chung's test (2018) found the opposite — the difference lies in skeletons that faithfully mirror the final layout, on short waits (<3s), with smooth animation. In dashboards the non-negotiable rule is zero layout shift: the chart container is born at its final dimensions and the content fills in without pushing anything (CLS <= 0.1).

**Rules:**
- Show no indicator at all for waits <1s, because the flash of the spinner draws more attention than the wait and makes the UI feel slower — Nielsen 1993; derived convention: a ~300-500ms delay before showing the indicator
- For 2-10s use an indeterminate indicator; above ~10s use a percent-done indicator with an estimate, because users prefer percent-done (86% in the original study) and it reduces anxiety and abandonment — Myers, The Importance of Percent-Done Progress Indicators, CHI 1985; Nielsen 1993
- Reserve each card/chart's final height and width before the fetch (fixed aspect-ratio or min-height), because layout shift during loading causes misclicks and breaks reading — Google Core Web Vitals, CLS <= 0.1, 2020
- If you use a skeleton, make it mirror the real layout of the content (same positions for title, axis, bars), because a generic skeleton that doesn't match what arrives performs worse than a spinner for perceived wait — Viget, A Bone to Pick with Skeleton Screens, 2017; Kadlec 2020
- Prefer a skeleton over a spinner only for short waits (~<3s) and with a slow, steady wave animation, because under those conditions skeletons are perceived as faster; on long waits they frustrate — Chung, uxdesign.cc, 2018; ECCE 2018 (skeleton better on perceived speed)
- When re-querying due to a filter change, keep the previous chart visible but dimmed (opacity ~0.5 + a discreet indicator) instead of swapping it for a skeleton, because erasing the previous state destroys the before/after comparison context — Stolper et al. 2014 (minimize distracting change); loading indicator tied to the request (aria-busy on the container)
- One loading state per region, not a global one: each dashboard card loads and resolves independently, because a full-page spinner holds the already-ready content hostage to the slowest query — Nielsen 1993 (feedback per task unit); Few 2006 (dashboard as a set of independent views)
- Announce the transition to screen readers (aria-busy on the container, aria-live='polite' on the result), because a loading state invisible to AT leaves the user unsure whether the action worked — WAI-ARIA Authoring Practices, W3C

**Anti-patterns:** A spinner that flashes for 150ms on every interaction; a generic list skeleton that turns into a bar chart (a structural lie); a chart with no reserved height making the page jump; a global spinner blocking 6 cards over 1 slow query; a fake progress bar that walks to 90% and freezes; swapping valid content for a skeleton on every filter refetch, erasing the comparison context.

## Empty, error, and no-data states: empty state as onboarding, not a dead end

A blank container is not neutral: it lowers trust, hides functionality, and stalls the task (NN/g). A well-designed empty state does three jobs: it communicates system status, teaches what belongs in that spot, and offers the actionable next step. In dataviz there are four semantically distinct empties that call for different treatments: first use (no data yet), a filter with no results, zero as a legitimate answer, and a loading error — conflating them causes everything from needless panic to a wrong decision.

**Rules:**
- Explicitly distinguish the four empties — first use, filter with no match, real zero, and error — each with its own message and action, because "No data" doesn't say whether the system broke, the filter is too restrictive, or zero is the answer — NN/g, Designing Empty States in Complex Applications, 2021; Carbon Design System, Empty States pattern
- On first use, show what the area will contain and a direct CTA (e.g., "Create your first account segment"), because the empty state is the moment of greatest teaching of the app's structure — NN/g 2021
- On a filter with no results, show the active filters and offer one-click relaxation ("clear sector", "widen the period"), because a dead end forces the user to rebuild the query from memory — NN/g 2021; no-hits search-results pattern, Nielsen 2001
- When zero is the answer (e.g., 0 deals closed in the month), plot the zero on the chart at normal scale and say it's data, not absence, because hiding the zero destroys the time series and the comparison — Wilke, Fundamentals of Data Visualization, 2019 (missing data vs zero value); IBCS 2017
- Distinguish "no data" (null/not collected) from zero visually (gap in the line, hatching, a "not collected" annotation), because interpolating over a collection gap fabricates data — Wilke 2019
- On an error, say what failed in user language, keep the last valid data visible when it exists (with a timestamp) and offer inline retry, because a blank red screen throws away context the user could still use — NN/g 2021; Few, Information Dashboard Design, 2006 (data needs a freshness context)
- Never render empty axes and gridlines with no message (a "ghost" chart), because the reader can't tell a bug from an empty dataset — Carbon Design System, Empty States pattern; Cairo 2016

**Anti-patterns:** A chart with axes drawn and an empty plot area with no explanation; the same "No results" message for a 500 error and a restrictive filter; a cute empty state with an illustration but no action; a new dashboard hiding empty cards (the user never discovers the feature); an interpolated line crossing 3 weeks with no collection; an error that wipes the whole dashboard when only 1 of 6 widgets failed.

## SVG vs Canvas vs WebGL: practical thresholds of points and frames

SVG creates one DOM node per mark — excellent for accessibility, CSS styling, and per-element interaction, but it typically degrades past ~1,000-5,000 nodes. Canvas 2D rasterizes without a DOM and sustains ~10,000-100,000 points at 60fps; WebGL uses the GPU and scales to hundreds of thousands/millions (imMens rendered billions aggregated via WebGL). The choice is by budget of visible marks after aggregation and by the need for a11y/interaction — and correct downsampling often eliminates the need to move up a layer.

**Rules:**
- Use SVG by default up to ~1,000-2,000 visible marks, because it gives an accessible DOM (ARIA roles, per-element focus, native tooltips) and simple debugging; past that, DOM manipulation becomes the bottleneck — Bostock et al., D3, 2011; yWorks, SVG/Canvas/WebGL, 2022
- Move to Canvas between ~2,000 and ~50,000 interactive points, because Canvas holds 60fps in the tens of thousands where SVG already causes re-render jank — Scott Logic, Rendering One Million Datapoints, 2020
- Above ~100k simultaneous points (dense scatterplot, point maps), use WebGL (regl, deck.gl, ECharts GL), because only the GPU sustains millions of vertices within a 16ms frame budget — Scott Logic 2020; Liu, Jiang & Heer 2013
- Before moving up a layer, ask whether the chart really needs that many marks: bin/density/M4 reduces 1M rows to thousands of marks and hands the problem back to SVG — Liu, Jiang & Heer 2013; Jugel et al. 2014
- With Canvas/WebGL, provide a parallel accessibility layer (hidden data table, text description, keyboard shortcuts), because a bitmap is invisible to a screen reader — WAI-ARIA; Highcharts a11y module as a market reference
- For hit-testing in Canvas with many points, use color picking in a hidden buffer or a spatial index (quadtree), because iterating over all points per mousemove blows the 16ms/frame budget — Bostock, d3-quadtree; standard WebGL picking practice
- Measure frames during brush/zoom (DevTools Performance), not just the load: the criterion is sustaining interaction at 60fps (or a declared 30fps), not painting once — imMens set 50fps as the brushing benchmark — Liu, Jiang & Heer 2013

**Anti-patterns:** An 80k-circle SVG scatterplot "because D3 is SVG" — 80k DOM nodes freeze any browser; jumping to WebGL for 5k points, paying shader complexity for nothing; Canvas with no alternative table and no description (invisible to AT); redrawing the whole Canvas on every mousemove just to draw a tooltip (use a separate overlay); testing with 100 dev points and discovering the jank with production's 200k.

## Library-choice criteria: grammar vs config, SSR, bundle, license, a11y

Libraries split into declarative grammars (Vega-Lite, Observable Plot: they specify the data→visual mapping and gain consistency and portability), low-level toolkits (D3: full control, high cost), and config-charts (ECharts, Highcharts, Chart.js: ready-made parameterized charts). The right choice weighs five verifiable axes: required expressiveness, server-side rendering (critical for server-rendered stacks and email/PDF), bundle weight, commercial license, and out-of-the-box accessibility. Perceived latency starts at the download: a 1MB lib on a mobile dashboard has already burned the 1s budget before the first byte of data.

**Rules:**
- Choose a grammar (Vega-Lite, Observable Plot) when you have many varied charts over the same data, because the declarative spec standardizes scales/axes/legends and eliminates consistency bugs across screens — Satyanarayan, Moritz, Wongsuphasawat & Heer, Vega-Lite, TVCG 2017
- Reserve pure D3 for bespoke visualizations (custom layouts, orchestrated animation), because it's a manipulation toolkit, not a chart library: everything the config-libs give ready-made becomes your code to maintain — Bostock et al. 2011
- For a server-rendered stack (SSR, no SPA), require a lib with real SSR: Vega-Lite and Observable Plot emit SVG in Node, ECharts has had SSR since 5.3 (2022), because a server-rendered chart arrives ready in the HTML, with no empty-container flash and no dependence on JS — official Vega-Lite/Plot/ECharts docs
- Budget the bundle (orders of magnitude, approx./verify per version — they change each release): uPlot ~48KB min (~15-20KB gz), Chart.js ~70KB gz, Observable Plot ~90KB gz, full ECharts >300KB gz (tree-shaking mandatory), Vega-Lite+Vega ~250KB gz — because on 3G/4G every 100KB costs hundreds of ms of the 1s budget — each project's docs/bundlephobia; Nielsen 1993
- Check the license before the prototype: Highcharts is proprietary (paid for commercial use); ECharts is Apache-2.0, D3/Plot/Chart.js/uPlot are MIT/ISC — because switching libs after 30 screens is a rewrite — the projects' official licenses
- If a11y is a contractual requirement, weigh Highcharts' accessibility module (keyboard navigation, sonification, automatic descriptions) against the license cost, because no open-source lib ships the equivalent ready-made — Highcharts Accessibility module; W3C WAI
- For massive real-time time series, consider uPlot (README: ~167k points in ~25ms cold start, ~100k pts/ms after — approx./verify per version), because general-purpose libs pay abstraction overhead per point — uPlot benchmarks (Leon Sorokin), 2019+
- Standardize ONE main lib per app and document the exceptions, because each extra lib adds bundle, learning curve, and visual inconsistency across screens — Few 2006 (dashboard as a single visual system); design-system practice

**Anti-patterns:** Importing all of ECharts (~1MB min) for 3 sparklines; discovering the Highcharts license in commercial production; three libs in the same dashboard, each with its own font, tooltip, and palette; picking a lib by a pretty demo without testing at real volume on the target device; a client-side SPA just for per-request static charts (SSR would solve it without JS); a lib with no ARIA patched over with a generic aria-label on the wrapper.

## Cache, staleness, and query cost: pre-aggregate vs compute live, and what to show while waiting

Every number on a dashboard has an age, and hiding that age is a form of lying: the reader assumes "now" by default (Few 2006). The pre-aggregate vs live decision is economic — pre-compute when the query exceeds the interactive budget and the data tolerates a known lag; compute live when freshness is the product. The stale-while-revalidate pattern (RFC 5861, 2010) resolves the middle ground: serve the cache immediately, revalidate in the background, and update without wiping the screen — the user sees useful data in 0ms instead of a spinner.

**Rules:**
- Stamp the freshness on every panel whose data isn't live ("updated 2h ago", "data through 12/07"), because without a stamp the reader assumes real time and decides on stale data — Few, Information Dashboard Design, 2006
- Pre-aggregate when the query's p95 exceeds ~1s and the slicing dimensions are known (aggregate tables/materialized views by day×state×segment, say), because no frontend optimization saves an 8s query on the interaction path — Kimball & Ross 2013; Nielsen 1993
- Apply stale-while-revalidate in the UI: show the last cached result instantly, with an "updating…" badge, and replace it in-place when the fresh query returns, because data from 5min ago on screen is worth more than a spinner over a blank screen — RFC 5861 (Nottingham, 2010); SWR pattern
- When a refresh changes numbers on screen, signal the change (a subtle flash, a highlighted delta) instead of swapping silently, because the user may be in the middle of a comparative reading — Stolper et al. 2014
- Differentiate cheap from expensive queries in the UI: if a drill costs >5s (a heavy recompute), warn before the click ("~30s to generate") and allow canceling, because invisible cost breeds regretted clicks and mid-way abandonment — Nielsen 1993 (10s + cancellation); Myers 1985
- Debounce filter inputs by ~200-300ms and cancel the previous request on each new emission, because without cancellation out-of-order responses overwrite the current state with stale results — practice derived from Falcon/crossfilter, Moritz et al. 2019
- Align the cache TTL to the data's real cycle (daily pipeline → cache of hours; continuous scraping → minutes) and expose the cycle in the UI ("refreshes daily at 6am"), because a calibrated expectation eliminates both compulsive refreshing and distrust — Few 2006
- For live estimates in editors (price/count of a segment while the user configures it), compute over pre-aggregated values even if approximate and mark it as an estimate, because the editing loop demands <500ms and the exact value only matters at confirmation — Liu & Heer 2014; Fekete & Primet 2016 (approximation with refinement)

**Anti-patterns:** A KPI with no stamp serving yesterday's number as if it were now; an 8s spinner on every filter change "because the data must be fresh" on a dataset that changes once a day; an infinite cache with no invalidation showing last week; a refetch on every keystroke with no debounce or cancellation; wiping the entire table during revalidation; a 2-minute export/drill with no cost warning, progress, or cancellation.

## Sources

- Robert B. Miller, Response Time in Man-Computer Conversational Transactions, AFIPS, 1968
- Stuart Card, George Robertson, Jock Mackinlay, The Information Visualizer, CHI, 1991
- Jakob Nielsen, Usability Engineering (ch. Response Times: The 3 Important Limits), 1993
- Zhicheng Liu, Jeffrey Heer, The Effects of Interactive Latency on Exploratory Visual Analysis, IEEE InfoVis/TVCG, 2014
- Walter Doherty, Ahrvind Thadani, The Economic Value of Rapid Response Time, IBM, 1982
- Ben Shneiderman, Response Time and Display Rate in Human Performance with Computers, ACM Computing Surveys, 1984
- Charles Stolper, Adam Perer, David Gotz, Progressive Visual Analytics: User-Driven Visual Exploration of In-Progress Analytics, IEEE TVCG (VAST), 2014
- Jean-Daniel Fekete, Romain Primet, Progressive Analytics: A Computation Paradigm for Exploratory Data Analysis, arXiv:1607.05162, 2016
- Emanuel Zgraggen, Alex Galakatos, Andrew Crotty, Jean-Daniel Fekete, Tim Kraska, How Progressive Visualizations Affect Exploratory Analysis, IEEE TVCG, 2017
- Sveinn Steinarsson, Downsampling Time Series for Visual Representation (LTTB), MSc thesis, University of Iceland, 2013
- Uwe Jugel, Zbigniew Jerzak, Gregor Hackenbroich, Volker Markl, M4: A Visualization-Oriented Time Series Data Aggregation, PVLDB 7(10), 2014
- Jeroen Van Der Donckt et al., MinMaxLTTB: Leveraging MinMax-Preselection to Scale LTTB, IEEE VIS short, 2023
- Edward Tufte, The Visual Display of Quantitative Information, 1983
- Zhicheng Liu, Biye Jiang, Jeffrey Heer, imMens: Real-time Visual Querying of Big Data, EuroVis/CGF, 2013
- Lauro Lins, James Klosowski, Carlos Scheidegger, Nanocubes for Real-Time Exploration of Spatiotemporal Datasets, IEEE TVCG, 2013
- Dominik Moritz, Bill Howe, Jeffrey Heer, Falcon: Balancing Interactive Latency and Resolution Sensitivity for Scalable Linked Visualizations, CHI, 2019
- Ralph Kimball, Margy Ross, The Data Warehouse Toolkit, 3rd ed., 2013
- Brad Myers, The Importance of Percent-Done Progress Indicators for Computer-Human Interfaces, CHI, 1985
- Luke Wroblewski, Mobile Design Details: Avoid the Spinner (skeleton screens), 2013
- Viget (Holst/Lucas), A Bone to Pick with Skeleton Screens, 2017
- Bill Chung, Everything you need to know about skeleton screens, UX Collective, 2018; The effect of skeleton screens, ECCE, 2018
- Google, Core Web Vitals — Cumulative Layout Shift, 2020
- Nielsen Norman Group (Kara Pernice et al.), Designing Empty States in Complex Applications: 3 Guidelines, 2021
- IBM Carbon Design System, Empty States pattern
- Claus Wilke, Fundamentals of Data Visualization, 2019
- Stephen Few, Information Dashboard Design, 2006
- Alberto Cairo, The Truthful Art, 2016
- IBCS, International Business Communication Standards, v1.1, 2017
- Mike Bostock, Vadim Ogievetsky, Jeffrey Heer, D3: Data-Driven Documents, IEEE TVCG, 2011
- Scott Logic (Chris Price), Rendering One Million Datapoints with D3 and WebGL, 2020
- yWorks, SVG, Canvas, WebGL? Visualization options for the web, 2022
- W3C, WAI-ARIA Graphics Module / Authoring Practices
- Arvind Satyanarayan, Dominik Moritz, Kanit Wongsuphasawat, Jeffrey Heer, Vega-Lite: A Grammar of Interactive Graphics, IEEE TVCG, 2017
- Observable Plot docs
- Deqing Li et al., ECharts: A Declarative Framework for Rapid Construction of Web-based Visualization, Visual Informatics, 2018
- Highcharts, Accessibility module documentation
- Leon Sorokin, uPlot benchmarks, 2019
- Mark Nottingham, RFC 5861: HTTP Cache-Control Extensions for Stale Content, 2010
