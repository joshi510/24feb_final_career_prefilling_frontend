import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { getFieldRecommendations } from '../../src/utils/careerEngine.js';
import { buildCounsellorReport } from '../../src/utils/reportEngine.js';
import { careerDatabase } from '../../src/data/careerDatabase.js';
import { RIASEC_CAREER_FIELDS_MAPPING } from '../../src/data/fieldsConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const expectedPath = path.join(__dirname, 'expected-results.json');

const args = new Set(process.argv.slice(2));
const shouldUpdate = args.has('--update');

/** 40 profiles: dominant, paired, flat, low-engagement and mixed edge cases */
const GOLDEN_PROFILES = [
  { id: 'R-dominant-1', raw: { R: 78, I: 22, A: 12, S: 16, E: 24, C: 20 } },
  { id: 'I-dominant-1', raw: { R: 22, I: 82, A: 20, S: 14, E: 18, C: 24 } },
  { id: 'A-dominant-1', raw: { R: 10, I: 26, A: 84, S: 30, E: 18, C: 14 } },
  { id: 'S-dominant-1', raw: { R: 12, I: 24, A: 20, S: 86, E: 26, C: 18 } },
  { id: 'E-dominant-1', raw: { R: 14, I: 18, A: 22, S: 30, E: 88, C: 28 } },
  { id: 'C-dominant-1', raw: { R: 20, I: 24, A: 10, S: 18, E: 26, C: 90 } },
  { id: 'R-I-pair-1', raw: { R: 68, I: 66, A: 14, S: 12, E: 20, C: 30 } },
  { id: 'R-I-pair-2', raw: { R: 61, I: 58, A: 12, S: 18, E: 22, C: 34 } },
  { id: 'R-C-pair-1', raw: { R: 66, I: 26, A: 8, S: 14, E: 20, C: 64 } },
  { id: 'R-C-pair-2', raw: { R: 60, I: 22, A: 12, S: 16, E: 22, C: 62 } },
  { id: 'I-C-pair-1', raw: { R: 20, I: 72, A: 16, S: 14, E: 24, C: 68 } },
  { id: 'I-C-pair-2', raw: { R: 18, I: 66, A: 20, S: 16, E: 22, C: 61 } },
  { id: 'I-A-pair-1', raw: { R: 14, I: 70, A: 68, S: 18, E: 20, C: 16 } },
  { id: 'I-A-pair-2', raw: { R: 16, I: 64, A: 62, S: 20, E: 22, C: 18 } },
  { id: 'A-E-pair-1', raw: { R: 12, I: 24, A: 72, S: 20, E: 68, C: 22 } },
  { id: 'A-E-pair-2', raw: { R: 14, I: 22, A: 66, S: 24, E: 63, C: 26 } },
  { id: 'S-E-pair-1', raw: { R: 16, I: 18, A: 20, S: 71, E: 69, C: 24 } },
  { id: 'S-E-pair-2', raw: { R: 14, I: 22, A: 24, S: 64, E: 66, C: 28 } },
  { id: 'S-I-pair-1', raw: { R: 18, I: 66, A: 22, S: 68, E: 24, C: 20 } },
  { id: 'S-I-pair-2', raw: { R: 20, I: 60, A: 24, S: 62, E: 26, C: 22 } },
  { id: 'balanced-high-1', raw: { R: 48, I: 47, A: 46, S: 45, E: 44, C: 43 } },
  { id: 'balanced-high-2', raw: { R: 52, I: 51, A: 50, S: 49, E: 48, C: 47 } },
  { id: 'balanced-mid-1', raw: { R: 34, I: 33, A: 32, S: 31, E: 30, C: 29 } },
  { id: 'balanced-mid-2', raw: { R: 26, I: 25, A: 24, S: 23, E: 22, C: 21 } },
  { id: 'flat-edge-1', raw: { R: 20, I: 20, A: 20, S: 20, E: 20, C: 20 }, expectedEdge: 'flat_profile' },
  { id: 'flat-edge-2', raw: { R: 15, I: 15, A: 15, S: 15, E: 15, C: 15 }, expectedEdge: 'flat_profile' },
  { id: 'low-engagement-1', raw: { R: 4, I: 4, A: 4, S: 4, E: 4, C: 4 }, expectedEdge: 'low_engagement' },
  { id: 'low-engagement-2', raw: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }, expectedEdge: 'low_engagement' },
  { id: 'low-engagement-3', raw: { R: 8, I: 6, A: 5, S: 7, E: 6, C: 5 }, expectedEdge: 'low_engagement' },
  { id: 'networking-heavy-1', raw: { R: 58, I: 56, A: 8, S: 10, E: 20, C: 34 } },
  { id: 'networking-heavy-2', raw: { R: 54, I: 60, A: 10, S: 12, E: 18, C: 32 } },
  { id: 'humanities-artistic-1', raw: { R: 12, I: 30, A: 62, S: 60, E: 24, C: 20 } },
  { id: 'humanities-artistic-2', raw: { R: 14, I: 28, A: 58, S: 56, E: 26, C: 22 } },
  { id: 'analytics-finance-1', raw: { R: 24, I: 58, A: 16, S: 18, E: 52, C: 66 } },
  { id: 'analytics-finance-2', raw: { R: 22, I: 54, A: 18, S: 20, E: 48, C: 62 } },
  { id: 'health-social-1', raw: { R: 20, I: 36, A: 18, S: 70, E: 24, C: 28 } },
  { id: 'health-social-2', raw: { R: 18, I: 34, A: 16, S: 66, E: 22, C: 26 } },
  { id: 'computer-apps-1', raw: { R: 52, I: 54, A: 22, S: 18, E: 24, C: 42 } },
  { id: 'computer-apps-2', raw: { R: 48, I: 50, A: 24, S: 20, E: 22, C: 40 } },
  { id: 'engineering-vs-business', raw: { R: 56, I: 40, A: 12, S: 18, E: 54, C: 44 } }
];

function toDimensions(raw) {
  return Object.entries(raw).map(([code, score]) => ({ code, score }));
}

function stableRound(value) {
  return Math.round((Number(value) + Number.EPSILON) * 10000) / 10000;
}

function summarizeAnalysis(analysis) {
  const topFields = (analysis.topFields || []).map((f) => f.field);
  const topCareerTitles = (analysis.rankedCareersGlobal || []).slice(0, 8).map((c) => c.title);
  const pathway = (analysis.pathwayRows || []).map((row) => ({
    code: row.riasecCode,
    fields: (row.fields || []).map((f) => f.aspiringField),
    careers: (row.fields || []).map((f) => (f.careers || []).slice(0, 3).map((c) => c.title))
  }));
  return {
    valid: analysis.valid,
    confidence: analysis.confidence,
    edgeCase: analysis.edgeCase || null,
    dominantCode: analysis.state?.dominantCode || null,
    normalized: Object.fromEntries(
      Object.entries(analysis.state?.normalized || {}).map(([k, v]) => [k, stableRound(v)])
    ),
    topFields,
    topCareerTitles,
    pathway
  };
}

function assertRankingConsistency(analysis) {
  for (const field of analysis.topFields || []) {
    const careers = field.careers || [];
    for (let i = 1; i < careers.length; i += 1) {
      const prev = careers[i - 1];
      const cur = careers[i];
      if (prev.score < cur.score - 1e-8) {
        throw new Error(`Career sort broken in field "${field.field}"`);
      }
      if (Math.abs(prev.score - cur.score) < 1e-8 && prev.title.localeCompare(cur.title) > 0) {
        throw new Error(`Career tie-break broken in field "${field.field}"`);
      }
    }
  }
}

function assertExplanationQuality(analysis) {
  const topCareers = (analysis.rankedCareersGlobal || []).slice(0, 5);
  for (const career of topCareers) {
    const text = String(career.explanation || '');
    if (!text) throw new Error(`Missing explanation for "${career.title}"`);
    if (!/based on your strong|your interests look fairly balanced/i.test(text)) {
      throw new Error(`Top-trait context missing in explanation for "${career.title}"`);
    }
    const rec = careerDatabase.find((x) => x.name === career.title);
    if (rec?.why?.length) {
      const lower = text.toLowerCase();
      const hasWhy = rec.why.some((line) => lower.includes(String(line).toLowerCase()));
      if (!hasWhy) {
        throw new Error(`DB why-lines not reflected in explanation for "${career.title}"`);
      }
    }
  }
}

function assertEdgeCases(profile, analysis) {
  if (!profile.expectedEdge) return;
  if (analysis.edgeCase !== profile.expectedEdge) {
    throw new Error(`Expected edgeCase=${profile.expectedEdge}, got ${analysis.edgeCase || 'null'}`);
  }
  if (analysis.confidence !== 'Low') {
    throw new Error(`Expected Low confidence for edge case "${profile.id}"`);
  }
}

function assertInvariants(profile, analysis, report) {
  if (!analysis?.state?.normalized) throw new Error('Missing normalized state');
  const normSum = Object.values(analysis.state.normalized).reduce((s, v) => s + (Number(v) || 0), 0);
  const isAllZeroRaw = Object.values(profile.raw).every((v) => Number(v) === 0);
  if (isAllZeroRaw) {
    if (Math.abs(normSum) > 1e-6) {
      throw new Error(`Expected normalized sum 0 for all-zero raw input, got ${normSum}`);
    }
  } else if (Math.abs(normSum - 1) > 1e-6) {
    throw new Error(`Normalized scores should sum to 1, got ${normSum}`);
  }

  const topFields = analysis.topFields || [];
  const isFlat = analysis.edgeCase === 'flat_profile' || analysis.flatProfile === true;
  for (let i = 1; i < topFields.length; i += 1) {
    if (isFlat) {
      if (String(topFields[i - 1].field).localeCompare(String(topFields[i].field)) > 0) {
        throw new Error(`Top fields not sorted alphabetically for flat profile "${profile.id}"`);
      }
    } else if (topFields[i - 1].score < topFields[i].score - 1e-8) {
      throw new Error(`Top fields not sorted by score for "${profile.id}"`);
    }
  }

  for (const row of analysis.pathwayRows || []) {
    const allowed = new Set(RIASEC_CAREER_FIELDS_MAPPING[row.riasecCode] || []);
    for (const field of row.fields || []) {
      if (!allowed.has(field.aspiringField)) {
        throw new Error(`Row ${row.riasecCode} has unmapped field "${field.aspiringField}"`);
      }
    }
  }

  const seen = new Set();
  for (const row of report?.pathwayRowsForDisplay || []) {
    for (const field of row.fields || []) {
      for (const c of field.careers || []) {
        const k = String(c.title || '').trim().toLowerCase();
        if (!k) continue;
        if (seen.has(k)) {
          throw new Error(`Duplicate career in pathwayRowsForDisplay: "${c.title}"`);
        }
        seen.add(k);
      }
    }
  }
}

function assertDeterministic(rawInput) {
  const dims = toDimensions(rawInput);
  const a = summarizeAnalysis(getFieldRecommendations(dims));
  const b = summarizeAnalysis(getFieldRecommendations(dims));
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    throw new Error('Non-deterministic output for same input');
  }
}

function loadExpected() {
  if (!fs.existsSync(expectedPath)) return {};
  return JSON.parse(fs.readFileSync(expectedPath, 'utf8'));
}

function saveExpected(data) {
  fs.mkdirSync(path.dirname(expectedPath), { recursive: true });
  fs.writeFileSync(expectedPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function main() {
  const expected = loadExpected();
  const nextExpected = {};
  const failures = [];

  for (const profile of GOLDEN_PROFILES) {
    try {
      assertDeterministic(profile.raw);

      const dims = toDimensions(profile.raw);
      const analysis = getFieldRecommendations(dims);
      const report = buildCounsellorReport(dims, analysis);
      if (!report?.valid && !analysis?.valid) {
        // allowed only for explicitly invalid inputs (none in this suite)
      }

      assertRankingConsistency(analysis);
      assertExplanationQuality(analysis);
      assertEdgeCases(profile, analysis);
      assertInvariants(profile, analysis, report);

      const summary = summarizeAnalysis(analysis);
      nextExpected[profile.id] = summary;

      if (!shouldUpdate) {
        const old = expected[profile.id];
        if (!old) {
          failures.push(`[${profile.id}] missing expected snapshot`);
        } else if (JSON.stringify(old) !== JSON.stringify(summary)) {
          failures.push(`[${profile.id}] snapshot mismatch`);
        }
      }
    } catch (err) {
      failures.push(`[${profile.id}] ${err.message}`);
    }
  }

  if (shouldUpdate) {
    saveExpected(nextExpected);
    console.log(`Updated golden snapshots: ${Object.keys(nextExpected).length} profiles`);
    return;
  }

  if (Object.keys(expected).length !== GOLDEN_PROFILES.length) {
    failures.push(
      `expected-results count mismatch (expected ${GOLDEN_PROFILES.length}, got ${Object.keys(expected).length})`
    );
  }

  if (failures.length > 0) {
    console.error('Golden test failures:\n' + failures.map((x) => `- ${x}`).join('\n'));
    process.exit(1);
  }

  console.log(`Golden tests passed for ${GOLDEN_PROFILES.length} profiles`);
}

main();
