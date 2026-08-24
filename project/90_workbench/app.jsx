// ─────────────────────────────────────────────────────────────
// App shell · 設計工作台 router
//
// 頂部 4 個 tab：
//   #intro / #foundations / #screens / #explorations
//
// Foundations 分 group（hash 三段式：#foundations/<group>/<topic>）：
//   group 與各 group 的 leaf 清單以下方 FOUNDATIONS_GROUPS 常數為唯一真相，本註解不列舉。
//
// SCREEN_META 中央定義每個 screen 的：
//   - title           NavBar 標題
//   - present         'push' | 'modal' | 'none'  → 對應 impl 的 navigation presentation
//   - headerLeftText  push 模式回上頁的文字（例如 '設定'）
//   - headerRight     header 右側元素（merge / search / settings 等）
//   - onClose/onSave  modal 的取消與完成行為
//   - hasFAB          是否顯示 FloatingActionBar
//   - render          (ctx) => screen body JSX，ctx 提供 push / pop / sharedFilter 等
//
// SCREEN_GROUPS 是 Screens tab 要顯示的群組與順序。
// 想要鳥瞰全貌：用畫布的縮放（trackpad 二指捏合 / Ctrl+滾輪）拉遠即可。
// ─────────────────────────────────────────────────────────────

function PushHeader({ title, leadingText, leadingAction, trailing }) {
  return <NavHeader title={title} leadingText={leadingText} leadingAction={leadingAction} trailing={trailing}/>;
}

// SCREEN_META — 全部 screen 的 meta 與 variant 入口；screen 清單以本常數與
// SCREEN_GROUPS 為準，實體檔在 30_screens/ 各 noN_<name>_screen/ 子目錄。
const SCREEN_META = {
  // ─── Home ─── default / initial loading / next-page loading / empty
  // headerRight 兩 symbol 共用 shared background pill；
  // 對齊 impl 端 unstable_headerRightItems = [search, spacing:0, settings] 的 iOS 26 渲染結果。
  home: {
    title: '$wish', present: 'push', hasFAB: true,
    render: (ctx) => <HomeScreen filterState={ctx.sharedFilter}/>,
    headerLeft: (ctx) => <HeaderButtonPill symbols={['line.3.horizontal.decrease']} intent="action" onPress={() => ctx.push('filter')}/>,
    headerRight: (ctx) => <HeaderButtonPill symbols={['magnifyingglass', 'gearshape']} intent="action" onPress={() => ctx.push('search')}/>,
  },
  'home-group-loading': {
    title: '$wish', present: 'push', hasFAB: true,
    render: (ctx) => <HomeScreen filterState={ctx.sharedFilter} variant="group-loading"/>,
    headerLeft: (ctx) => <HeaderButtonPill symbols={['line.3.horizontal.decrease']} intent="action" onPress={() => ctx.push('filter')}/>,
    headerRight: (ctx) => <HeaderButtonPill symbols={['magnifyingglass', 'gearshape']} intent="action" onPress={() => ctx.push('search')}/>,
  },
  'home-group-next-page-loading': {
    title: '$wish', present: 'push', hasFAB: true,
    render: (ctx) => <HomeScreen filterState={ctx.sharedFilter} variant="group-next-page-loading"/>,
    headerLeft: (ctx) => <HeaderButtonPill symbols={['line.3.horizontal.decrease']} intent="action" onPress={() => ctx.push('filter')}/>,
    headerRight: (ctx) => <HeaderButtonPill symbols={['magnifyingglass', 'gearshape']} intent="action" onPress={() => ctx.push('search')}/>,
  },
  'home-empty': {
    title: '$wish', present: 'push', hasFAB: true,
    render: (ctx) => <HomeScreen filterState={ctx.sharedFilter} variant="empty"/>,
    headerLeft: (ctx) => <HeaderButtonPill symbols={['line.3.horizontal.decrease']} intent="action" onPress={() => ctx.push('filter')}/>,
    headerRight: (ctx) => <HeaderButtonPill symbols={['magnifyingglass', 'gearshape']} intent="action" onPress={() => ctx.push('search')}/>,
  },
  // ─── Home · Undo Bar ─── 刪除交易後返回首頁，全域 Undo Bar 覆蓋於 Footer 區
  'home-undo': {
    title: '$wish', present: 'push', hasFAB: true, undoBar: true,
    render: (ctx) => <HomeScreen filterState={ctx.sharedFilter}/>,
    headerLeft: (ctx) => <HeaderButtonPill symbols={['line.3.horizontal.decrease']} intent="action" onPress={() => ctx.push('filter')}/>,
    headerRight: (ctx) => <HeaderButtonPill symbols={['magnifyingglass', 'gearshape']} intent="action" onPress={() => ctx.push('search')}/>,
  },
  // ─── Filter ─── default / no-accounts
  filter: {
    title: '顯示設定', present: 'modal', save: true,
    render: (ctx) => <HomeFilterScreen draftFilterState={ctx.filterDraft} setDraftFilterState={ctx.setFilterDraft}/>,
    onClose: (ctx) => ctx.discardFilterDraft(),
    onSave: (ctx) => ctx.applyFilterDraft(),
  },
  'filter-no-accounts': {
    title: '顯示設定', present: 'modal', save: true,
    render: (ctx) => <HomeFilterScreen draftFilterState={ctx.filterDraft} setDraftFilterState={ctx.setFilterDraft} variant="no-accounts"/>,
    onClose: (ctx) => ctx.discardFilterDraft(),
    onSave: (ctx) => ctx.applyFilterDraft(),
  },
  // ─── Search ─── initial / with-results / no-results
  // impl loading 走 ListEmptyTransition crossfade 不顯示 spinner，design 不另畫 loading variant
  search: {
    title: '搜尋', present: 'modal',
    render: () => <SearchScreen/>,
  },
  'search-with-results': {
    title: '搜尋', present: 'modal',
    render: () => <SearchScreen variant="with-results"/>,
  },
  'search-no-results': {
    title: '搜尋', present: 'modal',
    render: () => <SearchScreen variant="no-results"/>,
  },
  // ─── Transaction Editor ─── default / income / recurring 展開 / edit recurring dialog
  // 無 error variant：impl 守 save 在 header checkmark disabled，無 invalid-amount inline banner
  'transaction-editor': {
    title: '新增支出', present: 'modal', save: true,
    render: () => <TransactionEditorScreen type="expense"/>,
  },
  'transaction-editor-income': {
    title: '新增收入', present: 'modal', save: true,
    render: () => <TransactionEditorScreen type="income"/>,
  },
  'transaction-editor-recurring': {
    title: '新增支出', present: 'modal', save: true,
    render: () => <TransactionEditorScreen type="expense" initialRecurring/>,
  },
  'transaction-editor-edit-recurring-dialog': {
    title: '編輯交易', present: 'modal', save: true,
    render: () => <TransactionEditorScreen type="expense" isEdit initialRecurring showScheduleModeDialog/>,
  },
  // ─── Transfer Editor ─── default / recurring / same-currency / same-currency-recurring
  //                         + edit / edit-recurring / edit-same-currency
  //                         + note-focused（備註聚焦，CalculatorKeypad 滑下隱藏）
  //                         + account-conflict（from === to，DualPickerBox 外框轉錯誤色）
  // account-conflict 為唯一 error variant：impl 的 save disabled 條件已含 fromAccountId === toAccountId，
  // 衝突時完成按鈕灰、外框轉紅；其餘 error 情境（amountFrom 為空）由 save disabled 攔死，不需 variant。
  // edit-schedule-instance 不獨立列出：impl 的 mode dialog 差異需新 ConfirmDialog 元件，
  // RecurringOptions 本身渲染跟 edit-recurring 一致（rule 從 schedule 載入），無獨立視覺。
  transfer: {
    title: '新增轉帳', present: 'modal', save: true,
    render: () => <TransferEditorScreen variant="default"/>,
  },
  'transfer-recurring': {
    title: '新增轉帳', present: 'modal', save: true,
    render: () => <TransferEditorScreen variant="recurring"/>,
  },
  'transfer-same-currency': {
    title: '新增轉帳', present: 'modal', save: true,
    render: () => <TransferEditorScreen variant="same-currency"/>,
  },
  'transfer-same-currency-recurring': {
    title: '新增轉帳', present: 'modal', save: true,
    render: () => <TransferEditorScreen variant="same-currency-recurring"/>,
  },
  'transfer-edit': {
    title: '編輯轉帳', present: 'modal', save: true,
    render: () => <TransferEditorScreen variant="edit"/>,
  },
  'transfer-edit-recurring': {
    title: '編輯轉帳', present: 'modal', save: true,
    render: () => <TransferEditorScreen variant="edit-recurring"/>,
  },
  'transfer-edit-same-currency': {
    title: '編輯轉帳', present: 'modal', save: true,
    render: () => <TransferEditorScreen variant="edit-same-currency"/>,
  },
  'transfer-note-focused': {
    title: '新增轉帳', present: 'modal', save: true,
    render: () => <TransferEditorScreen variant="note-focused"/>,
  },
  'transfer-account-conflict': {
    title: '新增轉帳', present: 'modal', save: true,
    render: () => <TransferEditorScreen variant="account-conflict"/>,
  },
  // ─── Settings ─── default（未訂閱）/ subscribed（已訂閱，隱藏升級組）
  settings: {
    title: '設定', present: 'push',
    render: () => <SettingsScreen/>,
  },
  'settings-subscribed': {
    title: '設定', present: 'push',
    render: () => <SettingsScreen variant="subscribed"/>,
  },
  // ─── Account List ─── default / empty
  // navbar 右上 merge + plus 共用 shared background pill；
  // plus 觸發 AccountEditor 新增模式（design canvas 無互動 mock）
  'account-list': {
    title: '帳戶', present: 'push', headerLeftText: '設定',
    render: () => <AccountListScreen/>,
    headerRight: () => <HeaderButtonPill symbols={['arrow.triangle.merge', 'plus']} intent="action"/>,
  },
  'account-list-empty': {
    title: '帳戶', present: 'push', headerLeftText: '設定',
    render: () => <AccountListScreen variant="empty"/>,
    headerRight: () => <HeaderButtonPill symbols={['arrow.triangle.merge', 'plus']} intent="action"/>,
  },
  // ─── Account List · Undo Bar ─── 刪除帳戶後返回列表，全域 Undo Bar 覆蓋（示意非首頁也會出現）
  'account-list-undo': {
    title: '帳戶', present: 'push', headerLeftText: '設定', undoBar: true,
    render: () => <AccountListScreen/>,
    headerRight: () => <HeaderButtonPill symbols={['arrow.triangle.merge', 'plus']} intent="action"/>,
  },
  // ─── Category List ─── default / empty
  // navbar 右上 merge + plus 共用 shared background pill；
  // plus 觸發 CategoryEditor 新增模式（不帶 type 參數，由 Editor 內 CategoryTypeSelector 預設 expense 決定）
  'category-list': {
    title: '分類', present: 'push', headerLeftText: '設定',
    render: () => <CategoryListScreen/>,
    headerRight: () => <HeaderButtonPill symbols={['arrow.triangle.merge', 'plus']} intent="action"/>,
  },
  'category-list-empty': {
    title: '分類', present: 'push', headerLeftText: '設定',
    render: () => <CategoryListScreen variant="empty"/>,
    headerRight: () => <HeaderButtonPill symbols={['arrow.triangle.merge', 'plus']} intent="action"/>,
  },
  // ─── Currency List ─── default / no-results
  'currency-list': {
    title: '幣別', present: 'push', headerLeftText: '設定',
    render: () => <CurrencyListScreen/>,
  },
  'currency-list-no-results': {
    title: '幣別', present: 'push', headerLeftText: '設定',
    render: () => <CurrencyListScreen variant="no-results"/>,
  },
  // ─── Currency Rate List ─── default / empty
  'currency-rate-list': {
    title: '匯率', present: 'push', headerLeftText: '設定',
    render: () => <CurrencyRateListScreen/>,
  },
  'currency-rate-list-empty': {
    title: '匯率', present: 'push', headerLeftText: '設定',
    render: () => <CurrencyRateListScreen variant="empty"/>,
  },
  // ─── Language Setting ─── default（Modal save form）
  'language-setting': {
    title: '語言', present: 'modal', save: true,
    render: () => <LanguageSettingScreen/>,
  },
  // ─── Time Zone Setting ─── default / no-results
  'time-zone-setting': {
    title: '時區', present: 'modal', save: true,
    render: () => <TimeZoneSettingScreen/>,
  },
  'time-zone-setting-no-results': {
    title: '時區', present: 'modal', save: true,
    render: () => <TimeZoneSettingScreen variant="no-results"/>,
  },
  // ─── Theme Settings ─── default
  'theme-settings': {
    title: '主題', present: 'modal', save: true,
    render: () => <ThemeSettingsScreen/>,
  },
  // ─── Base Currency Setting ─── default / no-results
  'base-currency-setting': {
    title: '基礎幣別', present: 'modal', save: true,
    render: () => <BaseCurrencySettingScreen/>,
  },
  'base-currency-setting-no-results': {
    title: '基礎幣別', present: 'modal', save: true,
    render: () => <BaseCurrencySettingScreen variant="no-results"/>,
  },
  // ─── Launch Mode Setting ─── default
  'launch-mode-setting': {
    title: '啟動模式', present: 'modal', save: true,
    render: () => <LaunchModeSettingScreen/>,
  },
  // ─── Week Start Setting ─── default
  'week-start-setting': {
    title: '週起始日', present: 'modal', save: true,
    render: () => <WeekStartSettingScreen/>,
  },
  // ─── Preference ─── default
  'preference': {
    title: '偏好設定', present: 'push', headerLeftText: '設定',
    render: () => <PreferenceScreen/>,
  },
  'preference-usage-prompt': {
    title: '偏好設定', present: 'push', headerLeftText: '設定',
    render: () => <PreferenceScreen showUsageAnalyticsPrompt/>,
  },
  // ─── Data Management ─── default
  'data-management': {
    title: '資料管理', present: 'push', headerLeftText: '設定',
    render: () => <DataManagementScreen/>,
  },
  // ─── Account Editor ─── new / edit
  'account-editor': {
    title: '新增帳戶', present: 'modal', save: true,
    render: () => <AccountEditorScreen/>,
  },
  'account-editor-edit': {
    title: '編輯帳戶', present: 'modal', save: true,
    render: () => <AccountEditorScreen variant="edit"/>,
  },
  // ─── Category Editor ─── new-expense / new-income / edit
  'category-editor': {
    title: '新增支出分類', present: 'modal', save: true,
    render: () => <CategoryEditorScreen variant="new-expense"/>,
  },
  'category-editor-income': {
    title: '新增收入分類', present: 'modal', save: true,
    render: () => <CategoryEditorScreen variant="new-income"/>,
  },
  'category-editor-edit': {
    title: '編輯分類', present: 'modal', save: true,
    render: () => <CategoryEditorScreen variant="edit"/>,
  },
  // ─── Currency Detail Config ─── default
  'currency-detail-config': {
    title: 'USD', present: 'modal', save: true,
    render: () => <CurrencyDetailConfigScreen/>,
  },
  // ─── Currency Rate Editor ─── add / update / currency-modal
  'currency-rate-editor': {
    title: '設定匯率', present: 'modal', save: true,
    render: () => <CurrencyRateEditorScreen variant="add"/>,
  },
  'currency-rate-editor-update': {
    title: '設定匯率', present: 'modal', save: true,
    render: () => <CurrencyRateEditorScreen variant="update"/>,
  },
  // 幣別選擇 modal 自繪 header（圓形 close + title），present 'none' 避免疊 ModalHeader
  'currency-rate-editor-modal': {
    title: '選擇貨幣', present: 'none',
    render: () => <CurrencyRateEditorScreen variant="currency-modal"/>,
  },
  // ─── Import ─── 4 steps（header 全 icon 導航，自繪於 ImportScreen，present 'none' 避免疊 ModalHeader）
  'import-step-1': {
    title: '選擇檔案', present: 'none',
    render: () => <ImportScreen variant="step-1"/>,
  },
  'import-step-2': {
    title: '欄位對應', present: 'none',
    render: () => <ImportScreen variant="step-2"/>,
  },
  'import-step-3': {
    title: '內容比對', present: 'none',
    render: () => <ImportScreen variant="step-3"/>,
  },
  'import-step-4': {
    title: '預覽匯入', present: 'none',
    render: () => <ImportScreen variant="step-4"/>,
  },
  // ─── Offline Retry ─── default / deletion
  'offline-retry': {
    title: '離線重試', present: 'none',
    render: () => <OfflineRetryScreen/>,
  },
  'offline-retry-deletion': {
    title: '離線重試', present: 'none',
    render: () => <OfflineRetryScreen variant="deletion"/>,
  },
  // ─── Paywall ─── default (yearly) / monthly
  'paywall': {
    title: '', present: 'modal',
    render: () => <PaywallScreen/>,
  },
  'paywall-monthly': {
    title: '', present: 'modal',
    render: () => <PaywallScreen variant="monthly"/>,
  },
  'paywall-processing': {
    title: '', present: 'modal',
    render: () => <PaywallScreen variant="processing"/>,
  },
  // ─── Merge Editor ─── account / category
  'merge-account': {
    title: '合併帳戶', present: 'modal', save: true,
    render: () => <MergeEditorScreen variant="account"/>,
  },
  'merge-category': {
    title: '合併分類', present: 'modal', save: true,
    render: () => <MergeEditorScreen variant="category"/>,
  },
};

// SCREEN_GROUPS — Screens tab 顯示結構
// 一種 screen = 一個 group = 一個 DCSection（水平列）；
// 同一 group 內排 default + 各種邊界狀態（空 / 載入 / 錯誤 / 模式變體）；
// 不同 screen 之間是垂直堆疊的 sections。
//
// 新增/移除 screen 時更新此陣列；要新邊界狀態同步加 SCREEN_META + 在對應 group.screens 加一筆。
const SCREEN_GROUPS = [
  {
    id: 'home',
    title: 'Home · 記帳',
    subtitle: '主畫面 PeriodPage（src/screens/Home/）。初次明細 loading 顯示三列骨架；續頁保留已載明細並在尾端追加一列。兩者延遲 120ms，500ms 單相，standard easing；降低動態時保持靜態。不使用 spinner 或 shimmer。',
    screens: [
      { id: 'home',                         label: 'Default · 有交易' },
      { id: 'home-group-loading',           label: 'Initial loading · 三列呼吸骨架' },
      { id: 'home-group-next-page-loading', label: 'Next-page loading · 明細尾端一列骨架' },
      { id: 'home-empty',                   label: 'Empty · 尚無交易紀錄' },
      { id: 'home-undo',                    label: 'Undo Bar · 刪除交易後復原列' },
    ],
  },
  {
    id: 'home-filter',
    title: 'Home Filter · 顯示設定',
    subtitle: 'Home 的篩選 modal（src/screens/Home/HomeFilterScreen.tsx）。',
    screens: [
      { id: 'filter',             label: 'Default · 有帳戶' },
      { id: 'filter-no-accounts', label: 'No accounts · 無可用帳戶' },
    ],
  },
  {
    id: 'search',
    title: 'Search · 搜尋',
    subtitle: '3 種狀態：初始提示輸入 / 有結果 / 找不到結果（src/screens/Search/SearchScreen.tsx）。impl loading 走 ListEmptyTransition crossfade 不顯示 spinner。',
    screens: [
      { id: 'search',              label: 'Initial · 提示輸入' },
      { id: 'search-with-results', label: 'With results · 有結果' },
      { id: 'search-no-results',   label: 'No results · 找不到結果' },
    ],
  },
  {
    id: 'transaction-editor',
    title: 'Transaction Editor · 記一筆交易',
    subtitle: '記一筆支出 / 收入 modal（src/screens/Transactions/TransactionEditorScreen.tsx）。impl 守 save 在 header checkmark disabled（無 amount 或 account 時灰掉），無 invalid-amount inline banner；真實 error（save / delete 失敗）走 Alert.alert runtime 彈窗。Recurring 展開態鏡射 impl `showRecurringOptions=true`；編輯態 dialog 鏡射 `showRecurringModeDialog`。',
    screens: [
      { id: 'transaction-editor',                       label: 'Default · 新增支出' },
      { id: 'transaction-editor-income',                label: '新增收入' },
      { id: 'transaction-editor-recurring',             label: 'Recurring · 展開定期選項' },
      { id: 'transaction-editor-edit-recurring-dialog', label: 'Edit recurring · 本次／未來對話框' },
    ],
  },
  {
    id: 'transfer-editor',
    title: 'Transfer Editor · 轉帳',
    subtitle: '跨帳戶 / 跨幣別轉帳 modal（src/screens/Transactions/TransferEditorScreen.tsx）。',
    screens: [
      { id: 'transfer',                         label: 'Default · 新增、跨幣別、Recurring 收起' },
      { id: 'transfer-recurring',               label: 'Recurring · 新增、跨幣別、展開定期選項' },
      { id: 'transfer-same-currency',           label: 'Same currency · 新增、同幣別、to 欄位 disabled' },
      { id: 'transfer-same-currency-recurring', label: 'Same currency + Recurring · 同幣別 + 展開' },
      { id: 'transfer-edit',                    label: 'Edit · 編輯既有 transfer，Delete button 顯示' },
      { id: 'transfer-edit-recurring',          label: 'Edit + Recurring · 編輯 + 展開' },
      { id: 'transfer-edit-same-currency',      label: 'Edit + Same currency · 編輯 + 同幣別' },
      { id: 'transfer-note-focused',            label: 'Note focused · 備註聚焦，keypad 滑下' },
      { id: 'transfer-account-conflict',        label: 'Account conflict · from === to，DualPickerBox 外框轉紅' },
    ],
  },
  {
    id: 'settings',
    title: 'Settings · 設定',
    subtitle: '設定總頁（src/screens/Settings/SettingsScreen.tsx）。未訂閱顯示升級組，已訂閱隱藏。不含 impl 端的 Debug Tools section（dev 工具，spec 未定義為產品行為）。',
    screens: [
      { id: 'settings',            label: 'Default · 未訂閱' },
      { id: 'settings-subscribed', label: 'Subscribed · 已訂閱' },
    ],
  },
  {
    id: 'account-list',
    title: 'Account List · 帳戶列表',
    subtitle: '帳戶列表 + 拖拉排序（src/screens/Accounts/AccountListScreen.tsx）。Header 右側 [merge][+] 兩 pill：合併工具入口 + 新增帳戶入口。Undo Bar variant 示意刪除帳戶後全域復原列覆蓋於列表（非首頁畫面同樣出現）。',
    screens: [
      { id: 'account-list',       label: 'Default · 有帳戶' },
      { id: 'account-list-empty', label: 'Empty · 尚無帳戶' },
      { id: 'account-list-undo',  label: 'Undo Bar · 刪除帳戶後復原列' },
    ],
  },
  {
    id: 'category-list',
    title: 'Category List · 分類列表',
    subtitle: '收 / 支兩 section，各含拖拉排序列表（src/screens/Categories/CategoryListScreen.tsx）。Header 右側 [merge][+] 兩 pill：合併工具入口 + 新增分類入口（type 由 CategoryEditor 內 selector 決定）。',
    screens: [
      { id: 'category-list',       label: 'Default · 有分類' },
      { id: 'category-list-empty', label: 'Empty · 尚無分類' },
    ],
  },
  {
    id: 'currency-list',
    title: 'Currency List · 幣別列表',
    subtitle: '標準幣別列表 + 底部 BottomSearchBar，點 row 進入 CurrencyDetailConfig（src/screens/Settings/CurrencyListScreen.tsx）。',
    screens: [
      { id: 'currency-list',            label: 'Default · 完整清單' },
      { id: 'currency-list-no-results', label: 'No results · 搜尋無結果' },
    ],
  },
  {
    id: 'currency-rate-list',
    title: 'Currency Rate List · 匯率列表',
    subtitle: '匯率對列表 + 底部 BottomSearchBar，點 row 進入 CurrencyRateEditor（src/screens/Settings/CurrencyRateListScreen.tsx）。',
    screens: [
      { id: 'currency-rate-list',       label: 'Default · 有匯率' },
      { id: 'currency-rate-list-empty', label: 'Empty · 尚無匯率設定' },
    ],
  },
  {
    id: 'language-setting',
    title: 'Language Setting · 語言',
    subtitle: '2 選 1 SelectionListItem，selected 排頂（src/screens/Settings/LanguageSettingScreen.tsx）。Modal save form。',
    screens: [
      { id: 'language-setting', label: 'Default · 已選繁體中文' },
    ],
  },
  {
    id: 'time-zone-setting',
    title: 'Time Zone Setting · 時區',
    subtitle: 'SelectionListItem 列表 + 底部 BottomSearchBar，selected 排頂（src/screens/Settings/TimeZoneSettingScreen.tsx）。',
    screens: [
      { id: 'time-zone-setting',            label: 'Default · 已選 Taipei' },
      { id: 'time-zone-setting-no-results', label: 'No results · 搜尋無結果' },
    ],
  },
  {
    id: 'theme-settings',
    title: 'Theme Settings · 主題',
    subtitle: '2 欄 SelectionGridItem，每 cell 為三色預覽（src/screens/Settings/ThemeSettingsScreen.tsx）。Modal save form。',
    screens: [
      { id: 'theme-settings', label: 'Default · 已選經典紫' },
    ],
  },
  {
    id: 'base-currency-setting',
    title: 'Base Currency Setting · 基礎幣別',
    subtitle: 'SelectionListItem 列表 + 底部 BottomSearchBar，selected 排頂（src/screens/Settings/BaseCurrencySettingScreen.tsx）。',
    screens: [
      { id: 'base-currency-setting',            label: 'Default · 已選 TWD' },
      { id: 'base-currency-setting-no-results', label: 'No results · 搜尋無結果' },
    ],
  },
  {
    id: 'launch-mode-setting',
    title: 'Launch Mode Setting · 啟動模式',
    subtitle: '4 選 1 SelectionListItem（src/screens/Settings/LaunchModeSettingScreen.tsx）。Modal save form。',
    screens: [
      { id: 'launch-mode-setting', label: 'Default · 已選首頁' },
    ],
  },
  {
    id: 'week-start-setting',
    title: 'Week Start Setting · 週起始日',
    subtitle: '3 選 1 SelectionListItem（跟隨語系/週日/週一，src/screens/Settings/WeekStartSettingScreen.tsx）。Modal save form。',
    screens: [
      { id: 'week-start-setting', label: 'Default · 已選跟隨語系' },
    ],
  },
  {
    id: 'preference',
    title: 'Preference · 偏好設定',
    subtitle: 'section hub（啟動 · 幣別 · 語言/時區/週起始日 · 使用分析）。使用分析只顯示單列開關。首次啟動另顯示原生同意對話框。',
    screens: [
      { id: 'preference', label: 'Default · 偏好設定主頁' },
      { id: 'preference-usage-prompt', label: 'Usage consent · 首次同意' },
    ],
  },
  {
    id: 'data-management',
    title: 'Data Management · 資料管理',
    subtitle: '3 section（匯入 · 匯出 · 清除所有資料）。清除為 destructive 紅色、確認流走 iOS 原生 Alert（src/screens/Settings/DataManagementScreen.tsx）。',
    screens: [
      { id: 'data-management', label: 'Default · 資料管理主頁' },
    ],
  },
  {
    id: 'account-editor',
    title: 'Account Editor · 帳戶編輯',
    subtitle: '帳戶 3 欄表單（名稱/幣別/圖示）。Edit mode 多顯示啟用 Switch + 刪除（src/screens/Accounts/AccountEditorScreen.tsx）。',
    screens: [
      { id: 'account-editor',      label: 'New · 新增模式' },
      { id: 'account-editor-edit', label: 'Edit · 編輯模式（含刪除）' },
    ],
  },
  {
    id: 'category-editor',
    title: 'Category Editor · 分類編輯',
    subtitle: '分類 3 欄表單（名稱/收支/圖示）。收支由 navigation 決定不可切換（src/screens/Categories/CategoryEditorScreen.tsx）。',
    screens: [
      { id: 'category-editor',        label: 'New Expense · 新增支出' },
      { id: 'category-editor-income', label: 'New Income · 新增收入' },
      { id: 'category-editor-edit',   label: 'Edit · 編輯模式（含刪除）' },
    ],
  },
  {
    id: 'currency-detail-config',
    title: 'Currency Detail Config · 幣別格式設定',
    subtitle: '單一幣別的千位省略與小數位數設定。從 CurrencyList 進入（src/screens/Settings/CurrencyDetailConfigScreen.tsx）。',
    screens: [
      { id: 'currency-detail-config', label: 'Default · USD（小數 2 位）' },
    ],
  },
  {
    id: 'currency-rate-editor',
    title: 'Currency Rate Editor · 匯率編輯',
    subtitle: '兩 surface card：幣別對 + 金額。To 永遠鎖為 base currency；Update mode 中 From 也鎖；Add mode 點 From 開幣別選擇 modal（src/screens/Settings/CurrencyRateEditorScreen.tsx）。',
    screens: [
      { id: 'currency-rate-editor',        label: 'Add · 新增匯率' },
      { id: 'currency-rate-editor-update', label: 'Update · 更新匯率' },
      { id: 'currency-rate-editor-modal',  label: 'Currency Modal · 幣別選擇' },
    ],
  },
  {
    id: 'import',
    title: 'Import · 匯入 Wizard',
    subtitle: '4 步驟 wizard（選擇檔案 / 欄位對應 / 內容比對 / 預覽）。header 全 icon 導航，無置底列（src/screens/Settings/ImportScreen.tsx）。',
    screens: [
      { id: 'import-step-1', label: 'Step 1 · 選擇檔案' },
      { id: 'import-step-2', label: 'Step 2 · 欄位對應' },
      { id: 'import-step-3', label: 'Step 3 · 內容比對' },
      { id: 'import-step-4', label: 'Step 4 · 預覽匯入' },
    ],
  },
  {
    id: 'offline-retry',
    title: 'Offline Retry · 離線重試',
    subtitle: '全螢幕攔路頁。首開離線或資料清除收尾未完時顯示，Branding + 說明文案 + 重試鈕（src/screens/Bootstrap/OfflineRetryScreen.tsx）。',
    screens: [
      { id: 'offline-retry',          label: 'Default · 首開離線' },
      { id: 'offline-retry-deletion', label: 'Deletion · 清除收尾未完' },
    ],
  },
  {
    id: 'paywall',
    title: 'Paywall · 升級',
    subtitle: 'Modal info。無畫面標題 + 4 項 LEVEL_1 賣點 + Yearly/Monthly + CTA + 自動續訂揭露 + 使用條款/隱私連結 + 還原 + 暫不升級（src/screens/Paywall/PaywallScreen.tsx）。',
    screens: [
      { id: 'paywall',            label: 'Default · 已選年費' },
      { id: 'paywall-monthly',    label: 'Monthly · 已選月費' },
      { id: 'paywall-processing', label: 'Processing · 購買中' },
    ],
  },
  {
    id: 'merge-editor',
    title: 'Merge Editor · 合併',
    subtitle: 'Modal save form。source → target 視覺化 + 兩 selector。mode 由 navigation 決定（src/screens/Merge/MergeEditorScreen.tsx）。',
    screens: [
      { id: 'merge-account',  label: 'Account · 合併帳戶' },
      { id: 'merge-category', label: 'Category · 合併分類' },
    ],
  },
];

const PINNED_WITH_FAB = new Set(['home']);

// ScreenFrame — device 內導覽容器
function ScreenFrame({ pinned, sharedFilter, setSharedFilter }) {
  const [stack, setStack] = React.useState([pinned]);
  const cloneFilter = (source) => ({
    ...source,
    selectedAccountIds: [...source.selectedAccountIds],
  });
  const [filterDraft, setFilterDraft] = React.useState(() => cloneFilter(sharedFilter));
  React.useEffect(() => { setStack([pinned]); }, [pinned]);
  React.useEffect(() => {
    setFilterDraft(cloneFilter(sharedFilter));
  }, [pinned, sharedFilter]);
  const top = stack[stack.length - 1];
  const pop = () => setStack(st => st.length > 1 ? st.slice(0, -1) : [pinned]);
  const push = (s) => {
    if (s === 'filter') setFilterDraft(cloneFilter(sharedFilter));
    setStack(st => [...st, s]);
  };
  const discardFilterDraft = () => {
    setFilterDraft(cloneFilter(sharedFilter));
    pop();
  };
  const applyFilterDraft = () => {
    setSharedFilter(cloneFilter(filterDraft));
    pop();
  };
  const meta = SCREEN_META[top];
  if (!meta) return null;

  const ctx = {
    push,
    pop,
    sharedFilter,
    setSharedFilter,
    filterDraft,
    setFilterDraft,
    discardFilterDraft,
    applyFilterDraft,
  };
  const body = meta.render(ctx);
  const isModal = meta.present === 'modal';
  const isPush = meta.present === 'push';
  const headerRight = meta.headerRight ? meta.headerRight(ctx) : null;
  const leadingText = isPush ? (meta.headerLeftText ?? '') : undefined;
  const modalClose = meta.onClose ? () => meta.onClose(ctx) : pop;
  const modalSave = meta.save
    ? () => meta.onSave ? meta.onSave(ctx) : pop()
    : undefined;

  // ScreenFrame 結構：
  //   ScreenFrame (relative, h:100%, overflow:hidden)
  //   └── flex column (h:100%)
  //       ├── ModalHeader / PushHeader (fixed 在頂部、不滾)
  //       └── body wrapper (flex:1, overflowY:auto) ← screen 內容在這滾
  //
  // body wrapper 才 scroll，header 釘在 viewport 頂；
  // 這樣 screen 內 position:absolute bottom:0 的元素（BottomSearchBar / CalculatorKeypad）
  // 對齊 body wrapper bottom = viewport 底（sticky 感對齊真實 iOS 行為）。
  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: TOKENS.bg,
      fontFamily: '-apple-system, "SF Pro", "PingFang TC", "Noto Sans TC", system-ui, sans-serif',
      overflow: 'hidden',
    }} data-screen-label={pinned}>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
      }}>
        {isModal && <ModalHeader
          title={meta.title}
          onClose={modalClose}
          onSave={modalSave}/>}
        {isPush && <PushHeader title={meta.title} leadingText={leadingText} leadingAction={stack.length > 1 ? pop : undefined} trailing={headerRight}/>}
        <div style={{ flex: 1, position: 'relative', overflowY: 'auto', overflowX: 'hidden' }}>
          {body}
        </div>
      </div>
      {/* undoBar variant：示意刪除後全域 Undo Bar 覆蓋於當前畫面（mode="undo"）；
          Undo Bar 不限首頁，回到的任何畫面都會出現，故與 hasFAB 解耦。
          否則 Home 等 hasFAB 畫面顯示 actions FAB。 */}
      {meta.undoBar ? (
        <FloatingActionBar mode="undo" remainingTime={4}/>
      ) : (PINNED_WITH_FAB.has(top) || meta.hasFAB) ? (
        <FloatingActionBar mode="actions"
          onExpensePress={() => push('transaction-editor')}
          onTransferPress={() => push('transfer')}
          onIncomePress={() => push('transaction-editor-income')}/>
      ) : null}
    </div>
  );
}

// ─── Side TOC nav ────────────────────────────────────────────
// 三層 nav：top-level views → Foundations group → leaf topic。
// Screens / Explorations 仍維持兩層（views → sub-item）。
const VIEW_TABS = [
  { id: 'intro',        label: 'Intro' },
  { id: 'foundations',  label: 'Foundations',  hasSubs: true },
  { id: 'screens',      label: 'Screens',      hasSubs: true },
  { id: 'explorations', label: 'Explorations', hasSubs: true },
];
const VALID_VIEWS = VIEW_TABS.map(t => t.id);

// Foundations groups — Foundations TOC 單一真相，group / leaf 清單以本常數為準。
// hash 路徑：#foundations/<group>/<topic>。每個 topic 對應單一 Section component。
const FOUNDATIONS_GROUPS = [
  {
    id: 'atomic', label: 'Atomic',
    topics: [
      { id: 'type',     label: 'Type',     render: () => <FoundationsAtomicTypeSection/> },
      { id: 'colors',   label: 'Colors',   render: () => <FoundationsAtomicColorsSection/> },
      { id: 'layout',   label: 'Layout',   render: () => <FoundationsAtomicLayoutSection/> },
      { id: 'platform', label: 'Platform', render: () => <FoundationsAtomicPlatformSection/> },
    ],
  },
  {
    id: 'component-tokens', label: 'Component Tokens',
    topics: [
      { id: 'list',                  label: 'List',                  render: () => <FoundationsCTListSection/> },
      { id: 'tx-list',               label: 'Transaction List',      render: () => <FoundationsCTTxListSection/> },
      { id: 'form-picker',           label: 'Form Picker',           render: () => <FoundationsCTFormPickerSection/> },
      { id: 'chip',                  label: 'Chip',                  render: () => <FoundationsCTChipSection/> },
      { id: 'search-bar',            label: 'Search Bar',            render: () => <FoundationsCTSearchBarSection/> },
      { id: 'header-icon-button',    label: 'Header Icon Button',    render: () => <FoundationsCTHeaderIconButtonSection/> },
      { id: 'switch',                label: 'Switch',                render: () => <FoundationsCTSwitchSection/> },
      { id: 'list-empty-transition', label: 'List Empty Transition', render: () => <FoundationsCTListEmptyTransitionSection/> },
      { id: 'amount-field',          label: 'Amount Field',          render: () => <FoundationsCTAmountFieldSection/> },
      { id: 'static-wheel-picker',   label: 'Static Wheel Picker',   render: () => <FoundationsCTStaticWheelPickerSection/> },
      { id: 'recurring-options',     label: 'Recurring Options',     render: () => <FoundationsCTRecurringOptionsSection/> },
      { id: 'confirm-dialog',        label: 'Confirm Dialog',        render: () => <FoundationsCTConfirmDialogSection/> },
      { id: 'calendar-dialog',       label: 'Calendar Dialog',       render: () => <FoundationsCTCalendarDialogSection/> },
      { id: 'dual-picker-box',       label: 'Dual Picker Box',       render: () => <FoundationsCTDualPickerBoxSection/> },
      { id: 'editor-name-field',     label: 'Editor Name Field',     render: () => <FoundationsCTEditorNameFieldSection/> },
      { id: 'keypad',                label: 'Keypad',                render: () => <FoundationsCTKeypadSection/> },
    ],
  },
  {
    id: 'components', label: 'Components',
    topics: [
      { id: 'list',       label: 'List',       render: () => <ComponentsListSection/> },
      { id: 'form',       label: 'Form',       render: () => <ComponentsFormSection/> },
      { id: 'navigation', label: 'Navigation', render: () => <ComponentsNavigationSection/> },
      { id: 'chart',      label: 'Chart',      render: () => <ComponentsChartSection/> },
      { id: 'input',      label: 'Input',      render: () => <ComponentsInputSection/> },
    ],
  },
  {
    id: 'brand', label: 'Brand',
    topics: [
      { id: 'ui-glyphs', label: 'UI Glyphs', render: () => <FoundationsBrandUIGlyphsSection/> },
      { id: 'app-icon',  label: 'App Icon · 定案 G4', render: () => <FoundationsBrandAppIconSection/> },
      { id: 'brand-logo', label: 'Brand Logo · 無底三線', render: () => <FoundationsBrandLogoSection/> },
    ],
  },
  {
    id: 'icon-library', label: 'Icon Library',
    topics: [
      { id: 'all-icons', label: 'All Icons', render: () => <FoundationsIconLibraryAllIconsSection/> },
    ],
  },
];

// EXPLORATION_GROUPS — 每個 group 對應一個 screen，group 下的 topic 為各 exploration 軸
const EXPLORATION_GROUPS = [
  {
    id: 'homescreen', label: 'Home Screen',
    topics: [
      { id: 'color-and-mood',   label: 'Axis 1 · Color & Mood',               render: () => <ColorAndMoodSection/> },
      { id: 'surface-material', label: 'Axis 2 · Surface & Material',          render: () => <SurfaceMaterialSection/> },
      { id: 'iconography',      label: 'Axis 3 · Iconography & Embellishment', render: () => <IconographySection/> },
      { id: 'personality',      label: 'Axis 4 · Personality (packaged)',      render: () => <PersonalityPackagedSection/> },
      { id: 'donut-focus',      label: 'Donut · Focus Indicator',             render: () => <DonutFocusIndicatorSection/> },
    ],
  },
  {
    id: 'homefilterscreen', label: 'Home Filter Screen',
    topics: [
      { id: 'control-design', label: 'Axis · Control Design', render: () => <HomeFilterControlSection/> },
    ],
  },
  {
    id: 'searchscreen', label: 'Search Screen',
    topics: [
      { id: 'list-treatment', label: 'Axis · List Treatment', render: () => <SearchListTreatmentSection/> },
    ],
  },
  {
    id: 'accountcategoryeditor', label: 'Account / Category Editor',
    topics: [
      { id: 'form-structure',    label: 'Axis · Form Structure',    render: () => <AccountCategoryEditorFormStructureSection/> },
      { id: 'icon-picker',       label: 'Axis · Icon Picker',       render: () => <AccountCategoryEditorIconPickerSection/> },
      { id: 'footer-zone',       label: 'Axis · Footer Zone',       render: () => <AccountCategoryEditorFooterZoneSection/> },
      { id: 'type-currency',     label: 'Axis · Type & Currency',   render: () => <AccountCategoryEditorTypeCurrencySection/> },
      { id: 'mapping-acctype',   label: 'Axis · Mapping & AccType', render: () => <AccountCategoryEditorMappingAccTypeSection/> },
      { id: 'currency-weight',   label: 'Axis · Currency Symbol',   render: () => <AccountCategoryEditorCurrencyWeightSection/> },
    ],
  },
  {
    id: 'transfereditor', label: 'Transfer Editor',
    topics: [
      { id: 'box-framing', label: 'Axis · Box Framing', render: () => <TransferBoxFramingSection/> },
    ],
  },
  {
    id: 'calculatorkeypad', label: 'Calculator Keypad',
    topics: [
      { id: 'key-visual', label: 'Axis · Key Visual & Dock', render: () => <KeypadKeyVisualSection/> },
      { id: 'press-feedback', label: 'Axis · Press Feedback', render: () => <KeypadPressFeedbackSection/> },
    ],
  },
  {
    id: 'mergeeditor', label: 'Merge Editor',
    topics: [
      { id: 'dual-picker-layout', label: 'Axis · Dual Picker Layout', render: () => <MergeDualPickerLayoutSection/> },
    ],
  },
  {
    id: 'undo-bar', label: 'Undo Bar',
    topics: [
      { id: 'segmented-pill', label: 'Axis · Segmented Pill', render: () => <UndoBarSegmentedPillSection/> },
    ],
  },
  {
    id: 'app-icon', label: 'App Icon',
    topics: [
      { id: 'calligraphy',  label: 'Axis 1 · 書法飛白 (v1)',   render: () => <AppIconCalligraphySection/> },
      { id: 'speed-forms',  label: 'Axis 2 · 非書法速度 (v2)', render: () => <AppIconSpeedFormsSection/> },
      { id: 'six-forms',    label: 'Axis 3 · 六形態 (v3)',      render: () => <AppIconSixFormsSection/> },
      { id: 'broadscan',    label: 'Axis 4 · 命名廣掃 135 案',  render: () => <AppIconBroadscanSection/> },
      { id: 'factorial',    label: 'Axis 5 · 因子實驗 K/L/N',   render: () => <AppIconFactorialSection/> },
      { id: 'glide-refinement', label: 'Axis 6 · 深化場 Glide+K15',     render: () => <AppIconGlideRefinementSection/> },
    ],
  },
];

// 找 Foundations group / topic 的 helper。沒命中時回 fallback（atomic/type）。
function resolveFoundationsRoute(rawGroup, rawTopic) {
  const group = FOUNDATIONS_GROUPS.find(g => g.id === rawGroup);
  if (!group) {
    const fallback = FOUNDATIONS_GROUPS[0];
    return { group: fallback.id, topic: fallback.topics[0].id };
  }
  const topic = group.topics.find(t => t.id === rawTopic);
  return { group: group.id, topic: topic ? topic.id : group.topics[0].id };
}

// 找 Explorations group / topic 的 helper。沒命中時回 fallback（homescreen/color-and-mood）。
function resolveExplorationsRoute(rawGroup, rawTopic) {
  const group = EXPLORATION_GROUPS.find(g => g.id === rawGroup);
  if (!group) {
    const fallback = EXPLORATION_GROUPS[0];
    return { group: fallback.id, topic: fallback.topics[0].id };
  }
  const topic = group.topics.find(t => t.id === rawTopic);
  return { group: group.id, topic: topic ? topic.id : group.topics[0].id };
}

const groupsFor = (view) => {
  if (view === 'foundations') return FOUNDATIONS_GROUPS;
  if (view === 'explorations') return EXPLORATION_GROUPS;
  return null;
};

const subsFor = (view) => {
  if (view === 'screens') return SCREEN_GROUPS.map(g => ({ id: g.id, label: g.title }));
  return null;
};

const defaultSubFor = (view) => {
  if (view === 'foundations') {
    const g = FOUNDATIONS_GROUPS[0];
    return { group: g.id, topic: g.topics[0].id };
  }
  if (view === 'explorations') {
    const g = EXPLORATION_GROUPS[0];
    return { group: g.id, topic: g.topics[0].id };
  }
  const subs = subsFor(view);
  return subs && subs[0] ? subs[0].id : null;
};

// 舊 hash 別名（向後相容）。Foundations 從兩段 #foundations/<topic> 升級為三段
// #foundations/<group>/<topic>，舊收藏連結透過此表 redirect。
const LEGACY_HASH_ALIASES = {
  'overview':       { view: 'screens' },
  'flows':          { view: 'screens' },
  'all':            { view: 'screens' },
  'filter':         { view: 'screens' },
  'tx-list':        { view: 'screens' },
  'recurring':      { view: 'screens' },
  'row-height':     { view: 'screens' },
  'design_system':  { view: 'foundations' },
  // 舊 explorations 兩段 hash → 新三段（加 group 層）
  'explorations/color-and-mood':   { view: 'explorations', group: 'homescreen', topic: 'color-and-mood' },
  'explorations/surface-material': { view: 'explorations', group: 'homescreen', topic: 'surface-material' },
  'explorations/iconography':      { view: 'explorations', group: 'homescreen', topic: 'iconography' },
  'explorations/personality':      { view: 'explorations', group: 'homescreen', topic: 'personality' },
  // 舊兩段 hash → 三段
  'foundations/type':       { view: 'foundations', group: 'atomic',       topic: 'type' },
  'foundations/colors':     { view: 'foundations', group: 'atomic',       topic: 'colors' },
  'foundations/tokens':     { view: 'foundations', group: 'atomic',       topic: 'layout' },
  'foundations/spacing':    { view: 'foundations', group: 'atomic',       topic: 'layout' },
  'foundations/components': { view: 'foundations', group: 'components',   topic: 'list' },
  'foundations/brand':      { view: 'foundations', group: 'brand',        topic: 'ui-glyphs' },
  'components':             { view: 'foundations', group: 'components',   topic: 'list' },
  // 上一版 showcase 三段 → 新三段（Components / Brand / Icon Library 升 group 後）
  'foundations/showcase/components':   { view: 'foundations', group: 'components',   topic: 'list' },
  'foundations/showcase/brand':        { view: 'foundations', group: 'brand',        topic: 'ui-glyphs' },
  'foundations/showcase/icon-library': { view: 'foundations', group: 'icon-library', topic: 'all-icons' },
};

function parseRoute() {
  const h = window.location.hash.replace('#', '');
  if (!h) return { view: 'intro', group: null, topic: null, sub: null };
  if (LEGACY_HASH_ALIASES[h]) {
    const alias = LEGACY_HASH_ALIASES[h];
    if (alias.view === 'foundations' || alias.view === 'explorations') {
      const resolver = alias.view === 'foundations' ? resolveFoundationsRoute : resolveExplorationsRoute;
      const f = alias.group ? { group: alias.group, topic: alias.topic } : defaultSubFor(alias.view);
      const resolved = alias.group ? f : resolver(f.group, f.topic);
      return { view: alias.view, group: resolved.group, topic: resolved.topic, sub: null };
    }
    return { view: alias.view, group: null, topic: null, sub: alias.sub ?? defaultSubFor(alias.view) };
  }
  const parts = h.split('/');
  const view = parts[0];
  if (!VALID_VIEWS.includes(view)) return { view: 'intro', group: null, topic: null, sub: null };
  if (view === 'foundations') {
    const f = resolveFoundationsRoute(parts[1], parts[2]);
    return { view, group: f.group, topic: f.topic, sub: null };
  }
  if (view === 'explorations') {
    const e = resolveExplorationsRoute(parts[1], parts[2]);
    return { view, group: e.group, topic: e.topic, sub: null };
  }
  const subs = subsFor(view);
  if (!subs) return { view, group: null, topic: null, sub: null };
  const rawSub = parts[1];
  const validSub = subs.find(s => s.id === rawSub);
  return { view, group: null, topic: null, sub: validSub ? validSub.id : defaultSubFor(view) };
}

function buildHash(view, payload) {
  if (view === 'foundations' || view === 'explorations') {
    if (payload && payload.group && payload.topic) return `${view}/${payload.group}/${payload.topic}`;
    return view;
  }
  return payload ? `${view}/${payload}` : view;
}

function TocRow({ label, active, hasChildren, expanded, level, onClick }) {
  const isTop = level === 0;
  // level 0 = top tab；level 1 = Foundations group 或 Screens/Explorations sub；level 2 = Foundations leaf
  const padding =
    level === 0 ? '8px 12px' :
    level === 1 ? '6px 10px 6px 26px' :
                  '5px 10px 5px 42px';
  const fontSize =
    level === 0 ? 13.5 :
    level === 1 ? 12 :
                  11.5;
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      width: '100%', textAlign: 'left',
      border: 'none', cursor: 'pointer',
      padding,
      borderRadius: 7,
      background: active ? (isTop ? TOKENS.p500 : 'rgba(67,35,160,0.10)') : 'transparent',
      color: active ? (isTop ? '#fff' : TOKENS.p600) : '#3a3a3a',
      fontSize,
      fontWeight: active ? 600 : 500,
      fontFamily: 'inherit',
      transition: 'background 140ms, color 140ms',
      marginBottom: 2,
      lineHeight: 1.3,
    }}>
      {hasChildren && (
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ opacity: active ? 1 : 0.55, flexShrink: 0 }}>
          <path d={expanded ? 'M1.5 3l3 3 3-3' : 'M3 1.5l3 3-3 3'}/>
        </svg>
      )}
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </button>
  );
}

function SideTOC({ route, onNavigate }) {
  const { view, sub, group: activeGroup, topic: activeTopic } = route;
  // 每個 Foundations group 維護自身展開狀態；預設只展開選中 leaf 所屬 group。
  const [expandedGroups, setExpandedGroups] = React.useState(() => {
    const init = {};
    FOUNDATIONS_GROUPS.forEach(g => { init[g.id] = view === 'foundations' && g.id === activeGroup; });
    EXPLORATION_GROUPS.forEach(g => { init[g.id] = view === 'explorations' && g.id === activeGroup; });
    return init;
  });
  // 路由變化時自動展開選中 group（其餘維持手動狀態）。
  React.useEffect(() => {
    if ((view === 'foundations' || view === 'explorations') && activeGroup) {
      setExpandedGroups(prev => prev[activeGroup] ? prev : { ...prev, [activeGroup]: true });
    }
  }, [view, activeGroup]);

  const toggleGroup = (gid) => setExpandedGroups(prev => ({ ...prev, [gid]: !prev[gid] }));

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, bottom: 0,
      width: 220, padding: '18px 12px 24px',
      background: 'rgba(255,255,255,0.94)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      borderRight: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '1px 0 6px rgba(0,0,0,0.04)',
      zIndex: 100,
      overflowY: 'auto',
      fontFamily: '-apple-system, "SF Pro", "PingFang TC", "Noto Sans TC", system-ui, sans-serif',
    }}>
      <div style={{
        fontSize: 16, fontWeight: 700, color: '#212121',
        padding: '0 8px 4px', letterSpacing: -0.2,
      }}>
        SuSuGiGi
      </div>
      <div style={{
        fontSize: 11, color: '#9aa3ad', padding: '0 8px 18px',
        letterSpacing: 0.3, fontWeight: 500,
      }}>
        Design Canvas
      </div>
      {VIEW_TABS.map(t => {
        const active = view === t.id;
        return (
          <div key={t.id}>
            <TocRow
              label={t.label}
              active={active}
              hasChildren={!!t.hasSubs}
              expanded={active}
              level={0}
              onClick={() => onNavigate(t.id, null)}
            />
            {active && groupsFor(t.id) && groupsFor(t.id).map(g => {
              const groupActive = activeGroup === g.id;
              const groupExpanded = !!expandedGroups[g.id];
              return (
                <div key={g.id}>
                  <TocRow
                    label={g.label}
                    active={false}
                    hasChildren={true}
                    expanded={groupExpanded}
                    level={1}
                    onClick={() => toggleGroup(g.id)}
                  />
                  {groupExpanded && g.topics.map(tp => (
                    <TocRow
                      key={tp.id}
                      label={tp.label}
                      active={groupActive && activeTopic === tp.id}
                      level={2}
                      onClick={() => onNavigate(t.id, { group: g.id, topic: tp.id })}
                    />
                  ))}
                </div>
              );
            })}
            {active && !groupsFor(t.id) && t.hasSubs && subsFor(t.id).map(s => (
              <TocRow
                key={s.id}
                label={s.label}
                active={sub === s.id}
                level={1}
                onClick={() => onNavigate(t.id, s.id)}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function App() {
  const [route, setRoute] = React.useState(() => parseRoute());
  React.useEffect(() => {
    const onHashChange = () => setRoute(parseRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (view, payload) => {
    const finalPayload = payload ?? defaultSubFor(view);
    const next = buildHash(view, finalPayload);
    const currentPayload = view === 'foundations'
      ? (route.view === 'foundations' ? { group: route.group, topic: route.topic } : null)
      : route.sub;
    const current = buildHash(route.view, currentPayload);
    if (next !== current) window.location.hash = next;
  };

  const { view, sub, group: foundationsGroup, topic: foundationsTopic } = route;

  const [sharedFilter, setSharedFilter] = React.useState({
    timeGranularity: 'month',
    groupBy: 'date',
    selectedAccountIds: ACCOUNTS.map(a => a.id),
  });

  const W = 402, H = 874;

  const foundationsTopicEntry = view === 'foundations'
    ? (() => {
        const g = FOUNDATIONS_GROUPS.find(grp => grp.id === foundationsGroup);
        return g ? g.topics.find(tp => tp.id === foundationsTopic) : null;
      })()
    : null;

  const explorationsTopicEntry = view === 'explorations'
    ? (() => {
        const g = EXPLORATION_GROUPS.find(grp => grp.id === foundationsGroup);
        return g ? g.topics.find(tp => tp.id === foundationsTopic) : null;
      })()
    : null;

  return (
    <>
      <SideTOC route={route} onNavigate={navigate}/>
      <DesignCanvas resetKey={
        view === 'foundations'  ? `foundations/${foundationsGroup ?? ''}/${foundationsTopic ?? ''}` :
        view === 'explorations' ? `explorations/${foundationsGroup ?? ''}/${foundationsTopic ?? ''}` :
        `${view}/${sub ?? ''}`
      }>
        {view === 'intro'        && <IntroSection/>}
        {view === 'foundations' && foundationsTopicEntry && (
          <React.Fragment>{foundationsTopicEntry.render()}</React.Fragment>
        )}
        {view === 'screens' && SCREEN_GROUPS.filter(g => g.id === sub).map(group => (
          <DCSection key={group.id} id={`screens-${group.id}`} title={group.title} subtitle={group.subtitle}>
            {group.screens.map(s => (
              <DCArtboard key={s.id} id={s.id} label={s.label} width={W} height={H}>
                <IOSDevice width={W} height={H}>
                  <ScreenFrame pinned={s.id} sharedFilter={sharedFilter} setSharedFilter={setSharedFilter}/>
                </IOSDevice>
              </DCArtboard>
            ))}
          </DCSection>
        ))}
        {view === 'explorations' && explorationsTopicEntry && (
          <React.Fragment>{explorationsTopicEntry.render()}</React.Fragment>
        )}
      </DesignCanvas>
    </>
  );
}

Object.assign(window, { SCREEN_META, SCREEN_GROUPS, ScreenFrame, FOUNDATIONS_GROUPS, EXPLORATION_GROUPS });

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
