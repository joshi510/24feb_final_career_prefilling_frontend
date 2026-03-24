# RIASEC Recommendation Policy

This document defines the reliability rules used by the recommendation engine.

## 1) Determinism

- Same RIASEC input must always produce the same:
  - ranked fields
  - ranked careers
  - pathway rows
  - explanations
- Tie-breaks are deterministic:
  - numeric score desc
  - then lexical order (field/career title)

## 2) Scoring vs Display Separation

- Scoring uses normalized RIASEC profile + field weights + behavioral conflict modifiers.
- Pathway display applies row/field policies after scoring.
- UI/PDF card caps (max careers per field card) are display constraints, not scoring rules.

## 3) Pathway Placement Rules

- Base placement rule: best row by weighted affinity (field weight x student raw score).
- DB primary-trait pin is used unless the field is in `skipDbPrimaryPinFields`.
- Field/title forced-row overrides are centralized in `PATHWAY_PLACEMENT_POLICY.forceRowByFieldAndTitle`.

## 4) Pathway Row Field Visibility

- Row-level forced include rules are centralized in `PATHWAY_ROW_FIELD_POLICY`.
- These rules ensure key fields are present in top pathway columns when required by product policy.

## 5) De-duplication

- A career title appears once in `pathwayRowsForDisplay`.
- After winner selection, row-order pass removes any remaining duplicates deterministically.

## 6) Edge Cases

- Low-engagement and flat-profile states must be flagged consistently.
- Edge-case profiles must return low confidence.

## 7) Golden + Invariant Testing

- Golden snapshots verify full output stability across reference profiles.
- Invariants verify:
  - normalized score sum = 1
  - sorted outputs
  - valid row-field mapping
  - no duplicate careers in display pathways

## 8) Change Discipline

- Modify policy in one place first.
- Update golden snapshots only after reviewing expected behavioral change.
