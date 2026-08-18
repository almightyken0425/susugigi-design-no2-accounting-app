// ─────────────────────────────────────────────────────────────
// Foundations > Component Tokens > Transaction List · TX_LIST_TOKENS visualizer
// ─────────────────────────────────────────────────────────────

const TX_LIST_TOKEN_DESC = {
  SECTION_CARD_RADIUS:                  '交易 section 卡片外殼圓角',
  SECTION_CARD_MARGIN_BOTTOM:           'section 卡片之間的呼吸距',
  SECTION_CARD_HORIZONTAL_PADDING:      '卡片內水平 padding',
  SECTION_HEADER_PADDING_V_COLLAPSED:   'section header 收合態垂直 padding',
  SECTION_HEADER_PADDING_V_EXPANDED:    'section header 展開態垂直 padding（較緊）',
  SECTION_HEADER_PADDING_H:             'section header 水平 padding',
  SECTION_HEADER_TITLE_SIZE_COLLAPSED:  '收合態標題字級（body）',
  SECTION_HEADER_TITLE_SIZE_EXPANDED:   '展開態標題字級（縮小）',
  SECTION_HEADER_TOTAL_SIZE_COLLAPSED:  '收合態金額字級',
  SECTION_HEADER_TOTAL_SIZE_EXPANDED:   '展開態金額字級（縮小）',
  SECTION_HEADER_TITLE_WEIGHT:          'section 標題字重',
  SECTION_HEADER_TOTAL_WEIGHT:          'section 金額字重',
  ICON_OUTLINE_BORDER_WIDTH:            '左槽 icon outline 描邊',
  ICON_OUTLINE_SIZE:                    '左槽 icon 容器尺寸（ICON_SIZE.lg）',
  ICON_OUTLINE_RADIUS:                  '左槽 icon 容器圓角（離開 RADIUS 階梯的視覺校準）',
  ROW_AMOUNT_SIZE:                      '交易列金額字級（callout）',
  ROW_AMOUNT_WEIGHT:                    '交易列金額字重',
  ROW_LEFT_SLOT_SIZE:                   '交易列左槽尺寸',
  ROW_NOTE_SIZE:                        '備註字級（subheadline）',
  ROW_SECONDARY_SIZE:                   '次要文字字級（caption1）',
  MORPH_DURATION_MS:                    'section 收合/展開動畫長度',
  SECTION_ENTRY_DURATION_MS:            'section 進場動畫長度',
  SECTION_ENTRY_STAGGER_MS:             'section 進場錯位間隔',
  SECTION_ENTRY_TRANSLATE_Y:            'section 進場初始位移',
  SECTION_ENTRY_STAGGER_MAX_INDEX:      '錯位上限索引',
  FOCUS_CARD_SHRINK_DURATION_MS:        'focus card 縮短',
  FOCUS_CARD_GROW_DURATION_MS:          'focus card 展開',
};

const TX_LIST_TOKEN_SOURCE = {
  SECTION_CARD_RADIUS:                  'RADIUS.lg',
  SECTION_CARD_MARGIN_BOTTOM:           "SPACING.md + SPACING['2xs']",
  SECTION_CARD_HORIZONTAL_PADDING:      'SPACING.lg',
  SECTION_HEADER_PADDING_V_COLLAPSED:   'SPACING.md',
  SECTION_HEADER_PADDING_V_EXPANDED:    "SPACING.sm + SPACING['2xs']",
  SECTION_HEADER_PADDING_H:             'SPACING.lg',
  SECTION_HEADER_TITLE_SIZE_COLLAPSED:  'TYPE_STYLES.body.size',
  SECTION_HEADER_TITLE_SIZE_EXPANDED:   'TYPOGRAPHY.size.sm',
  SECTION_HEADER_TOTAL_SIZE_COLLAPSED:  'TYPE_STYLES.subheadline.size',
  SECTION_HEADER_TOTAL_SIZE_EXPANDED:   'TYPE_STYLES.footnote.size',
  SECTION_HEADER_TITLE_WEIGHT:          'TYPOGRAPHY.weight.medium',
  SECTION_HEADER_TOTAL_WEIGHT:          'TYPOGRAPHY.weight.medium',
  ICON_OUTLINE_BORDER_WIDTH:            'StyleSheet.hairlineWidth',
  ICON_OUTLINE_SIZE:                    'ICON_SIZE.lg',
  ICON_OUTLINE_RADIUS:                  '(literal: 視覺校準, 32px icon 配 RADIUS 階梯之外)',
  ROW_AMOUNT_SIZE:                      'TYPE_STYLES.callout.size',
  ROW_AMOUNT_WEIGHT:                    'TYPOGRAPHY.weight.medium',
  ROW_LEFT_SLOT_SIZE:                   'ICON_SIZE.lg',
  ROW_NOTE_SIZE:                        'TYPE_STYLES.subheadline.size',
  ROW_SECONDARY_SIZE:                   'TYPE_STYLES.caption1.size',
  MORPH_DURATION_MS:                    'MOTION.duration.fast + 80',
  SECTION_ENTRY_DURATION_MS:            '(literal: visual calibration)',
  SECTION_ENTRY_STAGGER_MS:             '(literal: stagger interval)',
  SECTION_ENTRY_TRANSLATE_Y:            '(literal: entry offset)',
  SECTION_ENTRY_STAGGER_MAX_INDEX:      '(literal: index cap)',
  FOCUS_CARD_SHRINK_DURATION_MS:        '(literal: visual calibration)',
  FOCUS_CARD_GROW_DURATION_MS:          '(literal: visual calibration)',
};

function FoundationsCTTxListSection() {
  return (
    <DCSection
      id="found-ct-tx-list"
      title="Component Tokens · Transaction List"
      subtitle="交易列為 grouped section 結構，與 LIST_TOKENS 視覺差異大分開仲裁。內含 MORPH / SECTION_ENTRY / FOCUS_CARD 動畫 token。"
    >
      <DCFamily id="tx-list-tokens-family" title="Tokens" subtitle="TX_LIST_TOKENS 完整表格，涵蓋 section header、icon outline 與 animation。">
        <DCArtboard id="tx-list-tokens" label="TX_LIST_TOKENS · TxList row 專用" width="auto" height="auto">
          <TokenTableCard tokens={TX_LIST_TOKENS} title="TX_LIST_TOKENS" descriptions={TX_LIST_TOKEN_DESC} sources={TX_LIST_TOKEN_SOURCE}/>
        </DCArtboard>
      </DCFamily>
    </DCSection>
  );
}

Object.assign(window, {
  TX_LIST_TOKEN_DESC, TX_LIST_TOKEN_SOURCE, FoundationsCTTxListSection,
});
