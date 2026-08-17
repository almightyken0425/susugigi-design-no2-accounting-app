// ─────────────────────────────────────────────────────────────
// HomeFilterScreen · 對齊 impl src/screens/Home/HomeFilterScreen.tsx
//
// Modal screen。Tile row 切換時間粒度 / 分組方式，下方為跨幣別帳戶多選。
// draftFilterState 是進入畫面時複製的草稿。畫面內操作只改草稿。
// Header 的 X 丟棄草稿。Header 的 checkmark 才一次套用到 Home。
// 帳戶不分群，全部依 ACCOUNTS 順序連續排成 2 欄 grid（flex-wrap），尾端落單卡靠左。
// 最後一張被選中時 disable 該 card，避免清空選擇集合。
//
// Variants：
//   default      — 有帳戶可選
//   no-accounts  — 無可用帳戶，account 區塊空白
// ─────────────────────────────────────────────────────────────

function HomeFilterScreen({ draftFilterState, setDraftFilterState, variant = 'default' }) {
  const T = HOME_FILTER_SCREEN_TOKENS;
  const { selectedAccountIds } = draftFilterState;
  const noAccounts = variant === 'no-accounts';

  const toggleAcc = (id) => setDraftFilterState(s => {
    const has = s.selectedAccountIds.includes(id);
    if (has && s.selectedAccountIds.length === 1) return s;
    return {
      ...s,
      selectedAccountIds: has ? s.selectedAccountIds.filter(x => x !== id) : [...s.selectedAccountIds, id],
    };
  });

  // 不分群：所有帳戶依 ACCOUNTS 出現順序連續排列
  const accounts = noAccounts ? [] : ACCOUNTS;

  // 2-up card width 算式：(canvas width - 兩側 padding - 中間 gap) / 2
  const cardWidth = (T.DESIGN_CANVAS_WIDTH - T.SCREEN_PADDING * 2 - T.ACCOUNT_CARD_INTRA_GAP) / 2;

  return (
    <div style={{
      padding: T.SCREEN_PADDING,
      background: TOKENS.bg,
      minHeight: '100%',
    }}>
      <FilterTileRow filterState={draftFilterState} setFilterState={setDraftFilterState}/>

      <AccountGrid
        accounts={accounts}
        selectedAccountIds={selectedAccountIds}
        cardWidth={cardWidth}
        onToggle={toggleAcc}/>
    </div>
  );
}

Object.assign(window, { HomeFilterScreen });
