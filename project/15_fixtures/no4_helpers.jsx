// ─────────────────────────────────────────────────────────────
// Canvas helpers · pure function 資料轉換與格式化
//
// 給 screens / explorations / components_showcase 渲染示範用。
// 所有 helpers 必須是 pure function，不引用 impl 業務邏輯。
// ─────────────────────────────────────────────────────────────

const baseAmount = (t) => t.convertedAmount ?? t.amount;

// 轉帳（type: 'transfer'）非收支，一律排除於收支統計（totals / pie / category 分組）。
// 唯 groupByDate 保留轉帳列以呈現「轉帳紀錄列」，但日小計仍排除轉帳。
const isTransfer = (t) => t.type === 'transfer';

function periodTotals(items) {
  let income = 0, expense = 0;
  for (const t of items) {
    if (isTransfer(t)) continue;
    const a = baseAmount(t);
    if (a > 0) income += a; else expense += -a;
  }
  return { income, expense, balance: income - expense };
}

function groupByDate(items) {
  const m = new Map();
  for (const t of items) {
    if (!m.has(t.date)) m.set(t.date, []);
    m.get(t.date).push(t);
  }
  return Array.from(m.entries()).map(([title, data]) => ({
    id: 'date_' + title, title, data,
    // 日小計排除轉帳（轉帳非收支淨額），列仍保留於 data 顯示
    total: data.reduce((s, t) => s + (isTransfer(t) ? 0 : baseAmount(t)), 0),
  }));
}

function groupByCategory(items, chartMode = 'expense') {
  const filtered = items.filter(t => !isTransfer(t) && (chartMode === 'expense' ? baseAmount(t) < 0 : baseAmount(t) > 0));
  const m = new Map();
  for (const t of filtered) {
    if (!m.has(t.cat)) m.set(t.cat, []);
    m.get(t.cat).push(t);
  }
  return Array.from(m.entries()).map(([cat, data]) => ({
    id: 'cat_' + cat, cat,
    title: CAT_BY_ID[cat].name,
    iconId: CAT_BY_ID[cat].iconId,
    data,
    total: data.reduce((s, t) => s + baseAmount(t), 0),
  })).sort((a, b) => Math.abs(b.total) - Math.abs(a.total));
}

function pieData(items) {
  const m = new Map();
  for (const t of items) {
    const a = baseAmount(t);
    if (a >= 0) continue;
    m.set(t.cat, (m.get(t.cat) || 0) + (-a));
  }
  const arr = Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  return arr.map(([id, value], i) => ({
    id, value,
    color: CHART_COLORS[i % CHART_COLORS.length],
    cat: CAT_BY_ID[id],
  }));
}

// _assignChartColors · 對齊 spec no13_home_report_logic.md assignChartColors
// 輸入: 已金額大→小排序的 [{ id, value, cat }]
// 規則: top-N (N<=2) 取 CHART_COLORS[0..N-1]，截止為「累積達 5/6」或「第 2 個」先達者
//       截止外的合併為 _other，色為 TOKENS.p300
function _assignChartColors(items) {
  if (items.length === 0) return [];
  const total = items.reduce((s, x) => s + x.value, 0);
  if (total <= 0) return [];
  const threshold = total * 5 / 6;
  let cumulative = 0;
  let cutoff = 0;
  for (let i = 0; i < items.length && i < 2; i++) {
    cumulative += items[i].value;
    cutoff = i + 1;
    if (cumulative >= threshold) break;
  }
  const top = items.slice(0, cutoff).map((x, i) => ({
    ...x,
    color: CHART_COLORS[i],
  }));
  const rest = items.slice(cutoff);
  if (rest.length > 0) {
    const restValue = rest.reduce((s, x) => s + x.value, 0);
    top.push({
      id: '_other',
      value: restValue,
      cat: null,
      color: TOKENS.p300,
    });
  }
  return top;
}

function expensePieData(items) {
  const m = new Map();
  for (const t of items) {
    const a = baseAmount(t);
    if (a >= 0) continue;
    m.set(t.cat, (m.get(t.cat) || 0) + (-a));
  }
  const arr = Array.from(m.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([id, value]) => ({ id, value, cat: CAT_BY_ID[id] }));
  return _assignChartColors(arr);
}

function incomePieData(items) {
  const m = new Map();
  for (const t of items) {
    const a = baseAmount(t);
    if (a <= 0) continue;
    m.set(t.cat, (m.get(t.cat) || 0) + a);
  }
  const arr = Array.from(m.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([id, value]) => ({ id, value, cat: CAT_BY_ID[id] }));
  return _assignChartColors(arr);
}

function fmt(n, code = 'TWD') {
  // 負值統一採「符號後負號」（NT$-500），對齊 impl formatCurrencyValue 全 app 一致約定。
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  const symbol = code === 'TWD' ? 'NT$' : code === 'USD' ? 'US$' : code === 'JPY' ? '¥' : code;
  return symbol + sign + abs.toLocaleString('en-US');
}

// 把 fmt 產出的單行字串拆成幣別段與數字段，供首頁 donut 中央垂直堆疊用（幣別在上、數字在下）。
// 對齊 impl src/utils/formatters.ts splitCurrencyParts：符號恆前置，負號緊鄰首位數字之前（NT$-500）。
// 以 \p{Nd} 命中第一個十進位數字，數字段自該位起算；前一字元為負號則一併納入，使號隨值走。
function splitCurrencyParts(formatted) {
  const match = formatted.match(/\p{Nd}/u);
  if (!match) { return { symbol: '', number: formatted }; }
  let cut = match.index;
  if (cut > 0 && formatted[cut - 1] === '-') { cut -= 1; }
  return { symbol: formatted.slice(0, cut).trimEnd(), number: formatted.slice(cut) };
}

Object.assign(window, {
  baseAmount, periodTotals, groupByDate, groupByCategory, pieData, fmt, splitCurrencyParts,
  expensePieData, incomePieData,
});
