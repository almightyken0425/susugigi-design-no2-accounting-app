// ─────────────────────────────────────────────────────────────
// Foundations > Brand > Brand Logo · 無底三線標誌（定案 G4 的 mark-only 版）
//
// 與 app icon（no2_app_icon.jsx 的 APP_ICON_G4）同一套幾何、拿掉底圖，
// 只剩三條微弧與條內漸層，透明底。用在 app 內品牌出現點：
//   1. Launch screen（iOS storyboard imageView、LaunchLogo imageset）
//   2. 離線重試頁品牌區（OfflineRetryScreen、104×96pt）
// Home header 維持 $wish 文字標題（2026-07-07 使用者定案；曾試 logo、
// 視覺不合退回。另 iOS 26 + Fabric 自訂 headerTitle 元件有上游 bug）。
// 保持文字的地方：icon 下方 app 名、版權行、匯出檔名（見 brand.md App icon 節）。
//
// viewBox 緊裁 13.5 16.3 73 67.5（mark 外擴 stroke 半徑 + 1 padding）、
// 幾何數字與資產產生器一致、勿目測改值。
// ─────────────────────────────────────────────────────────────

const BRAND_LOGO = {
  viewBox: '13.5 16.3 73 67.5',
  aspect: 73 / 67.5,
  paths: [
    'M 27.55,52.19 Q 56.49,39.52 81.93,20.79',
    'M 21.81,65.57 Q 48.27,55.70 71.48,39.62',
    'M 18.07,79.21 Q 41.30,70.94 61.27,56.47',
  ],
  grad: { x1: 27.55, y1: 52.19, x2: 81.93, y2: 20.79 },
  strokeWidth: 7,
  ink: '#4323A0',
};

function WishLogoMark({ height = 28, inline = false }) {
  const g = BRAND_LOGO;
  const gid = 'brandLogoFade';
  return (
    <svg viewBox={g.viewBox} style={{ height, width: height * g.aspect, display: inline ? 'inline-block' : 'block', verticalAlign: 'middle' }}>
      <defs>
        <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1={g.grad.x1} y1={g.grad.y1} x2={g.grad.x2} y2={g.grad.y2}>
          <stop offset="0" stopColor={g.ink} stopOpacity="0.15"/>
          <stop offset="1" stopColor={g.ink} stopOpacity="1"/>
        </linearGradient>
      </defs>
      {g.paths.map(d => (
        <path key={d} d={d} stroke={`url(#${gid})`} strokeWidth={g.strokeWidth} strokeLinecap="round" fill="none"/>
      ))}
    </svg>
  );
}

function FoundationsBrandLogoSection() {
  return (
    <DCSection id="foundations-brand-logo"
      title="Brand · Brand Logo（無底三線）"
      subtitle="App icon 定案 G4 的 mark-only 版、透明底。app 內兩個品牌出現點：launch screen、登入頁。home header 維持 $wish 文字（定案見檔頭註記）。仲裁端：本檔 BRAND_LOGO 常數；跟進端：impl assets/images/brand 與 LaunchLogo imageset。">
      <DCArtboard id="brand-logo-usage" label="兩個使用點 · 尺寸對照" width={560} height={300}>
        <div style={{ width: '100%', height: '100%', background: '#FFFFFF', padding: 18, display: 'flex', gap: 28, alignItems: 'flex-end', fontFamily: '-apple-system, "PingFang TC", sans-serif' }}>
          {[[96, '登入頁 104×96pt'], [56, 'launch 140×129pt 縮樣']].map(([h, label]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <div style={{ background: '#F2F2F7', padding: 14, borderRadius: 12, border: '1px solid rgba(60,60,67,0.12)' }}>
                <WishLogoMark height={h}/>
              </div>
              <div style={{ fontSize: 10, color: '#8e8e93' }}>{label}</div>
            </div>
          ))}
        </div>
      </DCArtboard>

    </DCSection>
  );
}

Object.assign(window, { FoundationsBrandLogoSection, WishLogoMark, BRAND_LOGO });
