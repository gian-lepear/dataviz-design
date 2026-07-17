# Statistical integrity and uncertainty visualization
> Reference for the dataviz-design skill. Load when: reviewing/building a KPI, ranking, time series, rate map, estimate/forecast, or any chart where the honesty of the number, the axis scale, aggregation, or uncertainty could mislead the reader.

## Cairo's five qualities and the hierarchy of integrity
Cairo (The Truthful Art, 2016) defines five qualities of a good visualization: truthful, functional, beautiful, insightful, and enlightening — in that order of precedence: truthful comes first, and the rest don't make up for its absence. In How Charts Lie (2019) he catalogs five ways a chart can lie: bad design, dubious data, insufficient data, hidden/confounded uncertainty, and misleading patterns. The central thesis: "a chart shows only what it shows, and nothing more" — the reader (and the designer) tends to extrapolate beyond the data.

**Rules:**
- Treat the chart's title as a claim and audit whether the plotted data support it; if the title says "we grew" and the series shows 2 points, it's a lie by insufficient data — Cairo, How Charts Lie, 2019
- Validate the data BEFORE styling it: check the unit, denominator, source, and period at the origin, because a pretty chart of wrong data is the most convincing lie ("dubious data" is a whole mode of lying) — Cairo, How Charts Lie, 2019
- Put a source line + cutoff date ("data through Jul 12") on every published chart, because provenance is a precondition for verifiability — Cairo, The Truthful Art, 2016
- When reviewing a screen, apply the five qualities in order: first ask "does this mislead?" and only then "is this clear/beautiful?", because aesthetics don't fix dishonesty — Cairo, The Truthful Art, 2016
- Write annotations that assert only what the data show ("activation rose 12% over period X") and never what they suggest ("the campaign worked"), because the extrapolation is the analyst's, not the chart's — Cairo, How Charts Lie, 2019
- If the estimate's uncertainty changes the reader's decision, showing it is mandatory, not optional — omitting uncertainty is one of the five ways to lie — Cairo, How Charts Lie, 2019; Hullman, Why Authors Don't Visualize Uncertainty, 2020

**Anti-patterns:** An editorialized title the series doesn't support ("record performance" over variation within the noise); polishing a KPI's visuals without checking whether the upstream denominator/join is correct; a chart with no source or cutoff date on a decision dashboard; treating "beauty" and "truth" as a trade-off — Cairo shows they're layers, not alternatives.

## Tufte's lie factor and proportional distortion (Huff)
Tufte (1983) defines the lie factor = (size of the effect shown in the graphic) / (size of the effect in the data); an honest chart lands between 0.95 and 1.05, and the classic NYT fuel-economy example reaches 14.8. Huff (1954) had already cataloged the mechanisms: the "gee-whiz graph" (truncated Y axis that inflates variation) and the pictogram scaled in 2D/3D, where doubling the height quadruples the perceived area. The operating principle: the variation shown in ink must be proportional to the variation in the data.

**Rules:**
- Start the Y axis of BAR charts at zero, because a bar encodes value by length and truncating the axis multiplies the perceived effect (lie factor > 1) — Tufte, VDQI, 1983; Huff, 1954
- On LINE charts, truncating the axis is acceptable to show relevant variation, but declare the cut (a visible break or min/max label) and don't pick the range to dramatize — Cairo, How Charts Lie, 2019; Few, Show Me the Numbers, 2004
- Compute the lie factor when reviewing: (visual Δ%) / (data Δ%) should land in 0.95–1.05; outside that, redesign — Tufte, VDQI, 1983
- If you use pictograms/icons for a quantity, repeat the icon in proportional count (unit chart) instead of scaling it, because scaling in 2 dimensions grows with the square of the value — Huff, How to Lie with Statistics, 1954
- Ban 3D and perspective effects on bars/pies, because the projection distorts perceived proportion with no gain in information — Tufte, VDQI, 1983; Few, 2004
- Don't flatten or stretch the aspect ratio to smooth/dramatize a trend; the same data on a 4:1 vs 1:1 canvas tells different stories — Cairo, The Truthful Art, 2016 (cf. banking to 45°, Cleveland 1988)
- Don't use animation to communicate a trend or to fabricate one (revealing points in sequence to stage a rise, timing the transition to dramatize), because animation is among the least accurate formats for trend analysis — prefer overlaid traces or static small multiples; and if there is autoplay, let the user pause and rewind rather than hijacking the reading (for a legitimate animated transition between states, see references/interaction.md) — Robertson, Fernandez, Fisher, Lee & Stasko, IEEE TVCG 14(6), 2008; WCAG 2.2.2 Pause, Stop, Hide
- Dual axes with independent scales fabricate arbitrary crossings and correlations; use a base-100 index or two stacked panels — Few, Dual-Scaled Axes in Graphs (Perceptual Edge), 2008

**Anti-patterns:** A conversion bar running from 91% to 94% with the axis starting at 90% (a 3 pp change becomes 300% visually); a user icon 2× taller to represent 2× the value (perceived area 4×); a tilted 3D pie where the front slice looks bigger; an inverted Y axis or a log scale with no explicit label; two Y axes calibrated so the lines "meet" at the rhetorically convenient point; autoplay that reveals the series point by point and restarts on its own, with no pause/rewind, staging a trend the static frame doesn't show.

## Simpson's paradox and aggregation traps (mix-shift)
Simpson's paradox: an association present in the aggregate reverses or vanishes when the data are segmented. The canonical case: Berkeley admissions, 1973 — 44% of men vs 35% of women admitted in the aggregate, yet in most departments the female rate was equal or higher (women applied more to the competitive departments) — Bickel, Hammel & O'Connell, Science, 1975. On dashboards this shows up as mix-shift: the aggregate rate can fall while EVERY segment improves, simply because the composition changed. Cairo treats the topic in The Truthful Art as a level-of-aggregation failure.

**Rules:**
- Before publishing a comparison of rates across groups (conversion by channel, retention by state), run the same breakdown segmented by the 2-3 obvious dimensions and check whether the sign holds, because the aggregate can reverse the effect — Bickel, Hammel & O'Connell, Science 187, 1975
- When reporting the change in an aggregate rate between periods, decompose it into a rate effect (did each segment change?) and a mix effect (did the composition change?), because mix-shift produces "drops" with no real deterioration — Cairo, The Truthful Art, 2016
- In drill-down, keep the aggregate rate visible alongside the segmented ones (don't replace one with the other), so the reader can see when the levels disagree — Kievit et al., Simpson's paradox in psychological science, Frontiers in Psychology, 2013
- Never average percentages/rates without weighting by the denominator ("average of averages"), because small segments then weigh the same as large ones — Huff, 1954; Wilke, Fundamentals of Data Visualization, 2019
- When the segmented breakdown contradicts the aggregate, the published chart should show the level of aggregation that matches the decision (policy per department → show it per department) and annotate the divergence — Cairo, The Truthful Art, 2016
- Group-level correlation does not hold for individuals (ecological fallacy): don't annotate an individual conclusion on a scatterplot of aggregates by state/county — Robinson, Ecological Correlations and the Behavior of Individuals, ASR 15, 1950

**Anti-patterns:** A KPI "overall conversion rate fell 2 pp" turning into an alarm when only the channel mix changed; ranking segments by retention rate while mixing segments with 5 and with 5,000 users; hiding the aggregate view in the drill (or vice versa), keeping the reader from spotting the reversal; the arithmetic mean of monthly rates as "the year's rate".

## Honest time windows: cherry-picking, visual axis pre-registration, and gaps
Window cherry-picking: choosing where the series starts/ends to fabricate the desired trend — start at the trough and it shows "growth", start at the peak and it shows "decline"; Cairo devotes a chapter to this ("insufficient data") with examples from climate series and the National Review chart (2015) that "erased" global warming using a 0–110°F axis. The antidote is visual pre-registration: fix the window, baseline, and scale BEFORE looking at the result, and don't change them between releases. Missing data is part of the same contract: a gap is information, and interpolating silently is inventing data.

**Rules:**
- Define each series' default window in the spec (e.g., "always the last 12 complete months") before you see the numbers, and don't change it between dashboard versions, because a window chosen after the fact is cherry-picking institutionalized — Cairo, How Charts Lie, 2019
- For series with seasonality, show at least 2 complete cycles (≥24 months for annual seasonality) or compare YoY, because 1 cycle can't separate trend from season — Cairo, The Truthful Art, 2016
- If you need to zoom into a recent period, show the full series as context (an inset or sparkline alongside), because zoom without context is the most common way to lie by insufficient data — Cairo, How Charts Lie, 2019
- Missing data in a line series: don't interpolate and don't plot zero — break the line (a visible gap) at the missing point, because a continuous line over a null asserts a measurement that didn't happen, and zero is a plottable value, categorically distinct from absence (canonical rule null≠zero; other topics cross-reference this file) — Datawrapper Academy (missing values in line charts); Wilke, Fundamentals of Data Visualization, 2019
- If you interpolate or forecast, distinguish it visually: measured = solid line, estimated/forecast = dashed or hatched, with an annotation — IBCS Standards 1.2 (AC/FC/PL notation), 2021
- The same contract applies to bar/column: a cell with no data disappears or is marked "no data", never becomes a zero-height bar, because zero asserts a measured value that didn't happen — Wilke, Fundamentals of Data Visualization, 2019
- Mark the current incomplete period (a partial month) with hatching/opacity + a "partial" label, or exclude it from the series, because the last point plunging due to incompleteness triggers a recurring false alarm — IBCS, 2021; Datawrapper practice
- Annotate on the screen any events that break the series (a methodology change, a source migration, collection throttling), because a discontinuity without annotation becomes a "trend" — Cairo, The Truthful Art, 2016

**Anti-patterns:** A new-users series starting in the worst month on record to show "300% growth"; an axis with an absurd range (0–110°F) to flatten real variation — the inverse of the gee-whiz; the chart's last point dropping because the month hasn't closed, unmarked; interpolating failed collection days with a straight line, hiding the ingestion pipeline outage; changing the card's window from 12 to 6 months in the release where the 12 months turned ugly.

## Error bars: CI/SE/SD ambiguity and reading biases
The same T-shaped bar can represent ±1 standard deviation, ±1 standard error, or a 95% CI — quantities that differ by a factor of ~2 to ~4 — and Belia et al. (2005) showed that even published researchers confuse them: most get significance wrong when they judge it by bar overlap. Correll & Gleicher (2014) add two structural problems: the bar imposes an arbitrary binary cutoff (inside/outside) on a continuous quantity, and it suffers from the "within-the-bar bias" (Newman & Scholl, 2012) — points inside the bar look more likely than points outside, even when equidistant from the mean. An unlabeled error bar is noise with the appearance of rigor.

**Rules:**
- Label EVERY error bar with what it represents ("95% CI", "±1 SE", "±1 SD"), because without a label the reader has no way to decode it — the difference between SE and 95% CI is ~2× — Belia, Fidler, Williams & Cumming, Psychological Methods 10(4), 2005
- Don't let the reader infer significance from overlap: 95% CIs can overlap by up to ~25% of their length (half the margin of error) and still have p<0.05; SE bars need a GAP of ~1 SE for p≈0.05 — Cumming & Finch, Inference by Eye, American Psychologist 60(2), 2005
- On bar charts with an error bar, prefer a point + interval or a gradient plot, because the within-the-bar bias makes values inside the bar look more likely than outside — Newman & Scholl, Psychonomic Bulletin & Review 19(4), 2012; Correll & Gleicher, IEEE TVCG 20(12), 2014
- If the distribution is skewed (order values, processing times), don't use a symmetric error bar around the mean; show quantiles (p10/p50/p90) or the distribution — Correll & Gleicher, 2014; Wilke, 2019
- For decisions about INDIVIDUAL CASES (how much one customer varies, not the average across customers), show a prediction/outcome interval, not the CI of the mean: readers overestimate effects when they see a narrow inferential CI — Hofman, Goldstein & Hullman, CHI, 2020
- If comparing two groups is the point of the screen, plot the interval of the DIFFERENCE, not two separate intervals, because overlap judgment is systematically wrong even among experts — Cumming & Finch, 2005
- Error bars for repeated measures (the same customer before/after) don't support visual overlap inference at all — annotate the paired test instead of plotting 2 independent CIs — Belia et al., 2005

**Anti-patterns:** A whisker with no legend saying whether it's SD, SE, or CI; a reader concluding "not significant" because two 95% CIs touch; a symmetric error bar over the median of a log-normal distribution; the CI of the mean used to promise the outcome range of an individual case; choosing ±1 SE (the narrowest bar) to make the chart "look more precise".

## Beyond the error bar: gradients, fan charts, HOPs, and quantile dotplots
Post-2014 research replaces the binary interval with continuous or frequency encodings. Gradient plots (opacity decaying with density) and violins beat error bars in judgments with a one-sided effect (Correll & Gleicher, 2014). Hypothetical Outcome Plots — animating individual draws from the distribution — enable inference by counting without statistical training and beat error bars and violin plots in multivariate judgments like P(B>A) (Hullman, Resnick & Adar, PLOS ONE 10(11), 2015). Quantile dotplots discretize the distribution into 20–50 stackable dots: they cut the variance of probability estimates ~1.15× vs density (Kay et al., CHI 2016) and improved incentivized transit decisions (Fernandes et al., CHI 2018). The cognitive basis is frequency framing: "1 in 20" is processed better than "5%" (Gigerenzer & Hoffrage, 1995).

**Rules:**
- When the reader needs to estimate "what's the chance X ≥ threshold" (e.g., estimating new users/month from a campaign), use a quantile dotplot (20 or 50 dots) because counting the dots above the cutoff is more precise and less variable than reading density — Kay, Kola, Hullman & Munson, When(ish) Is My Bus?, CHI, 2016; Fernandes et al., CHI, 2018
- Communicate probability as a natural frequency ("~1 in 5 campaigns this size fall below N") in text and tooltip, because natural frequencies improve Bayesian reasoning vs percentages — Gigerenzer & Hoffrage, Psychological Review 102(4), 1995
- For a temporal forecast (revenue, order volume), use a fan chart with quantile bands (50/80/95%) in decreasing opacity, making it clear that uncertainty GROWS with the horizon — Bank of England, Inflation Report fan charts, since 1996
- If you use bands/cones, know the "the phenomenon is growing" reading risk: the hurricane cone is read as a storm growing in size and as a hard boundary (inside = danger, outside = safe); mitigate with an explicit annotation of the band's semantics — Ruginski et al., Spatial Cognition & Computation 16(2), 2016; Padilla et al., Cognitive Research 2:40, 2017
- To compare the reliability of an ordering across 2-3 series ("will A stay above B?"), consider HOPs (animating ~30-50 draws), which beat error bars and violin plots on that task — Hullman, Resnick & Adar, PLOS ONE, 2015; Kale et al., IEEE TVCG 25(1), 2019
- Prefer a gradient plot over an error bar when the chart is static and the audience is lay, because it removes the interval's arbitrary binary cutoff — Correll & Gleicher, IEEE TVCG, 2014
- Don't show ensemble displays as individually highlightable lines: lay readers interpret locations ON a line as more likely than locations between lines — Padilla et al., 2017
- Rigor round-trip: if the estimate comes from a model/sample (an estimated price, a flow forecast), the screen must say it's an estimate and within what range; an exact number where there's uncertainty is false precision — Cairo, How Charts Lie, 2019; Hullman, 2020

**Anti-patterns:** An estimate "you'll get 3,700 new users/month" with no range, when the model has ±40% error; a fan chart with bands but no quantile label (the reader can't tell whether it's 50% or 95%); a forecast cone read as "the business will grow" because the band widens; a violin plot for a lay audience with no explanation (misreadings of width); an animated HOP with no pause control — it becomes decorative noise on an operational dashboard.

## Small N: unstable rates, funnel plots, and "the most dangerous equation"
The variance of the sample mean grows as N shrinks (σ/√n, de Moivre, 1730) — which is why small units dominate BOTH extremes of any ranking of rates: the "best" and "worst" American schools were disproportionately small, and the Gates Foundation spent >US$1B on the illusion (Wainer, American Scientist 95(3), 2007). Spiegelhalter (Statistics in Medicine 24, 2005) proposes the funnel plot as an alternative to league tables: rate on the Y axis, denominator on the X, control limits at 2 SD (95%) and 3 SD (99.8%) forming the funnel — only points that break out of the funnel deserve attention. On a dashboard, any rate with a small denominator is noise dressed as signal.

**Rules:**
- Show the denominator next to every rate (an "n=12" badge), because 50% can be 1/2 and the reader needs to see that without a tooltip — Wainer, The Most Dangerous Equation, 2007
- Don't rank units (segments, states, stores) by rate when the denominators vary by orders of magnitude; use a funnel plot with limits at 2 SD and 3 SD and highlight only the points outside the funnel — Spiegelhalter, Funnel plots for comparing institutional performance, 2005
- Set an N floor (e.g., n≥30) below which the rate is suppressed or shown grayed out with a "small sample" warning, because rates with n<30 fluctuate too much to support a decision — de Moivre via Wainer, 2007
- On choropleth maps of rate by county, expect small counties to appear at both extremes of the color scale; consider smoothing/pooling or showing the count alongside, because the spatial pattern of extremes is an artifact of N — Wainer, 2007; Kahneman, Thinking, Fast and Slow (law of small numbers), 2011
- In "top/bottom N by rate" lists, sort by evidence (distance in SDs from the benchmark, or the lower CI bound), not by the raw rate, because the raw rate rewards whoever has the least data — Spiegelhalter, 2005
- Month-over-month variation of a rate with a small denominator is not a trend: require the change to break the control limit before coloring it green/red — Spiegelhalter, 2005; Few, Information Dashboard Design, 2006
- Avoid a league table with ordinal positions (1st, 2nd, 3rd) when the units' CIs overlap; a ranking with no uncertainty assessed is a spurious ranking — Spiegelhalter, 2005

**Anti-patterns:** A card "best state by conversion: WY (100%)" with n=1; ranking segments by retention rate while mixing n=3 and n=3,000; a green/red light on a ±1-case swing on a denominator of 8; a choropleth where the darkest and lightest counties are all the smallest; a target hit/missed decided by the monthly rate of a tiny segment.

## Mean vs. median: skew and what the summary hides
Huff (1954) called it the "well-chosen average" — the rhetorical choice among mean, median, and mode — because in a skewed distribution (income, order value, revenue per account, times) they diverge widely and the mean is pulled by the tail. Anscombe (1973) showed 4 datasets with the very same statistics (mean, variance, r=0.816, the same regression y=3+0.5x) and radically different shapes; Matejka & Fitzmaurice (CHI 2017) took it further with the Datasaurus Dozen — 12 shapes (including a dinosaur) identical to 2 decimal places. The moral: a point summary without looking at the distribution is a blind bet.

**Rules:**
- For metrics with a right tail (revenue per customer, ticket size, processing time, order value), use the median as the primary KPI and p90 as its companion, because the mean is inflated by outliers and doesn't describe the typical case — Huff, 1954; Wilke, 2019
- Always say WHICH average is in the label ("median", "weighted mean"), because "average" without qualification is the classic rhetorical loophole — Huff, How to Lie with Statistics, 1954
- If mean and median diverge by more than ~20%, the distribution is skewed: show both or plot the distribution (histogram/dotplot) instead of the number alone — Wilke, Fundamentals of Data Visualization, 2019
- Before locking a summary KPI into a new dashboard, plot the distribution once (a histogram), because identical statistics hide opposite shapes — Anscombe, Graphs in Statistical Analysis, 1973; Matejka & Fitzmaurice, Same Stats Different Graphs, CHI, 2017
- A boxplot hides bimodality; for up to ~a few thousand points prefer a strip/dot plot or violin plot when the shape matters — Wilke, 2019; Matejka & Fitzmaurice, 2017
- Don't compare subgroup means without checking sizes and tails: one outlier in a group of n=15 moves the mean more than 100 typical cases do — Huff, 1954; Wainer, 2007
- In before/after comparisons of an average value, check whether the composition changed (extreme cases entering/leaving), because the "improved average" may be just outlier churn — Cairo, The Truthful Art, 2016

**Anti-patterns:** An "average order value" KPI jumping 40% because one R$20M order came in; a "mean" label when the number is a median (or vice versa); side-by-side boxplots hiding that one group is bimodal; comparing mean response time across months with a different case mix; publishing an r/regression without ever having looked at the scatterplot (Anscombe's quartet).

## Correlation, causation, and annotation discipline
Cairo devotes the "misleading patterns" chapter of How Charts Lie to correlations the chart induces but the data don't support: two series that only share a temporal trend, dual axes calibrated to coincide, aggregates that don't hold for individuals. Vigen (Spurious Correlations, 2015) showed r>0.9 between absurd pairs (per-capita cheese × deaths by bedsheet entanglement) — a common trend + mass search fabricate correlation. The annotation layer (title, callout, tooltip) is where the causal lie happens even with a correct chart: the drawing shows association, the text asserts cause.

**Rules:**
- Write causal annotations only with causal support (an experiment, a quasi-experiment, a documented mechanism); otherwise use "associated with" / "coincides with", because the text over the chart is read as the conclusion — Cairo, How Charts Lie, 2019
- When showing a scatterplot with a trend line, display n and R² alongside, because a trend line without the strength of the relationship suggests determinism — Cairo, The Truthful Art, 2016
- Be suspicious of a correlation between two time series that merely grow together: detrend or compare changes (Δ%), because a common trend produces a spuriously high r — Vigen, Spurious Correlations, 2015; Cairo, 2019
- Don't use a dual Y axis to "prove" that two metrics move together; an independent scale lets you fabricate any synchrony — use a base-100 index on the same axis or separate panels — Few, Dual-Scaled Axes in Graphs, 2008
- Don't transfer aggregate correlation (state, county, segment) to individuals in the annotation — ecological fallacy: the relationship can reverse at the individual level — Robinson, ASR 15, 1950
- Annotate known confounders when the pattern invites a causal reading (e.g., "volume and rate fall together because the segment mix changed"), because the designer's silence endorses the naive reading — Cairo, How Charts Lie, 2019
- Before publishing a correlation insight, actively look for the counterexample (another period, another segment) — cherry-picking a correlation is the bivariate version of cherry-picking a window — Cairo, The Truthful Art, 2016

**Anti-patterns:** A title "campaign X increased conversion" over a series with no control group; a dual axis with revenue and number of signups "glued together" by a scale choice; a scatterplot of 8 points with a thick trend line and no R²; a state-level insight ("states with more orders have a higher ticket") applied to individual customers; two cumulative series compared — cumulative always correlates.

## Sources
- Alberto Cairo, The Truthful Art, 2016
- Alberto Cairo, How Charts Lie, 2019
- Jessica Hullman, Why Authors Don't Visualize Uncertainty (IEEE TVCG 26(1)), 2020
- Edward Tufte, The Visual Display of Quantitative Information, 1983
- Darrell Huff, How to Lie with Statistics, 1954
- Stephen Few, Show Me the Numbers, 2004
- Stephen Few, Dual-Scaled Axes in Graphs, Perceptual Edge, 2008
- Stephen Few, Information Dashboard Design, 2006
- Bickel, Hammel & O'Connell, Sex Bias in Graduate Admissions: Data from Berkeley (Science 187), 1975
- Kievit, Frankenhuis, Waldorp & Borsboom, Simpson's paradox in psychological science, 2013
- W. S. Robinson, Ecological Correlations and the Behavior of Individuals, 1950
- Claus Wilke, Fundamentals of Data Visualization, 2019
- IBCS — International Business Communication Standards 1.2 (Hichert & Faisst), 2021
- Datawrapper Academy, articles on missing values and confidence intervals, 2021
- Belia, Fidler, Williams & Cumming, Researchers Misunderstand Confidence Intervals and Standard Error Bars, 2005
- Cumming & Finch, Inference by Eye: Confidence Intervals and How to Read Pictures of Data, 2005
- Correll & Gleicher, Error Bars Considered Harmful, IEEE TVCG 20(12), 2014
- Newman & Scholl, Bar graphs depicting averages are perceptually misinterpreted: the within-the-bar bias, 2012
- Hofman, Goldstein & Hullman, How Visualizing Inferential Uncertainty Can Mislead Readers, CHI, 2020
- Hullman, Resnick & Adar, Hypothetical Outcome Plots Outperform Error Bars and Violin Plots, PLOS ONE 10(11), 2015
- Kay, Kola, Hullman & Munson, When(ish) Is My Bus?, CHI, 2016
- Fernandes, Walls, Munson, Hullman & Kay, Uncertainty Displays Using Quantile Dotplots or CDFs Improve Transit Decision-Making, CHI, 2018
- Gigerenzer & Hoffrage, How to Improve Bayesian Reasoning Without Instruction, 1995
- Ruginski et al., Non-expert interpretations of hurricane forecast uncertainty visualizations, 2016
- Padilla, Ruginski & Creem-Regehr, Effects of ensemble and summary displays, 2017
- Kale, Nguyen, Kay & Hullman, HOPs Help Untrained Observers Judge Trends in Ambiguous Data, 2019
- Robertson, Fernandez, Fisher, Lee & Stasko, Effectiveness of Animation in Trend Visualization, IEEE TVCG 14(6), 2008
- W3C WAI, WCAG 2.2 Success Criterion 2.2.2 Pause, Stop, Hide (Level A)
- Bank of England, Inflation Report fan charts, since 1996
- David Spiegelhalter, Funnel plots for comparing institutional performance, Statistics in Medicine 24, 2005
- Howard Wainer, The Most Dangerous Equation, American Scientist 95(3), 2007
- Tversky & Kahneman, Belief in the Law of Small Numbers, 1971; Kahneman, Thinking, Fast and Slow, 2011
- Francis Anscombe, Graphs in Statistical Analysis, The American Statistician 27(1), 1973
- Matejka & Fitzmaurice, Same Stats, Different Graphs (Datasaurus Dozen), CHI, 2017
- Tyler Vigen, Spurious Correlations, 2015
- Cleveland, banking to 45°, 1988
