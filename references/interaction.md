# Interaction in dataviz

> Reference for the dataviz-design skill. Load when: designing or reviewing interaction in an analytical screen — dynamic filters, drill (down/through/across), cross-filter/brushing across views, selection modes (single/multi/additive/lasso/range-brush), zoom/pan, tooltips, keyboard operation of controls, canceling a stale request during fast filtering, dashboard onboarding, or state in the URL (undo/reset/deep-link).

## Shneiderman's mantra and the 7 tasks (overview first, zoom and filter, details-on-demand)

The Visual Information-Seeking Mantra — "overview first, zoom and filter, then details-on-demand" — is the canonical order for both designing AND reading an analytical screen (Shneiderman, IEEE VL 1996, pp. 336-343). The paper pairs the mantra with a taxonomy of 7 tasks every tool should support: overview, zoom, filter, details-on-demand, relate, history, and extract. It is at once a screen-architecture blueprint and an audit checklist: each task needs an identifiable "home" in the interface.

**Rules:**
- Open the dashboard on an overview that shows 100% of the data universe (no filter pre-applied) and fits above the fold, because a user judges a slice only with the whole as a reference — Shneiderman 1996
- Every filtered state should show a "showing N of M" counter near the controls, because zoom/filter without a coverage indicator makes the user generalize from an invisible subset — Shneiderman 1996 (filter) + Ahlberg & Shneiderman 1994 (tight coupling)
- Move rare fields, long text, and secondary columns to a tooltip/side panel/click-triggered modal — detail is ON-DEMAND, not default — because permanent detail clutters the overview — Shneiderman 1996 (details-on-demand)
- Audit the screen against the 7 tasks: where is the overview? the zoom? the filter? the detail? the relate (linking between items)? the history (undo/back)? the extract (export the subset)? A task with no home = a design gap — Shneiderman 1996
- Offer export of the slice EXACTLY as filtered on screen (same criteria, same sort order), because analysis continues outside the tool and re-filtering in Excel duplicates work and drifts the numbers — Shneiderman 1996 (extract)
- For the recurring monitoring user, allow inverting the mantra (alerts/exceptions first, overview one click away), because the mantra describes exploring new data, not a daily routine — Craft & Cairns 2005 ("Beyond Guidelines")

**Anti-patterns:** A dashboard that opens already filtered to an arbitrary slice (e.g., the current month) without showing or signaling the whole; a default table with 15 columns above the fold (detail became overview); primary KPIs below the fold; a filter applied with no count of remaining items; no path to export the filtered subset (extract task missing).

## Munzner's framework: manipulate / facet / reduce

Munzner ("Visualization Analysis and Design", 2014, chs. 11-13) organizes every interaction choice into three families: MANIPULATE (change the view over time, select elements, navigate), FACET (juxtapose multiple views, partition data across views, superimpose layers), and REDUCE (filter, aggregate, embed/focus+context). The principle that arbitrates among them is "eyes beat memory": comparing side by side uses perception (cheap); toggling views over time uses working memory (expensive and fallible). It's the grammar for deciding WHETHER an interaction should exist at all, or whether two static views solve it better.

**Rules:**
- Prefer juxtaposing two views side by side (facet/juxtapose) over toggling via a toggle/tab/animation (manipulate/change), because visual comparison uses perception while toggling forces the user to remember the previous state ("eyes beat memory") — Munzner 2014, ch. 12
- Superimpose series on the same axis only up to ~4 distinguishable layers with a shared scale; beyond that, partition into small multiples with identical scales across panels — Munzner 2014, ch. 12
- Every selection needs two distinct encodings: hover (transient) and persistent selection (click), with immediate feedback, because select is the base operation of all linking and drill — Munzner 2014, ch. 11
- When the user's question is about the WHOLE, aggregate (reduce/aggregate) rather than filter, because filter hides data and invites conclusions about what became invisible; filter answers "which", aggregate answers "how much" — Munzner 2014, ch. 13
- Animate sort/encoding changes with a short transition (~0.5-1s) that preserves object identity (bar X "travels" to its new position), because an instant swap makes it impossible to track items across states — Heer & Robertson, InfoVis 2007; Munzner 2014, ch. 11
- Before adding any interaction, ask whether one extra static view removes the need for it, because interaction carries a cost: it's invisible until discovered and it hides state — Munzner 2014, ch. 11 (the cost of interactivity)

**Anti-patterns:** Tabs to compare things that require seeing them at once; 8+ series superimposed on one line chart instead of small multiples; filtering when the user wants the total (the "sum" number vanishes from the screen); a re-sort that teleports everything with no transition; hover and selection sharing the same visual style.

## Brushing & linking, cross-filtering, and Coordinated Multiple Views

Brushing was born in Becker & Cleveland ("Brushing Scatterplots", Technometrics 29(2):127-142, 1987): select a subset with a draggable "brush" and see it highlighted across every view of the same data (linking), with highlight/delete/label operations and transient vs persistent modes. Coordinated Multiple Views (Roberts's survey, CMV 2007; North & Shneiderman, AVI 2000) generalizes it: N views coordinated by selection, navigation, or filter. Cross-filtering is the dominant variant in dashboards (Tableau actions, Power BI, crossfilter.js): clicking a dimension in one view FILTERS the others — distinct from linked highlighting, which highlights without removing.

**Rules:**
- When highlighting a subset, dim the unselected (light gray) rather than removing them, because the dimmed whole is the reference for the comparison; removal destroys the context — Becker & Cleveland 1987
- Decide explicitly, per view, whether a click cross-FILTERS (removes) or cross-HIGHLIGHTS (shows the fraction within the total, like Power BI's default cross-highlight on bars), because highlighting preserves the denominator and filtering answers a different question — Roberts 2007; Power BI docs
- Linking must be bidirectional: selecting in the table highlights in the chart and vice versa, because one-way coordination trains the user to conclude that "it doesn't work" — Becker & Cleveland 1987; Roberts 2007
- Use ONE identical selection color across all coordinated views (and one that doesn't collide with series colors), because the link between views is perceived through the visual identity of the highlight — Munzner 2014, ch. 12
- Brush response under 100ms (frame by frame during the drag), because the technique relies on perceiving continuous motion; above that it becomes click-and-wait — Becker & Cleveland 1987; Card, Mackinlay & Shneiderman 1999 (0.1s threshold)
- Every active cross-filter produces a visible chip/badge ("filtered by: Queue N2 ×") removable in 1 click, and the source element stays marked as selected, because an invisible filter makes the user read wrong numbers without knowing it — Heer & Shneiderman 2012
- Provide a universal escape: click on empty space or press Esc to clear the selection/cross-filter, because a stuck selection with no obvious way out freezes the exploration — Roberts 2007; canonical Tableau/Vega-Lite practice
- When one click updates 4+ views at once, use a perceptible but short, staggered transition (~150-500ms — briefer than the ~0.5-1s assisted re-sort above, since this is live interaction where every ms delays the next click) to make clear WHAT changed, because silent simultaneous changes suffer change blindness — Heer & Robertson 2007

**Anti-patterns:** A click that removes the other data when the question was "what fraction of the total is this"; only some charts clickable with no affordance; highlight with no dimming of the rest; a cross-filter that blanks other views with no empty message and no clear button; click-filters stacked on panel-filters with nowhere showing the active combination; a selection that only clears by reloading the page.

## Selection modes: replace, additive (Shift/Ctrl), lasso, and range-brush

Selecting is the base operation of all linking, cross-filter, and drill (see Munzner, above), but "selecting" hides a family of modes that change what a click or drag MEANS. Graham Wills (InfoVis 1996) formalized the taxonomy: each selection combines a MECHANISM (click, rectangle, lasso, axis band) with a LOGICAL OPERATOR over the already-selected set (replace, union, subtract, intersect, toggle). Getting that combination wrong — does the second click clear or add? — is the biggest source of "the filter did something I didn't ask for".

**Rules:**
- Define and signal, per view, the selection's combination operator — replace (a new click swaps), additive (Shift+click extends a contiguous range), toggle (Ctrl/Cmd+click turns an item on/off), subtract, intersect — because "select" without an explicit operator produces accidental selections and a set the user can't predict — Wills 1996 (selection taxonomy)
- Follow platform convention for modifiers: click replaces, Shift+click extends a range, Ctrl/Cmd+click toggles an item, because the user already brings this mental model from the file manager and spreadsheet; reinventing it forces relearning from scratch — platform convention (Apple HIG; Windows)
- Offer region selection wherever items have a spatial position: rectangle/range-brush over axes and time series, free lasso in scatterplots and point maps, because aiming item by item in a dense cloud is infeasible motor work — Wills 1996 (region mechanisms); Becker & Cleveland 1987 (rectangular brush)
- Separate a transient brush (holds only while the button is pressed, for exploratory sweeping) from a persistent selection (stays on release, to inspect, annotate, and export the slice), because they are two intents and a single mode forces choosing between exploring and retaining — Becker & Cleveland 1987 (transient vs persistent)
- On a range-brush over a continuous axis, let the user drag the edges to resize and the body to slide the whole window, with the numeric bounds always visible (e.g., a "Jan-Jun 2025" or "$80k-420k" window), because redrawing the band from scratch on every adjustment destroys the reference of the previous slice — Becker & Cleveland 1987; canonical practice (d3-brush)
- Show the selected set's count ("7 of 214 selected") with clear and invert in 1 gesture, because an invisible accumulated set leads the user to act on items they forgot they had marked — Shneiderman 1996 (visible coverage); Wills 1996

**Anti-patterns:** A second click clearing the selection when the user meant to add; Shift/Ctrl with no effect (click always replaces), forcing marking one by one; a dense scatterplot with no lasso or rectangle, forcing point-by-point aiming; a brush that always persists (no transient sweep) or never persists (vanishes on release, impossible to export the slice); multi-selection with no counter and no "clear"; an invisible combination operator — the user can't tell whether they're swapping, adding, or toggling.

## Dynamic queries and tight coupling (Ahlberg & Shneiderman)

Dynamic queries (Ahlberg & Shneiderman, CHI 1994; FilmFinder → Spotfire) replace the form→submit→wait cycle with widgets (sliders, checkboxes) that update the result within 100ms, continuously and reversibly. The coupled principle is tight coupling: the controls reflect the state of the data (real bounds, counts) and the output becomes the input to the next step — the system should make an empty query nearly impossible to build. Scented widgets (Willett, Heer & Agrawala 2007) extend this by embedding mini-visualizations in the controls themselves.

**Rules:**
- Apply filters immediately as the control moves, with no "Apply" button, with a result in <=100ms, because exploration depends on cause-and-effect perceived as motion — Ahlberg & Shneiderman 1994
- If the query is expensive (network/DB), debounce the input (~200-300ms) but give feedback in <100ms (spinner/skeleton on the affected view) and a result in <1s, because 0.1s = perceived as instantaneous and 1s = the limit of uninterrupted thought — Card, Mackinlay & Shneiderman 1999; Nielsen, "Usability Engineering", 1993
- The controls' bounds come from the data: a slider with the dataset's real min/max, a select with a per-option count ("Queue N2 (312)"), options with no results disabled or marked with 0 — because this prevents the empty query before it happens — Ahlberg & Shneiderman 1994 (tight coupling); Plaisant et al. (query previews) 1997
- Show the live result count next to the controls ("142 tickets match"), updated on every adjustment, because a zero-result discovered at the end is the biggest cost of a filtering flow — Ahlberg & Shneiderman 1994
- Embed a mini-histogram/frequency bars in the filter control itself (scented widget), because information "scent" in the widget significantly increased the number of discoveries and unique data points visited in a controlled study — Willett, Heer & Agrawala, IEEE TVCG 2007
- A continuous filter (slider) uses replaceState/no history per step; only the final settled state enters history, because every drag pixel becoming an undo/back entry breaks both — Heer & Shneiderman 2012 (history)

**Anti-patterns:** An "Apply"/"Search" button on filters that cost milliseconds; a slider with a hard-coded range (0-1,000,000) when the data runs from 80k to 420k; filter combinations that return 0 with no advance warning and no live count; recomputing the whole page on every keystroke with no debounce; an options dropdown with no counts, full of choices that come up empty.

## Async filtering: race conditions and canceling stale responses

The dynamic-query ideal — a result in <=100ms while dragging the control (section above) — collides with the real network: rapid keystrokes and adjustments fire overlapping requests, and a slower EARLIER response can arrive AFTER a faster later one, painting the screen with data the user already abandoned. Debounce (the tight-coupling rule above) tunes the QUANTITY of requests, but it doesn't order the RESPONSES. The fix demands "last one wins" discipline: cancel or discard every superseded response.

**Rules:**
- Beyond debounce, discard the stale response — cancel the in-flight request when firing the next one OR stamp each request with an id/sequence and render only the response of the most recent id — because debounce reduces the number of calls but doesn't stop an old response from arriving last and overwriting the current result — canonical async-UI practice (cancellation/takeLatest/request-id)
- Bind the rendered state to the input that produced it and paint only when the response matches the current filter; if it has diverged, discard it silently, because a screen and controls out of sync is worse than a slow screen — the user trusts a number that doesn't match the visible filters — Ahlberg & Shneiderman 1994 (tight coupling: the output reflects the current query)
- Treat cancellation as a normal flow, not an error: an aborted response doesn't become a red toast or a failure message, because the system itself discarded it — it's not the user's failure — canonical practice (AbortController/cancellation token)
- Until the correct response settles, mark the affected view as "updating" in <=100ms and never leave the old number looking current, because a stale value with no loading signal is read as truth (loading-state mechanics in references/performance-latency-states.md) — Card, Mackinlay & Shneiderman 1999 (0.1s threshold)
- For a continuous drag that triggers an expensive network call, cancel-and-redo rather than queue: discard the intermediate steps and resolve only the final settled state, because serving every intermediate position wastes work and still risks out-of-order results — canonical practice; see replaceState in the tight-coupling section above

**Anti-patterns:** Search-as-you-type that "flashes" results from 3 letters ago because the slow response arrived last; a cancellation error turning into a failure toast for the user; a KPI from an already-changed filter lingering on screen as if it were current; queuing every slider position and replaying a cascade of stale results; relying on debounce alone, assuming responses return in the order they left.

## Drill-down vs drill-through vs drill-across

Three distinct navigations that teams confuse: DRILL-DOWN descends the hierarchy in the same view (year→month→day; state→county), swapping the level and keeping the frame. DRILL-THROUGH crosses from the aggregate to the underlying records on another screen (from the chart to the list of rows that make up the number). DRILL-ACROSS crosses to another process/fact at the SAME level, possible only over conformed dimensions — Kimball's vocabulary. Choosing the wrong one (or not signaling which it is) yields unpredictable navigation and numbers that "don't add up".

**Rules:**
- In drill-down, keep the user in the same frame (same chart type, same position on screen), swapping only the level, with a clickable breadcrumb of the path (USA › California › San Jose), because the breadcrumb is the only visible record of the accumulated context — Few, "Information Dashboard Design" 2nd ed., 2013
- Drill-through opens the record list ALREADY filtered by every coordinate of the clicked point (dimension + period + active global filters) and declares the slice in the title ("Tickets · Queue N2 · CA · Mar 2026"), because the user will check whether the list's sum matches the clicked number — and it HAS to match — Kimball & Ross, "The Data Warehouse Toolkit" 3rd ed., 2013
- Offer drill-across only between facts that share conformed dimensions (same keys and labels); if the cuts don't correspond 1:1, don't build the link, because comparing incompatible grains produces a false conclusion — Kimball & Ross 2013
- Consistent affordance: EVERYTHING that drills has a pointer cursor + hover state; nothing that doesn't have one — because inconsistent affordance teaches the user to stop trying to click — Few 2013; Norman, "The Design of Everyday Things" (perceived affordances)
- Every drill has a cheap way back: breadcrumb or "level up" in 1 click, and the browser back button works (pushState per drill step), because back is the reversal gesture the user tries first — Shneiderman 1996 (history); Heer & Shneiderman 2012
- Limit drill-down to ~3 levels before switching to drill-through (a list), because below a certain cardinality the aggregate becomes 1-2 items per bar and the real question is already "which records" — Few 2013

**Anti-patterns:** A click on a point that opens a report WITHOUT applying the point's filter (the source number doesn't match the destination); a drill that changes the chart type (bar becomes pie); depth 3+ with no breadcrumb; drill-through opening in a new tab and losing the source's global filters; drill-across between metrics with different periods/cuts presented as a direct comparison.

## Semantic vs geometric zoom and multiscale navigation

Geometric zoom only scales pixels; semantic zoom (Perlin & Fox, "Pad", SIGGRAPH 1993) changes the REPRESENTATION with scale — zoomed out, it aggregates and simplifies; zoomed in, it reveals detail and labels (clusters→points→names; day→week→month in a series). The multiscale navigation alternatives — pan&zoom, overview+detail (an always-visible minimap/context), and focus+context (fisheye) — were systematized in Cockburn, Karlson & Bederson's survey (ACM Computing Surveys 41(1), 2009). The central risk of pure pan&zoom is "desert fog": getting lost in a viewport with no reference at all (Jul & Furnas, UIST 1998).

**Rules:**
- When zooming out of a dense time series, aggregate (mean + min-max band, or an LTTB-style downsample) instead of rendering thousands of scaled points, because geometric zoom on dense data becomes overplotting with no information — Perlin & Fox 1993 (representation by scale); Munzner 2014 (reduce/aggregate)
- On a point map, use clustering with a count on the marker at zoomed-out levels and switch to individual labeled points at the local level, because the task changes with scale: "where does it concentrate" → "which one is this" — Perlin & Fox 1993
- When the user needs to know where they are in the whole (a long series, a large map), use overview+detail: a compact overview with a brush that defines the detail window (brush-to-zoom), because permanent context eliminates the desert fog of pure pan&zoom — Jul & Furnas 1998; Cockburn, Karlson & Bederson 2009
- Every zoom has a 1-gesture reset (double-click or a "see all" button visible while the zoom is active), because the cost of getting lost must be ~zero for the user to dare to explore — Shneiderman 1996 (history); Jul & Furnas 1998
- Never hijack the page scroll for chart zoom without a modifier (require Ctrl/Cmd+scroll or a mode button), because scrolljacking breaks navigation of the entire document — canonical web-map practice (Leaflet/Mapbox); Cockburn et al. 2009
- Sync the zoom window across comparable views of the same time axis, because comparing different periods while thinking they're the same is a silent error — Roberts 2007 (coordination by navigation)

**Anti-patterns:** A zoom that only enlarges pixels and keeps 50k points on screen; a map with no clustering and thousands of overlapping pins at country level; pan&zoom with no minimap and no position indicator; an active zoom with no visible reset button; wheel-zoom capturing the whole page's scroll; two side-by-side series with desynchronized zoom windows presented as a comparison.

## Hover and tooltip: timing, content, multi-series, and touch

The tooltip is the cheapest details-on-demand and the most poorly executed. NN/g gives numeric timing: visual hover feedback within 0.1s; hidden content only after 0.3-0.5s of a stationary cursor (so it doesn't open on a fly-by); kept visible until ~0.5s after the cursor leaves (to let the user reach the content). Datawrapper sums up the content: little formatting (bold + one larger size), 1-2 highlights, and the tooltip should add information, not repeat what's visible. On touch there is no hover — the design needs an alternative path.

**Rules:**
- Highlight the element under the cursor in <=0.1s, but open the tooltip only after 0.3-0.5s of a stationary cursor, because opening on pass-through makes the screen flicker on every mouse move — NN/g, "Timing Guidelines for Exposing Hidden Content", 2021
- On a multi-series chart, use a shared tooltip anchored on x (a vertical crosshair) listing ALL series at that point, ordered by value and with the nearest series emphasized, because comparing series at the same instant is the whole reason for hovering — and aiming line by line demands unfair motor precision — Datawrapper Academy; canonical Highcharts/Observable Plot practice
- Tooltip content = full label + formatted value (thousands separator, unit, % or change), never just what the axis already shows, because a tooltip that repeats the visible is noise — Datawrapper Academy ("every tooltip should add information")
- Widen the hit area with voronoi/nearest-point (the hover "snaps" to the nearest point), because chasing a 4px point is needless fine motor work; on touch, effective target >=44pt — d3-voronoi practice; Apple HIG (44pt)
- Allow pinning the tooltip with a click when it contains a link/action or when comparing two points matters, because hover is volatile and there's no double hover — Heer & Shneiderman 2012 (select/annotate)
- Position the tooltip to never cover the active point or spill out of the viewport (flip sides near the edges), because a tooltip over the data denies the data itself — NN/g, "Tooltip Guidelines", 2019
- No CRITICAL information can live only in hover: on touch and in print/screenshot the hover doesn't exist; offer tap-to-show and make sure the main message is fixed on the screen — Datawrapper Academy (test mobile); NN/g 2019
- At most ~2 formatting styles inside the tooltip (bold + larger size on the key value), because a tooltip is a 1-second read, not a card — Datawrapper Academy

**Anti-patterns:** A tooltip that opens instantly on any pass-through (a "flickering" screen); one tooltip per series requiring you to aim at each 2px line; a tooltip covering the point/bar being read; the main insight reachable only via hover (invisible on mobile); a giant tooltip-table with no pin option; repeating in the tooltip exactly the axis label with no added value.

## Operating interaction by keyboard: controls and coordination across views

Every interaction this reference governs — filter, select, cross-filter, drill, pin a tooltip, reset — must exist without a mouse. If the tooltip on touch (previous section) covers the absence of hover, the keyboard covers the absence of a pointer. The reference pattern for governing focus across GROUPS of controls is the WAI-ARIA Authoring Practices Guide (composite widget: Tab enters the group, arrows move within it via roving tabindex; Enter/Space activates; Esc dismisses). Point-to-point navigation WITHIN the chart, the focus indicator, and the WCAG conformance numbers belong to references/accessibility-mobile.md — here we cover operating the interaction LAYER: controls and coordination across views.

**Rules:**
- Give a predictable focus order controls → views → detail, with a single tabstop per GROUP of controls (a list of filter chips, a toggleable legend, a segmented control) and arrows to navigate within the group, because 40 chips = 40 Tab stops render the keyboard useless — W3C ARIA APG ("Developing a Keyboard Interface"; roving tabindex)
- Give every mouse interaction a keyboard equivalent: Enter/Space activates drill and selection; arrows adjust the slider and the range-brush edges by a step (PgUp/PgDn or ↑↓ for a larger step); Home/End go to the bounds, because coordination across views that only responds to a click excludes keyboard users — W3C ARIA APG
- Standardize Esc as the single escape across EVERY layer — closes a pinned tooltip, clears the selection/cross-filter, exits the zoom, closes the drill modal — always returning focus to the origin, because an exit key that changes behavior per layer traps the keyboard user (reinforces Roberts 2007's "universal escape" above) — W3C ARIA APG (dismiss with Esc)
- No coordination across views can depend on a mouse click alone: the element that triggers filter/drill must be a real keyboard focus target (button/link or role + Enter/Space handler) — mechanics and conformance in references/accessibility-mobile.md — W3C ARIA APG
- A widget that captures the arrows (range-brush, navigable grid) must release focus with Tab/Esc and never trap it, because a keyboard trap is a hard failure (WCAG 2.1.2; see references/accessibility-mobile.md) — W3C ARIA APG

**Anti-patterns:** Cross-filter and drill that only respond to a click, invisible to the keyboard; each chip or point as an individual tabstop (Tab becomes a conveyor belt of dozens of stops); an Esc that closes the modal but doesn't clear the selection or exit the zoom (different behavior per layer); a slider and range-brush that only move by mouse drag; a div with onClick firing a cross-filter that keyboard focus can never reach.

## Dashboard onboarding and guided tours

Interaction is invisible until it's discovered: the hidden cost of brushing, drill, and cross-filter is that nothing on screen says they exist. Dataviz onboarding ranges from embedded guidance (an instructional subtitle, an empty state that teaches, scent in the controls) to step-by-step overlaid tours. The evidence (Stoiber et al., comparative studies of visualization onboarding, 2021-2022; NN/g on tutorials) favors in-context, in-the-moment instruction over a front-loaded tour — tours are skipped and forgotten before the first real need.

**Rules:**
- Prefer embedded, permanent guidance — a subtitle with a verb ("Click a state to see its counties"), a hint on the legend, an obvious hover state — over a modal tour, because in-context instruction is read when the need arises; a front-loaded tour is skipped and forgotten — Stoiber et al. 2021-2022; NN/g (instructional overlays are ignored)
- If there is a tour, limit it to 3-5 steps, each pointing to a real element with ONE action, dismissible at any time and re-accessible via a fixed "?", because a long, forced tour breeds abandonment and is never revisited — NN/g (mobile onboarding)
- Write microcopy as a consequence for the user ("You'll see this customer's orders"), not as a feature description ("This chart supports drill"), because the user decides by the outcome, not the mechanics — Knaflic 2015 (actionable titles); NN/g, "Microcopy" (in-context instruction)
- A no-result filter's empty state states the reason and offers a 1-click exit ("No tickets match these criteria — remove the queue filter?"), because a dead end ends the exploration session — Few 2013; Ahlberg & Shneiderman 1994 (never let the user build the empty)
- The dashboard's initial state IS the onboarding: defaults that already show a real, interesting slice (not an empty "select a filter to begin" screen), because a loaded example teaches the mental model faster than any text — Few 2013
- Signal non-obvious interactivity with a low-ink visual cue (an expand icon, a dotted underline on the clickable number, a pointer cursor), because the discovery rate of hidden interaction in news charts is notoriously low — Boy, Detienne & Fekete, CHI 2015 (study of initiation in interactive charts)

**Anti-patterns:** A 10+ step tour on first login blocking the screen; an empty initial screen requiring you to configure filters before showing any data; onboarding balloons covering the data they describe; drill/cross-filter with no visual cue that it exists; a generic empty state ("No data") with no cause and no recovery action.

## State as a first-class citizen: undo, reset, and URL (deep-link)

Exploration only happens when erring is cheap: "permit easy reversal of actions" is one of Shneiderman's Eight Golden Rules, and "history" is an explicit task in both the 1996 mantra and the Heer & Shneiderman 2012 taxonomy (Process & Provenance category: record, annotate, SHARE, guide). The web corollary: the exploration state (filters, drill, sort, tab) serialized in the URL turns any finding into a shareable link, makes the browser back button work as a universal undo, and keeps F5 from punishing you.

**Rules:**
- Show "clear filters" whenever >=1 filter is active, with a count ("3 filters active · clear"), because the safety of reverting in 1 click is what authorizes the user to experiment — Shneiderman, "Designing the User Interface" (Eight Golden Rules), 1987/2016
- Serialize filters, tab, sort, and drill level in the URL querystring, because URL-shareable state turns an individual finding into team communication and survives a refresh — Heer & Shneiderman 2012 (share: export/share the visualization state via URL)
- Browser back undoes the last significant analytical step: pushState per discrete change (drill, tab switch, applied filter), replaceState for continuous adjustment (slider drag), because back is the undo every web user already knows — and 50 slider entries in history make it useless — NN/g (back-button expectations); Heer & Shneiderman 2012 (history)
- Separate VIEW reset (zoom, sort) from QUERY reset (filters): two scopes, two labeled controls, because a single "reset" that wipes everything punishes the user who only wanted to undo the zoom — Shneiderman 1996 (history as its own task)
- Deep-link down to the detail: a drill modal/panel gets its own URL (via the History API / pushState, or the equivalent mechanism in the stack), because a link that opens "the general screen" instead of the exact slice breaks the handoff between colleagues and the return via history — Heer & Shneiderman 2012
- For a destructive or expensive action (delete a slice, trigger an export), prefer undo with a window (an "Undo" toast for 5-10s) over a confirmation dialog, because a confirmation becomes a reflex click and real undo actually protects — Shneiderman, Eight Golden Rules; NN/g ("confirmation dialogs" vs undo)
- Persist the recurring user's last working state (server-side or localStorage) but ALWAYS with a visible path back to the default, because personalization with no escape becomes a configuration prison — Few 2013; Heer & Shneiderman 2012 (record)

**Anti-patterns:** Filters that only clear by manually reloading the page; a slider generating dozens of history entries; a detail modal with no URL (F5 or a shared link lands on the generic screen); a "reset" button that also wipes saved preferences; back ejecting the user from the app instead of undoing the last drill; the whole exploration state lost on every refresh.

## Sources

- Ben Shneiderman, "The Eyes Have It: A Task by Data Type Taxonomy for Information Visualizations", IEEE Symposium on Visual Languages, 1996
- Ben Shneiderman, "Designing the User Interface" (Eight Golden Rules of Interface Design), 1987; 6th ed. 2016
- Brock Craft & Paul Cairns, "Beyond Guidelines: What Can We Learn from the Visual Information Seeking Mantra?", IV 2005
- Christopher Ahlberg & Ben Shneiderman, "Visual Information Seeking: Tight Coupling of Dynamic Query Filters with Starfield Displays", CHI 1994
- Tamara Munzner, "Visualization Analysis and Design", CRC Press, 2014 (chs. 11 Manipulate, 12 Facet, 13 Reduce)
- Jeffrey Heer & George Robertson, "Animated Transitions in Statistical Data Graphics", IEEE InfoVis 2007
- Richard Becker & William Cleveland, "Brushing Scatterplots", Technometrics 29(2), 1987
- Graham J. Wills, "Selection: 524,288 Ways to Say 'This Is Interesting'", IEEE InfoVis 1996, pp. 54-61 (selection taxonomy: mechanism × logical operator)
- Jonathan C. Roberts, "State of the Art: Coordinated & Multiple Views in Exploratory Visualization", CMV/IEEE 2007
- Chris North & Ben Shneiderman, "Snap-Together Visualization", AVI 2000
- Jeffrey Heer & Ben Shneiderman, "Interactive Dynamics for Visual Analysis", CACM 55(4), 2012
- Wesley Willett, Jeffrey Heer & Maneesh Agrawala, "Scented Widgets: Improving Navigation Cues with Embedded Visualizations", IEEE TVCG 13(6), 2007
- Stuart Card, Jock Mackinlay & Ben Shneiderman, "Readings in Information Visualization: Using Vision to Think", 1999
- Jakob Nielsen, "Usability Engineering", 1993 (0.1s/1s/10s thresholds)
- Plaisant et al., query previews, 1997
- Ralph Kimball & Margy Ross, "The Data Warehouse Toolkit", 3rd ed., 2013
- Stephen Few, "Information Dashboard Design", 2nd ed., 2013
- Donald Norman, "The Design of Everyday Things" (perceived affordances)
- Ken Perlin & David Fox, "Pad: An Alternative Approach to the Computer Interface", SIGGRAPH 1993
- Andy Cockburn, Amy Karlson & Benjamin Bederson, "A Review of Overview+Detail, Zooming, and Focus+Context Interfaces", ACM Computing Surveys 41(1), 2009
- Susanne Jul & George Furnas, "Critical Zones in Desert Fog: Aids to Multiscale Navigation", UIST 1998
- Nielsen Norman Group, "Timing Guidelines for Exposing Hidden Content", 2021
- Nielsen Norman Group, "Tooltip Guidelines", 2019
- Nielsen Norman Group, articles on onboarding, instructional overlays, the back button, and confirmation vs undo
- Datawrapper Academy, articles "How to create tooltips" / "How to customize tooltips" (2019-2023)
- Apple Human Interface Guidelines (44pt minimum touch target)
- W3C, WAI-ARIA Authoring Practices Guide (APG), "Developing a Keyboard Interface" (composite widgets, roving tabindex, Tab/arrows/Enter/Space/Esc); WCAG 2.1 SC 2.1.1 Keyboard and 2.1.2 No Keyboard Trap
- Platform conventions for selection modifiers (Apple HIG; Windows): Shift extends a contiguous range, Ctrl/Cmd toggles an item
- Canonical async-UI practice for discarding stale responses (cancellation via AbortController/token, takeLatest, request-id) — no single academic attribution
- Christina Stoiber et al., comparative studies of visualization onboarding (VINCI 2021; TVCG/EuroVis 2022)
- Cole Nussbaumer Knaflic, "Storytelling with Data", 2015
- Jeremy Boy, Françoise Detienne & Jean-Daniel Fekete, "Storytelling in Information Visualizations: Does it Engage Users to Explore Data?", CHI 2015
