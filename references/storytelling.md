# Storytelling and narrative with data

> Reference for the dataviz-design skill. Load when: writing chart titles/annotations, ordering the views in a report or presentation, deciding how much to guide the user through a dashboard (tour/drill/exploration), highlighting the message of a screen, or building scrollytelling.

## Context before the chart: exploratory vs explanatory

Knaflic opens Storytelling with Data with the founding distinction: exploratory analysis (you hunting for patterns) and explanatory communication (you delivering ONE finding to ONE audience) call for different artifacts. The cardinal error is serving up the exploration as if it were the explanation — "showing the 100 oysters instead of the 2 pearls." Before a single pixel, you settle on audience, desired action, and a one-sentence message (the Big Idea, borrowed from Duarte).

**Rules:**
- Write the Big Idea as 1 complete sentence that states your point of view and what's at stake BEFORE choosing a chart; if you can't write the sentence, you don't yet know what the screen should say — Knaflic 2015 (via Duarte, Resonate 2010)
- Classify every screen as exploratory (the user filters and hunts) or explanatory (you communicate a finding) and don't mix them: an explanatory screen has 1 message and a highlight; an exploratory screen has controls and neutrality — Knaflic 2015
- Answer Who (a specific audience, not "stakeholders"), What (the action they should take), and How (the data that backs it) in writing before you design — Knaflic 2015
- Do the "3-minute story": if you had only 3 minutes with the decision-maker, what would you say? That pitch becomes the page's script, in order — Knaflic 2015
- For a mixed audience, design for the most senior decision-maker and push detail into an appendix/drill-down, because trying to serve everyone dilutes the message for everyone — Knaflic 2015
- Don't dress up an exploratory tool with a narrative intro expecting engagement: a controlled experiment showed that story elements in an exploratory vis did NOT increase users' exploration — Boy, Detienne & Fekete, CHI 2015

**Anti-patterns:** Dumping the whole analysis onto the screen because "it was a lot of work" (the 100 oysters); assuming "the data speaks for itself" and shipping a chart with no message; the same screen serving prospect, analyst, and director with no hierarchy of detail; picking the chart type before knowing the message (a chart in search of a story).

## Narrative arc and the order of the views

A sequence of charts communicates better when it follows dramatic structure — context, tension (the problem in the data), resolution (action) — rather than the chronological order in which the analysis happened. Knaflic operationalizes this with a storyboard, horizontal logic (the titles tell the story on their own) and vertical logic (each piece supports its title). Hullman showed empirically that the order between views carries a measurable cognitive cost: transitions that change one dimension at a time are preferred.

**Rules:**
- Structure data reports and presentations as context → conflict/tension → resolution with a call to action, because a narrative with tension is retained better than a sequence of facts — Knaflic 2015; Duarte 2010
- Storyboard on sticky notes/a rough sketch before opening the tool: throwing away a sticky note is cheap, throwing away a finished chart breeds attachment — Knaflic 2015
- Test the horizontal logic: reading ONLY the section/card titles in sequence, the story should hold together completely — Knaflic 2015
- Test the vertical logic: everything inside a card/slide must support its title; whatever doesn't support it goes, or becomes an appendix — Knaflic 2015
- Order views by changing ONE dimension per transition (same place/different time, same time/different slice), because sequences with parallelism and lower transition cost are preferred and better understood — Hullman et al., A Deeper Understanding of Sequence in Narrative Visualization, InfoVis 2013
- Repeat the key message in redundant layers (title, annotation, visual highlight), because redundancy has been shown to improve recall of the message — Borkin et al. 2015
- Close with an explicit recommendation ("what to do on Monday"), because a story with no resolution hands the work of reaching the conclusion to the reader — Knaflic 2015

**Anti-patterns:** Narrating in the order the analysis happened ("first I pulled the data, then…"); delivering the climax on slide 2 and spending 20 slides in anticlimax; a sequence that swaps axis, metric, and slice all at once between two views; a final screen/presentation with no actionable "so what?".

## Gray-out and highlight: directing attention

Knaflic's signature technique: demote everything to gray and promote only the message element to a highlight color. It works because preattentive attributes (hue, intensity, size) are processed in under ~250 ms, before conscious attention — the eye lands where the designer decided. It's the bridge between perception (Ware, Few) and narrative: the highlight IS the screen's thesis.

**Rules:**
- Paint every series/bar gray and promote only the one that carries the message to a highlight color, because color among grays is processed preattentively (<250 ms) and guides the eye effortlessly — Knaflic 2015; Ware 2004
- Limit to 1 highlight color per view (2 at the absolute most): if everything is highlighted, nothing is — Knaflic 2015
- Run the "where do your eyes land first?" test: show the screen for 5 seconds to an outsider; if the first landing isn't the message, the hierarchy failed — Knaflic 2015
- Push context to the background: axes, gridlines, labels, and reference series in light gray; ink hierarchy = data > label > axis — Knaflic 2015; Few, Show Me the Numbers, 2012
- Use the same hue in the title/annotation phrase and in the series it describes, because color binding ties word and mark together without a legend — Knaflic 2015; Stolper et al. 2016
- Highlight by altering the mark itself (color/weight of the data), not by adding a frame, a box, or a fat arrow — this preserves data-ink and avoids clutter — Tufte 1983; Few 2012
- Reserve red/green for real bad/good semantics; highlighting a neutral item in red triggers an unwarranted judgment — Few, Information Dashboard Design, 2013

**Anti-patterns:** The library's default rainbow palette with 8 equally saturated series; stacked highlighting (bold + color + box + arrow all on the same spot); no gray anywhere on the screen (everything competes, nothing wins); red on a neutral metric just because it "grabs attention".

## Conclusion titles: declarative vs descriptive and the power to bias

The title is the most-fixated and most-remembered element of a visualization — eye-tracking shows readers spend the most time on the text, especially the title, and recall the message from it. That makes the declarative title (a conclusion sentence) the cheapest lever of communication, and also the most dangerous: the title's slant changes the perceived message of the SAME chart, and most readers still judge the visualization as neutral.

**Rules:**
- Write the title as a conclusion in a complete sentence ("Recurring revenue grows 12% in the quarter"), not as a variable label ("Revenue by month"), because the title is the most-attended element and the one that determines the remembered message — Borkin et al. 2015; IBCS Standard (SAY rule: every report page carries one message), 2017
- Save the descriptive part for the subtitle: metric, unit, period, and applied filter, because the reader needs to audit where the conclusion came from — Muth/Datawrapper, Text in Data Visualizations, 2022; IBCS 2017
- Only assert in the title what the shown chart supports: the title's slant alters the perceived message, and readers derive OPPOSITE messages from the same chart depending on the title — Kong, Liu & Karahalios, Frames and Slants in Titles, CHI 2018
- Never publish a title misaligned with the chart (title talks about A, data shows B): readers recall the title's message even when it contradicts the chart, and few notice the misalignment — Kong, Liu & Karahalios, CHI 2019
- If you want the reader to conclude something about a salient feature (the March spike), name that feature in the title/caption, because a caption that references the salient feature drives the conclusion — Kim, Setlur & Agrawala, CHI 2021
- On an exploratory screen with free filters, swap the fixed declarative title for a dynamic descriptive one that reflects the active slice, because a frozen conclusion title lies the moment the filter changes — derived from Kong et al. 2019 + Segel & Heer 2010
- Beware the "statistical frame" (a title that seems neutral because it cites a number): it's the framing readers are least likely to perceive as biased — Kong et al., CHI 2018

**Anti-patterns:** "Dashboard" or the table's name as the screen title; a question title whose chart doesn't answer it; a vague declarative ("Sales are doing well") with no number or slice; an inherited title that outlives a filter/period change and starts to lie.

## The annotation layer as first-class data

Amanda Cox (NYT): "the annotation layer is the most important thing we do… otherwise it's a case of here it is, go figure it out." Annotation is not post-hoc decoration: it's where the author deposits the interpretation — why the spike exists, what the reference line means. Recent research confirms it: readers prefer charts with more integrated text and their takeaways follow what the text emphasizes; and the ChartAccent taxonomy formalizes annotation anchored to data (not to pixels).

**Rules:**
- Annotate directly on the chart the reason for every relevant extreme (peak, trough, series break): an event, a rule change, an explained outlier — without it the reader invents the cause — Amanda Cox (NYT); Muth/Datawrapper 2022
- Place the text right next to the element it explains (a label at the end of the line when there are up to ~4 series, a note anchored to the point), because a distant legend/note forces the eye to travel back and forth — Muth, Datawrapper 2022; Few 2012; Tufte 1983 (integrating words, numbers, and images)
- Anchor annotations in DATA coordinates (item, set, region of the coordinate space), not in pixel position, so they survive re-render, responsive layouts, and filtering — Ren, Brehmer, Lee, Höllerer & Choe, ChartAccent, PacificVis 2017
- Prefer chart + integrated text over a bare chart: in a study of variations of the same chart, readers generated more takeaways (aligned with the text) and PREFERRED the more annotated versions — Stokes, Setlur, Cogley, Satyanarayan & Hearst, IEEE VIS 2022
- Label reference lines (target, mean, benchmark, capacity) with name and value, because a reference turns a number into a judgment (above/below expected) — Few, Information Dashboard Design, 2013
- Audit the rhetoric of your annotations: choosing WHAT to annotate is framing (omission and focus are rhetorical techniques); check that the annotations don't tell only one side of the data — Hullman & Diakopoulos, Visualization Rhetoric, IEEE TVCG 2011
- Don't hide the interpretation behind hover: a tooltip is for detail on demand; the central message must be visible without interaction — Cox; Segel & Heer 2010 (messaging)

**Anti-patterns:** A "here it is, go figure it out" chart (just axes, series, and legend); an essential annotation available only in a tooltip; annotating every point (the layer becomes clutter and nothing stands out); an annotation positioned at an absolute pixel that drifts off the data on mobile/resize.

## Genres of visual narrative and the author-reader balance (Segel & Heer)

Segel & Heer (2010) analyzed 58 journalistic visualizations and defined the design space of visual narrative: 7 genres (magazine style, annotated chart, partitioned poster, flow chart, comic strip, slideshow, film/animation) and the author-driven axis (linear, strong message, little interaction) vs reader-driven (free exploration). The 3 hybrid schemes — martini glass, interactive slideshow, and drill-down story — are the standard vocabulary for deciding how much to guide the user, including in product dashboards.

**Rules:**
- Decide the balance of each screen explicitly: author-driven when the goal is to communicate a finding fast (report, onboarding), reader-driven when it's to explore (analyst); don't let the balance happen by accident — Segel & Heer 2010
- Apply the martini glass on analytical screens: open guided (the period's finding, highlights in sequence) and ONLY then release free exploration; don't drop a novice user into a panel of filters without first showing what matters — Segel & Heer 2010
- Use an interactive slideshow for onboarding/a tour of a dense screen: linear steps that allow local interaction (hover, toggle) without breaking the spine of the sequence — Segel & Heer 2010
- Structure drill dashboards as a drill-down story: the surface shows the big picture and the user chooses where to go deeper — but every drill path must land on worthwhile content, never on an empty dead end — Segel & Heer 2010
- Give a sense of position in the narrative: a progress bar, breadcrumb, or index ("visual structuring"), because a guided reader needs to know where they are and how much is left — Segel & Heer 2010
- Keep visual consistency across views of the same story (same color = same entity, same axes when comparable), because continuity is what makes separate views read as ONE narrative — Segel & Heer 2010 (transition guidance)
- Use layered "messaging": headline, caption, annotation, and final summary are distinct tactics — the central message can't live in only one of them — Segel & Heer 2010

**Anti-patterns:** A 100% reader-driven showcase dashboard handed to a user who has never seen the screen; a slideshow where interacting on one step changes global state and breaks the next step; a drill-down that lands on an empty table or a number with no context (a dead end); mixing genres on the same screen with no hierarchy (half guided tour, half exploration, with no signposting).

## Scrollytelling: NYT/Pudding patterns and scroll rules

Scrollytelling ties narrative progression to the web's cheapest gesture (ever since Snow Fall, NYT 2012). Bostock codified the rules for not breaking scroll; the Pudding standardized the implementation (sticky graphic + steps, scrollama/IntersectionObserver); McKenna et al. measured with 240 participants what actually affects engagement — animation and visual feedback matter, the control mechanic doesn't.

**Rules:**
- Prefer scroll over click to advance the narrative, because exposing content through scroll has a lower interaction cost than hiding it behind clicks — Bostock, How To Scroll, 2014
- Never hijack the scroll (scrolljacking): scrolling must stay fast, incremental, and reversible; never turn the wheel into slow animated swipes — Bostock 2014
- Give instant visual feedback on every scroll tick (something moves on screen), otherwise the page feels frozen — Bostock 2014
- Preserve the ~12 standard keyboard scroll shortcuts (arrows, PgUp/PgDn, space, Home/End) when implementing custom navigation — Bostock 2014
- Don't auto-play video/audio when the element enters the viewport without prior visual warning — Bostock 2014
- Use the sticky-graphic pattern (a fixed graphic, text steps scrolling over/beside it) and change ONE variable of the graphic per step, because the reader needs to attribute the change to the text they just read — The Pudding (Goldenberg), How to Implement Scrollytelling, 2017
- Decide mobile early: "keep it scrolly" if the transitions carry meaning (temporal/spatial change), "stack it" if each step stands on its own as an independent chart — The Pudding, Responsive Scrollytelling Best Practices, 2017
- Invest in animated transitions between states, not in exotic navigation mechanics: visual feedback/animation affects engagement; the level of control (discrete vs continuous) doesn't — McKenna et al., Visual Narrative Flow, EuroVis 2017 (7 flow-factors, study with 240 participants)
- Stepper and scroller engage equally (both more than text + static figure): choose a stepper for dense discrete steps, a scroller for continuous flow — not by fashion — McKenna et al. 2017

**Anti-patterns:** Scrolljacking with slow easing bound to the mouse wheel; a scrolly step that swaps metric, scale, and slice all at once; video autoplay with audio on entering the viewport; scrollytelling for content that an article with 3 annotated charts would have solved (production cost with no narrative payoff).

## Memorability, pictograms, and embellishment (Borkin, Bateman, Haroz)

The Borkin line quantified what stays in memory: across 2,070 visualizations tested via Mechanical Turk, recognizable human objects (pictograms), more colors, and uncommon chart types increase memorability; the eye-tracking follow-up (393 vis, 33 participants) showed that the title and text dominate attention and recall. Bateman (CHI 2010) found that Nigel Holmes-style embellishment does not hurt immediate comprehension and improves recall weeks later. The authors' own caveat: memorable is not synonymous with effective — the criterion changes between a one-off communication piece and a daily-use dashboard.

**Rules:**
- Use pictograms when they ENCODE the data (stacked icons as units, ISOTYPE style): they don't degrade reading performance and they improve memory and engagement — Haroz, Kosara & Franconeri, ISOTYPE Visualization, CHI 2015; Borkin et al. 2013
- Remove decorative imagery that doesn't encode data: a superfluous icon/photo distracts and hurts performance — Haroz et al., CHI 2015
- Reserve distinctive chart shapes for the signature piece of a story (unique types are more memorable than plain bars/lines); keep the conventional on operational screens read repeatedly — Borkin et al. 2013 (2,070 visualizations)
- Make title + annotation + visual highlight say the SAME message: redundancy measurably improves recognition and recall — Borkin et al. 2015 (393 vis, eye-tracking with 33 participants)
- On a one-off communication piece (annual report, blog post), Holmes-style embellishment is defensible: immediate comprehension equal to the plain chart and better recall after 2-3 weeks — Bateman et al., Useful Junk?, CHI 2010
- On a recurring dashboard, optimize for fast repeated reading (data-ink, consistency), not for memorability: someone who sees the screen every day doesn't need to remember it, they need to read it in seconds — Few 2013; explicit caveat in Borkin et al. 2013 ("memorable is not necessarily good")
- Structure the vis to have ONE identifiable central focus at a glance: the most recognizable visualizations in the eye-tracking had a single fixation at the center — Borkin et al. 2015

**Anti-patterns:** A decorated infographic serving as an operational dashboard; an icon/pictogram that contradicts or is unrelated to the data (hurts comprehension); a background photo under the chart to "engage"; chasing memorability on a daily monitoring screen; concluding from Bateman that chartjunk is always fine (the study is about recall of a one-off piece, N=20, not about reading efficiency).

## Sources

- Cole Nussbaumer Knaflic, Storytelling with Data, 2015
- Nancy Duarte, Resonate, 2010
- Boy, Detienne & Fekete, Storytelling in Information Visualizations: Does it Engage Users to Explore Data?, CHI 2015
- Hullman, Drucker, Riche, Lee, Fisher & Adar, A Deeper Understanding of Sequence in Narrative Visualization, IEEE InfoVis 2013
- Borkin, Vo, Bylinskii, Isola, Sunkavalli, Oliva & Pfister, What Makes a Visualization Memorable?, IEEE TVCG (InfoVis) 2013
- Borkin, Bylinskii, Kim, Bainbridge, Yeh, Borkin, Pfister & Oliva, Beyond Memorability: Visualization Recognition and Recall, IEEE TVCG 2015
- Stephen Few, Show Me the Numbers, 2nd ed., 2012
- Stephen Few, Information Dashboard Design, 2nd ed., 2013
- Colin Ware, Information Visualization: Perception for Design, 2004
- Edward Tufte, The Visual Display of Quantitative Information, 1983
- Stolper, Lee, Riche & Stasko, Emerging and Recurring Data-Driven Storytelling Techniques, MSR Tech Report, 2016
- Kong, Liu & Karahalios, Frames and Slants in Titles of Visualizations on Controversial Topics, CHI 2018
- Kong, Liu & Karahalios, Trust and Recall of Information across Varying Degrees of Title-Visualization Misalignment, CHI 2019
- Kim, Setlur & Agrawala, Towards Understanding How Readers Integrate Charts and Captions, CHI 2021
- Lisa Charlotte Muth, What to consider when using text in data visualizations, Datawrapper Blog, 2022
- IBCS Association (Hichert & Faisst), International Business Communication Standards, 2017
- Amanda Cox, talks/interviews as Graphics Editor of the New York Times (c. 2011-2016)
- Ren, Brehmer, Lee, Höllerer & Choe, ChartAccent: Annotation for Data-Driven Storytelling, IEEE PacificVis 2017
- Stokes, Setlur, Cogley, Satyanarayan & Hearst, Striking a Balance: Reader Takeaways and Preferences from Integrated Text and Charts, IEEE VIS 2022
- Hullman & Diakopoulos, Visualization Rhetoric: Framing Effects in Narrative Visualization, IEEE TVCG 2011
- Segel & Heer, Narrative Visualization: Telling Stories with Data, IEEE TVCG 16(6), InfoVis 2010
- Mike Bostock, How To Scroll, bost.ocks.org, 2014
- Russell Goldenberg, How to Implement Scrollytelling / Introducing Scrollama, The Pudding, 2017
- The Pudding, Responsive Scrollytelling Best Practices, 2017
- McKenna, Riche, Lee, Boy & Meyer, Visual Narrative Flow, EuroVis 2017
- New York Times, Snow Fall, 2012 (genre landmark)
- Bateman, Mandryk, Gutwin, Genest, McDine & Brooks, Useful Junk? The Effects of Visual Embellishment, CHI 2010
- Haroz, Kosara & Franconeri, ISOTYPE Visualization: Working Memory, Performance, and Engagement with Pictographs, CHI 2015
