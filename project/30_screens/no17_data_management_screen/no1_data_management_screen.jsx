// ─────────────────────────────────────────────────────────────
// DataManagementScreen · 對齊 impl src/screens/Settings/DataManagementScreen.tsx
//
// Push screen。3 個 ListSection：
//   1. 匯入交易 / 轉帳
//   2. 匯出交易 / 轉帳
//   3. 清除所有資料（destructive）
//      確認流走 iOS 原生 Alert 兩段（說明段含「訂閱不受影響」+
//      管理訂閱鈕、最終確認段），視覺不由 canvas 承載。
//      文案要點：雲端 + 本機 + 身分全滅、訂閱跟 Apple ID 不受影響、
//      清除完成後自動重生新匿名身分。
//
// Variants：default only。
// ─────────────────────────────────────────────────────────────

function DataManagementScreen() {
  const T = DATA_MANAGEMENT_SCREEN_TOKENS;
  const renderIcon = (name, color) => (
    <Glyph name={name} size={LIST_TOKENS.ICON_SIZE_SMALL} color={color ?? TOKENS.ink} stroke={2}/>
  );

  return (
    <div style={{
      padding: T.SCREEN_PADDING,
      background: TOKENS.bg, minHeight: '100%',
    }}>
      <ListSection>
        <ListGroupCard>
          {DM_IMPORT_ROWS.map(r => (
            <ListItem key={r.id} leftIcon={renderIcon(r.icon)} title={r.title} showChevron/>
          ))}
        </ListGroupCard>
      </ListSection>

      <ListSection>
        <ListGroupCard>
          {DM_EXPORT_ROWS.map(r => (
            <ListItem key={r.id} leftIcon={renderIcon(r.icon)} title={r.title}/>
          ))}
        </ListGroupCard>
      </ListSection>

      <ListSection>
        <ListGroupCard>
          <ListItem
            leftIcon={renderIcon('trash', TOKENS.error)}
            title="清除所有資料"
            titleColor={TOKENS.error}/>
        </ListGroupCard>
      </ListSection>
    </div>
  );
}

Object.assign(window, { DataManagementScreen });
