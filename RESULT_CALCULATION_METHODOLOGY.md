# Result Calculation Methodology

## Overview
This document explains how test results are calculated in the Career Profiling System. The system uses **mathematical calculations** (no LLM) for scoring, and **LLM (Gemini API)** only for generating text reports and interpretations.

---

## 1. Answer Value Mapping

### Likert Scale Mapping
All answers are converted to numerical values using this mapping:

```
A = 1 (Strongly Disagree / Lowest)
B = 2 (Disagree / Low)
C = 3 (Neutral / Medium)
D = 4 (Agree / High)
E = 5 (Strongly Agree / Highest)
```

**Location:** `backend/services/scoring.js` and `backend/services/riasecScoring.js`

**Example:**
- If a student selects "D" (Agree), the value is `4`
- If a student selects "A" (Strongly Disagree), the value is `1`

---

## 2. Section-Based Scoring (Sections 1-4)

### Process:
1. **Group answers by section** (Section 1, 2, 3, or 4)
2. **Sum all answer values** for each section
3. **Calculate average** per section: `Average = Total Sum / Number of Questions`
4. **Convert to percentage** (0-100%): `Percentage = ((Average - 1) / 4) * 100`

### Formula:
```
Section Score = ((Sum of all answer values / Number of questions) - 1) / 4 * 100
```

**Example:**
- Section 1 has 7 questions
- Student answers: A(1), B(2), C(3), D(4), E(5), D(4), C(3)
- Sum = 1 + 2 + 3 + 4 + 5 + 4 + 3 = 22
- Average = 22 / 7 = 3.14
- Percentage = ((3.14 - 1) / 4) * 100 = 53.5%

**Location:** `backend/services/scoring.js` → `calculateRawScores()`

---

## 3. Overall Score Calculation

### Process:
1. **Sum all answer values** across ALL sections (1-4)
2. **Calculate overall average**: `Average = Total Sum / Total Questions`
3. **Convert to percentage**: `Overall % = ((Average - 1) / 4) * 100`
4. **Clamp to valid range**: Ensure result is between 0% and 100%

### Formula:
```
Overall Score = ((Sum of ALL answers / Total questions) - 1) / 4 * 100
```

**Example:**
- Total questions: 28 (7 per section × 4 sections)
- Total sum: 84
- Average = 84 / 28 = 3.0
- Overall % = ((3.0 - 1) / 4) * 100 = 50%

**Location:** `backend/services/scoring.js` → `calculateRawScores()` (lines 114-117)

---

## 4. RIASEC Score Calculation (Sections 5-10)

### Section to RIASEC Mapping:
```
Section 5 → R (Realistic)
Section 6 → I (Investigative)
Section 7 → A (Artistic)
Section 8 → S (Social)
Section 9 → E (Enterprising)
Section 10 → C (Conventional)
```

### Process:
1. **Get all answers** from sections 5-10
2. **Group by RIASEC category** (R, I, A, S, E, C)
3. **Sum answer values** for each category
4. **Calculate average** per category: `Average = Total / Count`
5. **Convert to percentage**: `RIASEC Score = ((Average - 1) / 4) * 100`

### Formula:
```
RIASEC Score (R/I/A/S/E/C) = ((Sum of category answers / Count) - 1) / 4 * 100
```

**Example for R (Realistic):**
- Section 5 has 7 questions
- Answers: D(4), E(5), C(3), D(4), E(5), D(4), C(3)
- Sum = 4 + 5 + 3 + 4 + 5 + 4 + 3 = 28
- Average = 28 / 7 = 4.0
- R Score = ((4.0 - 1) / 4) * 100 = 75%

**Location:** `backend/services/riasecScoring.js` → `calculateRIASECScores()`

---

## 5. Match Level Classification

### Deterministic Rules (Based on Percentage):
```
>= 30%  → HIGH MATCH
15-29%  → MODERATE MATCH
< 15%   → LOW MATCH
```

**Rationale:**
These thresholds are calibrated to reflect meaningful interest intensity levels within the RIASEC framework. Scores ≥30% indicate substantial alignment with a dimension, representing clear vocational preferences. Scores between 15-29% suggest moderate interest with potential for development. Scores <15% indicate minimal alignment, representing areas where the individual shows limited natural affinity. This classification enables reliable career guidance by distinguishing between strong, developing, and weak interest patterns.

**Applied to:**
- Each RIASEC dimension (R, I, A, S, E, C)
- Calculated dynamically based on the percentage score

**Example:**
- R Score = 45% → **HIGH MATCH**
- I Score = 22% → **MODERATE MATCH**
- A Score = 8% → **LOW MATCH**

**Location:** 
- `backend/services/riasecReportGenerator.js` → `getMatchLevel()` (line 31-35)
- `frontend/src/components/RIASECDimensionCard.jsx` → `calculateMatchLevel()` (for frontend validation)

---

## 6. Score Conversion Formula (1-5 to 0-100%)

### Mathematical Conversion:
```
Percentage = ((Average Score - 1) / 4) * 100
```

### Mathematical Context:
This linear normalization formula maps the 1-5 Likert scale to a 0-100% range using standard psychometric scaling principles. The formula `(x - min) / (max - min) * range` is applied where:
- **x** = average score (1-5)
- **min** = 1 (minimum Likert value)
- **max** = 5 (maximum Likert value)
- **range** = 100 (target percentage range)

This ensures proportional representation: a score of 3.0 (neutral) maps to 50%, maintaining intuitive interpretation while enabling precise percentage-based comparisons across dimensions.

### Conversion Table:
| Average (1-5) | Percentage (0-100%) |
|---------------|---------------------|
| 1.0           | 0%                  |
| 2.0           | 25%                 |
| 3.0           | 50%                 |
| 4.0           | 75%                 |
| 5.0           | 100%                |

---

## 7. Decision Risk Calculation

### Based on Top 3 RIASEC Scores:

**Logic:**
1. Sort all 6 RIASEC scores (R, I, A, S, E, C) from highest to lowest
2. Get top 3 scores
3. Calculate differences:
   - `diffTopSecond = Top Score - Second Score`
   - `diffSecondThird = Second Score - Third Score`

**Risk Classification:**
```
If (diffTopSecond < 10 AND diffSecondThird < 10):
    → Moderate Risk, Developing Stability

Else If (diffTopSecond >= 15 AND diffSecondThird >= 10):
    → Low Risk, Highly Stable

Else If (topScore < 50 OR (topScore - lowestScore) < 20):
    → High Risk, Developing Stability

Else:
    → Moderate Risk, Moderately Stable
```

**Safety Disclaimer:**
Decision Risk indicators reflect profile consistency and score differentiation patterns, not predictive outcomes. "High Risk" indicates less distinct interest patterns requiring further exploration, not failure probability. "Low Risk" suggests clearer preference alignment, not guaranteed career success. These metrics serve as guidance tools for career exploration and should be interpreted alongside comprehensive counseling and individual circumstances.

**Location:** `backend/services/riasecReportGenerator.js` (lines 54-80)

---

## 8. LLM Usage and Boundaries

### LLM is ONLY used for:
1. **RIASEC Report Generation** (`riasecReportGenerator.js`)
   - Generates personalized analysis text
   - Creates career pathway recommendations
   - Writes dimension descriptions

2. **General Interpretation** (`geminiService.js`, `geminiInterpreter.js`)
   - Generates interpretation text
   - Creates strengths/weaknesses descriptions
   - Writes career guidance

### LLM is NOT used for:
- ❌ Score calculations (pure math)
- ❌ Percentage conversions (pure math)
- ❌ Match level classification (deterministic rules)
- ❌ Overall score calculation (pure math)

### Credibility Guardrails:
The LLM operates strictly within text generation boundaries. All numerical scores, percentages, match levels, and risk classifications are calculated deterministically using mathematical formulas. The LLM receives these calculated values as input and generates descriptive text only. This separation ensures:
- **Score integrity**: All numerical results are reproducible and verifiable
- **Consistency**: Identical scores always produce identical classifications
- **Transparency**: Calculation methodology is fully auditable
- **Reliability**: Results are not subject to LLM variability or interpretation drift

---

## 9. Complete Calculation Flow

```
Student Answers
    ↓
Convert to Values (A=1, B=2, C=3, D=4, E=5)
    ↓
Group by Section/Dimension
    ↓
Calculate Averages (Sum / Count)
    ↓
Convert to Percentages ((Avg - 1) / 4 * 100)
    ↓
Classify Match Levels (>=30 High, 15-29 Moderate, <15 Low)
    ↓
Calculate Decision Risk (Based on top 3 scores)
    ↓
Store in Database
    ↓
Generate LLM Report (Text only, uses calculated scores)
    ↓
Display Results
```

---

## 10. Example: Complete Calculation

### Input:
- **Section 5 (Realistic)**: 7 questions
- **Answers**: A, B, C, D, E, D, C

### Step-by-Step:
1. **Convert to values**: 1, 2, 3, 4, 5, 4, 3
2. **Sum**: 1 + 2 + 3 + 4 + 5 + 4 + 3 = 22
3. **Average**: 22 / 7 = 3.14
4. **Percentage**: ((3.14 - 1) / 4) * 100 = 53.5%
5. **Match Level**: 53.5% >= 30 → **HIGH MATCH**

### Final Result:
- **R Score**: 53.5%
- **Match Level**: HIGH MATCH

---

## 11. Key Files

### Backend Calculation:
- `backend/services/scoring.js` - Section scores (1-4) and overall
- `backend/services/riasecScoring.js` - RIASEC scores (5-10)
- `backend/services/riasecReportGenerator.js` - Match levels and LLM report generation

### Frontend Display:
- `frontend/src/components/RIASECDimensionCard.jsx` - Displays scores and match levels
- `frontend/src/components/RIASECRadarChart.jsx` - Visualizes RIASEC scores
- `frontend/src/components/ResultPDF.jsx` - PDF export with scores

---

## 12. Important Notes

1. **No LLM for Scoring**: All scores are calculated using pure mathematics
2. **Deterministic Match Levels**: Match levels are calculated based on fixed thresholds (30%, 15%)
3. **Consistent Formula**: All percentage conversions use the same formula: `((avg - 1) / 4) * 100`
4. **Data Integrity**: Scores are stored in the database and can be recalculated if needed
5. **Validation**: Invalid answers default to safe values (3 for Likert, 0 for MCQ)

---

## 13. Validation & Error Handling

### Answer Status Classification:

**Invalid Answer:**
- Answer format does not match expected pattern (e.g., "X" instead of A-E)
- **Handling**: 
  - Likert Scale → Defaults to 3 (C/Neutral)
  - Multiple Choice → Defaults to 0
- **Impact**: Included in calculation with default value

**Missing Answer:**
- Question was not answered (null or empty response)
- **Handling**: Excluded from calculation entirely
- **Impact**: Reduces question count for that section/dimension

**Skipped Question:**
- Question intentionally bypassed by student
- **Handling**: Treated as missing answer, excluded from calculation
- **Impact**: Section score calculated from available answers only

### Edge Cases:

**No Answers Provided:**
- Student submits test with zero answers
- **Result**: Returns 0% for all dimensions
- **Status**: Valid calculation (empty dataset)

**All Same Answer:**
- Student selects identical option for all questions (e.g., all "E")
- **Result**: Calculates normally (e.g., all "E" = 100% for that dimension)
- **Status**: Valid calculation, may indicate response pattern requiring review

**Mixed Sections:**
- Student completes some sections but not others
- **Result**: Each section calculated independently from available data
- **Status**: Valid partial calculation

**Incomplete RIASEC Data:**
- Student completes sections 1-4 but not 5-10
- **Result**: Section scores (1-4) calculated normally; RIASEC scores remain 0%
- **Status**: Valid partial assessment

---

## Summary

**Scoring = Pure Mathematics** ✅
- Answer values (A=1 to E=5)
- Averages (Sum / Count)
- Percentages ((Avg - 1) / 4 * 100)
- Match levels (>=30, 15-29, <15)

**LLM = Text Generation Only** ✅
- Personalized descriptions
- Career recommendations
- Interpretation text

All calculations are **transparent, reproducible, and mathematically sound**.
