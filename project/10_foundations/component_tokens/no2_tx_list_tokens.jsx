// ─────────────────────────────────────────────────────────────
// TX_LIST_TOKENS · 交易 list 專屬元件參數
//
// 交易列為 grouped section 結構，與 LIST_TOKENS 視覺差異大，分開仲裁。
// 內含 MORPH / SECTION_ENTRY / FOCUS_CARD 動畫 token，皆引用 MOTION 或標 literal。
// ─────────────────────────────────────────────────────────────

const TX_LIST_TOKENS = {
  SECTION_CARD_RADIUS:                  RADIUS.lg,                     // 12（HIG 不收 14）
  SECTION_CARD_MARGIN_BOTTOM:           SPACING.md + SPACING['2xs'],   // 14
  SECTION_CARD_HORIZONTAL_PADDING:      SPACING.lg,
  SECTION_HEADER_PADDING_V_COLLAPSED:   SPACING.md,
  SECTION_HEADER_PADDING_V_EXPANDED:    SPACING.sm + SPACING['2xs'],   // 10
  SECTION_HEADER_PADDING_H:             SPACING.lg,
  SECTION_HEADER_TITLE_SIZE_COLLAPSED:  TYPE_STYLES.body.size,         // 17
  SECTION_HEADER_TITLE_SIZE_EXPANDED:   TYPOGRAPHY.size.sm,            // 14
  SECTION_HEADER_TOTAL_SIZE_COLLAPSED:  TYPOGRAPHY.size.base,          // 16
  SECTION_HEADER_TOTAL_SIZE_EXPANDED:   TYPOGRAPHY.size.sm,            // 14
  // 小計幣別段（小幣別大數值橫排）：隨收合在 xs(12)↔2xs(10) 補間，恆比同態數值小一階
  SECTION_HEADER_TOTAL_CURRENCY_SIZE_COLLAPSED: TYPOGRAPHY.size.xs,    // 12
  SECTION_HEADER_TOTAL_CURRENCY_SIZE_EXPANDED:  TYPOGRAPHY.size['2xs'], // 10
  SECTION_HEADER_TITLE_WEIGHT:          TYPOGRAPHY.weight.medium,
  SECTION_HEADER_TOTAL_WEIGHT:          TYPOGRAPHY.weight.medium,
  ICON_OUTLINE_BORDER_WIDTH:            1,                             // (literal: StyleSheet.hairlineWidth；canvas 為 React Web 無法 resolve)
  ICON_OUTLINE_SIZE:                    ICON_SIZE.lg,
  ICON_OUTLINE_RADIUS:                  10,                            // (literal: 視覺校準, 32px icon 配 RADIUS 階梯 md(8) 偏方 / lg(12) 偏圓)
  ROW_AMOUNT_SIZE:                      TYPE_STYLES.callout.size,      // 16
  ROW_AMOUNT_WEIGHT:                    TYPOGRAPHY.weight.medium,
  ROW_LEFT_SLOT_SIZE:                   ICON_SIZE.lg,
  ROW_NOTE_SIZE:                        TYPE_STYLES.subheadline.size,  // 15
  ROW_SECONDARY_SIZE:                   TYPE_STYLES.caption1.size,     // 12
  MORPH_DURATION_MS:                    MOTION.duration.fast + 80,     // 280ms
  SECTION_ENTRY_DURATION_MS:            160,                           // (literal: visual calibration)
  SECTION_ENTRY_STAGGER_MS:             20,                            // (literal: stagger interval)
  SECTION_ENTRY_TRANSLATE_Y:            6,                             // (literal: entry offset，介於 SPACING.xs 與 sm 之間)
  SECTION_ENTRY_STAGGER_MAX_INDEX:      4,                             // (literal: index cap)
  FOCUS_CARD_SHRINK_DURATION_MS:        92,                            // (literal: visual calibration)
  FOCUS_CARD_GROW_DURATION_MS:          148,                           // (literal: visual calibration)
};

Object.assign(window, { TX_LIST_TOKENS });
