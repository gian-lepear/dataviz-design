# Time-series shape

> Reference for the dataviz-design skill. Load when: work about change over time — indexing/rebasing, seasonality, YoY/MoM, moving average/smoothing, banking/aspect ratio, gap (missing data) in the line, forecast/projection, calendar heatmap, horizon chart, connected scatter.

This file is the OWNER of the SHAPE of a series over time: which mark to use, how to shape/compare/annotate the time axis. Boundaries: the CHOICE of KPI comparison (YoY vs MoM, base effect, days-in-month) lives in `kpi-metrics.md`; `null` ≠ zero and window/uncertainty honesty live in `integrity-uncertainty.md`; the IBCS scenario notation (AC/PY/BU/FC) lives in `dashboard-typology.md`; the operational window and the smoothing-vs-latency trade-off in real time live in `monitoring-realtime.md`; the Cleveland–McGill perceptual hierarchy lives in `perception.md`. Here: how time becomes a drawing.

## Choosing the shape over time: line vs column vs area

Before you pick the mark, name what the series is: a continuous trajectory, a few closed periods, or a magnitude that sums. A line reads as continuous movement; a column reads as a set of discrete, comparable periods; an area reads as accumulated quantity under the curve. Density sets the limit: above ~40 points a column chart turns into an impenetrable picket fence and only the line survives.

**Rules:**
- Use a line for a continuous series with many points (>~40) because the eye follows the trajectory and a run of columns becomes an illegible picket fence — Few, Show Me the Numbers, 2004
- Use vertical columns for a few discrete periods (≤~8, e.g., revenue by quarter of the year) because each bar is a closed, comparable period, and a line across 4 points implies a continuous interpolation that doesn't exist — FT Visual Vocabulary (Alan Smith / FT Visual Journalism Team), 2016; SKILL.md §11
- Reserve a filled area for a magnitude that sums/accumulates (total volume, inventory, energy consumed) and never for a rate or an index, because the fill asserts "quantity under the curve" — Wilke, Fundamentals of Data Visualization, 2019
- Stack areas only when the TOTAL is the message and the bottom layers are stable; otherwise use overlaid lines, because in a stacked area only the base layer has a straight reference baseline and the upper ones float (position turns into length) — Cleveland & McGill 1984 (see perception.md); Wilke 2019
- Keep time on the horizontal axis running left to right because it's a universal convention and verticalizing/reversing time forces a re-read — IBCS (horizontal = time), see dashboard-typology.md
- Don't connect discrete non-temporal categories with a line (a line = continuity); reserve the line for the time axis or a continuous ordinal — Few, Show Me the Numbers, 2004

**Anti-patterns:** a line joining 3–4 quarters (implies interpolated values between discrete periods); a stacked area of 6 volatile categories where nobody can read the middle layers; a filled area under an index or a rate (fill with no sum semantics); a bar chart for a 365-day daily series (impenetrable picket fence); time on the Y axis running top to bottom.

## Rebasing / index to 100

Series in different units or scales (prices of 3 assets, traffic to 4 pages, GDP of 5 countries) don't compare on the same axis in absolute values — and the dual Y axis, the common escape hatch, manufactures arbitrary crossings. The honest fix is to reindex them all to 100 at a common base date: the reading becomes relative growth from the origin, comparable across series, on a single axis.

**Rules:**
- To compare the EVOLUTION of series in different units/scales, reindex them all to 100 at a common base date and plot them on the same axis, because the reading becomes comparable relative growth and dispenses with the dual axis — Few, Dual-Scaled Axes in Graphs, 2008 (base-100 index as the alternative to the dual axis)
- Choose the base date on a stated criterion (window start, an event, a period average) and label it ("index 100 = Jan 2020") because the base drives the whole narrative and a base picked after the fact is cherry-picking — see integrity-uncertainty.md (honest window)
- Keep the 100 line visible (baseline/gridline) so the reader reads above/below the origin at once — Few, Dual-Scaled Axes, 2008
- Prefer a base-100 index over a dual Y axis whenever the question is "who grew more", because a dual axis manufactures correlation through the choice of scales — see integrity-uncertainty.md (owner of the dual axis)
- If the base series is noisy, anchor to the average value of a base period rather than a single point, because an atypical base point distorts every series at once — established practice for economic series
- For compound percentage change over long windows, consider a log axis on the index, because on a linear scale the same ratio looks bigger on the way up than on the way down (+100% vs −50%) — Wilke, Fundamentals of Data Visualization, 2019 (log axes for ratios)

**Anti-patterns:** comparing revenue ($ mn) and number of users on the same chart with a dual axis instead of indexing; an index with no base-date label (the reader doesn't know the origin); a base pinned to an atypical point inflating/sinking every series; reindexing but keeping absolute units on the axis (a contradiction); using an index when it's the absolute LEVEL that matters (the index erases the level).

## Seasonality and periodic comparison

A series with strong seasonality hides the trend inside a single stroke: the eye doesn't separate "it rose because it's December" from "it rose because it's growing". The shapes that reveal seasonality align the matching periods — an overlay of one cycle per year on the same Jan–Dec axis, a seasonal subseries (one small panel per season), or an explicit decomposition into trend + seasonal + remainder. Metrics with a weekly cycle require comparing whole weeks or the same day-of-week.

**Rules:**
- To reveal the SHAPE of the seasonality, overlay one line per cycle (one per year on a Jan–Dec axis), the current year highlighted and prior years grayed out, labeled at the ends, because this aligns the matching months and the season becomes a visible pattern — Datawrapper, line charts, 2021; Few 2004 (direct labeling)
- For a daily series with a weekly cycle, compare and aggregate by WHOLE WEEKS or by aligning same-day-of-week (Mon with Mon), because the day-of-week effect dominates the variation and comparing Mon×Sun manufactures a "drop" — Kohavi, Tang & Xu, Trustworthy Online Controlled Experiments, 2020
- Use a seasonal subseries plot (one small panel per month or per day-of-week, each showing the evolution of that season across cycles) when you want to see the trend WITHIN each season, separated from the season itself — Cleveland, Visualizing Data, 1993 (cycle/subseries plot)
- Decompose the series (trend + seasonal + remainder) and show the components stacked when you need to ASSERT a trend under strong seasonality, because the eye doesn't separate trend from season in a single stroke — Cleveland, Cleveland, McRae & Terpenning, STL, Journal of Official Statistics, 1990
- Show at least 2 complete cycles (≥24 months for annual seasonality) before asserting a trend, because 1 cycle doesn't separate trend from season — see integrity-uncertainty.md (honest window)
- Choose YoY vs MoM by the metric's seasonality and check the base effect and days-in-month, rather than applying a blind "vs prior period" — see kpi-metrics.md (owner of the comparison choice)

**Anti-patterns:** a "drop" alarm comparing a Sunday with the prior Friday; an 18-month series sold as a trend (fewer than 2 annual cycles); a season hidden in a single flat stroke when a subseries plot would show the turn; a YoY overlay without highlighting the current year or labeling the ends (spaghetti of lines); decomposing and hiding the "remainder" component, where the outliers live.

## Moving average / smoothing

A moving average trades high-frequency noise for a legible trend — but every window is an editorial choice: too wide erases the peak that was the finding, too narrow doesn't cancel the cycle. Two disciplines: match the window to the cycle you want to cancel, and never present the smoothed line as if it were the measured data (the smooth line passes through values no day ever had).

**Rules:**
- Set the window = 1 full cycle of the pattern you want to cancel (7 or a multiple of 7 for a weekly cycle; 28, not 30, for exactly 4 weeks), because a window that doesn't close the cycle leaves a periodic residue in the smooth line — signal-processing practice (window = period of the cycle to cancel)
- Show the raw data alongside the smoothed (light points/bars + the moving-average line), because smoothing alone hides peaks and raw alone hides the trend — Wilke, Fundamentals of Data Visualization, 2019; see monitoring-realtime.md (operation)
- In real time use a trailing moving average (past only) and state that it delays perception of the turn by ~half the window — see monitoring-realtime.md (owner of the smoothing-vs-latency trade-off)
- Don't smooth to the point the signal of interest disappears: if the peak/trough is the finding, a wide window erases it — match the window to the phenomenon, not to the aesthetic — Cleveland, Visualizing Data, 1993 (loess span)
- Label the smoothing ("7-day moving average") and never present it as the measured data, because the smooth line crosses values no real point ever had — Cairo, How Charts Lie, 2019 (see integrity-uncertainty.md)
- For a local non-linear trend, prefer loess/lowess over a simple moving average at the edges, because the moving average shortens and biases at the ends while loess fits a local weighted polynomial — Cleveland, Robust Locally Weighted Regression, JASA, 1979

**Anti-patterns:** a 30-day moving average that ripples with the weekly-cycle residue; a window so wide it erases the incidence peak that was the point; a smoothed line with no raw beside it, hiding the variance; a smooth line labeled "data"; a centered moving average on an operational panel (it uses the future, "leaking" information that doesn't exist yet).

## Banking to 45° / aspect ratio

Perception of a change in slope is maximal when the line segments sit near 45°: too flat or too steep, and the eye can't tell the rates of change apart. Cleveland formalized this as "banking to 45°" — choosing the aspect ratio so the average absolute slope of the segments lands around 45°. The hard consequence: the card's size on the dashboard can't dictate the shape of the trend on its own.

**Rules:**
- Tune the series' aspect ratio so the average absolute slope of the segments sits near 45° (banking to 45°), because discrimination between slopes is maximal in that band — Cleveland, McGill & McGill, The Shape Parameter of a Two-Variable Graph, JASA 83, 1988
- For a series with structure at multiple scales (a multi-year trend + monthly seasonality), show two views with different bankings (a flattened long view + a short window) rather than a single one that hides one of the scales — see perception.md (owner of perceptual depth; Heer & Agrawala, multi-scale banking, 2006)
- Don't flatten the series in a too-wide card (hides real variation) or squeeze it into a narrow card (illegible sawtooth), because the same data at 4:1 and 1:1 tells different stories — see integrity-uncertainty.md (honest aspect ratio)
- Apply the same ~45° aim to the sparkline (height ≈ 1–2 lines of text, flattened) — see chart-choice.md (owner of the sparkline spec)
- Fix an aspect ratio proportional to width for lines (not a fixed height), because a squashed line distorts the perception of slope — Datawrapper, responsive height, 2023 (see accessibility-mobile.md)

**Anti-patterns:** a series line stretched to fill a panoramic card (the trend vanishes); the same series in a narrow card turning into a sawtooth; letting the dashboard grid dictate the shape of the trend; comparing two series in cards of different aspect ratios (slopes not comparable).

## Gap = missing data

A hole in collection is information, not zero. In a time series, connecting the neighboring points across the gap asserts a measurement that never happened; plotting zero asserts the phenomenon stopped. Both lies are easy to avoid: break the line at the hole. This file applies to the time axis the rule owned by `integrity-uncertainty.md`.

**Rules:**
- Where data is missing, BREAK the line (a visible gap) instead of connecting the neighboring points, because a continuous line over the hole asserts a measurement that doesn't exist — see integrity-uncertainty.md (owner of null ≠ zero)
- Never plot zero where the data is absent: 0 is a value, null is not; a column at zero from a failed collection lies about the process — see integrity-uncertainty.md
- Annotate the cause of the gap when known (a collection outage, a holiday with no operation, a source change), because an unlabeled discontinuity reads as a real drop — Cairo, The Truthful Art, 2016
- Distinguish "no data" from "measured zero" in the legend (e.g., a hatched mark for missing vs hollow for zero) because the reader can't guess which of the two it is — Wilke, Fundamentals of Data Visualization, 2019
- If you impute for a calculation (a moving average over the hole), flag the imputed stretch with a distinct stroke and don't fuse it into the measured — see integrity-uncertainty.md (measured ≠ estimated)

**Anti-patterns:** interpolating failed-collection days with a straight line (hides the pipeline outage); a bar at zero on a day with no measurement; a moving average crossing the hole as if there were data; an unannotated gap read as a real collapse; the same color and stroke for measured and imputed.

## Incomplete current period

The day/week/month in progress is structurally incomplete: compared without a marker against already-closed periods, the last bar "plunges" and the reader concludes a decline. The treatment is to visually distinguish the partial (hatching, opacity, dashing) with an "in progress" label, or to exclude/project it explicitly. It's a recurring false alarm because it repeats at the start of every period.

**Rules:**
- Mark the incomplete current period (a hatched bar/segment, reduced opacity, or dashing) with an "in progress"/"partial" label, because without a marker the last bar plunges against closed periods and triggers a false alarm — see monitoring-realtime.md (owner of the incomplete period in operation); IBCS notation (see dashboard-typology.md)
- Alternatively, exclude the partial period from the series or project it (run-rate), clearly labeled, because on many panels the reader only needs the trend of the closed periods — established practice; see monitoring-realtime.md
- Prefer a sliding window ("last 30 days") over a calendar window ("this month") where the calendar cut always shows a partial period — see monitoring-realtime.md
- Don't put a delta or a traffic light on the partial period against a full period, because it compares apples to oranges — see kpi-metrics.md (owner of the delta/baseline)

**Anti-patterns:** the last bar of the month plunging because the month hasn't closed, with no marker; a projected run-rate drawn identical to actuals; a "−38% vs last month" delta on the 3rd of the month; comparing the week in progress (3 days) with whole weeks.

## Forecast / projection

A projection is not a measurement, and the drawing has to say so without a legend: measured solid, projected dashed/hatched, with a "today" divider. Beyond separating fact from assumption, an honest projection shows that uncertainty GROWS with the horizon — hence the fan chart, bands that widen going forward. This file composes: the FC notation is from `dashboard-typology.md`, the uncertainty is from `integrity-uncertainty.md`.

**Rules:**
- Draw the projection visually distinct from the measured — measured = solid line, projected = dashed/hatched after a "today" divider — because the same appearance makes the reader take the projection for fact — IBCS FC notation (see dashboard-typology.md); see integrity-uncertainty.md (measured ≠ estimated)
- Pair the projection with an uncertainty band that WIDENS with the horizon (fan chart, 50/80/95% quantiles in decreasing opacity), because uncertainty that doesn't grow lies about the forecast's confidence — see integrity-uncertainty.md (owner of uncertainty; Bank of England fan chart, since 1996)
- Mark the cutoff instant (a vertical "today" / "last real data" line), because without it the reader doesn't know where fact ends and assumption begins — Cairo, How Charts Lie, 2019 (see integrity-uncertainty.md)
- Label the projection's method and horizon ("run-rate", "model X, 90 days"), because a projection with no method or range is false precision — see integrity-uncertainty.md
- Don't extend the SAME solid line into the future or hide the band to make the projection "look more confident" — see integrity-uncertainty.md

**Anti-patterns:** a single solid line crossing past and future with no divider; a projection with an exact number and no range ("we'll have 3,700 in December"); a fan chart with bands and no quantile label; a projection cone read as "the business is growing" because the band widens (see integrity-uncertainty.md); a forecast that doesn't mark where the real data ends.

## Dense time shapes: calendar heatmap, horizon chart, connected scatter

When the series is too long, or there are too many series, or the point is the relationship between TWO metrics over time, a simple line isn't enough. Three dense shapes solve distinct cases: a calendar heatmap for daily values over months/years with a weekly pattern; a horizon chart to compare many series in little vertical space; a connected scatter for the trajectory of two paired series.

**Rules:**
- Use a calendar heatmap when daily values over months/years and the weekly/seasonal pattern matter together (e.g., daily consumption, tickets per day), because the calendar grid aligns days-of-week and months and reveals the season and atypical days — Van Wijk & Van Selow, Cluster and Calendar based Visualization of Time Series Data, InfoVis, 1999
- Use a horizon chart to compare MANY series stacked in little vertical space (e.g., latency across dozens of servers), because the layered bands keep good reading accuracy at ~half the height of a line, and label the bands (the reader doesn't decode the convention alone) — Heer, Kong & Agrawala, Sizing the Horizon, CHI, 2009
- Reserve the horizon chart for an audience that learns the convention on a recurring dashboard, not for a casual reader, because reading layered bands takes training — Heer, Kong & Agrawala, 2009
- Use a connected scatter to show the TRAJECTORY/relationship between two paired series over time (e.g., unemployment × inflation, price × volume), not the evolution of a single one, because the form encodes the bivariate relationship and not the isolated series — Haroz, Kosara & Franconeri, The Connected Scatterplot for Presenting Paired Time Series, IEEE TVCG, 2016
- If you use a connected scatter, signal start, end, and direction (an arrow, date labels, a highlighted starting point), because without direction cues the reader reverses the reading of the trajectory — Haroz, Kosara & Franconeri, 2016
- When torn between a connected scatter and two line panels, prefer the two panels for a lay audience: the connected scatter is more memorable and engaging, but produces more trend-judgment errors — Haroz, Kosara & Franconeri, 2016

**Anti-patterns:** a calendar heatmap with a rainbow color scale (see color.md) or no scale legend; a horizon chart handed to a casual reader without explaining the bands; a connected scatter with no start/end/direction marked (an indecipherable tangle); a connected scatter for a single series (one line over time is enough); a horizon chart for 3 series that would fit as direct lines (complexity with no gain).

## Sources

- William S. Cleveland, McGill & McGill, The Shape Parameter of a Two-Variable Graph (banking to 45°), JASA 83:289–300, 1988
- William S. Cleveland, Visualizing Data, 1993 (cycle/subseries plot; loess span)
- William S. Cleveland, The Elements of Graphing Data, revised ed., 1994
- William S. Cleveland, Robust Locally Weighted Regression and Smoothing Scatterplots (loess), JASA 74:829–836, 1979
- R. B. Cleveland, W. S. Cleveland, McRae & Terpenning, STL: A Seasonal-Trend Decomposition Procedure Based on Loess, Journal of Official Statistics 6(1):3–33, 1990
- Heer, Kong & Agrawala, Sizing the Horizon: The Effects of Chart Size and Layering on the Graphical Perception of Time Series Visualizations, CHI, 2009
- Heer & Agrawala, Multi-Scale Banking to 45°, IEEE InfoVis, 2006
- Van Wijk & Van Selow, Cluster and Calendar based Visualization of Time Series Data, IEEE InfoVis, 1999
- Haroz, Kosara & Franconeri, The Connected Scatterplot for Presenting Paired Time Series, IEEE TVCG 22(9):2174–2186, 2016
- Kohavi, Tang & Xu, Trustworthy Online Controlled Experiments, 2020 (day-of-week effect)
- Bank of England, Inflation Report fan charts, since Feb 1996; Britton, Fisher & Whitley, The Inflation Report projections: understanding the fan chart, BoE Quarterly Bulletin, 1998
- Stephen Few, Show Me the Numbers, 2004
- Stephen Few, Dual-Scaled Axes in Graphs, Perceptual Edge, 2008
- Claus Wilke, Fundamentals of Data Visualization, 2019
- Alberto Cairo, How Charts Lie, 2019; The Truthful Art, 2016
- FT Visual Vocabulary (Alan Smith / FT Visual Journalism Team), Financial Times, 2016
- Graphic Continuum (Jon Schwabish & Severino Ribecca), 2014 — inspired the FT Visual Vocabulary
- Datawrapper Academy (line charts, responsive height), 2021–2023
- IBCS — International Business Communication Standards (Hichert & Faisst)
