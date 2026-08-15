# Visualizer 局部規則

- 本層疊加 Foundations 規則。
- 每個 leaf 對應一個 Section。
- group 與 leaf 以 Router 為準。
- 共用卡片 kit 必須先載入。
- visualizer 只讀活 token。
- 禁止在 visualizer 定義 token。
- 禁止重複定義共用卡片。

## Component token 對帳

- token 檔與 visualizer 一對一。
- `descriptions` key 必須齊全。
- `sources` key 必須齊全。
- key 變動必須同步兩側。

## Canvas 階層

- 階層是 Section 到 Family。
- Family 再包含 Artboard。
- Artboard 不直掛 Section。
- 單一 Artboard 仍需 Family。
- Family id 使用 kebab case。
- Artboard 只能同 Family 重排。
- 持久化資料不得跨 Family。
- 左右鍵在 Family 內切換。
- Shift 加左右鍵跨 Family。
- 上下鍵跨 Section 切換。
- 順序寫入 canvas state 檔。

## 指令檔維護

- `AGENTS.md` 是本層真相。
- `CLAUDE.md` 僅保留相容入口。
