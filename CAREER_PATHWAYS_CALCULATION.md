# Potential Career Pathways Calculation Methodology

## Overview
The "Potential Career Pathways" section displays 3-5 IT career recommendations based on a student's RIASEC personality assessment results. The calculation uses a **two-tier approach**: primary backend generation (LLM-based) with a frontend fallback (deterministic).

---

## Calculation Flow

### Step 1: Identify Top 3 RIASEC Dimensions
1. **Sort all 6 RIASEC dimensions** by score (highest to lowest)
2. **Extract top 3 codes** (e.g., if scores are I=45, A=38, C=32, then top3 = ['I', 'A', 'C'])
3. **Create RIASEC Mix** by joining codes: `"I-A-C"`

**Example:**
```
Dimensions sorted: I (45%), A (38%), C (32%), S (25%), E (20%), R (15%)
Top 3 Codes: ['I', 'A', 'C']
RIASEC Mix: "I-A-C"
```

---

## Primary Method: Backend LLM Generation

### Location
`backend/services/riasecReportGenerator.js`

### Process
1. **Input**: RIASEC scores (R, I, A, S, E, C) and top 3 traits
2. **LLM Prompt**: Sends structured prompt to Gemini API requesting:
   - 3-5 career pathways
   - Each pathway must have:
     - **Degree**: From predefined list (BCA, MCA, M.Sc (IT), etc.)
     - **RIASEC Mix**: Combination of top 3 codes
     - **Career Role**: IT-related role matching the RIASEC mix
     - **Professional Persona**: Descriptive title
     - **Core Tasks & Focus**: Brief description
3. **Constraints**:
   - All pathways must be IT-related only
   - Each pathway must have a **different degree** (no duplicates)
   - Career roles must logically match RIASEC mix
   - Example: `I-A-C` → Data Scientist, `A-I-C` → UI/UX Designer

### LLM Prompt Rules
```
- Generate 3-5 career pathways based on top traits combination
- ALL career pathways MUST be IT-related only
- For "degree" field, use ONLY these academic degrees: 
  BCA, MCA, M.Sc (IT), M.Sc (Computer Science), B.Tech (CS), 
  B.Tech (IT), B.E. (Computer Engineering), B.Sc (IT), 
  B.Sc (Computer Science), B.Voc (SD)
- IMPORTANT: Each pathway MUST have a DIFFERENT degree
- For "careerRole" field, use ONLY these career roles:
  Full Stack Developer, Frontend Developer, Backend Developer, 
  Mobile App Developer, Data Analyst, Data Scientist, Data Engineer, 
  DevOps Engineer, Cloud Engineer, Web Designer, UI/UX Designer, 
  Product Designer, Software Tester, Cybersecurity Analyst, 
  AI / ML Engineer, Game Developer
- Match "careerRole" to "riasecMix" logically
```

---

## Fallback Method: Frontend Deterministic Calculation

### Location
`frontend/src/components/RIASECCareerPathways.jsx`

### When Used
- If backend LLM doesn't generate pathways
- If `careerPathways` from backend is empty/null
- If `dimensions` prop is available (RIASEC scores)

### Process

#### 1. Generate Career Roles
```javascript
// Create 6 combinations from top 3 codes
roleCombinations = [
  [top3Codes[0], top3Codes[1], top3Codes[2]],  // I-A-C
  [top3Codes[0], top3Codes[2], top3Codes[1]],   // I-C-A
  [top3Codes[1], top3Codes[2], top3Codes[0]],   // A-C-I
  [top3Codes[1], top3Codes[0], top3Codes[2]],   // A-I-C
  [top3Codes[2], top3Codes[0], top3Codes[1]],   // C-I-A
  [top3Codes[2], top3Codes[1], top3Codes[0]]    // C-A-I
]

// Calculate role for each combination
calculatedRoles = roleCombinations.map(([p, s, t]) => calculateRole(p, s, t))
```

#### 2. Role Mapping Logic (`calculateRole`)
Deterministic mapping based on primary + secondary RIASEC codes:

| Primary | Secondary | Career Role |
|---------|-----------|-------------|
| I | A | Data Scientist |
| I | C | Data Engineer |
| A | I | UI/UX Designer |
| A | C | Web Designer |
| C | I | Data Analyst |
| C | A | Software Tester |
| I | R | AI / ML Engineer |
| R | I | DevOps Engineer |
| A | S | Product Designer |
| S | A | Frontend Developer |
| I | S | Backend Developer |
| S | I | Full Stack Developer |
| R | C | Cybersecurity Analyst |
| C | R | Backend Developer |
| A | R | Game Developer |
| R | A | Cybersecurity Analyst |
| S | C | Mobile App Developer |
| C | S | Frontend Developer |
| * | * | Full Stack Developer (default) |

#### 3. Generate Degrees
```javascript
// Create 6 degree combinations from top 3 codes
degreeCombinations = [
  [top3Codes[0], top3Codes[1]],  // I-A
  [top3Codes[0], top3Codes[2]],   // I-C
  [top3Codes[1], top3Codes[2]],   // A-C
  [top3Codes[1], top3Codes[0]],   // A-I
  [top3Codes[2], top3Codes[0]],   // C-I
  [top3Codes[2], top3Codes[1]]    // C-A
]

// Calculate degree for each combination
calculatedDegrees = degreeCombinations.map(([p, s]) => calculateDegree(p, s))
```

#### 4. Degree Mapping Logic (`calculateDegree`)
Deterministic mapping based on primary + secondary RIASEC codes:

| Primary | Secondary | Degree |
|---------|-----------|--------|
| I | A | B.Tech (CS) |
| A | I | BCA |
| I | C | M.Sc (IT) |
| C | I | B.Tech (IT) |
| A | C | BCA |
| C | A | B.Voc (SD) |
| R | I | B.E. (Computer Engineering) |
| I | R | B.Tech (CS) |
| R | A | B.E. (Computer Engineering) |
| A | R | BCA |
| R | C | B.E. (Computer Engineering) |
| C | R | B.Tech (IT) |
| S | I | B.Sc (Computer Science) |
| I | S | MCA |
| S | A | B.Sc (IT) |
| A | S | BCA |
| S | C | B.Sc (IT) |
| C | S | B.Tech (IT) |
| E | * | Various (based on secondary) |
| * | * | B.Tech (CS) (default) |

#### 5. Ensure Uniqueness
```javascript
// Remove duplicate roles
roles = [...calculatedRoles, ...additionalRoles].filter(unique).slice(0, 5)

// Remove duplicate degrees, add from full list if needed
degrees = [...calculatedDegrees, ...additionalDegrees].slice(0, 10)

// Final assignment: each pathway gets unique degree
pathways = roles.map((role, idx) => ({
  degree: degrees[idx],
  riasecMix: idx === 0 ? riasecMix : `${top3Codes[0]}-${top3Codes[1]}-${top3Codes[2]}`,
  careerRole: role,
  professionalPersona: calculatePersona(role),
  coreTasksFocus: calculateFocus(role)
}))
```

#### 6. Professional Persona & Focus
- **Persona**: Predefined mapping (e.g., "Data Scientist" → "The Insight Architect")
- **Focus**: Predefined description for each role

---

## Final Uniqueness Enforcement

### Location
`frontend/src/components/RIASECCareerPathways.jsx` (lines 188-205)

Even if backend or frontend calculation produces duplicate degrees, a final pass ensures uniqueness:

```javascript
if (pathways.length > 1) {
  const usedDegrees = new Set();
  
  pathways = pathways.map((pathway, idx) => {
    let degree = pathway.degree;
    
    // If degree is already used or missing, assign a unique one
    if (!degree || usedDegrees.has(degree)) {
      const availableDegrees = allDegrees.filter(d => !usedDegrees.has(d));
      degree = availableDegrees[idx % availableDegrees.length];
    }
    
    usedDegrees.add(degree);
    return { ...pathway, degree };
  });
}
```

---

## Complete Example

### Input
```
RIASEC Scores:
- I (Investigative): 45%
- A (Artistic): 38%
- C (Conventional): 32%
- S (Social): 25%
- E (Enterprising): 20%
- R (Realistic): 15%
```

### Step 1: Top 3 Identification
```
Top 3 Codes: ['I', 'A', 'C']
RIASEC Mix: "I-A-C"
```

### Step 2: Backend LLM Generation (Primary)
**Pathway 1:**
- Degree: B.Tech (CS)
- RIASEC Mix: I-A-C
- Career Role: Data Scientist
- Professional Persona: The Insight Architect
- Core Tasks & Focus: Analyzing complex data patterns...

**Pathway 2:**
- Degree: BCA
- RIASEC Mix: I-A-C
- Career Role: UI/UX Designer
- Professional Persona: The Creative Innovator
- Core Tasks & Focus: Designing intuitive user experiences...

**Pathway 3:**
- Degree: M.Sc (IT)
- RIASEC Mix: I-A-C
- Career Role: Data Engineer
- Professional Persona: The Analytical Strategist
- Core Tasks & Focus: Building robust data infrastructure...

### Step 3: Frontend Fallback (If Backend Fails)
**Role Combinations:**
1. I-A-C → Data Scientist
2. I-C-A → Data Engineer
3. A-C-I → Web Designer
4. A-I-C → UI/UX Designer
5. C-I-A → Data Analyst

**Degree Combinations:**
1. I-A → B.Tech (CS)
2. I-C → M.Sc (IT)
3. A-C → BCA
4. A-I → BCA
5. C-I → B.Tech (IT)
6. C-A → B.Voc (SD)

**Final Pathways:**
1. B.Tech (CS) + Data Scientist
2. M.Sc (IT) + Data Engineer
3. BCA + Web Designer
4. B.Tech (IT) + UI/UX Designer
5. B.Voc (SD) + Data Analyst

---

## Key Features

1. **Deterministic Fallback**: If LLM fails, frontend uses rule-based mapping
2. **Uniqueness Guarantee**: Final pass ensures no duplicate degrees
3. **IT-Only Focus**: All pathways are IT-related
4. **Logical Matching**: Career roles match RIASEC personality types
5. **Variety**: Up to 5 different pathways with different degrees

---

## Available Degrees (10 total)
1. BCA
2. MCA
3. M.Sc (IT)
4. M.Sc (Computer Science)
5. B.Tech (CS)
6. B.Tech (IT)
7. B.E. (Computer Engineering)
8. B.Sc (IT)
9. B.Sc (Computer Science)
10. B.Voc (SD)

## Available Career Roles (16 total)
1. Full Stack Developer
2. Frontend Developer
3. Backend Developer
4. Mobile App Developer
5. Data Analyst
6. Data Scientist
7. Data Engineer
8. DevOps Engineer
9. Cloud Engineer
10. Web Designer
11. UI/UX Designer
12. Product Designer
13. Software Tester
14. Cybersecurity Analyst
15. AI / ML Engineer
16. Game Developer

---

## Notes

- **Best Match**: First pathway (index 0) is highlighted as "Best Match"
- **Caching**: Backend LLM results are cached in `interpreted_results.riasec_report` JSON column
- **Performance**: Frontend calculation is memoized using `useMemo` hook
- **Flexibility**: System can handle 3-5 pathways (backend may generate fewer)

