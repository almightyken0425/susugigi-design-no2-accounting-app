// ─────────────────────────────────────────────────────────────
// Mock CATEGORIES · 設計稿視覺化用 seed
//
// 僅供 design canvas（screens / explorations / components_showcase）
// 渲染示範用；impl 端使用真實 SQLite / Firestore 資料源，不消費此 mock。
// ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'food',    name: '飲食',  type: 'expense', iconId: 13 },  // ph-coffee
  { id: 'trans',   name: '交通',  type: 'expense', iconId: 23 },  // ph-bus
  { id: 'shop',    name: '購物',  type: 'expense', iconId: 28 },  // ph-shopping-cart
  { id: 'ent',     name: '娛樂',  type: 'expense', iconId: 60 },  // ph-game-controller
  { id: 'home',    name: '居家',  type: 'expense', iconId: 53 },  // ph-house
  { id: 'health',  name: '醫療',  type: 'expense', iconId: 76 },  // ph-pill
  { id: 'edu',     name: '教育',  type: 'expense', iconId: 42 },  // ph-book
  { id: 'gift',    name: '禮物',  type: 'expense', iconId:  6 },  // ph-gift
  { id: 'salary',  name: '薪資',  type: 'income',  iconId:  1 },  // ph-money
  { id: 'invest',  name: '投資',  type: 'income',  iconId: 87 },  // ph-chart-line
];
const CAT_BY_ID = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

Object.assign(window, { CATEGORIES, CAT_BY_ID });
