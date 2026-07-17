# Choosing a form: chart taxonomies and when to use a table

> Reference for the dataviz-design skill. Load when: deciding the chart/table type for a screen, reviewing whether an existing chart is the right form, arbitrating chart vs table vs sparkline in a dashboard, or picking the form for correlation, distribution, part-to-whole, or flow/cohort.

## Procedure: from message to form (4 steps)

Before opening the catalog of types, run four steps in order — they turn "which chart do I use" into a chain of decisions and summarize the sections that follow (FT/Continuum give you the family, Cleveland–McGill gives you the channel). As soon as step 2 points to a family, jump to that family's section.

1. **Write the message as a sentence** with a subject and a verb ("churn dropped 20% since March"; "two regions account for 80% of the cost"). The verb (dropped, concentrates, leads, correlates, is distributed, flows) already points to a family — Zelazny, Say It With Charts, 1985.
2. **Translate the verb into a family/relationship** (deviation, correlation, ranking, distribution, change over time, magnitude, part-to-whole, spatial, flow); the family narrows the candidate set — see §FT Visual Vocabulary.
3. **Start with the SIMPLEST form in the family** that supports the task (bar/line before sankey/radar); only step up in complexity with an explicit task justification — see §Graphic Continuum.
4. **Check the channel for the most important variable**: it should land in the most precise channel available (position > length > angle > area > color); if it landed in a weak channel, switch the form — Cleveland & McGill 1984 (see references/perception.md). Only then decide chart vs table: if the task is looking up an exact value, it's a table (see §When a TABLE beats a chart).

## FT Visual Vocabulary: choosing by the relationship in the data (9 families)

The Financial Times' Visual Vocabulary (Chart Doctor team led by Alan Smith, 2016, inspired by the Graphic Continuum) organizes ~70 chart types into 9 families by the RELATIONSHIP the data expresses: deviation, correlation, ranking, distribution, change over time, magnitude, part-to-whole, spatial, and flow. The design question stops being "which chart do I use" and becomes "which relationship does the screen need to show" — the same dataset supports several families, and only the message disambiguates. The poster itself declares it a starting point ("at the start of a workflow"), not a deterministic wizard.

**Rules:**
- Before choosing the type, name the relationship in the message as one of the 9 families (deviation/correlation/ranking/distribution/time/magnitude/part-to-whole/spatial/flow), because the same data becomes different charts depending on the task, and the family narrows the candidate set — FT Visual Vocabulary 2016
- Use the Deviation family (diverging bar, spine, surplus/deficit) whenever there's a fixed reference (target, budget, zero, previous year), because plotting the delta directly spares the reader from subtracting one bar from another — FT Visual Vocabulary 2016; IBCS Standards 2021 (AC vs PY/BU comparison)
- If position in the list matters more than the absolute value, sort by value and use the Ranking family (sorted bar, dot strip, slope, lollipop); alphabetical order only when the task is lookup by name, because it destroys the visual ranking pattern — FT Visual Vocabulary 2016; Few, Show Me the Numbers, 2012
- Reserve maps (Spatial family) for when the geographic pattern or the precise location IS the message ("used only when precise locations or geographical patterns are more important than anything else"), because a choropleth of data with no spatial pattern is decoration and distorts by polygon area — FT Visual Vocabulary 2016
- In the Magnitude family, bars/columns start at zero without exception (length is the channel; truncating lies); in the Change over Time family, a line can have a truncated axis because the channel is position/slope, not length — Few 2012; Cairo, The Truthful Art, 2016
- To compare the magnitude of categories across 2 points in time, use a paired bar, dumbbell, or slope — never two pie charts side by side, because comparing angles across separate figures is the worst perceptual judgment available — Cleveland & McGill 1984; FT Visual Vocabulary 2016
- When auditing a screen, check that each chart answers its family's declared task: a "ranking" with no sort, a "deviation" with no reference line, or a "time" chart with a scrambled categorical axis all fail the very taxonomy that justifies them — FT Visual Vocabulary 2016; Schwabish, Better Data Visualizations, 2021

**Anti-patterns:** Choosing a chart by the shape of the data ("it's a percentage, so pie") instead of the relationship/message; choropleth for absolute values (population contaminates everything) or for data with no spatial pattern; bar with a truncated axis "to fit" — silently swaps the magnitude family; ranking shown in alphabetical order; using an exotic type (sankey, chord, radar) where a bar/line solves it, charging the user visual literacy for no return.

## High-value rare types: slope, dumbbell, dot strip, bump, lollipop

Between the defaults (bar, line, pie) and the exotic zoo lives a handful of underused forms that solve specific tasks better than the defaults. Slopegraph (Tufte, 1983) and dumbbell cover "change between two points"; bump chart covers "ranking over time"; dot strip plot covers "distribution by category with small N." These are the forms the FT taxonomy lists but almost nobody uses — and where a dashboard gains precision without gaining complexity.

**Rules:**
- Use a slope chart when only the start and end of a period matter for several categories, because it's "a line with the middle erased": it shows direction, relative magnitude of change, and rank crossings with less ink than a multi-line chart — Tufte, VDQI, 1983 (slopegraph, p.158); Datawrapper Blog (Muth), "A friendly guide to choosing a chart type"
- Prefer a dumbbell (connected dot plot) over a slope when the absolute LEVEL of each category matters alongside the change, because both points sit on a common horizontal scale — position on a common scale is the most precise channel — Datawrapper Blog (Muth); Cleveland & McGill 1984
- Use a bump chart when the message is rank position over time (not the value): the uniform spacing between positions makes overtakes legible; if the absolute value matters, go back to a plain line chart — FT Visual Vocabulary 2016; Datawrapper Blog
- Use a dot strip plot for distribution by category with a few dozen observations, because it shows every point (including outliers) where a boxplot would hide the N and the multimodality — FT Visual Vocabulary 2016; Wilke, Fundamentals of Data Visualization, 2019, ch. 7
- Prefer a dot plot (Cleveland) over a bar when the axis can't/shouldn't start at zero (e.g., life expectancy 70–85, rates 95–99%), because the dot encodes by position and doesn't require a zero baseline the way bar length does — Cleveland, Visualizing Data, 1993; Few 2012
- Slope/multi-line with more than ~5 categories: highlight the 1–3 relevant series in color and gray out the rest, labeling directly at the end, because the value of a slope is the up-vs-down contrast, not identifying each line — Knaflic, Storytelling with Data, 2015
- Lollipop only as a bar substitute when there are many items with high, close values (the thin stem cuts the moiré effect of fat bars); aware that the ball adds ±radius ambiguity when reading the value — Datawrapper Blog (Muth); Schwabish 2021

**Anti-patterns:** Slope with 30 colored, labeled lines — becomes tilted spaghetti; dumbbell with 3+ points per line (loses the before/after semantics; use a line); bump chart read as if spacing were a continuous value; dot strip with hundreds of overlapping points and no jitter or transparency; using slope/dumbbell for two points that aren't comparable (a methodology change between the dates).

## Graphic Continuum (Schwabish & Ribecca) and choosing by the message (Zelazny)

The Graphic Continuum (Jon Schwabish & Severino Ribecca, 2014, bronze at the Information is Beautiful Awards) organizes ~90 forms into 6 families — Distribution, Time, Comparing Categories, Geospatial, Part-to-Whole, Relationships — with lines connecting forms that serve more than one family: the taxonomy is a graph, not a tree. It predated and inspired the FT Vocabulary. The tradition of choosing by the message (not the data) comes from Zelazny (1985): first write the message sentence, then derive the form.

**Rules:**
- Write the message as a full sentence ("customer churn dropped 20% since 2024") before choosing the form, because the verb of the sentence (dropped, leads, is concentrated, correlates) points straight to the family — Zelazny, Say It With Charts, 1985; Schwabish, Better Data Visualizations, 2021
- When the data serves two families (e.g., a time series of ranking → Time or Comparison), choose by the user's dominant task on that screen, because the Continuum makes explicit that many forms live in multiple families — Schwabish & Ribecca 2014
- In a product/dashboard, use the SAME form for the same relationship across different screens and only vary the form when the relationship changes, because notation consistency drives the learning cost to zero on the second screen — IBCS 2021 (UNIFY rules); Few, Information Dashboard Design, 2013
- Combine taxonomy with perception in two steps: the family narrows the candidate set; the channel ranking (position > length > angle > area > color) decides between them — Schwabish 2021; Cleveland & McGill 1984; Munzner, Visualization Analysis and Design, 2014
- Start with the simplest type in the family that supports the task and only step up in complexity with an explicit task justification, because every exotic form charges the reader literacy with no guaranteed return — Schwabish 2021

**Anti-patterns:** Treating the catalog as a menu of novelties ("we've never used a chord, let's use one"); changing the form of the same KPI between screens (line here, bar there) with no change of task; choosing the form before knowing what question the user will ask on the screen; justifying the form by "having data that fits it" instead of by the message.

## When a TABLE beats a chart (Few's criterion)

Few (Show Me the Numbers, 2004; 2nd ed. 2012) gives the canonical criterion: table when the use is looking up and comparing INDIVIDUAL, precise VALUES; chart when the message is in the SHAPE of the data (trend, pattern, exception, comparison of whole series). Knaflic (2015) explains the mechanism: tables engage the verbal system (we read row by row), charts the visual system (preattentive). In an operations app, many "chart" screens are actually lookup tasks — and should be tables.

**Rules:**
- Use a table when the user looks up individual values ("how much did route X cost", "who was the carrier on delivery Y"), because a chart forces interpolating position against an axis — Few, Show Me the Numbers, 2004
- Use a table when the view mixes different units of measure ($, %, count, days) in the same rows, because a chart would require multiple axes or normalizations that destroy readability — Few 2004
- Use a table when precision to the last digit is a requirement (finance, audit, export, reconciliation), because every visual encoding sacrifices precision by default — Few 2004
- Use a table when you need summary + detail together (rows with subtotals/totals), because a total and its parts on the same graphical scale blur into each other — Few 2004
- Use a table when each reader looks up THEIR OWN row (a report by client/state/carrier), because a heterogeneous audience uses the same view for distinct lookups — Knaflic 2015
- If the message is in the shape AND the exact values matter, show both: a hybrid table-chart with sparklines or in-cell bars, instead of picking just one — Few 2004; Tufte, Beautiful Evidence, 2006
- In the table, right-align numbers with a FIXED number of decimal places and left-align text, because aligning by the unit lets you compare magnitude by scanning the column vertically — Few 2004
- Structure with white space and subtle hairlines instead of full gridlines and saturated zebra striping, because structure ink competes with data ink (data-ink ratio) — Few 2004; Tufte, VDQI, 1983
- Sort the rows by the column that answers the screen's default question (value, date), not by the ID, because sorting is the only "shape" a table has — Few 2004

**Anti-patterns:** A bar chart for 4 numbers the user just reads off (decoding cost with no shape message); a 200-row table when the real question is "what's the trend"; dark zebra + gridlines + outer borders on the same table; numbers centered or with variable decimal places in the same column; hiding the exact value behind a tooltip when lookup is the screen's primary task; duplicating a table and a chart with the SAME data with no distinct task for each.

## Small multiples (Tufte) vs stacked series and spaghetti

Small multiples = the same form repeated in a grid, varying one dimension per panel — for Tufte (1983/1990) they are "inevitably comparative" and answer the central question of quantitative reasoning: "compared to what?". They are the canonical answer to both the spaghetti chart (illegible multi-line) and the stacked area (where only the base series has a stable baseline). They trade identification-by-color for identification-by-position, which scales far better.

**Rules:**
- Above ~4–5 series in a line chart, break into small multiples OR highlight 1–2 series in color and gray out the rest, because discriminating more colors across crossing lines blows past preattentive capacity — Knaflic 2015; Few 2012
- In a stacked area, only the base series (and the total) are legible; if the task is to compare each series' trend, use small multiples or plain lines, because the middle series "float" on unstable baselines — Wilke 2019 (ch. "Visualizing time series"); Few 2012
- Keep the scale, axes, and aspect ratio IDENTICAL across every panel in the grid, because the strength of the small multiple is direct eye-to-eye comparison — silently varying the scale between panels is lying — Tufte, Envisioning Information, 1990; Wilke 2019
- Order the panels by value or relevance (never alphabetically), because position in the grid carries ranking information for free — Few 2012; Schwabish 2021
- Label each panel with a short direct title (no shared color legend) and repeat axes only on the first column/last row of the grid, because redundant axes steal data area — Tufte 1983 (data-ink); Wilke 2019
- If the series' magnitudes differ by orders of magnitude and the task is trend-shape, index (base 100) or use a log scale BEFORE abandoning the common scale, because a free scale per panel breaks the comparability that justifies the grid — Datawrapper Blog (Muth); Cairo 2016
- Prefer a grid of small multiples over temporal animation (animated map/scatter), because the grid allows simultaneous comparison and animation forces the user to remember the previous frame ("eyes beat memory") — Tufte 1990; Munzner 2014
- Small multiples work for any form (mini-maps, mini-bars, mini-scatters), not just lines: a grid of mini-choropleths by period beats a map with a slider — Tufte 1990; FT Visual Vocabulary 2016

**Anti-patterns:** Spaghetti of 12 lines with a side legend of 12 colors; stacked area used to compare the middle series; a grid with a different Y axis per panel and no visual warning; panels in alphabetical order when ranking matters; a grid so dense each panel loses its minimal reference ticks; animation/slider where a static grid would solve the comparison.

## Sparklines: word-sized charts (Tufte)

Sparkline = "small, intense, simple, word-sized graphics with typographic resolution" (Tufte, Beautiful Evidence, 2006). It lives where a word or a number would fit: inside a sentence, a table cell, or a KPI row. It gives trend-shape and historical context, never exact values — it's the link that turns a table of numbers into a table-chart and a bare KPI into a KPI with a trajectory.

**Rules:**
- Attach a sparkline to every KPI/table row whose current value invites the question "and how did it get here?", because a number with no trajectory invites misreading a momentary peak/trough — Tufte 2006; Few, Information Dashboard Design, 2006
- Zero chrome: no axes, gridlines, or legend; mark at most the last point (and optionally min/max) with a dot and anchor the final value as a number beside it, because at typographic resolution any structure becomes noise — Tufte 2006
- Draw a light gray "normal band" behind the line when a reference exists (target, typical range), because an exception is only legible against the normal — Tufte 2006
- In a column of sparklines, ALWAYS use the same period and the same time scale on the X axis across every row, because the shared X is what makes the column comparable — Few 2006
- The Y scale is an EXPLICIT conditional decision: a per-row scale when the sparklines are of different metrics/units and the reading is only the SHAPE of the trend (distinct units already forbid comparing amplitude); the SAME Y scale when the rows are the same metric/unit and MAGNITUDE compares vertically. Signal which regime is in use, because a silent inconsistent scale invites a false amplitude comparison — Few, Information Dashboard Design, 2006 (2nd ed. 2013)
- A single neutral color for all sparklines in a column; color enters only to encode state (a series in violation/alert), never the identity of the row, because a rainbow in a column is functionless noise — Few 2013; the role of context-gray in references/color.md
- Sparkline height ≈ text line height (1–2 lines) with a flattened aspect ratio, aiming average slopes near 45°, because "banking to 45°" maximizes the discrimination of slope changes — Tufte 2006; Cleveland, Visualizing Data, 1993
- Use a sparkline for series with reasonable resolution (≥ ~10–12 points); for 2 points use a delta/arrow and for 3–5 use mini-bars, because a 3-point line suggests a continuity that doesn't exist — Tufte 2006; Few 2013
- A sparkline is indexical, not analytical: it points where to look; offer a path (click/drill) to the full chart with axes when the anomaly shows up — Few 2006

**Anti-patterns:** Sparkline with its own axes, ticks, and title (it became a bad small chart); coloring each sparkline a different color in a table (functionless rainbow); comparing amplitude across sparklines with different Y scales; a 3-point sparkline where a numeric delta with an arrow would say more; a sparkline with no anchor number beside it (shape without magnitude); smoothing/interpolating the series to the point of hiding the exception that justified the sparkline.

## Grammar of graphics (Wilkinson) as encoding reasoning

Wilkinson (The Grammar of Graphics, 1999; 2nd ed. 2005) shows that "chart type" is a surface illusion: every chart is the composition data → statistical transformation → scales → coordinate system → geometry + aesthetic mappings → guides (axes/legends). Thinking this way (operationalized by Wickham, "A Layered Grammar of Graphics", JCGS 19(1), 2010, in ggplot2) turns form choice into a choice of variable→channel MAPPINGS, and gives a channel-by-channel audit method for any screen.

**Rules:**
- Audit any chart by listing variable → channel (x, y, color, size, shape, facet): each variable in exactly one channel, and the most precise channel for the most important variable — Wilkinson 1999; Munzner 2014
- Check expressiveness: the encoding must show all AND only what's in the data — don't connect nominal categories with a line (implies continuity), don't use a color gradient for a nominal category (implies order) — Mackinlay 1986 ("Automating the Design of Graphical Presentations"); Munzner 2014
- Check effectiveness against the empirical hierarchy of quantitative channels: position on a common scale > position on nonaligned scales > length > slope/angle > area > color/volume; the judgment error grows at each step down — Cleveland & McGill 1984 (JASA 79:531–554); replicated by Heer & Bostock, CHI 2010
- When in doubt about a form, mentally unlock it from its coordinate system: pie = stacked bar in polar coordinates, radar = line in polar; if the Cartesian version reads better (almost always), use it — Wilkinson 1999; Wickham 2010
- Color by function: hue for categories (≤ ~5–7 distinguishable), luminance/sequential for quantity, diverging only with a meaningful midpoint (zero, target, mean) — Munzner 2014; Wilke 2019
- Quantity in size: map to AREA (not radius/diameter), because mapping to radius squares the perceived difference — Wilke 2019; Cairo 2016
- Treat faceting (small multiples) as an encoding channel: prefer facet over color when the categorical variable has >5 levels, because spatial position scales where hue saturates — Wickham 2010; Wilke 2019
- Reject a dual axis with two arbitrary quantitative scales, because the crossing point is an artifact of the scale choice, not of the data; use indexing, a ratio, or two aligned panels — Few, "Dual-Scaled Axes in Graphs", Perceptual Edge, 2008; Wilke 2019

**Anti-patterns:** Conflicting double encoding (color says one thing, position says another); a nominal category on a sequential color ramp; a line connecting discrete categories (states, carriers); 3D/perspective effects — they add the volume channel, the worst of all, with no new data; a dual axis calibrated to force a visual "correlation"; bubbles scaled by radius instead of area.

## Part-to-whole: pie, donut, stacked bar, treemap — usage thresholds

The most abused family in the taxonomy. The pie is legitimate in a narrow niche — Wilke (2019) devotes a "case for pie charts" — and Few (2007) documents why outside it the pie fails: angle/area judgment is imprecise. Stacked bar and treemap each have their own task; the decision comes from distinguishing three tasks: judging fraction-of-the-whole, comparing segments against each other, and showing total + composition at the same time.

**Rules:**
- Pie only with ≤5 slices, a single series, and when the message is a simple fraction-of-the-whole (½, ⅓, ¼ are instantly recognizable as angles), because above that the angular comparison degrades fast — Wilke 2019 ("A case for pie charts"); Few, "Save the Pies for Dessert", Perceptual Edge, 2007
- If the task is comparing categories AGAINST EACH OTHER (ranking/magnitude), swap the pie for a sorted bar, because length on a common scale beats angle for judgment precision — Cleveland & McGill 1984; Few 2007
- Never use two+ pies side by side to show change or comparison between groups; use a 100% stacked bar (few categories) or a slope of proportions, because angles across separate figures are incomparable — Few 2007; Wilke 2019
- In a stacked bar, put the most important category against the baseline and limit to 3–4 segments, because only the base segment and the total read precisely; the middle ones float — Wilke 2019; Few 2012
- If the total varies between groups/periods (e.g., deliveries/month), prefer ABSOLUTE stacked columns over 100%, because the 100% version hides growth or decline of the whole — Schwabish 2021; FT Visual Vocabulary 2016
- Treemap only when there's a real hierarchy OR dozens of long-tail categories and the task is "who dominates," accepting that the reader won't rank similar areas precisely — FT Visual Vocabulary 2016; Munzner 2014
- Donut: the hole removes the central angle, which was the only remaining information; if you use it for branding/space for a central number, treat it as an indicator of 1–2 fractions, never as a multi-slice comparison chart — Few 2007
- Before any part-to-whole, validate that the "whole" is meaningful to the user (100% of what?); percentages of different bases stacked together are the most common lie in the family — Cairo 2016; Few 2012

**Anti-patterns:** Pie with 8–12 slices and a side legend (a double round-trip for the eye); a time series of pies; a thin donut with many segments and percentages only in the tooltip; a 100% stacked bar masking that the total dropped 40%; a treemap for 5 flat categories where a sorted bar solves it; a 3D pie (the perspective distorts the angles of the front slices); an "other" slice bigger than the named slices.

## Correlation: scatter, connected scatter, bubble, XY heatmap — and when to draw a trend line/log

The Correlation family (FT) asks "do they move together?". The default is the scatterplot — X and Y in position, the two most precise channels, one point per observation. The variations solve narrow cases: connected scatter for two paired time series, bubble for a 3rd variable with low precision demand, XY heatmap for overplotting. A trend line and a log scale are READING decisions about the scatter, not new types.

**Rules:**
- The default for correlation is the scatterplot (X and Y in position, the two most precise channels); only switch forms if overplotting or a 3rd variable forces it — Cleveland & McGill 1984; FT Visual Vocabulary 2016
- Use a connected scatterplot (each axis = one metric, a line linking the points in time order) only for two paired time series whose RELATIONSHIP over time is the message; mark the start, end, and direction with arrows/labels, because without a direction cue the reader can't recover the order and the error rate rises — Haroz, Kosara & Franconeri, IEEE TVCG 22(9), 2016
- Bubble (3rd variable in size) only when that variable tolerates imprecise reading, and mapped to AREA, never radius (see the size rule in §Grammar of graphics); above ~two dozen bubbles or with overlap, go back to scatter + facet or color — FT Visual Vocabulary 2016; Wilke 2019
- With many thousands of points and overplotting, swap the scatter for an XY heatmap (2D bin) or density, because a saturated black cloud hides where the mass of the data is — Wilke 2019; FT Visual Vocabulary 2016
- Draw a trend line (linear regression or LOESS) only to guide the eye over a pattern that already exists in the cloud, rendered as a derived layer distinct from the points; never extrapolate beyond the observed domain nor treat the line as proof of cause — Cleveland, "Robust Locally Weighted Regression…", JASA 74:829–836, 1979; Cairo, The Truthful Art, 2016
- Use a log scale on one or both axes when the variable spans several orders of magnitude or the relationship is multiplicative/power-law (a straight line on log-log = a power law); label the axis as log, because the reader assumes linear by default — Cleveland, Visualizing Data, 1993; Cairo 2016

**Anti-patterns:** Scatter presented as proof of causation (correlation ≠ cause); connected scatter without marking start/end/direction — becomes an illegible scribble; a bubble sized by radius (perceived difference is squared); a bubble where the 3rd variable was the main message and demanded precision; an XY heatmap with no density legend; a regression line extrapolated far beyond the data or drawn over a nonexistent relationship (N=6, "beautiful" R²); a log axis with no warning, read as linear.

## Distribution: histogram, boxplot, violin, ridgeline, beeswarm, ECDF — choose by N

Showing "how the data spreads" has a ladder of forms whose choice depends on how many observations and how many groups exist. Few points: show them all (strip/beeswarm). Many: summarize with density (histogram, boxplot, violin). Many ordered groups: stack densities (ridgeline). When honesty above all matters: ECDF, which has no hidden parameter. Boxplot and violin gain density at the cost of hiding the N and the multimodality.

**Rules:**
- Histogram (bars that TOUCH, a binned continuous variable) ≠ bar chart (bars with gaps, discrete categories); keeping/removing the gap is what distinguishes "bands of a continuum" from "categories" — Few 2012; Wilke 2019
- The histogram's bin width is a choice that creates or erases features; test more than one width before concluding about modes and tails, because too wide a bin merges peaks and too narrow becomes a sawtooth of noise — Cleveland, Visualizing Data, 1993; Wilke 2019
- With a few dozen observations per group, show every point (strip/beeswarm/dot strip — see §High-value rare types), not a boxplot, because a five-number summary over small N hides the N and the real shape — Wilke 2019
- A boxplot (Tukey) summarizes by quartiles and is great for comparing many groups by position, but HIDES bimodality (two groups of opposite density can have an identical box); if you suspect multimodality, overlay the points or use a violin — Tukey, Exploratory Data Analysis, 1977; Wilke 2019
- Violin (boxplot + mirrored density) only with enough N per group for the density to be stable; with small N the curve invents a shape the data doesn't support — Hintze & Nelson, "Violin Plots", The American Statistician 52(2):181–184, 1998; Wilke 2019
- To compare MANY distributions along a sequence (months, ordered groups), use a ridgeline (stacked densities with slight overlap), because position in the stack carries the order and the overlap saves space without crossing lines — Wilke, Fundamentals of Data Visualization, 2019 (ch. Visualizing Many Distributions)
- When you need to read exact quantiles or compare two distributions without choosing a bin or a bandwidth, use an ECDF (cumulative curve): it uses every point, has no hidden parameter, and the median/percentile read straight off the axis — Wilke 2019; FT Visual Vocabulary 2016 (cumulative curve)

**Anti-patterns:** Histogram with separated bars (looks categorical) or a categorical bar with no gap (looks continuous); concluding "unimodal" from a single bin-width; a boxplot over five points; a boxplot where the message was bimodality (two peaks become one box); a violin with tiny N inventing lobes; a ridgeline in alphabetical order of the groups when there was a natural order; dozens of overlapping translucent histograms (use a ridgeline or small multiples — see §Small multiples).

## Flow and cumulative deviation: waterfall, sankey/alluvial, funnel, cohort

Four forms for when the data is a PROCESS — a value that decomposes into steps, a quantity that is conserved and branches, or a population that advances through stages. Each has a narrow trigger and the same common abuse: using it when there's no real flow/conservation behind it.

**Rules:**
- Waterfall (floating columns that sum from a starting value to an ending one via +/− deltas) when the message is "how did we get from A to B," decomposing the change into sequential contributions, because plotting each step's delta spares the mental subtraction between totals — FT Visual Vocabulary 2016 (waterfall); IBCS 2021 (bridge)
- In a waterfall, color encodes sign (up/down) and marks the totals (start/end/subtotals) as distinct from the steps, because the reading is "each step pushes up or down until the account closes" — IBCS 2021; see references/color.md
- Sankey/alluvial only with REAL FLOW, where the quantity is conserved and the width ∝ volume (source→destination, stage→stage, cluster at t→cluster at t+1); alluvial is the variant for recategorization across dimensions or over time — FT Visual Vocabulary 2016 (Flow: Sankey); Rosvall & Bergstrom, "Mapping Change in Large Networks", PLoS ONE 5(1):e8694, 2010 (alluvial)
- A conversion funnel only when the stages are nested subsets (each step ⊆ the previous) and the areas/widths are proportional to the count; if the task is comparing the drop-offs precisely, a bar sorted by stage reads better than the trapezoid, because length beats area — Tufte, VDQI, 1983 (lie factor); Cleveland & McGill 1984
- Cohort: a grid (heatmap) of cohort × period-since-entry to see retention, with each cohort's N visible and each cell being a rate over that cohort's base; the retention curve (one line per cohort, X = period since entry) complements it when the shape of the drop is the message — derived; see references/tables.md (in-cell heatmap) and references/integrity-uncertainty.md (a rate requires its base in view)

**Anti-patterns:** Waterfall without distinguishing totals from steps (you can't tell where the account closes); a decorative sankey/chord for a relationship that isn't flow (nothing is conserved — it was a bar or a matrix); a funnel with trapezoids whose area is NOT proportional to the count (inflating or flattening the drop-off); a funnel over stages that aren't nested subsets; a cohort with no N per cell (a 100% rate that is 1 of 1); a cohort grid colored with no scale legend; a retention curve mixing cohorts of incomparable sizes without declaring the N.

## Sources

- Alan Smith et al. (FT Chart Doctor), Visual Vocabulary, Financial Times, 2016
- William Cleveland & Robert McGill, "Graphical Perception", JASA 79(387):531–554, 1984
- William Cleveland, Visualizing Data, 1993
- Stephen Few, Show Me the Numbers, 2004 (2nd ed. 2012)
- Stephen Few, "Effectively Communicating Numbers", Perceptual Edge whitepaper, 2005
- Stephen Few, Information Dashboard Design, 2006 (2nd ed. 2013)
- Stephen Few, "Save the Pies for Dessert", Perceptual Edge, 2007
- Stephen Few, "Dual-Scaled Axes in Graphs", Perceptual Edge, 2008
- Edward Tufte, The Visual Display of Quantitative Information, 1983
- Edward Tufte, Envisioning Information, 1990
- Edward Tufte, Beautiful Evidence, 2006
- IBCS Standards 1.2 (Hichert & Faisst), 2021
- Alberto Cairo, The Truthful Art, 2016
- Cole Nussbaumer Knaflic, Storytelling with Data, 2015
- Lisa Charlotte Muth, Datawrapper Blog ("A friendly guide to choosing a chart type"), 2020–2022
- Jon Schwabish & Severino Ribecca, The Graphic Continuum, 2014
- Jon Schwabish, Better Data Visualizations, 2021
- Gene Zelazny, Say It With Charts, 1985
- Tamara Munzner, Visualization Analysis and Design, 2014
- Claus Wilke, Fundamentals of Data Visualization, 2019
- Leland Wilkinson, The Grammar of Graphics, 1999 (2nd ed. 2005)
- Hadley Wickham, "A Layered Grammar of Graphics", JCGS 19(1):3–28, 2010
- Jock Mackinlay, "Automating the Design of Graphical Presentations", ACM TOG, 1986
- Heer & Bostock, "Crowdsourcing Graphical Perception", CHI 2010
- John Tukey, Exploratory Data Analysis, 1977
- William Cleveland, "Robust Locally Weighted Regression and Smoothing Scatterplots", JASA 74(368):829–836, 1979
- Jerry Hintze & Ray Nelson, "Violin Plots: A Box Plot–Density Trace Synergism", The American Statistician 52(2):181–184, 1998
- Martin Rosvall & Carl Bergstrom, "Mapping Change in Large Networks", PLoS ONE 5(1):e8694, 2010
- Steve Haroz, Robert Kosara & Steven Franconeri, "The Connected Scatterplot for Presenting Paired Time Series", IEEE TVCG 22(9):2174–2186, 2016
