# Submission Checklist

## Minimum package for Lit Small Grants

Before submission, confirm these are ready:

- [x] README explains project value in under 2 minutes.
- [x] Grant issue final draft exists: `docs/SMALL-GRANT-ISSUE-FINAL.md`.
- [x] Polished course demo exists: `public/index.html`.
- [x] Browser wallet route exists: `browser-lit.html`.
- [x] Deterministic access tests pass.
- [x] Lit mode plan generator exists.
- [x] Architecture diagram exists: `docs/ARCHITECTURE-DIAGRAM.md`.
- [x] Adaptation guide exists: `docs/ADAPTATION-GUIDE.md`.
- [x] Security notes exist: `docs/SECURITY-NOTES.md`.
- [x] Tutorial exists: `docs/TUTORIAL.md`.
- [x] NASA source note exists: `docs/NASA-SOURCE-NOTE.md`.
- [x] Live network limitation is documented honestly.
- [x] GitHub repo URL added: https://github.com/misterwin0553-droid/lit-gated-ai-learning-template.
- [x] Demo video recorded: `recordings/lit-gated-learning-demo-recording-page-20260513-151058.mp4`.
- [x] Demo video URL added: https://github.com/misterwin0553-droid/lit-gated-ai-learning-template/blob/main/recordings/lit-gated-learning-demo-recording-page-20260513-151058.mp4.
- [ ] Optional hosted demo deployed.

## Verification commands

Run before submission:

```bash
npm install
npm run verify
npm run build
```

Expected success signals:

```text
Assertions passed.
Rendered polished interactive public/index.html
Generated dist/lit-mode-plan.json
vite build ✓
```

Known non-blocking warnings:

- Vite may warn about large chunks due to Lit SDK/browser dependencies.
- Vite may warn about `crypto` externalization from Lit dependencies.

These are documented browser-bundle polish items, not core access-model failures.

## Reviewer-facing links

Fill before final posting:

```text
GitHub repo: https://github.com/misterwin0553-droid/lit-gated-ai-learning-template
Demo video: https://github.com/misterwin0553-droid/lit-gated-ai-learning-template/blob/main/recordings/lit-gated-learning-demo-recording-page-20260513-151058.mp4
Hosted demo: TBD
```

Local demo routes:

```text
http://localhost:5173/public/index.html
http://localhost:5173/browser-lit.html
```

## Honest status language

Use:

> The deterministic access model, polished lesson UI, AI context gating, browser wallet route, and Lit SDK loading path are implemented. Live browser decrypt currently reaches the Lit network fetch/handshake stage but is blocked in the current local environment. This is documented in diagnostics and will be completed through hosted/network-stable validation during the grant period.

Do not use:

> Fully production-ready Lit decrypt is complete.

Do not imply:

- teacher/source live decrypt is already complete;
- the NASA demo is an official NASA product;
- OKX wallet is the primary verified wallet;
- local network fetch failure is a solved issue.

## Grant probability boosters

Highest-impact remaining improvements:

1. Record 45–70 second clean demo video.
2. Add 3–5 screenshots to README or issue.
3. Publish repo with clean commit history.
4. If possible, test browser Lit route on another network / VPN / hosted HTTPS.
5. Add one short GIF of role switching and visual-stage unlock.

## Recording privacy reminder

Before recording:

- open a separate browser window;
- full-screen only the demo page;
- close unrelated tabs;
- hide sensitive bookmarks;
- do not show desktop or wallet secrets.
