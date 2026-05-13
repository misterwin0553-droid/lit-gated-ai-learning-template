# Adaptation Guide

This guide explains how to turn the Mars reference demo into another Lit-gated learning module.

## 1. Replace the mission content

Edit:

```text
content/mission.json
```

Keep the same conceptual structure:

```json
{
  "id": "mission-001",
  "title": "Your module title",
  "layers": [
    { "id": "public", "audience": "everyone", "content": "..." },
    { "id": "student", "audience": "authorized learners", "content": "..." },
    { "id": "teacher", "audience": "teachers", "content": "..." },
    { "id": "source", "audience": "creators/reviewers", "content": "..." }
  ],
  "aiTasks": [
    { "id": "public_summary", "allowedLayers": ["public"] },
    { "id": "student_hint", "allowedLayers": ["public", "student"] },
    { "id": "teacher_script", "allowedLayers": ["public", "student", "teacher"] },
    { "id": "source_review", "allowedLayers": ["public", "student", "teacher", "source"] }
  ]
}
```

Recommended layer design:

| Layer | Put here | Do not put here |
|---|---|---|
| `public` | prompt, setup, safe observation | answer keys, private hints |
| `student` | hints, guided clues, scaffolding | teacher-only solution script |
| `teacher` | rubric, answer guidance, misconception warnings | internal source-review notes |
| `source` | citations, licensing, editorial rationale | secrets unrelated to the module |

## 2. Update roles and access policy

Relevant files:

```text
src/context-builder.mjs
src/demo.mjs
src/lit-plan.mjs
```

The default policy is:

```text
public_learner → public
student        → public + student
teacher        → public + student + teacher
owner          → public + student + teacher + source
```

For a new product, replace these with your actual access model:

- wallet allowlist;
- NFT ownership;
- payment receipt;
- course enrollment credential;
- organization membership;
- teacher/admin role.

## 3. Map layers to Lit

For each protected layer:

```text
student
teacher
source
```

create a Lit access condition and encrypt that layer separately.

Recommended design:

```text
one protected layer = one encrypted payload = one explicit access condition
```

Avoid putting all private content into one encrypted blob unless every authorized role should see all of it.

## 4. Update visual stages

Edit:

```text
src/render-page.mjs
```

The Mars demo uses this progression:

```text
raw image → evidence map → reasoning board → 3D/source model
```

For another module, choose a learning-specific progression.

Examples:

### Biology

```text
specimen image → labeled structure → process diagram → lab/source notes
```

### Compliance training

```text
scenario → risk indicators → decision tree → auditor notes
```

### Developer documentation

```text
problem statement → code hints → architecture explanation → maintainer notes
```

### History lesson

```text
primary source → annotation map → causality timeline → citation/source review
```

## 5. Update AI tasks

AI tasks should never receive every layer by default.

Good:

```text
student_hint receives public + student
teacher_script receives public + student + teacher
source_review receives all layers
```

Bad:

```text
all tasks receive all content and rely on prompt instructions not to leak
```

The whole point of this template is to remove forbidden context before the AI sees it.

## 6. Verify

Run:

```bash
npm test
npm run render
npm run lit:plan
npm run verify
```

Before publishing, manually check:

- public role cannot see private layers;
- student role cannot see teacher/source content;
- teacher role cannot see source-only annotations;
- AI tasks report denied layers instead of leaking them;
- source citations are visible only where intended;
- browser wallet route works in your deployment environment.

## 7. Production checklist

Before using this template in production:

- use real Lit access conditions for every private layer;
- do not rely on frontend hiding alone;
- do not put secrets into public bundles;
- host on HTTPS;
- test with at least two wallets;
- document content licensing;
- keep answer keys and source notes encrypted separately;
- add telemetry only with consent and privacy review.
