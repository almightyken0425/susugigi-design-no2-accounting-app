// ─────────────────────────────────────────────────────────────
// HOME_SCREEN_TOKENS · HomeScreen 內部 composition 參數
//
// Screen 級 token：本 screen 獨有的 layout / spacing / size 校準值。
// 可重用的元件參數（chip / list / form picker 等）放 10_foundations/component_tokens/。
// 本檔值必須引用 atomic 階梯；無對應階梯的 literal 必須註釋原因。
// ─────────────────────────────────────────────────────────────

const HOME_SCREEN_TOKENS = {
  // ── Screen container
  BOTTOM_PADDING_FOR_FAB:                100,                                   // (literal: 為 FloatingActionBar 與其上方安全區預留滾動結尾空間；對齊 impl PeriodPage contentContainerStyle.paddingBottom)

  // ── PageHeader 區（PeriodSwitcher + DonutHero + FocusRow 共同 wrapper）
  PAGE_HEADER_PADDING_BOTTOM:            SPACING.sm,

  // ── PeriodSwitcher（screen 頂端月份切換 row）
  PERIOD_SWITCHER_PADDING_TOP:           SPACING.md,
  PERIOD_SWITCHER_PADDING_BOTTOM:        SPACING.xs,
  PERIOD_SWITCHER_GAP:                   SPACING.sm,
  PERIOD_SWITCHER_BUTTON_FRAME:          28,                                    // (literal: chevron tap area frame，比 HIT_TARGET.min=44 小，design canvas mock 用)
  PERIOD_SWITCHER_CHEVRON_SIZE:          14,                                    // (literal: 視覺校準，ICON_SIZE.xs=16 略大)
  PERIOD_SWITCHER_CALENDAR_ICON_SIZE:    13,                                    // (literal: 視覺校準，與月份文字平衡)
  PERIOD_SWITCHER_CALENDAR_RIGHT_GAP:    SPACING['2xs'],

  // ── DonutHero（圓餅圖 + 中央文字區）
  DONUT_BOTTOM_GAP:                      SPACING.md,
  DONUT_CENTER_TEXT_WIDTH:               100,                                   // (literal: 配合 DonutChart inner radius 76 的中央可用寬度)
  DONUT_MIN_SLICE_ANGLE_DEG:             10,                                    // (literal: slice 顯示門檻；角度占比低於此值拔除後重新正規化，對齊 impl DonutChart MIN_SLICE_ANGLE_DEG)

  // ── FocusRow（expense / income 切換的兩張 FocusCard）
  FOCUS_ROW_GAP:                         SPACING.md,
  FOCUS_ROW_PADDING_HORIZONTAL:          SPACING.lg,
  FOCUS_ROW_PADDING_TOP:                 SPACING.xs,
  FOCUS_ROW_PADDING_BOTTOM:              SPACING.md,

  // ── TxSectionHeader（section card 內標題列；補充 TX_LIST_TOKENS 未覆蓋部分）
  SECTION_HEADER_CHEVRON_FRAME:          14,                                    // (literal: chevron rotate animation 旋轉框)
  SECTION_HEADER_CHEVRON_SIZE:           12,                                    // (literal: 比 ICON_SIZE.xs=16 小，section header 視覺校準)
  SECTION_HEADER_CATEGORY_ICON_FRAME:    TX_LIST_TOKENS.ICON_OUTLINE_SIZE,      // 32（impl 共用 TX_LIST_TOKENS.ICON_OUTLINE_SIZE）
  SECTION_HEADER_CATEGORY_ICON_SIZE:     18,                                    // (literal: 18 比 ICON_SIZE.sm=20 略小，section header 視覺校準)

  // ── TxSectionLoadingSkeleton（首次與續頁的明細骨架）
  SECTION_LOADING_DELAY_MS:              120,                                   // (literal: 快速讀取不顯示骨架的等待門檻)
  SECTION_LOADING_INITIAL_ROW_COUNT:     3,                                     // (literal: 初次載入足以表達明細結構，且不暗示實際頁量)
  SECTION_LOADING_NEXT_PAGE_ROW_COUNT:   1,                                     // (literal: 續頁只在已載明細尾端追加一列提示)
  SECTION_LOADING_BREATH_PHASE_MS:       MOTION.duration.slow,                  // 500ms 單相，往返週期為 1000ms
  SECTION_LOADING_EASING:                MOTION.easing.standard,
  SECTION_LOADING_OPACITY_LOW:           0.45,                                  // (literal: 呼吸低點，仍保持骨架可辨識)
  SECTION_LOADING_OPACITY_HIGH:          1,                                     // (literal: 呼吸高點；降低動態時固定使用此值)
  SECTION_LOADING_FILL:                  TOKENS.surface2,
  SECTION_LOADING_BLOCK_RADIUS:          RADIUS.full,
  SECTION_LOADING_LEFT_SLOT_SIZE:        TX_LIST_TOKENS.ROW_LEFT_SLOT_SIZE,
  SECTION_LOADING_PRIMARY_HEIGHT:        SPACING.sm + SPACING['2xs'],           // 10
  SECTION_LOADING_SECONDARY_HEIGHT:      SPACING.sm,
  SECTION_LOADING_AMOUNT_HEIGHT:         SPACING.sm + SPACING['2xs'],           // 10
  SECTION_LOADING_TEXT_GAP:              SPACING.sm,
  SECTION_LOADING_ROW_GAP:               SPACING.md,
  SECTION_LOADING_ROW_PADDING_H:         SPACING.lg,
  SECTION_LOADING_ROW_PADDING_V:         SPACING.md,
  SECTION_LOADING_PRIMARY_WIDTHS:        ['52%', '64%', '44%'],                 // (literal: 三列錯落，避免誤認為可讀文字)
  SECTION_LOADING_SECONDARY_WIDTHS:      ['34%', '46%', '28%'],                 // (literal: 對應副標長短差異)
  SECTION_LOADING_AMOUNT_WIDTHS:         ['18%', '24%', '20%'],                 // (literal: 對應金額位數差異)

  // ── AmountCol（TxRow 右側金額欄，含 recurring chip）
  AMOUNT_COL_GAP:                        SPACING.lg,
  AMOUNT_COL_RECURRING_FRAME:            22,                                    // (literal: recurring chip 22x22，比 ICON_SIZE.xs=16 大、比 sm=20 略大)
  AMOUNT_COL_RECURRING_RADIUS:           RADIUS.sm,                             // 4（impl 用 RADIUS.sm）
  AMOUNT_COL_RECURRING_ICON_SIZE:        14,                                    // (literal: 配 22x22 chip 視覺平衡)
};

Object.assign(window, { HOME_SCREEN_TOKENS });
