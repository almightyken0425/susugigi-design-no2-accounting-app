---
name: susugigi-design
description: Use this skill to generate well-branded interfaces and assets for SuSuGiGi — a personal accounting / general-ledger mobile app (個人記帳 App) — either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and the canonical design canvas with React HTML components for prototyping. The brand is iOS-native in feel, Traditional Chinese (zh-TW) first, with a quiet 3-weight type system and a Classic Purple primary palette (#4323a0).
user-invocable: true
---

Read the `brand.md` file within this skill, and explore the other available files.

Key entry points:

- `brand.md` — voice / content / visual foundations / iconography
- `project/10_foundations/` — canonical token source: atomic 檔 no1-no6（`PALETTE` / `THEMES` / `TYPE_STYLES` / `TYPOGRAPHY` / `SPACING` / `RADIUS` 等）+ `component_tokens/`（一元件一檔）；mock data（`CATEGORIES`, `ACCOUNTS`, `TX`）在 `project/15_fixtures/`
- `project/susugigi.html` — the design canvas; open in a browser to browse Intro / Foundations / Screens / Explorations（Foundations 5 個 group：Atomic / Component Tokens / Components / Brand / Icon Library，清單以 `90_workbench/app.jsx` 的 `FOUNDATIONS_GROUPS` 為準）
- `project/20_components/components.jsx` — `Glyph`, `ListItem`, `GroupCard`, `GlassView`, `DonutChart`, `FocusCard`, etc. (canonical visual implementations)
- `project/30_screens/` — 26 production-mirrored screens, one `noN_<name>_screen/` subdirectory each, with empty / loading / error variants
- `project/90_workbench/ios_frame.jsx` — iOS 26 (Liquid Glass) device shell
- `project/assets/logo.svg`, `project/assets/wordmark.svg` — brand marks

When creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy `project/assets/` into your output folder and read token values from `project/10_foundations/` 的 atomic 與 component token 檔 (do NOT manually re-type them — risk of drift).

When working on production code (the real impl at `no5_product_development/no2_accounting_app/`), the impl's `src/constants/theme.ts` is the source of truth. This design canvas mirrors it.

If the user invokes this skill without any other guidance, ask them what they want to build or design (mobile screen mock? marketing one-pager? slide deck for an internal review?), and act as an expert designer who outputs HTML artifacts **or** production code, depending on the need.

Hard rules for this brand:

- Type system has **only** three weights — 300 / 400 / 500. Never use 600+ unless a heading style already defined in `project/10_foundations/no3_typography.jsx`（`TYPE_STYLES`）calls for it.
- Numerals are always tabular (`font-variant-numeric: tabular-nums`) on amounts, dates, balances, percentages.
- No emoji. No gradient backgrounds outside the `GlassView` demo. No drop shadows on cards (hairline border only). No filled rectangular CTA buttons — actions live as header text/icon, FAB pill, or full-row list items.
- Cards use 14px radius and `1px solid rgba(60,60,67,0.10)` hairline border over a `#F2F2F7` tinted background.
- Empty states describe the absence ("尚無交易紀錄"), never advise ("Add your first!"). Voice is operational, not friendly.
- Customer copy is Traditional Chinese (zh-TW). Currency: `NT$1,200` (TWD prefix, comma-grouped, `-` sign).
