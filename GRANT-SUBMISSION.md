# Lit Small Grants Submission

## Project

**Lit-Gated AI Learning Module Template**

## Links

- GitHub repo: https://github.com/misterwin0553-droid/lit-gated-ai-learning-template
- Demo video: https://github.com/misterwin0553-droid/lit-gated-ai-learning-template/blob/main/recordings/lit-gated-learning-demo-recording-page-20260513-151058.mp4
- Hosted demo: https://misterwin0553-droid.github.io/lit-gated-ai-learning-template/

---

## 1. What is your project? *(max 100 words)*

I built an open-source **Lit-gated AI learning module template**. The reference demo uses a NASA Mars investigation to show progressive access across public observations, student clues, teacher guidance, source annotations, and AI assistant context. Instead of a simple token-gated content page, the template demonstrates how Lit access control can protect staged learning layers and control what context an AI assistant may use for each role.

---

## 2. How is Lit used for this project? *(max 100 words)*

Lit is the access-control and encryption layer for non-public learning content. The template maps learner roles and task permissions to protected layers: `student`, `teacher`, and `source`. Public content stays open, while private clues, answer guidance, source notes, and AI task context are unlockable only for authorized users. The browser route connects a wallet, loads Lit SDK modules, prepares student-layer encryption/decryption, and documents the current live network diagnostics. The deterministic template already shows the full role/layer policy and AI context-gating model.

---

## 3. How will you improve your project with this grant? What steps will you take to meet this objective? *(max 200 words)*

Grant support will turn the current MVP into a complete Lit developer-education package.

Planned work:

1. Complete live Lit unlock across `student`, `teacher`, and `source` layers, including deployment/network validation outside the current local-network blocker.
2. Publish a hosted demo showing wallet authorization, progressive visual unlocks, and AI context gating.
3. Expand the NASA Mars reference module into a reusable walkthrough with source citations, role policy examples, and security notes.
4. Add a full adaptation guide so developers can replace the Mars lesson with their own course, training, or documentation module.
5. Improve the visual learning stages from raw observation → evidence map → reasoning board → 3D terrain/source model.
6. Record a short walkthrough video and provide weekly progress updates plus a final report.

The deliverable will be an MIT-licensed template that helps Lit developers build permission-aware learning and AI applications.

---

## 4. Is this project open source?

Yes. Code is MIT licensed. Reference content uses public/cited NASA material and retains attribution.

---

## 5. Do you agree to share grant reports upon request, including a final grant report at the end of the two month period?

Yes.

---

## 6. Links and submissions

Not created at a hackathon.

- GitHub repo: https://github.com/misterwin0553-droid/lit-gated-ai-learning-template
- Demo video: https://github.com/misterwin0553-droid/lit-gated-ai-learning-template/blob/main/recordings/lit-gated-learning-demo-recording-page-20260513-151058.mp4
- Hosted demo: https://misterwin0553-droid.github.io/lit-gated-ai-learning-template/

---

## 7. Total Budget Requested

Requested budget: **$2,500 USD**.

Breakdown:

- **$900** — complete live Lit integration across protected layers and validate on hosted/network-stable environment.
- **$550** — polish reusable course template, role policy examples, and dynamic visual stages.
- **$450** — developer tutorial, adaptation guide, architecture diagram, and security notes.
- **$350** — demo video, screenshots, documentation QA, weekly updates, and final report.
- **$250** — deployment/testing buffer for hosted demo and browser wallet compatibility.

---

## Current artifact status

Completed now:

- reusable mission schema;
- deterministic role/layer access model;
- AI task context gating;
- polished interactive lesson page;
- dynamic visual stages by unlock depth;
- real Lit SDK adapter boundary;
- browser wallet Lit route;
- Rabby wallet connection in Brave;
- Lit SDK browser loading;
- network diagnostics documentation;
- README, architecture, tutorial, security notes, and adaptation docs.

Known limitation:

- Live browser Lit encrypt/decrypt is implemented as the intended route but not fully demonstrated end-to-end in the current local network environment. Wallet and SDK initialization work; current failure occurs during Lit node/relayer fetch/handshake. This is documented in `docs/LIT-NETWORK-DIAGNOSTICS-2026-05-13.md`.

Why still useful:

- The grant artifact is primarily a developer-education template. The current repo already teaches the architecture and implementation pattern, while grant support is requested to finish live network validation, hosted deployment, and documentation polish.
