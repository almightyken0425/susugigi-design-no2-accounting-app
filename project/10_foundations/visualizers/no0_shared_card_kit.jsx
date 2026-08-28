// ─────────────────────────────────────────────────────────────
// Shared card kit · 共用視覺化原語
//
// 給所有 visualizers 與 components_showcase 共用的卡片底層元件。
// 此檔不定義任何 token；僅提供 layout 元件與 TokenTableCard 渲染器。
// ─────────────────────────────────────────────────────────────

function FoundCard({ children, style }) {
  return (
    <div style={{
      width: '100%', height: '100%', padding: '24px 24px',
      background: '#fff', overflow: 'auto',
      fontFamily: '-apple-system, "SF Pro Text", "PingFang TC", "Noto Sans TC", system-ui, sans-serif',
      color: TOKENS.ink, ...(style || {}),
    }}>{children}</div>
  );
}

function FoundLabel({ children, style }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, letterSpacing: 1, color: TOKENS.p500,
      textTransform: 'uppercase', marginBottom: 10, ...(style || {}),
    }}>{children}</div>
  );
}

function SectionMini({ children, style }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 600, color: TOKENS.ink3, letterSpacing: 0.5,
      textTransform: 'uppercase', marginTop: 4, marginBottom: 2, ...(style || {}),
    }}>{children}</div>
  );
}

function Swatch({ hex, name, note }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
      <div style={{
        width: 32, height: 32, borderRadius: 6, background: hex,
        border: `1px solid ${TOKENS.hairline}`, flexShrink: 0,
      }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: TOKENS.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
        <div style={{ fontSize: 10, color: TOKENS.ink2, fontVariantNumeric: 'tabular-nums' }}>{hex}{note ? ` · ${note}` : ''}</div>
      </div>
    </div>
  );
}

function AnatomyRuler({ segments }) {
  // segments: [{ width, label, color }]，由左到右串成一條 row 上方的比例尺
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', height: 28, marginBottom: 4 }}>
      {segments.map((s, i) => (
        <div key={i} style={{
          width: s.width,
          background: s.color,
          borderLeft: i === 0 ? 'none' : `1px dashed ${TOKENS.ink3}`,
          borderRight: i === segments.length - 1 ? 'none' : 'none',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          paddingBottom: 2,
        }}>
          <code style={{ fontSize: 8.5, color: TOKENS.ink3, fontVariantNumeric: 'tabular-nums', textAlign: 'center', lineHeight: 1.1 }}>
            {s.label}
          </code>
        </div>
      ))}
    </div>
  );
}

function TokenTableCard({ tokens, title, descriptions, sources }) {
  const entries = Object.entries(tokens);
  const hasDesc = descriptions && Object.keys(descriptions).length > 0;
  const hasSource = sources && Object.keys(sources).length > 0;
  // KEY | (SOURCE) | VALUE | (用途)
  const gridTemplateColumns = [
    '1fr',
    hasSource ? 'auto' : null,
    'auto',
    hasDesc ? '1.6fr' : null,
  ].filter(Boolean).join(' ');
  const headerStyle = { fontSize: 9.5, color: TOKENS.ink3, lineHeight: 1.4, letterSpacing: 0.3 };
  return (
    <FoundCard>
      <FoundLabel>{title}</FoundLabel>
      <div style={{ display: 'grid', gridTemplateColumns, columnGap: 12, rowGap: 4 }}>
        {(hasDesc || hasSource) && (
          <React.Fragment>
            <code style={headerStyle}>KEY</code>
            {hasSource && <code style={headerStyle}>SOURCE</code>}
            <code style={{ ...headerStyle, textAlign: 'right' }}>VALUE</code>
            {hasDesc && <code style={headerStyle}>用途</code>}
          </React.Fragment>
        )}
        {entries.map(([k, v]) => (
          <React.Fragment key={k}>
            <code style={{ fontSize: 11, color: TOKENS.ink, lineHeight: 1.6 }}>{k}</code>
            {hasSource && (
              <code style={{ fontSize: 11, color: TOKENS.ink2, lineHeight: 1.6, whiteSpace: 'nowrap' }}>
                {sources[k] || '—'}
              </code>
            )}
            <code style={{ fontSize: 11, color: TOKENS.ink2, fontVariantNumeric: 'tabular-nums', lineHeight: 1.6, textAlign: 'right', whiteSpace: 'nowrap' }}>
              {typeof v === 'object' ? JSON.stringify(v) : String(v)}
            </code>
            {hasDesc && (
              <span style={{ fontSize: 10.5, color: TOKENS.ink2, lineHeight: 1.5 }}>
                {descriptions[k] || ''}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </FoundCard>
  );
}

Object.assign(window, {
  FoundCard, FoundLabel, SectionMini, Swatch, AnatomyRuler, TokenTableCard,
});
