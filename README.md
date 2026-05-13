# Lit-Gated AI Learning Module Template

An open-source developer template for building **progressive-access interactive learning modules** with Lit Protocol.

Reference demo:

> **Mission 001: Mars Water Evidence Explorer** — a NASA Mars investigation where public learners, students, teachers, creators, and AI assistants receive different unlocked knowledge layers.

This is not a NASA product, edtech startup, or content business. The NASA mission is a reference dataset. The reusable artifact is the **Lit-gated learning-layer + AI context-gating pattern**.

---

## What this demonstrates

Most Lit examples show a simple unlock:

```text
wallet / token / condition → hidden content
```

This template demonstrates a richer educational pattern:

```text
learner role / access condition
        ↓
Lit-gated learning layers
        ↓
visual knowledge stage unlocked
        ↓
AI assistant receives only permitted context
```

The goal is to help developers build Lit-enabled learning products where private hints, teacher notes, answer keys, source annotations, and AI context are not accidentally exposed to the wrong audience.

---

## Demo video

Recorded walkthrough:

```text
https://github.com/misterwin0553-droid/lit-gated-ai-learning-template/blob/main/recordings/lit-gated-learning-demo-recording-page-20260513-151058.mp4
```

Local copy:

```text
recordings/lit-gated-learning-demo-recording-page-20260513-151058.mp4
```

## Hosted demo

```text
https://misterwin0553-droid.github.io/lit-gated-ai-learning-template/
```

## Polished course demo

Run:

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173/public/index.html
```

The polished lesson view includes:

- a NASA Mars investigation hero scene;
- role switcher: public learner, student, teacher, owner;
- progressive layer unlock cards;
- dynamic visual stages that change with permission depth;
- AI context gating inspector.

### Visual learning stages

| Role | Visual stage | What changes |
|---|---|---|
| Public learner | Raw orbital image | observation first, no conclusion handed out |
| Student | Evidence map | channels, deposit zones, alternatives become visible |
| Teacher | Reasoning board | observation → evidence → confidence-ranked claim |
| Owner | 3D/source model slot | source verification, content-design rationale, future 3D terrain model |

This is intentionally more than a static image with notes. The unlocked layer changes the learner’s visual cognition path.

---

## Browser wallet + Lit route

Open:

```text
http://localhost:5173/browser-lit.html
```

This route tests the live browser wallet path:

1. discover injected wallet providers;
2. connect Rabby / MetaMask-compatible wallet;
3. load Lit SDK modules in the browser;
4. select Lit network;
5. run Lit network diagnostics;
6. attempt to encrypt/decrypt the student layer.

### Current live status

Working locally:

- Rabby wallet connection in Brave;
- wallet address acquisition;
- browser Lit SDK dynamic loading;
- Vite/browser compatibility fixes;
- Lit network diagnostics tooling.

Known blocker in the current local environment:

- live Lit node / relayer fetch and handshake fail from this network/browser environment.

See:

- `docs/LIT-NETWORK-DIAGNOSTICS-2026-05-13.md`
- `docs/LIVE-WALLET-QA-CHECKLIST.md`
- `docs/OKX-WALLET-LOCALHOST-BLOCKER.md`

The deterministic course demo and access model are fully executable. The live route reaches wallet + SDK initialization and then blocks on external Lit network reachability.

---

## Layer model

| Layer | Audience | Example content |
|---|---|---|
| `public` | Everyone | mission intro, observation prompt |
| `student` | Authorized learner | clue cards, guided evidence hints |
| `teacher` | Teacher / reviewer | answer key guidance, misconception notes |
| `source` | Creator / owner | source mapping, content-design rationale |

---

## AI context gating

The template models AI assistant tasks. Each task receives only permitted layers:

| AI task | Allowed layers |
|---|---|
| `public_summary` | `public` |
| `student_hint` | `public`, `student` |
| `teacher_script` | `public`, `student`, `teacher` |
| `source_review` | `public`, `student`, `teacher`, `source` |

This prevents a public learner from asking the AI for teacher answers or source-owner annotations.

---

## Quick start

```bash
npm install
npm test
npm run render
npm run lit:plan
npm run verify
npm run dev
```

Generated files:

- `dist/access-report.json` — deterministic access report.
- `dist/lit-mode-plan.json` — Lit resource/ability plan.
- `public/index.html` — polished interactive lesson view.

---

## Project structure

```text
content/mission.json                 # reusable learning module schema
src/context-builder.mjs              # role/layer access report builder
src/demo.mjs                         # deterministic mock demo + assertions
src/lit-access.mjs                   # Lit adapter boundary
src/lit-plan.mjs                     # Lit resource/ability plan generator
src/render-page.mjs                  # polished lesson UI generator
src/browser-lit-demo.js              # browser wallet + Lit SDK route
public/index.html                    # generated course demo
browser-lit.html                     # browser wallet test route
docs/                                # tutorial, architecture, diagnostics, submission docs
```

---

## Why this is useful for Lit developers

This repo is intended to teach a reusable pattern:

```text
learning module schema
      ↓
role/task access policy
      ↓
Lit encrypted content layers
      ↓
role-aware UI unlocks
      ↓
AI context builder with denied-layer protection
```

The same structure can be adapted to:

- science lessons;
- compliance training;
- internal company onboarding;
- paid course modules;
- interactive documentation labs;
- AI-assisted learning products;
- source-review workflows.

---

## Adapting the template

To build a new module:

1. copy `content/mission.json`;
2. replace `layers[]` with your public/student/teacher/source layers;
3. update `aiTasks` with your context permissions;
4. replace visual stages in `src/render-page.mjs`;
5. map each protected layer to a Lit resource/access condition;
6. run `npm run verify`.

See `docs/ADAPTATION-GUIDE.md`.

---

## Grant-facing status

This project is suitable as a Lit Small Grants developer-education artifact because it includes:

- a reusable open-source template;
- a polished visual course demo;
- deterministic access tests;
- AI context-gating logic;
- browser wallet integration route;
- real Lit SDK adapter path;
- documented live-network diagnostics;
- tutorial and architecture materials.

Current limitation: live browser encryption/decryption is implemented but not fully demonstrated end-to-end in this local environment due to Lit node/relayer fetch failures. This is documented rather than hidden.

---

## Verification

Latest verification command:

```bash
npm run verify
```

Expected:

```text
Assertions passed.
Rendered polished interactive public/index.html
Generated dist/lit-mode-plan.json
```

---

## License

MIT for code. Reference educational content uses public/cited NASA material and should retain source attribution.
