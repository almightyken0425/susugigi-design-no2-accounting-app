// ─────────────────────────────────────────────────────────────
// PreferenceScreen · 對齊 impl src/screens/Settings/PreferenceScreen.tsx
//
// Push screen（從 Settings 主入口進入）。ListSection（無 title）：
//   1. 啟動模式（value + chevron）
//   2. 基礎幣別 + 幣別設定 + 匯率管理
//   3. 語言 + 時區 + 週起始日（value + chevron）
//   4. 財務分析 + 使用情況（switch）
//
// app 無帳號 UI：無登出、無刪除帳號；資料清除入口在 DataManagementScreen。
// 主題切換為內部功能，不在此使用者偏好流程，故不列主題入口。
//
// Variants：default only。
// ─────────────────────────────────────────────────────────────

function PreferenceScreen() {
  const T = PREFERENCE_SCREEN_TOKENS;
  const v = PREFERENCE_PREVIEW_VALUES;

  return (
    <div style={{
      padding: T.SCREEN_PADDING,
      background: TOKENS.bg, minHeight: '100%',
    }}>
      <ListSection>
        <ListGroupCard>
          <ListItem title="啟動模式" value={v.launchMode} showChevron/>
        </ListGroupCard>
      </ListSection>

      <ListSection>
        <ListGroupCard>
          <ListItem title="基礎幣別" value={v.baseCurrency} showChevron/>
          <ListItem title="幣別格式設定" showChevron/>
          <ListItem title="匯率管理"   showChevron/>
        </ListGroupCard>
      </ListSection>

      <ListSection>
        <ListGroupCard>
          <ListItem title="語言" value={v.language} showChevron/>
          <ListItem title="時區" value={v.timeZone} showChevron/>
          <ListItem title="週起始日" value={v.weekStart} showChevron/>
        </ListGroupCard>
      </ListSection>

      <ListSection>
        <ListGroupCard>
          <ListItem
            title="允許財務分析"
            subtitle="控制財務內容分析"
            trailing={<Switch value={v.analyticsConsent}/>}/>
          <ListItem
            title="分享使用情況"
            subtitle="只含功能操作，不含記帳內容"
            trailing={<Switch value={v.usageAnalyticsConsent}/>}/>
        </ListGroupCard>
      </ListSection>
    </div>
  );
}

Object.assign(window, { PreferenceScreen });
