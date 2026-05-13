# Demo Video Script

Target length: 45–70 seconds.

Important recording rule:

> Before recording, open a separate browser window, full-screen it, and show only the demo page. Do not capture the desktop, unrelated tabs, private bookmarks, chat windows, wallet seed phrases, or other apps.

## Recording setup

1. Start local dev server:

```bash
npm run dev
```

2. Open a clean browser window:

```text
http://localhost:5173/public/index.html?demo=1
```

3. Full-screen the browser window.
4. Hide bookmarks bar if it exposes private information.
5. Keep wallet extension closed until the browser Lit route segment, if included.

## Suggested narration

### 0–8s — Project intro

Show the hero page.

Script:

> This is a Lit-gated AI learning module template. The reference demo is a NASA Mars investigation, but the reusable artifact is the access-control pattern for layered educational content and AI context.

### 8–22s — Public learner

Click `Public learner`.

Show raw image and public layer.

Script:

> A public learner only sees the open mission brief and raw observation view. The system does not expose clues, answers, source notes, or privileged AI context.

### 22–35s — Student unlock

Click `Student`.

Show evidence map and student layer.

Script:

> When the student layer is unlocked, the visual stage changes too. The learner now sees evidence overlays, guided clues, and student-level AI context — but still not teacher answers or source-owner notes.

### 35–48s — Teacher unlock

Click `Teacher`.

Show reasoning board.

Script:

> A teacher sees the reasoning framework: observation, evidence, and confidence-ranked claims. This supports instruction without exposing internal source-review materials.

### 48–58s — Owner/source layer

Click `Owner`.

Show 3D/source stage.

Script:

> The owner layer unlocks source annotations and the future 3D terrain model slot. This is where citations, content-design rationale, and release checks live.

### 58–70s — Lit/browser route status

Optional: switch to `browser-lit.html` if safe.

Script:

> The browser route connects a wallet, loads Lit SDK modules, and prepares live layer encryption/decryption. In the current local environment, wallet and SDK initialization work, while Lit node fetch/handshake is documented as a network blocker.

## Shots to capture

Required:

- course hero;
- role switcher;
- public raw image;
- student evidence map;
- teacher reasoning board;
- owner 3D/source model;
- AI context task panel.

Optional:

- browser wallet connected;
- Lit SDK modules loaded;
- diagnostics log showing network blocker.

## Do not show

- unrelated desktop windows;
- private chats;
- browser bookmarks with sensitive names;
- wallet seed phrase/private keys;
- extension settings pages with personal data;
- terminal paths outside this project unless intentionally shown.
