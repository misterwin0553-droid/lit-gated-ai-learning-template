# Browser Lit Unlock Demo

This is the grant-facing live demo route.

## Why browser first

The project is an interactive learning template, so the strongest proof is a browser demo where a reviewer can connect a wallet and unlock a protected learning layer through Lit.

## Entry points

Development:

```bash
npm run dev
```

Open:

- `http://127.0.0.1:5173/browser-lit.html` — browser Lit unlock MVP.
- `http://127.0.0.1:5173/public/index.html` — mock interactive role/task demo.

Production build:

```bash
npm run build
```

## Current scope

The live browser route focuses on one protected layer:

- `student` layer.

Flow:

1. Connect browser wallet.
2. Encrypt `student` layer with Lit using `:userAddress == connected wallet`.
3. Request Lit session signatures.
4. Decrypt and render the student clue layer.

## What it proves

- The reference learning module can use Lit SDK in the browser.
- A non-public educational content layer can be encrypted and unlocked by wallet authorization.
- The same pattern can later be applied to `teacher` and `source` layers.

## Known limitations

- Requires an injected EIP-1193 wallet such as MetaMask.
- Current demo condition is wallet-address equality for clarity.
- Final grant submission should document the demo wallet/auth flow.
- Bundle size is large because Lit SDK dependencies are included; acceptable for MVP, can be optimized later.
