// ─────────────────────────────────────────────────────────────
// OfflineRetryScreen sub-sections · 私有 sub-section 元件
//
// 鏡射 impl src/screens/Bootstrap/OfflineRetryScreen.tsx：
//   RetryBranding / RetryBody / RetryFooter
// ─────────────────────────────────────────────────────────────

// ─── RetryBranding ─── 品牌 mark（flex 2 區域置中）
// 沿原登入頁品牌區：WishLogoMark 104×96pt（Brand > no3_brand_logo），
// mark 為 runtime 全域元件，render 時已載入、不受 script 順序影響。
function RetryBranding() {
  const T = OFFLINE_RETRY_SCREEN_TOKENS;
  return (
    <div style={{
      flex: 2,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      paddingTop: T.BRANDING_PADDING_TOP,
    }}>
      <WishLogoMark height={T.LOGO_HEIGHT}/>
    </div>
  );
}

// ─── RetryBody ─── 說明文案 + 重試鈕（flex 1）
// 文案依 variant 切換：
//   offline  — 首開需連網說明（初次啟動離線）
//   deletion — 資料清除收尾需連網說明（清除中斷復原未決）
// loading 態（對齊 impl）：鈕內 spinner、降透明度 disabled。
function RetryBody({ variant = 'offline', loading }) {
  const T = OFFLINE_RETRY_SCREEN_TOKENS;
  const message = variant === 'deletion'
    ? '資料清除需要網路連線完成收尾，請連上網路後重試。'
    : '首次啟動需要網路連線完成初始化，之後即可離線使用。';
  return (
    <div style={{
      flex: 1,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      gap: T.MESSAGE_GAP,
      paddingLeft: T.CONTAINER_PADDING_H,
      paddingRight: T.CONTAINER_PADDING_H,
    }}>
      <div style={{
        fontSize: T.MESSAGE_FONT_SIZE,
        color: TOKENS.ink2,
        textAlign: 'center',
      }}>{message}</div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        alignSelf: 'stretch',
        height: T.RETRY_BUTTON_HEIGHT,
        borderRadius: T.RETRY_BUTTON_RADIUS,
        background: TOKENS.p500,
        opacity: loading ? 0.6 : 1,
      }}>
        {loading ? (
          <Spinner size={ICON_SIZE.md} color={TOKENS.surface}/>
        ) : (
          <span style={{
            fontSize: T.RETRY_FONT_SIZE,
            fontWeight: TYPOGRAPHY.weight.semibold,
            color: TOKENS.surface,
          }}>重試</span>
        )}
      </div>
    </div>
  );
}

// ─── RetryFooter ─── 版權
function RetryFooter() {
  const T = OFFLINE_RETRY_SCREEN_TOKENS;
  return (
    <div style={{
      paddingBottom: T.FOOTER_PADDING_BOTTOM,
      display: 'flex', justifyContent: 'center',
    }}>
      <span style={{
        fontSize: T.FOOTER_FONT_SIZE,
        color: TOKENS.ink2,
      }}>© 2026 $wish. All rights reserved.</span>
    </div>
  );
}

Object.assign(window, { RetryBranding, RetryBody, RetryFooter });
