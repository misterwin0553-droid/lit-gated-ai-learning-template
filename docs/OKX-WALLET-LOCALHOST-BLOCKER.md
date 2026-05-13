# OKX Wallet Localhost Connection Blocker

Date: 2026-05-13

## Observed state

The browser demo successfully detects injected EVM wallet providers:

```text
Discovered wallet providers: 0: MetaMask-compatible | 1: OKX Wallet global | 2: OKX Wallet
```

For all discovered providers, `eth_accounts` returns no connected account:

```text
eth_accounts returned: none connected
```

Direct account connection requests immediately fail without showing a visible wallet popup:

```text
Connect wallet failed: Wallet request was rejected/dismissed or blocked by the extension.
```

This was reproduced after changing the connect flow so the first awaited wallet call after the user click is directly:

```js
provider.request({ method: 'eth_requestAccounts' })
```

The stronger permission flow also fails:

```js
provider.request({
  method: 'wallet_requestPermissions',
  params: [{ eth_accounts: {} }]
})
```

## Diagnosis

This is currently an OKX Wallet / local browser permission blocker, not a page-rendering or Lit SDK blocker.

Evidence:

- Page renders correctly.
- Mission content loads.
- Wallet providers are detected.
- Provider selection works.
- Account request calls are triggered.
- OKX returns rejected/dismissed without presenting a usable approval popup.

## Impact

Do not use OKX Wallet as the primary grant-demo validation wallet for the local browser flow.

The demo should be validated with MetaMask or Rabby first, because the grant proof is Lit browser wallet unlock, not OKX-specific wallet compatibility.

## Recommended validation route

1. Open the demo in a Chromium browser with MetaMask or Rabby installed.
2. Use:

```text
http://127.0.0.1:5173/browser-lit.html
```

or try:

```text
http://localhost:5173/browser-lit.html
```

3. Click `Discover wallets`.
4. Select the MetaMask/Rabby provider.
5. Click `1. Connect wallet`.
6. Approve the account connection popup.
7. Continue with `2. Encrypt student layer` and `3. Decrypt with Lit`.

## OKX troubleshooting if needed

If OKX must be tested:

- Try `http://localhost:5173/browser-lit.html` instead of `127.0.0.1`.
- Remove this site from OKX connected sites / permissions.
- Unlock OKX wallet first.
- Open the OKX extension panel before clicking connect.
- Disable competing wallet extensions temporarily.
- Test in a fresh Chrome profile with only OKX enabled.

If the request still returns rejected/dismissed without a popup, treat it as wallet compatibility failure.
