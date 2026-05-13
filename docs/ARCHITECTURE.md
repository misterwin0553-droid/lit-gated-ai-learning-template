# Architecture

```text
Mission content schema
      │
      ├── public layer
      ├── student layer
      ├── teacher layer
      └── source layer
      │
      ▼
Role / task policy
      │
      ├── role view builder
      └── AI context builder
      │
      ▼
Mock access mode now
Lit encryption/access mode next
      │
      ▼
Allowed content output
```

## Core modules

- `content/mission.json` — reference mission schema.
- `src/access-policy.mjs` — role/layer/task policy.
- `src/context-builder.mjs` — builds role views and AI contexts.
- `src/demo.mjs` — deterministic report + assertions.
- `src/render-page.mjs` — static visual reference page.

## Lit integration target

Future `lit-access.mjs` should expose:

```js
encryptLayer(layer, accessCondition)
decryptLayer(encryptedLayer, authContext)
```

The context builder should remain policy-agnostic: it receives already-decrypted allowed layers and never sees denied plaintext.
