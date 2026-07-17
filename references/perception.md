# Applied visual perception

> Reference for the dataviz-design skill. Load when: choosing a chart type/encoding, defining a palette or highlight, deciding the number of series/legends, tuning the aspect ratio of line charts, or auditing an existing dashboard/table/KPI for perceptual error.

## Encoding hierarchy (Cleveland–McGill 1984; Heer–Bostock 2010)

Cleveland and McGill (JASA 79(387), 1984) experimentally measured human error in decoding values from graphical encodings and ranked the channels by accuracy, from most to least faithful: **position on a common scale > position on nonaligned scales > length > angle/slope > area > volume > color/saturation**. In the original paper, length, direction, and angle were grouped at a single level (as were volume/curvature and shading/saturation, in pairs); later refinements (Mackinlay 1986; Munzner 2014) separate length above angle — Heer and Bostock's crowdsourced replication (CHI 2010, via Mechanical Turk) confirmed the broad ranking and extended it to rectangle/treemap areas, but did not order length vs. angle. This is the empirical basis for choosing a chart type: the same question answered by position yields roughly 2× less error than by angle or area.

**Rules:**
- Use a bar or dot plot (position on a common scale) instead of a pie/donut chart to compare magnitudes across categories, because in the position–angle experiment position judgments were about 2× more accurate than angle judgments — Cleveland & McGill 1984
- Put the series you're comparing on the same aligned axis; panels with nonaligned scales drop accuracy one level in the hierarchy (nonaligned position < common-scale position) — Cleveland & McGill 1984; Munzner 2014
- In a stacked bar, only the segment anchored to the baseline is read by position; the rest become length judgments (~2× more error). Put the most important series at the base, or switch to grouped bars/small multiples if the task is comparing the inner segments — Cleveland & McGill 1984
- Don't ask readers to read values by area (bubbles, treemap): area sits below length and position in the hierarchy; use area only for an at-a-glance sense of proportion and add a numeric label when the value matters — Cleveland & McGill 1984; Heer & Bostock 2010
- If area is unavoidable, what degrades reading isn't circle vs. rectangle (average accuracy is similar) but the aspect ratio: over the range tested (~0.67–1.5), squares (ratio ~1) were the worst; use rectangles of moderate proportion and label the value — Heer & Bostock 2010
- Drop decorative 3D (bars, pies with perspective): volume is the second-to-last level of the hierarchy, and perspective adds systematic error with no information — Cleveland & McGill 1984; Few 2012
- For change between two periods, use a slopegraph or line chart (direction/position) instead of two side-by-side pie charts, because comparing angles across charts is the worst task in the hierarchy — Cleveland & McGill 1984; Tufte 1983
- When auditing a screen: identify the user's primary comparison and check whether it's encoded in position; if it's in color/area/angle, there's a redesign with lower perceptual error — Cleveland & McGill 1984; Munzner 2014

**Anti-patterns:** a pie chart with more than 5 slices, or with similarly sized slices and no numeric label; a thin-ring donut (kills even the angle; only arc length is left, worse still); 3D bars/pies with perspective; comparing scatter bubbles to pull out exact values; a stacked bar with the series the user compares most in the middle of the stack; two side-by-side pie charts to show change over time.

## Preattentive attributes and pop-out (Healey; Treisman)

Certain visual properties are detected in under ~200–250 ms, before eye movement and without a serial scan of the scene — hence "preattentive." Healey catalogs ~16 cues (hue, luminance, orientation, size, length, curvature, closure, density, flicker, motion, 3D depth, etc.). A target defined by ONE feature "pops out" regardless of the number of distractors; a target defined by the conjunction of two features requires a serial search, with time growing linearly in the number of elements (Treisman & Gelade 1980). This is the mechanism behind every effective highlight on a dashboard.

**Rules:**
- Highlight the message element with a single strong channel (e.g., one series in saturated color, the rest grayed out), because a single-feature target is detected in <250 ms regardless of the number of distractors — Healey & Enns 2012; Treisman & Gelade 1980
- Never define the critical category by the conjunction of two channels (e.g., "the red AND square points"): conjunction search is serial and time grows with the number of marks — Treisman & Gelade 1980
- Use at most one salient highlight per chart (and very few per screen): with several salient items competing, the pop-out disappears — "if everything is highlighted, nothing is" — Few 2006; Knaflic 2015
- Prefer hue over shape to separate classes in a dense scatterplot, because color sustains fast detection with more distractors than shape does — Healey, Booth & Enns 1996; Ware 2012
- Reserve red/high saturation exclusively for exceptions and alerts; the normal state stays in neutrals, or the alarm channel loses its preattentive effect — Few 2006 (Information Dashboard Design)
- Use flicker/animation only for events that demand immediate action: motion is the most intrusive cue on Healey's list and cannot be voluntarily ignored — Healey & Enns 2012; Ware 2012
- For rapid-estimation tasks ("what fraction of the cells are bad?"), encode the target class in hue or orientation: preattentive numerical estimation works in these two channels and they don't interfere with each other — Healey, Booth & Enns 1996

**Anti-patterns:** a traffic-light heatmap coloring every cell (nothing stands out); several red badges/icons competing on the same screen; highlighting different elements with different channels (one by color, another by size, another by bold) at the same time; animation/pulse on a metric that requires no action; a visual filter that forces you to find "the big red ones" in a cloud of small red and big blue marks (conjunction).

## Gestalt laws applied to charts and layout

The Gestalt laws describe how the eye groups marks into units: proximity, similarity, connection, closure, continuity, common region, and figure–ground. Palmer and Rock (1994) showed that connection (uniform connectedness) dominates proximity and similarity — a line linking points forms a stronger group than any color does. On a dashboard, Gestalt decides what the user reads as "together" before any legend or title; violate it and you get false groupings that no text can fix.

**Rules:**
- In grouped bars, make the space between groups larger than the space between bars within a group (small or zero intra-group gap; inter-group ≥ one bar width), because proximity defines what reads as a unit — Ware 2012; Few 2012
- Only connect points with a line when the axis has a real order (time, dose, sequence); a line over nominal categories fabricates a trend, since connection is the strongest grouping cue — Palmer & Rock 1994; Ware 2012; Wilke 2019
- Remove borders, frames, and boxes around charts and cards: closure lets the eye perceive the whole region without an outline; delimit with white space — Few 2012; Tufte 1983
- Keep the same color for the same entity across every chart on the screen (the "West" series blue throughout the dashboard), because similarity is what links the views, and a swapped color breaks the reading — Ware 2012; IBCS (Hichert & Faisst) 2017
- Treat data as figure and structure as ground: gridlines and axes thin and light gray, behind the marks; data in darker, more saturated colors — Tufte 1983 (layering/data-ink); Few 2012
- Use a shaded area (common region) to mark reference bands (target, recession, campaign window): enclosure groups more strongly than proximity and doesn't compete with the series — Ware 2012
- Sort bars by value when the category is nominal (not alphabetical): the continuity of the ordered edge gives the ranking for free and reveals the shape of the distribution — Few 2012; Wilke 2019
- Place the title/label right next to what it describes (label at the end of the line, title directly above the chart it belongs to), because proximity ties text to mark effortlessly — Ware 2012; Knaflic 2015

**Anti-patterns:** a line connecting nominal categories (states, products); each KPI/chart in its own bordered box, stacking frames; the same entity in different colors on neighboring charts; black gridlines in front of the data; a legend placed far away or in a different order from the visual order of the series; nominal bars in alphabetical order when the task is ranking.

## Banking to 45° and the aspect ratio of line charts

Perception of rate of change in line charts depends on the orientation of the segments, and discrimination between slopes is maximal when they sit around 45°. Cleveland proposed choosing the chart's aspect ratio so that the mean absolute orientation of the segments is 45° ("banking to 45°"). Heer and Agrawala (InfoVis 2006) automated and extended the technique with multi-scale banking (spectral analysis to find trends at several frequencies); Talbot et al. (2012) refined it, showing that the optimum depends on the ratio between the slopes being compared. Practical upshot: the shape of the dashboard card can't dictate the shape of the line on its own.

**Rules:**
- When the task is comparing rates of change, tune the aspect ratio so the mean absolute slope of the segments lands near 45°, because that's where orientation discrimination is maximal — Cleveland, McGill & McGill 1988; Cleveland 1993
- Don't let the dashboard grid dictate the aspect ratio: the same series looks "stable" stretched to full width and "volatile" squeezed into a narrow card; set the height from the data — Cleveland 1993; Heer & Agrawala 2006
- A series with structure at multiple scales (multi-year trend + monthly seasonality): show two views with different bankings (a flattened long view + a short window) instead of a single one that hides one of the scales — Heer & Agrawala 2006 (multi-scale banking)
- In small multiples of line charts, fix the same aspect ratio and the same y scale across all panels, or comparing slopes across panels becomes a geometric lie — Cleveland 1993; Wilke 2019
- Keep sparklines short and wide (not tall and narrow): vertical compression pulls the segments into the discriminable range of orientation — Tufte 2006 (Beautiful Evidence); Heer & Agrawala 2006
- Avoid charts where the relevant segments run nearly vertical (>~80°): small differences in rate become indistinguishable; widen the chart or use a log scale — Talbot, Gerth & Hanrahan 2012; Cleveland 1993
- Banking optimizes discrimination, not narrative: don't pick an aspect ratio to dramatize or soften a trend in communication material — flag the choice if it's atypical — Cairo 2013 (The Functional Art)

**Anti-patterns:** a full-width line chart (12 columns) for a series that moves 2%, flattened into a straight ruler; a square grid card cramming 5 years of a series into vertical spikes; small multiples with a differently auto-scaled y axis in each panel; a tall, narrow sparkline inside a table cell; picking a "dramatic" aspect ratio to inflate a trend in a presentation.

## Working memory and the series limit (Miller 1956; Cowan 2001)

Miller (1956) popularized 7±2 chunks, but Cowan (2001, BBS) showed that, once you control for rehearsal and chunking, the real capacity of working memory is ~4±1 chunks. Any chart reading that requires holding a mapping (color→series name, a value from another screen, the prior state of a filter) consumes those ~4 slots. The design principle that follows is "eyes beat memory" (Munzner): replace memory load with direct perception — juxtaposition, direct labeling, comparison in the same view.

**Rules:**
- Cap fully colored lines in a line chart at ~4; beyond that, highlight 1–2 and demote the rest to gray, or break into small multiples, because working memory holds ~4±1 mappings — Cowan 2001; Knaflic 2015; Datawrapper (Muth)
- Label the series directly at the end of the line (feasible up to ~4–6 series) instead of a separate legend, because a legend forces you to hold the color→name mapping in memory and triggers back-and-forth eye movement — Few 2012; Tufte 1983; Datawrapper (Muth)
- Put the quantities you're comparing in the same view, side by side; never require recalling a number from another tab, screen, or filter state ("eyes beat memory") — Munzner 2014; Ware 2012
- Don't use a tooltip as a substitute for a label when values need to be compared with one another: only one tooltip is visible at a time and the rest of the values go to memory — Few 2006; Munzner 2014
- Monitoring dashboards should fit on one screen without scrolling: what leaves the viewport leaves working memory and breaks the at-a-glance overview — Few 2006 (Information Dashboard Design)
- Prefer juxtaposition (small multiples) over toggling states (a dropdown that swaps the chart, animation between periods), because comparing alternating states relies on memory, not perception — Munzner 2014; Tufte 1990
- A categorical legend with more than ~6–7 items: fold the tail into "Other" or change the design (a sorted table, small multiples), because discriminating and remembering more hues than that fails — Ware 2012; Datawrapper (Muth)
- In tables whose task is comparing rows, avoid pagination that separates the rows being compared; sort/pin so the comparable items are on screen simultaneously — Few 2012; Munzner 2014

**Anti-patterns:** a spaghetti chart of 10+ lines with an alphabetical legend beneath it; a key comparison hidden behind a toggle/tab (the user has to memorize state A to read B); a KPI carousel/slider that cycles on its own; a legend with 12 items for a chart with 12 colors; essential values reachable only by hover, one at a time.

## Weber–Fechner, Stevens's law, and the perception of area / log scales

Weber: the just-noticeable difference (JND) is proportional to the base magnitude — small differences on large values vanish. Fechner: sensation grows with the log of the stimulus. Stevens (1957) refined this with the power law S = k·I^n: length has an exponent of ~1.0 (faithful), area ~0.7–0.87 (underestimated — Flannery measured 0.87 for graduated circles), volume ~0.6, and brightness ~0.33. A twofold consequence: large areas always look smaller than they are, and log scales match perception when the question is multiplicative.

**Rules:**
- Scale bubbles by AREA, never by radius: doubling the radius quadruples the area, which reads as "much bigger" — and even with correct area, label important values, because area is underestimated (exponent ~0.7–0.87 < 1) — Stevens 1957; Flannery 1971; Tufte 1983; Wilke 2019
- On proportional-symbol maps, apply the Flannery correction (perceptual exponent 0.87 for circles → radius compensation of ~0.57) or include a legend with 3 anchor circles at round values — Flannery 1971 (cartography)
- Use a log scale when the data spans 2+ orders of magnitude or when the question is about ratio/percentage growth, because on a log scale equal distances = equal ratios, aligned with Weber–Fechner — Fechner 1860; Wilke 2019
- Signal the log scale explicitly (in the subtitle/axis) and label ticks with absolute values (1, 10, 100, 1k), because readers assume a linear axis by default — Wilke 2019; Datawrapper
- A small variation on a large base is invisible (Weber): for a series that swings a few % at a high level, also show the variation itself (Δ, %, or a base-100 index) instead of relying on axis zoom — Few 2012; IBCS 2017
- Don't ask for exact correlation to be read by eye from a scatterplot: the JND follows Weber's law (fine near r=±1, coarse near 0) and perceived magnitude follows Fechner, so weak-correlation clouds are nearly indistinguishable from one another and from noise; expose the coefficient and/or a fit line when the value matters — Rensink & Baldridge 2010
- Don't encode in area or color intensity any differences that require fine reading: the JND of saturation/luminance is coarse; pair it with the numeric column (table + embedded bar) — Munzner 2014; Few 2012
- Bars require an axis starting at zero because length encodes ratio from the baseline; lines may truncate the axis (position encodes), but the truncation must be signaled — Few 2012; Cairo 2013; IBCS 2017

**Anti-patterns:** bubbles scaled by radius (a 2× value becomes 4× the area); a pie or treemap for differences of a few percentage points; a log scale with no notice, read as linear; a heatmap/gradient as the only means of comparing close values; a bar with a truncated axis starting at 80 to inflate a difference; comparing graduated map circles with no anchor legend; claiming "strong correlation" from the look of the cloud without showing the coefficient.

## Munzner's channels: magnitude vs. identity, expressiveness, and separability

Munzner (2014, ch. 5) splits visual channels into magnitude (how much: position on a common scale > nonaligned position > length > angle/slope > area > 3D depth > luminance > saturation > curvature > volume) and identity (what/where: spatial region > hue > motion > shape). Two principles govern the pairing: expressiveness — the encoding must express all and only the information in the data (ordered→ordered channel; categorical→categorical channel) — and effectiveness — the attribute's importance must match the channel's effectiveness. Add to that separability: pairs of channels can be separable (position+hue) or integral (width×height; red-green×yellow-blue), which fuse perceptually.

**Rules:**
- A quantitative/ordered attribute goes in a magnitude channel (position, length, luminance); never in pure hue, which the eye doesn't order — it violates expressiveness — Munzner 2014; Mackinlay 1986
- A categorical attribute goes in an identity channel (hue, shape, spatial region); never in a luminance/saturation gradient, which implies an order that isn't there — Munzner 2014
- Put the task's most important attribute on the two position axes; the second in color; the third in size or shape — attribute importance ↔ channel effectiveness — Munzner 2014; Mackinlay 1986
- Forbid the rainbow for continuous data: hue isn't perceptually ordered, and it manufactures artificial bands and boundaries; use a monotonic-luminance sequential scale (viridis, ColorBrewer) — Borland & Taylor 2007; Munzner 2014
- Avoid integral pairs for independent attributes: the width×height of rectangles and certain color pairs fuse into a single impression; prefer separable pairs like position+hue — Ware 2012; Munzner 2014
- Size interferes with reading color: if hue encodes category in a scatterplot, make the marks large enough (tiny points render the color illegible) — Munzner 2014; Stone 2006
- Shape as a channel only for a few categories (~≤6) in a sparse chart; at high density, shape turns to noise — Munzner 2014; Ware 2012
- Intentional double redundancy (position+color, color+label) is good for accessibility; decorative triple redundancy just inflates noise — Ware 2012

**Anti-patterns:** a rainbow (jet) choropleth/heatmap for a continuous variable; a light-blue→dark-blue gradient for nominal categories; a different hue for each month of a time series; a bubble chart where size and color encode the same metric to no purpose; a key metric relegated to saturation while position encodes something trivial; an encoding that isn't in the data (a visual order implying a false ranking).

## Luminance, contrast, and functional color (a companion to the channels)

The visual system processes luminance and chromaticity through distinct pathways: form, fine detail, and text are carried almost entirely by luminance contrast — hue alone won't sustain legibility (Ware). Simultaneous contrast (Albers) makes the same color look different depending on the neighboring background, undermining value reading by color. ~8% of men have a color vision deficiency (mostly red-green). These three physiological constraints set the palette rules for any dashboard.

**Rules:**
- Make sure text, thin lines, and borders work by luminance contrast, not hue alone: test the screen converted to grayscale ("get it right in black and white") — Stone 2005; Ware 2012
- Sequential palettes must vary luminance monotonically from light to dark; the test: in grayscale, the order of the values must hold — Harrower & Brewer 2003 (ColorBrewer); Munzner 2014
- Never use red×green as the sole distinction (affects ~8% of men); prefer blue×orange or add redundancy with position, shape, or label — Ware 2012; Datawrapper (Muth)
- Make gray the dominant color: context, comparisons, and secondary series in gray; ONE highlight color held back for the message — Knaflic 2015
- Don't ask for value reading by cell color when neighboring backgrounds vary a lot (simultaneous contrast warps the perceived tone); thin white borders between cells mitigate it — Albers 1963; Ware 2012
- Saturated data on a light, desaturated background; never a saturated/dark background behind the data — "small dots of intense color on muted fields" — Tufte 1990 (citing Imhof); Few 2006
- Limit categorical hues to ~5–7 per screen; beyond that, color discrimination and naming degrade — Ware 2012; Datawrapper (Muth)
- Respect the domain's semantic color conventions (red=negative/alert, never inverted) and keep them constant across the entire product — Few 2006; IBCS 2017

**Anti-patterns:** light-gray text on a cream background with no luminance contrast; a good/bad signal encoded only in green/red; a categorical palette with 10–12 hues fighting for attention; a red-green diverging heatmap; a saturated brand color as the background of a KPI card with numbers on top; a sequential scale that varies only hue while holding the same luminance (illegible in grayscale).

## Sources

- William S. Cleveland & Robert McGill, Graphical Perception: Theory, Experimentation, and Application to the Development of Graphical Methods, JASA 79(387), 1984
- William S. Cleveland, Marylyn E. McGill & Robert McGill, The Shape Parameter of a Two-Variable Graph, JASA, 1988
- William S. Cleveland, Visualizing Data, 1993
- Jeffrey Heer & Michael Bostock, Crowdsourcing Graphical Perception, CHI 2010
- Jeffrey Heer & Maneesh Agrawala, Multi-Scale Banking to 45 Degrees, IEEE InfoVis/TVCG, 2006
- Justin Talbot, John Gerth & Pat Hanrahan, An Empirical Model of Slope Ratio Comparisons, IEEE InfoVis, 2012
- Christopher G. Healey & James T. Enns, Attention and Visual Memory in Visualization and Computer Graphics, IEEE TVCG, 2012
- Christopher G. Healey, Kellogg S. Booth & James T. Enns, High-Speed Visual Estimation Using Preattentive Processing, ACM ToCHI, 1996
- Anne Treisman & Garry Gelade, A Feature-Integration Theory of Attention, Cognitive Psychology, 1980
- Stephen E. Palmer & Irvin Rock, Rethinking Perceptual Organization: The Role of Uniform Connectedness, Psychonomic Bulletin & Review, 1994
- George A. Miller, The Magical Number Seven, Plus or Minus Two, Psychological Review, 1956
- Nelson Cowan, The Magical Number 4 in Short-Term Memory, Behavioral and Brain Sciences, 2001
- Gustav Fechner, Elemente der Psychophysik, 1860
- S. S. Stevens, On the Psychophysical Law, Psychological Review, 1957
- James J. Flannery, The Relative Effectiveness of Some Common Graduated Point Symbols…, The Canadian Cartographer, 1971
- Ronald A. Rensink & Gideon Baldridge, The Perception of Correlation in Scatterplots, Computer Graphics Forum 29(3) (EuroVis), 2010
- Tamara Munzner, Visualization Analysis and Design, 2014 (ch. 5, Marks and Channels)
- Jock Mackinlay, Automating the Design of Graphical Presentations, ACM ToG, 1986
- David Borland & Russell M. Taylor II, Rainbow Color Map (Still) Considered Harmful, IEEE CG&A, 2007
- Colin Ware, Information Visualization: Perception for Design (3rd ed.), 2012
- Maureen Stone, A Field Guide to Digital Color, 2003/2006; Get It Right in Black and White (essay), 2005
- Mark Harrower & Cynthia Brewer, ColorBrewer.org, The Cartographic Journal, 2003
- Josef Albers, Interaction of Color, 1963
- Edward Tufte, The Visual Display of Quantitative Information, 1983; Envisioning Information, 1990; Beautiful Evidence, 2006
- Stephen Few, Information Dashboard Design, 2006; Show Me the Numbers (2nd ed.), 2012
- Cole Nussbaumer Knaflic, Storytelling with Data, 2015
- Claus O. Wilke, Fundamentals of Data Visualization, 2019
- Alberto Cairo, The Functional Art, 2013
- IBCS — International Business Communication Standards (Hichert & Faisst), 2017
- Lisa Charlotte Muth, Datawrapper blog (direct labeling; how many colors), 2020–2022
