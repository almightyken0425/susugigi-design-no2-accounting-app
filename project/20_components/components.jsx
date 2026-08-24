// ─────────────────────────────────────────────────────────────
// Components — 對齊 src/components/*  與 src/components/list/*
// 元件名稱、props、視覺值都對齊 impl。
// Glyph 名稱使用 impl 的 MCI / FontAwesome / SF Symbols 真名，
// 內部映射到自製 SVG（命名以 impl 真名為準）。
// ─────────────────────────────────────────────────────────────

// ─── Icon 渲染兩端對應關係 ───
//
// Design 端（本檔）：
//   - Glyph(name)         — canvas 自製 SVG，switch case 內硬寫；
//                            用於 chevron / x / search 等小型 UI glyph
//   - PhosphorIcon(glyph) — canvas Phosphor renderer，CSS mask 載入
//                            project/assets/icons/phosphor/<glyph>.svg
//   - DynamicIconById(id) — 由 ICON_LIBRARY 找 def，dispatch 到 PhosphorIcon
//
// Impl 端（src/components/DynamicIcon.tsx）：
//   - DynamicIcon(name)         — 用 PHOSPHOR_SVG_MAP 渲染 Phosphor SVG 套件
//   - DynamicIconById(iconId)   — 由 IconDefinition.json 找 def 再 dispatch 到 DynamicIcon
//
// 兩端共享的契約：
//   - IconDefinition schema（Design `ICON_LIBRARY` ⇔ Impl `assets/definitions/
//     IconDefinition.json`，欄位 id / uniqueName / library / glyph / tags 一致）
//   - Phosphor SVG 資產（Design `project/assets/icons/phosphor/` ⇔ Impl 透過
//     PHOSPHOR_SVG_MAP 引用同一套 Phosphor 套件，CSS mask 等效於 RN react-native-svg
//     的 fill 行為）
//
// DynamicIconById 名稱兩端一致，因其職責純粹是「id → icon」的 lookup，與渲染管道無關。
// Design 端為何拆 Glyph + PhosphorIcon 兩個 canvas renderer：Glyph 承載小型 UI glyph
// （硬寫 SVG path）；PhosphorIcon 承載 ICON_LIBRARY 對應的 phosphor 資產。兩者都是
// canvas 視覺 mock，與 Impl runtime 不共用元件。

// ─── Glyph ─── canvas 視覺 mock，非 impl 對應元件（impl 用 DynamicIcon，見上述對應）
// 名稱規則：使用 impl 中 <MaterialCommunityIcons name="..."> 或
// <FontAwesome name="..."> 或 SF Symbols 的真實 name。
// 不存在的就用視覺近似的 fallback。
const GLYPH_ALIASES = {
  // MCI → canonical
  'magnify': 'search',
  'calendar-blank-outline': 'calendar',
  'calendar-clock': 'calendar',
  'tag-outline': 'tag',
  'bank-outline': 'bank',
  'cog-outline': 'gear',
  'star-outline': 'star',
  'bug-outline': 'bug',
  'shield-account-outline': 'shield',
  'database-cog-outline': 'database',
  'database-refresh-outline': 'refresh',
  'archive-arrow-up-outline': 'upload',
  'archive-arrow-down-outline': 'download',
  'file-import-outline': 'download',
  'file-export-outline': 'upload',
  'swap-horizontal': 'exchange',
  'backspace-outline': 'backspace',
  'help-circle-outline': 'help',
  'bank-transfer': 'exchange',
  'arrow-right': 'arrow-right',
  'arrow-left': 'arrow-left',
  'arrow-down': 'arrow-down',
  'arrow-up': 'arrow-up',
  'chevron-up': 'chevron-up',
  'chevron-down': 'chevron-down',
  'chevron-left': 'chevron-left',
  'chevron-right': 'chevron-right',
  // FontAwesome
  'times': 'x',
  'check': 'check',
  'plus': 'plus',
  'minus': 'minus',
  // SF Symbols
  'xmark': 'x',
  'checkmark': 'check',
  'chevron.right': 'chevron-right',
  'line.3.horizontal.decrease': 'filter',
  'magnifyingglass': 'search',
  'gearshape': 'gear',
  'arrow.triangle.merge': 'merge',
  // MCI category / account icons → custom SVG
  'food': 'food',
  'bus': 'bus',
  'cart': 'cart',
  'movie': 'movie',
  'home': 'house',
  'water': 'water',
  'hospital-box': 'hospital',
  'school': 'school',
  'dots-horizontal': 'dots-horizontal',
  'cash-multiple': 'cash',
  'chart-line': 'chart',
  'bank': 'bank',
  'creditcard': 'card',
  'wallet': 'wallet',
  'currency-usd': 'currency-usd',
  'currency-eur': 'currency-eur',
  'currency-gbp': 'currency-gbp',
  'lightbulb-on-outline': 'bulb',
  'earth': 'globe',
  'coffee': 'coffee',
  'pay-circle1': 'pay',
  'shoppingcart': 'cart',
  'star': 'star',
  'amazon': 'shopping',
  'book': 'book',
  'camera': 'camera',
  'clear': 'x',
  'customerservice': 'headphones',
  'dribbble': 'circle',
  'experiment': 'flask',
  'fire': 'fire',
  'laptop': 'laptop',
  'notification': 'bell',
  'read': 'book',
  'rocket1': 'rocket',
  'ruby': 'diamond',
  'scissor': 'scissor',
  'sliders': 'sliders',
  'team': 'team',
  'tool': 'wrench',
  'truck': 'truck',
  'unlock': 'unlock',
  'warning': 'warning',
  // alert + reverse
  'alert-circle': 'warning',
  'alert-circle-outline': 'warning',
  'alert-outline': 'warning',
  'clock-outline': 'clock',
  'close': 'x',
  'database-plus-outline': 'database',
  'database-remove-outline': 'database',
  'file-document-outline': 'book',
  'exchange': 'exchange',
  'repeat': 'repeat',
  'sync': 'sync',
  'refresh': 'refresh',
  'clock': 'clock',
  'filter': 'filter',
  'search': 'search',
  'gear': 'gear',
  'check-circle': 'check-circle',
};

function Glyph({ name, size = 16, color = TOKENS.ink, stroke = 2 }) {
  const canonical = GLYPH_ALIASES[name] || name;
  const s = size, c = color, sw = stroke;
  switch (canonical) {
    // ─── 通用 UI ───
    case 'chevron-left':   return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'chevron-right':  return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'chevron-up':     return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M3 10L8 5L13 10" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'chevron-down':   return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M3 6L8 11L13 6" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'arrow-right':    return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'arrow-left':     return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 4L3 8l4 4" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'arrow-down':     return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 3v10M4 9l4 4 4-4" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'arrow-up':       return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 13V3M4 7l4-4 4 4" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'x':              return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M12 4L4 12" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    case 'check':          return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke={c} strokeWidth={sw + 0.5} strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'check-circle':   return (<svg width={s} height={s} viewBox="0 0 16 16" fill={c}><circle cx="8" cy="8" r="7" fill={c}/><path d="M4.5 8L7 10.5L11.5 6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'plus':           return (<svg width={s} height={s} viewBox="0 0 16 16"><rect x="7" y="2.5" width="2" height="11" rx="1" fill={c}/><rect x="2.5" y="7" width="11" height="2" rx="1" fill={c}/></svg>);
    case 'minus':          return (<svg width={s} height={s} viewBox="0 0 16 16"><rect x="2.5" y="7" width="11" height="2" rx="1" fill={c}/></svg>);
    case 'exchange':       return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M3 5h10l-2.5-2.5M13 11H3l2.5 2.5" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'merge':          return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M4 14V8c0-2 1-3 3-3M12 14V8c0-2-1-3-3-3M5 7L7 5L9 7M7 5V14" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'filter':         return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4.5 8h7M7 12h3" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    case 'search':         return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke={c} strokeWidth={sw}/><path d="M10.5 10.5L13.5 13.5" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    case 'gear':           return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.2" stroke={c} strokeWidth={sw}/><path d="M8 1.5v2M8 12.5v2M14.5 8h-2M3.5 8h-2M12.6 3.4l-1.4 1.4M4.8 11.2l-1.4 1.4M12.6 12.6l-1.4-1.4M4.8 4.8L3.4 3.4" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    case 'repeat':         return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M11 1.5L13.5 4L11 6.5M2.5 8V6a2 2 0 012-2H13M5 14.5L2.5 12L5 9.5M13.5 8v2a2 2 0 01-2 2H3" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'sync':           return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M3 8a5 5 0 018.5-3.5M13 8a5 5 0 01-8.5 3.5M11.5 2v3h-3M4.5 14v-3h3" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'refresh':        return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M13.5 8a5.5 5.5 0 11-1.4-3.7M13.5 2v3h-3" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'clock':          return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke={c} strokeWidth={sw}/><path d="M8 4.5V8l2.5 1.5" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    case 'calendar':       return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><rect x="2" y="3.5" width="12" height="11" rx="1.5" stroke={c} strokeWidth={sw}/><path d="M2 6h12M5 2v3M11 2v3" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    case 'tag':            return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 1.5H13.5V7L7 13.5L1.5 8L8 1.5Z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/><circle cx="10.5" cy="5" r="1" fill={c}/></svg>);
    case 'shield':         return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 1.5L13.5 4V8C13.5 11 11 13.5 8 14.5C5 13.5 2.5 11 2.5 8V4L8 1.5Z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/></svg>);
    case 'database':       return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><ellipse cx="8" cy="3.5" rx="5.5" ry="1.8" stroke={c} strokeWidth={sw}/><path d="M2.5 3.5V12c0 1 2.5 1.8 5.5 1.8s5.5-.8 5.5-1.8V3.5M2.5 7.7c0 1 2.5 1.8 5.5 1.8s5.5-.8 5.5-1.8" stroke={c} strokeWidth={sw}/></svg>);
    case 'star':           return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 1.5L9.9 5.6L14.5 6.2L11.2 9.4L12 14L8 11.7L4 14L4.8 9.4L1.5 6.2L6.1 5.6L8 1.5Z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/></svg>);
    case 'star-fill':      return (<svg width={s} height={s} viewBox="0 0 16 16"><path d="M8 1.5L9.9 5.6L14.5 6.2L11.2 9.4L12 14L8 11.7L4 14L4.8 9.4L1.5 6.2L6.1 5.6L8 1.5Z" fill={c}/></svg>);
    case 'bug':            return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><ellipse cx="8" cy="9" rx="3.5" ry="4.5" stroke={c} strokeWidth={sw}/><path d="M8 4.5V2.5M5 5L3.5 3.5M11 5L12.5 3.5M3 9H5M11 9H13M3.5 13L5 12M12.5 13L11 12" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    case 'backspace':      return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M8 4h12a2 2 0 012 2v12a2 2 0 01-2 2H8L2 12L8 4z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M11 9l6 6M17 9l-6 6" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>);
    case 'upload':         return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 10V2m0 0L5 5m3-3l3 3M2.5 13.5h11" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'download':       return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 2v8m0 0L5 7m3 3l3-3M2.5 12.5h11" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'cloud':          return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M4 12.5a3 3 0 010-6 4.5 4.5 0 018.6 1.3A2.7 2.7 0 0112 12.5H4Z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/></svg>);
    case 'trash':          return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M3 5h10M5.5 5V3.5h5V5M6 7v5M10 7v5M4 5l.5 9h7L12 5" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    case 'help':           return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke={c} strokeWidth={sw}/><path d="M6 6.5a2 2 0 014 0c0 1.5-2 1.5-2 3M8 12v0.5" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    case 'dots-horizontal': return (<svg width={s} height={s} viewBox="0 0 16 16"><circle cx="3.5" cy="8" r="1.3" fill={c}/><circle cx="8" cy="8" r="1.3" fill={c}/><circle cx="12.5" cy="8" r="1.3" fill={c}/></svg>);
    case 'drag':           return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="6" cy="4" r="1" fill={c}/><circle cx="10" cy="4" r="1" fill={c}/><circle cx="6" cy="8" r="1" fill={c}/><circle cx="10" cy="8" r="1" fill={c}/><circle cx="6" cy="12" r="1" fill={c}/><circle cx="10" cy="12" r="1" fill={c}/></svg>);
    case 'globe':          return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke={c} strokeWidth={sw}/><path d="M2 8h12M8 2c2 1.8 3 4 3 6s-1 4.2-3 6c-2-1.8-3-4-3-6s1-4.2 3-6Z" stroke={c} strokeWidth={sw}/></svg>);

    // ─── Categories / Accounts ─── 簡化 SVG 對應 IconDefinition.json
    case 'food':           return (<svg width={s} height={s} viewBox="0 0 16 16"><rect x="4" y="2" width="1.6" height="12" rx="0.8" fill={c}/><rect x="10.4" y="2" width="1.6" height="12" rx="0.8" fill={c}/><rect x="3" y="2" width="10" height="1.6" rx="0.8" fill={c}/></svg>);
    case 'bus':            return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><rect x="2.5" y="3" width="11" height="9" rx="1.5" stroke={c} strokeWidth={sw}/><path d="M2.5 8.5h11M5.5 5.5h5" stroke={c} strokeWidth={sw}/><circle cx="5" cy="13" r="1" fill={c}/><circle cx="11" cy="13" r="1" fill={c}/></svg>);
    case 'cart':           return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M2 3h2l1.5 7h7.5l1.5-5h-9" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/><circle cx="6" cy="13" r="1.2" fill={c}/><circle cx="12" cy="13" r="1.2" fill={c}/></svg>);
    case 'movie':          return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><rect x="2" y="3.5" width="12" height="9" rx="1" stroke={c} strokeWidth={sw}/><path d="M2 6h12M2 10h12M5 3.5v9M11 3.5v9" stroke={c} strokeWidth={sw}/></svg>);
    case 'house':          return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M2 8L8 2.5L14 8V13.5C14 14 13.5 14.5 13 14.5H3C2.5 14.5 2 14 2 13.5V8Z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/><path d="M6.5 14.5V10H9.5V14.5" stroke={c} strokeWidth={sw}/></svg>);
    case 'water':          return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 2C5 6 3 9 3 11a5 5 0 0010 0c0-2-2-5-5-9Z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/></svg>);
    case 'hospital':       return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><rect x="2.5" y="3" width="11" height="11" rx="1.5" stroke={c} strokeWidth={sw}/><path d="M8 6v5M5.5 8.5h5" stroke={c} strokeWidth={sw + 0.5} strokeLinecap="round"/></svg>);
    case 'school':         return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 2L1.5 5L8 8L14.5 5L8 2Z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/><path d="M4 6.5V10c0 1 2 2 4 2s4-1 4-2V6.5" stroke={c} strokeWidth={sw}/></svg>);
    case 'cash':           return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><rect x="1.5" y="4" width="13" height="8" rx="1" stroke={c} strokeWidth={sw}/><circle cx="8" cy="8" r="2" stroke={c} strokeWidth={sw}/></svg>);
    case 'bank':           return (<svg width={s} height={s} viewBox="0 0 16 16"><path d="M8 2L14 5H2L8 2Z" fill={c}/><rect x="3" y="6" width="1.6" height="6" fill={c}/><rect x="7.2" y="6" width="1.6" height="6" fill={c}/><rect x="11.4" y="6" width="1.6" height="6" fill={c}/><rect x="2" y="12.5" width="12" height="1.6" rx="0.5" fill={c}/></svg>);
    case 'card':           return (<svg width={s} height={s} viewBox="0 0 16 16"><rect x="1.5" y="3.5" width="13" height="9" rx="1.5" fill="none" stroke={c} strokeWidth={sw}/><rect x="1.5" y="6" width="13" height="1.6" fill={c}/></svg>);
    case 'chart':          return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M2 13h12M3 11l3-4 3 2 5-5" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'wallet':         return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="9" rx="1.5" stroke={c} strokeWidth={sw}/><circle cx="11" cy="8.5" r="1" fill={c}/></svg>);
    case 'currency-usd':   return (<svg width={s} height={s} viewBox="0 0 16 16"><text x="8" y="13" textAnchor="middle" fontFamily="-apple-system, system-ui" fontWeight="700" fontSize="14" fill={c}>$</text></svg>);
    case 'currency-eur':   return (<svg width={s} height={s} viewBox="0 0 16 16"><text x="8" y="13" textAnchor="middle" fontFamily="-apple-system, system-ui" fontWeight="700" fontSize="14" fill={c}>€</text></svg>);
    case 'currency-gbp':   return (<svg width={s} height={s} viewBox="0 0 16 16"><text x="8" y="13" textAnchor="middle" fontFamily="-apple-system, system-ui" fontWeight="700" fontSize="14" fill={c}>£</text></svg>);
    case 'bulb':           return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M5 11a3 3 0 016 0v1H5v-1zM6 14h4M6.5 13.2h3" stroke={c} strokeWidth={sw} strokeLinecap="round"/><circle cx="8" cy="6" r="3.5" stroke={c} strokeWidth={sw}/></svg>);
    case 'coffee':         return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M3 6h9v5a3 3 0 01-3 3H6a3 3 0 01-3-3V6zM12 7h2a1.5 1.5 0 010 3h-2M5 2.5l-0.5 2M8 2.5l-0.5 2M11 2.5l-0.5 2" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'pay':            return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke={c} strokeWidth={sw}/><text x="8" y="11.5" textAnchor="middle" fontSize="8" fontWeight="700" fill={c}>$</text></svg>);
    case 'shopping':       return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M3 6h10l-1 8H4L3 6zM6 6V4a2 2 0 014 0v2" stroke={c} strokeWidth={sw} strokeLinejoin="round"/></svg>);
    case 'book':           return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M2.5 3a1 1 0 011-1H13v12H3.5a1 1 0 01-1-1V3z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/><path d="M2.5 12.5a1 1 0 011-1H13" stroke={c} strokeWidth={sw}/></svg>);
    case 'camera':         return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><rect x="2" y="5" width="12" height="9" rx="1.5" stroke={c} strokeWidth={sw}/><circle cx="8" cy="9.5" r="2.5" stroke={c} strokeWidth={sw}/><path d="M6 5l1-2h2l1 2" stroke={c} strokeWidth={sw} strokeLinejoin="round"/></svg>);
    case 'headphones':     return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M2 11V8a6 6 0 0112 0v3M2 11h2v3H2.5a0.5 0.5 0 01-0.5-0.5V11zM12 11h2v2.5a0.5 0.5 0 01-0.5 0.5H12v-3z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/></svg>);
    case 'circle':         return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke={c} strokeWidth={sw}/><circle cx="8" cy="8" r="2" fill={c}/></svg>);
    case 'flask':          return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M6 2v4L3 12.5a1 1 0 00.9 1.5h8.2a1 1 0 00.9-1.5L10 6V2M5.5 2h5" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'fire':           return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 1.5C6 4.5 4 6 4 9a4 4 0 008 0c0-2-1.5-3-2.5-5C9 5 8 4 8 1.5z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/></svg>);
    case 'laptop':         return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><rect x="3" y="3" width="10" height="7" rx="1" stroke={c} strokeWidth={sw}/><path d="M1.5 12h13l-1 1.5H2.5L1.5 12z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/></svg>);
    case 'bell':           return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M4 11h8l-1-2V7a3 3 0 00-6 0v2l-1 2zM6.5 13h3" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'rocket':         return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 1.5C5 4 4.5 6.5 4.5 9l1.5 1.5h4L11.5 9c0-2.5-.5-5-3.5-7.5ZM4.5 11l-2 2.5 3-.5M11.5 11l2 2.5-3-.5" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/><circle cx="8" cy="6.5" r="1.3" stroke={c} strokeWidth={sw}/></svg>);
    case 'diamond':        return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M2 6l3-3.5h6L14 6l-6 8L2 6zM2 6h12M5 2.5L8 6l3-3.5" stroke={c} strokeWidth={sw} strokeLinejoin="round"/></svg>);
    case 'scissor':        return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="4" cy="11" r="2" stroke={c} strokeWidth={sw}/><circle cx="12" cy="11" r="2" stroke={c} strokeWidth={sw}/><path d="M5.5 9.5L13.5 1.5M10.5 9.5L2.5 1.5" stroke={c} strokeWidth={sw} strokeLinecap="round"/></svg>);
    case 'sliders':        return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke={c} strokeWidth={sw} strokeLinecap="round"/><circle cx="5" cy="4" r="1.5" fill={TOKENS.surface} stroke={c} strokeWidth={sw}/><circle cx="10" cy="8" r="1.5" fill={TOKENS.surface} stroke={c} strokeWidth={sw}/><circle cx="6" cy="12" r="1.5" fill={TOKENS.surface} stroke={c} strokeWidth={sw}/></svg>);
    case 'team':           return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="5" cy="6" r="2" stroke={c} strokeWidth={sw}/><circle cx="11" cy="6" r="2" stroke={c} strokeWidth={sw}/><path d="M2 13.5c0-2 1.5-3.5 3-3.5s3 1.5 3 3.5M8 13.5c0-2 1.5-3.5 3-3.5s3 1.5 3 3.5" stroke={c} strokeWidth={sw}/></svg>);
    case 'wrench':         return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M11.5 3a3 3 0 11-2.5 4.5L3 13.5l-1-1 6-6A3 3 0 0111.5 3z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/></svg>);
    case 'truck':          return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><rect x="1" y="5" width="8" height="6" rx="0.5" stroke={c} strokeWidth={sw}/><path d="M9 7h3.5L15 9.5V11H9V7z" stroke={c} strokeWidth={sw} strokeLinejoin="round"/><circle cx="4" cy="12.5" r="1.2" stroke={c} strokeWidth={sw}/><circle cx="12" cy="12.5" r="1.2" stroke={c} strokeWidth={sw}/></svg>);
    case 'unlock':         return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><rect x="3" y="7.5" width="10" height="6.5" rx="1" stroke={c} strokeWidth={sw}/><path d="M5.5 7.5V5a2.5 2.5 0 015 0" stroke={c} strokeWidth={sw}/></svg>);
    case 'warning':        return (<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 2L14.5 13.5H1.5L8 2zM8 6.5v3M8 11.5v0.3" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>);

    default: return null;
  }
}

// ─── DynamicIconById ─── 名稱與 impl src/components/DynamicIcon.tsx 一致
// ICON_LIBRARY 全部為 phosphor svg；用 numeric id 找到 glyph，
// 再透過 PhosphorIcon（CSS mask 載入 project/assets/icons/phosphor/<glyph>.svg）渲染。
// CSS mask 把單色 svg 視為 mask，backgroundColor 套色，等效於 impl react-native-svg
// 的 fill 行為。impl 端 DynamicIconById 內部則交給 DynamicIcon 透過 PHOSPHOR_SVG_MAP
// 渲染同一份 Phosphor SVG 資產。
// 幣別符號 icon：glyph = 幣別代碼，symbol 由 CURRENCY_SYMBOLS_ALL 推導，用文字排版。
// 字重 400（design 定案）；多字元（NT$ / CHF / kr…）自動縮小。對齊 impl renderCurrencyIcon。
function CurrencyGlyph({ code, size = 24, color = TOKENS.ink }) {
  const list = (typeof window !== 'undefined' && window.CURRENCY_SYMBOLS_ALL) || [];
  const found = list.find(c => c.code === code);
  const symbol = found ? found.symbol : code;
  const len = [...symbol].length;
  const fontSize = Math.round(size * (len <= 1 ? 0.94 : len === 2 ? 0.62 : 0.46));
  return (
    <div style={{
      width: size, height: size, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif',
      fontSize, fontWeight: 400, lineHeight: 1, color,
      letterSpacing: len > 2 ? '-0.04em' : 0,
    }}>{symbol}</div>
  );
}

function DynamicIconById({ iconId, size = 24, color = TOKENS.ink }) {
  const def = ICON_BY_ID[iconId];
  if (!def) return <Glyph name="help" size={size} color={color}/>;
  if (def.library === 'currency') return <CurrencyGlyph code={def.glyph} size={size} color={color}/>;
  return <PhosphorIcon glyph={def.glyph} size={size} color={color}/>;
}

function PhosphorIcon({ glyph, size = 24, color = TOKENS.ink }) {
  const url = `assets/icons/phosphor/${glyph}.svg`;
  return (
    <div style={{
      width: size, height: size, flexShrink: 0,
      WebkitMaskImage: `url(${url})`, maskImage: `url(${url})`,
      WebkitMaskSize: 'contain',     maskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',  maskPosition: 'center',
      backgroundColor: color,
    }}/>
  );
}

// ─── IconOutline ─── PeriodPage 的 section icon 容器
// impl 是 32×32 純對齊容器（無 border），但保留 prop 允許覆蓋
function IconOutline({ iconId, glyph, size = TX_LIST_TOKENS.ICON_OUTLINE_SIZE, color = TOKENS.p500, withBorder = false }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: withBorder ? TX_LIST_TOKENS.ICON_OUTLINE_RADIUS : 0,
      border: withBorder ? `${TX_LIST_TOKENS.ICON_OUTLINE_BORDER_WIDTH}px solid ${TOKENS.divider}` : 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      {iconId ? <DynamicIconById iconId={iconId} size={Math.round(size * 0.56)} color={color}/>
              : <Glyph name={glyph || 'help'} size={Math.round(size * 0.56)} color={color}/>}
    </div>
  );
}

// ─── GlassView ─── 對齊 src/components/GlassView.tsx
// iOS BlurView 模擬：CSS backdrop-filter
function GlassView({ children, style = {}, blurAmount, tint, border = true, pill = false }) {
  const amount = blurAmount ?? GLASS.blurAmount;
  const t = tint ?? GLASS.tint;
  return (
    <div style={{
      position: 'relative',
      background: t,
      backdropFilter: `blur(${amount}px) saturate(180%)`,
      WebkitBackdropFilter: `blur(${amount}px) saturate(180%)`,
      border: border ? `1px solid ${GLASS.border}` : 'none',
      boxShadow: `0 4px 12px rgba(0,0,0,${GLASS.shadowOpacity})`,
      borderRadius: pill ? RADIUS.full : undefined,
      ...style,
    }}>{children}</div>
  );
}

// ─── ListGroupCard ─── 對齊 src/components/list/ListGroupCard.tsx
// overflow: hidden 會把第一個 ListItem 的 borderTop hairline 切掉。
// 不畫外框：impl 端 borderWidth = StyleSheet.hairlineWidth + 淡色 hairline，
// 真機渲染下幾乎不可見；design canvas 在 React Web 無法解析 hairlineWidth，
// 若硬寫 1px 反而呈現視覺上不存在的黑邊，故 canvas 端一律不畫。
function ListGroupCard({ children, style = {} }) {
  return (
    <div style={{
      background: TOKENS.surface,
      borderRadius: LIST_TOKENS.GROUP_CARD_RADIUS,
      overflow: 'hidden',
      marginBottom: LIST_TOKENS.GROUP_CARD_MARGIN_BOTTOM,
      ...style,
    }}>{children}</div>
  );
}
// 老命名 alias
const GroupCard = ListGroupCard;

// ─── ListSection ─── 對齊 src/components/list/ListSection.tsx
// title 可選，無 title 時只是個容器（impl 大多沒 title）
function ListSection({ title, children, style = {} }) {
  return (
    <div style={style}>
      {title && <ListSectionTitle>{title}</ListSectionTitle>}
      {children}
    </div>
  );
}

// ListSectionTitle 為 ListSection 的內部 helper，不對外 export。
// impl 端 ListSection 將 title 內嵌為 prop、無單獨 export，Design 與其對齊。
function ListSectionTitle({ children }) {
  return (
    <div style={{
      fontSize: LIST_TOKENS.SECTION_TITLE_SIZE,
      color: TOKENS.ink2,
      fontWeight: LIST_TOKENS.SECTION_TITLE_WEIGHT,
      letterSpacing: LIST_TOKENS.SECTION_TITLE_LETTER_SPACING,
      paddingLeft: LIST_TOKENS.SECTION_TITLE_PADDING_HORIZONTAL,
      paddingRight: LIST_TOKENS.SECTION_TITLE_PADDING_HORIZONTAL,
      paddingTop: LIST_TOKENS.SECTION_TITLE_PADDING_TOP,
      paddingBottom: LIST_TOKENS.SECTION_TITLE_PADDING_BOTTOM,
      textTransform: 'uppercase',
    }}>{children}</div>
  );
}

// ─── ListItem ─── 對齊 src/components/list/ListItem.tsx
// 每個 row 都有 borderTop hairline，第一個被 GroupCard 的 overflow: hidden 切掉
// 不需要 isLast prop
function ListItem({ leftIcon, title, titleColor, subtitle, value, showChevron, trailing, onPress, disabled, style = {} }) {
  const [pressed, setPressed] = React.useState(false);
  const resolvedTitleColor = disabled ? TOKENS.ink3 : (titleColor || TOKENS.ink);
  const trailingContent = trailing ?? ((value !== undefined || showChevron) ? (
    <>
      {value !== undefined && (
        <span style={{ fontSize: LIST_TOKENS.TRAILING_VALUE_SIZE, color: TOKENS.ink2 }}>{value}</span>
      )}
      {showChevron && (
        <div style={{ marginLeft: value !== undefined ? 6 : 0 }}>
          <Glyph name="chevron.right" size={LIST_TOKENS.TRAILING_CHEVRON_SIZE} color={TOKENS.ink3} stroke={2.5}/>
        </div>
      )}
    </>
  ) : null);
  return (
    <div
      onClick={disabled ? undefined : onPress}
      onPointerDown={() => !disabled && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        display: 'flex', alignItems: 'center',
        minHeight: LIST_TOKENS.ITEM_MIN_HEIGHT,
        paddingTop: LIST_TOKENS.ITEM_PADDING_VERTICAL,
        paddingBottom: LIST_TOKENS.ITEM_PADDING_VERTICAL,
        paddingLeft: LIST_TOKENS.ITEM_PADDING_HORIZONTAL,
        paddingRight: LIST_TOKENS.ITEM_PADDING_HORIZONTAL,
        background: pressed && !disabled ? TOKENS.surface2 : TOKENS.surface,
        borderTop: `0.5px solid ${TOKENS.hairline}`,
        cursor: onPress && !disabled ? 'pointer' : 'default',
        userSelect: 'none',
        ...style,
      }}>
      {leftIcon && (
        <div style={{ marginRight: LIST_TOKENS.ITEM_GAP_HORIZONTAL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {leftIcon}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: LIST_TOKENS.ITEM_TITLE_SIZE,
          fontWeight: LIST_TOKENS.ITEM_TITLE_WEIGHT,
          color: resolvedTitleColor,
          letterSpacing: LIST_TOKENS.ITEM_TITLE_LETTER_SPACING,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{title}</div>
        {subtitle && (
          <div style={{ fontSize: 13, color: TOKENS.ink2, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</div>
        )}
      </div>
      {trailingContent && (
        <div style={{ marginLeft: LIST_TOKENS.ITEM_GAP_HORIZONTAL, display: 'flex', alignItems: 'center' }}>
          {trailingContent}
        </div>
      )}
    </div>
  );
}

// ─── DataListItem ─── 對齊 src/components/list/DataListItem.tsx
// 與 ListItem 差異：trailing 為 value + valueSubtext 垂直堆疊（顯示資料數值與輔助文字）
// 無 chevron / titleColor / disabled，主要用於「左 icon + 中 title/subtitle + 右 value/valueSubtext」資料列
function DataListItem({ leftIcon, title, subtitle, value, valueColor, valueSubtext, onPress, onLongPress, style = {} }) {
  const [pressed, setPressed] = React.useState(false);
  const interactive = !!(onPress || onLongPress);
  return (
    <div
      onClick={onPress}
      onPointerDown={() => interactive && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        display: 'flex', alignItems: 'center',
        minHeight: LIST_TOKENS.ITEM_MIN_HEIGHT,
        paddingTop: LIST_TOKENS.ITEM_PADDING_VERTICAL,
        paddingBottom: LIST_TOKENS.ITEM_PADDING_VERTICAL,
        paddingLeft: LIST_TOKENS.ITEM_PADDING_HORIZONTAL,
        paddingRight: LIST_TOKENS.ITEM_PADDING_HORIZONTAL,
        background: pressed && interactive ? TOKENS.surface2 : TOKENS.surface,
        borderTop: `0.5px solid ${TOKENS.hairline}`,
        cursor: interactive ? 'pointer' : 'default',
        userSelect: 'none',
        ...style,
      }}>
      {leftIcon && (
        <div style={{ marginRight: LIST_TOKENS.ITEM_GAP_HORIZONTAL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {leftIcon}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: LIST_TOKENS.ITEM_TITLE_SIZE,
          fontWeight: LIST_TOKENS.ITEM_TITLE_WEIGHT,
          color: TOKENS.ink,
          letterSpacing: LIST_TOKENS.ITEM_TITLE_LETTER_SPACING,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{title}</div>
        {subtitle && (
          <div style={{ fontSize: 13, color: TOKENS.ink2, marginTop: SPACING['2xs'], whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</div>
        )}
      </div>
      {value !== undefined && (
        <div style={{ marginLeft: LIST_TOKENS.ITEM_GAP_HORIZONTAL, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{
            fontSize: LIST_TOKENS.TRAILING_VALUE_SIZE,
            color: valueColor || TOKENS.ink,
            whiteSpace: 'nowrap',
          }}>{value}</span>
          {valueSubtext && (
            <span style={{ fontSize: 13, color: TOKENS.ink2, marginTop: SPACING['2xs'], whiteSpace: 'nowrap' }}>{valueSubtext}</span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── SelectionListItem ─── 對齊 src/components/list/SelectionListItem.tsx
// 右側 FontAwesome "check" 16px primary，selected 才出現
function SelectionListItem({ leftIcon, title, subtitle, selected, onPress, disabled, style = {} }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div
      onClick={disabled ? undefined : onPress}
      onPointerDown={() => !disabled && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        display: 'flex', alignItems: 'center',
        minHeight: LIST_TOKENS.ITEM_MIN_HEIGHT,
        paddingTop: LIST_TOKENS.ITEM_PADDING_VERTICAL,
        paddingBottom: LIST_TOKENS.ITEM_PADDING_VERTICAL,
        paddingLeft: LIST_TOKENS.ITEM_PADDING_HORIZONTAL,
        paddingRight: LIST_TOKENS.ITEM_PADDING_HORIZONTAL,
        background: pressed && !disabled ? TOKENS.surface2 : TOKENS.surface,
        borderTop: `0.5px solid ${TOKENS.hairline}`,
        cursor: onPress && !disabled ? 'pointer' : 'default',
        userSelect: 'none', opacity: disabled ? 0.5 : 1, ...style,
      }}>
      {leftIcon && (
        <div style={{ marginRight: LIST_TOKENS.ITEM_GAP_HORIZONTAL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{leftIcon}</div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: LIST_TOKENS.ITEM_TITLE_SIZE,
          fontWeight: LIST_TOKENS.ITEM_TITLE_WEIGHT,
          color: disabled ? TOKENS.ink3 : TOKENS.ink, letterSpacing: LIST_TOKENS.ITEM_TITLE_LETTER_SPACING,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: TOKENS.ink2, marginTop: 2 }}>{subtitle}</div>}
      </div>
      <div style={{ marginLeft: LIST_TOKENS.ITEM_GAP_HORIZONTAL, width: LIST_TOKENS.SELECTION_CHECKMARK_SIZE, alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
        {selected && <Glyph name="check" size={LIST_TOKENS.SELECTION_CHECKMARK_SIZE} color={TOKENS.p500} stroke={2.4}/>}
      </div>
    </div>
  );
}

// ─── ReorderableListItem ─── 對齊 src/components/list/ReorderableListItem.tsx
// NO drag handle icon — 整列拖拉，靠手勢觸發
// height 由 caller style 控制
// Pressed 視覺與其他 list 元件一致（surface_hover）；impl 受外層 AutoDragSortableView
// 拘束，用 onTouchStart/onTouchEnd 而非 Pressable 觸發 pressed，避免搶 responder lock
function ReorderableListItem({ leftIcon, title, subtitle, trailing, style = {} }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        display: 'flex', alignItems: 'center',
        paddingLeft: LIST_TOKENS.ITEM_PADDING_HORIZONTAL,
        paddingRight: LIST_TOKENS.ITEM_PADDING_HORIZONTAL,
        background: pressed ? TOKENS.surface2 : TOKENS.surface,
        borderTop: `0.5px solid ${TOKENS.hairline}`,
        cursor: 'pointer',
        userSelect: 'none', ...style,
      }}>
      {leftIcon && (
        <div style={{ marginRight: LIST_TOKENS.ITEM_GAP_HORIZONTAL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{leftIcon}</div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: LIST_TOKENS.ITEM_TITLE_SIZE,
          fontWeight: LIST_TOKENS.ITEM_TITLE_WEIGHT,
          color: TOKENS.ink, letterSpacing: LIST_TOKENS.ITEM_TITLE_LETTER_SPACING,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: TOKENS.ink2, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {trailing && <div style={{ marginLeft: LIST_TOKENS.ITEM_GAP_HORIZONTAL }}>{trailing}</div>}
    </div>
  );
}

// ─── SelectionGridItem ─── 對齊 src/components/list/SelectionGridItem.tsx
// Card 風格：preview aspectRatio 1.4 + title 下方 + check-circle 在右上角
function SelectionGridItem({ title, selected, onPress, children, style = {} }) {
  return (
    <div onClick={onPress} style={{
      flex: 1, background: TOKENS.surface,
      borderRadius: LIST_TOKENS.GROUP_CARD_RADIUS,
      padding: LIST_TOKENS.ITEM_PADDING_HORIZONTAL,
      position: 'relative', overflow: 'hidden',
      cursor: 'pointer', boxSizing: 'border-box',
      ...style,
    }}>
      <div style={{
        width: '100%', aspectRatio: 1.4,
        borderRadius: RADIUS.sm, overflow: 'hidden',
        marginBottom: LIST_TOKENS.ITEM_PADDING_VERTICAL,
        display: 'flex', flexDirection: 'row',
      }}>{children}</div>
      <div style={{
        fontSize: LIST_TOKENS.ITEM_TITLE_SIZE,
        fontWeight: LIST_TOKENS.ITEM_TITLE_WEIGHT,
        color: TOKENS.ink, letterSpacing: LIST_TOKENS.ITEM_TITLE_LETTER_SPACING,
      }}>{title}</div>
      {selected && (
        <div style={{ position: 'absolute', top: 8, right: 8 }}>
          <Glyph name="check-circle" size={LIST_TOKENS.SELECTION_CHECKMARK_SIZE + 4} color={TOKENS.p500}/>
        </div>
      )}
    </div>
  );
}

// ─── ListEmptyState ─── 對齊 src/components/list/ListEmptyState.tsx
// 預設 icon: MCI "magnify"；caller 可傳 icon React 節點覆蓋預設 Glyph 渲染。
// icon === null 時不渲染 iconWrapper（與 impl 對齊：{iconNode ? <View>...</View> : null}）。
function ListEmptyState({ icon, iconName = 'magnify', title, description }) {
  const iconNode = icon !== undefined
    ? icon
    : <Glyph name={iconName} size={LIST_TOKENS.EMPTY_STATE_ICON_SIZE} color={TOKENS.ink3} stroke={1.5}/>;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      paddingLeft: LIST_TOKENS.EMPTY_STATE_PADDING_HORIZONTAL,
      paddingRight: LIST_TOKENS.EMPTY_STATE_PADDING_HORIZONTAL,
    }}>
      {iconNode ? (
        <div style={{ marginBottom: LIST_TOKENS.EMPTY_STATE_ICON_GAP }}>
          {iconNode}
        </div>
      ) : null}
      <div style={{
        fontSize: LIST_TOKENS.EMPTY_STATE_TITLE_SIZE,
        color: TOKENS.ink2, textAlign: 'center',
        lineHeight: 1.4,
      }}>{title}</div>
      {description && <div style={{
        fontSize: LIST_TOKENS.EMPTY_STATE_DESCRIPTION_SIZE,
        color: TOKENS.ink3, textAlign: 'center',
        marginTop: LIST_TOKENS.EMPTY_STATE_TEXT_GAP, lineHeight: 1.4,
      }}>{description}</div>}
    </div>
  );
}
const EmptyState = ListEmptyState;

// ─── ListEmptyTransition ─── 對齊 src/components/list/ListEmptyTransition.tsx
// 列表內容與空狀態的 crossfade 容器。duration 預設取 LIST_EMPTY_TRANSITION.DURATION_MS。
// 兩層 absolute 疊放，依 isEmpty 切換 opacity，達到淡入淡出效果。
function ListEmptyTransition({
  isEmpty,
  emptyState,
  children,
  topInset = 0,
  bottomInset = 0,
  duration = LIST_EMPTY_TRANSITION.DURATION_MS,
}) {
  const layerStyle = {
    position: 'absolute',
    top: topInset, bottom: bottomInset,
    left: 0, right: 0,
    transition: `opacity ${duration}ms ${LIST_EMPTY_TRANSITION.EASING}`,
  };
  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <div style={{
        ...layerStyle,
        opacity: isEmpty ? 0 : 1,
        pointerEvents: isEmpty ? 'none' : 'auto',
      }}>
        {children}
      </div>
      <div style={{
        ...layerStyle,
        opacity: isEmpty ? 1 : 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: isEmpty ? 'auto' : 'none',
      }}>
        {emptyState}
      </div>
    </div>
  );
}

// ─── NavHeader ─── 視覺參考，不對外 export
// impl 採 React Navigation 原生 createNativeStackNavigator，本函式不再被 showcase
// 或 screens 引用。視覺規格已搬遷到 Components · Navigation 的「Native Header
// Configuration」政策卡片。保留函式本體僅為歷史視覺參考，未來可移除。
function NavHeader({ title, leadingText, leadingAction, trailing }) {
  // iOS 26 系統在 navigation native header 內自動為 bar button 渲染 Liquid Glass pill。
  // design canvas 為反映 device 真實視覺，leading（back）採 MockBackButtonPill，
  // trailing 則由 caller 用 HeaderButtonPill 傳入。
  //
  // Layout：
  //   - paddingLeft/Right: 16（iOS system margin）
  //   - leading / trailing 兩段 flex:1 各靠左/右，內含 button minHeight 32 居中
  //   - title 用 absolute 覆蓋整 nav bar 內容區（top: 60 + height: 32）+ flex center
  //     →  與 button vertical center 對齊；水平 viewport 中央；button 撞到時 ellipsis
  //   - pointerEvents:none 讓 title 不擋 button 點擊
  return (
    <div style={{
      paddingTop: 60, paddingBottom: 8, paddingLeft: 16, paddingRight: 16,
      display: 'flex', alignItems: 'center',
      background: 'transparent',
      position: 'relative', zIndex: 5,
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', minHeight: 32 }}>
        {leadingText !== undefined && (
          <button onClick={leadingAction} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 0, display: 'flex', alignItems: 'center',
            fontFamily: 'inherit',
          }}>
            <MockBackButtonPill/>
          </button>
        )}
      </div>
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 60, height: 32,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <span style={{
          fontSize: 17, fontWeight: TYPOGRAPHY.weight.medium, color: TOKENS.ink,
          whiteSpace: 'nowrap', maxWidth: '60%',
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{title}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, minHeight: 32 }}>
        {trailing}
      </div>
    </div>
  );
}

// ─── ModalHeader ─── 視覺參考，不對外 export
// impl 用 React Navigation presentation: 'fullScreenModal' + headerLeft = ModalCloseButton
// （Editor Modal 加 headerRight = HeaderCheckmarkButton）。視覺規格搬遷到 Components ·
// Navigation 的「Native Header Configuration」政策卡片。
function ModalHeader({ title, onClose, onSave, saveDisabled }) {
  // iOS 26 系統在 navigation native modal header 內自動為 bar button 渲染 Liquid Glass pill。
  // design canvas 為反映 device 真實視覺，close 與 save 都包進 HeaderButtonPill。
  // Layout 規則同 NavHeader：padding-x 16、title absolute 覆蓋 nav bar 區 + flex center 與 button 對齊。
  return (
    <div style={{
      paddingTop: 60, paddingBottom: 8, paddingLeft: 16, paddingRight: 16,
      display: 'flex', alignItems: 'center',
      background: 'transparent', position: 'relative', zIndex: 5,
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', minHeight: 32 }}>
        <HeaderButtonPill symbols={['xmark']} intent="dismiss" onPress={onClose}/>
      </div>
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 60, height: 32,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <span style={{
          fontSize: 17, fontWeight: TYPOGRAPHY.weight.medium, color: TOKENS.ink,
          whiteSpace: 'nowrap', maxWidth: '60%',
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{title}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minHeight: 32 }}>
        {onSave && (
          <HeaderButtonPill
            symbols={['checkmark']}
            intent="commit"
            color={saveDisabled ? TOKENS.ink3 : undefined}
            onPress={!saveDisabled ? onSave : undefined}/>
        )}
      </div>
    </div>
  );
}

// ─── ModalCloseButton ─── 對齊 src/components/ModalCloseButton.tsx
// SFSymbol "xmark" 17px semibold，padding 10×10
function ModalCloseButton({ onPress }) {
  return (
    <button onClick={onPress} style={{
      border: 'none', background: 'transparent', cursor: 'pointer',
      padding: '10px 10px', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <Glyph name="xmark" size={17} color={TOKENS.ink} stroke={2.4}/>
    </button>
  );
}

// ─── HeaderCheckmarkButton ─── 對齊 src/components/HeaderCheckmarkButton.tsx
// SFSymbol "checkmark" 17px semibold，padding 10×10，color primary.main（disabled 用 text.disabled）
function HeaderCheckmarkButton({ onPress, disabled }) {
  return (
    <button onClick={onPress} disabled={disabled} style={{
      border: 'none', background: 'transparent',
      cursor: disabled ? 'default' : 'pointer',
      padding: '10px 10px', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      opacity: disabled ? 0.5 : 1,
    }}>
      <Glyph name="checkmark" size={17} color={disabled ? TOKENS.ink3 : TOKENS.p500} stroke={2.4}/>
    </button>
  );
}

// ─── HeaderIconButton ─── 對齊 src/components/HeaderIconButton.tsx
// 接 SF symbol name，color 預設 label（ink）；customView 採 CONTENT_BOX 正方形容器
// 以對齊 iOS 26 Liquid Glass bar button item 自動 pill 行為：單 icon → 正圓、
// 多 icon row（headerRight 多顆並排）→ 膠囊內 icon 均勻置中。
function HeaderIconButton({ symbol, onPress, color }) {
  return (
    <button onClick={onPress} style={{
      border: 'none', background: 'transparent', cursor: 'pointer',
      padding: 0, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width:  HEADER_ICON_BUTTON_TOKENS.CONTENT_BOX,
        height: HEADER_ICON_BUTTON_TOKENS.CONTENT_BOX,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Glyph
          name={symbol}
          size={HEADER_ICON_BUTTON_TOKENS.SYMBOL_SIZE}
          color={color || TOKENS.ink}
          stroke={2.4}
        />
      </div>
    </button>
  );
}

// ─── HeaderButtonPill ─── design canvas mock，視覺對齊 impl iOS 26 UIKit shared background pill
// 不再 wrap GlassView（GlassView 是「白玻璃片」風格——白底 55%、1px 白邊、4px shadow；
// 跟 iOS 26 navigation bar button 的 systemFill 淡灰半透明風格差距明顯）。
// 改用 iOS systemFill 風格 background，無 border、無 shadow，更接近實機視覺。
//
// 多 icon（HomeScreen 右上 search + settings）共用同一 shared background 形成單一膠囊，
// icon 之間無視覺 gap——對應 UIKit 自動把多個 rightBarButtonItem grouping 為 shared pill 的行為。
//
// Props：
//   - symbols: SF Symbol 名稱陣列（1 個 → 正圓、>=2 → 橫向膠囊）
//   - intent: 'commit' | 'action' | 'dismiss'（同時驅動 color；impl 端對應 prop 同名）
//   - color: 顯式覆寫 icon 顏色（測試 / 例外情境用；正常呼叫端用 intent 即可）
//   - customViewSize: 單一 button 邊長，預設 HEADER_ICON_BUTTON_TOKENS.CONTENT_BOX (41)
// MOCK_BG 為 iOS 26 navigation bar systemFill 淡灰半透明的近似值（rgba(118,118,128,0.12)，
// light mode）；design canvas 視覺對齊用，非設計 token。
const HEADER_BUTTON_MOCK_BG = 'rgba(118,118,128,0.12)';
function HeaderButtonPill({ symbols = [], intent = 'action', color, customViewSize, onPress }) {
  const c = color || HEADER_ICON_BUTTON_TOKENS.COLOR_BY_INTENT[intent] || TOKENS.ink;
  const cv = customViewSize ?? HEADER_ICON_BUTTON_TOKENS.CONTENT_BOX;
  const pill = (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'row',
      alignItems: 'center',
      background: HEADER_BUTTON_MOCK_BG,
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderRadius: cv / 2,
    }}>
      {symbols.map((sym, i) => (
        <div key={`${sym}-${i}`} style={{
          width:  cv,
          height: cv,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Glyph
            name={sym}
            size={HEADER_ICON_BUTTON_TOKENS.SYMBOL_SIZE}
            color={c}
            stroke={2.4}
          />
        </div>
      ))}
    </div>
  );
  // 無 onPress 時直接渲染 pill（保留既有 components-showcase 等 caller 行為）；
  // 有 onPress 時自動 wrap button 以利 SCREEN_META 等真實互動使用。
  if (!onPress) return pill;
  return (
    <button onClick={onPress} style={{
      border: 'none', background: 'transparent', cursor: 'pointer', padding: 0,
    }}>
      {pill}
    </button>
  );
}

// ─── MockBackButtonPill ─── design canvas mock，代表返回鍵覆寫後的視覺
// 視覺對齊 HeaderButtonPill 的 systemFill 風格 shared background。
function MockBackButtonPill({ color }) {
  const c = color || HEADER_ICON_BUTTON_TOKENS.COLOR_BY_INTENT.action;
  const cv = HEADER_ICON_BUTTON_TOKENS.CONTENT_BOX;
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: cv,
      height: cv,
      background: HEADER_BUTTON_MOCK_BG,
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderRadius: cv / 2,
    }}>
      <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
        <path d="M8 2L2 8l6 6" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// ─── MockNavBar ─── design canvas mock 容器，無 impl 對應元件
// 對齊 impl AppNavigator.tsx 的 pushScreenOptions：headerTitleStyle fontSize
// TYPE_STYLES.body.size (17) + medium weight + center；headerTransparent: true。
// 三槽 layout：左 slot、中 title (絕對置中)、右 slot。
function MockNavBar({ leftSlot, title, rightSlot }) {
  return (
    <div style={{
      height: 44,
      paddingLeft: SPACING.sm, paddingRight: SPACING.sm,
      display: 'flex', alignItems: 'center',
      position: 'relative',
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        {leftSlot}
      </div>
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        fontSize: TYPE_STYLES.body.size,
        fontWeight: TYPOGRAPHY.weight.medium,
        color: TOKENS.ink,
        whiteSpace: 'nowrap',
      }}>{title}</div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {rightSlot}
      </div>
    </div>
  );
}

// ─── HeaderMockFrame ─── design canvas mock 容器，無 impl 對應元件
// 「裁出 header 那一條」的虛擬容器：頂部 IOSStatusBar（reuse 自 90_workbench/
// ios-frame.jsx）+ children (nav bar) + 下方 content tail（mock list row，
// 讓 Liquid Glass pill 的 backdrop-filter blur 看得出穿透）。
// 無 device frame 外框、無 dynamic island、無 home indicator；聚焦 header。
function HeaderMockFrame({ children, contentTail }) {
  const defaultTail = (
    <div style={{
      paddingLeft: SPACING.lg, paddingRight: SPACING.lg, paddingTop: SPACING.md,
      fontSize: TYPE_STYLES.body.size, color: TOKENS.ink2,
    }}>
      <div style={{
        background: TOKENS.surface, borderRadius: RADIUS.lg,
        padding: `${SPACING.md}px ${SPACING.lg}px`,
        border: `1px solid ${TOKENS.hairline}`,
      }}>背景 content（用於展示 pill blur 穿透）</div>
    </div>
  );
  return (
    <div style={{
      width: 402, height: 160,
      background: TOKENS.bg,
      borderRadius: RADIUS.lg,
      border: `1px solid ${TOKENS.hairline}`,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <IOSStatusBar dark={false}/>
      {children}
      {contentTail !== undefined ? contentTail : defaultTail}
    </div>
  );
}

// ─── DonutChart ─── 對齊 src/components/DonutChart.tsx
// SIZE 260, OUTER 100 INNER 76 thickness 24, CORNER 6, PAD_ANGLE 1deg
// focusedSide（'expense'|'income'|null）：聚焦側弧 outer +focusRadiusDelta /
//   inner −focusRadiusDelta（預設 2）加粗，作為焦點指示。失焦側維持原半徑。
//
// 兩種輸入接口：
//   slices (new, 雙向)：[{ startAngle, endAngle, color, key }]
//     - 由 caller pre-compute；可含負角度（支出側）
//     - 假設 endAngle > startAngle、且 endAngle - startAngle < 2π
//     - 若 slices 提供且 length > 0，優先用這個
//   data (legacy, 單向)：[{ key, value, color }]
//     - 由 DonutChart 內部從 0 順時針累加
//     - 探索 sub-page 仍用此接口
function DonutChart({ data, slices, size = 260, outerRadius = 100, innerRadius = 76, cornerRadius = 6, padAngleDeg = 1, focusedSide = null, focusRadiusDelta = 2, children }) {
  const cx = size / 2, cy = size / 2;
  const padAngleRad = (padAngleDeg * Math.PI) / 180;

  // SVG arc path with 12 點 = 0、CW 為正
  const polar = (r, a) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];

  function arcPath(startAngle, endAngle, ro, ri) {
    if (endAngle <= startAngle) return '';
    const a0 = startAngle, a1 = endAngle;
    const [x0, y0] = polar(ro, a0);
    const [x1, y1] = polar(ro, a1);
    const [x2, y2] = polar(ri, a1);
    const [x3, y3] = polar(ri, a0);
    const largeArc = (a1 - a0) > Math.PI ? 1 : 0;
    return `M ${x0} ${y0} A ${ro} ${ro} 0 ${largeArc} 1 ${x1} ${y1} L ${x2} ${y2} A ${ri} ${ri} 0 ${largeArc} 0 ${x3} ${y3} Z`;
  }

  // 統一產出 renderableSlices: [{ start, end, color, key }]
  let renderableSlices = [];
  if (slices && slices.length > 0) {
    // new 接口
    renderableSlices = slices.map(s => ({
      start: s.startAngle + padAngleRad / 2,
      end: s.endAngle - padAngleRad / 2,
      color: s.color,
      key: s.key,
      side: s.startAngle < 0 ? 'expense' : 'income',
    })).filter(s => s.end - s.start > 0);
  } else if (data && data.length > 0) {
    // legacy 接口：從 0 順時針累加
    const total = data.reduce((s, d) => s + d.value, 0);
    if (total > 0) {
      let acc = 0;
      renderableSlices = data.map(d => {
        const sweep = (d.value / total) * 2 * Math.PI;
        const start = acc + padAngleRad / 2;
        const end = acc + sweep - padAngleRad / 2;
        acc += sweep;
        return { start, end, color: d.color, key: d.key };
      }).filter(s => s.end - s.start > 0);
    }
  }

  if (renderableSlices.length === 0) {
    return (
      <div style={{ width: size, height: size, borderRadius: size / 2, background: TOKENS.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', inset: 0 }}>
        {renderableSlices.map((s, i) => {
          const lifted = focusedSide && s.side === focusedSide;
          const ro = outerRadius + (lifted ? focusRadiusDelta : 0);
          const ri = innerRadius - (lifted ? focusRadiusDelta : 0);
          return (
            <path key={s.key + '_' + i} d={arcPath(s.start, s.end, ro, ri)} fill={s.color} stroke={s.color} strokeWidth={cornerRadius * 0.6} strokeLinejoin="round"/>
          );
        })}
      </svg>
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}

// ─── FocusCard ─── 對齊 src/screens/Home/components/FocusCard.tsx
// padding 12 12, radius lg=12, border 1.5px (transparent inactive)
// inactive: bg surface_hover, swatchBg surface, color text.secondary
// active:   bg surface, swatchBg primary[100], color text.primary
// ─── InlineAmount ─── 橫排「小幣別、大數值」金額（對齊 impl src/components/InlineAmount.tsx）。
// 吃已格式化字串（含幣別符號），splitCurrencyParts 拆後幣別段縮 xs、繼承色；數字段沿用 numberStyle。
// 直排焦點版（donut / 編輯器）走各自結構，不經本元件。
function InlineAmount({ value, numberStyle = {}, currencyStyle = {} }) {
  const { symbol, number } = splitCurrencyParts(value);
  return (
    <span style={numberStyle}>
      {symbol ? <span style={{ fontSize: TYPOGRAPHY.size.xs, ...currencyStyle }}>{symbol}</span> : null}
      {number}
    </span>
  );
}

function FocusCard({ kind, amount, active, onPress, formatAmount }) {
  const iconName = kind === 'expense' ? 'minus' : 'plus';
  return (
    <button onClick={onPress} disabled={active} style={{
      flex: 1, display: 'flex', alignItems: 'center', gap: SPACING.sm,
      paddingTop: SPACING.md, paddingBottom: SPACING.md,
      paddingLeft: SPACING.md, paddingRight: SPACING.md,
      borderRadius: RADIUS.lg,
      borderWidth: 1.5, borderStyle: 'solid',
      borderColor: active ? TOKENS.p500 : 'transparent',
      background: active ? TOKENS.surface : TOKENS.surface2,
      cursor: active ? 'default' : 'pointer', fontFamily: 'inherit',
      boxShadow: `0 1px 2px rgba(0,0,0,${active ? 0.08 : 0.04})`,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: RADIUS.md,
        background: active ? TOKENS.p100 : TOKENS.surface,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Glyph name={iconName} size={14} color={active ? TOKENS.p500 : TOKENS.ink2}/>
      </div>
      <InlineAmount
        value={formatAmount ? formatAmount(amount) : fmt(amount)}
        numberStyle={{
          flex: 1, textAlign: 'right',
          fontSize: TYPOGRAPHY.size.base, fontWeight: TYPOGRAPHY.weight.medium,
          color: active ? TOKENS.ink : TOKENS.ink2,
          fontVariantNumeric: 'tabular-nums',
        }}/>
    </button>
  );
}

// ─── FloatingActionBar ─── 對齊 src/components/FloatingActionBar.tsx
// actions: 208×72 glass pill, bottom SPACING.xl=24, 3 buttons 56×56, paddingHorizontal SPACING.sm=8
// undo (V4 segmented pill): 外層 glass pill height 72（對齊 actions FAB）包兩個內 glass pill height 56 —
//   復原段 [ring 倒數 28 外框 p500 + 固定標籤「復原」base/ink，點擊 onUndoPress 復原]
//   取消段 [X icon 24 p500，點擊 onUndoClose 關閉]；外寬 auto-fit、標籤不隨操作類型變動
function FloatingActionBar({ mode = 'actions', visible = true, onExpensePress, onIncomePress, onTransferPress, remainingTime = 5, onUndoClose, onUndoPress }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: SPACING.xl, left: 0, right: 0,
      display: 'flex', justifyContent: 'center',
      zIndex: 10, pointerEvents: 'none',
      opacity: visible ? 1 : 0, transform: `translateY(${visible ? 0 : 150}px)`,
      transition: 'opacity 200ms, transform 240ms cubic-bezier(0.2, 1.2, 0.4, 1)',
    }}>
      {mode === 'actions' ? (
        <GlassView pill style={{ width: 208, height: 72, pointerEvents: 'auto' }}>
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingLeft: SPACING.sm, paddingRight: SPACING.sm,
          }}>
            <button onClick={onExpensePress} style={fabBtn}><Glyph name="minus" size={ICON_SIZE.md} color={TOKENS.p500}/></button>
            <button onClick={onTransferPress} style={fabBtn}><Glyph name="exchange" size={ICON_SIZE.md} color={TOKENS.p500} stroke={2.4}/></button>
            <button onClick={onIncomePress} style={fabBtn}><Glyph name="plus" size={ICON_SIZE.md} color={TOKENS.p500}/></button>
          </div>
        </GlassView>
      ) : (
        <GlassView pill style={{ height: 72, display: 'flex', alignItems: 'center', gap: SPACING.xs, padding: SPACING.sm, pointerEvents: 'auto' }}>
          <button onClick={onUndoPress} style={undoSegBtn}>
            <GlassView pill style={{ height: 56, display: 'flex', alignItems: 'center', paddingLeft: SPACING.sm, paddingRight: SPACING.lg, gap: SPACING.sm }}>
              <div style={{
                width: 28, height: 28, borderRadius: 14,
                border: `1.5px solid ${TOKENS.p500}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{ fontSize: TYPOGRAPHY.size.sm, fontWeight: TYPOGRAPHY.weight.medium, color: TOKENS.p500 }}>{remainingTime}</span>
              </div>
              <span style={{ fontSize: TYPOGRAPHY.size.base, fontWeight: TYPOGRAPHY.weight.medium, color: TOKENS.ink, whiteSpace: 'nowrap' }}>復原</span>
            </GlassView>
          </button>
          <button onClick={onUndoClose} style={undoSegBtn}>
            <GlassView pill style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Glyph name="x" size={ICON_SIZE.md} color={TOKENS.p500} stroke={2.4}/>
            </GlassView>
          </button>
        </GlassView>
      )}
    </div>
  );
}
const fabBtn = {
  width: 56, height: 56, border: 'none',
  background: 'transparent', cursor: 'pointer',
  borderRadius: RADIUS.full,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const undoSegBtn = {
  border: 'none', background: 'transparent', padding: 0, cursor: 'pointer',
  display: 'flex', alignItems: 'center',
};

// ─── BottomSearchBar ─── 對齊 src/components/BottomSearchBar.tsx
// GlassView pill, MCI "magnify" 20px secondary, no X button (native clearButtonMode)
function BottomSearchBar({ value, onChangeText, placeholder = '搜尋...', autoFocus }) {
  // HTML autoFocus 會觸發瀏覽器 scrollIntoView，把 design canvas 的 vp 容器
  // 程式化捲到 input 位置（overflow:hidden 不擋程式化 scroll），導致整個 canvas
  // 定錨在 input、後續頁面切換也繼承這個 scroll 偏移。改用 ref.focus({ preventScroll: true })
  // 取得 focus 但抑制自動捲動。
  const inputRef = React.useRef(null);
  React.useLayoutEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [autoFocus]);
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      paddingLeft: SEARCH_BAR_TOKENS.PADDING_HORIZONTAL,
      paddingRight: SEARCH_BAR_TOKENS.PADDING_HORIZONTAL,
      paddingTop: SEARCH_BAR_TOKENS.PADDING_VERTICAL,
      paddingBottom: SEARCH_BAR_TOKENS.PADDING_VERTICAL,
      zIndex: 10, pointerEvents: 'box-none',
    }}>
      <GlassView pill style={{ height: SEARCH_BAR_TOKENS.PILL_HEIGHT }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          height: '100%',
          paddingLeft: SEARCH_BAR_TOKENS.PILL_PADDING_HORIZONTAL,
          paddingRight: SEARCH_BAR_TOKENS.PILL_PADDING_HORIZONTAL,
          gap: SEARCH_BAR_TOKENS.ICON_GAP,
        }}>
          <Glyph name="magnify" size={SEARCH_BAR_TOKENS.ICON_SIZE} color={TOKENS.ink2} stroke={2}/>
          <input ref={inputRef} value={value || ''} onChange={(e) => onChangeText && onChangeText(e.target.value)}
            placeholder={placeholder}
            style={{
              flex: 1, border: 'none', outline: 'none',
              background: 'transparent',
              fontSize: SEARCH_BAR_TOKENS.INPUT_FONT_SIZE,
              color: TOKENS.ink, fontFamily: 'inherit',
              paddingTop: 0, paddingBottom: 0,
            }}/>
        </div>
      </GlassView>
    </div>
  );
}

// ─── CalculatorKeypad ─── 對齊 src/components/CalculatorKeypad.tsx
// 4×4 grid: 1 2 3 + / 4 5 6 - / 7 8 9 × / . 0 = /
// impl 與 design 一致使用 Unicode ×、÷（運算判定見 impl useCalculator.ts 的 ['+', '-', '×', '÷']）
// 左區 4 row × 3 col 數字；右側 operator column 5 鍵（⌫ + - × ÷），
// operator 鍵均分左區 4 row 總高度，每鍵 ≈ 數字鍵 × 0.8（不對稱 grid）。
// container 只排格盤：padding 左右下 CONTAINER_PADDING、上 0。
// 底、分隔線、上緣呼吸（DOCK_PADDING_TOP）由外層 dock 承載（screen 的 keypad
// 容器 / impl AnimatedKeypad），鍵盤自己不畫底與線——單一擁有者，避免雙層冗餘。
// 視覺參數由 KEYPAD_TOKENS 提供（Foundations > Component Tokens > Keypad）。
// 按壓回饋為 Press Feedback 軸 P1 定案：按下磚面染色（數字 p50 / op p100 實色）、
// 按下即時、放開 PRESS_RELEASE_MS 回復；impl 端 press 色由 theme 動態接
// primary[50] / primary[100]。
// 按下時數字鍵玻璃白邊隨磚面一併染透明（蓋掉、不留白圈）、放開隨
// PRESS_RELEASE_MS 淡回；impl 對應：白邊改由獨立 border ring overlay 畫、
// opacity 與 press tint 反向連動。
function CalculatorKeypad({ onPress }) {
  const T = KEYPAD_TOKENS;
  const NUMBER_ROWS = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', '='],
  ];
  // ⌫ 放 operator column 最上鍵，染紫色跟其他 operator 一致
  const OPS = ['⌫', '+', '-', '×', '÷'];
  const TOTAL_H = T.NUM_KEY_HEIGHT * NUMBER_ROWS.length + T.ROW_GAP * (NUMBER_ROWS.length - 1);
  const [pressedKey, setPressedKey] = React.useState(null);

  const keyVisual = (isOp, pressed) => ({
    position: 'absolute', inset: 0,
    borderRadius: T.KEY_RADIUS,
    background: pressed
      ? (isOp ? T.PRESS_TINT_OP : T.PRESS_TINT_NUMBER)
      : (isOp ? T.OP_TINT : GLASS.tint),
    backdropFilter: 'blur(28px) saturate(180%)',
    WebkitBackdropFilter: 'blur(28px) saturate(180%)',
    // 玻璃 highlight 白邊只留數字鍵；op 鍵淡紫底上白邊過搶、拔掉（impl 對應 GlassView border={false}）
    // 按下時白邊染透明、磚面染色鋪到外緣（background painted under border-box），放開淡回
    border: isOp ? 'none' : `1px solid ${pressed ? 'transparent' : GLASS.border}`,
    boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
    transition: pressed ? 'none' : `background ${T.PRESS_RELEASE_MS}ms, border-color ${T.PRESS_RELEASE_MS}ms`,
  });
  const keyLabel = (isOp) => ({
    position: 'relative', zIndex: 1,
    fontSize: T.KEY_FONT_SIZE,
    fontWeight: T.KEY_FONT_WEIGHT,
    color: isOp ? TOKENS.p500 : TOKENS.ink,
  });
  const pressHandlers = (key) => ({
    onMouseDown: () => setPressedKey(key),
    onMouseUp: () => setPressedKey(null),
    onMouseLeave: () => setPressedKey(null),
    onTouchStart: () => setPressedKey(key),
    onTouchEnd: () => setPressedKey(null),
  });

  return (
    <div style={{
      paddingTop: 0,
      paddingLeft: T.CONTAINER_PADDING,
      paddingRight: T.CONTAINER_PADDING,
      paddingBottom: T.CONTAINER_PADDING,
      display: 'flex', flexDirection: 'row',
    }}>
      {/* 數字區 · flex 3 */}
      <div style={{ flex: 3 }}>
        {NUMBER_ROWS.map((row, ri) => (
          <div key={ri} style={{
            display: 'flex', flexDirection: 'row',
            marginBottom: ri === NUMBER_ROWS.length - 1 ? 0 : T.ROW_GAP,
          }}>
            {row.map(k => (
              <button key={k} onClick={() => onPress && onPress(k)} {...pressHandlers(k)} style={{
                flex: 1, height: T.NUM_KEY_HEIGHT,
                marginLeft: T.COL_GAP, marginRight: T.COL_GAP,
                border: 'none', position: 'relative', overflow: 'hidden',
                borderRadius: T.KEY_RADIUS, cursor: 'pointer', fontFamily: 'inherit',
                background: 'transparent', padding: 0,
              }}>
                <div style={keyVisual(false, pressedKey === k)}/>
                <span style={keyLabel(false)}>{k}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
      {/* operator column · flex 1 · 5 鍵均分 TOTAL_H */}
      <div style={{
        flex: 1, marginLeft: T.COL_GAP, marginRight: T.COL_GAP,
        height: TOTAL_H,
        display: 'flex', flexDirection: 'column',
      }}>
        {OPS.map((op, oi) => (
          <button key={op} onClick={() => onPress && onPress(op)} {...pressHandlers(op)} style={{
            flex: 1, width: '100%',
            marginTop: oi === 0 ? 0 : T.ROW_GAP / 2,
            marginBottom: oi === OPS.length - 1 ? 0 : T.ROW_GAP / 2,
            border: 'none', position: 'relative', overflow: 'hidden',
            borderRadius: T.KEY_RADIUS, cursor: 'pointer', fontFamily: 'inherit',
            background: 'transparent', padding: 0,
          }}>
            <div style={keyVisual(true, pressedKey === op)}/>
            <span style={keyLabel(true)}>{op}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Switch ─── 對齊 RN Switch（iOS 樣式）
// impl 用 trackColor false=bg.surface_hover true=primary.main（統一主題色）
function Switch({ value, onChange, trackColorOn = TOKENS.p500 }) {
  return (
    <button onClick={() => onChange && onChange(!value)} style={{
      width: 52, height: 32, borderRadius: 16, border: 'none',
      background: value ? trackColorOn : TOKENS.surface2,
      position: 'relative', cursor: 'pointer', padding: 0,
      transition: 'background 200ms',
    }}>
      <div style={{
        position: 'absolute', top: 2, left: value ? 22 : 2,
        width: 28, height: 28, borderRadius: 14, background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 200ms',
      }}/>
    </button>
  );
}

// 通用 iconBtn 樣式（被 30_screens/ 各 screen 檔引用）
const iconBtn = {
  width: 36, height: 36, border: 'none', background: 'transparent',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};

// ─── AmountField ─── 對齊 src/screens/Transactions/TransferEditorScreen.tsx 內 AmountField
// 雙 editor 共用：TransferEditor 雙欄、TransactionEditor 單欄。
// 改版：active 用 amount 文字色（紫）表達，無 border / no surface / no inline backspace。
// 外層 grouping box 由 caller（TransferEditor 的 DualAmountRow、TransactionEditor 的 AmountRow）提供。
// backspace 由 CalculatorKeypad 的 ⌫ 鍵承接（C-1 排法）。
// 視覺參數由 AMOUNT_FIELD_TOKENS 提供。
function AmountField({ active, value, currency, disabled, onPress }) {
  const T = AMOUNT_FIELD_TOKENS;
  return (
    <div onClick={disabled ? undefined : onPress} style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: T.PADDING,
      height: T.HEIGHT,
      flex: 1,
      cursor: disabled ? 'default' : 'pointer',
    }}>
      <div style={{
        fontSize: T.AMOUNT_SIZE, fontWeight: T.AMOUNT_WEIGHT,
        color: disabled ? TOKENS.ink2
             : active   ? TOKENS.p500
             : value    ? TOKENS.ink
                        : TOKENS.ink3,
        textAlign: 'center', fontVariantNumeric: 'tabular-nums',
      }}>{value || '0.00'}</div>
      {currency && (
        <div style={{
          fontSize: T.CURRENCY_SIZE, color: TOKENS.ink2,
          textAlign: 'center', marginTop: T.CURRENCY_MARGIN_TOP,
        }}>{currency}</div>
      )}
    </div>
  );
}

// ─── StaticWheelPicker ─── design canvas 專用視覺 stub
// impl 對應 src/components/AccountSelector.tsx / CategorySelector.tsx 的 mode='static'：
// 內含 RN native iOS Picker（5 行 wheel：上 2 行 dim 鄰近選項 + 中央 highlighted + 下 2 行 dim 鄰近選項），
// 所有 wheel item fontSize 同 TYPOGRAPHY.size.lg、color 同 theme.text.primary，
// iOS Picker UI 自動把非選中行 visual dim。
//
// design canvas 無法渲染 RN Picker，以三行 div 模擬：
//   - 上 dummy row：fontSize LABEL_SIZE, color TOKENS.ink, opacity DIM_OPACITY
//   - 中 highlighted row：fontSize LABEL_SIZE, color TOKENS.ink, weight medium, opacity 1
//   - 下 dummy row：同上 dummy
// 完全對齊 impl static mode wheel 視覺，無 subLabel 補充資訊（impl static mode 不顯示）。
// noBorder=true：拿掉外框（surface bg / border），保留 wheel 3 行內容與高度。
// 用於 outer-grouping-box 內（如 TransferEditor amount/account 包進外 box，內部 wheel 不再自帶 box）。
function StaticWheelPicker({ label, noBorder = false }) {
  const T = STATIC_WHEEL_PICKER_TOKENS;
  const dimRowStyle = {
    fontSize: T.LABEL_SIZE,
    color: TOKENS.ink,
    opacity: T.DIM_OPACITY,
    height: T.LABEL_SIZE,
  };
  return (
    <div style={{
      flex: 1,
      height: T.HEIGHT,
      background: noBorder ? 'transparent' : TOKENS.surface,
      borderRadius: noBorder ? 0 : T.RADIUS,
      borderWidth: noBorder ? 0 : T.BORDER_WIDTH,
      borderStyle: 'solid', borderColor: TOKENS.border,
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: T.PADDING,
    }}>
      <div style={dimRowStyle}/>
      <div style={{
        fontSize: T.LABEL_SIZE, fontWeight: T.LABEL_WEIGHT,
        color: TOKENS.ink,
        marginTop: T.LABEL_VERTICAL_MARGIN, marginBottom: T.LABEL_VERTICAL_MARGIN,
      }}>{label}</div>
      <div style={dimRowStyle}/>
    </div>
  );
}

// ─── AccountSelector ─── 對齊 src/components/AccountSelector.tsx
// design canvas 預設只實作 mode='static'（picker 常駐顯示），對齊 impl TxEditor/TransferEditor 用法。
// modal mode 在 sandbox 無真實 modal 互動意義，省略。
// impl static mode 內 native Picker 只顯示 category/account name（pickerItems label，subLabel removed），
// 不顯示 currency code / type label 補充資訊。
// noBorder：見 StaticWheelPicker
function AccountSelector({ account, mode = 'static', noBorder = false }) {
  return (
    <StaticWheelPicker label={account.name} noBorder={noBorder}/>
  );
}

// ─── CategorySelector ─── 對齊 src/components/CategorySelector.tsx
// design canvas 預設只實作 mode='static'。
// impl static mode 不顯示 type accent 視覺（getTypeColor() 只用於 modal/inline mode 的 subText）；
// pickerItems 只給 category name，無 type 區分。design 對齊不注入 typeColor。
function CategorySelector({ category, mode = 'static', noBorder = false }) {
  return (
    <StaticWheelPicker label={category.name} noBorder={noBorder}/>
  );
}

// ─── DualPickerBox ─── 對齊 src/components/DualPickerBox.tsx
// 包左右兩個 noBorder static picker + 中間 → 箭頭的橫向外框。
// MergeEditor（來源 → 目標）與 TransferEditor（from → to 帳戶）共用同一視覺。
// conflict=true（如 source === target / from === to）時外框轉 TOKENS.error。
// style 讓 caller 疊外距（如 TransferEditor 的 marginBottom）。
// Token 由 DUAL_PICKER_BOX_TOKENS 提供（no14）。
function DualPickerBox({ left, right, conflict = false, style = {} }) {
  const T = DUAL_PICKER_BOX_TOKENS;
  return (
    <div style={{
      display: 'flex', flexDirection: 'row', alignItems: 'center',
      background: TOKENS.surface,
      borderRadius: T.RADIUS,
      borderWidth: T.BORDER_WIDTH, borderStyle: 'solid',
      borderColor: conflict ? TOKENS.error : TOKENS.border,
      paddingLeft: T.PADDING_HORIZONTAL, paddingRight: T.PADDING_HORIZONTAL,
      ...style,
    }}>
      <div style={{ flex: 1, overflow: 'hidden' }}>{left}</div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingLeft: T.ARROW_GAP, paddingRight: T.ARROW_GAP,
      }}>
        <Glyph name="arrow-right" size={ICON_SIZE.md} color={TOKENS.ink2}/>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>{right}</div>
    </div>
  );
}

// ─── DatePill ─── RecurringOptions「結束於」區段與兩顆 chip 同行的日期欄
// 對齊 impl src/components/RecurringOptions.tsx：與「永不 / 特定日期」chip 並排展示。
// active=false（永不選中時）pill 留在原位置淡出停用，opacity 漸變避免整列寬度跳動。
// 高度透過 PADDING_VERTICAL 與 CHIP_TOKENS.PADDING_VERTICAL 一致（皆 SPACING.sm = 8），
// 與 chip 等高 30pt，在 flex row 內 alignItems:center 並排對齊。
// Token 由 RECURRING_OPTIONS_TOKENS.END_DATE_PILL_* 提供（內嵌於 no11，因唯一用戶為 RecurringOptions）。
function DatePill({ date = '2026/12/31', active = true, onClick }) {
  const R = RECURRING_OPTIONS_TOKENS;
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: R.END_DATE_PILL_ICON_GAP,
      paddingTop:    R.END_DATE_PILL_PADDING_VERTICAL,
      paddingBottom: R.END_DATE_PILL_PADDING_VERTICAL,
      paddingLeft:   R.END_DATE_PILL_PADDING_HORIZONTAL,
      paddingRight:  R.END_DATE_PILL_PADDING_HORIZONTAL,
      background: TOKENS.bg,
      borderRadius: R.END_DATE_PILL_RADIUS,
      borderWidth: R.END_DATE_PILL_BORDER_WIDTH, borderStyle: 'solid', borderColor: TOKENS.border,
      cursor: active ? 'pointer' : 'default', fontFamily: 'inherit',
      opacity: active ? 1 : R.END_DATE_PILL_DISABLED_OPACITY,
      pointerEvents: active ? 'auto' : 'none',
      transition: `opacity ${R.END_DATE_PILL_FADE_DURATION}ms ease`,
    }}>
      <Glyph name="calendar" size={ICON_SIZE.sm} color={TOKENS.ink2} stroke={2}/>
      <span style={{
        fontSize: R.END_DATE_PILL_TEXT_SIZE, color: TOKENS.ink,
        fontWeight: TYPOGRAPHY.weight.medium,
      }}>{date}</span>
    </button>
  );
}

// ─── ConfirmDialog ─── iOS Alert 風格的 native dialog 視覺
// 對齊 impl 透過 React Native `Alert.alert(title, message, [{ text, style, onPress }, ...])`
// 呼叫的對話框（例：src/screens/Transactions/showRecurringModeDialog.ts）。
// design canvas 為靜態 mock，actions 接收 `[{ label, style }]`，style 為
//   'default'     — 一般按鈕（primary 色）
//   'cancel'      — bold 強調（iOS 慣例置於最下）
//   'destructive' — 紅色強調（iOS 慣例置於 default 之上）
//   'preferred'   — 主要動作粗體
//
// 視覺：fixed overlay backdrop（半透明黑）+ 圓角白卡（surface） + 標題 + 訊息 + 分隔線 + 按鈕。
// 按鈕排版：≤2 按鈕水平並排、3+ 按鈕垂直堆疊（對齊 iOS）。
// Token 由 CONFIRM_DIALOG_TOKENS 提供（no12）。
function ConfirmDialog({ title, message, actions = [] }) {
  const D = CONFIRM_DIALOG_TOKENS;
  const stackVertical = actions.length >= 3;

  const renderBtn = (a, i) => (
    <button key={i} onClick={a.onClick} style={{
      flex: 1, border: 'none', background: 'transparent',
      padding: D.BUTTON_PADDING, cursor: 'pointer', fontFamily: 'inherit',
      fontSize: D.BUTTON_TEXT_SIZE,
      fontWeight: ['cancel', 'preferred'].includes(a.style) ? TYPOGRAPHY.weight.semibold : TYPOGRAPHY.weight.regular,
      color: a.style === 'destructive' ? TOKENS.error : TOKENS.p500,
    }}>{a.label}</button>
  );

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      background: D.BACKDROP_BG,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: D.CARD_OUTER_PADDING,
      animation: 'fadeIn 200ms ease',
    }}>
      <div style={{
        width: D.CARD_WIDTH,
        background: TOKENS.surface,
        borderRadius: D.CARD_RADIUS,
        overflow: 'hidden',
        boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          padding: D.CARD_BODY_PADDING,
          textAlign: 'center',
        }}>
          {title && (
            <div style={{
              fontSize: D.TITLE_SIZE, fontWeight: D.TITLE_WEIGHT,
              color: TOKENS.ink, marginBottom: D.TITLE_BOTTOM_MARGIN,
            }}>{title}</div>
          )}
          {message && (
            <div style={{
              fontSize: D.MESSAGE_SIZE, color: TOKENS.ink2,
              lineHeight: D.MESSAGE_LINE_HEIGHT,
            }}>{message}</div>
          )}
        </div>
        <div style={{
          display: 'flex',
          flexDirection: stackVertical ? 'column' : 'row',
          borderTop: `1px solid ${TOKENS.border}`,
        }}>
          {actions.map((a, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <div style={stackVertical
                  ? { height: 1, background: TOKENS.border }
                  : { width: 1, background: TOKENS.border }}/>
              )}
              {renderBtn(a, i)}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DeleteButton ─── 對齊 src/components/DeleteButton.tsx
// 跨 editor 共用刪除鈕（Footer Zone：surface 底紅字無框）。Transaction / Transfer /
// Account / Category editor 編輯模式 footer 共用，文字一律「刪除」，按下觸發各 screen
// 的刪除 action。由原 30_screens/shared 的 EditorDestructiveTextButton（白底）與
// EditorDeleteButton（透明底）兩套收斂而來，統一採白底 surface 樣式。
function DeleteButton({ label = '刪除' }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      background: TOKENS.surface,
      padding: SPACING.lg,
      borderRadius: RADIUS.md,
      fontSize: TYPOGRAPHY.size.base,
      color: TOKENS.error,
      fontWeight: TYPOGRAPHY.weight.medium,
    }}>
      {label}
    </div>
  );
}

// ─── RecurringOptions ─── 對齊 src/components/RecurringOptions.tsx
// container bg surface radius lg padding lg margin sm/lg border 1px
// headerRow: title「定期設定」primary medium + Switch
// 內容（enabled=true 時）：頻率 4 chip / 每隔 input + unit / 結束於 [永不 chip][特定日期 chip][DatePill]
// 結束於三者同行（flex row alignItems:center），DatePill 永遠 render；
// 永不選中時 DatePill 留位置淡出停用（END_DATE_PILL_DISABLED_OPACITY + FADE_DURATION）。
// design canvas 版為 self-contained state，方便 sandbox 即看即試。
//
// Variants：
//   initialEnabled        — 預設 true，false 時內容區半透明 + pointerEvents:none
//   initialFrequency      — 'DAILY' / 'WEEKLY' / 'MONTHLY' / 'YEARLY'
//   initialEndCondition   — 'NEVER' / 'ON_DATE'
//   initialEndDate        — endCondition === 'ON_DATE' 時 DatePill 顯示的日期文字
//
// 註：impl 的 onPremiumCheck 對未付費使用者採 Silent Deny（toggle 自動回 off，無提示），
//     元件本身無 inline lock 視覺。design 端不複製此 silent 行為，亦不主動加 affordance。
function RecurringOptions({
  initialEnabled = true,
  initialFrequency = 'MONTHLY',
  initialEndCondition = 'NEVER',
  initialEndDate = '2026/12/31',
}) {
  const R = RECURRING_OPTIONS_TOKENS;
  const [enabled, setEnabled] = React.useState(initialEnabled);
  const [frequency, setFrequency] = React.useState(initialFrequency);
  const [endCondition, setEndCondition] = React.useState(initialEndCondition);
  const [endDate, setEndDate] = React.useState(initialEndDate);
  const freqs = [
    { v: 'DAILY',   label: '每日' },
    { v: 'WEEKLY',  label: '每週' },
    { v: 'MONTHLY', label: '每月' },
    { v: 'YEARLY',  label: '每年' },
  ];
  const unitText = { DAILY: '天', WEEKLY: '週', MONTHLY: '月', YEARLY: '年' }[frequency];
  const optionBtn = (key, label, selected, onClick) => (
    <button key={key} onClick={onClick} style={{
      paddingTop:    CHIP_TOKENS.PADDING_VERTICAL,
      paddingBottom: CHIP_TOKENS.PADDING_VERTICAL,
      paddingLeft:   CHIP_TOKENS.PADDING_HORIZONTAL,
      paddingRight:  CHIP_TOKENS.PADDING_HORIZONTAL,
      borderRadius:  CHIP_TOKENS.RADIUS,
      borderWidth:   CHIP_TOKENS.BORDER_WIDTH, borderStyle: 'solid',
      borderColor:   selected ? TOKENS.p500 : TOKENS.border,
      marginRight:   CHIP_TOKENS.GAP_HORIZONTAL,
      marginBottom:  CHIP_TOKENS.GAP_VERTICAL,
      background:    selected ? TOKENS.p500 : TOKENS.bg,
      cursor: 'pointer', fontFamily: 'inherit',
      color:    selected ? '#fff' : TOKENS.ink,
      fontSize: CHIP_TOKENS.TEXT_SIZE,
      fontWeight: selected ? CHIP_TOKENS.TEXT_WEIGHT_SELECTED : TYPOGRAPHY.weight.regular,
    }}>{label}</button>
  );
  const labelRow = (txt) => (
    <div style={{
      fontSize: R.LABEL_SIZE, color: TOKENS.ink2,
      marginTop: R.LABEL_VERTICAL_MARGIN, marginBottom: R.LABEL_VERTICAL_MARGIN,
    }}>{txt}</div>
  );
  const contentOpacity = enabled ? 1 : R.DISABLED_OPACITY;
  const contentInteractive = enabled;
  return (
    <div style={{
      background: TOKENS.surface,
      borderRadius: R.CONTAINER_RADIUS,
      padding: R.CONTAINER_PADDING,
      marginTop: R.CONTAINER_MARGIN_TOP, marginBottom: R.CONTAINER_MARGIN_BOTTOM,
      borderWidth: R.CONTAINER_BORDER_WIDTH, borderStyle: 'solid', borderColor: TOKENS.border,
    }}>
      <div style={{
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: R.HEADER_BOTTOM_MARGIN,
      }}>
        <span style={{ fontSize: R.TITLE_SIZE, fontWeight: R.TITLE_WEIGHT, color: TOKENS.p500 }}>定期設定</span>
        <Switch value={enabled} onChange={setEnabled}/>
      </div>
      <div style={{ opacity: contentOpacity, pointerEvents: contentInteractive ? 'auto' : 'none' }}>
        {labelRow('頻率')}
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginBottom: R.ROW_BOTTOM_MARGIN }}>
          {freqs.map(f => optionBtn(f.v, f.label, frequency === f.v, () => setFrequency(f.v)))}
        </div>
        {labelRow('每隔')}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: R.ROW_BOTTOM_MARGIN }}>
          <input defaultValue="1" style={{
            background: TOKENS.bg, padding: R.INTERVAL_INPUT_PADDING,
            borderRadius: R.INTERVAL_INPUT_RADIUS,
            borderWidth: R.INTERVAL_INPUT_BORDER_WIDTH, borderStyle: 'solid', borderColor: TOKENS.border,
            fontSize: R.INTERVAL_INPUT_SIZE,
            width: R.INTERVAL_INPUT_WIDTH,
            textAlign: 'center',
            marginRight: R.INTERVAL_INPUT_RIGHT_GAP, color: TOKENS.ink, fontFamily: 'inherit', outline: 'none',
          }}/>
          <span style={{ fontSize: R.UNIT_TEXT_SIZE, color: TOKENS.ink }}>{unitText}</span>
        </div>
        {labelRow('結束於')}
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
          {optionBtn('NEVER',   '永不',     endCondition === 'NEVER',   () => setEndCondition('NEVER'))}
          {optionBtn('ON_DATE', '特定日期', endCondition === 'ON_DATE', () => setEndCondition('ON_DATE'))}
          <DatePill date={endDate} active={endCondition === 'ON_DATE'}/>
        </div>
      </div>
    </div>
  );
}

// ─── CalendarDialog ─── 自研日期選擇器（Spec 模式代號 Calendar Dialog）
// 對齊 Spec date_picker_policy.md：單一觸發 pill → 置中 dialog，日/月雙子模式可切換。
// 即看即試：自包 state。mode='datetime' 含時間滾輪、mode='date' 純日期無滾輪。
// 月曆計算為純 JS（給定 year/month 推星期與天數），初始值固定 2026/5/30 12:47 對齊 spec 範例。
// 月曆格（design 仲裁）：僅鋪當月日期、相鄰月位置留白不顯示（iOS 月曆慣例）；固定 6 列框架，
//   列數不足的月份尾列留白，dialog 高度恆定不跳。星期列標籤語言依使用者語系；週起始日依
//   weekStart 偏好——auto 跟隨語系慣例（CLDR：zh-Hant／en／ja 等週日起、zh-Hans／de／fr 等週一起）、
//   或固定週日／週一；canvas 以 zh-Hant 週日起示範。
// dialog 用 absolute 蓋滿 artboard frame（沿用 ConfirmDialog 慣例，frame 需 relative）。
// 翻頁互動（design 仲裁）：月份／年份採縱向單頁 native snap 分頁——日模式上下滑切月、月模式上下滑切年，
//   放手吸附整頁、後一個月在下方。impl 端為 vertical FlatList pagingEnabled，沿用 home screen
//   period paging 的 FlatList 分頁機制、方向改縱向；canvas 無法 mock 真實 swipe，僅鏡射單月結構。
//   本決議同步記於 no13_calendar_dialog_tokens.jsx。
const CAL_DOW = ['日','一','二','三','四','五','六'];   // canvas 示範值：zh-Hant、週日起；實際順序依 weekStart 偏好，非規則
const CAL_MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

// 月曆 grid：offset 個留白 + 當月日期，補滿 42 格（尾端留白）。null = 留白格。
function calMonthGrid(year, month, weekStart = 0) {
  const offset = (new Date(year, month, 1).getDay() - weekStart + 7) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length < 42) cells.push(null);
  return cells;
}

function CalendarDialog({ mode = 'datetime' }) {
  const C = CALENDAR_DIALOG_TOKENS;
  const { useState } = React;
  const [open, setOpen] = useState(false);
  const [view, setView] = useState('day');     // 'day' | 'month'
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(4);        // 0-indexed：4 = 5月
  const [day, setDay] = useState(30);
  const [hh] = useState(12);
  const [mm] = useState(47);
  // canvas 動畫示範 state（impl 走 reanimated；此處用 transform + transition 鏡射體感）
  const [gridAnim, setGridAnim] = useState({ scale: 1, opacity: 1 });   // 日↔月 Zoom 進場
  const [headerAnim, setHeaderAnim] = useState({ ty: 0, opacity: 1 });  // 標題逐頁換值脈衝

  // 雙 rAF：先套起始 transform、下一幀過渡回定位，讓 CSS transition 有起點可補間。
  const settleNext = (setter, settled) => {
    requestAnimationFrame(() => requestAnimationFrame(() => setter(settled)));
  };
  // 點標題列：切日↔月子模式，進場視圖 Zoom（切月自大縮入＝拉遠、切日自小放大＝拉近）。
  const toggleView = () => {
    const next = view === 'day' ? 'month' : 'day';
    setView(next);
    setGridAnim({ scale: next === 'month' ? C.VIEW_SWITCH_EXIT_SCALE : C.VIEW_SWITCH_ENTER_SCALE, opacity: 0 });
    settleNext(setGridAnim, { scale: 1, opacity: 1 });
  };
  // canvas 示範：模擬翻一頁（impl 為真實 swipe）。標題即時換值 + 脈衝。
  const stepPage = () => {
    if (view === 'day') {
      if (month === 11) { setYear(year + 1); setMonth(0); } else { setMonth(month + 1); }
    } else {
      setYear(year + 1);
    }
    setHeaderAnim({ ty: C.HEADER_PULSE_TRANSLATE, opacity: 0.25 });
    settleNext(setHeaderAnim, { ty: 0, opacity: 1 });
  };

  const p2 = (n) => String(n).padStart(2, '0');
  const pillText = mode === 'datetime'
    ? `${year}/${month + 1}/${day}   ${p2(hh)}:${p2(mm)}`
    : `${year}/${month + 1}/${day}`;

  const pill = (
    <button onClick={() => setOpen(true)} style={{
      display: 'inline-flex', alignItems: 'center', gap: C.PILL_ICON_GAP,
      paddingTop: C.PILL_PADDING_VERTICAL, paddingBottom: C.PILL_PADDING_VERTICAL,
      paddingLeft: C.PILL_PADDING_HORIZONTAL, paddingRight: C.PILL_PADDING_HORIZONTAL,
      background: TOKENS.surface, borderRadius: C.PILL_RADIUS,
      borderWidth: C.PILL_BORDER_WIDTH, borderStyle: 'solid', borderColor: TOKENS.border,
      cursor: 'pointer', fontFamily: 'inherit',
    }}>
      <Glyph name="calendar" size={ICON_SIZE.sm} color={TOKENS.ink2} stroke={2}/>
      <span style={{ fontSize: C.PILL_TEXT_SIZE, fontWeight: C.PILL_TEXT_WEIGHT, color: TOKENS.ink }}>{pillText}</span>
    </button>
  );

  // 留白格（null）：不畫按鈕、不可點，只佔位維持 6 列框架。
  const dayCell = (d, i) => {
    if (d === null) return <div key={i}/>;
    const selected = d === day;
    return (
      <button key={i} onClick={() => setDay(d)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: 'none', background: 'transparent', padding: 0,
        cursor: 'pointer', fontFamily: 'inherit',
      }}>
        <span style={{
          width: C.DAY_SELECTED_SIZE, height: C.DAY_SELECTED_SIZE,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: C.DAY_SELECTED_RADIUS,
          background: selected ? TOKENS.p500 : 'transparent',
          fontSize: C.DAY_CELL_TEXT_SIZE,
          fontWeight: selected ? C.SELECTED_TEXT_WEIGHT : TYPOGRAPHY.weight.regular,
          color: selected ? TOKENS.surface : TOKENS.ink,
        }}>{d}</span>
      </button>
    );
  };

  const monthCell = (label, idx) => {
    const selected = idx === month;
    return (
      <button key={idx} onClick={() => setMonth(idx)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: 'none', background: 'transparent', padding: 0,
        cursor: 'pointer', fontFamily: 'inherit',
      }}>
        <span style={{
          height: C.MONTH_SELECTED_HEIGHT,
          paddingLeft: C.MONTH_SELECTED_PADDING_H, paddingRight: C.MONTH_SELECTED_PADDING_H,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: C.MONTH_SELECTED_RADIUS,
          background: selected ? TOKENS.p500 : 'transparent',
          fontSize: C.MONTH_CELL_TEXT_SIZE,
          fontWeight: selected ? C.SELECTED_TEXT_WEIGHT : TYPOGRAPHY.weight.regular,
          color: selected ? TOKENS.surface : TOKENS.ink,
        }}>{label}</span>
      </button>
    );
  };

  const wheelCol = (val) => (
    <div style={{
      flex: 1, height: C.WHEEL_ROW_HEIGHT * C.WHEEL_VISIBLE_ROWS, background: TOKENS.surface, borderRadius: RADIUS.md,
      borderWidth: 1, borderStyle: 'solid', borderColor: TOKENS.border,
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ fontSize: TYPOGRAPHY.size.base, color: TOKENS.ink, opacity: C.WHEEL_DIM_OPACITY, height: C.WHEEL_ROW_HEIGHT }}/>
      <div style={{ fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.medium, color: TOKENS.ink, marginTop: 4, marginBottom: 4 }}>{p2(val)}</div>
      <div style={{ fontSize: TYPOGRAPHY.size.base, color: TOKENS.ink, opacity: C.WHEEL_DIM_OPACITY, height: C.WHEEL_ROW_HEIGHT }}/>
    </div>
  );

  const cells = calMonthGrid(year, month);

  const dialog = open ? (
    <div onClick={() => setOpen(false)} style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10,
      background: C.BACKDROP_BG, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: C.CARD_OUTER_PADDING, animation: `fadeIn ${C.BACKDROP_FADE_DURATION}ms ease`,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: C.CARD_WIDTH, background: TOKENS.surface, borderRadius: C.CARD_RADIUS, padding: C.CARD_PADDING,
      }}>
        <button onClick={toggleView} style={{
          width: '100%', height: C.HEADER_HEIGHT,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
          marginBottom: C.HEADER_BOTTOM_MARGIN, padding: 0,
        }}>
          <span style={{
            display: 'inline-block', fontSize: C.HEADER_TEXT_SIZE, fontWeight: C.HEADER_TEXT_WEIGHT, color: TOKENS.ink,
            transform: `translateY(${headerAnim.ty}px)`, opacity: headerAnim.opacity,
            transition: `transform ${C.HEADER_PULSE_DURATION}ms ${C.HEADER_PULSE_EASING}, opacity ${C.HEADER_PULSE_DURATION}ms ${C.HEADER_PULSE_EASING}`,
          }}>
            {view === 'day' ? `${year}/${month + 1}` : `${year}`}
          </span>
        </button>

        {view === 'day' && (
          <div style={{
            height: C.MIDDLE_AREA_HEIGHT, display: 'flex', flexDirection: 'column',
            transform: `scale(${gridAnim.scale})`, opacity: gridAnim.opacity, transformOrigin: 'center center',
            transition: `transform ${C.VIEW_SWITCH_DURATION}ms ${C.VIEW_SWITCH_EASING}, opacity ${C.VIEW_SWITCH_DURATION}ms ${C.VIEW_SWITCH_EASING}`,
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: C.WEEKDAY_ROW_BOTTOM_MARGIN }}>
              {CAL_DOW.map((w, i) => (
                <div key={i} style={{ textAlign: 'center', fontSize: C.WEEKDAY_TEXT_SIZE, fontWeight: C.WEEKDAY_TEXT_WEIGHT, color: TOKENS.ink2 }}>{w}</div>
              ))}
            </div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(6, 1fr)', columnGap: C.GRID_COL_GAP, justifyItems: 'center' }}>
              {cells.map(dayCell)}
            </div>
          </div>
        )}

        {view === 'month' && (
          <div style={{
            height: C.MIDDLE_AREA_HEIGHT, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', columnGap: C.GRID_COL_GAP, justifyItems: 'center',
            transform: `scale(${gridAnim.scale})`, opacity: gridAnim.opacity, transformOrigin: 'center center',
            transition: `transform ${C.VIEW_SWITCH_DURATION}ms ${C.VIEW_SWITCH_EASING}, opacity ${C.VIEW_SWITCH_DURATION}ms ${C.VIEW_SWITCH_EASING}`,
          }}>
            {CAL_MONTHS.map(monthCell)}
          </div>
        )}

        {mode === 'datetime' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: C.WHEEL_GROUP_GAP, marginTop: C.WHEEL_TOP_MARGIN }}>
            {wheelCol(hh)}
            <span style={{ fontSize: TYPOGRAPHY.size.lg, color: TOKENS.ink }}>{C.WHEEL_SEPARATOR_TEXT}</span>
            {wheelCol(mm)}
          </div>
        )}
        <button onClick={stepPage} style={{
          width: '100%', marginTop: C.WHEEL_TOP_MARGIN, padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
          fontSize: C.WEEKDAY_TEXT_SIZE, color: TOKENS.ink2,
        }}>
          canvas 示範 · 模擬翻頁 ↓（看標題逐頁脈衝）
        </button>
      </div>
    </div>
  ) : null;

  return (
    <React.Fragment>
      {pill}
      {dialog}
    </React.Fragment>
  );
}

Object.assign(window, {
  Glyph, DynamicIconById, IconOutline,
  ListGroupCard, GroupCard, ListSection,
  ListItem, DataListItem, SelectionListItem, ReorderableListItem, SelectionGridItem,
  ListEmptyState, EmptyState, ListEmptyTransition,
  ModalCloseButton, HeaderCheckmarkButton, HeaderIconButton, HeaderButtonPill,
  MockBackButtonPill, MockNavBar, HeaderMockFrame,
  GlassView, DonutChart, FocusCard, InlineAmount, FloatingActionBar, fabBtn,
  BottomSearchBar, Switch, CalculatorKeypad,
  AmountField, StaticWheelPicker, AccountSelector, CategorySelector, DualPickerBox, RecurringOptions,
  DatePill, ConfirmDialog, DeleteButton, CalendarDialog,
  iconBtn,
});
