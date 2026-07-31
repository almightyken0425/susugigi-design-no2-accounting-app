// ─────────────────────────────────────────────────────────────
// LoginScreen · 對齊 impl src/screens/Auth/LoginScreen.tsx
//
// Full-screen entry。三段：Branding（App 名稱+ tagline）/ Provider Buttons（Google / Apple 雙門圓鈕）/ Footer（引導句 + 連結 + 版權）。
// impl 端透過 Firebase Auth SSO，一門一帳號；design canvas 為靜態示意。
//
// Variants：
//   default — 登入入口（雙門圓鈕並排，僅 icon、無文字）
//   loading — SSO 進行中（被點按鈕內 spinner、兩鈕降透明度 disabled，對齊 impl loading state）
// ─────────────────────────────────────────────────────────────

function LoginScreen({ variant = 'default' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%',
      background: TOKENS.bg,
    }}>
      <LoginBranding/>
      <LoginProviderButtons loading={variant === 'loading'}/>
      <LoginFooter/>
    </div>
  );
}

Object.assign(window, { LoginScreen });
