/**
 * Single source of truth for pathway override policy.
 * Keep values data-driven so policy can be reviewed and tuned without touching logic.
 */
export const PATHWAY_OVERRIDE_CONFIG = {
  /** Row-level forced field visibility in top pathway columns */
  forceFieldInRow: {
    I: ['Networking'],
    A: ['Humanities']
  },

  /** Optional career-id based row pinning (kept for future policy expansion) */
  forceRowByCareerId: {},

  /** Skip DB primary-trait pinning for these fields */
  skipDbPrimaryPinFields: ['Computer Applications'],

  /** Field + title based row pinning (current behavior) */
  forceRowByFieldAndTitle: {
    Networking: {
      rowCode: 'I',
      titles: ['network engineer', 'solutions architect']
    },
    Humanities: {
      rowCode: 'A',
      titles: ['technical writer', 'policy analyst']
    }
  }
};

