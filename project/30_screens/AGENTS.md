# Screens 局部規則

- 本層疊加 repo 根規則。
- 本目錄是畫面設計仲裁端。
- screen 清單以 Router 為準。
- 每個 screen 使用獨立子目錄。
- 子目錄名稱對齊 Spec 與 Impl。

## 檔案粒度

- `tokens.jsx` 承載 screen token。
- subsection 承載私有區塊。
- entry 承載 screen 主元件。
- Home 可增加 period page。
- 子目錄內依依賴順序載入。

## Token 邊界

- screen token 引用既有階梯。
- 可重用參數放 component token。
- composition 參數留在 screen。
- raw number 必須標註原因。
- 檔尾只 export 本檔 symbols。

## Variant 邊界

- 每個 screen 只有一個 entry。
- variant 在 entry 內分支。
- 禁止為 variant 拆檔。
- variant 必須對應 Impl 狀態。
- 不為不存在的狀態造設計。

## Helper 分流

- 單 screen helper 留在子目錄。
- canvas 限制可放 shared。
- Impl 已共用才升 components。
- 升級時同步元件 showcase。
- `DeleteButton` 保持共用元件。
- Editor helpers 因 namespace 共用。

## Router 與載入

- screen 變動同步 `SCREEN_META`。
- screen 變動同步 `SCREEN_GROUPS`。
- screen 變動同步 HTML scripts。
- shared 必須先於 screen 載入。
- screens 必須先於 Router 載入。
- 跨 screen 依賴遵守數字順序。
- 幣別 mock 必須先於其消費端。

## 命名

- Screen component 使用 PascalCase。
- Screen component 加 `Screen` 後綴。
- subsection 使用描述性名稱。
- 衝突名稱增加 screen namespace。
- screen token 使用 upper snake case。

## 禁止事項

- screen 內禁止定義 atomic token。
- screen 內禁止定義 component token。
- 禁止擅改既有 export 名稱。
- 禁止升級不存在的 Impl 元件。

## 指令檔維護

- `AGENTS.md` 是本層真相。
- `CLAUDE.md` 僅保留相容入口。
