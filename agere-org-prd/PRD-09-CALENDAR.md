# PRD-09 — Calendar

> **Amendment 25 Sep 2026 — Space → Project:** the app's display name is now **Project** and its URLs live under `/{slug}/projects/…`. The internal app id (`space`), event names (`space.*`), grants and tables are unchanged (PRD-06 §6.5). Text in this PRD was updated accordingly; no requirement changed.

> ## QA amendment (v1.0.2 — 26 Sep 2026)
>
> - **K1 — Views (QA KL1).** *Hari* shows exactly one date (plus a "Terlambat" block when that date is today); *Minggu* shows Monday–Sunday; *Bulan* a 6-week grid; *Agenda* 14 days. On phones only Hari and Agenda are offered.
> - **K2 — Rescheduling (QA KL2).** Items link straight to the due field of their source; drag to reschedule is release 2+.
> - **K3 — Legibility (QA A3, A4, AD11).** Out-of-month dates and completed items keep ≥ 4.5:1 contrast in both themes; completion is shown with strikethrough and a muted surface, not opacity. A source hidden because its app is disabled is labelled "(aplikasi nonaktif)", otherwise "(tanpa akses)". An error uses one pattern only: partial banner with the sources that loaded (rule 2 above), never partial and total at once.

> ## Release status & alignment addendum (v1.0.1 — 25 Sep 2026)
>
> **Release:** deferred to **release 2** (PRD-00 §3.3). In release 1, "Tugas saya" in Project (PRD-06 §6.3) covers what is due.
>
> **Before build:** upgrade to template v1.1. Until then, these rules are binding and **override any conflicting v1.0 text**:
>
> 1. **Architecture:** Calendar aggregates **at query time** through each module's Schedulable provider (PRD-00b §8.2). This preserves the v1.0 rule that Calendar is a read surface and the source app is the source of truth. There is no copied read model, so the "Calendar reflects the new state" AC holds on every load.
> 2. **Partial data:** if one provider call fails or times out, Calendar shows the other sources plus the notice "Sebagian data belum termuat (Project). Coba lagi." It never shows partial data as complete (v1.0 AC preserved).
> 3. **Time:** the `due` shape (PRD-00b §6.1) and the single timezone rule (PRD-12 §5.2).
> 4. **Access:** each provider filters by authorization. Opening an item goes to the source, which enforces PRD-04 again. Items from disabled apps are hidden (PRD-04 §6.5).
> 5. **Non-goal (release 2):** Google Calendar sync. External Agere products contribute items via events (PRD-00b) only when they integrate.

---

## 1. Problem

Work is distributed across Lead and Project. Users need one place to
understand what is due and what needs attention.

## 2. Goal

Create a unified calendar surface without duplicating source-of-truth
data.

## 3. Sources

- Lead next actions
- Project task due dates
- Future Agere applications through an extensible event contract

## 4. Features

- Day/week/month views
- Source indicator
- Event detail
- Deep link to source record
- User-scoped items
- Filtering by source
- Time/date localization

## 5. Architecture rule

Calendar is an aggregation/read surface. The originating application
remains the source of truth.

``` text
Lead ───┐
        ├──> Calendar
Project ──┘
```

## 6. Success metrics

- Calendar weekly active users
- Event-to-source navigation rate
- Event freshness/latency
- Missing-event rate

## 7. Acceptance criteria

**Given** a Lead next action is assigned to the current user, **When**
Calendar loads, **Then** it appears in the appropriate date/time
context.

**Given** the source item is changed, **When** Calendar refreshes,
**Then** the calendar reflects the new state.

**Given** a user cannot access the source application, **When** they
attempt to open the event, **Then** the source application enforces
authorization.

**Given** an event source is temporarily unavailable, **Then** Calendar
communicates partial data rather than presenting stale data as complete.
