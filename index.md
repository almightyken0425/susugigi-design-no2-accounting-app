# Design Workbench · 結構說明

這份 bundle 是 **演進中的設計庫**，不是歷史快照。設計會持續換口味、加新主題、淘汰舊方案，這份結構就是為了承載這種演進。本 repo 為設計標準的仲裁端，token 與元件決議寫在這裡，spec 與 impl 跟隨。

> 入口：在瀏覽器開 `project/susugigi.html`，頂部 4 個 tab 切換各分頁。
>
> 第一次打開請從 **Intro** 開始。本 repo 角色說明見 `CLAUDE.md` 與 `README.md`。

---

## 為什麼分 4 個頂層 tab

設計檔案需要承載多種不同問題的視角，硬塞在同一頁會混亂。所以拆 4 個頂層 tab，**每個 tab 回答一種問題**：

| Tab | 它回答什麼問題 | 目錄 |
|---|---|---|
| Intro        | 「這份檔案是什麼？怎麼用？」 | `project/00_intro/` |
| Foundations  | 「設計標準的零件——字、顏色、跨元件原語、元件 + 對應 token、品牌資產」。**5 個 group**：Atomic / Component Tokens / Components / Brand / Icon Library；group 與 leaf 清單以 `90_workbench/app.jsx` 的 `FOUNDATIONS_GROUPS` 為唯一真相。Components group 內分 List / Form / Navigation / Chart / Input 五個 family，每個 family 內元件 showcase 與對應 token 表緊鄰擺放。 | `project/10_foundations/` + `project/20_components/components_showcase.jsx` |
| Screens      | 「每個畫面長什麼樣？空 / 載入 / 錯誤狀態？想鳥瞰用畫布縮放。」 | `project/30_screens/` |
| Explorations | 「這個設計問題我想了好幾種做法」（並陳） | `project/50_explorations/` |

Components 不是頂層 tab，已併入 Foundations 作為 group。

### Tab 之間的分工

- **「邊界設計」歸 Screens**：empty / loading / error / overflow 等狀態，是「同一個畫面的不同樣子」，所以放在 Screens 同一個 artboard 區內並列展示。
- **「多版本提案」歸 Explorations**：「同一個設計問題的不同解法」，每個主題自成一個子目錄 + sub-router。
- **Foundations vs Components**：Foundations 是 token + 視覺化的元件樣本；Components sub-item 引用 `20_components/` 的元件實作。
- **想鳥瞰整個 app**：直接在 Screens 用畫布的縮放（trackpad 二指捏合 / Ctrl+滾輪）拉遠即可。

### 決策狀態詞彙

設計會演進，沒有真正的 FINAL。在 artboard label 用以下詞彙表達狀態：

| 詞彙 | 意思 |
|---|---|
| `[Current]` 或 `Current direction · YYYY-MM-DD` | 目前傾向採用（附最後變動日期） |
| `Open question` | 這個問題還沒決定 |
| `Explored` | 看過、沒採用、保留參考 |
| `Superseded by V9 · YYYY-MM-DD` | 被某版本取代 |
| `Deprecated` | 完全淘汰 |

口味換了就改日期、改狀態，不要刪歷史。歷史是判斷下一輪方向的素材。

---

## Design 是仲裁端：多層 git 的關係

本 repo 在 SuSuGiGi 多層 git 中擔任**設計標準的仲裁端**：

- **觸發點可雙向：** impl 開發中發現某個字太小、Design 探索想換配色、Spec 邏輯需要新狀態，任一端都可發起變動訊號
- **決議寫進本 repo：**
    - token 寫在 `project/10_foundations/`（atomic 層 noN_*.jsx 與 `component_tokens/`，以 Apple HIG / iOS Dynamic Type 為錨點）
    - 元件寫在 `project/20_components/components.jsx`
    - 畫面寫在 `project/30_screens/` 各 `noN_<name>_screen/` 子目錄
- **下游跟隨對齊：**
    - **impl repo：** `no5_product_development/no2_accounting_app/` 跟著 `src/constants/theme.ts` / `src/components/` / `src/screens/` 對齊
    - **spec repo：** `no3_product_specs/no2_accounting_app/` 跟著 `no2_screens/` 與引用元件的規格對齊

data model 與 logic 的仲裁端是 Spec git（不經 design）。跨層同步矩陣以 `~/.claude/skills/decision_framework_router/products_registry.md` 的 sub_mapping 為權威來源。

---

## 目錄結構速查

```
project/
├── susugigi.html                  主入口
├── 00_intro/intro.jsx             Intro 分頁
├── 10_foundations/
│   ├── no1-no6 atomic 檔          色彩 / canvas 快照 / 字體 / layout / 平台 / icon 集
│   ├── component_tokens/          元件級 token（一元件一檔）
│   └── visualizers/               Foundations 各 group 的視覺化 Section
├── 15_fixtures/                   Mock 資料 + canvas helpers（不對齊 spec / impl）
├── 20_components/
│   ├── components.jsx             元件實作（被 showcase 與 screens 共用）
│   └── components_showcase.jsx    5 個家族 showcase（List / Form / Navigation / Chart / Input），
│                                  每個 family 內元件與對應 token 表緊鄰擺放，
│                                  由 FoundationsComponentsSection 串在 Foundations > Components 子項內
├── 30_screens/                    26 個 noN_<name>_screen/ 子目錄 + shared/
├── 50_explorations/               各主題子目錄（清單以磁碟與 app.jsx 的 EXPLORATION_GROUPS 為準）
├── 90_workbench/
│   ├── app.jsx                    ViewTabs router + SCREEN_META + ScreenFrame
│   ├── design_canvas.jsx          DesignCanvas / DCSection / DCArtboard
│   └── ios_frame.jsx              IOSDevice 邊框
├── assets/
│   ├── logo.svg                   品牌 monogram
│   └── wordmark.svg               logo + 文字 lockup
└── 99_deprecated/                 已淘汰
```

數字前綴 `00 / 10 / 20 / 30 / 50 / 90 / 99` 保證檔案系統內的顯示順序與概念順序一致。新增分頁時挑空著的 10 倍數段落即可（40 / 60 / 70 / 80 目前空著）。

---

## 常見操作

### 新增一個正式畫面

1. 在 `30_screens/` 新增 `noN_<name>_screen/` 子目錄（`tokens.jsx` + `noN_subsections.jsx` + entry `noN_<name>_screen.jsx`），並在 `susugigi.html` 加 script 載入
2. 在 `90_workbench/app.jsx` 的 `SCREEN_META` 加 meta，並在 `SCREEN_GROUPS` 加群組
3. 仲裁完成後，spec 在 `no2_screens/noN_<name>_screen.md` 補規格，impl 在 `src/screens/<Name>/` 跟進實作

### 新增一個可重用元件

1. 在 `20_components/components.jsx` 加實作
2. 在 `20_components/components_showcase.jsx` 加 DCArtboard 展示
3. 仲裁完成後，impl 在 `src/components/**` 跟進，引用該元件的 spec 在 `no2_screens/` 更新

### 新增一個探索主題

1. **複製任一現有主題目錄**，重命名為新主題 slug
2. 敘述寫在 `variants.jsx` 頂部的 IntroBlock 元件（無需 README.md）
3. 在 `90_workbench/app.jsx` 的 `EXPLORATION_GROUPS` 接 router
4. 在 `susugigi.html` 加新 script 載入

Explorations 為純設計探索，**完全隔離不牽動 spec 與 impl**。

### 在現有畫面加邊界狀態（empty / loading / error）

1. 在 `30_screens/` 對應 screen 子目錄的 entry 內 variant switch 加新分支（如 `variant="empty"`）
2. 在 `90_workbench/app.jsx` 的 `SCREEN_META` 加對應 id，並在 `SCREEN_GROUPS` 該群組加一筆
3. 仲裁完成後，spec 補狀態描述、impl 跟進實作

### 標記決策變化

直接改 artboard label：移除 `[Current]` 改成 `Superseded by X · YYYY-MM-DD`，新提案標上 `[Current]`。

---

## URL hash 對照

| Hash | View |
|---|---|
| `#intro` | Intro |
| `#foundations` | Foundations |
| `#screens` | Screens |
| `#explorations` | Explorations |

舊 hash 別名（向後相容，自動轉跳）：

- `#overview` → `#screens`
- `#flows` → `#screens`
- `#all` → `#screens`
- `#filter` / `#tx-list` / `#recurring` / `#row-height` → `#screens`
- `#design_system` → `#foundations`
- `#components` → `#foundations/components`
- `#foundations/tokens` / `#foundations/spacing` → `#foundations/atomic/layout`（group 化重排）
