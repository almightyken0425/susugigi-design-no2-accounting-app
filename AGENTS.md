# 記帳 App 設計指令

- 本 repo 是 Module Design git。
- module id 是 `no2_accounting_app`。
- 本 repo 是設計標準仲裁端。
- 本 repo 承載 design canvas。

## 工件邊界

- Design 仲裁視覺與互動。
- Spec 仲裁資料與邏輯。
- Impl 跟隨兩側決議。
- Explorations 不影響其他層。
- 配對規則以產品註冊表為準。
- 跨層分支必須逐字一致。
- 配對 commit 使用相同內容。

## Canvas 結構

- 入口是 `project/SuSuGiGi.html`。
- Router 位於 `90_workbench/app.jsx`。
- 頂層分頁由 Router 仲裁。
- Foundations 清單以 Router 為準。
- Screens 清單以 Router 為準。
- Explorations 清單以 Router 為準。
- Components 屬於 Foundations。

## 動工路由

- 修改前使用 `decision_framework_router`。
- Markdown 必須使用 `universal_writing_linter`。
- 設計工件不套用 `spec_writer`。
- 預覽前遵守 launch registry。
- 不主動啟動 Metro 或 simulator。

## 指令疊加

- 子目錄只寫局部差異。
- 共通配對規則只留本層。
- 子規則不得放寬本層規則。

## 指令檔維護

- `AGENTS.md` 是規則單一真相。
- `CLAUDE.md` 僅保留相容入口。
- 不在相容入口複製規則。
