# Monitoring, real time, and alerting

> Reference for the dataviz-design skill. Load when: designing/reviewing an operational or wall (NOC/TV) dashboard, an auto-refresh panel, an alerts/SLO screen, a service table with sparklines, or real-time time series with an incomplete current period.

## Monitoring methods: USE, RED, and Golden Signals

Methods that define WHAT goes on the dashboard before you decide HOW to draw it. USE (Gregg, 2012) audits infrastructure resources: Utilization, Saturation, Errors per resource — "solves ~80% of server problems with 5% of the effort". RED (Wilkie, 2015, derived from Google's Golden Signals) measures request-driven services from the caller's perspective: Rate, Errors, Duration. Golden Signals (SRE book, 2016): Latency, Traffic, Errors, Saturation — "if you can only measure four metrics of your user-facing system, focus on these four".

**Rules:**
- For each request-driven service, dedicate a dashboard row to Rate, Errors, Duration in that order, because repeating the pattern across services lets you scan N services as a table and spot the anomalous one by vertical comparison — Wilkie, RED Method, 2015 (Grafana Labs).
- For infrastructure resources (CPU, memory, disk, network, connection pool), plot utilization AND saturation (queue/wait) per resource, because saturation foreshadows degradation that average utilization hides — a resource at 70% with a growing queue is already sick — Gregg, The USE Method, 2012.
- Separate the latency of successful requests from the latency of failed ones, because a fast failure (an immediate 500) drags the average down and masks the real slowness of the requests that work — Beyer et al., Google SRE book, ch. 6, 2016.
- Show latency as percentiles (p50/p95/p99), never just the mean, because the distribution is skewed and the mean hides the tail the user feels — Beyer et al., SRE book, 2016.
- Errors always as a rate (% of traffic) alongside the absolute volume, because 100 errors mean opposite things at 1k vs 1M requests — Prometheus docs, Alerting best practices.
- If only 4 panels fit above the fold, use the 4 golden signals (latency, traffic, errors, saturation) — Beyer et al., SRE book, ch. 6, 2016.
- Combine the two methods in layers: RED up top answers "is the user feeling it?", USE underneath answers "why?"; Wilkie explicitly recommends pairing RED with USE for full coverage — Wilkie 2015; Gregg 2012.
- Standardize units and scales across services on the same dashboard (ms always ms, rate always req/s), because the method only enables comparison if the encoding is uniform — IBCS Standards (UNIFY principle), Hichert & Faisst, 2017.

**Anti-patterns:** Dashboard = a dump of every metric the exporter offers, with no question to answer; only average CPU utilization, with no saturation or errors — the chart "looks ok" while the queue blows up; a single "average latency" line for the whole service; a "health: green" gauge with no operational definition of what turns it red; mixing an error count in one panel and a rate in another, inviting an invalid comparison.

## Glanceability and wall dashboards (reading in seconds, from meters away)

An operational dashboard is read in glances of a few seconds, often on a TV 2-4 m away. Status information has to travel through preattentive attributes (position, size, color), not through small text or a legend. Blascheck et al. (2018) measured it: a simple comparison on a bar chart in <300 ms and on a donut in <220 ms, but on a radial bar in ~1780 ms — the choice of encoding shifts reading time by an order of magnitude. Few defines a dashboard as information consolidated on a single screen, monitorable "at a glance".

**Rules:**
- Put the most critical status in the top-left corner, because the eye scans in a Z from there; organize the rest as an inverted pyramid (synthesis on top, detail below) — Grafana dashboard best practices; Few, Information Dashboard Design, 2006.
- A wall dashboard fits on a single screen with no scroll, because information outside the viewport simply isn't monitored — Few, Information Dashboard Design, 2006/2013.
- Prefer bars to radial encodings for quick comparison: bar <300 ms, donut <220 ms (measured with 1-2 slices / a single progress KPI — a donut is not the way to compare many slices; see references/perception.md and references/chart-choice.md), radial bar ~1780 ms (~6-8× slower) — Blascheck et al., "Glanceable Visualization", IEEE TVCG, 2018.
- Encode critical state redundantly with color+position/icon/shape, never color alone, because ~8% of men have a color vision deficiency and distance desaturates hues — Few 2013; Ware, Information Visualization, 2012.
- Reserve red exclusively for state that demands action now; decorative red (logos, headers, ordinary series) trains the eye to ignore it — Few, Information Dashboard Design, 2006.
- Size text for the distance: character height ≥ distance/200 (at 3 m → ≥15 mm, ~55-60 px on a 50" 1080p TV), or the wall dashboard becomes decoration — display ergonomics (ISO 9241; NOC practice).
- At most ~5 series per chart and one question per panel; beyond that, a glance can't tell the lines apart — Grafana dashboard best practices.
- Big key numbers with a short label above and context (delta, sparkline) beside them, because a number with no reference doesn't answer "is this good or bad?" — Few 2013.

**Anti-patterns:** A dashboard that scrolls on a wall TV — the bottom half is never seen; 12 rainbow series in a line chart "for completeness"; a legend separated from the chart at 3 m (illegible; label at the end of the line); green/red as the only state encoding; radial gauges and multi-slice pie charts where a bar would do it in 1/6 the time.

## Actionable alerting vs. noise (alert fatigue)

An alert that requires no human action trains the operator to ignore every alert. Ewaschuk (2013, the basis of SRE book ch. 6): pages should be urgent, actionable, and about symptoms the user feels, not internal causes. The scale of the problem has been measured: PagerDuty (State of Digital Operations, 2025) — ~50 alerts/week per on-call engineer, only 2-5% requiring intervention; incident.io (2025) — 85% of teams report mostly false positives and 67% of engineers admit dismissing alerts without investigating.

**Rules:**
- Alert on symptoms (high p99 latency, user-facing error rate), not on causes (high CPU, disk 80%), because one symptom covers many causes and a cause with no symptom needs no action — Ewaschuk, "My Philosophy on Alerting", 2013; SRE book ch. 6, 2016.
- Actionability test: if the natural reaction to the alert is "ok, I'll look later", demote it from page to ticket or panel; every page must demand immediate human intelligence — Ewaschuk 2013; Prometheus docs.
- Cause information goes to the console/dashboard, not the pager: the page says "users are suffering", the dashboard says where to look — Ewaschuk 2013.
- Alert on a sustained condition or on error-budget burn rate (multiwindow multi-burn-rate), not on a single datapoint above the threshold, because an instantaneous spike with no duration is no harm to the user — Beyer et al., The Site Reliability Workbook, ch. 5 "Alerting on SLOs", 2018.
- Every alert rule references a runbook/playbook; an alert with no procedure breeds improvisation and erratic response time — SRE book 2016; Grafana Alerting docs (runbook_url annotation).
- Measure and display your own team's actionable-alert rate (a meta-monitoring dashboard), because the degradation is gradual: in a clinical CDS study, the odds of accepting an alert dropped ~30% with each additional reminder received — alert fatigue literature (JAMIA); Atlassian, "Understanding alert fatigue".
- On the alerts screen, group by incident/common cause, not one row per fired rule, because 40 rows from the same incident bury the second incident — Grafana Alerting best practices; incident.io 2025.
- If an alert is safe to ignore, delete it (don't just turn its volume down): an alert email channel nobody reads is live debt — Ewaschuk 2013.

**Anti-patterns:** A page for every infra resource threshold (disk 80%, CPU 90%) with no associated symptom; an alert list with 200 "informational" items permanently red — chronic red becomes wallpaper; a duplicated alert firing across 3 severities at once; a page with no link to a runbook or to the metric's chart; a permanent mute standing in for deleting the bad rule.

## Thresholds visible on the chart (markLine, bands, bullet)

The threshold that triggers a decision or an alert must be drawn on the chart itself; a measure with no reference conveys no state. Few created the bullet graph (2005; formal spec 2013) for exactly this: a primary measure + a target marker + qualitative background bands, replacing circular gauges. If the threshold lives only in the alert configuration, the dashboard reader can't judge "how close to trouble are we".

**Rules:**
- Draw the alert's threshold line on the chart (a horizontal markLine with a label), because the operator needs to judge distance-to-trouble and rate of approach, not just the current value — Few, Information Dashboard Design, 2013; Grafana thresholds practice.
- Label the line with value and meaning ("SLO 99.9%", "limit 500 ms"), because an unlabeled line forces a trip to the config — Few 2013 (comparative measures must be identifiable).
- Qualitative background bands (good/acceptable/bad) in intensities of ONE neutral color (grays), at most 5 and ideally 3 levels, because more than 5 states exceeds immediate perception and saturated background colors compete with the data — Few, Bullet Graph Design Specification, Perceptual Edge, 2013.
- Style the threshold as a discreet reference element (dashed, thin, desaturated), no heavier than the data series, because ink should be proportional to the importance of the data — Tufte, The Visual Display of Quantitative Information, 1983 (data-ink).
- Always include the threshold in the Y-axis domain; an axis that cuts off below the threshold hides the reference and lies about the available headroom — Few 2013.
- When the current value breaches the threshold, signal it outside the chart too (card color, title, icon), because at a glance the reader doesn't compare line vs. series; the preattentive layer does the work — Ware 2012.
- For a KPI with a target, prefer a bullet graph to a circular gauge: it encodes measure + target + bands in ~1/4 the space with a linear read — Few, Bullet Graph Design Specification, 2013.
- If the panel monitors an SLO, show the remaining error budget (the area/percentage between series and threshold accumulated over the window), because an instantaneous breach and a burned budget are different questions — SRE Workbook, 2018.

**Anti-patterns:** A threshold set in the alert but invisible on screen — the operator discovers the limit when the pager fires; a whole panel background in saturated green/yellow/red (a giant traffic light) smothering the series; a circular gauge with a 7-band rainbow arc; a target line thicker and darker than the data line; a truncated Y-axis that leaves the threshold off-frame.

## Sliding vs. fixed window (real time)

The choice of time window changes the story told. A fixed calendar window ("today", "this month") truncates the current period and creates artificial drops; a sliding window ("last 24h", "last 7 days") preserves point-to-point comparability and is the default for an operational panel. Moving averages, smoothing, seasonal alignment, and comparison against a prior period are generic time-form — rule and rationale in references/time-series.md. Here we keep only the operational cut: which window, declared where, the cost of smoothing on detection, and percentiles that don't re-aggregate.

**Rules:**
- Prefer a sliding window ("last 24h") to a calendar window ("today") on operational panels, because at 00:30 the "today" window holds 30 min of data and every aggregate looks like it's cratering — SRE/Grafana practice (relative time range).
- Declare the window size and the aggregation in the panel title ("Errors — 5 min rate, last 6h"), because the same metric with different windows tells different stories; a title should carry measure + period — IBCS Standards (SAY), 2017.
- In real time, if you smooth, use a trailing moving average (past only), never centered, because the centered one needs future that hasn't arrived; and state that it delays turn detection by ~half the window — the detection-vs-noise trade-off is operational; the mechanics of smoothing live in references/time-series.md — Statistics By Jim, "Moving Averages".
- Never re-aggregate percentiles: the average of per-host p95 is not the fleet's p95; compute the percentile over the whole distribution or show it per host — Gil Tene, "How NOT to Measure Latency", 2013.
- Use the same window and resolution on neighboring panels meant to be compared; different windows side by side with no warning induce false correlation — IBCS (UNIFY), 2017.
- A moving average (7 days / a multiple of 7), the raw data overlaid on the smoothed one, and day-of-week alignment when comparing periods are time-form — rule and rationale in references/time-series.md; on this panel choose only the window and the smoothing level.

**Anti-patterns:** "Current month" (partial) compared with "last month" (complete) in the same pair of bars; an "average" p95 aggregated across instances; neighboring panels at 5 min and 1h windows with no label, read as if comparable; a "today" window on a wall dashboard that zeroes out at midnight and spooks the on-call; smoothing hard enough to erase the short-lived incident that prompted the look at the screen.

## Auto-refresh and staleness (showing "updated X ago")

A real-time panel lives on the confidence that the data is current. Frozen data with no indication is worse than absent data: the operator decides on stale information believing it's fresh. Staleness must be visible and graded; refresh is a capacity decision (query cost), not a cosmetic toggle. Silent changes between glances suffer from change blindness — the eye doesn't register what changed without a signal.

**Rules:**
- Show "updated X min ago" in relative format near the title or the main KPI, because an absolute ISO timestamp demands mental arithmetic nobody does under pressure — freshness practice (Elementary Data; Databricks community); user-centered microcopy.
- Grade the freshness indicator by color against the data SLA (e.g., neutral <5 min, amber <15 min, red beyond), because a neutral timestamp doesn't draw attention to stale data — Elementary Data, "Data Freshness best practices"; MongoDB Atlas Charts (staleness tolerance).
- Distinguish "no new data" from "collection broken": a series that stopped reporting shows a gap or an error state, never repeats the last value (carry-forward draws a flat line that lies) — Datawrapper Academy, "missing data"; Prometheus practice (staleness marker).
- Auto-refresh interval ≥ collection granularity: a 5s refresh over a 60s scrape only adds load and a false sense of real time; size the cost before turning it on — Grafana best practices ("auto refresh is a capacity-planning decision").
- Preserve interaction state across refresh (zoom, filter, selection, scroll), because a reset every 30s makes it impossible to investigate during an incident — the heuristic of keeping the user's context (Nielsen, "user control"); the practice of updating the fragment, not the whole page.
- If the refresh fetch fails, keep the last data visible WITH an error banner and its age, rather than a blank screen or a spinner that wipes the chart — labeled stale data > nothing.
- Highlight the delta on update (the number that blinked/an arrow/the previous value), because a silent change between glances goes unperceived (change blindness) — Rensink, O'Regan & Clark, Psychological Science, 1997.
- On a wall dashboard, the staleness indicator also has to be legible from a distance (not a 10px font in the footer), because it's what validates everything else on the screen — Few 2013 + the distance rule from the glanceability subtopic.

**Anti-patterns:** A NOC TV showing yesterday's data with no warning at all — caught only when someone checks the database; "Last updated: 2026-07-13T02:11:04Z" in gray 10px in the footer; a full-screen spinner on every 10s auto-refresh; a flat line of the last repeated value on a series whose collection died; a 5s auto-refresh on a heavy query that degrades the very database being monitored.

## Partial states: current-period data incomplete

The day/week/month in progress is structurally incomplete: compared without marking against closed periods, the last bar "plunges" and the reader infers a decline. The fix is to visually distinguish the partial one (hatching/decal, dashed, opacity) and/or annotate it, or to exclude/project it. IBCS has canonical notation: actual solid, forecast/projection hatched — the same vocabulary serves for "in progress".

**Rules:**
- Mark the current period with hatching/decal or reduced opacity + a "month in progress" note, because an unmarked partial bar reads as a real decline — IBCS notation (actual=solid, forecast=hatched), 2017; ECharts implements it via `decal` (also an accessibility feature).
- On a timeline, switch the stroke to dashed from the point where the data stops being consolidated (e.g., a 48h ingestion lag), because line style communicates the degree of confidence — IBCS/FT convention for projection; Wilke 2019.
- A more honest alternative to the partial: exclude the incomplete period from the main comparison, or add a close-of-period projection (run-rate) as a hatched segment stacked on top of the actual — IBCS 2017.
- Missing data ≠ zero: render a gap in the line, never interpolate or let it drop to zero, because a phantom zero creates a false valley — Datawrapper Academy, "How to deal with missing data in line charts".
- If events arrive late (late-arriving), pin a permanent note on the panel ("last 2 days subject to revision"), because the recurring reader needs to know the recent past still changes — data journalism practice (Datawrapper/OWID during COVID).
- Annotate the reason for known gaps ("collection paused Jul 12-14"), because a gap with no explanation breeds suspicion of a bug and erodes the credibility of the whole panel — Datawrapper Academy.
- In tables and KPIs, pair the partial value with an equivalent comparator ("vs. same point last month" — month-to-date vs month-to-date), never MTD vs a closed month — IBCS (comparability), 2017.

**Anti-patterns:** The current-month bar "dropping 60%" with no hatching or note; silently interpolating across a collection gap; a phantom zero where the data is null; excluding the partial period without notice, leaving the axis to end "a month ago" with no explanation; a "month's revenue" KPI compared with the prior closed month on the 3rd.

## Operational sparklines

Tufte (Beautiful Evidence, 2006): sparklines are "small, intense, word-sized graphics" with typographic resolution — 5 to 100× the resolution of conventional charts — created explicitly for "the flood of numbers produced by modern measurement, monitoring, and surveillance technologies". In operations they live in tables of services/hosts/queues: they give shape and recent trend beside the current number, multiplying screen density at no attention cost.

**Rules:**
- Pair sparkline + current value in digits: the number gives exact magnitude, the sparkline gives shape/trend; neither alone answers "how much and which way" — Tufte, Beautiful Evidence, 2006; Few 2013.
- No axes, no grid, no internal labels; if you need a normality reference, use a light-gray band of the acceptable range behind the line — Tufte 2006; Few 2013 (gray band for the normal range on dashboards).
- Mark the last point with a highlighted dot (and optionally min/max in a distinct color), because in monitoring the "now" is the point of interest — Tufte 2006 (the red end-point convention in the canonical examples).
- In a column of sparklines (a table of N services), use the SAME Y scale when magnitude is being compared; if the scale is per-row (only shape matters), declare it, because a silently inconsistent scale induces false comparison — Few, Information Dashboard Design, 2013.
- Size the aspect ratio so it neither flattens (stretched) nor jags (compressed) the sparkline's recent trend; the general banking (~45°) rule and its rationale live in references/time-series.md — Tufte 2006 ("lumpy, not spiky").
- A short, fixed window, identical across every row of the table (e.g., last 60 min or 24h), labeled once in the column header, because different windows per row wreck comparative reading — Few 2013.
- A sparkline serves shape, not value reading: don't depend on a tooltip for the current value; print it alongside — Tufte 2006.
- One neutral color for every sparkline in the table; color enters only to encode state (e.g., a series in violation turns red), not row identity — Few 2013.

**Anti-patterns:** Sparklines with an independent Y scale per row, no warning, in a column the reader compares vertically; a giant sparkline (300px) doubling as a full chart with no axes — neither sparkline nor chart; heavy smoothing that erases the 15 min incident that prompted the look at the table; a tooltip as the only access to the current value; a rainbow: every row of the table in its own meaningless color.

## Drill from the alert to context (no dead ends)

The alert is the tip of the iceberg; the decision needs context: when it started, what else changed, which items are affected. Ewaschuk: alert on symptoms and "have good consoles" to locate causes — the page carries the links. On the dashboard the no-dead-ends principle holds: every abnormal state is clickable and leads to a view that answers "why" with the filters preserved.

**Rules:**
- Every alert notification links (a) the metric panel with the time range already centered on the trigger and (b) the runbook, because each manual click to rebuild context costs minutes of MTTR — Grafana Alerting (annotations `runbook_url`, `__dashboardUid__`/`__panelId__`); SRE book 2016 (playbook per alert).
- The landing time range includes a baseline before the trigger (e.g., 1h before until now), because without the "before" the operator can't judge how anomalous the "after" is — Grafana/SRE practice.
- Draw the trigger annotation on the destination chart (a vertical line labeled with the alert), because correlating the pager time to the curve "by eye" is imprecise — Grafana annotations.
- Overlay change events (deploys, migrations, feature flags) as vertical annotations on the same timeline, because the responder's first question is "what changed?" — consolidated SRE practice; Grafana annotations.
- Structure consoles in a top → service → instance hierarchy with at most ~3 clicks from alert to candidate cause, because a console too shallow doesn't answer and too deep loses the operator — Ewaschuk 2013 ("good consoles").
- Every abnormal counter/state on the dashboard is clickable through to the filtered list of affected items (hosts, queues, customers, jobs), not an inert red number — the "no dead ends" principle (Few 2013: a dashboard that supports action; drill-down pattern).
- Preserve the alert's labels/filters into the drill via URL parameters (same service, region, customer), because losing the filter along the way restarts the investigation — Grafana data links with variables.
- Close the loop: from the context screen it must be possible to go back/navigate to the incident (ack, silence, escalate), or the operator ends up juggling 5 desynced tabs — Grafana Alerting best practices.

**Anti-patterns:** An alert email with no link at all; a link to a generic dashboard with a default time range ("last 6h") that no longer contains the incident by the time it's opened; a non-clickable red error counter; a destination chart with no annotation of the trigger moment or the deploys; a drill that discards the alert's filters and shows the whole fleet.

## Sources

- Brendan Gregg, "The USE Method" (brendangregg.com), 2012; "Thinking Methodically about Performance", ACM Queue, 2013
- Tom Wilkie, "The RED Method: How to Instrument Your Services", Weaveworks/GrafanaCon, 2015
- Beyer, Jones, Petoff, Murphy (eds.), "Site Reliability Engineering", O'Reilly, 2016, ch. 6 "Monitoring Distributed Systems"
- Beyer, Murphy, Rensin, Kawahara, Thorne (eds.), "The Site Reliability Workbook", O'Reilly, 2018, ch. 5 "Alerting on SLOs"
- Rob Ewaschuk, "My Philosophy on Alerting", 2013 (basis of SRE book ch. 6)
- Prometheus docs, "Alerting best practices" and staleness handling
- PagerDuty, State of Digital Operations, 2025; incident.io, alert fatigue survey, 2025; Atlassian, "Understanding and fighting alert fatigue"
- Stephen Few, "Information Dashboard Design", 2006 (2nd ed. 2013)
- Stephen Few, "Bullet Graph Design Specification", Perceptual Edge, 2013 (invented 2005)
- Blascheck, Besançon, Bezerianos, Lee, Isenberg, "Glanceable Visualization: Studies of Data Comparison Performance on Smartwatches", IEEE TVCG, 2018
- Grafana Labs, dashboard best practices and Alerting docs (thresholds, labels/annotations, data links)
- Colin Ware, "Information Visualization: Perception for Design", 3rd ed., 2012
- Edward Tufte, "The Visual Display of Quantitative Information", 1983; "Beautiful Evidence", Graphics Press, 2006
- Hichert & Faisst, IBCS Standards 1.2, 2017
- Datawrapper Academy, "How to deal with missing data in line charts"; Datawrapper/OWID, time-series practice during COVID, 2020
- Claus O. Wilke, "Fundamentals of Data Visualization", 2019
- Gil Tene, "How NOT to Measure Latency", 2013 (talk)
- Jim Frost, Statistics By Jim, "Using Moving Averages to Smooth Time Series Data"
- Rensink, O'Regan & Clark, "To See or Not to See: The Need for Attention to Perceive Changes in Scenes", Psychological Science, 1997
- Elementary Data, "Data Freshness: Best Practices & Key Metrics"; MongoDB Atlas Charts (staleness tolerance)
- Apache ECharts docs (aria.decal / decal pattern)
