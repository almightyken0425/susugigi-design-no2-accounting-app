// ─────────────────────────────────────────────────────────────
// PeriodPage · 對齊 impl src/screens/Home/PeriodPage.tsx
//
// HomeScreen 的實際內容 host。impl 端是 FlatList horizontal pagingEnabled inverted
// 內的每一頁；design canvas 無真實 swipe，但仍鏡射 shell / page 拆分以利對齊。
//
// 內含：PeriodSwitcher → DonutHero → FocusRow → TxSectionList
// 接收 filterState（用於 groupMode）+ variant + monthLabel。
// 載入順序固定為摘要先行。section header 與圖表先由摘要資料呈現。
// 分組明細只在展開後按頁取得。切換收支時，焦點卡選取與逐筆清單換面
// 在同次互動完成。同一份已載摘要會重用，不重新讀取摘要或分組明細。
//
// Variants：
//   default — 顯示 TX 資料
//   empty   — 無交易紀錄；impl 端對 empty 不換 UI，donut 中央仍是「餘額 / $0」、
//             FocusCard 仍是「$0」，TxSectionList 為空（無任何 section card）
// ─────────────────────────────────────────────────────────────

function PeriodPage({ filterState, variant = 'default', monthLabel = '2026年5月', offset = 0 }) {
  const [chartMode, setChartMode] = React.useState('expense');
  const groupMode = filterState.groupBy;
  // collapsed 初始為空 Set，canvas 上所有分組全展開——僅為展示分組內列結構，
  // 非預設行為定案。實際預設依 spec no2_home_screen「各分組預設為收合狀態」，
  // impl PeriodDataStore 種 isCollapsed: true。
  const [collapsed, setCollapsed] = React.useState(() => new Set());

  const isEmpty = variant === 'empty';
  const dataSource = isEmpty ? [] : TX;
  const totals = periodTotals(dataSource);
  const expensePie = expensePieData(dataSource);
  const incomePie = incomePieData(dataSource);
  const sectionsFor = (mode) => {
    const focusedData = dataSource.filter(t => (
      isTransfer(t) || (mode === 'expense' ? baseAmount(t) < 0 : baseAmount(t) > 0)
    ));
    return groupMode === 'date'
      ? groupByDate(focusedData)
      : groupByCategory(dataSource, mode);
  };
  const sections = sectionsFor(chartMode);

  const selectFocus = (nextMode) => {
    if (nextMode === chartMode) return;
    const nextSections = sectionsFor(nextMode);
    setChartMode(nextMode);
    setCollapsed(new Set(nextSections.map(section => section.id)));
  };

  const toggle = (id) => setCollapsed(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <div style={{
      paddingBottom: HOME_SCREEN_TOKENS.BOTTOM_PADDING_FOR_FAB,
      background: TOKENS.bg,
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'stretch',
        paddingBottom: HOME_SCREEN_TOKENS.PAGE_HEADER_PADDING_BOTTOM,
      }}>
        <PeriodSwitcher label={monthLabel}/>
        <DonutHero expenseData={expensePie} incomeData={incomePie} totals={totals} chartMode={chartMode}/>
        <FocusRow totals={totals} chartMode={chartMode} onChartModeChange={selectFocus}/>
      </div>
      <TxSectionList sections={sections} collapsed={collapsed} onToggle={toggle} mode={groupMode}/>
    </div>
  );
}

Object.assign(window, { PeriodPage });
