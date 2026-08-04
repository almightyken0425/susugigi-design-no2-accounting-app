// ─────────────────────────────────────────────────────────────
// OfflineRetryScreen · 對齊 impl src/screens/Bootstrap/OfflineRetryScreen.tsx
//
// Full-screen entry。app 無帳號 UI，初次啟動自動匿名進場；
// 本頁是唯一攔路畫面：首開離線或資料清除收尾未完時顯示，
// 連網按重試即續走匿名 bootstrap。三段：Branding / Body / Footer。
//
// Variants：
//   default  — 首開離線（offline 文案）
//   deletion — 資料清除收尾未完（deletion 文案）
// ─────────────────────────────────────────────────────────────

function OfflineRetryScreen({ variant = 'default' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%',
      background: TOKENS.bg,
    }}>
      <RetryBranding/>
      <RetryBody variant={variant === 'deletion' ? 'deletion' : 'offline'}/>
      <RetryFooter/>
    </div>
  );
}

Object.assign(window, { OfflineRetryScreen });
