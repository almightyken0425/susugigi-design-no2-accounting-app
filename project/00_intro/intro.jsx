// ─────────────────────────────────────────────────────────────
// Intro · 設計工作台使用說明
// 這個 tab 不是設計稿，是這份檔案的「目錄 + 操作手冊」。
//
// 預期讀者：第一次打開這份檔案的設計師 / 工程師 / PM。
//
// 本檔承載的核心模型：
//   Design git 是設計標準的「仲裁端」。
//   任一端（impl 開發 / Design 探索 / Spec 邏輯）都可以觸發變動，
//   但 token / 元件 / 畫面的最終決議寫進這份 Design git，
//   再由 spec 與 impl 跟隨。觸發雙向，決議上游。
// ─────────────────────────────────────────────────────────────

function IntroSection() {
  return (
    <DCSection id="intro" title="SuSuGiGi · 設計工作台" subtitle="一份會持續迭代的設計檔案。本分頁是它的使用說明書。">

      {/* 1. 這份檔案在幹嘛 ─────────────────────────────────────── */}
      <DCArtboard id="purpose" label="這份檔案在幹嘛" width={520} height={680}>
        <IntroCard>
          <IntroTag>用途</IntroTag>
          <IntroTitle>SuSuGiGi 的設計工作台</IntroTitle>
          <IntroBody>
            <p>這是一份「<b>會持續迭代</b>」的設計檔案，不是某個版本的快照。它在三件事上替你保留現場：</p>
            <ol>
              <li><b>正式設計稿</b> — 對齊 spec / impl 的所有畫面樣貌</li>
              <li><b>設計基礎</b> — token、icon、element 等可重用樣本（以 Apple HIG / iOS Dynamic Type 為錨點）</li>
              <li><b>探索素材</b> — 多版本提案的並陳空間（不刪歷史）</li>
            </ol>
            <p>這份檔案位於 SuSuGiGi 產品的 <code>no4_product_designs/no2_accounting_app/</code>，是該 module 的 <b>Module Design git</b>。它與 Module Spec git、Module Impl git 並列為三件套，並擔任 <b>設計標準的仲裁端</b>：所有 token / 元件 / 畫面的決議寫在這裡，spec 與 impl 跟著對齊。</p>
          </IntroBody>
        </IntroCard>
      </DCArtboard>

      {/* 2. 4 個頂層分頁的地圖 ─────────────────────────────────── */}
      <DCArtboard id="tabs" label="4 個頂層分頁的地圖" width={520} height={680}>
        <IntroCard>
          <IntroTag>分頁地圖</IntroTag>
          <IntroTitle>4 個頂層分頁、每個回答一個問題</IntroTitle>
          <IntroBody>
            <TabRow no="00" name="Intro" q="這份檔案是什麼？怎麼用？" dir="00_intro/"/>
            <TabRow no="10" name="Foundations" q="顏色、字體、間距、圓角、陰影、動畫的標準值是什麼？" dir="10_foundations/"/>
            <TabRow no="30" name="Screens" q="每個畫面長什麼樣？空 / 載入 / 錯誤狀態？" dir="30_screens/"/>
            <TabRow no="50" name="Explorations" q="這個設計問題我想了好幾種做法。" dir="50_explorations/"/>
            <p style={{ fontSize: 13, color: TOKENS.ink2, lineHeight: 1.6, marginTop: 16 }}>
              注意：<b>Components 不是頂層分頁</b>，已併入 Foundations 作為其中一個 group（List / Form / Navigation / Chart / Input 共 5 leaf）。<code>20_components/</code> 目錄仍存在，承載元件實作；元件 showcase 由 Foundations · Components group 各 leaf 分頁渲染。對應的 token 表（LIST_TOKENS / FORM_PICKER_TOKENS 等）位於 Foundations · Component Tokens group。
            </p>
          </IntroBody>
        </IntroCard>
      </DCArtboard>

      {/* 3. 各分頁的內部結構 ───────────────────────────────────── */}
      <DCArtboard id="page-anatomy" label="各分頁的內部結構" width={520} height={760}>
        <IntroCard>
          <IntroTag>分頁解剖</IntroTag>
          <IntroTitle>每個分頁底下還有什麼</IntroTitle>
          <IntroBody>
            <SectionLabel>Foundations · 5 個 group（清單以 app.jsx 的 FOUNDATIONS_GROUPS 為準）</SectionLabel>
            <AnatomyRow name="Atomic" desc="Type / Colors / Layout / Platform——字體、色彩主題、間距圓角動畫、平台固定值"/>
            <AnatomyRow name="Component Tokens" desc="元件級 token，一元件一檔（10_foundations/component_tokens/），與 visualizers 一對一"/>
            <AnatomyRow name="Components" desc="由 components_showcase.jsx 引用 20_components/components.jsx 的元件展示。5 個 family（List / Form / Navigation / Chart / Input），每個 family 內元件與對應 token 表緊鄰擺放"/>
            <AnatomyRow name="Brand" desc="品牌資產：UI glyphs / app icon / logo"/>
            <AnatomyRow name="Icon Library" desc="phosphor icon 全集檢索"/>

            <SectionLabel>Screens · 26 個畫面群組</SectionLabel>
            <AnatomyRow name="Home / Filter / Search" desc="主畫面 + 篩選 modal + 搜尋（4 狀態）"/>
            <AnatomyRow name="Transaction / Transfer" desc="記支出 / 收入 / 轉帳編輯器（含驗證錯誤狀態）"/>
            <AnatomyRow name="Login / Paywall" desc="登入（2 狀態）/ 訂閱頁（2 狀態）"/>
            <AnatomyRow name="Settings / Preference" desc="設定總頁 + 偏好設定總頁"/>
            <AnatomyRow name="Accounts / Categories" desc="列表 + 編輯器（新增 / 編輯模式）"/>
            <AnatomyRow name="Theme / Language / TimeZone / LaunchMode" desc="偏好設定子頁"/>
            <AnatomyRow name="Base Currency / Currency List / Rate List" desc="貨幣與匯率管理"/>
            <AnatomyRow name="Data Management / Debug" desc="資料管理 + 除錯資訊"/>

            <SectionLabel>Explorations · 多版本提案主題</SectionLabel>
            <AnatomyRow name="主題清單" desc="以 90_workbench/app.jsx 的 EXPLORATION_GROUPS 與 50_explorations/ 磁碟目錄為準"/>
            <AnatomyRow name="決策狀態" desc="[Current] / Open question / Explored / Superseded 標在各 artboard label，口味換了改狀態不刪歷史"/>
          </IntroBody>
        </IntroCard>
      </DCArtboard>

      {/* 4. 何時要動哪個分頁 ───────────────────────────────────── */}
      <DCArtboard id="how-to-iterate" label="何時要動哪個分頁的 SOP" width={520} height={760}>
        <IntroCard>
          <IntroTag>迭代 SOP</IntroTag>
          <IntroTitle>來源 → Design 仲裁 → 跟進</IntroTitle>
          <IntroBody>
            <p style={{ fontSize: 13, color: TOKENS.ink2, lineHeight: 1.6, marginBottom: 16 }}>
              變動的觸發可來自任一端：impl 開發中發現問題、Design 探索新方向、Spec 邏輯需要新狀態。但無論觸發源在哪，<b>token / 元件 / 畫面的最終決議寫進這份 Design git</b>，再由 spec 與 impl 跟隨。
            </p>

            <FlowRow
              source="觸發：impl 開發時某個字太小、圓角不對、動畫太快"
              arbitrate="Design 仲裁：改 10_foundations/ atomic 層對應檔（no3_typography.jsx 改 TYPE_STYLES / no4_layout_tokens.jsx 改 RADIUS / MOTION）"
              follow="跟進：impl 同步改 src/constants/theme.ts；spec 通常不影響"/>
            <FlowRow
              source="觸發：Design 探索想換配色 / 換字級 / 換 icon 風格"
              arbitrate="Design 仲裁：先在 50_explorations/ 開主題比較，[Current] 確認後改 10_foundations/no1_atomic_tokens.jsx 或 no3_typography.jsx"
              follow="跟進：impl 同步 src/constants/theme.ts；元件視覺 src/components/**"/>
            <FlowRow
              source="觸發：Spec 邏輯需要新狀態（例如新增 loading 變體）"
              arbitrate="Design 仲裁：在 30_screens/ 對應 screen 子目錄的 entry 加新 variant 分支，並於 90_workbench/app.jsx 的 SCREEN_META + SCREEN_GROUPS 補入口"
              follow="跟進：spec 在 no3_product_specs/.../no2_screens/ 對應 md 補狀態；impl 跟著加 variant 實作"/>
            <FlowRow
              source="觸發：impl 新增整個畫面"
              arbitrate="Design 仲裁：30_screens/ 新增 noN_<name>_screen/ 子目錄（tokens + subsections + entry）、susugigi.html 加載入、SCREEN_META 加 meta、SCREEN_GROUPS 加群組"
              follow="跟進：spec 新增 noN_<name>_screen.md；impl 完成 src/screens/<Name>/"/>
            <FlowRow
              source="觸發：想新增可重用元件"
              arbitrate="Design 仲裁：加進 20_components/components.jsx；showcase 由 Foundations · Components group 對應 leaf 自動引用"
              follow="跟進：impl 同步 src/components/**；spec 在引用該元件的 screen 規格更新"/>
            <FlowRow
              source="觸發：某個設計問題想試多種做法"
              arbitrate="Design 仲裁：複製任一現有主題目錄，重命名 slug，敘述寫在 variants.jsx 的 IntroBlock；在 90_workbench/app.jsx 的 EXPLORATION_GROUPS 接 router"
              follow="跟進：Explorations 完全隔離，不牽動 spec 與 impl"/>
            <FlowRow
              source="觸發：某個提案要被淘汰"
              arbitrate="不刪歷史，改該 artboard 的 label：移除 [Current] 改成 Superseded by X · YYYY-MM-DD，新提案標上 [Current]"
              follow="—"/>
          </IntroBody>
        </IntroCard>
      </DCArtboard>

      {/* 5. 決策狀態用語 ───────────────────────────────────────── */}
      <DCArtboard id="status-vocab" label="決策狀態用語" width={520} height={680}>
        <IntroCard>
          <IntroTag>狀態詞彙</IntroTag>
          <IntroTitle>取代 FINAL，因為沒有真正的 FINAL</IntroTitle>
          <IntroBody>
            <StatusRow tag="[Current]" body="目前傾向採用。後綴 · YYYY-MM-DD 表示最後變動日期。"/>
            <StatusRow tag="Open question" body="這個問題還沒決定。"/>
            <StatusRow tag="Explored" body="看過、沒採用、保留參考，作為下一輪判斷素材。"/>
            <StatusRow tag="Superseded by V9 · YYYY-MM-DD" body="被某版本取代。"/>
            <StatusRow tag="Deprecated" body="完全淘汰。"/>
            <hr style={{ border: 'none', borderTop: `1px dashed ${TOKENS.divider}`, margin: '16px 0' }}/>
            <p style={{ fontSize: 13, color: TOKENS.ink2, lineHeight: 1.6 }}>口味換了就改日期、改狀態，不要刪歷史。歷史是判斷下一輪方向的素材。</p>
          </IntroBody>
        </IntroCard>
      </DCArtboard>

      {/* 6. 觸發-仲裁-跟進的流向 ───────────────────────────────── */}
      <DCArtboard id="cross-git-sync" label="觸發-仲裁-跟進的流向" width={520} height={720}>
        <IntroCard>
          <IntroTag>跨 git 同步</IntroTag>
          <IntroTitle>改 susugigi.html 時必走的下游清單</IntroTitle>
          <IntroBody>
            <p style={{ fontSize: 13, color: TOKENS.ink2, lineHeight: 1.6, marginBottom: 12 }}>
              觸發可雙向，但決議都寫進 Design git。下表列出在 Design 仲裁完成後，哪些下游檔案需要跟進。權威來源以 <code>~/.claude/skills/decision_framework_router/products_registry.md</code> 的 sub_mapping 為準，本表為人類閱讀方便的 mirror。
            </p>
            <SyncRow page="Intro" spec="—" impl="—" doc="本檔 + Design CLAUDE.md + products_registry.md"/>
            <SyncRow page="Foundations" spec="—" impl="src/constants/theme.ts" doc="—"/>
            <SyncRow page="Components" spec="no2_screens/*.md（引用該元件處）" impl="src/components/**" doc="—"/>
            <SyncRow page="Screens" spec="no2_screens/noN_<name>_screen.md" impl="src/screens/<Name>/" doc="—"/>
            <SyncRow page="Explorations" spec="—" impl="—" doc="—（完全隔離）"/>
            <hr style={{ border: 'none', borderTop: `1px dashed ${TOKENS.divider}`, margin: '16px 0' }}/>
            <p style={{ fontSize: 12, color: TOKENS.ink3, lineHeight: 1.5 }}>
              另外，data model 與 logic 的決議仲裁端是 Spec git（不經 Design），sub_mapping 標 <code>arbiter: spec</code>。
            </p>
          </IntroBody>
        </IntroCard>
      </DCArtboard>

      {/* 7. 畫布操作 ───────────────────────────────────────────── */}
      <DCArtboard id="canvas-controls" label="畫布操作" width={520} height={680}>
        <IntroCard>
          <IntroTag>操作</IntroTag>
          <IntroTitle>這個畫布像 Figma 一樣可以平移、縮放、重排</IntroTitle>
          <IntroBody>
            <KeyRow keys="二指滑動" do="平移畫布"/>
            <KeyRow keys="二指捏合 / Ctrl+滾輪" do="縮放畫布"/>
            <KeyRow keys="滾輪" do="縮放（中鍵 drag 平移）"/>
            <KeyRow keys="左鍵 drag 畫布空白處" do="平移"/>
            <KeyRow keys="點 artboard 左上「六點」grip + drag" do="重排同一 section 內的 artboards"/>
            <KeyRow keys="點 artboard label / 右上箭頭" do="進入 focus mode 大畫面"/>
            <KeyRow keys="focus mode 內 ← / →" do="前後 artboard；↑↓ 跨 section"/>
            <KeyRow keys="Esc / 點背景" do="退出 focus mode"/>
            <hr style={{ border: 'none', borderTop: `1px dashed ${TOKENS.divider}`, margin: '16px 0' }}/>
            <p style={{ fontSize: 13, color: TOKENS.ink2, lineHeight: 1.6 }}>畫布上的 artboard 順序、自訂的 section 標題、artboard rename 都會自動存到 <code>.design-canvas.state.json</code>，下次打開就是上次排好的樣子。</p>
          </IntroBody>
        </IntroCard>
      </DCArtboard>

      {/* 8. 目錄結構速查 ───────────────────────────────────────── */}
      <DCArtboard id="file-map" label="目錄結構速查" width={520} height={720}>
        <IntroCard>
          <IntroTag>檔案系統</IntroTag>
          <IntroTitle>數字前綴 = 顯示順序 = 概念順序</IntroTitle>
          <IntroBody>
            <pre style={fileTreeStyle}>{`project/
├── susugigi.html                  主入口
├── 00_intro/intro.jsx             這個分頁的內容
├── 10_foundations/                設計標準權威
│   ├── no1_atomic_tokens.jsx      PALETTE / THEMES / GLASS_BASE / SHADOW_ELEVATION / SCRIM_LEVELS
│   ├── no2_canvas_tokens.jsx      TOKENS / CHART_COLORS（canvas 渲染快照）
│   ├── no3_typography.jsx         TYPOGRAPHY / TYPE_STYLES / LINE_HEIGHT / LETTER_SPACING
│   ├── no4_layout_tokens.jsx      SPACING / RADIUS / SHADOW / MOTION / ICON_SIZE / HIT_TARGET / ROW_HEIGHT
│   ├── no5_platform_tokens.jsx    IOS_SYSTEM_COLOR / ACTION_ICON_MAP
│   ├── no6_icon_library.jsx       phosphor SVG 全集
│   ├── component_tokens/          元件級 token（一元件一檔，引用 atomic 層；清單以磁碟為準）
│   └── visualizers/               Foundations TOC group 視覺化卡片
│       ├── no0_shared_card_kit    共用 UI primitives
│       └── atomic/ component_tokens/ brand/ icon_library/  對應 TOC 同名 group，一 leaf 一檔
├── 15_fixtures/                   Mock 資料 + canvas helpers（不對齊 spec / impl）
│   └── no1-no4                    categories / accounts / transactions / helpers
├── 20_components/
│   ├── components.jsx             元件實作
│   └── components_showcase.jsx    Foundations · Components group 的 Section 內容
├── 30_screens/                    26 個 noN_<name>_screen/ 子目錄 + shared/
├── 50_explorations/               各主題子目錄（清單以磁碟與 app.jsx 的 EXPLORATION_GROUPS 為準）
├── 90_workbench/
│   ├── app.jsx                    ViewTabs router + SCREEN_META + ScreenFrame + SideTOC（三層）
│   ├── design_canvas.jsx          DesignCanvas / DCSection / DCArtboard
│   └── ios_frame.jsx              IOSDevice 邊框
└── 99_deprecated/                 已淘汰`}</pre>
            <p style={{ fontSize: 13, color: TOKENS.ink2, lineHeight: 1.6, marginTop: 12 }}>
              數字前綴 <code>00 / 10 / 20 / 30 / 50 / 90 / 99</code> 保證檔案系統內的顯示順序與概念順序一致。新增分頁挑空著的 10 倍數段落即可（40 / 60 / 70 / 80 目前空著）。
            </p>
            <p style={{ fontSize: 13, color: TOKENS.ink2, lineHeight: 1.6, marginTop: 8 }}>
              新增 exploration 主題時，<b>複製任一現有主題目錄</b>為範本，重命名 slug，敘述寫在 variants.jsx 的 IntroBlock，不需要 README.md。
            </p>
          </IntroBody>
        </IntroCard>
      </DCArtboard>

      {/* 9. Design 是仲裁端 ───────────────────────────────────── */}
      <DCArtboard id="design-as-arbiter" label="Design 在多層 git 中的角色" width={520} height={720}>
        <IntroCard>
          <IntroTag>仲裁模型</IntroTag>
          <IntroTitle>Design 是設計標準的仲裁端</IntroTitle>
          <IntroBody>
            <p><b>觸發可來自任一端：</b></p>
            <ul>
              <li>impl 開發中發現某個字太小、某個 token 用起來不對</li>
              <li>Design 探索時想換配色 / 換字級 / 換動畫</li>
              <li>Spec 邏輯需要新狀態（例如要多一個 loading 變體）</li>
            </ul>
            <p style={{ marginTop: 12 }}><b>但決議都寫進 Design git：</b></p>
            <ul>
              <li>token 的最終值寫在 <code>10_foundations/</code>（atomic 層 noN_*.jsx 與 component_tokens/）</li>
              <li>元件的最終形狀寫在 <code>20_components/components.jsx</code></li>
              <li>畫面的最終樣貌寫在 <code>30_screens/</code> 各 screen 子目錄</li>
            </ul>
            <p style={{ marginTop: 12 }}><b>下游跟隨：</b></p>
            <ul>
              <li><b>impl repo：</b><code>no5_product_development/no2_accounting_app/</code> 跟著 <code>src/constants/theme.ts</code> / <code>src/components/</code> / <code>src/screens/</code> 對齊</li>
              <li><b>spec repo：</b><code>no3_product_specs/no2_accounting_app/</code> 跟著 <code>no2_screens/</code> 與引用元件的規格對齊</li>
            </ul>
            <hr style={{ border: 'none', borderTop: `1px dashed ${TOKENS.divider}`, margin: '16px 0' }}/>
            <p style={{ fontSize: 13, color: TOKENS.ink2, lineHeight: 1.6 }}>
              data model 與 logic 的仲裁端不在 Design，在 Spec git（標 <code>arbiter: spec</code>）。Design git 只仲裁視覺與互動。
            </p>
          </IntroBody>
        </IntroCard>
      </DCArtboard>

    </DCSection>
  );
}

// ─── 小元件 ───────────────────────────────────────────────────
function IntroCard({ children }) {
  return (
    <div style={{
      width: '100%', height: '100%', padding: '36px 36px',
      background: '#fff',
      fontFamily: '-apple-system, "SF Pro Text", "PingFang TC", "Noto Sans TC", system-ui, sans-serif',
      color: TOKENS.ink, overflow: 'auto',
    }}>{children}</div>
  );
}
function IntroTag({ children }) {
  return <div style={{
    fontSize: 11, fontWeight: 600, letterSpacing: 1.2, color: TOKENS.p500,
    textTransform: 'uppercase', marginBottom: 8,
  }}>{children}</div>;
}
function IntroTitle({ children }) {
  return <h2 style={{
    fontSize: 22, fontWeight: 600, margin: '0 0 20px',
    color: TOKENS.ink, letterSpacing: -0.3,
  }}>{children}</h2>;
}
function IntroBody({ children }) {
  return <div style={{ fontSize: 14, lineHeight: 1.6, color: TOKENS.ink }}>{children}</div>;
}
function SectionLabel({ children }) {
  return <div style={{
    fontSize: 11, fontWeight: 600, color: TOKENS.ink3, letterSpacing: 0.5,
    textTransform: 'uppercase', marginTop: 16, marginBottom: 4,
  }}>{children}</div>;
}

function TabRow({ no, name, q, dir }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '10px 0', borderTop: `1px solid ${TOKENS.hairline}` }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: TOKENS.ink3, fontVariantNumeric: 'tabular-nums', width: 22 }}>{no}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: TOKENS.ink, width: 110 }}>{name}</div>
      <div style={{ flex: 1, fontSize: 13, color: TOKENS.ink2, lineHeight: 1.5 }}>
        {q}
        <code style={{ display: 'block', marginTop: 2, fontSize: 11, color: TOKENS.ink3 }}>{dir}</code>
      </div>
    </div>
  );
}

function AnatomyRow({ name, desc }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '6px 0', borderTop: `1px solid ${TOKENS.hairline}` }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: TOKENS.ink, width: 200, flexShrink: 0 }}>{name}</div>
      <div style={{ flex: 1, fontSize: 12, color: TOKENS.ink2, lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}

function FlowRow({ source, arbitrate, follow }) {
  return (
    <div style={{ padding: '12px 0', borderTop: `1px solid ${TOKENS.hairline}` }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: TOKENS.ink, marginBottom: 4 }}>{source}</div>
      <div style={{ fontSize: 12, color: TOKENS.ink2, lineHeight: 1.5, paddingLeft: 12 }}>→ <b>仲裁：</b>{arbitrate}</div>
      <div style={{ fontSize: 12, color: TOKENS.ink2, lineHeight: 1.5, paddingLeft: 12 }}>→ <b>跟進：</b>{follow}</div>
    </div>
  );
}

function SyncRow({ page, spec, impl, doc }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 0', borderTop: `1px solid ${TOKENS.hairline}`, fontSize: 12, lineHeight: 1.5 }}>
      <div style={{ width: 90, fontWeight: 600, color: TOKENS.ink, flexShrink: 0 }}>{page}</div>
      <div style={{ flex: 1, color: TOKENS.ink2 }}>
        <div><b style={{ color: TOKENS.ink3 }}>spec:</b> {spec}</div>
        <div><b style={{ color: TOKENS.ink3 }}>impl:</b> {impl}</div>
        <div><b style={{ color: TOKENS.ink3 }}>doc:</b> {doc}</div>
      </div>
    </div>
  );
}

function StatusRow({ tag, body }) {
  return (
    <div style={{ padding: '10px 0', borderTop: `1px solid ${TOKENS.hairline}` }}>
      <code style={{
        display: 'inline-block', padding: '2px 8px', borderRadius: 4,
        background: TOKENS.p50, color: TOKENS.p500, fontSize: 12, fontWeight: 500,
        marginBottom: 4,
      }}>{tag}</code>
      <div style={{ fontSize: 13, color: TOKENS.ink2, lineHeight: 1.5 }}>{body}</div>
    </div>
  );
}

function KeyRow({ keys, do: doStr }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '8px 0', borderTop: `1px solid ${TOKENS.hairline}` }}>
      <code style={{
        padding: '3px 8px', borderRadius: 5,
        background: TOKENS.surface2, color: TOKENS.ink,
        fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap',
      }}>{keys}</code>
      <div style={{ flex: 1, fontSize: 13, color: TOKENS.ink2, lineHeight: 1.5 }}>{doStr}</div>
    </div>
  );
}

const fileTreeStyle = {
  fontFamily: '"SF Mono", "Menlo", "Consolas", monospace',
  fontSize: 11.5, lineHeight: 1.55, color: TOKENS.ink,
  background: TOKENS.surface2, padding: '14px 16px', borderRadius: 8,
  margin: 0, whiteSpace: 'pre',
};

Object.assign(window, { IntroSection });
