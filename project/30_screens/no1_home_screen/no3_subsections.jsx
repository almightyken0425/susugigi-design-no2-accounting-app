// ─────────────────────────────────────────────────────────────
// HomeScreen sub-sections · 私有 sub-section 元件
//
// 鏡射 impl src/screens/Home/PeriodPage.tsx 內部拆分：
//   PeriodSwitcher / DonutHero / FocusRow / TxSectionList /
//   TxSectionCard / TxSectionHeader / TxDateBadge / TxRow / AmountCol
//
// 消費 HOME_SCREEN_TOKENS（screen 級）+ TX_LIST_TOKENS / LIST_TOKENS（component 級）
// + atomic（SPACING / RADIUS / TYPOGRAPHY / ICON_SIZE / MOTION / TOKENS）。
// ─────────────────────────────────────────────────────────────

// Date string 'May 14' → '5/14'（PeriodPage 內的 short-date 格式）
const _HOME_MONTH_TO_NUM = {
  Jan:'1', Feb:'2', Mar:'3', Apr:'4',  May:'5',  Jun:'6',
  Jul:'7', Aug:'8', Sep:'9', Oct:'10', Nov:'11', Dec:'12',
};

// ─── AmountCol ─── TxRow 右側金額欄
// recurring chip + main amount + 換算金額（cross-currency 時）。
function AmountCol({ recurring, amount, currency, convertedAmount }) {
  const T = HOME_SCREEN_TOKENS;
  const hasConverted = convertedAmount !== undefined && convertedAmount !== null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: T.AMOUNT_COL_GAP }}>
      {recurring && (
        <div style={{
          width: T.AMOUNT_COL_RECURRING_FRAME,
          height: T.AMOUNT_COL_RECURRING_FRAME,
          borderRadius: T.AMOUNT_COL_RECURRING_RADIUS,
          background: TOKENS.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Glyph name="repeat" size={T.AMOUNT_COL_RECURRING_ICON_SIZE} color={TOKENS.ink2} stroke={2}/>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <InlineAmount value={fmt(amount, currency)} numberStyle={{
          fontSize: TX_LIST_TOKENS.ROW_AMOUNT_SIZE,
          fontWeight: TX_LIST_TOKENS.ROW_AMOUNT_WEIGHT,
          color: TOKENS.p900,
          fontVariantNumeric: NUMERIC_FONT_VARIANT,
        }}/>
        {hasConverted && (
          <span style={{
            fontSize: TYPOGRAPHY.size.xs, color: TOKENS.ink2,
            fontVariantNumeric: NUMERIC_FONT_VARIANT,
          }}>≈ {fmt(convertedAmount, 'TWD')}</span>
        )}
      </div>
    </div>
  );
}

// ─── TxDateBadge ─── date mode 的 row 左 slot（顯示 m/d）
function TxDateBadge({ date }) {
  const [mStr, d] = date.split(' ');
  const m = _HOME_MONTH_TO_NUM[mStr] || mStr;
  return (
    <div style={{
      width: TX_LIST_TOKENS.ROW_LEFT_SLOT_SIZE,
      height: TX_LIST_TOKENS.ROW_LEFT_SLOT_SIZE,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{
        fontSize: TYPE_STYLES.caption1.size,
        fontWeight: TYPOGRAPHY.weight.medium,
        color: TOKENS.ink2, fontVariantNumeric: NUMERIC_FONT_VARIANT,
      }}>{m}/{d}</span>
    </div>
  );
}

// ─── TxRow ─── 交易列（left slot + primary/secondary text + right slot）
function TxRow({ left, primary, secondary, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      gap: SPACING.md,
      paddingLeft: SPACING.lg, paddingRight: SPACING.lg,
      paddingTop: SPACING.md, paddingBottom: SPACING.md,
    }}>
      {left}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: TX_LIST_TOKENS.ROW_NOTE_SIZE,
          color: TOKENS.ink,
          marginBottom: SPACING['2xs'],
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{primary}</div>
        {secondary && (
          <div style={{
            fontSize: TX_LIST_TOKENS.ROW_SECONDARY_SIZE, color: TOKENS.ink2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{secondary}</div>
        )}
      </div>
      {right}
    </div>
  );
}

// ─── TxSectionHeader ─── TxSectionCard 頂部（chevron + iconId + title + total）
function TxSectionHeader({ collapsed, onClick, iconId, title, total }) {
  const T = HOME_SCREEN_TOKENS;
  const c = collapsed;
  const morph = `all ${TX_LIST_TOKENS.MORPH_DURATION_MS}ms ${MOTION.easing.standard}`;
  // 小計拆幣別段/數字段，幣別段隨收合縮 xs↔2xs（小幣別大數值橫排，對齊 impl TxSectionCard）
  const { symbol: totalSymbol, number: totalNumber } = splitCurrencyParts(total);
  return (
    <div onClick={onClick} style={{
      cursor: 'pointer',
      paddingLeft: TX_LIST_TOKENS.SECTION_HEADER_PADDING_H,
      paddingRight: TX_LIST_TOKENS.SECTION_HEADER_PADDING_H,
      paddingTop: c ? TX_LIST_TOKENS.SECTION_HEADER_PADDING_V_COLLAPSED : TX_LIST_TOKENS.SECTION_HEADER_PADDING_V_EXPANDED,
      paddingBottom: c ? TX_LIST_TOKENS.SECTION_HEADER_PADDING_V_COLLAPSED : TX_LIST_TOKENS.SECTION_HEADER_PADDING_V_EXPANDED,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transition: morph,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm, flex: 1, minWidth: 0 }}>
        <div style={{
          width: T.SECTION_HEADER_CHEVRON_FRAME,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: `rotate(${c ? 0 : 90}deg)`, transition: morph,
        }}>
          <Glyph name="chevron-right" size={T.SECTION_HEADER_CHEVRON_SIZE} color={TOKENS.ink2} stroke={2.5}/>
        </div>
        {iconId !== undefined && (
          <div style={{
            width: T.SECTION_HEADER_CATEGORY_ICON_FRAME,
            height: T.SECTION_HEADER_CATEGORY_ICON_FRAME,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <DynamicIconById iconId={iconId} size={T.SECTION_HEADER_CATEGORY_ICON_SIZE} color={TOKENS.p500}/>
          </div>
        )}
        <span style={{
          fontSize: c ? TX_LIST_TOKENS.SECTION_HEADER_TITLE_SIZE_COLLAPSED : TX_LIST_TOKENS.SECTION_HEADER_TITLE_SIZE_EXPANDED,
          fontWeight: TX_LIST_TOKENS.SECTION_HEADER_TITLE_WEIGHT,
          color: TOKENS.ink, transition: morph,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{title}</span>
      </div>
      <span style={{
        fontSize: c ? TX_LIST_TOKENS.SECTION_HEADER_TOTAL_SIZE_COLLAPSED : TX_LIST_TOKENS.SECTION_HEADER_TOTAL_SIZE_EXPANDED,
        fontWeight: TX_LIST_TOKENS.SECTION_HEADER_TOTAL_WEIGHT,
        color: TOKENS.ink, fontVariantNumeric: NUMERIC_FONT_VARIANT, transition: morph,
      }}>
        {totalSymbol ? <span style={{ fontSize: c ? TX_LIST_TOKENS.SECTION_HEADER_TOTAL_CURRENCY_SIZE_COLLAPSED : TX_LIST_TOKENS.SECTION_HEADER_TOTAL_CURRENCY_SIZE_EXPANDED, transition: morph }}>{totalSymbol}</span> : null}
        {totalNumber}
      </span>
    </div>
  );
}

// ─── TxSectionCard ─── 一個 collapsible section（summary header + paged rows）
// section header 是先行摘要。收合時不建立任何 row。
// 展開時 section.data 代表目前已載入的明細頁。不是完整歷史資料全集。
// mode='category'：row 左 slot 顯示日期；secondary 隱藏
// mode='date'：row 左 slot 顯示 category icon；secondary 顯示帳戶名稱
function TxSectionCard({ section, collapsed, onToggle, mode }) {
  return (
    <div style={{
      marginLeft: TX_LIST_TOKENS.SECTION_CARD_HORIZONTAL_PADDING,
      marginRight: TX_LIST_TOKENS.SECTION_CARD_HORIZONTAL_PADDING,
      marginBottom: TX_LIST_TOKENS.SECTION_CARD_MARGIN_BOTTOM,
      background: TOKENS.surface,
      borderRadius: TX_LIST_TOKENS.SECTION_CARD_RADIUS,
      borderWidth: LIST_TOKENS.GROUP_CARD_BORDER_WIDTH, borderStyle: 'solid',
      borderColor: TOKENS.hairline,
      overflow: 'hidden',
      transition: `all ${TX_LIST_TOKENS.MORPH_DURATION_MS}ms ${MOTION.easing.standard}`,
    }}>
      <TxSectionHeader
        collapsed={collapsed}
        onClick={() => onToggle && onToggle(section.id)}
        iconId={mode === 'category' ? section.iconId : undefined}
        title={section.title}
        total={fmt(section.total)}/>
      {!collapsed && section.data.map((tx, i) => {
        const cat = CAT_BY_ID[tx.cat];
        const leftSlot = mode === 'category'
          ? <TxDateBadge date={tx.date}/>
          : (
            <div style={{
              width: TX_LIST_TOKENS.ROW_LEFT_SLOT_SIZE, height: TX_LIST_TOKENS.ROW_LEFT_SLOT_SIZE,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {cat && <DynamicIconById iconId={cat.iconId} size={ICON_SIZE.sm} color={TOKENS.p500}/>}
            </div>
          );
        const acc = ACC_BY_ID[tx.acc];
        const primary = tx.note || '';
        const secondary = mode === 'category' ? null : (acc ? acc.name : '');
        return (
          <div key={tx.id} style={{ borderTop: i === 0 ? 'none' : `0.5px solid ${TOKENS.hairline}` }}>
            <TxRow
              left={leftSlot}
              primary={primary}
              secondary={secondary}
              right={<AmountCol recurring={tx.recurring} amount={tx.amount} currency={tx.currency} convertedAmount={tx.convertedAmount}/>}/>
          </div>
        );
      })}
    </div>
  );
}

// ─── TxSectionList ─── sections array → TxSectionCard list
function TxSectionList({ sections, collapsed, onToggle, mode }) {
  return (
    <>
      {sections.map(sec => (
        <TxSectionCard key={sec.id} section={sec}
          collapsed={collapsed.has(sec.id)} onToggle={onToggle} mode={mode}/>
      ))}
    </>
  );
}

// ─── PeriodSwitcher ─── 月份切換 row（左 chevron + calendar icon + label + 右 chevron）
function PeriodSwitcher({ label }) {
  const T = HOME_SCREEN_TOKENS;
  const buttonFrame = {
    width: T.PERIOD_SWITCHER_BUTTON_FRAME,
    height: T.PERIOD_SWITCHER_BUTTON_FRAME,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: T.PERIOD_SWITCHER_GAP,
      paddingTop: T.PERIOD_SWITCHER_PADDING_TOP,
      paddingBottom: T.PERIOD_SWITCHER_PADDING_BOTTOM,
    }}>
      <div style={buttonFrame}>
        <Glyph name="chevron-left" size={T.PERIOD_SWITCHER_CHEVRON_SIZE} color={TOKENS.ink3} stroke={2.5}/>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.xs }}>
        <div style={{
          marginRight: T.PERIOD_SWITCHER_CALENDAR_RIGHT_GAP,
          display: 'flex', alignItems: 'center',
        }}>
          <Glyph name="calendar" size={T.PERIOD_SWITCHER_CALENDAR_ICON_SIZE} color={TOKENS.ink2} stroke={2}/>
        </div>
        <span style={{
          fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.medium,
          color: TOKENS.ink,
        }}>{label}</span>
      </div>
      <div style={buttonFrame}>
        <Glyph name="chevron-right" size={T.PERIOD_SWITCHER_CHEVRON_SIZE} color={TOKENS.ink3} stroke={2.5}/>
      </div>
    </div>
  );
}

// ─── DonutHero ─── 圓餅圖 + 中央文字
// 對齊 impl src/screens/Home/PeriodPage.tsx PageHeaderContent：empty data 時
// impl 不換中央內容，仍是「餘額 / $0」（balance=0 走原 layout 不分支）；loading
// 在 impl 為整頁 Text，不在 donut 中央，所以本 component 也不處理 loading。
//
// 雙向 donut：同時呈現 expense + income 兩段弧，起點皆位於 12 點。
//   - 收入弧：從 12 點往右 (CW)，金額大者鄰近交會點
//   - 支出弧：從 12 點往左 (CCW)，金額大者鄰近交會點
//   - 兩弧在底部某點交會，比例 = expenseTotal : incomeTotal
//
// slice 顯示門檻（對齊 impl DonutChart computeBidirectionalSliceInfo）：
// 以原始總額為分母，占比 < DONUT_MIN_SLICE_ANGLE_DEG/360 的 slice 整片拔除，
// 其餘 slice 以剩餘總額重新正規化鋪滿整圈。只判一輪、不回鍋。
function DonutHero({ expenseData, incomeData, totals, chartMode }) {
  const T = HOME_SCREEN_TOKENS;
  const TAU = 2 * Math.PI;
  // 單側資料的 12 點開口由 DonutChart 的 pad 產生（單片占滿整圈時頭尾各內縮 pad/2，
  // 留下與一般 slice 交接一致的縫），此處資料層不另保留寬縫。
  const minShare = T.DONUT_MIN_SLICE_ANGLE_DEG / 360;
  const rawTotal = expenseData.reduce((s, x) => s + x.value, 0)
    + incomeData.reduce((s, x) => s + x.value, 0);
  const keptExpense = rawTotal > 0 ? expenseData.filter(x => x.value / rawTotal >= minShare) : [];
  const keptIncome = rawTotal > 0 ? incomeData.filter(x => x.value / rawTotal >= minShare) : [];

  const expenseTotal = keptExpense.reduce((s, x) => s + x.value, 0);
  const incomeTotal = keptIncome.reduce((s, x) => s + x.value, 0);
  const totalAll = expenseTotal + incomeTotal;

  let slices = [];
  if (totalAll > 0) {
    const rExpense = expenseTotal / totalAll;
    // 收入側：reverse 後正向累加，從 0 走到 +TAU × rIncome
    const incomeReversed = [...keptIncome].reverse();
    let accIncome = 0;
    const incomeSlices = incomeReversed.map(d => {
      const sweep = (d.value / totalAll) * TAU;
      const start = accIncome;
      const end = accIncome + sweep;
      accIncome += sweep;
      return { startAngle: start, endAngle: end, color: d.color, key: 'in_' + d.id };
    });
    // 支出側：不 reverse，正向累加，最後整體平移 -TAU × rExpense
    let accExpense = 0;
    const expenseSlices = keptExpense.map(d => {
      const sweep = (d.value / totalAll) * TAU;
      const start = accExpense - TAU * rExpense;
      const end = accExpense + sweep - TAU * rExpense;
      accExpense += sweep;
      return { startAngle: start, endAngle: end, color: d.color, key: 'ex_' + d.id };
    });
    slices = [...expenseSlices, ...incomeSlices];
  }

  // 中央餘額垂直堆疊：數值留 xl(20)、幣別在上縮到 xs(12)、同色。
  const { symbol: balanceSymbol, number: balanceNumber } = splitCurrencyParts(fmt(totals.balance));

  return (
    <div style={{
      display: 'flex', justifyContent: 'center',
      marginBottom: T.DONUT_BOTTOM_GAP,
    }}>
      <DonutChart slices={slices} focusedSide={chartMode}>
        <div style={{ textAlign: 'center', width: T.DONUT_CENTER_TEXT_WIDTH }}>
          <div style={{
            fontSize: TYPOGRAPHY.size.xs, fontWeight: TYPOGRAPHY.weight.medium,
            color: TOKENS.ink, textAlign: 'center',
          }}>{balanceSymbol}</div>
          <div style={{
            fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.medium,
            color: TOKENS.ink, fontVariantNumeric: NUMERIC_FONT_VARIANT, textAlign: 'center',
          }}>{balanceNumber}</div>
        </div>
      </DonutChart>
    </div>
  );
}

// ─── FocusRow ─── expense / income 切換的兩張 FocusCard
function FocusRow({ totals, chartMode, onChartModeChange }) {
  const T = HOME_SCREEN_TOKENS;
  return (
    <div style={{
      display: 'flex', flexDirection: 'row', gap: T.FOCUS_ROW_GAP,
      paddingLeft: T.FOCUS_ROW_PADDING_HORIZONTAL,
      paddingRight: T.FOCUS_ROW_PADDING_HORIZONTAL,
      paddingTop: T.FOCUS_ROW_PADDING_TOP,
      paddingBottom: T.FOCUS_ROW_PADDING_BOTTOM,
    }}>
      <FocusCard kind="expense" amount={totals.expense}
        active={chartMode === 'expense'} onPress={() => onChartModeChange('expense')}/>
      <FocusCard kind="income"  amount={totals.income}
        active={chartMode === 'income'}  onPress={() => onChartModeChange('income')}/>
    </div>
  );
}

Object.assign(window, {
  AmountCol, TxDateBadge, TxRow,
  TxSectionHeader, TxSectionCard, TxSectionList,
  PeriodSwitcher, DonutHero, FocusRow,
});
