# CLAUDE.md · `30_screens/`

本目錄為 SuSuGiGi accounting app 26 個目標 screen 的設計工件，每個 screen 對應 impl 的 `src/screens/<Name>/`，作為設計標準仲裁端。

## 內部分層

```
30_screens/
├── CLAUDE.md
├── shared/
│   ├── no1_screen_layout.jsx           Spinner / ScreenScroll（design canvas 對應 RN 的 helper）
│   ├── no2_editor_form_helpers.jsx     EditorErrorBanner / EditorDateContainer / EditorNoteField
│   └── no3_editor_field_helpers.jsx    EditorFieldLabel / EditorTextInput / EditorPickerCollapsed / EditorSwitchRow
├── no1_home_screen/                    HomeScreen（PeriodPage host + variant routing）
├── no2_home_filter_screen/             HomeFilterScreen（時間粒度/分組 + 帳戶多選）
├── no3_search_screen/                  SearchScreen（底部 BottomSearchBar + 結果列表）
├── no4_transaction_editor_screen/      TransactionEditorScreen（計算機 + 多 picker）
├── no5_transfer_editor_screen/         TransferEditorScreen（雙幣別轉帳）
├── no6_settings_screen/                SettingsScreen（設定主入口 hub；default / subscribed variants）
├── no7_account_list_screen/            AccountListScreen（拖拉排序 + 新增）
├── no8_category_list_screen/           CategoryListScreen（收/支兩 section）
├── no9_currency_list_screen/           CurrencyListScreen（幣別清單 + 搜尋）
├── no10_currency_rate_list_screen/     CurrencyRateListScreen（匯率對清單 + 搜尋）
├── no11_language_setting_screen/       LanguageSettingScreen（2 選 1 SelectionList）
├── no12_time_zone_setting_screen/      TimeZoneSettingScreen（SelectionList + 搜尋）
├── no13_theme_settings_screen/         ThemeSettingsScreen（2 欄 SelectionGrid + 三色預覽）
├── no14_base_currency_setting_screen/  BaseCurrencySettingScreen（SelectionList + 搜尋）
├── no15_launch_mode_setting_screen/    LaunchModeSettingScreen（4 選 1 SelectionList）
├── no16_preference_screen/             PreferenceScreen（4 section hub）
├── no17_data_management_screen/        DataManagementScreen（匯入/匯出/清除所有資料）
├── no18_account_editor_screen/         AccountEditorScreen（new/edit；幣別/類型/圖示 picker）
├── no19_category_editor_screen/        CategoryEditorScreen（new-expense/new-income/edit；映射 + 圖示 picker）
├── no20_currency_detail_config_screen/ CurrencyDetailConfigScreen（千位省略 + 小數位數）
├── no21_currency_rate_editor_screen/   CurrencyRateEditorScreen（add/update；雙金額 = 公式）
├── no22_import_screen/                 ImportScreen（5 step wizard）
├── no24_paywall_screen/                PaywallScreen（年費/月費 plan 選擇）
├── no25_merge_editor_screen/           MergeEditorScreen（account/category；source→target 視覺化）
├── no26_week_start_setting_screen/     WeekStartSettingScreen（跟隨語系/週日/週一 3 選 1）
└── no27_offline_retry_screen/          OfflineRetryScreen（首開離線/清除收尾攔路；default/deletion）
```

每個 `noN_<name>_screen/` 子目錄內含三件套：`tokens.jsx` + `noN_subsections.jsx` + entry `noN_<name>_screen.jsx`。HomeScreen 額外含 `noN_period_page.jsx`。

## Granularity 規則

每個 screen 為一個 `noN_<name>_screen/` 子目錄。子目錄內最多含三類檔案：

- `tokens.jsx` — screen 級 token
- `noN_<purpose>.jsx` — 私有 sub-section 元件、PeriodPage 等內容 host
- entry `noN_<name>_screen.jsx` — screen 主元件

HomeScreen 額外含 `noN_period_page.jsx`（鏡射 impl 的 `HomeScreen.tsx` / `PeriodPage.tsx` 拆分）。

子目錄內 `tokens.jsx` 不加 `noN_` 前綴（子目錄內載入順序固定為 tokens → subsections → period_page → entry）。

## Screen 級 token 規則

每 screen `tokens.jsx` 必須 export `<SCREEN_NAME>_SCREEN_TOKENS`。值必須引用 atomic 階梯（SPACING / RADIUS / TYPE_STYLES / ICON_SIZE / MOTION / TOKENS）或 component_tokens（LIST_TOKENS / TX_LIST_TOKENS / FORM_PICKER_TOKENS 等）；bare number 必須 `// (literal: 原因)` 標記。

**Screen token vs component token 界線：**

- 可重用的元件參數（如 chip border width / list item row height）放 `10_foundations/component_tokens/`
- 本 screen 獨有的 composition 參數（如 `HOME_SCREEN_TOKENS.DONUT_BOTTOM_GAP`）放 screen tokens

檔尾統一 `Object.assign(window, { <NAME>_SCREEN_TOKENS })`。

## Variant 規則

每 screen entry 為單一 component，接受 `variant` prop 內部 switch。禁止為 variant 拆檔。SCREEN_META 透過不同 `variant=` 注入。

例：`<HomeScreen variant="empty"/>` vs `<HomeScreen/>`。

Variant 不憑空設計，照 impl 該 screen 的實際 state 與 navigation parameter：default、empty（impl render ListEmptyState 時必還原）、with-results / no-results（含搜尋互動）、error（impl 端有專屬 error UI 時）、new vs edit（Editor 類照 route.params.id 區分）。

## Helper extraction 規則（三桶）

跨 screen 共用、單 screen 用、提升到 components 三桶分流：

| 桶 | 條件 | 位置 |
|---|---|---|
| Promote to 20_components/ | 跨 screen 共用 **且** impl 端已有獨立元件 | `20_components/components.jsx` + 加 showcase 到 `components-showcase.jsx` 對應 family |
| 30_screens/shared/ | 跨 screen 共用 **但** 僅 design canvas 用（無 impl 對應），或 design canvas 環境限制無法各 screen 重複實作 | `30_screens/shared/noN_*.jsx` |
| Inline | 單 screen 用 | 該 screen 子目錄內 `noN_subsections.jsx` 或 entry inline |

**註 1：** 本目錄的 `shared/no2_editor_form_helpers.jsx`（TransactionEditor / TransferEditor 共用）與 `shared/no3_editor_field_helpers.jsx`（AccountEditor / CategoryEditor 共用）皆為「design canvas 環境限制」促升的例外。impl 端 Editor 類各自 inline 實作 DateContainer / NoteField 與 FormFieldLabel / TextInput / PickerCollapsed，但 design canvas 採 global namespace 無法同名 sub-section 共存，故 promote 共用。視覺上仍與 impl 完全對齊。（刪除鈕原也分散在此二 helper，現已收斂為單一共用元件，見註 2。）

**註 2：** 將來若 impl 重構抽出共用元件（如 EditorDateRow、EditorFormField），可改升入 `20_components/`。刪除鈕即為此情境首例：四個 editor screen 的刪除鈕已收斂為單一共用元件 `DeleteButton`（impl `src/components/DeleteButton.tsx`、design `20_components/components.jsx`），符合「跨 screen 共用且 impl 端已有獨立元件」的 promote 條件，故從 `shared/no2`、`shared/no3` 兩 helper 移入 `20_components/`，並在 `components-showcase.jsx` 的 Form section 加 showcase。

## Router 註冊規則

新增 / 移除 screen 必須同步動三處：

- `90_workbench/app.jsx` 的 `SCREEN_META` 與 `SCREEN_GROUPS`
- `SuSuGiGi.html` 的 `<script>` 載入順序
- 本 CLAUDE.md（若改 granularity 規則）

## 命名規範

- Screen component：PascalCase + `Screen` 後綴（`HomeScreen` / `TransactionEditorScreen`）
- Sub-section：PascalCase 描述性名稱（`DonutHero` / `FilterTileRow`），不加檔案編號前綴
- 跨 screen 同名衝突時加 screen-namespace prefix（`TxAmountContainer` vs 將來可能的 `TransferAmountContainer`），或 promote 到 shared/ 取共用名（`EditorDateContainer` / `EditorFieldLabel`）
- Screen token：`<UPPER_SNAKE>_SCREEN_TOKENS`
- 檔案編號 `noN_` 同 `10_foundations/component_tokens/` 規

## 載入順序約束

1. 整段必在 `20_components/components.jsx` + `15_fixtures/` 之後
2. `shared/` 必在所有 screen 子目錄之前
3. 同 screen 子目錄內 `tokens.jsx` → `noN_subsections.jsx` → `period_page`（如有）→ entry
4. 整段必在 `90_workbench/app.jsx` 之前

特別約束：no14_base_currency_setting_screen 消費 no9_currency_list_screen 的 `CURRENCY_LIST_MOCK`，no9 必須在 no14 之前載入（自然遵守數字順序）。

## Object.assign 規範

每檔尾 `Object.assign(window, { ... })` 僅 export 該檔定義的 symbols。禁集中 export。

## 禁止

- 禁在 screen 檔內定義 atomic / component_tokens（屬 `10_foundations/`）
- 禁直接寫 raw number（除非 `// (literal: 原因)`）
- 禁為 variant 拆檔
- 禁將私有 sub-section 提升到 `20_components/` 前先問：impl 是否已有對應元件？沒有則留在 screen 子目錄或 `shared/`
- 禁改現有 export 名稱（與 SCREEN_META render fn 對齊）

## Follow-up

本目錄已含 26 個 screen，覆蓋 impl 端 navigation 上所有有設計工件需要的 route（除 DebugInfo / DebugInfoByCategory / MockDataSettings 三個 debug 工具屬 dev-only 不還原）。

尚待後續處理：

- AccountSelector / CategorySelector 尚未建立專屬 `component_tokens/noN_*_tokens.jsx`
- 部分 screen 的進階 variant 待補：CurrencyRateEditor 的 cross-currency（from ≠ base 的 To 鎖定來源 visualization）、OfflineRetry loading state
