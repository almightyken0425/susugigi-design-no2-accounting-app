# $wish · Brand bible

本檔由 claude.ai/design 在 2026-05-18 整理產出，描述 $wish 的品牌政策（語氣、視覺基礎、icon 風格）。**Token 數字的權威來源是 `project/10_foundations/` 的 atomic 檔（no1-no6）與 `component_tokens/`**，本檔只描述「為什麼這樣設計」與「用在哪」。

品牌名稱 **$wish** 是 swish 與 $ 的雙關：swish 是物體快速掠過的聲音，籃球空心入網也叫 swish，兼有快與準兩層語感。中文名「速速記記」直指本意——最快記完一筆帳，底層訴求是摩擦力最小、表象是速度。產品是一個單人記帳工具，記下支出、收入、轉帳；依類別或日期分組；用一張 donut chart + focus row 一頁回顧每個月。

---

## Content fundamentals

**語氣。** 安靜且操作型。產品定位是**工具**不是**陪伴者**：沒有擬人化助手、沒有存檔後的恭喜文案、沒有提醒推廣。空狀態描述「無」（「尚無交易紀錄」），不寫建議（「Add your first transaction!」）。

**語言。** 使用者面向字串只用繁體中文（zh-TW）。Code 層的 token 名、註解、設計工件內部 label 自由混合英文 + 中文（技術用語多英文、敘述用中文）。樣本：

| zh-TW | 英譯 | 出現位置 |
|---|---|---|
| 飲食 / 交通 / 購物 / 娛樂 / 居家 / 醫療 / 教育 / 禮物 | 類別 label | `CATEGORIES` |
| 薪資 / 投資 | 收入類別 | `CATEGORIES` |
| 現金 / 玉山活儲 / 國泰世華 信用卡 / 富邦證券 / USD 旅費 | 帳戶名 | `ACCOUNTS` |
| 路易莎咖啡 / 便當 / 捷運月票 / 牛肉麵 / 牙科檢查 / 電費 | 典型交易備註 | `TX` mock |
| 2026年5月 | 期間 label | HomeScreen |
| 餘額 | "balance" | donut center |
| 尚無交易紀錄 | "no transactions yet" | 空狀態 |
| 載入中... | "loading…" | 載入狀態 |
| 已刪除 | "deleted" | undo toast |
| 搜尋... | "search…" | BottomSearchBar placeholder |

**大小寫。** 設計工件內部 surface（Foundations、Intro）的 section label 用全大寫英文 tag（`TYPOGRAPHY`、`SPACING`、`USAGE`）。使用者面向字串都用句子大小寫的中文，從不全大寫吼。數字一律阿拉伯且 tabular-nums（`font-variant-numeric: tabular-nums`）。

**人稱。** 中性 / 非人稱。字串不寫「你的帳戶」——只寫「帳戶」。也不用「我」。

**幣別格式。** `fmt(n, code)` from `project/15_fixtures/no4_helpers.jsx`：

```
NT$1,200   ← TWD（預設）
US$15      ← USD
¥3,200     ← JPY
-NT$185    ← 負數前置 -
≈ NT$480   ← 轉換後的次要金額，顯示在原金額下方
```

**數字。** 用 `toLocaleString('en-US')` 千分位（逗號），中文情境也是。負號用 `-` 不用括號。

**Emoji。** 不用。品牌讀感是 quiet precision，emoji 會破壞 register。Icon 統一用 line-style SVG（見 Iconography）。

**設計內部用語。** 狀態詞彙（`[Current]`、`Open question`、`Explored`、`Superseded by V9 · YYYY-MM-DD`、`Deprecated`）用中括號或單詞 tag。日期格式 `YYYY-MM-DD`。

---

## Visual foundations

### Palette

兩套主題：**Classic Purple**（預設，`theme1`）和 **Ocean Teal**（opt-in，`theme2`）。兩者共用 neutral 色階、status 色、結構；只有 primary 色階 + chart series 互換。

**Primary · Classic Purple** — `#4323a0`（`p-500` / main）。整套 `50 → 900` 色階用在同心情境：淺色用於 surface tint（focus card 背景、status pill），深色用於 donut chart series。對比色 `#F24F13`（暖橘）用得**很省**——保留給需要從紫色淡背景中突圍的瞬間（如交易正負號、注意點）。

**Neutrals。** 標準 0-1000 灰階（`#FFFFFF → #000000`）。有趣的選擇：`bg.base = #F2F2F7`（iOS systemGroupedBackground），不是純白；surface card 浮在這個淡灰上，靠單根 hairline border 收邊。

**Semantic。** `success #4CAF50` / `warning #FFC107` / `error #F44336` / `info #2196F3` — Material defaults。用得很省，從不放大。

### Type

**Font stack：** `-apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang TC", "Noto Sans TC", system-ui, sans-serif`。Mono: `"SF Mono", "Menlo", "Consolas", monospace`。不附自訂字型。**⚠️ Font substitution flag：** impl 用 OS system stack；網頁預覽時 `PingFang TC` 會 fall through 到 `Noto Sans TC`（Google Fonts）顯示 CJK。若需要跨平台視覺更一致，可考慮 ship Noto Sans TC variable webfont。

**Scale：** `xs 12 / sm 14 / base 16 / lg 18 / xl 20 / 2xl 24 / 3xl 30`。

**Weights — 3-weight system：** `light 300` / `regular 400` / `medium 500`。**沒有 semibold 或 bold。** 角色分配：

- `light 300` — list row 標題（`ListItem.title`、`ListItem.value`、`note`）。安靜、好掃。
- `regular 400` — body 段落。
- `medium 500` — 整套系統用到的最高字重。保留給 nav title、modal title、button 文字、金額、heading、總計、CTA。**這是這個系統的「bold」**——表強調，不是表重量。

Line-height：body `1.5`、list row 收緊 `1.4`。Letter-spacing：list item `-0.43px`（對齊 iOS SF Pro 在 17px 的視覺）、title `-0.3px`、設計內部 tag 的大寫 tracking `1px+`。

### Spacing & radius

Spacing 嚴格用 **4 的倍數**：`4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64`。named key：`space-1=4 / space-2=8 / space-3=12 / space-4=16 / space-6=24 / space-8=32 / space-10=40 / space-12=48 / space-16=64`。注意中間有跳號（沒有 `space-5`、`space-7`）——想用就跳到下一階。

Radii：`sm 4 / md 8 / lg 12 / full 9999`。Group card（lists）用獨立的 `14px`（LIST_TOKENS.GROUP_CARD_RADIUS）——比 `lg 12` 稍大一點點，讀起來像「軟磚」不像「按鈕」。Pill（search、FAB）用 `full`。`tx-icon-radius` 的 10px 是刻意一次性的例外。

### Cards & elevation

**Card** 是主要的分組元素。配方：

- 背景：`surface (#FFFFFF)` 浮在 `bg (#F2F2F7)` 上
- Radius：list group `14px`、一般容器 `12px`
- Border：`1px solid rgba(60,60,67,0.10)` — iOS-style hairline（`GROUP_CARD_BORDER_COLOR`）
- **不用 box-shadow。** Hairline + 淡背景就能撐起層次。
- Group 間距：`35px`（LIST_TOKENS.GROUP_CARD_MARGIN_BOTTOM）
- `overflow: hidden` 讓第一個 ListItem 的 `border-top` hairline 被裁掉——divider 只出現在 item 之間。

**Divider。** List row 之間：`0.5px solid rgba(60,60,67,0.10)`（iOS hairline）——透過每個 row 的 `border-top` 畫，第一個會被裁。Section title 分隔用虛線。

### Backgrounds

- 預設 app 背景：`#F2F2F7` 平面色，無圖、無漸層、無 pattern。
- Hero 或 "glass demo" surface 偶爾用 primary 色階的**對角漸層**（如 `linear-gradient(135deg, #4323a0, #c0b6df)`）——只在 Foundations 的 GlassView demo 後面看得到。
- 沒有貼圖、沒有手繪插畫、沒有裝飾性圖像。

### Glass / blur

**GlassView**（鏡像 `src/components/GlassView.tsx`）是 first-class motif，用在：BottomSearchBar pill、FloatingActionBar pill、CalculatorKeypad 鍵。配方：

```
backdrop-filter: blur(28px) saturate(180%);
background:      rgba(255,255,255,0.55);   /* tint */
border:          1px solid rgba(255,255,255,0.85);
box-shadow:      0 4px 12px rgba(0,0,0,0.10);
```

整個品牌的透明度只活在這裡。卡片從不透明、modal 從不透明。Glass = 浮動在內容上的 pill 與鍵盤，僅此。

### Iconography

完整 story 在 [Iconography](#iconography) 節。摘要：line icon、2px stroke，production 用 MaterialCommunityIcons + AntDesign；本 design canvas 用手刻 SVG（`Glyph` component，見 `project/20_components/components.jsx`）重現。

### Animation & motion

- **Easing。** 兩種命名 easing：`--ease-standard cubic-bezier(0.4, 0, 0.2, 1)` 用於 in-place morph（section 收合、值替換），`--ease-spring cubic-bezier(0.2, 1.2, 0.4, 1)` 用於 FAB 進場退場（溫和 overshoot——從不彈跳）。
- **Duration。** 對齊 `MOTION.duration` 階梯：`instant 100ms` / `fast 200ms` / `base 300ms` / `slow 500ms`。Press feedback 用 `instant`；section 收合、值替換用 `fast`；section card morph 與大型過場用 `base` 或 `slow`。
- **Press feedback。** Universal button rule：`button:active { transform: scale(0.97) }`，duration `instant (100ms)`。微微 press-shrink，沒有色彩 flash。List row 額外把背景從 `surface` 翻成 `surface_hover` 顯示按下狀態。Header button 三件套（HeaderIconButton / HeaderCheckmarkButton / ModalCloseButton）與覆寫後的系統返回鍵統一透過 `HEADER_ICON_BUTTON_TOKENS.PRESS_ANIMATION` 套同一規則。
- **Intent 系統。** Header button 三件套 + 覆寫返回鍵以三種 intent 區分語意：`commit`（送出 / 確認，如 checkmark）、`action`（主動觸發功能，如 search / settings / filter / merge / 返回）、`dismiss`（離開當前畫面，如 xmark）。同一 intent 同時驅動 icon 顏色與 expo-haptics 觸覺反饋。本波三 intent **icon 顏色統一用主題色**（commit / action / dismiss 都是 `p500`），保留 map 結構以便未來分化（如 destructive 動作改紅）；haptic 維持差異化（commit 用 `impactMedium`、action 與 dismiss 用 `impactLight`）。對應 token：`HEADER_ICON_BUTTON_TOKENS.COLOR_BY_INTENT` 與 `HAPTIC_BY_INTENT`。
- **Hover。** 行動優先——hover 效果最小。Row 變淡背景到 `surface_hover`，hover 上不動其他東西。
- **沒有 fade、沒有 bounce、沒有慶祝動畫。** Donut chart slice 不會彈進、新交易就是直接出現，沒戲。
- **Donut chart 進場 reveal。** 唯一允許的 donut 動畫例外，且只在 chart-level（整體），不在 per-slice。期間頁面從不可見變為可見時——首次進入首頁、向過去左滑、滑回看過的期間皆然——環形圖從 12 點起點同時往兩側線性 reveal 到完整長度：支出弧 CCW 推進到 `-TAU × rExpense`、收入弧 CW 推進到 `+TAU × rIncome`，兩弧在底部交會點接上。期間頁面變為不可見時不展示退場——頁面隨水平分頁滑出視野時 donut 維持完整顯示，下次再可見時重新 reveal。Duration 對齊 `MOTION.duration.slow (500ms)` 或更短，easing 用 `--ease-standard`。Slice 本身仍遵守上一條「不彈進、不 fade in」規則。

### Layout rules

- 行動 canvas：`402 × 874`（iPhone 16-class viewport）。`project/90_workbench/ios_frame.jsx` 是參考殼層，含 status bar、Dynamic Island、home indicator。
- Safe-area top：`60px` padding-top 給 nav header。Bottom：`34px` 給 home indicator + `24px`（SPACING.xl）給 FAB inset。
- 水平 padding：`16px`（SPACING.lg）在畫面邊緣、`16px` 在卡片內部。
- Lists：卡片從畫面邊緣縮入 `SPACING.lg`（16px），依類別或日期分組。

### Borders, shadows, transparency

- **Border。** Hairline `rgba(60,60,67,0.10)` 到處用；focused / active FocusCard 用 `1.5px solid var(--p-500)`；不會比 1.5px 粗。
- **Shadow。** 幾乎沒東西有 drop shadow。只有 GlassView 元素有 `0 4px 12px rgba(0,0,0,0.10)`。Active 狀態的 FocusCard 有一點點 `0 1px 2px rgba(0,0,0,0.08)`。
- **Transparency。** 保留給 glass surface。Body text 永遠不透明。

### Imagery

產品目前**沒有 imagery**——沒有照片、沒有插畫、沒有頭像、沒有 donut 以外的圖表。視覺場域是文字 + icon + 數字。如果之後要採用攝影，建議走暖色低飽和、日光調，配合 quiet register。

---

## Iconography

**Production（impl）裡：** React Native app 用兩套 icon library：

- `react-native-vector-icons/MaterialCommunityIcons`（MCI）—— 大多類別 icon、calendar / tag / database / cog outline glyph
- `react-native-vector-icons/AntDesign`（Ant）—— wallet、creditcard、star、warning、team 等
- iOS-only fallback 引用 **SF Symbols**（`xmark`、`checkmark`、`chevron.right`、`magnifyingglass`、`gearshape`、`arrow.triangle.merge`、`line.3.horizontal.decrease`）—— 在 iOS 上由 `react-native-vector-icons/SFSymbols` 渲染
- 少數 **FontAwesome** glyph：`plus / minus / exchange / times / check`

完整類別 + 帳戶 icon set 是 `IconDefinition.json` 裡的 **43 筆**，用數字 `iconId` 索引，所以交易記錄指向 icon 是用 id 不是用名稱。`uniqueName`（如 `mci-food`、`ant-creditcard`）編碼了 library + glyph。

**本 design canvas 裡：** impl 用的 icon library 在純 HTML 跑不動，所以 canvas 自己用手刻 inline SVG 重現每個 icon，活在 `Glyph` component（`project/20_components/components.jsx`）。每個 SVG：

- 16×16 viewBox 為基礎尺寸，用 `size` prop 縮放
- Line style，`currentColor` stroke，預設 `stroke-width: 2`
- `stroke-linecap: round` + `stroke-linejoin: round`
- 沒有填色（例外：`check-circle` 和部分類別 icon）

最常用的 30 個 glyph 有獨立 SVG 拷貝放在 `project/assets/icons/`（如果之後補了的話）方便攜出。權威來源仍是 `Glyph`——改在那裡先改，再重新抽。

**Substitution note ⚠️。** 如果要用 `Glyph` 沒有的 glyph，最接近的 CDN 是 **Lucide**（line style、2px stroke、幾何接近）或 **Material Symbols Rounded**（`wght 300, grade 0`）。避免 Heroicons（太細）、Phosphor（太俏皮）、Feather（接近但 food / bus 等比例不對）。

**Emoji。** 從不使用。

**Unicode 當 icon。** 有限：`$` `€` `£` `¥` 在 currency glyph（`currency-usd` 等）用文字渲染，因為小尺寸下比 stylized SVG 還清楚。Nav-back 的 chevron 是 SVG，從不用 `‹` 或 `←`。

---

## App icon

**定案 G4 · 2026-07-07。** 三條微弧、純條內漸層（尾淡頭實）、走勢 30°、淺底 `#F2F2F7`、紫 `#4323A0`。形的語意：速度的殘影，swish 的視覺化——三道剛掠過的痕，尾端還在消散。無字母、無符號、無物件。

**單一版本政策。** 不做 dark / tinted / clear 專屬變體，橘 `#F24F13` 不進 icon；系統外觀模式交由平台自動處理。理由：icon 與 app 內裝同屬 quiet register，變體會稀釋識別。

**iOS 26 呈現政策。** iOS 26 以 Liquid Glass 管線重繪所有桌面 icon。只提供 flat PNG 時，系統自動生成玻璃效果，筆畫邊緣出現非設計本意的高光邊框。定案處置：impl 增設 Icon Composer 分層檔，筆畫層全部壓平——specular 關、shadow 無、translucency 關、layer glass 關——讓 iOS 26 預設外觀貼齊 flat 設計稿。dark / tinted 外觀仍交系統由分層自動生成，維持單一版本政策。

**權威來源。** 幾何常數在 `project/10_foundations/visualizers/brand/no2_app_icon.jsx`（`APP_ICON_G4`），0..100 座標、勿目測改值。跟進端：impl 的 iOS `AppIcon.icon`（Icon Composer 分層檔，承載 iOS 26 呈現）與 `AppIcon.appiconset/icon-1024.png`（iOS 18 及以下 fallback），以及 Android `mipmap-*`＋adaptive（`drawable/ic_launcher_foreground.xml`、背景 `#F2F2F7`）。

**演進紀錄。** 探索與收斂全程在 design canvas Explorations > App Icon（Axis 1 書法飛白 → Axis 4 命名廣掃 135 案 → Axis 5 因子實驗 → Axis 6 深化場、角度掃描定 30°）。
