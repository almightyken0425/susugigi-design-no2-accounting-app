// ─────────────────────────────────────────────────────────────
// OFFLINE_RETRY_SCREEN_TOKENS · OfflineRetryScreen 內部 composition 參數
//
// Full-screen entry。三段：branding（flex 2）/ body（文案 + 重試鈕，flex 1）/
// footer（版權）。
// impl src/screens/Bootstrap/OfflineRetryScreen.tsx 結構鏡射。
// ─────────────────────────────────────────────────────────────

const OFFLINE_RETRY_SCREEN_TOKENS = {
  BRANDING_PADDING_TOP:  SPACING['4xl'],
  LOGO_HEIGHT:           96,                    // (literal: 品牌 mark 104×96pt，對齊 impl wish-logo 資產與原登入頁品牌區)
  CONTAINER_PADDING_H:   SPACING['2xl'],
  MESSAGE_FONT_SIZE:     TYPOGRAPHY.size.sm,
  MESSAGE_GAP:           SPACING.lg,            // 說明文案與重試鈕間距
  RETRY_BUTTON_HEIGHT:   58,                    // (literal: 對齊 paywall CTA_HEIGHT 58)
  RETRY_BUTTON_RADIUS:   RADIUS.xl,
  RETRY_FONT_SIZE:       TYPOGRAPHY.size.base,
  FOOTER_PADDING_BOTTOM: SPACING['2xl'],
  FOOTER_FONT_SIZE:      TYPOGRAPHY.size.xs,
};

Object.assign(window, { OFFLINE_RETRY_SCREEN_TOKENS });
