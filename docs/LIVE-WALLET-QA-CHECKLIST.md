# Live Wallet QA Checklist

Use this checklist to verify the browser Lit unlock route before external submission.

## Start server

```bash
npm run dev -- --port 5173
```

Open:

```text
http://127.0.0.1:5173/browser-lit.html
```

## Expected initial state

- Page title: `Student Layer Unlock`.
- Public Mission Brief is visible.
- Student Clue Layer is locked.
- Wallet: `not connected`.
- Encrypted: `no`.
- Student layer: `locked`.

## Wallet compatibility note

Primary validation wallet: MetaMask or Rabby. OKX Wallet has shown a localhost permission blocker where providers are detected but account requests return rejected/dismissed without a visible popup. See `docs/OKX-WALLET-LOCALHOST-BLOCKER.md`.

If OKX fails on `127.0.0.1`, try `http://localhost:5173/browser-lit.html`; otherwise switch to MetaMask/Rabby for grant validation.

## Manual wallet flow

1. Click `1. Connect wallet`.
   - Expected: browser wallet opens.
   - Approve connection with a demo wallet.
   - Wallet status shows address.

2. Click `2. Encrypt student layer`.
   - Expected: Lit network connects.
   - Expected log: encrypted student layer with `:userAddress == connected wallet`.
   - Encrypted status becomes `yes`.

3. Click `3. Decrypt with Lit`.
   - Expected: wallet asks for Lit session signature.
   - Approve signature.
   - Student layer changes from `locked` to `unlocked`.
   - Clue cards become visible.

## Acceptance criteria

- [ ] Wallet connects successfully.
- [ ] Student layer encryption completes.
- [ ] Lit session signature prompt appears.
- [ ] Student layer decrypts and renders.
- [ ] Event log records each step.
- [ ] No hidden `teacher` or `source` content is rendered in this MVP route.

## Known blockers

- Requires injected EIP-1193 wallet, e.g. MetaMask.
- Requires user approval for wallet connection and Lit session signature.
- If the wallet popup is blocked or unavailable, this cannot be fully automated from the agent.
- Current MVP only live-unlocks the `student` layer.

## If live decrypt fails

Record:

- browser console error;
- wallet/network used;
- Lit network shown in log;
- whether failure happened at connect, encrypt, session signature, or decrypt.


## Live network blocker observed on 2026-05-13

Brave + Rabby wallet connection succeeded, and Lit SDK modules loaded successfully. However, live encryption was blocked by external Lit network fetch/handshake failures from the current local environment. See `docs/LIT-NETWORK-DIAGNOSTICS-2026-05-13.md`.

If this recurs, do not spend more time debugging wallet/UI. Test from a different network or hosted HTTPS environment, or contact Lit support with the diagnostics.
