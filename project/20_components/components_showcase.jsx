// ─────────────────────────────────────────────────────────────
// Components Showcase · 元件視覺化（純展示，不含 token 表）
//
// 5 個家族 section，各自為 Foundations > Components group 底下一個 leaf：
//   - ComponentsListSection         List / TxList row family
//   - ComponentsFormSection         FormPicker / Chip family
//   - ComponentsNavigationSection   Header / SearchBar / FAB
//   - ComponentsChartSection        Donut / FocusCard
//   - ComponentsInputSection        Switch / Keypad / GlassView
//
// 本檔僅承載「元件實境 demo」。對應的元件級 token 表搬到
// Foundations > Component Tokens 對應 leaf 內。
//
// 所有卡片皆為 live JSX：讀 components.jsx 的元件即時 render。
// ─────────────────────────────────────────────────────────────

function ComponentsListSection() {
  return (
    <DCSection id="comp-list" title="Components · List" subtitle="iOS 風格 grouped list row 元件家族。對應 token 表與 divider inset 規則見 Foundations > Component Tokens 對應 leaf（List / Transaction List / List Empty Transition）。">
      <DCFamily id="comp-list-items" title="Item Variants" subtitle="row 級元件：標準 ListItem 多變體、選擇列、拖拉列。">
      <DCArtboard id="comp-listitem" label="ListItem · 變體 (live)" width={402} height={620}>
        <CompFrame>
          <CompLabel>ListItem 不同組合</CompLabel>
          <div style={{ padding: SPACING.lg }}>
            <ListGroupCard>
              <ListItem leftIcon={<Glyph name="tag-outline" size={ICON_SIZE.sm} color={TOKENS.ink} stroke={1.8}/>}
                title="只有 title"/>
              <ListItem leftIcon={<Glyph name="bank-outline" size={ICON_SIZE.sm} color={TOKENS.ink} stroke={1.8}/>}
                title="title + subtitle" subtitle="輔助說明文字"/>
              <ListItem leftIcon={<Glyph name="cog-outline" size={ICON_SIZE.sm} color={TOKENS.ink} stroke={1.8}/>}
                title="title + value + chevron" value="NT$1,200" showChevron/>
              <ListItem title="無 leftIcon · divider 縮到 16px" showChevron/>
              <ListItem leftIcon={<Glyph name="star-outline" size={ICON_SIZE.sm} color={TOKENS.p500} stroke={1.8}/>}
                title="titleColor = primary" titleColor={TOKENS.p500} showChevron/>
              <ListItem leftIcon={<Glyph name="trash" size={ICON_SIZE.sm} color={TOKENS.error} stroke={1.8}/>}
                title="destructive (error 色)" titleColor={TOKENS.error}/>
              <ListItem leftIcon={<Glyph name="bug-outline" size={ICON_SIZE.sm} color={TOKENS.ink} stroke={1.8}/>}
                title="disabled state" disabled/>
            </ListGroupCard>
          </div>
        </CompFrame>
      </DCArtboard>

      <DCArtboard id="comp-data-list-item" label="DataListItem · 資料數值列 (live)" width={402} height={500}>
        <CompFrame>
          <CompLabel>用於 ImportScreen step 4 匯入摘要 — 左 icon + title/subtitle + 右 value/valueSubtext</CompLabel>
          <div style={{ padding: SPACING.lg }}>
            <ListGroupCard>
              <DataListItem leftIcon={<Glyph name="bank-outline" size={ICON_SIZE.sm} color={TOKENS.ink} stroke={1.8}/>}
                title="title + value（最簡）" value="NT$1,200"/>
              <DataListItem leftIcon={<Glyph name="wallet-outline" size={ICON_SIZE.sm} color={TOKENS.ink} stroke={1.8}/>}
                title="現金錢包" subtitle="TWD" value="NT$12,540"/>
              <DataListItem leftIcon={<Glyph name="credit-card-outline" size={ICON_SIZE.sm} color={TOKENS.ink} stroke={1.8}/>}
                title="信用卡" subtitle="USD"
                value="US$320.00" valueSubtext="≈ NT$10,240"/>
              <DataListItem leftIcon={<Glyph name="food-outline" size={ICON_SIZE.sm} color={TOKENS.error} stroke={1.8}/>}
                title="餐飲" subtitle="支出分類"
                value="-NT$3,250" valueColor={TOKENS.error} valueSubtext="本月 ▲ 12%"/>
              <DataListItem leftIcon={<Glyph name="trending-up" size={ICON_SIZE.sm} color={TOKENS.success} stroke={1.8}/>}
                title="薪資" subtitle="收入分類"
                value="+NT$58,000" valueColor={TOKENS.success} valueSubtext="本月 ▼ 0%"/>
            </ListGroupCard>
          </div>
        </CompFrame>
      </DCArtboard>

      <DCArtboard id="comp-selection-list" label="SelectionListItem · 選擇列 (live)" width={402} height={500}>
        <CompFrame>
          <CompLabel>用於 ThemeSettings / Language / Timezone</CompLabel>
          <div style={{ padding: SPACING.lg }}>
            <ListGroupCard>
              <SelectionListItem title="繁體中文" selected/>
              <SelectionListItem title="English"/>
              <SelectionListItem title="日本語"/>
            </ListGroupCard>
          </div>
        </CompFrame>
      </DCArtboard>

      <DCArtboard id="comp-reorderable" label="ReorderableListItem · 60px 拖拉列 (live)" width={402} height={500}>
        <CompFrame>
          <CompLabel>用於 AccountList / CategoryList — 無 drag handle（整列可拖）</CompLabel>
          <div style={{ padding: SPACING.lg }}>
            <ListGroupCard>
              {ACCOUNTS.map(a => (
                <ReorderableListItem key={a.id}
                  leftIcon={<DynamicIconById iconId={a.iconId} size={ICON_SIZE.sm} color={TOKENS.ink}/>}
                  title={a.name} subtitle={a.currency}
                  style={{ height: 60 }}/>
              ))}
            </ListGroupCard>
          </div>
        </CompFrame>
      </DCArtboard>
      </DCFamily>

      <DCFamily id="comp-list-containers" title="Containers" subtitle="容器級元件：卡片風格選擇器、section 分組外殼。">
      <DCArtboard id="comp-grid" label="SelectionGridItem · 卡片風格 (live)" width={402} height={500}>
        <CompFrame>
          <CompLabel>用於 ThemeSettings — preview 區（aspectRatio 1.4）+ title + check-circle 右上角</CompLabel>
          <div style={{ padding: SPACING.lg, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ width: '47%' }}>
              <SelectionGridItem title="經典紫 (Classic Purple)" selected onPress={()=>{}}>
                <div style={{ flex: 1, background: THEME_1.primary[500] }}/>
                <div style={{ flex: 1, background: THEME_1.primary[900] }}/>
                <div style={{ flex: 1, background: THEME_1.bg.base }}/>
              </SelectionGridItem>
            </div>
            <div style={{ width: '47%' }}>
              <SelectionGridItem title="海洋藍 (Ocean Teal)" onPress={()=>{}}>
                <div style={{ flex: 1, background: THEME_2.primary[500] }}/>
                <div style={{ flex: 1, background: THEME_2.primary[900] }}/>
                <div style={{ flex: 1, background: THEME_2.bg.base }}/>
              </SelectionGridItem>
            </div>
          </div>
        </CompFrame>
      </DCArtboard>

      <DCArtboard id="comp-list-section" label="ListSection · 有/無 title 兩變體 (live)" width={402} height={520}>
        <CompFrame>
          <CompLabel>title 是 optional prop — impl 全部 caller 都沒帶 title（單純用作分組外殼）</CompLabel>
          <div style={{ padding: SPACING.lg }}>
            <ListSection style={{ marginBottom: SPACING.xl }}>
              <ListGroupCard>
                <ListItem title="無 title 變體 · 純容器" showChevron/>
                <ListItem title="Settings 全部 ListSection 都這樣用" showChevron/>
              </ListGroupCard>
            </ListSection>
            <ListSection title="資料管理">
              <ListGroupCard>
                <ListItem title="有 title 變體 · 帶區塊標題" showChevron/>
                <ListItem title="管理類別" showChevron/>
                <ListItem title="管理帳戶" showChevron/>
              </ListGroupCard>
            </ListSection>
          </div>
        </CompFrame>
      </DCArtboard>

      <DCArtboard id="comp-icon-outline" label="IconOutline · section icon 容器 (live)" width={402} height={320}>
        <CompFrame>
          <CompLabel>用於 PeriodPage 交易區 section header — 32×32 icon 對齊容器（impl 預設無 border，保留 withBorder prop）</CompLabel>
          <div style={{ padding: SPACING.lg, display: 'flex', gap: SPACING.xl, alignItems: 'center' }}>
            <IconOutline glyph="food-outline"/>
            <IconOutline glyph="wallet-outline"/>
            <IconOutline glyph="bank-outline" color={TOKENS.ink}/>
            <IconOutline glyph="credit-card-outline" withBorder/>
          </div>
        </CompFrame>
      </DCArtboard>
      </DCFamily>

      <DCFamily id="comp-list-empty" title="Empty State" subtitle="空狀態元件與 crossfade 過場動畫。">
      <DCArtboard id="comp-empty-live" label="ListEmptyState (live)" width={402} height={500}>
        <CompFrame>
          <div style={{ padding: 80 }}>
            <ListEmptyState iconName="magnify" title="找不到結果" description="「USD」"/>
          </div>
        </CompFrame>
      </DCArtboard>

      <DCArtboard id="comp-list-empty-transition" label="ListEmptyTransition · 列表與空狀態 crossfade (live)" width={402} height={500}>
        <CompFrame>
          <CompLabel>按按鈕切換 isEmpty，{LIST_EMPTY_TRANSITION.DURATION_MS}ms standard easing crossfade</CompLabel>
          <ListEmptyTransitionDemo/>
        </CompFrame>
      </DCArtboard>
      </DCFamily>

      <DCFamily id="comp-list-interaction-states" title="Interaction States" subtitle="四個 list row 元件的互動狀態階梯：default / pressed / disabled 並排比較。Pressed 統一採 surface_hover（不用 opacity 法），背景由 TOKENS.surface2 提供。新增 list row 元件依此 pattern。">
      <DCArtboard id="comp-list-state-default" label="Default" width={402} height={420}>
        <CompFrame>
          <CompLabel>預設狀態 · 背景 TOKENS.surface</CompLabel>
          <div style={{ padding: SPACING.lg }}>
            <ListGroupCard>
              <ListItem leftIcon={<Glyph name="tag-outline" size={ICON_SIZE.sm} color={TOKENS.ink} stroke={1.8}/>}
                title="ListItem" showChevron/>
              <DataListItem leftIcon={<Glyph name="bank-outline" size={ICON_SIZE.sm} color={TOKENS.ink} stroke={1.8}/>}
                title="DataListItem" value="NT$1,200"/>
              <SelectionListItem title="SelectionListItem" selected/>
              <ReorderableListItem leftIcon={<Glyph name="drag-vertical" size={ICON_SIZE.sm} color={TOKENS.ink3} stroke={1.8}/>}
                title="ReorderableListItem" style={{ height: 60 }}/>
            </ListGroupCard>
          </div>
        </CompFrame>
      </DCArtboard>

      <DCArtboard id="comp-list-state-pressed" label="Pressed · surface_hover" width={402} height={420}>
        <CompFrame>
          <CompLabel>按下狀態 · 統一覆寫 background 為 TOKENS.surface2（= surface_hover）</CompLabel>
          <div style={{ padding: SPACING.lg }}>
            <ListGroupCard>
              <ListItem leftIcon={<Glyph name="tag-outline" size={ICON_SIZE.sm} color={TOKENS.ink} stroke={1.8}/>}
                title="ListItem" showChevron style={{ background: TOKENS.surface2 }}/>
              <DataListItem leftIcon={<Glyph name="bank-outline" size={ICON_SIZE.sm} color={TOKENS.ink} stroke={1.8}/>}
                title="DataListItem" value="NT$1,200" style={{ background: TOKENS.surface2 }}/>
              <SelectionListItem title="SelectionListItem" selected style={{ background: TOKENS.surface2 }}/>
              <ReorderableListItem leftIcon={<Glyph name="drag-vertical" size={ICON_SIZE.sm} color={TOKENS.ink3} stroke={1.8}/>}
                title="ReorderableListItem" style={{ height: 60, background: TOKENS.surface2 }}/>
            </ListGroupCard>
          </div>
        </CompFrame>
      </DCArtboard>

      <DCArtboard id="comp-list-state-disabled" label="Disabled" width={402} height={420}>
        <CompFrame>
          <CompLabel>停用狀態 · ListItem / SelectionListItem 有 disabled prop（標題轉 ink3）；DataListItem / ReorderableListItem 無 disabled 概念，留 default 視覺</CompLabel>
          <div style={{ padding: SPACING.lg }}>
            <ListGroupCard>
              <ListItem leftIcon={<Glyph name="tag-outline" size={ICON_SIZE.sm} color={TOKENS.ink3} stroke={1.8}/>}
                title="ListItem (disabled)" showChevron disabled/>
              <DataListItem leftIcon={<Glyph name="bank-outline" size={ICON_SIZE.sm} color={TOKENS.ink} stroke={1.8}/>}
                title="DataListItem (無 disabled prop)" value="NT$1,200"/>
              <SelectionListItem title="SelectionListItem (disabled)" disabled/>
              <ReorderableListItem leftIcon={<Glyph name="drag-vertical" size={ICON_SIZE.sm} color={TOKENS.ink3} stroke={1.8}/>}
                title="ReorderableListItem (無 disabled prop)" style={{ height: 60 }}/>
            </ListGroupCard>
          </div>
        </CompFrame>
      </DCArtboard>
      </DCFamily>
    </DCSection>
  );
}

function ComponentsFormSection() {
  return (
    <DCSection id="comp-form" title="Components · Form" subtitle="Form 觸發器、金額輸入、定期設定卡片。對應 token 表見 Foundations > Component Tokens 各 leaf（Form Picker / Chip / Switch / Amount Field / Static Wheel Picker / Recurring Options / Dual Picker Box）。AccountSelector / CategorySelector 為 StaticWheelPicker 薄 wrapper，token 共用 Static Wheel Picker。">
      <DCFamily id="comp-form-pickers" title="Form Pickers" subtitle="impl AccountSelector / CategorySelector 在 TxEditor / TransferEditor 採 mode='static' 常駐顯示；design canvas 對應 StaticWheelPicker 視覺 stub。">
        <DCArtboard id="comp-static-wheel" label="StaticWheelPicker · 通用 wheel 視覺 stub (live)" width={402} height={180}>
          <CompFrame style={{ padding: SPACING.lg }}>
            <CompLabel>對齊 impl native iOS Picker static mode：3 行 wheel（中央 highlighted + 上下 dim 鄰近選項）；所有行同 LABEL_SIZE / TOKENS.ink，上下行套 DIM_OPACITY</CompLabel>
            <div style={{ display: 'flex', flexDirection: 'row', gap: SPACING.lg, marginTop: SPACING.md }}>
              <StaticWheelPicker label="玉山活儲"/>
              <StaticWheelPicker label="飲食"/>
            </div>
          </CompFrame>
        </DCArtboard>
        <DCArtboard id="comp-account-selector" label="AccountSelector · static mode 並排 (live)" width={402} height={180}>
          <CompFrame style={{ padding: SPACING.lg }}>
            <CompLabel>對齊 impl src/components/AccountSelector.tsx mode='static'</CompLabel>
            <div style={{ display: 'flex', flexDirection: 'row', gap: SPACING.lg, marginTop: SPACING.md }}>
              <AccountSelector account={ACC_BY_ID.bank}/>
              <AccountSelector account={ACC_BY_ID.usd_cash}/>
            </div>
          </CompFrame>
        </DCArtboard>
        <DCArtboard id="comp-category-selector" label="CategorySelector · category name (live)" width={402} height={180}>
          <CompFrame style={{ padding: SPACING.lg }}>
            <CompLabel>對齊 impl static mode：只顯示 category name，無 type 配色（type accent 僅用於 modal/inline mode 的 subText）</CompLabel>
            <div style={{ display: 'flex', flexDirection: 'row', gap: SPACING.lg, marginTop: SPACING.md }}>
              <CategorySelector category={CAT_BY_ID.food}/>
              <CategorySelector category={CAT_BY_ID.salary}/>
            </div>
          </CompFrame>
        </DCArtboard>
        <DCArtboard id="comp-dual-picker-box" label="DualPickerBox · default / conflict (live)" width={402} height={360}>
          <CompFrame style={{ padding: SPACING.lg }}>
            <CompLabel>外框包左右兩個 noBorder picker + 中間 → 箭頭；MergeEditor / TransferEditor 共用。conflict（左右選到同一項）外框轉 error。對應 token 表見 Foundations &gt; Component Tokens &gt; Dual Picker Box</CompLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md, marginTop: SPACING.md }}>
              <DualPickerBox
                left={<AccountSelector account={ACC_BY_ID.bank} noBorder/>}
                right={<AccountSelector account={ACC_BY_ID.usd_cash} noBorder/>}/>
              <DualPickerBox conflict
                left={<AccountSelector account={ACC_BY_ID.bank} noBorder/>}
                right={<AccountSelector account={ACC_BY_ID.bank} noBorder/>}/>
            </div>
          </CompFrame>
        </DCArtboard>
      </DCFamily>

      <DCFamily id="comp-form-editor-fields" title="Editor Form Fields (V2)" subtitle="AccountEditor / CategoryEditor / ImportWizard 共用的 form helper。實作位於 30_screens/shared/no3_editor_field_helpers.jsx，未來 impl 重構時可升入 20_components 正式元件。">
        <DCArtboard id="comp-editor-name-field" label="EditorNameField · 大字置中名稱輸入（default / filled / active）" width={402} height={320}>
          <CompFrame style={{ padding: SPACING.lg, display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
            <CompLabel>高 80、24px 字、中對齊。active 為紫色 border + bg 切換到 bg base，呈現「進入輸入狀態」。對應 impl src/components/EditorNameField 或於 screen 內 inline 實作。</CompLabel>
            <EditorNameField value="" placeholder="輸入帳戶名稱"/>
            <EditorNameField value="玉山活儲"/>
            <EditorNameField value="飲食" active/>
          </CompFrame>
        </DCArtboard>
        <DCArtboard id="comp-editor-button-group" label="EditorButtonGroup · 短選項 chip 群組" width={402} height={180}>
          <CompFrame style={{ padding: SPACING.lg, display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
            <CompLabel>5 個以下選項常駐展開，active 反 primary 紫底白字。AccountEditor 類型欄採此 pattern。對應 impl src/components/ButtonGroup。</CompLabel>
            <EditorButtonGroup options={['現金', '銀行帳戶', '信用卡', '投資', '其他']} selected="銀行帳戶"/>
            <EditorButtonGroup options={['支出', '收入']} selected="支出"/>
          </CompFrame>
        </DCArtboard>
        <DCArtboard id="comp-editor-searchable-dropdown" label="EditorSearchableDropdown · 可搜尋下拉（collapsed / disabled）" width={402} height={220}>
          <CompFrame style={{ padding: SPACING.lg, display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
            <CompLabel>collapsed 狀態：input 顯示當前值 + chevron-down。disabled 狀態：opacity 0.5，無 chevron（編輯模式幣別/類型鎖定）。expanded 狀態（含搜尋 + 清單）由 impl SearchableDropdown 提供互動。</CompLabel>
            <EditorSearchableDropdownCollapsed value="TWD - New Taiwan Dollar"/>
            <EditorSearchableDropdownCollapsed value="TWD - New Taiwan Dollar" disabled/>
            <EditorSearchableDropdownCollapsed value="" placeholder="點擊選擇..."/>
          </CompFrame>
        </DCArtboard>
        <DCArtboard id="comp-editor-picker-collapsed" label="EditorPickerCollapsed · 無框收合選擇器（值 + chevron）" width={402} height={220}>
          <CompFrame style={{ padding: SPACING.lg, display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
            <CompLabel>無框 surface 列，左值右 chevron-down，點開展開選項清單。ImportWizard 欄位對應與內容比對採此 pattern。disabled 時無 chevron。</CompLabel>
            <EditorPickerCollapsed value="date"/>
            <EditorPickerCollapsed value="沿用"/>
            <EditorPickerCollapsed value="鎖定值" disabled/>
          </CompFrame>
        </DCArtboard>
        <DCArtboard id="comp-editor-field-label" label="EditorFieldLabel · 欄位小標 + 欄位列組合" width={402} height={260}>
          <CompFrame style={{ padding: SPACING.lg, display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
            <CompLabel>欄位上方小標，sm 字 ink2 色，required 加星號。與控制元件上下組成一個 form field。下例為 ImportWizard 欄位對應的列結構。</CompLabel>
            <div>
              <EditorFieldLabel required>日期</EditorFieldLabel>
              <EditorPickerCollapsed value="date"/>
            </div>
            <div>
              <EditorFieldLabel>備註</EditorFieldLabel>
              <EditorPickerCollapsed value="note"/>
            </div>
          </CompFrame>
        </DCArtboard>
        <DCArtboard id="comp-editor-inline-icon-grid" label="EditorInlineIconGrid · 4col 常駐圖示網格" width={402} height={360}>
          <CompFrame style={{ padding: SPACING.lg }}>
            <CompLabel>Icon Picker V1 結論：移除 header 與 maxHeight，4 列全展開常駐。選中格反 primary 紫底白 icon。對應 impl src/components/EditorInlineIconGrid 或 screen 內 inline 實作。</CompLabel>
            <div style={{ marginTop: SPACING.md }}>
              <EditorInlineIconGrid icons={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]} selectedId={11}/>
            </div>
          </CompFrame>
        </DCArtboard>
      </DCFamily>

      <DCFamily id="comp-form-delete" title="Delete Button" subtitle="跨 editor footer 共用的刪除鈕：surface 底紅字無框，文字一律「刪除」。對應 impl src/components/DeleteButton.tsx。Transaction / Transfer / Account / Category editor 編輯模式 footer 共用，由原 EditorDestructiveTextButton（白底）與 EditorDeleteButton（透明底）兩套收斂統一。">
        <DCArtboard id="comp-delete-button" label="DeleteButton · surface 底紅字（footer 刪除鈕）" width={402} height={140}>
          <CompFrame style={{ padding: SPACING.lg }}>
            <CompLabel>白底紅字、置中、無框。四個 editor screen 編輯模式底部共用，文字固定「刪除」，按下觸發各自的刪除 action。</CompLabel>
            <div style={{ marginTop: SPACING.md }}>
              <DeleteButton/>
            </div>
          </CompFrame>
        </DCArtboard>
      </DCFamily>

      <DCFamily id="comp-form-amount" title="Editor Inputs" subtitle="金額輸入欄三態：default / active（含 backspace icon）/ disabled。高度 80 為視覺校準。">
        <DCArtboard id="comp-amount-field" label="AmountField · default / active / disabled (live)" width={402} height={220}>
          <CompFrame style={{ padding: SPACING.lg }}>
            <CompLabel>active 時 primary border + bg.base；disabled 透明化</CompLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md, marginTop: SPACING.md }}>
              <AmountField value="" currency="TWD"/>
              <AmountField active value="15,000" currency="TWD"/>
              <AmountField disabled value="480" currency="USD"/>
            </div>
          </CompFrame>
        </DCArtboard>
      </DCFamily>

      <DCFamily id="comp-form-recurring" title="Recurring Settings" subtitle="impl src/components/RecurringOptions.tsx 對應卡片，含 Switch + 頻率 chip + interval input + 結束條件。design canvas 版自包 state，即看即試。兩個 variant 鏡射 impl 行為（default / ON_DATE）。">
        <DCArtboard id="comp-recurring-options" label="RecurringOptions · 完整定期設定卡片 (live)" width={402} height={520}>
          <CompFrame style={{ padding: SPACING.lg }}>
            <RecurringOptions/>
          </CompFrame>
        </DCArtboard>
        <DCArtboard id="comp-recurring-options-on-date" label="RecurringOptions · 結束於＝特定日期（鏡射 impl ON_DATE 接 DateTimePicker）" width={402} height={580}>
          <CompFrame style={{ padding: SPACING.lg }}>
            <RecurringOptions initialEndCondition="ON_DATE"/>
          </CompFrame>
        </DCArtboard>
      </DCFamily>

      <DCFamily id="comp-form-recurring-helpers" title="Recurring Helpers" subtitle="RecurringOptions 內嵌的子元件，可單獨展示。DatePill 對應 impl ON_DATE 接的 DateTimePicker。">
        <DCArtboard id="comp-date-pill" label="DatePill · ON_DATE 日期欄" width={300} height={140}>
          <CompFrame style={{ padding: SPACING.lg }}>
            <DatePill date="2026/12/31"/>
          </CompFrame>
        </DCArtboard>
      </DCFamily>

      <DCFamily id="comp-form-date-picker" title="Date Picker" subtitle="自研日期選擇器（Spec 模式代號 Calendar Dialog，對應 date_picker_policy.md）。單一 pill 點開置中 dialog，日/月雙子模式可切換、即時生效點外關閉。即看即試：點 pill 開 → 點標題列(YYYY/MM)切月模式 → 點日/月選定 → 點 dialog 外關閉。Datetime 含時間滾輪、Date-only 純日期無滾輪。">
        <DCArtboard id="comp-calendar-dialog-datetime" label="CalendarDialog · Datetime (live：點 pill 開 dialog)" width={402} height={640}>
          <CompFrame style={{ padding: SPACING.lg }}>
            <CompLabel>模式 Datetime — 交易/轉帳記錄日期。點 pill 開月曆 dialog；標題列可切日↔月模式；底部時間滾輪。</CompLabel>
            <CalendarDialog mode="datetime"/>
          </CompFrame>
        </DCArtboard>
        <DCArtboard id="comp-calendar-dialog-date" label="CalendarDialog · Date-only (live)" width={402} height={560}>
          <CompFrame style={{ padding: SPACING.lg }}>
            <CompLabel>模式 Date-only — 定期結束日期。無時間滾輪。</CompLabel>
            <CalendarDialog mode="date"/>
          </CompFrame>
        </DCArtboard>
      </DCFamily>
    </DCSection>
  );
}

function ListEmptyTransitionDemo() {
  const [isEmpty, setIsEmpty] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: SPACING.lg, borderBottom: `1px solid ${TOKENS.hairline2}` }}>
        <button onClick={() => setIsEmpty(v => !v)} style={{
          padding: '8px 16px', borderRadius: RADIUS.md,
          border: `1px solid ${TOKENS.border}`, background: TOKENS.surface,
          color: TOKENS.ink, fontSize: TYPOGRAPHY.size.sm, cursor: 'pointer',
        }}>
          切換 isEmpty（目前 {isEmpty ? 'true' : 'false'}）
        </button>
      </div>
      <div style={{ position: 'relative', flex: 1 }}>
        <ListEmptyTransition
          isEmpty={isEmpty}
          emptyState={<ListEmptyState iconName="magnify" title="找不到結果" description="「USD」"/>}
        >
          <div style={{ padding: SPACING.lg }}>
            <ListGroupCard>
              <ListItem title="交易 1" value="NT$1,200"/>
              <ListItem title="交易 2" value="NT$3,400"/>
              <ListItem title="交易 3" value="NT$560"/>
            </ListGroupCard>
          </div>
        </ListEmptyTransition>
      </div>
    </div>
  );
}

function ComponentsNavigationSection() {
  return (
    <DCSection id="comp-nav" title="Components · Navigation" subtitle="放在 screen 邊界的元件。Header 採 React Navigation 原生 createNativeStackNavigator；NavHeader / ModalHeader 已廢除。下分三家族：Header Button pill 元件、4 個 mock 情境驗證、其他浮動 surface。">
      <DCFamily id="nav-buttons" title="Header Buttons" subtitle="三個 pill 元件：customView 41×41（HEADER_ICON_BUTTON_TOKENS.CONTENT_BOX 統一值），iOS 26 native auto-hug 為正圓或膠囊。">
        <DCArtboard id="comp-modal-close" label="ModalCloseButton · xmark in pill (intent=dismiss)" width={402} height={116}>
          <CompFrame style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 16 }}>
            <div style={{ fontSize: 10.5, color: TOKENS.ink3, letterSpacing: 0.3 }}>
              Modal headerLeft · 正圓 pill · customView 41×41 · intent=dismiss (ink + impactLight)
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <HeaderButtonPill symbols={["xmark"]} intent="dismiss"/>
            </div>
          </CompFrame>
        </DCArtboard>
        <DCArtboard id="comp-header-icon-btn" label="HeaderIconButton · Single vs Multi pill (intent=action)" width={402} height={180}>
          <CompFrame style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md, padding: 16 }}>
            <div>
              <div style={{ fontSize: 10.5, color: TOKENS.ink3, letterSpacing: 0.3, marginBottom: 6 }}>
                Single · 正圓 pill · customView 41×41 · intent=action (p500 + impactLight)
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <HeaderButtonPill symbols={["magnifyingglass"]} intent="action"/>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10.5, color: TOKENS.ink3, letterSpacing: 0.3, marginBottom: 6 }}>
                Multi · 膠囊 pill（Home headerRight，customView 各 41×41，gap 8）
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <HeaderButtonPill symbols={["magnifyingglass", "gearshape"]} intent="action"/>
              </div>
            </div>
          </CompFrame>
        </DCArtboard>
        <DCArtboard id="comp-header-check" label="HeaderCheckmarkButton · checkmark in pill (intent=commit)" width={402} height={116}>
          <CompFrame style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 16 }}>
            <div style={{ fontSize: 10.5, color: TOKENS.ink3, letterSpacing: 0.3 }}>
              Editor headerRight · 正圓 pill · customView 41×41 · intent=commit (p500 + impactMedium)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <HeaderButtonPill symbols={["checkmark"]} intent="commit"/>
              <span style={{ fontSize: 10.5, color: TOKENS.ink3 }}>↓ disabled</span>
              <HeaderButtonPill symbols={["checkmark"]} color={TOKENS.ink3}/>
            </div>
          </CompFrame>
        </DCArtboard>
      </DCFamily>

      <DCFamily id="nav-mocks" title="Header Mock Scenarios" subtitle="在真實 status bar + nav bar + content 脈絡下檢視 pill 比例的 prototype 容器，五種典型 header 場景並排比較（含 sheet 自繪 header）。">
        <DCArtboard id="header-mock-home" label="① Push · App Root (Home) 真實脈絡 (live)" width={440} height={200}>
          <CompFrame style={{ padding: SPACING.md, display: 'flex', justifyContent: 'center' }}>
            <HeaderMockFrame>
              <MockNavBar
                leftSlot={<HeaderButtonPill symbols={["line.3.horizontal.decrease"]} intent="action"/>}
                title="$wish"
                rightSlot={<HeaderButtonPill symbols={["magnifyingglass", "gearshape"]} intent="action"/>}
              />
            </HeaderMockFrame>
          </CompFrame>
        </DCArtboard>
        <DCArtboard id="header-mock-push" label="② Push · With Back Button (CategoryList) (live)" width={440} height={200}>
          <CompFrame style={{ padding: SPACING.md, display: 'flex', justifyContent: 'center' }}>
            <HeaderMockFrame>
              <MockNavBar
                leftSlot={<MockBackButtonPill/>}
                title="分類"
                rightSlot={<HeaderButtonPill symbols={["arrow.triangle.merge"]} intent="action"/>}
              />
            </HeaderMockFrame>
          </CompFrame>
        </DCArtboard>
        <DCArtboard id="header-mock-editor-modal" label="③ Editor Modal (AccountEditor) (live)" width={440} height={200}>
          <CompFrame style={{ padding: SPACING.md, display: 'flex', justifyContent: 'center' }}>
            <HeaderMockFrame>
              <MockNavBar
                leftSlot={<HeaderButtonPill symbols={["xmark"]} intent="dismiss"/>}
                title="編輯帳戶"
                rightSlot={<HeaderButtonPill symbols={["checkmark"]} intent="commit"/>}
              />
            </HeaderMockFrame>
          </CompFrame>
        </DCArtboard>
        <DCArtboard id="header-mock-info-modal" label="④ Info Modal (Filter) (live)" width={440} height={200}>
          <CompFrame style={{ padding: SPACING.md, display: 'flex', justifyContent: 'center' }}>
            <HeaderMockFrame>
              <MockNavBar
                leftSlot={<HeaderButtonPill symbols={["xmark"]} intent="dismiss"/>}
                title="篩選"
                rightSlot={null}
              />
            </HeaderMockFrame>
          </CompFrame>
        </DCArtboard>
        <DCArtboard id="header-mock-sheet" label="⑤ Sheet 自繪 header (Currency selector pageSheet · glass prop=true) (live)" width={440} height={220}>
          <CompFrame style={{ padding: SPACING.md, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 402, height: 180,
              background: TOKENS.bg, borderRadius: RADIUS.lg,
              border: `1px solid ${TOKENS.hairline}`, overflow: 'hidden',
              position: 'relative', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
                <div style={{ width: 36, height: 5, borderRadius: 999, background: TOKENS.ink3, opacity: 0.4 }}/>
              </div>
              <MockNavBar
                leftSlot={<HeaderButtonPill symbols={["xmark"]} intent="dismiss"/>}
                title="選擇貨幣"
                rightSlot={null}
              />
              <div style={{
                paddingLeft: SPACING.lg, paddingRight: SPACING.lg, paddingTop: SPACING.md,
                fontSize: TYPE_STYLES.body.size, color: TOKENS.ink2,
              }}>
                <div style={{
                  background: TOKENS.surface, borderRadius: RADIUS.lg,
                  padding: `${SPACING.md}px ${SPACING.lg}px`,
                  border: `1px solid ${TOKENS.hairline}`,
                }}>USD · 美元</div>
              </div>
              <div style={{
                position: 'absolute', bottom: 6, right: 8,
                fontSize: 9, color: TOKENS.ink3, letterSpacing: 0.3,
              }}>無 status bar · sheet handle 在上 · button glass 自帶</div>
            </div>
          </CompFrame>
        </DCArtboard>
      </DCFamily>

      <DCFamily id="nav-surfaces" title="Other Navigation Surfaces" subtitle="浮動元件：FAB 兩模式 + 搜尋 pill。">
        <DCArtboard id="comp-fab-actions" label="FloatingActionBar · actions (live)" width={402} height={160}>
          <CompFrame style={{ position: 'relative', height: 160, background: TOKENS.bg }}>
            <FloatingActionBar mode="actions" onExpensePress={()=>{}} onTransferPress={()=>{}} onIncomePress={()=>{}}/>
          </CompFrame>
        </DCArtboard>
        <DCArtboard id="comp-fab-undo" label="FloatingActionBar · undo (live)" width={402} height={160}>
          <CompFrame style={{ position: 'relative', height: 160, background: TOKENS.bg }}>
            <FloatingActionBar mode="undo" remainingTime={4}/>
          </CompFrame>
        </DCArtboard>
        <DCArtboard id="comp-search-pill" label="BottomSearchBar · GlassView pill (live)" width={402} height={140}>
          <CompFrame style={{ position: 'relative', background: TOKENS.bg }}>
            <BottomSearchBar value="" onChangeText={()=>{}} placeholder="搜尋..."/>
          </CompFrame>
        </DCArtboard>
      </DCFamily>

      <DCFamily id="nav-dialog" title="Confirm Dialog" subtitle="iOS native Alert 風格的 overlay dialog，對齊 impl React Native `Alert.alert(title, message, [{ text, style, onPress }, ...])`。按鈕排版：≤2 水平、3+ 垂直。實際渲染依 actions 數量自動切換。">
        <DCArtboard id="comp-confirm-dialog-2btn" label="ConfirmDialog · 2 按鈕水平排（destructive 範例）" width={402} height={300}>
          <CompFrame style={{ position: 'relative', height: 300, background: TOKENS.bg }}>
            <ConfirmDialog
              title="刪除交易"
              message="確定要刪除這筆交易？此動作無法復原。"
              actions={[
                { label: '取消', style: 'cancel' },
                { label: '刪除', style: 'destructive' },
              ]}/>
          </CompFrame>
        </DCArtboard>
        <DCArtboard id="comp-confirm-dialog-3btn" label="ConfirmDialog · 3 按鈕垂直堆疊（recurring mode）" width={402} height={380}>
          <CompFrame style={{ position: 'relative', height: 380, background: TOKENS.bg }}>
            <ConfirmDialog
              message="此交易屬於週期交易。要套用變更至？"
              actions={[
                { label: '取消',     style: 'cancel' },
                { label: '僅本次',   style: 'default' },
                { label: '未來所有', style: 'default' },
              ]}/>
          </CompFrame>
        </DCArtboard>
      </DCFamily>
    </DCSection>
  );
}

function ComponentsChartSection() {
  return (
    <DCSection id="comp-chart" title="Components · Chart" subtitle="DonutChart 是 Home 中央視覺核心。SIZE 260, OUTER 100, INNER 76, CORNER 6, PAD_ANGLE 1deg。聚焦側弧 outer+2 / inner−2 加粗作焦點指示。FocusCard 切換 expense / income 模式。">
      <DCFamily id="comp-chart-family" title="Home Chart Surfaces" subtitle="Home 中央的視覺資產：甜甜圈圖 + expense/income focus 對照。">
        <DCArtboard id="comp-donut" label="DonutChart (live)" width={402} height={360}>
          <CompFrame style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 32 }}>
            <DonutChart data={pieData(TX).map(d => ({ key: d.id, value: d.value, color: d.color }))}>
              <div style={{ textAlign: 'center', width: 100 }}>
                <div style={{ fontSize: TYPOGRAPHY.size.sm, color: TOKENS.ink2, marginBottom: 4 }}>餘額</div>
                <div style={{
                  fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.medium,
                  color: TOKENS.ink, fontVariantNumeric: 'tabular-nums',
                }}>{fmt(periodTotals(TX).balance)}</div>
              </div>
            </DonutChart>
          </CompFrame>
        </DCArtboard>
        <DCArtboard id="comp-focus" label="FocusCard · active / inactive (live)" width={402} height={180}>
          <CompFrame style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <FocusCard kind="expense" amount={4395} active onPress={()=>{}}/>
              <FocusCard kind="income"  amount={68000} active={false} onPress={()=>{}}/>
            </div>
          </CompFrame>
        </DCArtboard>
      </DCFamily>
    </DCSection>
  );
}

function ComponentsInputSection() {
  return (
    <DCSection id="comp-input" title="Components · Input" subtitle="Switch / CalculatorKeypad / GlassView。CalculatorKeypad 是完整四則運算鍵盤，operator 用 primary[100]*0.5 玻璃染色，按壓回饋走 P1 品牌色輕染（KEYPAD_TOKENS 表見 Foundations > Component Tokens > Keypad）。對應 SWITCH_TOKENS 表見 Foundations > Component Tokens > Switch。">
      <DCFamily id="comp-input-family" title="Input Surfaces" subtitle="iOS 風格輸入相關元件：Switch、Calculator、Glass pill。">
        <DCArtboard id="comp-switch" label="Switch · active 走主題色 (live)" width={402} height={200}>
          <CompFrame style={{ padding: SPACING.xl }}>
            <CompLabel>採 RN 原生 Switch。active track 統一走主題色 primary.main</CompLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.lg, marginTop: SPACING.md }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.md }}>
                <SwitchDemo defaultValue={true} trackColorOn={SWITCH_TOKENS.TRACK_COLOR_ON}/>
                <SwitchDemo defaultValue={false} trackColorOn={SWITCH_TOKENS.TRACK_COLOR_ON}/>
                <span style={{ fontSize: TYPE_STYLES.footnote.size, color: TOKENS.ink2 }}>
                  active · primary.main（所有 toggle 使用點共用）
                </span>
              </div>
            </div>
          </CompFrame>
        </DCArtboard>
        <DCArtboard id="comp-keypad" label="CalculatorKeypad · 1-2-3-+ / 4-5-6-− / 7-8-9-× / .-0-=-÷ (live)" width={402} height={320}>
          <CompFrame style={{ padding: 0 }}>
            <div style={{ background: TOKENS.surface, borderTop: `1px solid ${TOKENS.border}`, paddingTop: KEYPAD_TOKENS.DOCK_PADDING_TOP }}>
              <CalculatorKeypad onPress={()=>{}}/>
            </div>
          </CompFrame>
        </DCArtboard>
        <DCArtboard id="comp-glass" label="GlassView · pill (live)" width={402} height={140}>
          <CompFrame style={{ padding: 24, background: 'linear-gradient(135deg, #4323a0, #c0b6df)' }}>
            <GlassView pill style={{ padding: '12px 20px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Glyph name="line.3.horizontal.decrease" size={ICON_SIZE.xs} color={TOKENS.ink} stroke={2}/>
              <span style={{ color: TOKENS.ink, fontWeight: 500 }}>Glass pill</span>
            </GlassView>
          </CompFrame>
        </DCArtboard>
      </DCFamily>
    </DCSection>
  );
}

function SwitchDemo({ defaultValue, trackColorOn }) {
  const [v, setV] = React.useState(defaultValue);
  return <Switch value={v} onChange={setV} trackColorOn={trackColorOn}/>;
}

function CompFrame({ children, style = {} }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: TOKENS.bg, overflow: 'hidden',
      fontFamily: '-apple-system, "SF Pro Text", "PingFang TC", "Noto Sans TC", system-ui, sans-serif',
      color: TOKENS.ink, ...style,
    }}>{children}</div>
  );
}
function CompLabel({ children }) {
  return (
    <div style={{
      padding: '12px 16px 6px',
      fontSize: 11, fontWeight: 600, letterSpacing: 1, color: TOKENS.ink3,
      textTransform: 'uppercase',
    }}>{children}</div>
  );
}

Object.assign(window, {
  ComponentsListSection,
  ComponentsFormSection,
  ComponentsNavigationSection,
  ComponentsChartSection,
  ComponentsInputSection,
});
