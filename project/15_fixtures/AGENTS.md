# Fixtures 局部規則

- 本層疊加 repo 根規則。
- fixtures 只供 canvas 示意。
- fixtures 不屬設計標準。
- fixtures 不對齊 Spec mock。
- Impl 不消費 fixtures。
- helper 必須是 pure function。
- helper 不引用 Impl 業務邏輯。
- fixtures 禁止定義 token。
- 本層在所有消費端前載入。

## 指令檔維護

- `AGENTS.md` 是本層真相。
- `CLAUDE.md` 僅保留相容入口。
