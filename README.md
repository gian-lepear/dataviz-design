# dataviz-design

A [Claude Code](https://claude.com/claude-code) skill on **dataviz UX**: dashboards, charts, tables, KPIs, maps, reports, and analytical screens — designing from scratch or reviewing what's there.

It covers dashboard anatomy, drill/cross-filtering (no dead ends), choosing a chart by the relationship you're showing, perception (Cleveland-McGill), data-ink (Tufte), storytelling (Knaflic), and integrity (Cairo). A deep matrix in `references/` goes further on 17 topics — chart choice, perception, color, tables, KPIs, maps, interaction, storytelling, typology/IBCS, integrity/uncertainty, time series, real-time/monitoring, accessibility/mobile, process, evaluation, performance, and email — plus a file of worked examples.

## The skill in one picture

The same six months of data as a naive dashboard, and as one built with the skill applied end-to-end:

![Two mini-reports side by side. Without the skill: a generic "Q3 Dashboard" title, rainbow KPI boxes with no deltas, and a truncated rainbow bar chart that exaggerates a 9% climb. With the skill: a conclusion title, KPI tiles with deltas and sparklines (churn flagged red), and one honest line chart with a labeled axis, a target line, and an as-of stamp.](assets/mini-reports.svg)

Single-rule worked cases (truncated axis, pie-for-comparison, everything-colored, number-without-baseline) live in [`references/examples.md`](references/examples.md).

## Install

Clone it into Claude Code's skills folder:

```bash
git clone https://github.com/gian-lepear/dataviz-design ~/.claude/skills/dataviz-design
```

Or for a specific project:

```bash
git clone https://github.com/gian-lepear/dataviz-design .claude/skills/dataviz-design
```

## Use

Trigger: `/dataviz-design`, or Claude invokes it on its own for any dashboard/chart/table/KPI/map/analytical-screen work.

## Structure

- `SKILL.md` — main flow (0→15) plus the index into the reference matrix.
- `references/` — 17 topic files plus `examples.md`, read on demand when the work goes deep.

## Pairs with

- `frontend-design` — visual identity / avoiding a templated look.
