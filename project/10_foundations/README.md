# 10_foundations · 人類導覽

設計標準集中地。打開 `project/susugigi.html` 後，左側 TOC 的 Foundations 對應到本目錄。

## 載入順序依賴圖

```
no1_atomic_tokens          ← 原料：顏色 / 主題 / 玻璃 / 陰影階梯 / 遮罩
        ↓
no2_canvas_tokens          ← 從 THEME_1 攤平的 canvas 快照
        ↓ (與 no2 平行)
no3_typography             ← 字體系統
no4_layout_tokens          ← 間距 / 圓角 / 動畫 / icon 尺寸 / 觸控
no5_platform_tokens        ← iOS 系統色 / action icon map
no6_icon_library           ← 205 phosphor SVG
        ↓
component_tokens/no1–no13  ← 元件級 token（引用上層原料）
        ↓
15_fixtures/no1–no4        ← mock + helpers（不在本目錄，平行載入）
        ↓
20_components/components   ← 元件實作（讀 token 渲染）
30_screens/screens         ← 26 個畫面
        ↓
visualizers/no0_shared_card_kit
visualizers/atomic/no1–no4
visualizers/component_tokens/no1–no13
visualizers/brand/no1
visualizers/icon_library/no1
        ↓
20_components/components_showcase ← 5 family demo（Components group 5 leaf 各自取一個 Section）
        ↓
50_explorations/*          ← 5 個探索（消費 fixtures）
        ↓
90_workbench/app           ← router + Side TOC
```

## 找一個 token 的家：速查

| 想找 | 去 |
|---|---|
| 顏色：PALETTE / THEME_1 / THEME_2 / GLASS_BASE / SHADOW_ELEVATION / SCRIM_LEVELS | `no1_atomic_tokens.jsx` |
| canvas 快照：TOKENS / CHART_COLORS / GLASS | `no2_canvas_tokens.jsx` |
| 字體：TYPOGRAPHY / TYPE_STYLES / LINE_HEIGHT / LETTER_SPACING | `no3_typography.jsx` |
| 版面：SPACING / RADIUS / SHADOW / MOTION / ICON_SIZE / HIT_TARGET / ROW_HEIGHT | `no4_layout_tokens.jsx` |
| iOS 系統色 / Action Icon Map | `no5_platform_tokens.jsx` |
| 205 phosphor icon | `no6_icon_library.jsx` |
| 元件級 token：LIST_TOKENS / TX_LIST_TOKENS 等 13 組 | `component_tokens/noN_*.jsx` |
| Mock 資料：CATEGORIES / ACCOUNTS / TX | `../15_fixtures/no1-no3.jsx` |
| Helper 函式：fmt / groupByDate 等 | `../15_fixtures/no4_helpers.jsx` |
| 元件視覺化卡片組件：TokenTableCard / Swatch / AnatomyRuler | `visualizers/no0_shared_card_kit.jsx` |

## TOC ↔ 資料夾雙向映射

見 `CLAUDE.md` 的 TOC 對應表。
