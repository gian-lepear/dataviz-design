# Color in dataviz

> Reference for the dataviz-design skill. Load when: choosing a palette or color ramp for a chart/map/heatmap/KPI, reviewing the colors of an existing dashboard, adapting dataviz for dark mode, or checking the accessibility (color vision deficiency/contrast) of an analytical screen.

## Perceptual fundamentals: luminance rules, pick color in a perceptual space (CIELAB/HCL)

RGB/HSL are machine spaces: equal steps in code are not equal steps to the eye (100% green looks far lighter than 100% blue). Perceptual spaces (CIELAB, HCL/LCh, CAM02-UCS) separate luminance, chroma, and hue in a way that tracks human perception. In quantitative data, it is LUMINANCE that carries magnitude — hue is bad for order ("which is bigger: green or purple?" has no answer) but great for category identity.

**Rules:**
- Encode magnitude by varying lightness (light→dark), not by varying hue, because luminance has a natural perceptual order and hue does not — Munzner, Visualization Analysis and Design, 2014; Ware, Information Visualization, 2013
- Build and tune ramps in HCL/CIELAB (not in interpolated RGB/HSL), because RGB interpolation produces dead zones and false brightness highlights in the middle of the ramp — Zeileis, Hornik & Murrell, "Escaping RGBland", Computational Statistics & Data Analysis, 2009
- Test every palette by converting the screen to grayscale ("get it right in black and white"): if the classes of a sequential ramp aren't distinguishable in gray, the ramp is wrong — Maureen Stone, "Get It Right in Black and White", 2005
- Equalize the visual weight of categorical colors: desaturate the light/vivid ones and saturate the dark ones, because a 100%-saturated, 100%-bright color next to a muted one creates accidental hierarchy — Muth, "How to pick more beautiful colors", Datawrapper, 2020
- Vary lightness across categorical colors too (not just hue), because that keeps categories distinguishable in B&W print and for colorblind readers — Muth, Datawrapper, 2020; Brewer, 1994
- Never use text or thin marks in colors isoluminant with the background (e.g., pure yellow on white), because the edges the visual system detects rely on luminance contrast, not hue — Ware, 2013

**Anti-patterns:** generating a palette by rotating hue in HSL with S and L fixed ("hue rotation") — uneven perceived brightness; a quantitative ramp that varies only hue (rainbow) at constant luminance — magnitude is illegible; picking colors in Figma's RGB picker without checking in gray — accidental hierarchy invisible to the author; treating HSL "lightness" as perceived luminance (yellow hsl(60,100%,50%) looks far lighter than blue hsl(240,100%,50%)).

## The three scale types (ColorBrewer): sequential, diverging, qualitative — and classed vs unclassed

Cynthia Brewer systematized the taxonomy that governs every scale choice: SEQUENTIAL (ordered lightness, for magnitudes), DIVERGING (two sequential ramps joined by a neutral midpoint, for deviations from a central point), and QUALITATIVE (distinct hues with no order, for categories). ColorBrewer.org (Harrower & Brewer 2003) offers tested schemes with safety filters for color vision deficiency and print: sequential from 3–9 classes, diverging from 3–11, qualitative from 3–12. Getting the scale type wrong is the single worst color error in a dashboard: it communicates a structure the data doesn't have.

**Rules:**
- Use diverging only when a meaningful midpoint exists — zero (+/- growth), 50% (binary election), mean/median, target, or agreed threshold; with no real midpoint, use sequential — Muth, "Diverging vs. sequential color scales", Datawrapper, 2021; Brewer, 1994
- Prefer sequential when you want legend-free reading, because "darker = more" is intuitive; diverging ALWAYS requires a color key, otherwise the reader doesn't know which extreme is which — Muth, Datawrapper, 2021
- Choose diverging when the story is the TWO extremes or when you need more resolution: each half of a diverging scale covers half the range, so small differences (e.g., 16 pp) become ~2× more visible — Muth, Datawrapper, 2021
- Never use a qualitative scale (distinct hues) for ordered or continuous data, because the reader can't rank hues; and never use a sequential ramp for nominal categories, because it implies an order that isn't there — Brewer, "Color Use Guidelines for Mapping and Visualization", 1994; Wilke, Fundamentals of Data Visualization, 2019, ch. 4
- In choropleths, use a CLASSED scale (3–7 classes) when the reader needs to read values and compare regions precisely; use unclassed (continuous gradient) when the goal is the overall pattern/nuance — Muth, "Classed vs. unclassed color scales", Datawrapper, 2021; Harrower & Brewer, 2003
- In a diverging scale, make the neutral midpoint light (white/gray/pale yellow) and the ends dark and of different hues (e.g., blue↔red, purple↔green), because distance from the center must be read by lightness on both sides — Brewer, 1994; Moreland, "Diverging Color Maps for Scientific Visualization", 2009
- Start from ready-made ColorBrewer/CARTOColors schemes with the "colorblind safe" filter on instead of inventing a ramp, because each scheme was empirically tested for discriminability between classes — Harrower & Brewer, The Cartographic Journal, 2003

**Anti-patterns:** diverging "because it looks pretty" on data with no midpoint (e.g., revenue 0→max in red-blue) — invents a threshold that doesn't exist; multi-hue sequential with the most-saturated color in the middle — the eye reads the middle as a highlight; 12 classes in a choropleth — above ~7 the reader can't pair map↔legend; green→red as a default diverging scale (fails for ~8% of men; use blue↔red or purple↔green); a nominal category painted with a ramp of blues — the reader hunts for an order that isn't there.

## Perceptually uniform scales and the death of the rainbow (viridis, cividis, jet)

A perceptually uniform ramp = equal steps in the data produce equal steps in perceived difference, with monotonic luminance. Rainbow/jet violates this: it creates artificial bands (yellow/cyan jump out), hides variation across long green zones, and has no order — Borland & Taylor formalized the critique in 2007. Viridis (van der Walt & Smith, SciPy 2015) was optimized in a perceptual space (CAM02-UCS) with monotonically increasing luminance and became matplotlib's default; cividis (2018) is the variant re-optimized for deuteranopia. This isn't aesthetics: in a test with physicians, identification of arterial-risk regions rose from ~39% to ~91% (Borkin et al., 2011) — but that jump combines TWO changes, 2D+diverging colormap against 3D+rainbow, not the colormap alone; controlling for geometry, the perceptual colormap still reduced diagnostic errors versus rainbow.

**Rules:**
- Use viridis/inferno/mako (or your own ramp with verified monotonic luminance) for heatmaps and continuous surfaces, because monotonic luminance preserves the data's order under any condition, including B&W and CVD — van der Walt & Smith, SciPy, 2015
- Ban jet/rainbow from any continuous data, because it introduces false thresholds where there are none (yellow/cyan bands) and masks real variation in the zones of uniform hue — Borland & Taylor, "Rainbow Color Map (Still) Considered Harmful", IEEE CG&A, 2007
- If the audience includes colorblind readers and the map is dense (heatmap, microscopy, weather map), prefer cividis or viridis over red-green ramps, because they were optimized to hold uniformity under deuteranopia — Nuñez, Anderton & Renslow, PLOS ONE, 2018
- When building a brand ramp (e.g., white→dark blue), validate it in code by checking monotonic luminance (formula in the "Executable color verification" section) or with an equivalent uniformity tool (Kovesi/colorcet, Chroma.js "lightness correction"), because ramps drawn by eye almost always have luminance plateaus — Kovesi, "Good Colour Maps: How to Design Them", 2015
- In a multi-hue sequential ramp, change hue AND lightness together (e.g., pale yellow→dark blue), because multi-hue with monotonic luminance yields more discriminable levels than single-hue without losing order — Muth, Datawrapper, 2021; viridis, 2015
- If you need "rainbow" by domain convention (meteorology), use turbo or Kovesi's corrected rainbow instead of jet, because they are luminance-controlled versions that reduce the false bands — Mikhailov (Google AI), Turbo, 2019; Kovesi, 2015

**Anti-patterns:** a heatmap with jet "because it's Excel/matlab's old default" — false bands turn into false insight; a brand ramp interpolated in RGB between two institutional colors without checking luminance — the middle of the ramp "washes out"; a saturated-light→saturated-dark gradient passing through gray — the central gray reads as "no data"; the same continuous ramp for data with nulls and no color reserved for "no data" (null inherits the color of the minimum).

## Beautiful, harmonious palettes in practice (the Lisa Charlotte Muth method)

Muth (Datawrapper) turned "good taste" into auditable HSB rules: software defaults land on pure hues and 100%-saturated combinations that look amateurish. The method: don't wander around the whole color wheel, avoid pure hues, deliberately unbalance saturation/brightness, and steal shamelessly from good palettes (NYT, FT, Pudding). Beauty here isn't vanity: harmonious palettes reduce fatigue and increase trust in the piece.

**Rules:**
- Don't dance around the color wheel: build the palette from neighbors + 1 complementary (e.g., a warm yellow/orange/red family + one blue), because random hue jumps look like tool defaults — Muth, "How to pick more beautiful colors", Datawrapper, 2020
- Stay at least 5–10° away from the pure hues (60°, 120°, 180°, 240°, 300°, 0/360°) when the color is saturated, because a pure hue on screen screams "software default" — Muth, Datawrapper, 2020
- Avoid pure forest green (~120°): pull green toward yellow or toward blue (petrol/teal), because pure greens dominate the scene and clash with reds for colorblind readers — Muth, Datawrapper, 2020
- Never combine 100% saturation with 100% brightness in the same color; desaturate light colors and saturate dark colors, because that equalizes visual weight across series — Muth, Datawrapper, 2020
- Copy palettes from those who do it well: eyedrop colors from award-winning visualizations (NYT, FT, SPIEGEL) instead of generating from scratch, because editorial palettes have already solved harmony + legibility in production — Muth, Datawrapper, 2020
- Set the palette in the real context (on the app's real background, at the marks' real size), because the same color changes appearance on a tinted vs white background and in a 2px line vs an area — Few, "Practical Rules for Using Color in Charts", rule 1 (consistent background), 2008
- Use soft/natural colors for the body of the data and reserve bright/dark colors for emphasis only, because screens consulted all day long tire the eye with high saturation — Few, Perceptual Edge, 2008; Few, Show Me the Numbers, 2004

**Anti-patterns:** accepting the default Excel/Plotly/ECharts palette without editing — the visual signature of "nobody designed this"; pure red #FF0000 / green #00FF00 / blue #0000FF in series — pure 100/100 hues vibrate on screen; a 6-color palette all at the same saturation and lightness ("pastel rainbow") — no series has any hierarchy; testing the palette on a white Figma board and shipping on a tinted/dark background without revalidating contrast.

## Accessibility for color vision deficiency (CVD): safe pairs, redundancy, and simulation

~8% of men and ~0.5% of women have red-green color vision deficiency (deuteranomaly, ~5% of men, is the most common; deuteranopia and protanopia ~1% each) — in a B2B dashboard used by 50 people, statistically there's a CVD user. The structural rule: color can never be the ONLY channel that encodes a distinction. The Okabe-Ito qualitative palette (Color Universal Design, 2002/2008; popularized by Wong in Nature Methods, 2011) is the safe categorical gold standard.

**Rules:**
- Never make red and green the only differentiator (traffic light, positive/negative); use blue×red or blue×orange, because for red-green-blind readers the blue+orange/red pair stays distinguishable (it becomes blue+olive or blue+orange) — Muth, "What to consider when visualizing data for colorblind readers", Datawrapper, 2018
- Adopt blue as the product's anchor color when possible, because it's the hue perceived most similarly by trichromats, deuteranopes, protanopes, and tritanopes — Muth, Datawrapper, 2018
- Make the encoding redundant: beyond color, use position, marker shape, line pattern (dashed), icon (▲/▼), or direct label, because a distinction that survives without color survives any CVD and B&W print — Few, 2008; Muth, 2018; WCAG 2.1 SC 1.4.1 "Use of Color"
- For categories, start from the 8-color Okabe-Ito palette (#E69F00 orange, #56B4E9 sky blue, #009E73 bluish green, #F0E442 yellow, #0072B2 blue, #D55E00 vermillion, #CC79A7 reddish purple, #000000 black), because it's been verified against the 3 types of dichromacy — Okabe & Ito, Color Universal Design, 2008; Wong, Nature Methods, 2011; it's Wilke's default, 2019
- Differentiate lightness between any two colors that must be told apart, because CVD preserves light/dark perception even when hues collapse — Muth, Datawrapper, 2018; Brewer, 1994
- Simulate the 3 dichromacies (deuteranopia, protanopia, tritanopia) before shipping any screen — validate in code with the CVD matrix (formulas in the "Executable color verification" section) or an equivalent tool (Color Oracle, Sim Daltonism, Datawrapper's checker) — because the trichromat author can't see the collision — Machado, Oliveira & Fernandes, 2009; Jenny & Kelso, Color Oracle, 2007
- In multi-line charts, also check spatial overlap: if two CVD-colliding lines cross, rename them at the end (direct label), because a distant legend makes the collision unrecoverable — Muth, Datawrapper, 2018

**Anti-patterns:** a KPI green=good/red=bad with no icon or sign (+/-) — invisible to ~1 in 12 men; a red-green choropleth of regional performance; a "colorblind-safe" palette approved in isolated testing but used with overlapping 1px series (mark size reduces discriminability); relying on heatmap hue alone for "critical" vs "ok" cells with no number in the cell; testing only deuteranopia and ignoring tritanopia in blue-yellow palettes.

## Semantic color and cultural conventions

Readers arrive with color expectations: banana=yellow, the Amazon=green, loss=red, party X=color X. Lin et al. (2013) showed experimentally that "semantically resonant" colors speed up chart reading versus arbitrary colors. But convention is LOCAL: red is loss in Western finance and a rise on the Chinese stock market; red is the left in Europe/Brazil and Republican in the US. Violating the target audience's convention produces a silent inverted reading — the worst kind of error.

**Rules:**
- Assign colors that match the concept when an obvious association exists (parties in their official colors, "profit" never in red), because semantically resonant colors speed up lookup and reduce trips to the legend — Lin, Fortuna, Kulkarni, Stone & Heer, "Selecting Semantically-Resonant Colors", EuroVis/CGF, 2013
- Map the AUDIENCE's convention before locking in semantics: red=drop holds for finance in the West, but in China red=rise; in Brazil red carries a partisan reading — check the context — Cairo, The Functional Art, 2012; Muth, Datawrapper, 2018
- For gender data, avoid the baby-pink/baby-blue cliché: use pairs like purple×green (Telegraph), or keep blue for men but swap pink for a strong orange/yellow, because the stereotype biases the reading and pale pink loses contrast — Muth, "An alternative to pink & blue", Datawrapper, 2018
- Standardize color↔meaning across the whole product: the same entity (e.g., "Store A", "delinquent", "target") has the same color on EVERY screen, because changing the mapping between screens forces relearning and induces error — Few, Information Dashboard Design, 2006; IBCS Standards 1.2 (uniform notation), 2021
- In business reports, encode scenario by fill and not by hue (canonical encoding in references/dashboard-typology.md), reserving color for good/bad variance, because it separates two meanings that teams always mix up — IBCS Standards 1.2 (Hichert & Faisst), 2021
- Use red sparingly and never decoratively, because red carries a preattentive alarm: if everything is red, nothing is urgent — Few, 2008; Knaflic, Storytelling with Data, 2015
- If the semantics demand red×green (traditional finance), adjust lightness (dark green × light red) and add a sign/icon, because the convention can't cost you accessibility — Muth, Datawrapper, 2018

**Anti-patterns:** a "Revenue" series in red and "Cost" in green because "it matched the layout" — inverted reading; a Brazilian electoral map with the US red/blue palette and no prominent legend; hot pink for "women" in a serious report — it activates the stereotype and steals attention; a "Water/Sanitation" category in brown and "Deforestation" in blue — anti-resonance that forces a trip to the legend; changing the color of the same client/status between the dashboard and the drill-down.

## Gray as the protagonist: emphasis by exception

The most powerful emphasis technique in dataviz is to paint almost everything gray and reserve ONE vivid color for what matters — "gray is the most important color in data vis" (Andy Kirk). Knaflic operationalizes it: start with the entire chart in gray and justify every pixel that earns color. Gray is also the material of all the non-data: axes, gridlines, labels, map base, context categories — you'll need more shades of gray than you think.

**Rules:**
- Start every chart 100% gray and add color only to the point/series of the message, because emphasis works by contrast with a neutral background: if everything has color, nothing stands out — Knaflic, Storytelling with Data, 2015, ch. 4; Kirk, Data Visualisation, 2016
- In a line chart with 5+ series, highlight 1–3 in color and drop the rest to light gray (keeping hover/label), because 10 colored lines = illegible spaghetti and 10 gray + 2 colored = context + story — Muth, "Emphasize what you want readers to see", Datawrapper, 2021
- Build a 4+-step gray scale for non-data (gridline lighter than tick, tick lighter than label, label lighter than title), because typographic/structural hierarchy in gray frees color for the data — Muth, "A detailed guide to colors in data vis style guides", Datawrapper, 2022; Few, 2008
- Use gray (not white, not the ramp's minimum color) for "no data" in maps and heatmaps, and declare it in the legend, because null confused with zero is a visual lie — Brewer, 1994; Muth, Datawrapper, 2022
- To de-emphasize while keeping identity, desaturate the category's own color instead of swapping it for another, because it preserves the color↔category link across states (e.g., active/inactive filter) — Muth, Datawrapper, 2021
- Apply color only when it corresponds to a difference in meaning in the data (Few's rule 4): colorful decoration on bars of the same variable is noise — Few, Practical Rules for Using Color in Charts, 2008
- Check the contrast of text grays against the background (WCAG minimum 4.5:1 for small text; 3:1 for essential graphic elements; ratio in code in the "Executable color verification" section), because "elegant gray" turns illegible on a bad monitor/projector — WCAG 2.1 SC 1.4.3/1.4.11, 2018

**Anti-patterns:** bars of a single metric each in a different color (a categorical rainbow with no category) — Few calls it pure noise; highlighting the important series while leaving the others saturated TOO, just "a little less"; 100% black gridlines that compete with the bars; #EEE gray for axis text on a near-white background (e.g., a light cream) — contrast ~1.1:1, illegible; using the non-data palette's gray as a real category color (gray "Other" + gray "no data" on the same map).

## How many colors, at most: limits of categorical discrimination

The visual system reliably discriminates only a few hues when they must be paired with a legend: Healey found ~7 nameable/preattentive colors; Ware recommends 6–12 as the absolute limit; Munzner places the hue channel's capacity at 6–12 bins; Wilke recommends 3–5 for comfortable reading. Beyond that, the problem isn't solved with a better palette — it's solved by changing the design (group, facet, direct-label, highlight+gray).

**Rules:**
- Limit to 5–7 categorical colors per chart; beyond that, group the smaller ones into a gray "Other", because color↔legend pairing degrades fast past ~7 — Muth, "What to consider when choosing colors", Datawrapper, 2021; Healey, "Choosing Effective Colours", IEEE Vis, 1996
- Prefer 3–5 colors when categories appear in small marks (thin lines, points), because discriminability drops with mark size — Wilke, Fundamentals of Data Visualization, 2019, ch. 19; Stone, 2006
- When categories exceed ~8, swap color for position: facet into small multiples or direct-label and use a single color, because position is the most precise channel (Cleveland & McGill) and doesn't saturate — Munzner, 2014; Cleveland & McGill, JASA, 1984; Wilke, 2019
- Label series directly at the end of the line when there are up to 4–7 series and kill the legend, because a separate legend forces eye round-trips and is the first point of failure with many colors — Few, Show Me the Numbers, 2004; Wilke, 2019
- Don't recycle the same hue at close saturations for distinct categories (two medium blues), because in small marks they collapse; if you need subgroups, use light/dark families of the same hue with a large Δ lightness — Brewer (qualitative "Paired" schemes), 2003
- In stacked bars/treemaps with dozens of slices, order by size and color only the top-N + "Other", because a palette of 20 "distinct" colors doesn't exist perceptually — Ware, 2013; Muth, Datawrapper, 2021

**Anti-patterns:** a pie/donut with 15 slices and 15 colors + a legend in a column on the side; the entire "Tableau 20" palette in a 20-series line chart — spaghetti with a useless legend; solving too many categories by adding patterns/hatching on top of 12 colors (adds noise, not discriminability); two nearly identical shades of blue for "New" vs "Returning" in 4px points; an alphabetical legend while the chart orders by value — it doubles the cost of color↔name pairing.

## Screen background and dark mode in dataviz

The background alters the perception of ALL colors on it (simultaneous contrast — Few's rule 1: the same object on different backgrounds looks like different colors). Muth: the background should be desaturated and either very light or very dark — mid-brightness backgrounds make it nearly impossible to find contrasting colors. Dark mode is not "invert": it requires re-deriving the palette (desaturate/lighten data colors, tone down whites) — Datawrapper implemented this as an automatic adaptation algorithm in 2023, not as a background swap.

**Rules:**
- On a light background, keep the near-white background desaturated (saturation <7%, lightness >95%); on a dark one, dark blue-gray (saturation <20%, lightness 10–25%) and never pure black #000, because full black creates harsh contrast and haloing — Muth, "How to pick more beautiful colors" + "What background color should your data vis have?", Datawrapper, 2020/2021
- When porting a chart to dark mode, lighten and desaturate the data colors (don't reuse the light hexes), because saturated colors on a dark background "vibrate" and halo — especially for the ~30-40% of users with astigmatism — Muth, Datawrapper, 2021; Material Design dark theme guidance, 2019
- Tone body text in dark mode down to off-white (~87% opacity / #E0E0E0+), never pure #FFF in body text, because pure white on dark increases haloing and fatigue — Material Design, 2019
- Re-anchor the ramp's semantics: on a light background, dark=more; on a dark background, it's the LIGHT end that pops — check that the highest-value end is still the one with the most contrast against the background, otherwise the map inverts the reading — Muth, Datawrapper, 2021; Munzner, 2014
- Revalidate WCAG contrast and CVD simulation separately in each mode, because a pair approved in light can collide in dark (the luminance contrast flips sign) — WCAG 2.1, 2018; Datawrapper dark mode, 2023
- Keep gridlines/axes as the lowest-contrast layer in both modes (subtle dark gray in light, subtle light gray in dark), because structure can never compete with data — Few, 2008; Muth, 2022
- If the product has a theme with a colored background (e.g., a cream/beige), test the data palette ON IT, not on white, because warm backgrounds shift the perception of cool hues (simultaneous contrast) — Few, rule 1, 2008; Albers, Interaction of Color, 1963

**Anti-patterns:** dark mode via an invert/CSS filter that also inverts the data colors (a sequential ramp becomes reversed order); a pure #000 background with saturated #FF0000/#00FF00 series — maximum vibration and haloing; the same hex palette served in both themes "for brand consistency"; a mid-gray (#888) background behind charts — no palette contrasts well with it; a sign-off screenshot only in light mode while real users live in dark.

## Executable color verification

Every color claim in this file (contrast, luminance order, CVD collision) is decidable in code — the agent doesn't "think" it passes, it runs the math over the real rendered hexes, on the real background, before shipping. Three checks cover most errors: relative luminance (orders the ramp and feeds the contrast), WCAG contrast ratio (text and graphic elements), and dichromacy simulation (hue collapse).

```python
# 1) sRGB relative luminance (WCAG 2.x). R,G,B normalized in [0,1].
def lin(c):                         # linearize channel (remove sRGB gamma)
    return c/12.92 if c <= 0.03928 else ((c + 0.055)/1.055) ** 2.4
def luminance(r, g, b):
    return 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b)   # 0 black .. 1 white

# 2) Contrast ratio between two colors (Lc = lighter, Le = darker)
def contrast(Lc, Le):
    return (Lc + 0.05) / (Le + 0.05)          # 1.0 .. 21.0
# Thresholds: >=4.5:1 normal text (AA); >=3:1 large text (>=18pt or 14pt bold)
# and essential graphic/UI object (WCAG 1.4.11); >=7:1 normal text (AAA).

# 3) Dichromacy simulation — linearize, apply the 3x3 matrix, re-encode.
#    Machado 2009 matrices at severity 1.0 (= dichromacy), over LINEAR RGB:
M_PROTANOPIA   = [[ 0.152286,  1.052583, -0.204868],
                  [ 0.114503,  0.786281,  0.099216],
                  [-0.003882, -0.048116,  1.051998]]
M_DEUTERANOPIA = [[ 0.367322,  0.860646, -0.227968],
                  [ 0.280085,  0.672501,  0.047413],
                  [-0.011820,  0.042940,  0.968881]]
M_TRITANOPIA   = [[ 1.255528, -0.076749, -0.178779],
                  [-0.078411,  0.930809,  0.147602],
                  [ 0.004733,  0.691367,  0.303900]]
# pipeline: sRGB -> lin() per channel -> multiply by the matrix -> clip[0,1]
#           -> reapply sRGB gamma -> compare. Two hexes that converge under
#           any matrix need a 2nd channel (shape/position/direct label).
```

**Rules:**
- Decide contrast by number, not by eye: fail text <4.5:1 and an essential axis/border/icon <3:1 against the real background, because "elegant gray" often lands at ~1.1:1 and vanishes on the projector — WCAG 2.1 SC 1.4.3/1.4.11, 2018
- Verify ramp order by monotonic luminance: compute `luminance()` for each stop and confirm it rises (or falls) with no plateau in the middle, because a ramp with non-monotonic luminance loses its order in B&W and under CVD — Kovesi, 2015; van der Walt & Smith, 2015
- Run the 3 dichromacy matrices over the real hexes and measure the distance between pairs that must be told apart; if they collapse under deutan/protan/tritan, change the color or add a redundant channel, because the trichromat author can't see the collapse — Machado, Oliveira & Fernandes, 2009; Viénot, Brettel & Mollon, 1999
- Linearize sRGB before any matrix (the `lin()` above): skipping this step darkens the colors and invalidates both the luminance and the CVD simulation — Viénot, Brettel & Mollon, 1999; Burrus, DaltonLens, 2021
- Run the check in the rendered context (real background, real mark size), not on the isolated hex, because contrast and discriminability depend on the background and the mark size — Few, "Practical Rules for Using Color in Charts", rule 1, 2008; Stone, 2006

**Anti-patterns:** approving contrast "by eyeball" and finding out at the client that the text disappears; validating CVD from a screenshot alone instead of measuring post-matrix distance; applying the CVD matrix to sRGB without linearizing first — a dark, wrong result; checking luminance only at the ramp's ends and not at the middle stops (it's in the middle that the plateau shows up); running the formulas on the nominal hex when the theme applies opacity/blend on top (measure the effective color, not the theoretical one).

## Canonical copy-paste palettes (hex)

With no defined brand palette, don't invent a color in the RGB picker — start from these empirically tested schemes (discriminability, CVD, B&W print) and adjust to the background. They're defaults, not dogma: run the Executable verification after adapting.

```text
# QUALITATIVE — categories with no order. CVD-safe.
Okabe-Ito (8):       #E69F00 #56B4E9 #009E73 #F0E442 #0072B2 #D55E00 #CC79A7 #000000
Paul Tol bright (7): #4477AA #EE6677 #228833 #CCBB44 #66CCEE #AA3377 #BBBBBB

# SEQUENTIAL — magnitude 0->max (ColorBrewer "Blues", 7 classes, light->dark)
#EFF3FF #C6DBEF #9ECAE1 #6BAED6 #4292C6 #2171B5 #084594

# DIVERGING blue<->red with a neutral midpoint (ColorBrewer "RdBu", 9 classes)
#B2182B #D6604D #F4A582 #FDDBC7 #F7F7F7 #D1E5F0 #92C5DE #4393C3 #2166AC
# midpoint #F7F7F7 = zero/threshold; red end and blue end = the two extremes.

# CONTINUOUS perceptually uniform (viridis, 5 samples; interpolate for more levels)
#440154 #3B528B #21908C #5DC863 #FDE725
```

**Rules:**
- For nominal categories, use Okabe-Ito (8) or Paul Tol bright (7) directly — both verified against the 3 dichromacies — instead of generating a new palette, because a CVD-safe qualitative palette of 7+ colors is hard to get right by eye — Okabe & Ito, 2008; Wong, 2011; Tol, Colour Schemes (SRON), 2021
- For magnitude with no midpoint use the "Blues" sequential (or another monotonic-luminance ramp); for deviation from a center use "RdBu", anchoring the neutral #F7F7F7 at zero/threshold, because getting the scale type wrong invents structure the data doesn't have — Harrower & Brewer, 2003; see "The three scale types"
- For a heatmap/continuous surface use viridis (interpolate between the samples), never jet/rainbow, because viridis has verified monotonic luminance — van der Walt & Smith, 2015; see "Perceptually uniform scales"
- Truncate, don't stretch: for 4 categories take the first 4 from Okabe-Ito/Tol (already ordered by separability), don't redistribute the color wheel — Tol, 2021; Brewer, 2003
- Re-anchor to the background before using: on a dark background lighten/desaturate the data hexes and reconfirm contrast and CVD, because these defaults were calibrated for a light background — see "Screen background and dark mode"; Muth, Datawrapper, 2021

**Anti-patterns:** using all 8 Okabe-Ito colors in 8 overlapping 1px series (discriminability drops with mark size — cut to 3–5); painting nominal categories with the "Blues" ramp (implies an order that isn't there); using the "RdBu" diverging scale with no real midpoint (invents a threshold); sampling viridis at 12 points and treating it as qualitative (it's continuous, neighboring hues collide); copying these hexes to dark mode without re-deriving (saturated on dark vibrates/halos).

## Sources

- Zeileis, Hornik & Murrell, Escaping RGBland: Selecting Colors for Statistical Graphics, Computational Statistics & Data Analysis, 2009
- Maureen Stone, Get It Right in Black and White / Choosing Colors for Data Visualization, 2005-2006
- Tamara Munzner, Visualization Analysis and Design, 2014
- Colin Ware, Information Visualization: Perception for Design, 2013
- Cynthia Brewer, Color Use Guidelines for Mapping and Visualization, 1994
- Mark Harrower & Cynthia Brewer, ColorBrewer.org: An Online Tool for Selecting Colour Schemes for Maps, The Cartographic Journal, 2003
- Kenneth Moreland, Diverging Color Maps for Scientific Visualization, 2009
- Claus Wilke, Fundamentals of Data Visualization, 2019
- Borland & Taylor, Rainbow Color Map (Still) Considered Harmful, IEEE Computer Graphics and Applications, 2007
- van der Walt & Smith, matplotlib viridis (SciPy presentation), 2015
- Kovesi, Good Colour Maps: How to Design Them, arXiv, 2015
- Nuñez, Anderton & Renslow, Optimizing colormaps with consideration for color vision deficiency (cividis), PLOS ONE, 2018
- Borkin et al., Evaluation of Artery Visualizations for Heart Disease Diagnosis, IEEE TVCG (InfoVis), 2011
- Mikhailov (Google AI), Turbo, 2019
- Lisa Charlotte Muth, How to pick more beautiful colors for your data visualizations, Datawrapper, 2020
- Lisa Charlotte Muth, How to find & create good color palettes, Datawrapper, 2021
- Lisa Charlotte Muth, "Which color scale to use in data vis" series (3 parts), Datawrapper, 2021
- Lisa Charlotte Muth, What to consider when visualizing data for colorblind readers, Datawrapper, 2018
- Lisa Charlotte Muth, An alternative to pink & blue: Colors for gender data, Datawrapper, 2018
- Lisa Charlotte Muth, Emphasize what you want readers to see with color, Datawrapper, 2021
- Lisa Charlotte Muth, A detailed guide to colors in data vis style guides, Datawrapper, 2022
- Lisa Charlotte Muth, What to consider when choosing colors for data visualization, Datawrapper, 2021
- Lisa Charlotte Muth, What background color should your data vis have?, Datawrapper, 2021
- Datawrapper, New: Dark mode for all Datawrapper visualizations, 2023
- Stephen Few, Practical Rules for Using Color in Charts, Perceptual Edge, 2008
- Stephen Few, Show Me the Numbers, 2004 (2nd ed. 2012)
- Stephen Few, Information Dashboard Design, 2006
- Masataka Okabe & Kei Ito, Color Universal Design, 2002/2008
- Bang Wong, Points of View: Color blindness, Nature Methods, 2011
- W3C, WCAG 2.1 (SC 1.4.1, 1.4.3, 1.4.11), 2018
- Jenny & Kelso, Color Oracle, 2007
- Lin, Fortuna, Kulkarni, Stone & Heer, Selecting Semantically-Resonant Colors for Data Visualization, EuroVis, 2013
- Alberto Cairo, The Functional Art, 2012
- IBCS Standards 1.2 (Hichert & Faisst), 2021
- Cole Nussbaumer Knaflic, Storytelling with Data, 2015
- Andy Kirk, Data Visualisation: A Handbook for Data Driven Design, 2016
- Cleveland & McGill, Graphical Perception, JASA, 1984
- Christopher Healey, Choosing Effective Colours for Data Visualization, IEEE Visualization, 1996
- Google, Material Design — Dark theme guidance, 2019
- Josef Albers, Interaction of Color, 1963
- Machado, Oliveira & Fernandes, A Physiologically-Based Model for Simulation of Color Vision Deficiency, IEEE TVCG, 2009
- Brettel, Viénot & Mollon, Computerized simulation of color appearance for dichromats, JOSA A, 1997
- Viénot, Brettel & Mollon, Digital video colourmaps for checking the legibility of displays by dichromats, Color Research & Application, 1999
- Nicolas Burrus, Understanding LMS-based Color Blindness Simulations, DaltonLens, 2021
- Paul Tol, Colour Schemes (SRON technical note), 2021
