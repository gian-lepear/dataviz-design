# Dashboard design process: from brief to delivery

> Reference for the dataviz-design skill. Load when: you're kicking off a dashboard/analytical screen from scratch, gathering requirements with a stakeholder, choosing between design alternatives, prototyping/validating against real data, or standardizing charts across multiple screens.

## Andy Kirk's four stages: brief → data → editorial → design

Kirk frames the workflow as 4 stages that are sequential but iterative: (1) formulate the brief (context, purpose, circumstances, audience), (2) work the data (acquisition, examination, transformation, exploration), (3) establish editorial thinking (angle, framing, focus), and (4) develop the design solution (encoding, presentation, color, composition, interactivity, annotation). Three cross-cutting principles audit the result: trustworthy, accessible, and elegant. The payoff of the model is that it separates context and content decisions from visual ones — most bad dashboards fail at stages 1-3, not at 4.

**Rules:**
- Write the brief before opening any tool: circumstances (who sees it, on what device, how often, against what deadline), purpose, and the definition of success — without explicit context, every design decision becomes an indefensible matter of personal taste — Kirk 2016
- Record where the demand came from (your own curiosity, a stakeholder request, data that just showed up): each origin carries its own bias to correct for — a request tends to inherit a pre-decided solution, available data tends to turn into an inventory — Kirk 2016, stage 1
- Do the data's "physical exam" (types, granularity, completeness, ranges, quality) before sketching any screen: every property you uncover opens or closes encoding options — Kirk 2016, stage 2
- Answer the 3 editorial questions in writing before encoding: angle (which slice of the subject matters), framing (which filters/exclusions apply), and focus (what gets visual emphasis) — skipping stage 3 is the usual cause of the dashboard that "shows everything, says nothing" — Kirk 2016
- Phrase the editorial angle in a single sentence of the form "what exactly, out of this analysis, matters to whoever is looking right now"; if the sentence won't come, go back to the brief — Kirk 2016
- Audit the final solution against the 3 principles as a checklist: trustworthy (does any encoding mislead? truncated scale? cherry-picked?), accessible (is the decoding effort a match for the audience declared in the brief?), elegant (is any element gratuitous?) — Kirk 2016
- Iterate between stages with cost asymmetry in mind: going back to the brief costs a conversation; redoing encoding costs a sprint — resolve ambiguity in stages 1-3 before investing in 4 — Kirk 2016

**Anti-patterns:** Opening the BI tool / charting library on day 1 and letting the template decide the design; a one-line brief ("the boss asked for a sales dashboard") with no audience, frequency, or definition of success; picking the chart type by preference before deciding the editorial angle; refusing to editorialize "to stay neutral" — dumping everything is an editorial decision, and a bad one.

## Ben Fry's seven stages as a pipeline: acquire → parse → filter → mine → represent → refine → interact

Fry (thesis Computational Information Design, MIT 2004; book Visualizing Data, 2008) models building a visualization as a 7-step pipeline: acquire, parse, filter, mine, represent, refine, and interact. The central thesis isn't the sequence, it's the interdependence: downstream decisions (representation, interaction) force a return to upstream steps (filter, mine), and slicing the steps across isolated specialists (engineer does parse, designer does refine) produces an incoherent result because nobody sees the whole pipeline.

**Rules:**
- Use the 7 steps as a project completeness checklist: if one of them wasn't done deliberately (e.g., "refine" was left at the library default), it was done badly — Fry 2008
- Filter early and with documented criteria: remove the data that doesn't serve the question BEFORE mining, because statistics computed over garbage contaminate downstream scales and aggregations — Fry 2008
- In mine, compute the statistical minimum (min/max, counts, distribution, cardinality) before representing: axis domain, ordering, and binning derive from those numbers, not from a guess — Fry 2008
- Start represent with the simplest form that answers the question (bar, line, table, scatter) and only get fancier when the simple form demonstrably fails — Fry 2008
- Treat refine as its own step with time allocated: visual hierarchy, color, and labeling change the reading as much as the choice of chart does — Fry 2008
- Add interaction last and only where the question demands it; for every interaction, answer "what does this click recompute?" — each interaction reopens filter and mine — Fry 2008
- Keep one person (or pair) with a view of the whole pipeline: splitting the 7 steps into disciplinary silos is the failure mode that motivated the thesis — Fry 2004

**Anti-patterns:** Interactivity as an editorial crutch ("put a filter on everything and let the user sort it out"); a waterfall pipeline with no return (finding out at the representation stage that the filter was wrong and not going back); mining before filtering (means and maxes contaminated by invalid records); shipping the library's visual default as if refine were optional.

## Munzner's nested model: 4 levels with a validity threat per level

Munzner (IEEE InfoVis 2009) decomposes visualization design into 4 nested levels: domain problem characterization → data and task abstraction → visual encoding and interaction design → algorithm. The output of each level is the input of the level inside it, so an upstream error cascades to every level below. Each level has its own specific validity threat — domain: "you got the need wrong"; abstraction: "you're showing the wrong thing"; encoding: "the way you show it doesn't work"; algorithm: "your code is too slow" — and each threat requires its own validation method, some immediate and others only possible downstream (post-deploy).

**Rules:**
- Validate each level with that level's method: domain = observe real adoption in the field; abstraction = target user performing a real task with real data; encoding = perceptual heuristics and controlled study; algorithm = complexity analysis and benchmark — Munzner 2009
- Never accept validation of one level as proof of another: a flattering usability test doesn't prove the abstraction is right, and a fast benchmark doesn't prove the encoding communicates — conflating levels is the most common evaluation mistake — Munzner 2009
- Translate the domain vocabulary into an explicit data+task abstraction before choosing a chart: "see the health of the board" becomes "identify outliers and trend in time series across N teams" — only then is the encoding up for discussion — Munzner 2009; Munzner 2014
- Describe tasks with the abstract typology (analyze: consume/produce; search: lookup/browse/locate/explore; query: identify/compare/summarize) to decouple from business jargon and enable reuse of known solutions — Munzner 2014
- Classify reported bugs by the right level before fixing: "slow dashboard" is algorithm, "I don't use this dashboard" is domain or abstraction — a remedy at the wrong level doesn't cure — Munzner 2009
- Treat the domain threat as only closable post-deploy: observed adoption rate is the validation; a demo approved in a meeting is not — Munzner 2009
- When justifying design decisions, cite which level the decision lives at (guideline between blocks): "bar instead of pie" is an encoding guideline, "show it by state" is abstraction — Meyer, Sedlmair, Quinan & Munzner 2015

**Anti-patterns:** Starting the project with "which chart do I use?" (level 3) without a written task abstraction (level 2); "validating" the dashboard by demoing it to whoever built it or to the manager who commissioned it, never to whoever operates it; treating a complaint about slowness as a visual problem and redesigning the screen instead of optimizing the query; cascading an error silently — discovering the abstraction is wrong and "compensating" with an encoding trick.

## Design study methodology: 9 stages and 32 pitfalls (Sedlmair, Meyer & Munzner)

The 2012 paper distills the experience of dozens of visualization projects with real users into 9 stages — learn, winnow, cast, discover, design, implement, deploy, reflect, write — and catalogs 32 pitfalls (PF-1 to PF-32) mapped to those stages. It includes an upfront suitability test on two axes: task clarity (fuzzy→crisp) and information location (in the expert's head→in the computer); if the task is already crisp and the information is all in the computer, the right answer is to automate, not to visualize. It's the methodological antidote to dashboards built for the wrong person, without data, or without a real need.

**Rules:**
- Apply the two-axis test before investing: crisp task + data all in the computer = script/automated report, not an interactive dashboard — Sedlmair, Meyer & Munzner 2012
- Winnow (culling collaborations) aggressively: reject or defer a project with no real data already available, no committed user time, or where there's no real need for vis ("problem can be automated" is a cataloged pitfall) — Sedlmair et al. 2012
- Cast the roles explicitly: distinguish the gatekeeper (who approves), the fellow tool builder (who weighs in on tooling), and the front-line analyst (who uses it) — design for the analyst, negotiate with the gatekeeper — Sedlmair et al. 2012
- In discover, observe the work happening instead of just interviewing: "just talking, not observing" is a named pitfall; what people say they do diverges from what they do — Sedlmair et al. 2012
- Generate and discard many design alternatives deliberately: the volume of ideas considered-and-rejected is a proxy for how well you explored the solution space — Sedlmair et al. 2012
- Avoid PF-1 "premature advance": don't jump to design without enough discover, nor to implement without alternatives compared — every premature jump charges rework at the next stage — Sedlmair et al. 2012
- Implement early with real data and show it weekly/biweekly: a rough prototype in front of the user is worth more than a polished tool six months later — Sedlmair et al. 2012
- Close with a written reflect: confront what worked against guidelines from the literature and record where practice contradicted theory — that's what improves the next project — Sedlmair et al. 2012

**Anti-patterns:** A "proxy" collaborator who speaks for the real user but never operated the process; building for months without showing anything to any user; taking a polite compliment in a demo as validation of need; an elaborate interactive visualization for a task an automated alert would solve; starting over from scratch after a failure with no reflection step to identify which stage failed.

## Scenario-driven design and critique of alternatives (Big Book of Dashboards) + critique rituals

Wexler, Shaffer & Cotgreave (2017) organize the book around 28 real business scenarios (healthcare, finance, HR, marketing, sports; desktop, mobile, wallboard): each chapter presents the dashboard, the use scenario, how people use it, why it works — and the authors' explicit critique of what isn't ideal about the very example they chose. The transferable method: design from a concrete scenario (persona + question + moment + device) and subject alternatives to structured critique. The design-critique literature (Connor & Irizarry, 2015) supplies the ritual: feedback anchored to the screen's stated goal, not to the reviewer's taste.

**Rules:**
- Write the scenario before the first pixel: persona + question + moment of use + device ("HR manager, Monday 9am, deciding which areas to prioritize for retention, laptop") — a dashboard with no scenario is a dashboard for no one — Wexler, Shaffer & Cotgreave 2017
- Avoid scrolling in a desktop monitoring dashboard: of the book's 28 scenarios, only 1 (FT "Economy at a Glance") scrolls on desktop; if it doesn't fit one screen, cut metrics or split by scenario — Big Book 2017
- Use BANs (Big Ass Numbers) up top for the scenario's #1 question and charts below for the "why" behind the number — a recurring pattern in the book's effective scenarios — Big Book 2017
- Include the critique in the deliverable: list in writing what does NOT work in the chosen design and which alternatives were rejected and why — the authors critique even the 28 examples they selected as good — Big Book 2017
- Run critique against the goal, not against taste: the reviewer first asks "what is the goal of this screen and this decision?", then judges whether the execution meets it — "I didn't like the blue" isn't a critique, it's a reaction — Connor & Irizarry 2015
- Separate the feedback rounds: session 1 only clarifies intent and scenario; session 2 judges execution — judging execution before aligning on intent kills good alternatives too early — Connor & Irizarry 2015
- Test with someone who didn't build it: ask them to narrate out loud what they understand in the first 30 seconds, before any explanation from you — where the narration stalls is where the design fails — Knaflic 2015
- Schedule the v2 in the timeline: "no dashboard survives first contact with users" (Cotgreave); budget post-deploy iteration as part of delivery, not as a failure — Big Book 2017

**Anti-patterns:** A generic dashboard "for all stakeholders" with no named use scenario; taste feedback ("make it more clean") accepted as design direction; reviewing only the final version, when changing structure is already expensive; hiding trade-offs from the client and presenting the solution as the only possibility; copying a dashboard from a gallery/example without transposing the scenario (theirs isn't yours).

## Five Design-Sheets (Roberts, Headleand & Ritsos): structured sketching before the pixel

A ~1-hour lo-fi methodology on 5 sheets of paper: Sheet 1 = a 5-step brainstorm (generate ideas, filter duplicates/impossible ones, categorize, combine & refine, question); Sheets 2-4 = three complete alternative designs, each with panels for Information, Layout (screen sketch), Operations (interactions), Focus/parti (central idea), and Discussion (pros/cons); Sheet 5 = the realization design with implementation requirements. It forces divergence before convergence and makes exploration cheap: discarding a sheet costs minutes, discarding a coded prototype costs days.

**Rules:**
- Generate at least ~10 mini-ideas on Sheet 1 before filtering; only then remove duplicates and impossibilities and combine the survivors into larger solutions — filtering during generation kills the divergence — Roberts, Headleand & Ritsos 2016
- Produce 3 STRUCTURALLY distinct alternatives on sheets 2-4 (different layout, operations, and focus), not 1 design with 3 cosmetic variations — the comparison only informs if the alternatives genuinely diverge — Roberts et al. 2016
- Fill in the Discussion panel (pros/cons) for each alternative: an alternative with no con listed is an alternative you didn't think through — Roberts et al. 2016
- Specify Operations right in the sketch: what happens on click, hover, filter, drill for each view — an interaction forgotten on paper becomes an expensive retrofit in code — Roberts et al. 2016
- Treat Sheet 5 as a handoff: include the data needed (tables/columns/grain), the target library, and an effort estimate, not just the final drawing — Roberts et al. 2016
- Keep fidelity deliberately low (paper, pen, no ruler): a rough sketch invites critique of structure; a polished mockup only gets cosmetic critique — Roberts et al. 2016; Buxton 2007
- Take the 5 sheets to the user/stakeholder and discuss the alternatives with them before coding — the sheets are a conversation artifact, not dead files — Roberts et al. 2016

**Anti-patterns:** Jumping straight to the BI tool/code "because sketching slows things down"; three fake alternatives (the same idea drawn three times in different colors); a layout sketch with no interaction annotation at all; sketches made and shelved with no discussion session.

## Requirements gathering: from business question to metric to view (never the reverse)

The correct direction of derivation is business goal → questions that need answering → metrics that answer the questions → view that shows the metric at the decision's grain. The reverse path ("we have these columns in the database, which charts fit?") produces inventory-dashboards with no decision attached. The GQM framework (Goal-Question-Metric, Basili) formalizes the chain; Few defines a dashboard as "the most important information needed to achieve one or more objectives, consolidated on a single screen, monitorable at a glance" — a definition that is itself a requirements filter.

**Rules:**
- Require the written chain goal→question→metric→action for every widget: if no one can articulate which decision changes when the number changes, cut the widget — Basili, Caldiera & Rombach 1994 (GQM); Few 2013
- In the interview, ask "what would you do if this number went up 20% tomorrow?": with no concrete answer, it's a vanity metric and doesn't belong on the main screen — GQM practice; Few 2013
- Classify the screen by role before designing — strategic (trends, low frequency), operational (real-time, alarms), or analytical (exploration, comparisons) — because density, refresh, and interaction all derive from the role — Few, Information Dashboard Design, 2006/2013
- If answering the question requires investigation rather than a glance, it's not a dashboard: it's an analysis tool; separate the two surfaces instead of inflating one — Few 2006/2013
- Extract requirements by observing the current decision flow (the spreadsheet the person maintains, the weekly email, the meeting agenda) instead of asking for a wish list: users ask for what they already know — Sedlmair, Meyer & Munzner 2012 (discover)
- Write each requirement as a question with grain, comparison, and period ("how many new hires per state this week vs. last?"), not as a bare metric ("hires per state") — the complete question determines the view; the bare metric doesn't — GQM; Munzner 2014 (task abstraction)
- Prioritize by question frequency × current cost of answering it: the daily question that today costs 30 min of spreadsheet work goes to the top of the screen; the quarterly one goes to a report — Few 2013
- For each KPI, record a target (or acceptable range) and an owner: a number with no comparison reference isn't monitorable at a glance — Few 2013; IBCS 2013

**Anti-patterns:** A dashboard as a dump of the database schema (one chart per table); a stakeholder request ("I want a pie here") transcribed as a requirement without extracting the question behind it; a KPI with no target, no range, and no owner; requirements gathered only from the boss — whoever operates the process was never heard; a single screen trying to serve operational monitoring AND exploratory analysis.

## Prototype with real data: synthetic data hides the layout that breaks

Layout, scale, and encoding are only validated against production data (or a faithful sample of it): real distribution, real cardinality, real labels, real gaps. Uniform synthetic data — the "lorem ipsum of data" — hides exactly what breaks the screen: the outlier that flattens the scale, the 60-character label, the dimension with 400 categories, the series with nulls. In Fry, the represent step depends on the concrete mined data, not on imagined data; a chart decision made over fake data is an untested bet.

**Rules:**
- Prototype with a real extract from the database (even dirty) or a faithful stratified sample, never with invented uniform values: a real skewed distribution changes scale, ordering, and even the appropriate chart type — Fry 2008
- Stress the screen with the known extremes of the real data: the peak month, the customer with 10× the median volume, the longest text in the column — if the layout survives P99, it survives the average — established practice in design systems (Carbon, Polaris Viz)
- Design the empty state and the 1-item state explicitly ("no data in the selected period"): the user WILL see that screen, and it can't look like an error — empty-state guidelines, Shopify Polaris / IBM Carbon
- Verify each categorical dimension's real cardinality before promising "color by category": categorical palettes sustain ~5-7 distinguishable series (canonical ceiling in references/color.md); 40 departments don't become 40 colors — group into top-N + "other" — Few 2012; Wilke 2019
- Render with the longest real labels (municipality, job title, full name) and set the truncation policy where the distinctive part survives (truncate the middle if prefixes repeat)
- Decide the outlier treatment in the prototype, not in production: if 1 point flattens the other 99, choose between a log scale, a separate view, or an annotation with a break — and document it — Wilke 2019; Datawrapper Academy (Muth)
- Distinguish null from zero in the design: a line that disappears (no data) and a line that reads 0 are different semantic states and need different rendering — Datawrapper Academy
- Freeze a versioned fixture sample for visual regression tests: a random seed on every build changes the screenshot and hides a real layout regression

**Anti-patterns:** A gorgeous demo with uniform Faker data that turns into an illegible accordion with production data; a legend sized for 5 categories receiving 30 in production; a Y axis with a fixed domain "that looked nice in the demo" clipping the real peak; treating an empty cell as zero in the aggregation and drawing a false drop; approving the design in a meeting with sample data and only wiring in the real data on the eve of delivery.

## Dataviz design system and multi-screen governance: chart as a component and tokens

In a product with multiple analytical screens, the chart stops being a one-off artifact and becomes a governed component: palette as a token with fixed order, centralized number formatting, chart types with usage rules documented as do/don't, states (empty/loading/error) in the spec. Mature references: IBM Carbon (categorical palette ordered for 2 to 14 categories, 3:1 contrast against the background and an average >2:1 between neighboring colors), Shopify Polaris Viz (open source since 2021, light/dark themes), and Salesforce Lightning. Governance means: the same entity has the same color across every screen, the same value has the same format across every screen.

**Rules:**
- Define the categorical palette as a fixed ordered sequence and apply it strictly in order: Carbon's sequence is curated to maximize contrast between neighbors (average >2:1) from the 2nd to the 14th category — don't shuffle colors per screen — IBM Carbon Design System
- Ensure ≥3:1 contrast of bars/lines/points against the background in light and dark: it's WCAG 2.1 criterion 1.4.11 (non-text contrast, 2018), and the entire Carbon palette meets it — WCAG 2.1; IBM Carbon
- Fix color by entity/status, not by position in the series: the same department or the same status uses the same color on every screen of the app, otherwise the user relearns the mapping at each view — consistency principle, Carbon/Lightning
- Never recycle a semantic color (red=alert, green=ok) as a neutral categorical color on the same surface: the user reads judgment where there is none — Few 2013; Lightning guidelines
- Centralize number formatting in a single tokenized helper (currency, %, k/M abbreviation, decimal places, locale separator): the same value in two formats on different screens destroys trust in the data — IBCS 2013 (uniform notation); design-systems practice
- Componentize the chart with a narrow API (data, dimension, measure, variant) and correct defaults BUILT IN — zero baseline for bars, sort by value for nominal categories, standard tooltip — so the feature dev doesn't re-decide encoding on every screen — Carbon Charts; Polaris Viz
- Document rendered do/don't per chart type (when line vs. bar, series limit per type, when a table wins) so the choice doesn't depend on who's on shift — Carbon / Lightning guidelines
- Adopt IBCS semantic notation when there's actual/budget/previous-year/forecast, with the per-scenario fill encoding uniform across all screens (canonical encoding in references/dashboard-typology.md) — IBCS Standards (Hichert & Faisst), 2013
- Include loading, empty, and error states in the chart component's spec, with a defined appearance, not improvised per screen — Polaris Viz; Carbon

**Anti-patterns:** Each screen of the app with its own palette and color order; a KPI showing "$1.2M" and the table on the same screen showing "1,234,567.89"; a copy-paste chart with library defaults (non-zero baseline, ECharts/Chart.js default colors) diverging from the system; a design system that documents buttons and forms but hasn't a single line about charts; red used as a 4th categorical color on a screen that also uses red for "off."

## Sources

- Andy Kirk, Data Visualisation: A Handbook for Data Driven Design, Sage, 2016 (2nd ed. 2019)
- Ben Fry, Visualizing Data, O'Reilly, 2008
- Ben Fry, Computational Information Design (doctoral thesis, MIT Media Lab), 2004
- Tamara Munzner, "A Nested Model for Visualization Design and Validation", IEEE TVCG 15(6) / InfoVis, 2009
- Tamara Munzner, Visualization Analysis and Design, CRC Press, 2014
- Meyer, Sedlmair, Quinan & Munzner, "The Nested Blocks and Guidelines Model", Information Visualization 14(3), 2015
- Sedlmair, Meyer & Munzner, "Design Study Methodology: Reflections from the Trenches and the Stacks", IEEE TVCG 18(12), pp. 2431-2440, 2012
- Wexler, Shaffer & Cotgreave, The Big Book of Dashboards, Wiley, 2017
- Connor & Irizarry, Discussing Design, O'Reilly, 2015
- Knaflic, Storytelling with Data, Wiley, 2015
- Roberts, Headleand & Ritsos, "Sketching Designs Using the Five Design-Sheet Methodology", IEEE TVCG 22(1), 2016
- Roberts, Headleand & Ritsos, Five Design-Sheets: Creative Design and Sketching for Computing and Visualisation, Springer, 2017
- Buxton, Sketching User Experiences, Morgan Kaufmann, 2007
- Basili & Weiss, "A Methodology for Collecting Valid Software Engineering Data", IEEE TSE, 1984; Basili, Caldiera & Rombach, "The Goal Question Metric Approach", 1994
- Stephen Few, Information Dashboard Design, O'Reilly 2006 (2nd ed. Analytics Press, 2013)
- Stephen Few, Show Me the Numbers, 2nd ed., 2012
- Claus Wilke, Fundamentals of Data Visualization, O'Reilly, 2019
- Lisa Charlotte Muth / Datawrapper Academy (blog and guides)
- IBM Carbon Design System — Data Visualization guidelines / Carbon Charts (carbondesignsystem.com)
- Shopify Polaris Viz (open source, 2021)
- Salesforce Lightning Design System — charts guidelines
- W3C, WCAG 2.1, criterion 1.4.11 Non-text Contrast, 2018
- Hichert & Faisst, International Business Communication Standards (IBCS), 2013
