# Maps and spatial data

> Reference for the dataviz-design skill. Load when: you're building/reviewing a choropleth, proportional symbol, tile grid/cartogram/hexbin, temporal map, or deciding whether a dataset with a state/municipality column should become a map or a bar chart.

## When a map is the wrong form

A map is only the right choice when the user's question is spatial ("WHERE does this happen?", "is there a regional pattern?"). On a map, the most precise channel (2D position) is spent on geography, leaving the data to be encoded as color across irregular areas — the least accurate channel in the Cleveland & McGill (1984) hierarchy. As Matthew Ericson (NYT) put it: having geographic data doesn't force you to make a map; a sorted bar chart often answers the question better.

**Rules:**
- Before mapping, check whether the pattern has spatial structure (neighbors with similar values, a regional gradient, clusters); if the map looks like salt-and-pepper noise, switch to a sorted bar chart, because without spatial autocorrelation the map just scrambles the ranking — Ericson, "When Maps Shouldn't Be Maps", 2011
- If the task is comparing exact values or ranking regions ("which state leads?"), use a sorted bar chart or a table, because color filling irregular polygons sits at the bottom of the perceptual-accuracy hierarchy (position > length > angle > area > color) — Cleveland & McGill 1984; Munzner 2014
- When only a few units matter (e.g., data concentrated in 5-8 states), prefer bars, because the map spends most of its pixels on empty regions and the relevant ones may be the smallest in area — Few, Information Dashboard Design, 2006
- Don't use a map as dashboard decoration/hero when location changes none of the user's decisions; a map with no spatial question is high-cost chartjunk — Few 2006; Tufte 1983
- When a map is justified, pair it with a lookup view (a sortable table or a searchable bar chart), because a map supports neither precise value reading nor comparison of non-neighbors — Munzner, Visualization Analysis and Design, 2014

**Anti-patterns:** A map of all of Brazil for data present in a half-dozen municipalities; using the map to answer "who's the biggest?" (a ranking task) instead of "where does it concentrate?"; a hero map at the top of the dashboard just because "we have a state column" — the pattern is 100% population-driven, not spatial; replacing the table with the map instead of offering both.

## Join integrity: match on code, not name; and the right boundary-file vintage

Every map is two datasets glued together: the values and the geometry (boundary file/shapefile/TopoJSON), joined on a key. This join is the #1 silent failure of real-world maps — a row that doesn't match disappears (a blank polygon) or, worse, matches the wrong region and colors the neighbor. A region name is an unstable key (accents, case, abbreviation, spelling, mergers); an official code is stable. And the boundary itself changes over time: the vintage of the boundary file has to match the vintage of the data.

**Rules:**
- Join data to geometry on a stable official CODE (IBGE, FIPS, ISO 3166, NUTS, GEOID), never on region name, because names vary in accent/case/abbreviation/spelling and the join matches wrong or drops the row silently — cartography/geospatial-engineering practice
- After joining, count and report the unmatched rows on BOTH sides (data with no geometry, geometry with no data) before drawing, because a blank polygon is almost always a key that didn't match, not genuinely missing data — cartography/geospatial-engineering practice
- Normalize the key on both sides before the join (the leading zero the CSV ate, code as string rather than integer, state+municipality concatenated), because most "holes" in a map are a truncated code — geospatial-engineering practice
- State the YEAR/version of the boundary file and align it with the vintage of the data, because boundaries and codes change (a municipality created or merged, redistricting, code reuse) and one year's geometry over another year's data joins the wrong area — cartography practice
- When the join is unavoidably by name (a source with no code), keep an explicit, versioned crosswalk table instead of matching on raw string equality — cartography practice

**Anti-patterns:** Matching data to map by name ("Sao Paulo" without the accent doesn't match; "São Paulo" the city vs. the state); a blank municipality read as zero when it's really a key that didn't match; the current year's boundary file over a historical series with older borders; an IBGE code losing its leading zero when it becomes a number; shipping the map without ever counting the unmatched.

## Ecological fallacy: the map shows areas, not individuals

A choropleth paints an area-level aggregate statistic. Concluding something about a person from the area's pattern is the ecological fallacy: Robinson (1950) found that, at the level of US states, immigration and literacy correlated positively, but at the individual level immigrants were less literate — the correlation between areas inverts the correlation between individuals. The map is honest about areas; the one who lies is the reader who transfers that to a person. It's the interpretive sibling of the MAUP (see the choropleth section) and part of the larger discussion of inference (see references/integrity-uncertainty.md).

**Rules:**
- Don't draw conclusions about individuals from an area's color, because a correlation between aggregates can invert at the person level (immigration×literacy came out positive by state and negative by individual) — Robinson 1950
- Word the title and legend at the level of the mapped unit ("regions with the highest X", not "people with the highest X"), because the color is an aggregate and it's the wording that carries the illegitimate inference — Robinson 1950; see references/integrity-uncertainty.md
- Treat the spatial pattern as a hypothesis about the area, to be confirmed with individual-level data before it becomes a decision about people — Robinson 1950
- Remember that changing the aggregation unit changes the apparent correlation: the ecological fallacy and the MAUP are the same warning from different angles (see the "Choropleth: always a normalized rate" section) — Openshaw 1984; Robinson 1950

**Anti-patterns:** Reading "high-income neighborhood" as "this resident is rich"; a headline "who does X" over a map that only shows "where the rate of X is high"; using the aggregated map as proof of individual behavior; inferring an individual-level cause from a correlation between polygons.

## Choropleth: always a normalized rate, never a count

A choropleth fills entire administrative units, so the polygon's area visually multiplies the value — a large, populous region always "wins." A raw count on a choropleth reproduces the population map ("land does not vote, people do", Douïeb 2019): the classic xkcd point that every US map of totals is the same map. Only rates, percentages, and densities make differently sized units comparable.

**Rules:**
- Fill only with normalized values (per capita, per 100,000 people, %, per km², per household); a raw count becomes a map of population centers, not of the phenomenon — Datawrapper Academy, "What to consider when creating choropleth maps", 2017
- Choose the denominator that answers the business question (per resident ≠ per voter ≠ per business); the wrong denominator normalizes the wrong phenomenon — Cairo, The Truthful Art, 2016
- An absolute count calls for a proportional symbol or a dot map, not area fill — Datawrapper Academy 2017; Slocum et al. 2009
- Be suspicious of rates with a small denominator: tiny municipalities produce the most extreme values from pure sampling noise (the de Moivre effect); aggregate, smooth, or flag low confidence before highlighting "hotspots" — Wainer, "The Most Dangerous Equation", American Scientist, 2007
- Remember the MAUP: the pattern changes with the aggregation unit (state vs. microregion vs. municipality); choose the level that matches the user's decision and state it — Openshaw, The Modifiable Areal Unit Problem, 1984
- Use a neutral gray outside the ramp for "no data" and declare it in the legend, because painting no-data as zero is a visual lie — Datawrapper Academy 2017
- In the title, state both the metric AND the denominator ("Cases per 100,000 people"), because the reader assumes a count by default — Datawrapper Academy 2017

**Anti-patterns:** "Total cases by state" as a color fill — São Paulo always wins, the map is redundant with population; zero and null in the same color; a hotspot announced in a municipality of 800 people at a per-100,000 rate; an election map by area that shows 80% of the territory in one color when the vote was 50/50.

## Classification: Jenks, quantiles, equal intervals, classed vs. unclassed

Classification is an editorial decision: the same data with different breaks tells opposite stories (Monmonier). The classed vs. unclassed debate (Muth/Datawrapper): the continuous scale is "the most accurate representation of the data model" (Tyner) and shows nuance; classes simplify and let you say which band a region falls into. The right workflow starts unclassed to see the distribution, and only then simplifies deliberately.

**Rules:**
- Always start with the continuous (unclassed) scale to see the real distribution and outliers; classify only if the reader needs to name bands or decision thresholds exist — Muth, "When to use classed and when to use unclassed color scales", Datawrapper, 2021
- If you classify, use 3 to 7 classes; above ~7 sequential steps the eye can't tell the colors apart on the map — Brewer/ColorBrewer; Harrower & Brewer, The Cartographic Journal, 2003
- Quantiles guarantee the whole ramp gets used and are the best choice for series/small multiples of comparable maps (tested with reading of epidemiological maps) — Brewer & Pickle, Annals of the AAG, 2002
- Jenks (natural breaks, 1967) maximizes within-class homogeneity, but produces breaks that aren't round, aren't memorable, and aren't comparable across maps or periods; reserve it for a single exploratory map — Jenks 1967; Slocum et al. 2009
- Equal intervals only work with an approximately uniform distribution; with skewed data (the common case for income, price, population) almost everything falls into a single class — Slocum et al. 2009
- Round the breaks to memorable numbers (10, 25, 50, 100), because a break at "23.7%" isn't communicable and gives away a raw algorithm — Datawrapper Academy 2017; Monmonier 1991
- Use a diverging ramp only with a meaningful midpoint (zero, the national average, a target); otherwise, sequential — Wilke, Fundamentals of Data Visualization, 2019
- Document the classification method in the map's footnote, because the choice of breaks is manipulable and the reader has the right to audit it — Monmonier, How to Lie with Maps, 1991
- Never use rainbow for quantitative data: hue has no perceptual order and creates false boundaries — Borland & Taylor, "Rainbow Color Map (Still) Considered Harmful", IEEE CG&A, 2007

**Anti-patterns:** Jenks recomputed on every interactive filter — the same color changes meaning between interactions; 9+ indistinguishable sequential classes; breaks with 3 decimal places in the legend; a diverging ramp with no semantic midpoint; choosing the classification method that "makes the map most dramatic" without disclosing it.

## Proportional symbol for absolute values

When the metric is a count/total, the proportional symbol (a circle anchored at the centroid or the coordinate) is the correct form: the symbol's size carries the value, independent of the polygon's area. The perceptual risk: readers systematically underestimate large circles, and scaling by radius (instead of area) inflates differences quadratically.

**Rules:**
- Scale the value by the circle's AREA (radius ∝ √value), never by radius, because radius ∝ value makes a 2× datum look 4× — Wilke 2019; Tufte (lie factor) 1983
- Consider the Flannery compensation (exponent 0.5716 instead of 0.5) when magnitude reading matters, because readers underestimate large circles; it applies only to circles, not squares — Flannery, thesis/paper in Cartographica, 1971
- A legend with 3-4 nested circles at round values, including one near the map's actual maximum, because without anchors the size is unreadable — Slocum et al. 2009; Datawrapper Academy "symbol maps"
- Handle overlap: 50-70% fill opacity + an outline, and draw largest-to-smallest so the small circle isn't buried under the large one — Datawrapper Academy; Wilke 2019
- Don't use symbol size for fine differences (<2×): area perception is imprecise; if exact comparison matters, complement with a sorted bar chart — Cleveland & McGill 1984
- A symbol (count) overlaid on a choropleth (rate) only when the two variables are read together in the same question; otherwise they're two maps — Slocum et al. 2009
- Never use spheres/3D: volume estimation is dramatically worse than area estimation — Slocum et al. 2009

**Anti-patterns:** Bubbles scaled by radius (the most common error in charting libraries); a 3D bubble/sphere "for impact"; a metro area with 40 stacked circles, illegible without an inset or aggregation; a legend with no reference circle near the maximum.

## Cartogram, tile grid map, and hexbin: compensating for area

A family of forms that break geographic fidelity to correct the choropleth's area bias. A tile grid gives each unit exactly the same visual space (1 square/hexagon per state); a hexbin aggregates thousands of points into density cells. The cartogram comes in three flavors: contiguous (deformed polygons that keep adjacency and resize by population), non-contiguous (Olson 1976 — each polygon keeps its shape and shrinks/grows from the centroid, opening gaps) and Dorling (1996 — each region becomes a circle sized by the value, discarding shape and topology). The trade-off is always recognizability of the territory versus honesty to the data.

**Rules:**
- Use a tile grid map when each unit carries the same decision weight (1 state = 1 vote, regulatory status by state) and small units can't disappear (the Federal District, Sergipe) — NPR Visuals, "Let's tessellate", 2015
- Prefer hexagons to squares when you want to preserve more real adjacencies and the country's approximate outline; squares scan better in rows/columns — NPR Visuals 2015
- Tile grid only with a rate, percentage, or category — never a count — because all tiles are the same size and a total where São Paulo's tile = Roraima's tile lies — NPR Visuals 2015
- Always label each tile with its abbreviation (state code), because position in the grid isn't real geography and the reader can't trust the shape — NPR Visuals 2015
- A contiguous cartogram (polygon distortion) only for an audience that knows the territory well and when the population×area disproportion IS the message; for a general audience, a Douïeb-style proportional dot map communicates the same with less disorientation — Wilke 2019; Douïeb 2019
- A non-contiguous cartogram (Olson 1976) preserves each region's SHAPE and resizes it by value from the centroid, opening gaps between units; it's the most legible cartogram for someone who knows the territory, because each silhouette stays recognizable — Olson 1976
- A Dorling cartogram (1996) turns each region into a circle whose area is proportional to the value, positioned near the real place without overlapping — it discards shape and topology; use it when the value matters more than the outline and small units would vanish on a choropleth, and scale by area as with the proportional symbol (see that section) — Dorling 1996
- Label each cartogram piece with its abbreviation and offer a choropleth or table alongside, because the distortion trades recognition for fidelity to the data and the reader loses the geographic anchor — Olson 1976; Dorling 1996
- Hexbin (spatial aggregation of points) for thousands of individual points: it resolves overplotting by showing density; choose the cell size deliberately and test 2-3 sizes, because the bin is a MAUP parameter that changes the pattern — Openshaw 1984; D3/Uber H3 practice
- Don't read adjacency on a tile grid as real adjacency (in the US grid, DC touches NC/DE) — decide whether that's acceptable for the task — NPR Visuals 2015

**Anti-patterns:** A tile grid with no abbreviation labels; an absolute count on an equal-cell tile grid; a distorted cartogram for an executive audience that no longer recognizes the map; a hexbin with a single cell size picked from the library default, with no sensitivity check; a Dorling cartogram with illegible overlapping circles; a non-contiguous cartogram with no labels where nobody recognizes the shrunken pieces; a Dorling circle scaled by radius, which inflates the value quadratically (see proportional symbol).

## Dot-density map: points instead of filled area

The dot-density map scatters points within each region — one dot equals N units — so the eye reads count/density as texture, not as area color. It escapes the choropleth's area bias (empty land stays empty, a dense region looks dense) and, unlike the choropleth, shows absolute magnitude honestly. The cost: you can't read an exact value, the dot is placed pseudo-randomly inside the polygon (each dot's precise position isn't a real location), and the overlap saturates in the densest areas.

**Rules:**
- Use dot-density for an absolute count/volume when the distribution WITHIN the region matters, because each dot = N units shows magnitude without the choropleth's area bias — Slocum et al. 2009
- State the "1 dot = N" ratio in the legend and calibrate N so the densest region reads as texture (not a solid blob) and the sparsest doesn't come out empty — Slocum et al. 2009
- Warn that the dot's POSITION is pseudo-random within the polygon, not a real address; if you have data on where the population actually is (land use, inhabited areas), refine with dasymetric mapping instead of scattering uniformly — Slocum et al. 2009
- One color per layer: dot-density with several color categories overlaid becomes indistinguishable noise; prefer small multiples, one dot map per category — see perception.md
- Don't ask for exact value reading or ranking from a dot map, because it communicates relative density, not a total per region; if the exact number matters, pair it with a table — see perception.md

**Anti-patterns:** A "1 dot = 1" map that saturates into a blob in metro areas; a reader thinking the dot marks an address; dot color categories mixed without separation; using dot-density to rank regions (it's density texture, not an exact measure).

## Projections: Mercator inflates the north

Every projection distorts something; the wrong choice distorts exactly the channel a thematic map uses (perceived area). Web Mercator, the web default, inflates areas with latitude — ~4× at 60° — making Greenland look the size of Africa (which is ~14× larger). A thematic map of painted area requires an equal-area projection.

**Rules:**
- Choropleth and any thematic map of area → an equal-area projection, because the reader's impression is proportional to the painted area and Mercator inflates ~4× at 60° latitude — ICA, "Choosing World Map Projections"; Datawrapper Academy art. 354
- World map: Equal Earth (Šavrič, Patterson & Jenny, 2018) or Mollweide; US: Albers Equal Area; Europe: LAEA/ETRS89 (the Eurostat standard) — ICA; Datawrapper Academy
- Web Mercator is acceptable only in an interactive map with zoom down to local/urban scale (local distortion is small and the tiles are the market standard) — Datawrapper Academy art. 354
- Brazil: being close to the equator, Mercator's distortion is smaller, but for comparing areas across regions use the Albers Equal-Area Conic — the same projection IBGE adopts for area calculation (origin long. -54°, standard parallels -2°/-22°). Don't use IBGE's Polyconic to compare areas: although it's the official projection of the general map of Brazil, it's aphylactic (neither conformal nor equal-area) and IBGE itself reserves it for extent/distance, not area — IBGE, cartographic conventions; ICA
- Never ask the reader to compare sizes across different latitudes on a Mercator; if area comparison matters and the projection is Mercator inherited from a tile server, switch the basemap or add a warning — Monmonier 1991

**Anti-patterns:** A world choropleth in Web Mercator with Russia/Canada dominating the screen; inheriting Mercator from Leaflet/Mapbox by default in a static statistical map; comparing the "size" of international markets on a Mercator basemap.

## Bivariate choropleth

Crosses two variables on a single color surface (a blend of two ramps), showing where they agree or diverge (e.g., high income × high mortality). It's powerful but cognitively expensive: it demands a matrix legend and a reader willing to study it. The canonical guide is Joshua Stevens's (2015).

**Rules:**
- Cap it at 3×3 = 9 classes (two variables with 3 classes each), because beyond that the color blends stop being distinguishable — Stevens, "Bivariate Choropleth Maps: A How-to Guide", 2015
- Label only the corners of the matrix legend ("high-high", "high-low"…), because the in-between cells become obvious and numbers in every cell drown the reading — Stevens 2015
- Use bivariate only when the question is the RELATIONSHIP between the two variables (spatial agreement/divergence); if the user reads each variable separately, two maps side by side are more legible — Muth, musings on bivariate maps, Datawrapper, 2022
- Build the palette by blending two ramps of well-separated hues (e.g., blue × red → purple in the high-high corner) and validate for color vision deficiency (CVD), because arbitrary blends produce indistinguishable cells — Stevens 2015; Brewer
- Emphasize relative ranking (thirds/quantiles per variable), not raw values with decimals in the legend — Stevens 2015
- In an interactive medium, consider a scatterplot linked to the map (brush one, highlight the other) as an alternative that preserves precise reading of the correlation — Munzner 2014 (linked views)

**Anti-patterns:** A 4×4 or 5×5 matrix "for more precision"; a bivariate legend with 3-decimal numbers in all 9 cells; a bivariate map in an executive dashboard meant for quick consumption; two variables with no causal/analytical relationship crossed just because they fit.

## Maps over time: small multiples vs. animation

To show spatial evolution, a grid of small maps (small multiples, Tufte) beats animation on most analytical tasks: the eye compares static panels side by side, whereas animation demands working memory (Tversky et al. 2002). The non-negotiable condition is a color scale that is identical and fixed across all panels.

**Rules:**
- Use the SAME ramp and the SAME breaks in every panel, computed over the pool of all periods, because a scale recomputed per panel makes the colors incomparable across years — Brewer & Pickle 2002; Tufte 1983
- When classifying a series, prefer quantiles over the aggregated data of the entire series — it was the best-performing method for reading maps in series in the study with epidemiologists — Brewer & Pickle, Annals of the AAG, 2002
- Prefer small multiples to animation for analytical comparison; animation (autoplay GIF) fails because the reader neither controls the pace nor retains the previous frame — Tversky, Morrison & Bétrancourt, "Animation: can it facilitate?", IJHCS, 2002
- If you use animation, provide play/pause/scrubber and an always-visible period indicator — Tversky et al. 2002; Gapminder practice
- Keep projection, zoom, and framing identical across all panels, because any variation becomes a false signal — Tufte, The Visual Display of Quantitative Information, 1983
- Above ~12 panels the grid stops being scannable: show start/end + a change map (diff) with a diverging scale anchored at zero — Wilke 2019 (derived from change encoding)
- Order the panels in natural reading order (left→right, top→bottom) with a large period label on each — Tufte 1983

**Anti-patterns:** A looping GIF with no pause as the only temporal view; a per-frame color scale ("the 2024 map uses different breaks"); panels with different zoom/projection; 20 tiny panels where none is legible.

## Labeling, legend, zoom, and interaction on maps

Color on a map supports no precise value reading, so the layer of text and interaction (direct labels, tooltips, insets, a well-positioned legend) is what makes the map usable in a real app. The main message can't depend on hover; and the interaction can't silently redefine what the colors mean.

**Rules:**
- A tooltip with region name + formatted value + denominator is mandatory on an interactive choropleth, because color only conveys order of magnitude — Datawrapper Academy, "Customizing your choropleth map"
- Label directly on the map the regions that carry the story (outliers, top-3, the user's own region), because a message hidden behind hover doesn't exist on mobile or in a screenshot — Datawrapper Academy; Few 2004 (direct labeling > legend)
- A horizontal color legend, snug against the top of the map, with labeled breaks; on a continuous scale, mark min/max and, if interactive, the hovered region's position on the ramp itself — Datawrapper Academy 2017
- Tiny urban regions vanish by area on a choropleth: add insets/cropped views for dense metros (the Federal District, state capitals), because that's where the data usually concentrates — Datawrapper Blog, "cropped view and inset maps", 2022
- When zooming/filtering, keep the color scale fixed; recomputing breaks on the viewport changes what the colors mean without warning — only re-normalize if it's an explicit, labeled feature — Brewer & Pickle 2002 (comparability); Monmonier 1991
- Hover should highlight the region's outline/elevation, never change the fill hue, because the fill encodes data — Munzner 2014 (channel separation)
- The title states metric + denominator + period ("X per 100,000 people, 2025"); "Map of X" tells you nothing — Datawrapper Academy 2017
- If regions are clickable (drill to the filtered slice), signal the affordance (cursor, outline on hover) and keep the non-clickable ones visually inert — Munzner 2014; the dead-ends heuristic in dashboards

**Anti-patterns:** A mute map that only communicates with the mouse over it (breaks on mobile and in print); a vertical legend squeezed far from the map; the Federal District/capitals invisible without an inset on a municipal map; zoom that recomputes the color scale silently; hover that swaps the fill color and destroys the encoding.

## Sources

- Matthew Ericson, "When Maps Shouldn't Be Maps" (ericson.net / NYT), 2011
- William Cleveland & Robert McGill, "Graphical Perception", JASA, 1984
- Tamara Munzner, Visualization Analysis and Design, 2014
- Stephen Few, Information Dashboard Design, 2006
- Stephen Few, Show Me the Numbers, 2004
- Edward Tufte, The Visual Display of Quantitative Information, 1983
- Datawrapper Academy, "What to consider when creating choropleth maps", 2017
- Datawrapper Academy, "Customizing your choropleth map"
- Datawrapper Academy, "How to create a symbol map"
- Datawrapper Academy, "Map projections used in Datawrapper maps" (art. 354)
- Datawrapper Blog, "New in symbol and choropleth maps: cropped view and inset maps", 2022
- Karim Douïeb, "Land doesn't vote, people do", 2019
- Howard Wainer, "The Most Dangerous Equation", American Scientist, 2007
- Stan Openshaw, The Modifiable Areal Unit Problem, 1984
- W. S. Robinson, "Ecological Correlations and the Behavior of Individuals", American Sociological Review, 1950
- Terry Slocum et al., Thematic Cartography and Geovisualization, 3rd ed., 2009
- Alberto Cairo, The Truthful Art, 2016
- Lisa Charlotte Muth, "When to use classed and when to use unclassed color scales", Datawrapper Blog, 2021
- Lisa Charlotte Muth, Datawrapper Blog / musings on bivariate maps, 2022
- George Jenks, "The Data Model Concept in Statistical Mapping", 1967
- Cynthia Brewer & Linda Pickle, "Evaluation of Methods for Classifying Epidemiological Data on Choropleth Maps in Series", Annals of the AAG, 2002
- Mark Harrower & Cynthia Brewer, "ColorBrewer.org", The Cartographic Journal, 2003
- Mark Monmonier, How to Lie with Maps, 1991
- Claus Wilke, Fundamentals of Data Visualization, 2019
- Borland & Taylor, "Rainbow Color Map (Still) Considered Harmful", IEEE CG&A, 2007
- James Flannery, "The Relative Effectiveness of Some Common Graduated Point Symbols...", Cartographica, 1971
- NPR Visuals (Danny DeBelius, Alyson Hurt), "Let's tessellate: Hexagons for tile grid maps", 2015
- Judy M. Olson, "Noncontiguous Area Cartograms", The Professional Geographer, 1976
- Daniel Dorling, "Area Cartograms: Their Use and Creation", CATMOG 59, 1996
- Bojan Šavrič, Tom Patterson & Bernhard Jenny, "The Equal Earth map projection", IJGIS, 2018
- ICA Commission on Map Projections, "Choosing World Map Projections" (factsheet)
- Joshua Stevens, "Bivariate Choropleth Maps: A How-to Guide", joshuastevens.net, 2015
- Axis Maps, "Bivariate Choropleth" (Cartography Guide)
- Barbara Tversky, Julie Morrison & Mireille Bétrancourt, "Animation: can it facilitate?", IJHCS, 2002
