// ─────────────────────────────────────────────────────────────
// DATA_MANAGEMENT_SCREEN_TOKENS · DataManagementScreen 內部 composition 參數
//
// Push screen，3 個 ListSection（匯入 / 匯出 / 清除所有資料）。
// impl src/screens/Settings/DataManagementScreen.tsx 結構鏡射。
// ─────────────────────────────────────────────────────────────

const DATA_MANAGEMENT_SCREEN_TOKENS = {
  SCREEN_PADDING: SPACING.lg,
};

Object.assign(window, { DATA_MANAGEMENT_SCREEN_TOKENS });
