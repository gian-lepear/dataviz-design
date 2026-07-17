# Data table design
> Reference for the dataviz-design skill. Load when: creating or reviewing any data table — admin grid, list with sort/pagination, a table in a dashboard/report, cells with heatmaps/bars/sparklines, totals/subtotals, row selection, and bulk actions.

## Alignment and numeric typography
A table is read by scanning vertically: the eye compares magnitudes going down the column, digit by digit (ones, tens, hundreds). Alignment and fixed-width digits are what make that comparison effortless; any deviation (centering, proportional fonts, inconsistent precision) breaks the scan. This is the foundation of any numeric table — more important than any decoration.

**Rules:**
- Right-align numbers because we compare magnitude from right to left (ones → tens → hundreds); right-aligned, decimal places and orders of magnitude stack up — Few, Show Me the Numbers, 2004/2012; Ström 2016
- Left-align text because Latin reading starts at the left edge and labels of differing widths create an unreadable ragged edge when centered — Few 2004
- Align the header the same as the column content (numbers right, text left); a misaligned header breaks the vertical scan line — Few 2004
- Never center numeric columns: centering misaligns the orders of magnitude and makes vertical comparison impossible — Wilke, Fundamentals of Data Visualization, 2019; Ström 2016
- Use tabular lining figures (`font-variant-numeric: lining-nums tabular-nums`): identical-width digits stack ones over ones; proportional or oldstyle digits misalign columns — Rutter, A List Apart, 2017
- Pick ONE negative convention and keep it across the whole column: accounting parentheses `(1,234)` or a minus sign `−1,234`, with the sign in a fixed position (not butted against the first digit) so the orders of magnitude stay stacked; parentheses are the financial convention, the minus the general one — reinforce with semantic color, never color alone — IBCS 2021 (variance notation); Few, Show Me the Numbers, 2004
- Standardize the number of decimal places within each column (all with 1 place, or all with 0); mixed precision shifts the decimal point and misleads the reading of magnitude — Wilke 2019; Rutter 2017
- Put the unit in the header ('Consumption (MWh)') instead of repeating it in every cell: per-cell repetition is redundant ink and widens the column — Few 2012; IBCS Standards 1.2, 2021 (unit in the labeling, not in the data)
- Round to the precision the decision requires (e.g. '1.3M' instead of '1,300,000'): extra digits carry no information and widen the column — Datawrapper 2022
- Use a fixed-width, consistent date format (e.g. 2026-07-13 or 07/13/26 throughout the column): variable widths break the vertical scan just as much as proportional numbers — practice derived from Rutter 2017 / Few 2004

**Anti-patterns:** Numbers centered "because it looks symmetrical"; a value column in a font with proportional digits (Georgia, oldstyle — 1,111 ends up narrower than 8,888); inconsistent precision (12.5 / 3 / 0.25 / 1,204.7); $ repeated in 200 cells instead of once in the header; a centered header over a right-aligned numeric column.

## Grids, borders, and white space
The ink that delimits cells competes with the ink that carries data. The canonical delimitation hierarchy is: white space first, then subtle shading, and lines last — and even then only horizontal, light ones. A full grid (vertical + horizontal) is a spreadsheet inheritance, not a design choice: it fragments the data into little boxes and adds noise without improving readability.

**Rules:**
- Delimit rows and columns with white space first; add lines only when space alone doesn't separate them (a very wide or dense table) — Few 2004 (application of Tufte's data-ink, 1983)
- Eliminate vertical lines between columns: column alignment already does the separating; vertical rules only fragment — Wilke 2019; Rutter 2017 (a full border is "Victorian embellishment")
- When you do use horizontal lines, use only: one under the header, one at the footer, and optionally group separators — not between every data row — Wilke 2019
- If you need lines between rows, make them thin and light (1px, light gray ~#E5E5E5 on a white background), visually subordinate to the data — Few 2004
- Give rows a height ≈ 2× the text body (10pt font → 20pt row): less fuses adjacent rows, more disconnects the record from its own distant cells — Few 2004
- Prefer shading (subtle fill) over lines when white space isn't enough: fill delimits without cutting into the visual field — Few 2004
- Don't stretch the table to 100% of the container width: size columns to their content; huge gaps between columns break horizontal row tracking — Rutter 2017
- Separate logical groups of rows with extra vertical space (or a slightly stronger line) instead of repeating the group label on every row — Few 2004

**Anti-patterns:** A full Excel-style grid; black 1px+ borders darker than the data text; a full-width table with 3 short columns and 300px of gap; triple delimitation (a line between every row + zebra + hover); cramped cells (row < 1.5× font) that fuse adjacent rows.

## Zebra striping — when it helps, when it hurts
Zebra striping (alternating row background) exists for one function only: guiding the eye across a WIDE row without jumping to another record. The debate is real: Few and Rutter treat it as noise in most cases; Enders's empirical study (2008, n=2,276) found a modest accuracy gain and no loss. The synthesis: the benefit grows with width (number of columns) and table length, and the cost is visual noise — zebra is a conditional tool, not a default.

**Rules:**
- Use zebra only in wide (many-column) and long tables: that's where the eye loses the row while crossing it; in that scenario Enders measured a statistically significant accuracy gain in 3 of 8 tasks, with no worsening on the rest — Enders, A List Apart, 2008 (2,276 valid sessions)
- Don't use zebra in narrow tables (2-4 columns): the whole row fits in a single eye fixation and the stripe only adds noise — Datawrapper 2022 ("probably unnecessary or even confusing with few columns"); Few 2004
- If you do use it, use ONE light color, alternating row by row (not blocks of 2-3, not two colors): the format preferred by 31% of users and rejected by only 4% in Enders's preference study (n>1,200) — Enders 2008
- Keep the stripe contrast low (~3-5% darkening, e.g. #F7F7F7 on white): the stripe is a background guide, not information; high contrast degrades legibility — Enders 2008; Few 2004
- In an interactive table, consider row hover-highlight as a substitute for zebra: it delivers tracking on demand without permanent noise — NN/g, Data Tables: Four Major User Tasks, 2022
- Never let the zebra encode meaning by accident (e.g. the stripe always landing on even months): readers assign meaning to visual patterns — Cairo, The Truthful Art, 2016
- Zebra is no substitute for spacing: if the rows are too cramped to read, the fix is row height, not striping — Few 2004

**Anti-patterns:** Zebra out of habit in a 3-column table; dark stripes (medium gray) reducing text contrast; zebra + horizontal lines + vertical borders stacked together; two alternating colors or multi-row blocks (worst preference in Enders); a total row painted by the zebra like ordinary data.

## Density: compact vs comfortable
Density is a trade-off between rows visible per screen (comparison, expert user) and reading/touch comfort (spot reading, per-row action). There's no universally correct density — there's a correct density per task; that's why mature enterprise grids offer a toggle and persist the choice. Market presets converge on three steps.

**Rules:**
- Offer density presets in three steps — condensed ~40px, regular ~48px, relaxed ~56px row height — steps consolidated across data-grid design systems — Setproduct, Data Table UI Design Guide, 2024; Material Design (52dp baseline)
- Use dense when the task is comparing/scanning many records (analyst, admin): more rows per viewport reduces scrolling and keeps more data in the eyespan; use relaxed when each row gets individual reading or actions — Setproduct 2024; Pencil & Paper 2022
- Persist the density choice per user (session/account): reconfiguring on every visit is a repeated interaction cost — Pencil & Paper 2022
- Even in dense mode, don't drop below ~1.5× the font body in row height; the reading ideal is ~2× (10pt → 20pt) — Few 2004
- If the row is a click/tap target (opens a detail view), keep its height ≥44-48px in the default mode — the minimum touch-target size — Apple HIG (44pt) / Material Design (48dp)
- A minimum horizontal padding of ~16px between columns; less fuses columns, much more breaks row tracking — Material Design data tables; Rutter 2017
- In a single-line cell, use a line-height near 1 and control the breathing room via vertical padding: a high line-height in a single-line cell only inflates the row without grouping anything — Rutter 2017

**Anti-patterns:** A single "comfortable" density on a working grid of 200 rows/day; a compact mode that fuses rows (height < 1.5× font); a density toggle that resets on every reload; increasing density by shrinking the font below ~12-13px instead of reducing padding; a 32px row as the only click target in a touch app.

## Long tables: sticky header/column, pagination, infinite scroll, virtualization
As soon as the table exceeds one screen, the problem becomes orientation: knowing what each column means, which record a given row is, and where I am in the set. A frozen header/column solves orientation within the screen; the loading mechanism (pagination, load more, infinite scroll, virtualization) solves orientation within the set — and each one serves a different task (navigating deliberately vs. leafing through vs. analyzing thousands of rows).

**Rules:**
- Freeze the header when the table exceeds 1 viewport in height: without it the user loses the meaning of the columns and has to scroll back up — NN/g 2022
- Freeze the first column (the record identifier) when there's horizontal scrolling: values without the row's identifier are unreadable — NN/g 2022
- Signal the freeze with a subtle shadow/elevation on the header and the pinned column during scroll: the depth cue explains why that band doesn't move — NN/g 2022
- Use numbered pagination when the user navigates deliberately and needs a sense of position and return ('page 3 of 12'), typical of admin/back-office screens — NN/g; Baymard Institute (tests with 50+ e-commerce sites)
- Prefer a 'Load more' button + lazy-loading over infinite scroll and over pagination for exploratory lists: in Baymard's tests users saw more items than with pagination and paid more attention per item than with infinite scroll — Baymard Institute
- Avoid infinite scroll in search results and on screens with a footer: it destroys the sense of position, prevents returning to an item ("I was on page 4" no longer exists), and makes the footer unreachable — Loranger/NN/g, 2014; Baymard
- For analytical grids with thousands of rows, use virtualization (rendering only the visible rows): a full DOM freezes the browser; the cost: it breaks Ctrl+F and the scrollbar position becomes the only compass — established practice (AG Grid/TanStack docs); Pencil & Paper 2022
- Always show the total count and the current range ('1–50 of 1,234'): without it the user doesn't know the size of the set or whether filtering is worthwhile — Pencil & Paper 2022; NN/g 2022
- A static table (no pagination/sticky) should fit in ~1 screen height; if it doesn't, adopt one of the mechanisms above — Datawrapper 2022

**Anti-patterns:** An 80-row table with no sticky header; infinite scroll on an admin screen where you return to specific records; horizontal scroll with no frozen identifier column; pagination with no total count or current page; virtualization with a scrollbar that changes size on every load; a page size of 10 on a working grid.

## Charts inside the table: heatmap, inline bars, sparklines
Embedding a chart in the cell turns the table from a lookup device (read one value) into a pattern device (see outliers and trends across the set). A heatmap uses color (low rank in perceptual precision — Cleveland & McGill), bars use length (high), sparklines give a time series at typographic resolution (Tufte). The golden rule: the embedded chart shows the pattern, the printed number keeps the precision.

**Rules:**
- Use a heatmap-table when the question is "where are the extremes/patterns" and not "what is the exact value": color is read in parallel by the eye but has low decoding precision — Cleveland & McGill, JASA, 1984; Datawrapper
- Keep the numbers visible inside the heatmap cells (or one click away): color alone doesn't support reading a value — Cleveland & McGill 1984; Few 2012
- Apply ONE single gradient to all columns that share the same metric/scale, and distinct gradients for distinct metrics: one gradient per column with different scales suggests false comparability — Datawrapper 2022
- Prefer a stepped scale when the reader needs to group values into bands, and a continuous one for the overall pattern; state the scale's min/max — Datawrapper
- Inline bars require a zero baseline: a bar encodes value by length; a truncated bar lies — Few 2012; Cairo 2016
- Reserve the inline bar for the most important column (1, at most 2 columns) and make it wider than a numeric column: a bar per column becomes clutter and compresses everything — Datawrapper 2022
- Print the numeric value next to the bar (end of the bar or an adjacent column): the bar gives the ranking and the number gives the precision — Few 2012
- A sparkline in a table row: no axes, word-sized, with markers only at min/max/last value — its function is the shape of the trend, not reading values — Tufte, Beautiful Evidence, 2006
- Beware the default of an independent y-range per sparkline (Datawrapper's default): it compares SHAPE across rows, not MAGNITUDE; if the question is magnitude, normalize the axis across rows and say so in the legend — Datawrapper 2022; Few 2012
- For variances (+/-), use two-way semantic color (e.g. red for negative) with a printed sign, never color alone: ~8% of men have a color vision deficiency — IBCS 2021 (variance notation); WCAG practice

**Anti-patterns:** A heatmap with no numbers and no scale legend (decorative stained glass); one auto-scaled gradient per column inviting invalid horizontal comparison; an inline bar starting at a value ≠ 0 to "amplify differences"; a sparkline with an axis, gridlines, and dots at every value; sparklines with independent y-ranges presented as a volume comparison; an inline bar in 6 of the 8 columns.

## Sorting: affordance and visible state
Sorting is the #1 interaction of an interactive table, and it fails in two ways: the user doesn't discover that they can sort (missing affordance) or doesn't know how the table is currently sorted (invisible state). The header arrow is an indicator of CURRENT STATE, not a button for a future state — a classic confusion documented since 2007. The default order is also a design decision, not a database accident.

**Rules:**
- Signal sortable columns with a pointer cursor + a sort icon (persistent or on hover): a header that looks like static text doesn't invite a click — NN/g 2022; design systems (TanStack, Material)
- Show the filled/highlighted arrow ONLY on the actively sorted column, with the direction reflecting the current state (↓ = descending now): an equally weighted arrow on every column hides which sort is applied — Gervase Markham, Column Sorting Usability Results, 2007; Material Design spec
- Subtly highlight the sorted column (heavier header weight or a subtle background): whoever arrives at an already-sorted table needs to read the state without interacting — Digital Artisans, Table Sorting UX polls; Material Design
- Set the default sort by importance to the task (most recent first, highest value first), not alphabetical or database insertion order: the first dozen rows are what 90% of users read — Datawrapper 2022; NN/g 2022
- Consider sorting by an invisible column when the right order isn't any displayed column (e.g. cities by population without showing population) — Datawrapper 2022
- Use a stable sort with a defined secondary key (tie in value → sort by name): ties that reshuffle on every click look like a bug — established engineering practice
- When re-sorting, return to page 1 / the top: keeping the user on page 7 of an order that no longer exists shows a meaningless slice — Pencil & Paper 2022
- Click cycle: asc → desc → (optional) no sort; never more than 3 states, and the 'no sort' state only if the natural order carries meaning — design-system convention (Material, Carbon)
- Mark the active column with `aria-sort="ascending"|"descending"` on the `<th>` — and ONLY on it, moving the attribute when the sort changes: this is how the screen reader announces which column is sorted and in which direction; the visual arrow doesn't exist for assistive technology — W3C ARIA APG, Sortable Table; MDN, aria-sort
- Make the sortable header keyboard-operable by wrapping the text in a `<button>` (Enter/Space sorts via the button's native behavior), instead of a mouse `onclick` on a bare `<th>`: an element with no button role receives neither focus nor keypress — W3C ARIA APG, Sortable Table
- Hide the purely decorative arrow from the screen reader (`aria-hidden` on the icon) and signal the sort capability in off-screen text, without repeating "sortable" in the accessible name of every button: a ▲/▼ character read aloud pollutes the announcement — W3C ARIA APG, Sortable Table

**Anti-patterns:** Sortable headers indistinguishable from static ones; identical gray arrows on every column all the time; a table that opens sorted by internal database ID; a sort that doesn't reset pagination; an arrow indicating a future action on one screen and the current state on another; ties that swap position on every re-sort; a `<th>` clickable by mouse only, with no `<button>`, inaccessible by keyboard; `aria-sort` on every column (or on none); ▲/▼ exposed to the screen reader as text.

## Selection and bulk actions
Acting on many records at once is a table task in its own right (the fourth of NN/g's four canonical tasks), with two specific failure points. First, the ambiguity of "select all": does the header checkbox mark the visible page or the entire filtered set? Second, the perceived irreversibility: firing a destructive action on N rows with no visible count and no undo. The canonical design is a per-row checkbox → a contextual bar with the count → an explicit escalation when the selection extends past the page.

**Rules:**
- Put a per-row checkbox in the first column (before the identifier) as the multi-selection mechanism: it's the canonical entry point for any batch action — NN/g, Data Tables: Four Major User Tasks, 2022
- Make the header checkbox select, by default, only the VISIBLE PAGE, not the entire off-screen set: blindly marking thousands of unseen records is a destructive surprise — Shopify Polaris (IndexTable/ResourceList, selection across pages); Gmail pattern
- When the filtered set exceeds the page, offer an explicit escalation "Select all N" (e.g. '50 on this page selected — Select all 1,234'): without it the user applies the action to just the page, thinking they got the whole slice — Shopify Polaris (paginatedSelectAllAction/Text); Gmail/GitHub pattern
- Support filter-first-then-select: the real path to high-volume bulk is to narrow by filter and then use select-all over the entire slice — NN/g 2022
- As soon as there's a selection, show a contextual action bar with the count ("N selected") and the available actions; it can replace the header (saving height), sit above/below it, or float over the table — NN/g, Data Tables, 2022; NN/g, Bulk Actions: 3 Design Guidelines
- Show in the bar the exact count of what's selected and a way to clear the selection: "N selected" is the state the user checks before firing — NN/g, Bulk Actions: 3 Design Guidelines
- Preserve the selection when paginating/sorting within the same slice: a selection that evaporates on page turn forces redoing everything and induces partial action — data-grid practice (Polaris/DataTables)
- Give explicit feedback about what happened after the bulk action and, especially for a destructive action, offer undo: without that safety net the bulk is irreversible in the user's perception — NN/g, Bulk Actions: 3 Design Guidelines
- For a PER-ROW action, keep only 1-2 inline actions and collapse the rest into a per-row kebab menu (⋮): more than two inline actions clutter, and hiding everything on hover hurts discoverability and accessibility — NN/g, Data Tables, 2022
- Don't let the total or subtotal row enter the selection or receive a bulk action: an aggregate isn't an actionable record (aggregate ≠ observation) — see the Totals section

**Anti-patterns:** A header checkbox that silently marks the entire off-screen set; a "select all" that doesn't distinguish the visible page from the filtered slice; an action bar with no count of what's selected; a selection that vanishes on paginate or re-sort; a bulk delete with no confirmation and no undo; 5 inline actions per row competing with the data; a kebab hiding the most-used primary action.

## Columns: count, order, width, and truncation
Humans scan better vertically than horizontally, so each added column costs more than each added row. The first column carries the record's identity and is sacred; the rest are ordered by importance to the task, with related columns adjacent. Truncation is acceptable in descriptive text, never in the identifier or in numbers.

**Rules:**
- Structure the data with more rows than columns when there's a choice: we scan vertically aligned information far more easily than horizontal — Datawrapper 2022
- Make the first column a human-readable identifier (name, title), never a generated ID ("mystery meat"): it's the anchor of all reading of the row — NN/g 2022
- Never truncate the identifier column; if it's long, wrap it onto two lines or widen it: a cut-off identifier makes the record impossible to find — NN/g 2022
- Order columns by importance to the task and keep compared columns side by side: comparing distant columns forces the eye to go back and forth — NN/g 2022
- Offer hiding/reordering columns at a low interaction cost (a column menu, not drag-and-drop only) and visibly indicate that there are hidden columns — NN/g 2022
- Narrow columns with header abbreviations, icons, and shortened/rounded numbers ('1.3M'): a verbose header dictates wasted width for the entire column — Datawrapper 2022
- Truncate descriptive text with an ellipsis + the full value in a tooltip/row expansion: cut-off text with no recovery is lost data — NN/g 2022; Pencil & Paper 2022
- Never truncate numbers — round them; '1,234.5…' is unreadable, '1.2M' is information — derived from Few 2012 + Datawrapper 2022
- On mobile, don't squeeze all the columns: pick 2-3 priority columns and collapse the rest into an expandable row or a detail card — NN/g, Mobile Tables, 2019
- Size each column to its content (numeric ones narrow, text wider), without stretching to fill the container — Rutter 2017

**Anti-patterns:** First column = a database UUID/ID; the region name truncated ("Northe…") while "Status" has space to spare; 15 columns visible by default because "the data exists"; compared columns separated by 6 others; a header "Average consumption per consuming unit" dictating a 300px column for 5-character values; a 10-column desktop table identical on mobile with 8px font.

## Totals, subtotals, and grouping
A total is an answer, not an ordinary row: it needs to stand out typographically and occupy a predictable position. The Western convention (accounting and IBCS) places totals AFTER the details — below the child rows, to the right of the columns — and highlights them with weight, not decoration. Subtotals structure groups and should be delimited by space/position, not by repeating labels.

**Rules:**
- Place the total row below the details it sums (and the total column to the right): the conventional accounting reading position, unified by IBCS (parent rows below child rows) — IBCS Standards 1.2, 2021; accounting practice
- Highlight the total with bold and a separator rule above (single rule; double only on the grand total), not with a garish background color: typographic weight distinguishes without competing with the data — Few 2004/2012; typographic-accounting convention
- In tables that span multiple pages/screens, repeat or position the summary in the group header: the reader shouldn't have to scroll to the end to know the aggregate — Few 2012
- In a long interactive grid, pin the totals row as a sticky footer: the aggregate is a constant reference during scroll — Pencil & Paper 2022 (extension of Few's principle)
- Delimit groups with extra white space + a bold subtotal, showing the group label ONCE (a merged cell or a group header): repeating the label on every row hides the structure — Few 2004
- Exclude the total row from the zebra, the sort, and the heatmap: a total sorted into the middle of the data or painted by the details' scale is a category error (aggregate ≠ observation) — derived from Few 2012 + Datawrapper 2022
- Sum percentages only when the sum means something (composition = 100%); never sum percentages from different bases — state the base of the % in the header — Few 2012; Cairo 2016
- When mixing scales in the same table ($ and %, thousands and millions), signal the per-column scale with an explicit indicator: reading assumes a single scale by default — IBCS 2021 (scaling indicators)
- If the table has ONE aggregate message (e.g. the month's total), consider promoting it to a KPI above the table instead of hiding it in the last row — Few, Information Dashboard Design, 2006

**Anti-patterns:** A total at the top when the rest of the app conventions it at the bottom; a total row identical to the data rows; a total participating in the sort and appearing in the middle; subtotals repeating the group name across 40 rows; a sum of percentages from different bases (an average disguised as a total); a grand total painted by the heatmap gradient as an outlier.

## Sources
- Stephen Few, Show Me the Numbers, 2004 (2nd ed. 2012)
- Stephen Few, Information Dashboard Design, 2006
- Richard Rutter, Web Typography: Designing Tables to be Read, Not Looked At, A List Apart, 2017
- Claus Wilke, Fundamentals of Data Visualization, 2019
- Matthew Ström, Design Better Data Tables, 2016
- Edward Tufte, The Visual Display of Quantitative Information, 1983 (data-ink); Beautiful Evidence, 2006
- Cleveland & McGill, Graphical Perception, JASA, 1984
- IBCS Standards 1.2, Hichert & Faisst, 2021
- Lisa Charlotte Muth, What to consider when creating tables / heatmaps / sparklines, Datawrapper Blog/Academy, 2022
- Jessica Enders, Zebra Striping: Does it Really Help? / More Data for the Case, A List Apart, 2008
- Nielsen Norman Group, Data Tables: Four Major User Tasks, 2022; Mobile Tables, 2019; Bulk Actions: 3 Design Guidelines
- W3C WAI-ARIA Authoring Practices Guide (APG), Table pattern / Sortable Table Example; MDN Web Docs, aria-sort
- Shopify Polaris, IndexTable / ResourceList (bulk actions and selection across pages)
- Hoa Loranger, Infinite Scrolling Is Not for Every Website, NN/g, 2014
- Baymard Institute, pagination vs load-more vs infinite-scroll tests
- Pencil & Paper, Data Table Design UX Patterns / Enterprise Data Tables, 2022
- Setproduct, Data Table UI Design Reference Guide, 2024
- Google Material Design / IBM Carbon, Data Table specs; Apple HIG
- Gervase Markham, Column Sorting Usability Results, 2007
- Alberto Cairo, The Truthful Art, 2016
- AG Grid / TanStack docs (virtualization)
- Digital Artisans, Table Sorting UX polls
