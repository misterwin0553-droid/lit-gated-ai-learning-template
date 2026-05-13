# Lit Network Diagnostics — 2026-05-13

## Current status

The browser wallet path is working up to Lit network access:

- Brave + Rabby connects successfully.
- Wallet address observed: `0xeec50bde273e5d56a7f342eb0e1c3d89e5546527`.
- Lit SDK modules load successfully in the browser.
- Vite/browser compatibility issues fixed:
  - blank screen;
  - `global is not defined`;
  - dynamic import cache failure;
  - `exports is not defined`.

The remaining blocker is external Lit network fetch/handshake.

## Browser diagnostics from the demo

Selected network: `datil`.

Observed event log:

```text
DIAG https://207.244.90.225/web/handshake -> FAILED: Failed to fetch
DIAG https://23.111.254.108/web/handshake -> HTTP 404 cors in 1118ms
DIAG https://yellowstone-rpc.litprotocol.com -> HTTP 400 cors in 12838ms
DIAG https://datil-relayer.getlit.dev -> FAILED: Failed to fetch
```

Interpretation:

- At least one `datil` node is reachable at transport/browser level (`23.111.254.108`) but `/web/handshake` returns 404 for direct diagnostic GET, which is expected to be non-successful for a naive probe but confirms the host is reachable.
- The other `datil` node (`207.244.90.225`) fails at browser fetch level.
- Chronicle Yellowstone RPC is reachable but slow and returns HTTP 400 for naive GET.
- Lit relayer fetch fails from the current browser/network environment.

## Node-side diagnostic summary

A Node-side LitNodeClient connection probe produced:

- `datil-dev`: `fetch failed` against `https://15.235.83.220:7470/7471/7472`.
- `datil-test`: `fetch failed` against 443 bootstrap nodes.
- `datil`: got far enough to hit node attestation/localStorage path on `https://23.111.254.108:443`, but did not complete connect in this local Node probe.

## Conclusion

This is no longer a wallet, UI, Vite, or Lit SDK import issue. The live browser route is blocked by external Lit network connectivity / service reachability from the current local environment.

For grant/demo purposes, this should be described as a live-network blocker after successful wallet + SDK integration.

## Recommended next steps

1. Validate from a different network/VPN/proxy environment.
2. Try a clean browser profile with only Rabby enabled.
3. Try a hosted HTTPS deployment instead of local `localhost`.
4. Ask Lit support/community whether current `datil`, `datil-test`, or `datil-dev` bootstrap/relayer endpoints are healthy for SDK v7.4.0.
5. Keep the mock/plan path as the deterministic grant-facing artifact while documenting that the live path reaches Lit node handshake but is externally blocked in this environment.
