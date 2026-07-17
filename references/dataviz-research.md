# User research and dataviz evaluation
> Reference for the dataviz-design skill. Load when: planning a user interview/test for a dashboard, writing a task script, evaluating the value of a screen (before/after a redesign), defining audience personas/literacy, or deciding on telemetry and A/B testing of data surfaces.

## Task abstraction: the multi-level why/what/how typology (Brehmer & Munzner)
Brehmer & Munzner (TVCG 2013) unify low- and high-level classifications into a three-question typology: WHY the task is performed (consume: present/discover/enjoy; produce; search: lookup/locate/browse/explore; query: identify/compare/summarize), HOW (encode; manipulate: select/navigate/arrange/change/filter/aggregate; introduce: annotate/import/derive/record), and WHAT the input and output are. It lets you describe complex tasks as a chained sequence of simple ones (the output of one is the input to the next) and compare user needs independently of domain vocabulary. It is the backbone of Munzner's what-why-how framework (2014) and the standard tool for turning a user interview into an auditable design requirement.

**Rules:**
- Before designing or reviewing a screen, rewrite each user need as an abstract {why, what, how} triple (e.g., 'compare [query] dropout across states [what] via filtering and sorting [how]'), because domain vocabulary hides that two distinct screens serve the same task — or that a screen serves no task at all — Brehmer & Munzner 2013
- Classify search by what the user already knows: target and location known = lookup; target yes, location no = locate; location yes, target no = browse; neither = explore. Lookup calls for direct search/sorting; explore calls for an overview + progressive filters — designing navigation without this distinction produces useless drill or a missing overview — Brehmer & Munzner 2013
- Distinguish identify (1 target), compare (a few targets), and summarize (all) when choosing an encoding: compare requires alignment on a common axis, summarize requires pre-computed aggregation; serving summarize with a raw table offloads the aggregation onto the user's head — Brehmer & Munzner 2013
- Model the flow as a chain: the output of each widget should be the input to some downstream task (decision, drill, export, contact). If a number feeds no downstream task, question its presence on the screen — Brehmer & Munzner 2013
- Separate 'present' (an audience consumes an already-known finding) from 'discover' (a user generates/tests a hypothesis): present tolerates a static, curated view with a takeaway title; discover requires interaction, filtering, and disaggregation — mixing the two on one screen degrades both — Brehmer & Munzner 2013; Munzner 2014
- Validate the task abstraction with the user BEFORE validating encoding and interaction, because the levels are nested: an error in the abstraction invalidates any correct encoding built on top of it (nested model) — Munzner 2009; Munzner 2014

**Anti-patterns:** Gathering a requirement as a solution ('I want a pie chart of X') instead of a task ('I need to compare share across 3 schools'); evaluating the colors/encoding of a screen whose abstract task was never validated — polishing the lower layer on top of a wrong upper one; treating 'explore the data' as a single task without decomposing it into chained search+query; a dashboard whose drill maps to no real task sequence (decorative interactivity).

## Curcio's levels of graph comprehension: reading the data / between the data / beyond the data
Curcio (JRME 1987) defines three levels of graph comprehension: reading THE data (literal extraction of a plotted value), reading BETWEEN the data (comparisons, relationships, aggregations across values), and reading BEYOND the data (inference, extrapolation, and prediction from what is not plotted). Friel, Curcio & Bright (2001) detail the skills at each level and the factors that affect comprehension; Shaughnessy (2007) adds 'reading BEHIND the data' (questioning collection, context, and quality). It is the standard rubric both for writing test tasks and for deciding how much cognitive work the screen should absorb.

**Rules:**
- Write the test script with tasks at all three levels — level 1 'what is the value of X in May?', level 2 'which month grew the most?', level 3 'what do you expect for next quarter?' — because a dashboard can nail literal reading and fail on exactly the comparison that drives the decision — Curcio 1987; Friel, Curcio & Bright 2001
- If the user's dominant task is level 2 (compare), pre-compute the comparison on the screen (% change, absolute delta, ranking) instead of showing only absolute values, because forcing mental arithmetic turns the task into a source of error and slowness — Friel et al. 2001; Few 2006
- To support level 3 (inference), show an explicit reference: target, same period a year ago, expected band — inference without a baseline turns into guesswork and the user fills the gap with bias — Friel et al. 2001; IBCS Standards (a mandatory comparison on every number)
- When analyzing test errors, classify them by level: a level-1 error points to an encoding/label/scale problem; a level-2 error, a layout/alignment problem; a level-3 error, missing context — this turns the test into a targeted backlog — Friel et al. 2001
- Include at least one 'behind the data' question in interviews ('where does this number come from? do you trust it?'), because silent distrust of provenance kills adoption even with perfect reading — Shaughnessy 2007; Sarikaya et al. 2019

**Anti-patterns:** Testing only point-value extraction and concluding the visualization 'works'; a dashboard that shows raw numbers and offloads all comparison and aggregation onto the user's head; assuming well-labeled axes solve level-2/3 comprehension — a label only solves level 1; asking for extrapolation (level 3) on a screen with no reference line or history.

## Measurable visualization literacy: VLAT and Mini-VLAT
The VLAT (Lee, Kim & Kwon, TVCG 2017) is a psychometric test of visualization literacy: 53 multiple-choice items across 12 chart types (line, bar, stacked bar, 100% stacked bar, pie, histogram, scatterplot, area, stacked area, bubble, choropleth, treemap) covering 8 tasks (retrieve value, find extremum, determine range, characterize distribution, find anomalies, find clusters, find correlations/trends, make comparisons), built with an educational-measurement procedure (blueprint, content validity, item analysis, reliability). The Mini-VLAT (Pandey & Ottley, CGF/EuroVis 2023) is the short form: 12 items (1 per chart type), a ~25 s limit per item, omega = 0.72, mean CVR of 0.6 with 5 experts, strong correlation with the full VLAT — viable as a ~5-minute screening. Together they turn 'audience literacy' from a guess into a measured variable.

**Rules:**
- Administer the Mini-VLAT (12 items, ~5 min) to participants before usability tests and segment results by score, because without controlling for literacy you confuse 'bad screen' with 'novice user' and vice versa — Pandey & Ottley 2023
- Use the VLAT's 8 tasks as a coverage checklist for the test script (value, extremum, range, distribution, anomaly, cluster, correlation, comparison), because they enumerate the reading→synthesis spectrum and keep the script from skewing toward 'read the number' — Lee, Kim & Kwon 2017
- If the target audience systematically misreads a chart type (in the VLAT, treemap, stacked-area, and choropleth items concentrate the difficulty), swap it for a more readable form (bars, a sorted table) on consumption surfaces — audience literacy is a design constraint, not a user failing — Lee et al. 2017
- Recruit and stratify by measured score, not self-report ('I'm good with charts'), because self-assessed skill correlates poorly with measured performance on an item test — Lee et al. 2017; Boy et al. 2014
- Don't administer the full VLAT (53 items) in a product test — the fatigue contaminates the usability test that follows; reserve the long instrument for formal research and use the Mini-VLAT day to day — Pandey & Ottley 2023
- When publishing internal research findings, report the sample's literacy distribution alongside them, because a problem found only by low scorers calls for simplifying that surface, not a general redesign — Pandey & Ottley 2023

**Anti-patterns:** Designing for your own data team's literacy rather than the audience's measured literacy; treating a low score as 'dumb user' instead of a design constraint; picking treemap/choropleth/scatter for an executive never tested on those formats; testing with a literacy-homogeneous sample (analysts only) and generalizing to customers.

## Personas by literacy and role: executive, analyst, operator
Few (2006) separates dashboards by role: strategic (executive — aggregate view, at-a-glance reading, almost no interaction), analytical (analyst — rich interaction, drill, comparisons), and operational (operator — near-real-time, alerts, immediate action). Sarikaya et al. (TVCG 2019), analyzing 83 dashboards, show that design varies systematically by audience (literacy, proximity to the data) and purpose (strategic decision, operational monitoring, learning, communication). The practical consequence: the same data demands different surfaces per persona, and a persona is defined by task + literacy + frequency of use, not by job title.

**Rules:**
- For each screen, declare a primary persona with literacy, frequency, and attention window ('executive, weekly, 30 s' vs 'analyst, daily, 20 min'), because density, interaction, and vocabulary all derive from it and you can't audit a screen without knowing who it's for — Few 2006; Sarikaya et al. 2019
- For the executive: a handful of KPIs with built-in comparison (vs target / prior period), zero required interaction, and a full read in under 30 s, because a strategic dashboard is monitored at a glance, not studied — Few 2006
- For the analyst: expose filtering, drill, and export, because the task is discover/explore; hiding disaggregation forces the analyst to abandon the tool and redo everything in SQL/a spreadsheet — Few 2006; Brehmer & Munzner 2013
- For the operator: surface the action-requiring state (alerts, breached thresholds, queues) above historical trend, because the task is to detect and act within minutes — history is context, not the protagonist — Few 2006; Sarikaya et al. 2019
- Don't serve all three personas with the same screen: derive surfaces from the same source with different cuts, because a screen 'for everyone' optimizes for no one and becomes the densest and least used — Sarikaya et al. 2019
- For a low-literacy persona, use a sentence title that states the finding ('Dropout fell 12% in the Southeast') instead of a topic title ('Dropout by state'), because a descriptive title leaves the interpretive work to the reader least equipped to do it — Knaflic 2015

**Anti-patterns:** A 'single company dashboard' serving CEO and operator at the same density; a persona defined by org-chart title instead of by measured task and literacy; adding rich interactivity for an executive whom telemetry shows never clicks; copying the analyst's screen, hiding half the widgets, and calling it 'the executive view'.

## Dashboard usability testing: think-aloud, reading vs decision, the 5-second glance test
The practical protocol combines concurrent think-aloud (Ericsson & Simon 1993) with tasks in two registers: reading (extract/compare values, against a verifiable answer key) and decision ('what would you do with this?', assessing whether the screen supports the action), plus the 5-second glance test — descendant of Perfetti's five-second test (UIE, 2005) — which captures the screen's real visual hierarchy. Nielsen & Landauer (CHI 1993) show that ~5 users expose on average ~85% of usability problems (the 1-(1-L)^n model with L≈31%), and that 3 rounds of 5 users find more than 1 round of 15.

**Rules:**
- Run a glance test on first exposure: show the screen for 5 seconds, hide it, and ask 'what is it about? what's the most important number? does anything require action?' — if the answer doesn't match the intent, the visual hierarchy is wrong, because a monitoring dashboard has to communicate state at a glance — Perfetti/UIE 2005; Doncaster 2014; Few 2006
- Write reading tasks against a verifiable answer key ('which state had the highest inventory in June?') and record correctness, time, and path taken, because 'found it easy' without measured correctness is opinion, not evidence — Nielsen 1993
- Include decision tasks with no single answer ('with this screen, which school would you prioritize and why?') and assess whether the rationale cites evidence visible on the screen — dashboards exist for decisions, and a screen can be legible and useless for deciding — North 2006; Few 2006
- Use concurrent think-aloud and do NOT answer questions during the task (note them and answer at the end), because moderator intervention contaminates the protocol and masks exactly the confusions you want to see — Ericsson & Simon 1993; Nielsen 1993
- Test with 5 users PER PERSONA and iterate: ~85% of problems show up with 5, and 3 rounds of 5 with fixes in between yield more than 1 round of 15 — Nielsen & Landauer 1993
- Test with real or realistic data (scale, outliers, genuinely long names), because well-behaved synthetic data hides the truncation, scale, and label problems that dominate real use — Few 2006; Knaflic 2015
- Measure time-to-first-correct-answer per task to compare versions, but treat it as a READING metric, not a value one — value requires insight/ICE-T methods — Nielsen 1993; BELIV 2006
- Phrase tasks as business questions, never mirroring the screen's structure ('what does the left-hand chart show?'), because a task that points at the widget eliminates exactly the locate step you need to test — Nielsen 1993; Brehmer & Munzner 2013

**Anti-patterns:** Asking 'did you like it?' — satisfaction without a performed task; a designer-guided demo in place of a task the user performs alone; testing with your own data team (contaminated literacy and context); a moderator explaining the screen at the participant's first hesitation; a single large round at the end of the project, with no time to iterate.

## Insight-based evaluation (Chris North)
North (IEEE CG&A 2006) argues that the purpose of visualization is to generate insight — complex, deep, qualitative, unexpected, and domain-relevant — and that time-and-error benchmarks with predefined tasks fail to capture it, because the most valuable questions are precisely the ones the evaluator didn't anticipate. The protocol (Saraiya, North & Duca, TVCG 2005): open-ended exploration in which the user reports everything they learn, and each insight is recorded and coded by domain value (judged by an expert), time to occurrence, whether it was unexpected, and whether it generates a hypothesis. North, Saraiya & Duca (2011) compare the methods and show that insight-based evaluation reveals differences between designs that the benchmark misses.

**Rules:**
- Run 15-30 min open-ended exploration sessions ('use the dashboard and tell me everything you learn about the operation'), recorded, with no task list, because a closed task only measures what you already knew to ask — North 2006; Saraiya, North & Duca 2005
- Record each insight with: statement, timestamp, domain value (1-5 scale judged by a business expert), unexpected (y/n), and whether it generates a hypothesis/action (y/n), because a simple count inflates trivial observations — Saraiya, North & Duca 2005
- Compare designs by total insights WEIGHTED by value, time-to-first-insight, and the proportion of unexpected insights, because depth is worth more than speed — Saraiya et al. 2005
- Have a domain expert who is NOT the designer judge the value of the insights, because the designer overrates findings that confirm their own design — Saraiya et al. 2005
- Use time-and-error benchmarks AND insight-based evaluation as complements, not substitutes: poor basic reading (Curcio levels 1-2) invalidates the insight session, and insight doesn't catch a legibility problem — North, Saraiya & Duca 2011
- Don't accept reading the KPI aloud as an insight ('inventory is 4,200'): require the statement to relate, explain, or surprise — that's North's depth criterion — North 2006

**Anti-patterns:** Counting clicks or 'engagement' as a proxy for insight; 5-minute sessions — deep insight takes time to emerge; a moderator hinting where to look during exploration; the designer judging the value of the insights they collected; reporting 'N insights' with no value weighting or unexpected rate.

## Value evaluation with ICE-T heuristics (Stasko, Wall et al.)
Stasko (BELIV 2014) proposes that a visualization's value = Time (minimizes time to answer questions of the data) + Insight (spurs discoveries) + Essence (conveys the big picture of the data) + Confidence (builds confidence in one's understanding). Wall et al. (TVCG 2018) operationalize this in ICE-T: 4 components decomposed into ~10 guidelines and 21 low-level heuristics rated on a 7-point Likert scale by evaluators knowledgeable in visualization, in ~10-15 minutes per evaluator; in validation, well-designed visualizations scored means above ~5/7. It is cheap inspection of VALUE — a dimension classic usability testing doesn't cover.

**Rules:**
- Rate each screen on the 4 components SEPARATELY (Insight, Confidence, Essence, Time), because a screen can be fast (high T) and shallow (low I) and the aggregate mean hides exactly that — Wall et al. 2018
- Run ICE-T with 3-5 evaluators who know visualization principles (not lay end users) between rounds of user testing, because it costs ~10-15 min per evaluator and requires no recruitment — Wall et al. 2018
- Treat any component with a mean below ~5/7 as a targeted backlog: low T → hierarchy/density; low E → missing overview or takeaway title; low C → missing visible provenance, freshness, and uncertainty; low I → missing comparisons and disaggregation paths — Wall et al. 2018; Stasko 2014
- Audit Essence explicitly ('does the screen convey the big picture without reading every chart?'), because no classic usability protocol covers the big picture — Stasko 2014
- Include the Confidence heuristics in every review checklist: data source, update time, and quality/uncertainty visible on the screen, because confidence is a precondition for use in decisions and doesn't show up in time-and-error — Wall et al. 2018
- Use ICE-T to compare before/after versions of a redesign with the same evaluators, because the instrument is sensitive to design differences between visualizations of the same data — Wall et al. 2018

**Anti-patterns:** Using only SUS/NPS to 'evaluate' a dashboard — it measures generic satisfaction, not analytical value; running ICE-T with lay evaluators: the heuristics presuppose viz vocabulary; optimizing Time at the expense of Insight — an ultra-fast screen that never provokes a new question; reporting the overall ICE-T mean without breaking it out by component.

## BELIV and evaluation beyond time-and-errors: MILCs and the 7 scenarios
The BELIV workshop ('BEyond time and errors: novel evaluation methods for visualization', since 2006, biennial; Bertini, Plaisant & Santucci) grew out of the diagnosis that completion time and error rate are insufficient to evaluate visualization systems: exploration is open-ended, learning takes weeks, and value only shows up in real work. Out of it come MILCs (Shneiderman & Plaisant 2006, BELIV Test of Time Award in 2016): multi-dimensional case studies (observation + interview + logs + artifacts), in-depth and longitudinal, with a few expert users pursuing their own professional goals. Lam et al. (TVCG 2012) organize 7 evaluation scenarios so you choose the method by the question, not by habit.

**Rules:**
- Choose the method by the question using Lam et al.'s 7 scenarios: understand the user's environment/work → field study; visual analysis and reasoning → insight study/MILC; user performance → controlled experiment; user experience → usability test; because a method inherited by habit answers the wrong question — Lam, Bertini, Isenberg, Plaisant & Carpendale 2012
- For a real work tool (operational/analytical dashboard), run a MILC: follow 2-3 users over weeks with regular check-ins + logs + the artifacts they produce, because the value of an exploratory tool only manifests against real goals — Shneiderman & Plaisant 2006
- Measure success by the user's professional goal ('did they enroll the student? prioritize the right case?'), not by the tool's internal metrics, because the tool is a means — Shneiderman & Plaisant 2006
- Combine at least 2 sources of evidence (e.g., usage logs + interview) before any conclusion about real use, because logs without context and self-report without logs lie in opposite directions — Shneiderman & Plaisant 2006; Lam et al. 2012
- Reserve time-and-error for low-level questions (legibility, perception, encoding comparison), where it IS the right method; don't promote it to a verdict on the system — BELIV 2006; Lam et al. 2012
- Plan the longitudinal evaluation at launch (what to log, when to interview), because an adoption evaluation decided after launch loses the baseline — Shneiderman & Plaisant 2006

**Anti-patterns:** 'Validating' an exploratory tool with 10 thirty-second lab tasks; a lab-only study when the real risk is adoption in the workflow; generalizing from a single session what requires weeks of use; picking a controlled experiment because 'it yields numbers', when the question is about work practice.

## Dashboard telemetry and A/B testing of data surfaces
A production dashboard is a research instrument: per-widget logging (views, filter, drill, export) reveals what the lab can't see — dead widgets, filters never touched, return patterns. Sarikaya et al. (2019) note that dashboards are rarely instrumented and that research on real use is scarce; adoption and retention are the definitive design metrics. A/B testing (Kohavi, Tang & Xu 2020) applies when the surface has enough traffic and a clear decision metric (OEC); for low-traffic internal dashboards, longitudinal telemetry and before/after quasi-experiments yield more than an underpowered A/B.

**Rules:**
- Instrument per widget, not per page: record view, interaction (filter/hover/drill), and export, with user_id and timestamp, because 'page visited' doesn't say which chart drives a decision and which is dead weight — Sarikaya et al. 2019; Shneiderman & Plaisant 2006 (logging as a dimension of the MILC)
- Define a dead-widget threshold (e.g., zero interactions and visible in <5% of sessions over 30-90 days) and remove or demote it the next cycle, because a dead widget levies an attention cost on every user on every visit — Sarikaya et al. 2019; Few 2006; Tufte 1983 (data-ink applied to the screen)
- Track visualization retention (users who return ≥1×/week) as a dashboard value metric: a single visit is curiosity, recurring return is use in a process — Kohavi, Tang & Xu 2020; Sarikaya et al. 2019
- Monitor filter usage: a filter touched by <5% of users signals a wrong default or an unnecessary control; a filter combination repeated by many users signals a view that should ship ready-made — Sarikaya et al. 2019
- Only run an A/B if (a) traffic gives statistical power for the minimum relevant effect, (b) there's an OEC tied to the decision (e.g., export rate, time-to-action), and (c) the change doesn't break frequent users' spatial memory; otherwise prefer a moderated test + before/after telemetry — Kohavi, Tang & Xu 2020
- In an A/B of a data surface, measure downstream decision/action (action conversion, decision correctness), never clicks or dwell time, because more time on the screen can mean confusion, not engagement — Kohavi et al. 2020; North 2006
- Discard the first ~2 weeks after the change before reading an A/B or before/after (novelty/primacy effect: frequent users react to the change itself) and check SRM (sample ratio mismatch) before reading any result, because an unbalanced allocation invalidates the entire experiment — Kohavi, Tang & Xu 2020
- When the question is about ENCODING (bar vs area, scale, color) and not the surface, don't spend a production A/B: a cheap crowdsourced perception experiment settles it — Heer & Bostock (CHI 2010) replicated Cleveland & McGill on Mechanical Turk with results equivalent to the lab's

**Anti-patterns:** A dashboard with no logging at all — every redesign becomes opinion versus opinion; reading high dwell as success (it may be confusion); an A/B on an internal tool with 12 users — no power, just noise; never removing a widget 'because someone might use it' without consulting the telemetry; measuring adoption only in launch week (the novelty peak) and declaring victory.

## Sources
- Brehmer & Munzner, A Multi-Level Typology of Abstract Visualization Tasks, TVCG 19(12):2376-2385, 2013
- Munzner, Visualization Analysis and Design, 2014
- Munzner, A Nested Model for Visualization Design and Validation, TVCG, 2009
- Curcio, Comprehension of Mathematical Relationships Expressed in Graphs, JRME 18(5):382-393, 1987
- Friel, Curcio & Bright, Making Sense of Graphs, JRME 32(2):124-158, 2001
- Shaughnessy, Research on Statistics Learning and Reasoning, Second Handbook of Research on Mathematics Teaching and Learning, 2007
- Few, Information Dashboard Design, 2006 (2ª ed. 2013)
- Lee, Kim & Kwon, VLAT: Development of a Visualization Literacy Assessment Test, TVCG 23(1):551-560, 2017
- Pandey & Ottley, Mini-VLAT: A Short and Effective Measure of Visualization Literacy, Computer Graphics Forum 42(3), 2023
- Boy, Rensink, Bertini & Fekete, A Principled Way of Assessing Visualization Literacy, TVCG, 2014
- Sarikaya, Correll, Bartram, Tory & Fisher, What Do We Talk About When We Talk About Dashboards?, TVCG 25(1), 2019
- Knaflic, Storytelling with Data, 2015
- Ericsson & Simon, Protocol Analysis: Verbal Reports as Data, 1993
- Nielsen, Usability Engineering, 1993
- Nielsen & Landauer, A Mathematical Model of the Finding of Usability Problems, CHI 1993
- Perfetti, 5-Second Tests, UIE, 2005
- Doncaster, The UX Five-Second Rules, 2014
- North, Toward Measuring Visualization Insight, IEEE CG&A 26(3):6-9, 2006
- Saraiya, North & Duca, An Insight-Based Methodology for Evaluating Bioinformatics Visualizations, TVCG 11(4), 2005
- North, Saraiya & Duca, A Comparison of Benchmark Task and Insight Evaluation Methods, Information Visualization 10(3), 2011
- Stasko, Value-Driven Evaluation of Visualizations, BELIV 2014
- Wall, Agnihotri, Matzen, Divis, Haass, Endert & Stasko, A Heuristic Approach to Value-Driven Evaluation of Visualizations, TVCG 25(1), 2018
- Bertini, Plaisant & Santucci (orgs.), BELIV Workshop, AVI, 2006
- Shneiderman & Plaisant, Strategies for Evaluating Information Visualization Tools: Multi-dimensional In-depth Long-term Case Studies, BELIV 2006
- Lam, Bertini, Isenberg, Plaisant & Carpendale, Empirical Studies in Information Visualization: Seven Scenarios, TVCG 18(9):1520-1536, 2012
- Kohavi, Tang & Xu, Trustworthy Online Controlled Experiments, 2020
- Heer & Bostock, Crowdsourcing Graphical Perception, CHI 2010
- Tufte, The Visual Display of Quantitative Information, 1983
- IBCS Standards
