# Worked examples: before/after and reference snippets

> Reference for the dataviz-design skill. Load when: you need a concrete before/after model of a fix, or a reference snippet to generate/adjust a chart.

The skill states the rules; this file shows the output. Each case names a common error family, gives the **Bad** chart (with the § of the rule it breaks), the **Good** chart that fixes it, and a minimal, correct **snippet** to use as a template. The pseudo-config snippets are declarative and library-neutral — read the field names as intent and map them onto your library's API. The HTML+SVG snippets are self-contained.

## Bar axis that doesn't start at zero

**Bad:** a vertical bar chart of packages processed per distribution center (DC North 812, DC South 764, DC East 731) with the Y axis starting at 700. DC North becomes a bar ~4× taller than DC East, implying nearly four times the volume where the real difference is ~11%. Breaks §15 (a bar on a truncated axis — length is the encoding, and truncating it lies) and Tufte's lie factor. A bar is a Magnitude form: the channel is length from zero.

**Good:** Y axis anchored at zero; the bars come out nearly equal, which is the truth. If the goal is to highlight the small gap between close leaders, swap the bar for a dot plot (a dot encodes by position and needs no zero baseline) or plot the deviation against target — don't truncate the bar. Put a value label on top of each bar for anyone who needs the exact number.

```
# illustrative format, adapt to your library
type: vertical-bar
yAxis: { min: 0 }                    # NEVER truncate a bar — §15
valueLabel: top
data:
  - { label: "DC North", value: 812 }
  - { label: "DC South", value: 764 }
  - { label: "DC East",  value: 731 }
# real difference ~11%; if that's the message, use a dot plot or deviation vs target,
# not a zoom that manufactures a 4× effect.
```

## Pie chart with too many slices to compare

**Bad:** a pie chart of support tickets by category with 8 slices (Billing, Login, Delivery, App crash, Refund, Sign-up, Password, Other) and a side legend of 8 colors. To tell whether "Login" edged past "Delivery" the eye has to compare the angles of non-adjacent slices and match each color to the legend. Breaks §12 (angle/area is a weak encoding; precise comparison needs position/length) and §11 (comparable part-to-whole = bar chart; a pie only with few slices and an obvious difference). Cleveland & McGill: judging angle is among the worst channels.

**Good:** a horizontal bar chart sorted by descending value, category labels flush left, the value at the end of each bar. The ranking is obvious, comparing neighbors is trivial, and the long tail collapses into a single aggregated "Other" row. If the fraction of the whole really has to be read, one 100% stacked bar carries the proportion without losing the comparison between segments.

```
# illustrative format, adapt to your library
type: horizontal-bar
sort: value-desc                     # ranking, not alphabetical — §11/§12
xAxis: { min: 0 }
data:
  - { label: "Billing",   value: 1240 }
  - { label: "Login",     value:  980 }
  - { label: "Delivery",  value:  610 }
  - { label: "App crash", value:  520 }
  - { label: "Refund",    value:  410 }
  - { label: "Other",     value:  300 }   # aggregates the tail of small slices
```

## Every series colored, no gray for context

**Bad:** a line chart of monthly energy use for 6 manufacturing plants, each line in a strong color from the qualitative palette, a legend with 6 entries. It turns into colored spaghetti: six preattentive cues competing, none wins, and the message ("Plant 4 blew past the ceiling in May") is lost. Breaks §14 (gray is the lead; everything colored = nothing highlighted — Knaflic) and §12 (spend ONE preattentive cue per chart to point at what matters).

**Good:** the 5 context plants in neutral gray, with no legend entry; only Plant 4 in the highlight color, labeled directly at the end of its line (no legend needed) and an annotation at the May point marking the overshoot. The eye goes straight to the story; the other five stay visible as a reference band without stealing attention.

```
# illustrative format, adapt to your library
type: line
series:
  - { name: "Plant 1", color: "#B8BEC6", endLabel: false }   # context gray
  - { name: "Plant 2", color: "#B8BEC6", endLabel: false }
  - { name: "Plant 3", color: "#B8BEC6", endLabel: false }
  - { name: "Plant 4", color: "#C24D2C", endLabel: true, width: 2 }  # the only highlight
  - { name: "Plant 5", color: "#B8BEC6", endLabel: false }
  - { name: "Plant 6", color: "#B8BEC6", endLabel: false }
legend: hidden                       # the highlighted series is labeled at its end
annotations:
  - { series: "Plant 4", at: "May", text: "above the ceiling" }
```

## Stacked bar where the message is the floating segment

**Bad:** a stacked horizontal bar of monthly cloud spend per service, each bar the full current cost split into "still paid" and "saved by migrating", ordered by current cost. The headline claims two services account for half the saving — and the saving is exactly the segment that does not touch the baseline. Only the base segment and the total read precisely; the middle floats, so comparing the saving across rows is the hardest judgement the chart offers. Breaks §12 (position on a common scale beats length on a shifting one) and the stacked-bar rule in references/tables.md (put the important category against the baseline; the middle ones float — Wilke 2019, Few 2012).

**Good:** a dumbbell. One dot for today, one for after, connected; both sit on the same horizontal scale, so both absolute levels read by position, the most precise channel available, and the segment between them is the change. Order rows by current cost, colour only the "after" dot, and carry the difference in a labelled column at the right. Where a row does not change, draw a single dot and say so — an empty connector is a value, not a gap. Prefer the dumbbell over a slope whenever the LEVEL matters alongside the change (Muth; Cleveland & McGill 1984).

```
form: dumbbell
scale: { min: 0, max: 440, unit: "USD/month" }      # one common scale for every row
rows:  sorted by value.today desc
marks:
  - dot: value.today   colour: neutral
  - dot: value.after   colour: accent
  - connector: today → after, colour: accent at 35%
label_column: { value: today - after, header: "saves", align: right }
unchanged_row: single dot, label "no change"
```

## Matrix left in alphabetical order

**Bad:** a 63-row by 4-column result matrix, one row per endpoint, each cell a pass count out of 10 over a colour fill, rows in alphabetical order. Every cell is painted, so the field saturates and nothing stands out; the nine rows that actually fail are scattered from top to bottom and the reader has to reconstruct the pattern by hand. Breaks §14 (everything coloured = nothing highlighted) and Bertin's reorderable matrix: the analytical act in a matrix is permutation, and alphabetical order destroys it.

**Good:** group the rows by behaviour and give each block a header naming it ("blocks in the US", "identical on both sides"). The failures collapse into one contiguous block that is visible before anything is read. Then drop the colour from the conforming cells — neutral fill, muted figure — and keep the strong colour for the exception only. The number stays in every cell, which is the redundant channel that colour alone would not provide. This is a status matrix, not a heatmap: the cell carries a nominal state, so use the status palette, not a sequential ramp, and give it a key rather than a min/max legend (see references/tables.md, "The status matrix").

```
form: status matrix
row_order: group by pattern, never alphabetical   # Bertin, reorderable matrix
group_header: names the pattern, one per block
cell: { value: printed always, fill: status palette }
fill_policy: conforming → neutral, exception → strong
legend: key mapping colour → meaning (not min/max)
align: centred — a grid of 1-2 digit codes is a mark grid, not a column of magnitudes
```

## A number with no baseline (raw KPI)

**Bad:** a giant card showing only "$128.4K" of recurring revenue. Is it going up or down? Good or bad? The number alone decides nothing. Breaks §6 (a number with no baseline is noise — every KPI gets a delta against prior period, target, or benchmark) and the trend rule (if the question is change over time, add a sparkline).

**Good:** the same hero number gets a delta with redundant sign and direction (arrow + text, not color alone — §5) against the prior month, and a word-sized sparkline alongside carrying the shape of the last few months. Three elements, one decision: level, change, and trajectory. The sparkline follows the spec (no axes, one color, last point marked — see references/chart-choice.md).

```html
<!-- illustrative format; inline styles only to anchor the example -->
<div class="kpi">
  <div class="kpi__label">RECURRING REVENUE (MRR)</div>
  <div class="kpi__value">$128.4K</div>
  <div class="kpi__delta kpi__delta--pos">▲ 6.2% vs prior month</div>
  <svg viewBox="0 0 100 28" width="100" height="28"
       role="img" aria-label="8-month trend, rising">
    <polyline fill="none" stroke="#2E7D5B" stroke-width="1.5"
      points="0,26 14,20 28,24 42,14 56,16 70,8 84,10 98,2"/>
    <circle cx="98" cy="2" r="1.8" fill="#2E7D5B"/> <!-- marks the last point -->
  </svg>
</div>
```

---

Where to dig deeper on each fix: zero baseline and lie factor in §15 + references/integrity-uncertainty.md; pie→bar and the hierarchy of channels in §11-12 + references/perception.md and references/chart-choice.md (sparkline spec); context gray + highlight in §14 + references/storytelling.md and references/color.md; delta/baseline and KPIs in §6 + references/kpi-metrics.md.

**Sources**
- William Cleveland & Robert McGill, Graphical Perception, JASA vol. 79, 1984
- Edward Tufte, The Visual Display of Quantitative Information (lie factor), 1983
- Edward Tufte, Beautiful Evidence (sparklines), 2006
- Cole Nussbaumer Knaflic, Storytelling with Data (gray + highlight), 2015
- Alberto Cairo, How Charts Lie, 2019
- Stephen Few, Information Dashboard Design, 2006
