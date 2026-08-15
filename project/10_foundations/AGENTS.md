# Foundations 局部規則

- 本層疊加 repo 根規則。
- 本目錄是設計標準權威。
- atomic token 是基礎階梯。
- component token 引用 atomic。
- visualizer 只讀活 token。

## 修改連鎖

- 改 atomic 會影響下游 token。
- 改 component token 同步 visualizer。
- 新增類別同步 HTML 載入順序。
- 禁止重命名既有 export。
- 新增 export 仍需檢查消費端。

## 互動狀態

- Pressed 使用 `surface_hover`。
- Pressed 不降低整列 opacity。
- Disabled 降低文字層級。
- Disabled 不改背景。
- Selected 使用 trailing 標記。
- Pressed 優先於 Selected。
- 手勢容器維持相同視覺結果。
- Canvas row 使用 pointer events。
- 手勢子元件可改用 touch events。

## 載入驗證

- 依賴順序以 HTML 為準。
- 修改後驗證載入順序。
- TOC 以 Router 清單為準。

## 指令檔維護

- `AGENTS.md` 是本層真相。
- `CLAUDE.md` 僅保留相容入口。
