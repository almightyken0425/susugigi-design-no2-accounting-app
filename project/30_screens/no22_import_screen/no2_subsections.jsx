// ─────────────────────────────────────────────────────────────
// ImportScreen sub-sections · wizard header + 各 step 內容元件
//
// 鏡射 impl src/screens/Settings/ImportScreen.tsx 的 4 步：
//   ImportWizardHeader（全 icon 導航）/ ImportStep1FileSelect /
//   ImportStep2Mapping / ImportStep3Matching / ImportStep4Preview
//
// header 全 icon：左 關閉(xmark) 或 返回(back chevron)，右 前進(chevron.right) 或 送出(checkmark)。
// 無置底列。step 2 / 3 套 editor 欄位元件，step 4 套 DataListItem 資料列。
// Mock 資料 inline，模擬 csv 解析後的內容。
// ─────────────────────────────────────────────────────────────

// ─── ImportWizardHeader ─── 全 icon 導航列，視覺對齊 ModalHeader
// left: 'close' | 'back'；right: 'next' | 'submit'。design canvas 靜態示意，pill 不接 onPress。
function ImportWizardHeader({ left, title, right }) {
  return (
    <div style={{
      paddingTop: 60, paddingBottom: 8, paddingLeft: 16, paddingRight: 16,
      display: 'flex', alignItems: 'center',
      background: 'transparent', position: 'relative', zIndex: 5,
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', minHeight: 32 }}>
        {left === 'close'
          ? <HeaderButtonPill symbols={['xmark']} intent="dismiss"/>
          : <MockBackButtonPill/>}
      </div>
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 60, height: 32,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <span style={{
          fontSize: 17, fontWeight: TYPOGRAPHY.weight.medium, color: TOKENS.ink,
          whiteSpace: 'nowrap', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{title}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minHeight: 32 }}>
        {right === 'submit'
          ? <HeaderButtonPill symbols={['checkmark']} intent="commit"/>
          : <HeaderButtonPill symbols={['chevron.right']} intent="action"/>}
      </div>
    </div>
  );
}

// ─── ImportButton ─── 全寬按鈕，primary 為主操作藍底、secondary 為次操作描邊
function ImportButton({ label, kind = 'primary' }) {
  const primary = kind === 'primary';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: primary ? TOKENS.p500 : TOKENS.surface,
      border: primary ? 'none' : `1px solid ${TOKENS.hairline}`,
      color: primary ? '#fff' : TOKENS.p500,
      paddingTop: SPACING.md, paddingBottom: SPACING.md,
      borderRadius: RADIUS.md,
      fontWeight: TYPOGRAPHY.weight.medium,
      fontSize: TYPOGRAPHY.size.base,
    }}>{label}</div>
  );
}

// ─── ImportStep1FileSelect ─── 來源時區 wheel + 選檔 + 下載範本 / 下載說明
// 上半（時區 + 檔名 + 選擇檔案）一組，分隔線，下半（下載範本 + 下載說明）一組。
function ImportStep1FileSelect({ withFile = true }) {
  const T = IMPORT_SCREEN_TOKENS;
  return (
    <div style={{ padding: T.SCREEN_PADDING }}>
      {/* 來源時區 wheel，常駐展開、當場選不跳第二畫面 */}
      <div style={{ marginBottom: T.SECTION_GAP }}>
        <div style={{
          fontSize: T.SECTION_TITLE_FONT_SIZE, fontWeight: T.SECTION_TITLE_WEIGHT,
          color: TOKENS.ink, marginBottom: SPACING.sm,
        }}>來源時區</div>
        <div style={{
          fontSize: T.DESCRIPTION_FONT_SIZE, color: TOKENS.ink2,
          marginBottom: SPACING.sm,
        }}>匯入資料的日期時間，依下方選的來源時區解析</div>
        <div style={{ position: 'relative', height: T.TZ_WHEEL_HEIGHT, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, top: T.TZ_WHEEL_SELECTED_TOP, height: T.TZ_WHEEL_ROW_HEIGHT,
            borderTop: `1px solid ${TOKENS.hairline}`,
            borderBottom: `1px solid ${TOKENS.hairline}`,
          }}/>
          {[
            { tz: 'UTC+10:00', opacity: T.TZ_WHEEL_OPACITY_FAR },
            { tz: 'UTC+09:00', opacity: T.TZ_WHEEL_OPACITY_NEAR },
            { tz: 'UTC+08:00', opacity: 1, sel: true },
            { tz: 'UTC+07:00', opacity: T.TZ_WHEEL_OPACITY_NEAR },
            { tz: 'UTC+06:00', opacity: T.TZ_WHEEL_OPACITY_FAR },
          ].map((r, i) => (
            <div key={i} style={{
              position: 'relative', height: T.TZ_WHEEL_ROW_HEIGHT, lineHeight: `${T.TZ_WHEEL_ROW_HEIGHT}px`, textAlign: 'center',
              fontSize: TYPOGRAPHY.size.base,
              fontWeight: r.sel ? TYPOGRAPHY.weight.medium : TYPOGRAPHY.weight.regular,
              color: TOKENS.ink, opacity: r.opacity,
            }}>{r.tz}</div>
          ))}
        </div>
      </div>

      {/* 檔名（選後才出現）+ 選擇檔案按鈕 */}
      {withFile && (
        <div style={{
          textAlign: 'center', color: TOKENS.ink,
          fontWeight: TYPOGRAPHY.weight.medium, marginBottom: SPACING.md,
        }}>transactions_2026.csv</div>
      )}
      <ImportButton label="選擇檔案" kind="primary"/>

      {/* 分隔線 */}
      <div style={{
        height: 1, background: TOKENS.hairline,
        marginTop: T.SECTION_GAP, marginBottom: T.SECTION_GAP,
      }}/>

      {/* 下載範本 + 下載說明 */}
      <ImportButton label="下載範本" kind="secondary"/>
      <div style={{ height: SPACING.sm }}/>
      <ImportButton label="下載說明" kind="secondary"/>
    </div>
  );
}

// ─── ImportStep2Mapping ─── 逐欄位 EditorFieldLabel + 收合選擇器 + 首筆預覽
function ImportStep2Mapping() {
  const T = IMPORT_SCREEN_TOKENS;
  const fields = [
    { label: '日期', required: true,  value: 'date' },
    { label: '金額', required: true,  value: 'amount' },
    { label: '分類', required: true,  value: 'category' },
    { label: '帳戶', required: true,  value: 'account' },
    { label: '幣別', required: true,  value: 'currency' },
    { label: '備註', required: false, value: 'note' },
  ];
  return (
    <div style={{ padding: T.SCREEN_PADDING }}>
      {fields.map(f => (
        <div key={f.label} style={{ marginBottom: T.FIELD_GAP }}>
          <EditorFieldLabel required={f.required}>{f.label}</EditorFieldLabel>
          <EditorPickerCollapsed value={f.value}/>
        </div>
      ))}
    </div>
  );
}

// ─── ImportStep3Matching ─── 帳戶 / 支出類別 / 收入類別 三段，每項收合選擇器選沿用/新建/略過
function ImportStep3Matching() {
  const T = IMPORT_SCREEN_TOKENS;
  const SectionTitle = ({ children, first }) => (
    <div style={{
      fontSize: T.SECTION_TITLE_FONT_SIZE, fontWeight: T.SECTION_TITLE_WEIGHT,
      color: TOKENS.ink, marginTop: first ? 0 : T.SECTION_GAP, marginBottom: SPACING.md,
    }}>{children}</div>
  );
  const Item = ({ name, action }) => (
    <div style={{ marginBottom: T.FIELD_GAP }}>
      <EditorFieldLabel>{name}</EditorFieldLabel>
      <EditorPickerCollapsed value={action}/>
    </div>
  );
  return (
    <div style={{ padding: T.SCREEN_PADDING }}>
      <SectionTitle first>帳戶</SectionTitle>
      <Item name="玉山活儲 (TWD)" action="沿用"/>
      <Item name="USD 旅費 (USD)" action="新建"/>

      <SectionTitle>支出類別</SectionTitle>
      <Item name="飲食" action="沿用"/>
      <Item name="訂閱" action="新建"/>

      <SectionTitle>收入類別</SectionTitle>
      <Item name="薪資" action="沿用"/>
      <Item name="獎金" action="新建"/>
    </div>
  );
}

// ─── ImportStep4Preview ─── 匯入摘要，分組卡資料列
function ImportStep4Preview() {
  const T = IMPORT_SCREEN_TOKENS;
  return (
    <div style={{ padding: T.SCREEN_PADDING }}>
      <ListSection title="匯入摘要">
        <ListGroupCard>
          <DataListItem title="共匯入" value="124"/>
          <DataListItem title="新增帳戶" value="1"/>
          <DataListItem title="新增類別" value="1"/>
          <DataListItem title="將略過紀錄數" value="8"/>
        </ListGroupCard>
      </ListSection>
    </div>
  );
}

Object.assign(window, {
  ImportWizardHeader, ImportButton,
  ImportStep1FileSelect, ImportStep2Mapping,
  ImportStep3Matching, ImportStep4Preview,
});
