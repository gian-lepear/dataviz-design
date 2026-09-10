# Render-time verification: proving the chart in a browser

> Reference for the dataviz-design skill. Load when: the chart or dashboard exists as running code (an artifact, a dev server, a static HTML file) and you are about to call it done, accessible, responsive, or correct. This file turns the normative rules of SKILL.md into probes a browser can answer, and marks the ones it cannot.

## Why the source file is not enough

Reading the chart code proves intent, never result. These rules are all stated in SKILL.md and **none of them is decidable from source**, because each depends on the font, the container width, the data actually loaded, and the reader's environment:

| Rule | Why source cannot answer it |
|---|---|
| §7 "legible > complete" on the X axis | whether tick labels collide depends on the rendered text width, not on the tick count you chose |
| §5 / §10 contrast | the effective background is composited from ancestors and the theme; a token name proves nothing |
| §10 "color encoding alone" | the redundant channel may exist in the code and be overridden by the chart library's defaults |
| §9 mobile | reflow at 390px is a layout outcome; "it's responsive" is not an observation |
| §3 no dead ends | whether a click re-filters or opens a drill is behavior, only observable by clicking |
| §7 empty series | the empty state only appears with data that empties it |
| §10 freshness stamp | present in the template ≠ rendered with a real date |

A chart that was never rendered has not been reviewed. Say so plainly rather than implying verification you did not run.

## Transport: Claude in Chrome

The browser tools are deferred. Load them in **one** call, never one per tool:

```
ToolSearch "select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__javascript_tool,mcp__claude-in-chrome__browser_batch,mcp__claude-in-chrome__computer"
```

The extension needs a site permission for the origin you are about to open; if a call comes back denied, ask the user to grant it in the extension rather than retrying.

**Get the page to a reachable URL first.** The probe needs the chart to be the main document:

- **Published artifact**: the page lives in a cross-origin iframe (`*.frame.claudeusercontent.com`) that receives no clicks, keys, or scripts. Use `Artifact action:read` to save the HTML locally, then serve that directory: `python3 -m http.server 8791 --bind 127.0.0.1` and open `http://127.0.0.1:8791/<file>.html`. Bind to `127.0.0.1`, not `0.0.0.0`.
- **Dev server**: use the app URL already running. Probe the default port before spawning a second server.
- **Static file**: serve it the same way; `file://` is not a reliable origin for the extension.

## The probe

`scripts/chart-probe.js` runs the mechanical half of the checklist in one call and returns a digest that fits the tool channel (which truncates around 1 KB). It covers charts drawn in `<svg>` **and** charts drawn in HTML/CSS, plus the table rules that a rendered DOM can decide.

Serve it next to the page, then:

```js
await import('http://127.0.0.1:8791/chart-probe.js'); await chartProbe()
```

Or paste the file's contents as the `javascript_tool` payload; it is a self-running IIFE. Options: `chartProbe({ root: '#dashboard', width: 390, maxSamples: 8 })`.

What it decides:

| Check | Severity | Rule enforced |
|---|---|---|
| `page-overflow-x` | error | §9, WCAG 1.4.10 — the page must not scroll sideways; a table's own scroll container is fine and is listed separately under `scrollers` |
| `text-clipped` | error | §7 — a label cut by its box or spilling out of the svg viewport |
| `tick-collision` | error | §7 — overlapping label pairs on the same row |
| `contrast-text` | error | WCAG 1.4.3 — below 4.5:1 (3:1 at ≥24px), against the real composited background |
| `contrast-mark` | warn | WCAG 1.4.11 — mark below 3:1; a directly labelled mark and a decorative gridline are exempt, so read the samples before acting |
| `color-only-series` | warn | §5, WCAG 1.4.1 — multiple line series sharing one dash pattern with no markers |
| `no-text-equivalent` | warn | §10, Chartability — svg with no `<title>`/`<desc>`/`aria-label` |
| `scheme-ignored` | warn | the reader asked for dark or light and the page paints the other, with no `[data-theme]` in play |
| `canvas-opaque-to-probe` | info | a `<canvas>` chart is pixels; none of the above was measured for it |
| `contrast-text-html` | error | WCAG 1.4.3 for text written in HTML, not inside `<svg>`: a cell value, an axis label or a legend written as an element was never covered by `contrast-text` |
| `contrast-mark-html` | warn | WCAG 1.4.11 for marks drawn in HTML/CSS (a `div` bar, a dot grid, a heat-map cell). Fill, `border` and `box-shadow` all count, whichever gives the strongest contrast |
| `no-text-equivalent-html` | warn | §10, Chartability — an HTML/CSS chart group with no `figure`/`table`/`role`/`aria-label` wrapper. A mark that sits beside its own label (a legend) is exempt |
| `mark-size-floored` | error | §15, lie factor — a mark rendered exactly at its `min-width`/`min-height`: the floor is clamping the encoding, so two different values draw the same length. Usually only binds at the narrow end, which is why it is a render-time check |
| `html-chart-only` | info | the surface draws its charts in HTML/CSS, so the svg-only checks (`tick-collision`, `color-only-series`, svg text contrast) did not run |
| `table-numeric-align` | error | `tables.md` (Few 2004; Wilke 2019) — a numeric column not right-aligned. A grid of one/two-digit codes with a fill is treated as a mark grid, not a column of magnitudes, and is exempt |
| `table-tabular-nums` | warn | `tables.md` (Rutter 2017) — a numeric column without lining tabular figures, so digits do not stack |
| `table-decimal-mixed` | warn | `tables.md` (Wilke 2019) — a column mixing decimal precision, which shifts the decimal point down the column |
| `table-vertical-rules` | warn | `tables.md` (Wilke 2019; Rutter 2017) — vertical rules between columns; alignment already separates them |
| `table-row-height` | warn | `tables.md` (Few 2004) — rows under 1.6x the text size, where adjacent rows fuse |
| `numero-sem-comparacao` | warn | §6 — a hero number (≥24px) with no baseline in its own tile nor in the sibling tiles that share its shape. A trio of today/after/difference counts as the comparison; an unrelated number elsewhere on the page does not |
| `sem-carimbo-de-data` | warn | §10 — a surface carrying numbers with no as-of date anywhere in it: a number with no reference date is neither trustworthy nor auditable |
| `nao-verificado-aqui` | info | emitted on **every** run, including clean ones: names the half this probe cannot decide (§11 form, §12 encoding, §14 message, §4 consistency) so "no findings" is never read as "reviewed" |

The digest is a summary. Drill into one check with `__chartReport.findings[N].samples`; the full report stays in `globalThis.__chartReport`.

Run it at least twice: once at the delivered width, once with `{width: 390}`. For the other colour scheme, set `document.documentElement.dataset.theme = 'dark'` (or the project's own switch) and probe again; contrast is a property of a rendered theme, so a single pass only clears one of them.

## What the probe cannot answer

These stay manual, and they are the expensive half. Do them with `computer` clicks and `javascript_tool` assertions:

- **§3 dead ends.** Click a bar, a legend row, a map region. Assert something changed: the querystring, a drawer, the highlighted slice. A tooltip is not an answer. `clickableMarks` in the digest is the input to this test, not its verdict: zero clickable marks on an analytical screen is already a failure.
- **Tooltip trio (WCAG 1.4.13).** Dismissible with Esc, hoverable (the pointer can enter it), persistent (it does not vanish on its own).
- **Legend as control (§8).** Toggling a series hides it and rescales nothing it should not.
- **Animated transition (§8).** Update the data and check the marks morph instead of repainting.
- **Empty and error states (§7).** Filter down to zero rows and confirm a message with an action appears in place of the dead area.
- **Canvas charts.** Nothing above is readable. Ask the library for its state through its own API, or accept that this surface was not verified and say so.

## Gotchas of this setup, all measured

- **A promise comes back as `{}`.** The tool channel does not await what you return. `chartProbe()` is
  synchronous for that reason; only the `{width}` form returns a promise, and it must be called with `await`.
- **Never `requestAnimationFrame`.** A tab that is not the foreground tab never paints, so rAF never fires and the call hangs until the tool times out. Use `setTimeout`.
- **`resize_window` reports success and changes nothing** when the browser window is maximized. Measure a narrow viewport with a same-origin iframe instead, which is what `chartProbe({width})` does.
- **Screenshots time out** on pages with dozens of SVGs, and the failure does not clear on a blank page or a fresh tab. Charts are exactly that page. Measure by JS; a screenshot is a nice-to-have, never the verification channel.
- **The mouse wheel traps** over a `div` with `overflow-x: auto`, which every wide table has. Scroll with the cursor in the page margin.
- **Pages that restore state** via `sessionStorage` will not be on the tab you think. Drive them by URL hash, not by clicking the tab.

## The loop is bounded

Measure once, fix everything the report shows in one batch, measure once more, stop. An open-ended polish loop against a live page burns the user's money to find less than the first pass already did.

## Sources

- W3C, WCAG 2.1 SC 1.4.1, 1.4.3, 1.4.10, 1.4.11, 1.4.13 — the thresholds the probe encodes; the reasoning lives in `references/accessibility-mobile.md`
- Frank Elavsky, Chartability (2022) — the manual half of this file is the Operable and Compromising principles applied
- The gotchas are session findings on a Claude-in-Chrome bridge, not vendor documentation; re-test them if the transport changes
