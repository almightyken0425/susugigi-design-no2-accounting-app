// ─────────────────────────────────────────────────────────────
// LoginScreen sub-sections · 私有 sub-section 元件
//
// 鏡射 impl src/screens/Auth/LoginScreen.tsx：
//   LoginBranding / LoginProviderButtons / LoginFooter
// ─────────────────────────────────────────────────────────────

// ─── LoginBranding ─── 品牌標誌 $wish（flex 2 區域置中）
function LoginBranding() {
  const T = LOGIN_SCREEN_TOKENS;
  return (
    <div style={{
      flex: 2,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      paddingTop: T.BRANDING_PADDING_TOP,
    }}>
      <div style={{
        fontSize: T.APP_NAME_FONT_SIZE,
        fontWeight: T.APP_NAME_WEIGHT,
        color: TOKENS.p500,
      }}>$wish</div>
    </div>
  );
}

// ─── LoginProviderButtons ─── 雙門圓形登入鈕並排（Google / Apple，僅 icon 無文字）
// 一門一帳號：兩鈕各自成帳。等徑 BUTTON_DIAMETER、間距 BUTTON_GAP。
// 兩鈕同 primary 圓底：Google 白圓角方塊 'G'、Apple 白 logo，成對稱雙門。
// loading 態（對齊 impl）：被點按鈕內 spinner，兩鈕皆降透明度 disabled。
function LoginProviderButtons({ loading, loadingProvider = 'google' }) {
  const T = LOGIN_SCREEN_TOKENS;
  const circle = {
    display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: TOKENS.p500,
    width: T.BUTTON_DIAMETER, height: T.BUTTON_DIAMETER,
    borderRadius: '50%',
    boxShadow: `0px ${SHADOW_ELEVATION.level1.offsetY}px ${SHADOW_ELEVATION.level1.blur}px rgba(0,0,0,${SHADOW_ELEVATION.level1.opacity})`,
    opacity: loading ? 0.6 : 1,
  };
  return (
    <div style={{
      flex: 1,
      display: 'flex', flexDirection: 'row',
      justifyContent: 'center', alignItems: 'center',
      gap: T.BUTTON_GAP,
      paddingLeft: T.LOGIN_CONTAINER_PADDING_H,
      paddingRight: T.LOGIN_CONTAINER_PADDING_H,
    }}>
      <div style={circle}>
        {loading && loadingProvider === 'google' ? (
          <Spinner size={ICON_SIZE.md} color={TOKENS.surface}/>
        ) : (
          <div style={{
            width: T.BUTTON_ICON_SIZE, height: T.BUTTON_ICON_SIZE,
            borderRadius: T.BUTTON_ICON_RADIUS,
            background: TOKENS.surface,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontSize: T.BUTTON_ICON_TEXT_SIZE,
              fontWeight: TYPOGRAPHY.weight.medium,
              color: TOKENS.p500,
            }}>G</span>
          </div>
        )}
      </div>
      <div style={circle}>
        {loading && loadingProvider === 'apple' ? (
          <Spinner size={ICON_SIZE.md} color={TOKENS.surface}/>
        ) : (
          <Glyph name="apple" size={T.BUTTON_ICON_SIZE} color={TOKENS.surface}/>
        )}
      </div>
    </div>
  );
}

// ─── LoginFooter ─── 條款引導句 + 法律連結 + 版權（column）
// 引導句與連結列上下相連成完整語意：「登入即表示您同意」→「使用條款 · 隱私政策」。
// 連結列本身就是條款語意的後半，不另重複全句。
function LoginFooter() {
  const T = LOGIN_SCREEN_TOKENS;
  return (
    <div style={{
      paddingBottom: T.FOOTER_PADDING_BOTTOM,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: T.FOOTER_GAP,
    }}>
      <div style={{
        fontSize: T.DISCLAIMER_FONT_SIZE,
        color: TOKENS.ink2,
        textAlign: 'center',
        paddingLeft: SPACING.lg, paddingRight: SPACING.lg,
      }}>登入即表示您同意</div>
      {/* legal 連結 ─ 對齊 paywall PaywallBottomLinks：underline、· 分隔、inkTertiary */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: SPACING.sm,
        fontSize: T.LEGAL_SIZE, color: TOKENS.inkTertiary,
      }}>
        <span style={{ textDecoration: 'underline' }}>使用條款</span>
        <span>·</span>
        <span style={{ textDecoration: 'underline' }}>隱私政策</span>
      </div>
      <span style={{
        fontSize: T.FOOTER_FONT_SIZE,
        color: TOKENS.ink2,
      }}>© 2026 $wish. All rights reserved.</span>
    </div>
  );
}

Object.assign(window, { LoginBranding, LoginProviderButtons, LoginFooter });
