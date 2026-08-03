// ─────────────────────────────────────────────────────────────
// SettingsScreen · 對齊 impl src/screens/Settings/SettingsScreen.tsx
//                  與 spec no3_product_specs/.../no2_screens/no8_settings_screen.md
//
// Push screen，三組 list section + 版本 footer：
//   group 1：類別 / 帳戶 / 資料管理
//   group 2：偏好設定
//   group 3：升級至 Premium（僅未訂閱時顯示）
//   footer：版本號置中灰字（spec §版本資訊）
//
// 不含 impl 端的 Debug Tools section（dev 工具，spec 未定義為產品行為）。
//
// Variants：
//   default     — 未訂閱，顯示三組 + footer
//   subscribed  — 已訂閱，隱藏第三組「升級至 Premium」，footer 仍顯示
//
// 用語：入口列用 Premium、付費牆 hero 用「突破限制」，兩者刻意不同語氣——
//   入口要層級辨識度、hero 要價值主張。拍板見 release no1_copy.md §品牌語境依據。
// ─────────────────────────────────────────────────────────────

function SettingsScreen({ variant = 'default' }) {
  const T = SETTINGS_SCREEN_TOKENS;
  const subscribed = variant === 'subscribed';
  return (
    <div style={{
      padding: T.SCREEN_PADDING,
      background: TOKENS.bg,
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <ListSection>
        <ListGroupCard>
          <SettingsListRow iconName="tag-outline"           title="類別管理" onPress={() => {}}/>
          <SettingsListRow iconName="bank-outline"          title="帳戶管理" onPress={() => {}}/>
          <SettingsListRow iconName="database-cog-outline"  title="資料管理" onPress={() => {}}/>
        </ListGroupCard>
      </ListSection>

      <ListSection>
        <ListGroupCard>
          <SettingsListRow iconName="cog-outline" title="偏好設定" onPress={() => {}}/>
        </ListGroupCard>
      </ListSection>

      {!subscribed && (
        <ListSection>
          <ListGroupCard>
            <SettingsListRow iconName="star-outline" title="升級至 Premium" accent onPress={() => {}}/>
          </ListGroupCard>
        </ListSection>
      )}

      <SettingsVersionFooter/>
    </div>
  );
}

Object.assign(window, { SettingsScreen });
