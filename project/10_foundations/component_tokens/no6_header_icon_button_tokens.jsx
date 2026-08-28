// ─────────────────────────────────────────────────────────────
// HEADER_ICON_BUTTON_TOKENS · Navigation header 上 icon-only 動作鍵
//
// **此 token group 僅供 design canvas mock 視覺校準參考**。
// impl 端已將 header button 完全下放給 react-navigation 7 + UIKit：
//   - 採用 `unstable_headerLeftItems / unstable_headerRightItems` + `type: 'button'`
//   - UIKit UIBarButtonItem 接管尺寸 / 圓角 / 背景 / press 動畫 / haptic / Liquid Glass
//   - tintColor 預設用 theme.text.primary（對齊 iOS UIColor.label 黑灰；與 header title 同色）
//
// 放棄「在 RN 端控制 customView 視覺」的理由：
//   1. iOS 26 對 customView 套的 shared background pill dimension 由 UIKit 決定，
//      leftBarButtonItems 帶 leading edge inset 變橢圓、單一 rightBarButtonItem 維持
//      正圓，視覺左右不對稱
//   2. 自畫 borderRadius + hidesSharedBackground 雖能恢復對稱，但失去 iOS 原生 press
//      高光與 Liquid Glass 動畫，使用者感受不到「iOS 原生」
//   3. 最終決議：採 UIKit 原生 button item，把視覺與互動完全交給 OS
//
// 本 token group 的尺寸值（41 / 17 / 8 / 1.5 / 0.97 / 100ms）保留在 design canvas 中
// 作為 HeaderButtonPill mock 元件與 visualizer 卡片的視覺校準依據，impl 不消費。
// ─────────────────────────────────────────────────────────────

const HEADER_ICON_BUTTON_TOKENS = {
  CONTENT_BOX:        TYPE_STYLES.body.size + SPACING.md * 2,              // 41，pill 正方形邊長（17pt symbol + 12 padding × 2）
  BORDER_RADIUS:      (TYPE_STYLES.body.size + SPACING.md * 2) / 2,        // 20.5，pill 半徑：CONTENT_BOX / 2
  SYMBOL_SIZE:        TYPE_STYLES.body.size,                               // 17，SF Symbol point size，對齊 Apple bar button 慣用 body 級
  MULTI_ICON_GAP:     SPACING.sm,                                          // 8，多 icon header 內 button 間距，與 SEARCH_BAR_TOKENS.ICON_GAP 對齊
  HIT_TARGET_EXPAND:  (HIT_TARGET.min - (TYPE_STYLES.body.size + SPACING.md * 2)) / 2, // 1.5，hitSlop 各方向外擴：視覺 41×41、可點 44×44 達 HIG。對齊 Apple UIBarButtonItem「視覺小、hit 大」慣例
  PRESS_ANIMATION: {
    scale:    0.97,                       // (literal: 視覺校準值，對齊 brand.md universal button rule 與 iOS 系統 bar button tap 反饋；非 atomic 階梯項目)
    duration: MOTION.duration.instant,    // 100，按壓回饋短促；阻尼結束視覺與 haptic 同步
    easing:   MOTION.easing.standard,
  },
  COLOR_BY_INTENT: {                      // icon 顏色語意分派；impl 端對應 theme.text.primary（三 intent 統一 ink 黑灰，對齊 iOS UIColor.label 視覺，與 header title 同色）
    commit:  TOKENS.ink,                  // 送出 / 確認（checkmark）
    action:  TOKENS.ink,                  // 主動觸發功能（search / settings / filter / merge / 返回）
    dismiss: TOKENS.ink,                  // 關閉當前畫面（xmark）。本波決議統一 ink 黑灰（前一波 p500 主題色實機驗證視覺過重）；保留 map 結構以便未來分化（如 destructive 改紅）
    // 任一 intent 在 disabled 狀態下覆寫為 TOKENS.ink3（impl 對應 theme.state.disabled.fg）
  },
  HAPTIC_BY_INTENT: {                     // expo-haptics ImpactFeedbackStyle 常數名稱；intent 對應 COLOR_BY_INTENT
    commit:  'impactMedium',              // 送出 / 確認動作有後果，反饋稍強
    action:  'impactLight',               // 主動觸發但無破壞性後果，反饋輕觸
    dismiss: 'impactLight',               // 離開動作無後果，反饋輕觸
  },
};

Object.assign(window, { HEADER_ICON_BUTTON_TOKENS });
