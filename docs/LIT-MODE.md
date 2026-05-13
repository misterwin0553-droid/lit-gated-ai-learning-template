# Lit Mode

This project keeps two modes:

1. **Mock mode** — deterministic local tests and documentation.
2. **Lit mode** — real Lit SDK integration for encrypted non-public content layers.

## Installed packages

- `@lit-protocol/lit-node-client`
- `@lit-protocol/encryption`
- `@lit-protocol/constants`
- `@lit-protocol/auth-helpers`

## Current Lit integration boundary

Implemented in `src/lit-access.mjs`:

- `createLitClient()`
- `connectLitClient()`
- `layerAccessCondition(layerId, walletAddress)`
- `encryptLayerWithLit(layer, options)`
- `decryptLayerWithLit(encryptedLayer, options)`
- `getSessionSigsForLayer(encryptedLayer, options)`
- `describeLitModePlan(mission)`

## What works now

`npm run lit:plan` generates `dist/lit-mode-plan.json`, showing which non-public layers should be encrypted and which Lit ability is required.

The code path now uses real Lit SDK imports and APIs:

- `LitNodeClient`
- `encryptToJson`
- `decryptFromJson`
- `LIT_ABILITY.AccessControlConditionDecryption`
- `LitAccessControlConditionResource`

## What still requires wallet/auth setup

Actual decryption requires `sessionSigs`, which require a wallet authentication flow. That should be added in the browser demo or a Node wallet-auth script before external submission.

## Demo access condition

Current condition is intentionally simple:

```js
:userAddress === LIT_DEMO_WALLET
```

This makes the tutorial concrete and easy to adapt. Before submission, set `LIT_DEMO_WALLET` to a dedicated demo wallet address and document the flow.

## Verification

Run:

```bash
npm run verify
```

This runs:

1. mock access assertions;
2. interactive page rendering;
3. Lit mode plan generation.
