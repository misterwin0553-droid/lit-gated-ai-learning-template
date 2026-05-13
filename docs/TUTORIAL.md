# Tutorial: Build a Lit-Gated Interactive Learning Module

This tutorial explains the reference pattern used by the NASA Mars Mission Explorer demo.

## 1. Define content layers

Split the learning content by disclosure level:

- `public`: safe for everyone.
- `student`: clues and guided hints.
- `teacher`: answers, teaching notes, misconception warnings.
- `source`: source annotations and creator notes.

See `content/mission.json`.

## 2. Define roles

A role maps to readable layers:

```js
public_learner -> public
student        -> public + student
teacher        -> public + student + teacher
owner          -> public + student + teacher + source
```

See `src/access-policy.mjs`.

## 3. Define AI tasks

An AI assistant should not receive all content by default. Each task specifies required layers.

Example:

```json
"student_hint": {
  "description": "Generate a hint after the learner attempts the observation.",
  "allowedLayers": ["public", "student"]
}
```

If the current role cannot access every required layer, the task is denied.

## 4. Generate a mock report

Run:

```bash
npm test
```

This creates `dist/access-report.json` and verifies key access rules.

## 5. Add Lit mode

The next implementation step is to replace mock policy checks with real Lit encryption/access conditions:

1. Serialize non-public layer payloads.
2. Encrypt them with Lit.
3. Attach access control conditions per layer.
4. Decrypt only when the connected identity satisfies the layer policy.
5. Feed only decrypted allowed content into the AI context builder.

Mock mode remains useful for tests and documentation.

## 6. Swap the reference content

The NASA Mars mission is only one dataset. Developers can replace `content/mission.json` with their own layered learning module.
