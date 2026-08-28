# SuSuGiGi · Accounting App · Module Design git

本 repo 是 SuSuGiGi 產品 `no2_accounting_app` module 的 **Module Design git**，承載該 module 的設計工件、視覺原型與 design canvas。在多層 git 中擔任設計標準的仲裁端。

## 角色

多層 git 中的設計層：

- **Product git**：上一層，承載提案 / 需求 / Product Map / Roadmap
- **Module Design git**：即本 repo，承載 design canvas、視覺工件、設計標準權威
- **Module Spec git**：對側，承載行為規格（`no3_product_specs/no2_accounting_app/`）
- **Module Impl git**：對側，承載實作（`no5_product_development/no2_accounting_app/`）

## 入口

在瀏覽器開 `project/susugigi.html`，**4 個頂層 tab** 切換各視角：Intro / Foundations / Screens / Explorations。

Components 不是頂層 tab，已併入 Foundations 作為 sub-item。

詳細結構說明見 `index.md`。

## 仲裁模型

本 repo 是設計標準的**仲裁端**：

- **觸發點可雙向：** impl 開發中發現某個字太小、Design 探索想換配色、Spec 邏輯需要新狀態，任一端都可發起變動訊號
- **決議寫進本 repo：** 所有 token / 元件 / 畫面的最終決議寫在本 Design git
- **spec 與 impl 跟隨對齊：** 仲裁完成後，spec 在 `no2_screens/` 補狀態描述，impl 在 `src/` 跟進實作
- **token 錨點：** Apple HIG / iOS Dynamic Type

data model 與 logic 的仲裁端在 Spec git（不經 design），跨層同步矩陣以 `~/.claude/skills/decision_framework_router/products_registry.md` 為權威來源。

## 撰寫規範

設計工件不適用 `spec_writer` 政策。所有 .md 仍適用 `universal_writing_linter` 通用政策。

## 歷史

本 repo 原為 `SuSuGiGi/no99_archive/claude_design_handoff_susugigi_20260506/`，由 claude.ai/design 產出的 handoff bundle。2026-05-15 提拔成獨立 Module Design git，移除原 `chats/` 對話紀錄資料夾。2026-05-19 將 Foundations 重訂以 Apple HIG / iOS Dynamic Type 為錨點，並從 impl-following 模型轉為 design-arbiter 模型。
