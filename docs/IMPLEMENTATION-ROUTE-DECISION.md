# Implementation Route Decision

Date: 2026-05-13
Decision: Browser wallet route first; Node live decrypt route only as optional smoke test.

## Question

Should the next live Lit integration be implemented as:

1. Browser wallet demo; or
2. Node demo wallet script?

## Client-facing criteria from Lit Grants

Lit Small Grants care about:

- already built something using Lit;
- improving developer experience;
- education/tutorial/demo value;
- open-source artifacts;
- clear deliverables within 2 months;
- materials that make it easier for others to build Lit-enabled applications.

Historical issue comments also show Lit prefers generalizable OSS tools/tutorials over funding a product.

## Route comparison

### Browser wallet route

Strengths:

- Looks like a real Lit-enabled application.
- Fits the interactive learning demo directly.
- Easier for reviewers to understand visually.
- Better for walkthrough video and public demo.
- Better developer education value: shows the actual end-user auth/access flow.
- Matches the grant-facing claim: progressive access in an interactive web learning module.

Weaknesses:

- More frontend setup/bundling complexity.
- Requires wallet connection and user signature.
- Slightly slower to implement than a pure Node smoke test.

### Node demo wallet route

Strengths:

- Fastest way to prove encrypt/decrypt with Lit.
- Good for CI-style verification.
- Useful as a backend/testing artifact.

Weaknesses:

- Less aligned with the interactive learning template story.
- Risk of looking like an internal technical script, not a usable developer demo.
- Requires careful handling of demo private keys; avoid committing secrets.
- Weaker for screenshots/video/walkthrough.

## Decision

Choose **Browser wallet route first**.

Reason:

The grant project is not just “prove encryption works.” It is a developer-facing interactive learning template. The most client-aligned proof is a browser demo where a reviewer can switch roles/connect a wallet and see locked layers unlock through Lit.

The Node route can still exist later as an optional smoke test, but it should not be the primary path.

## Execution direction

Next implementation should add:

1. Browser entrypoint for Lit mode.
2. Wallet connect / auth callback flow.
3. Layer encryption for student/teacher/source content.
4. Live unlock button for one protected layer first, likely `student`.
5. Documentation: “Run mock mode first; run browser Lit mode with a demo wallet next.”

## Scope guard

Do not try to make all layers production-grade in one step.

Minimum live Lit proof:

- Encrypt `student` layer with Lit.
- Browser wallet signs/authenticates.
- Authorized wallet decrypts `student` layer.
- Unauthorized or missing wallet remains locked.

After that works, extend to `teacher` and `source`.

## Grant wording impact

After browser route works, the issue draft can honestly say:

> The local MVP includes an interactive browser demo with Lit-gated content unlocking for the student layer, plus a reusable schema for adding teacher/source layers and AI context gating.

This is more compelling than:

> The repo includes a Node script proving Lit encrypt/decrypt works.
