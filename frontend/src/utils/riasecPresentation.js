/**
 * Presentation-only helpers for RIASEC UI (thresholds, labels). No scoring logic.
 */

export const RIASEC_MATCH_THRESHOLDS = { high: 30, moderate: 15 };

export function getDimensionMatchLevel(percentScore) {
  const s = Number(percentScore) || 0;
  if (s >= RIASEC_MATCH_THRESHOLDS.high) return 'HIGH';
  if (s >= RIASEC_MATCH_THRESHOLDS.moderate) return 'MODERATE';
  return 'LOW';
}
