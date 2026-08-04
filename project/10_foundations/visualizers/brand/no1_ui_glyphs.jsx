// ─────────────────────────────────────────────────────────────
// Foundations > Brand > UI Glyphs · 品牌資產（UI Glyphs + 品牌標識）
//
// 不包含 phosphor icon library（獨立為 Icon Library group）。本檔聚焦於：
//   - UI Glyphs wall（impl uiGlyphs.ts 白名單：SF / FA / MCI）
//   - 品牌標識（GlassView 風格 logo / pill）
// ─────────────────────────────────────────────────────────────

function UIGlyphWallCard() {
  // 仲裁端：impl src/constants/uiGlyphs.ts。本清單以 impl UI_MCI + UI_FA + SF Symbol
  // 三組白名單為權威；impl 端各 screen 不得直接寫字串 literal，必須引用常數。
  const uiIcons = [
    // SF Symbol
    { name: 'line.3.horizontal.decrease', lib: 'SF' },
    { name: 'magnifyingglass',            lib: 'SF' },
    { name: 'gearshape',                  lib: 'SF' },
    { name: 'arrow.triangle.merge',       lib: 'SF' },
    { name: 'xmark',                      lib: 'SF' },
    { name: 'checkmark',                  lib: 'SF' },
    { name: 'chevron.right',              lib: 'SF' },
    // FA（UI_FA, 9 個）
    { name: 'calendar',                   lib: 'FA' },
    { name: 'check',                      lib: 'FA' },
    { name: 'check-circle',               lib: 'FA' },
    { name: 'chevron-left',               lib: 'FA' },
    { name: 'chevron-right',              lib: 'FA' },
    { name: 'exchange',                   lib: 'FA' },
    { name: 'minus',                      lib: 'FA' },
    { name: 'plus',                       lib: 'FA' },
    { name: 'times',                      lib: 'FA' },
    // MCI（UI_MCI, 31 個）
    { name: 'alert-circle',               lib: 'MCI' },
    { name: 'alert-circle-outline',       lib: 'MCI' },
    { name: 'alert-outline',              lib: 'MCI' },
    { name: 'arrow-right',                lib: 'MCI' },
    { name: 'backspace-outline',          lib: 'MCI' },
    { name: 'bank-outline',               lib: 'MCI' },
    { name: 'bank-transfer',              lib: 'MCI' },
    { name: 'bug-outline',                lib: 'MCI' },
    { name: 'calendar-blank-outline',     lib: 'MCI' },
    { name: 'calendar-clock',             lib: 'MCI' },
    { name: 'chevron-down',               lib: 'MCI' },
    { name: 'chevron-up',                 lib: 'MCI' },
    { name: 'clock-outline',              lib: 'MCI' },
    { name: 'close',                      lib: 'MCI' },
    { name: 'cog-outline',                lib: 'MCI' },
    { name: 'database-cog-outline',       lib: 'MCI' },
    { name: 'database-plus-outline',      lib: 'MCI' },
    { name: 'database-remove-outline',    lib: 'MCI' },
    { name: 'download',                   lib: 'MCI' },
    { name: 'file-document-outline',      lib: 'MCI' },
    { name: 'file-export-outline',        lib: 'MCI' },
    { name: 'file-import-outline',        lib: 'MCI' },
    { name: 'help-circle-outline',        lib: 'MCI' },
    { name: 'magnify',                    lib: 'MCI' },
    { name: 'plus',                       lib: 'MCI' },
    { name: 'repeat',                     lib: 'MCI' },
    { name: 'shield-account-outline',     lib: 'MCI' },
    { name: 'star-outline',               lib: 'MCI' },
    { name: 'swap-horizontal',            lib: 'MCI' },
    { name: 'tag-outline',                lib: 'MCI' },
    { name: 'trash-can-outline',          lib: 'MCI' },
  ];
  return (
    <FoundCard>
      <FoundLabel>UI Glyphs · impl 白名單（SF / FA / MCI，清單以 impl uiGlyphs.ts 為準）</FoundLabel>
      <div style={{ fontSize: 11, color: TOKENS.ink3, marginBottom: 12 }}>
        仲裁端：impl <code>src/constants/uiGlyphs.ts</code>（UI_MCI、UI_FA）。
        Glyph 渲染為 design canvas best-effort 替身，真實視覺以 impl runtime 為準。
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, paddingTop: 8 }}>
        {uiIcons.map(g => (
          <div key={`${g.lib}-${g.name}`} style={{
            padding: '12px 6px', borderRadius: 8,
            background: TOKENS.surface2,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          }}>
            <Glyph name={g.name} size={22} color={TOKENS.ink} stroke={1.8}/>
            <code style={{ fontSize: 9.5, color: TOKENS.ink2, textAlign: 'center', wordBreak: 'break-word' }}>{g.name}</code>
            <code style={{ fontSize: 8, color: TOKENS.ink3 }}>{g.lib}</code>
          </div>
        ))}
      </div>
    </FoundCard>
  );
}

function FoundationsBrandUIGlyphsSection() {
  return (
    <DCSection
      id="found-brand-ui-glyphs"
      title="Brand · UI Glyphs"
      subtitle="品牌資產：UI Glyphs 白名單與品牌標識。Phosphor icon library 已獨立為 Icon Library group。"
    >
      <DCFamily id="brand-ui-glyphs-family" title="UI Glyph Whitelist" subtitle="impl src/constants/uiGlyphs.ts 三組白名單：SF 7 / FA 9 / MCI 31，共 47 個。">
        <DCArtboard id="icon-ui" label="UI 元素 · MCI / FontAwesome / SF Symbols (impl 白名單)" width={520} height={1100}>
          <UIGlyphWallCard/>
        </DCArtboard>
      </DCFamily>
    </DCSection>
  );
}

Object.assign(window, { UIGlyphWallCard, FoundationsBrandUIGlyphsSection });
