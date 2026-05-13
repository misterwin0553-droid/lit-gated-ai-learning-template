# Security Notes

This repository implements deterministic mock access checks for local testing and now includes a real Lit SDK adapter boundary for the final encryption/decryption path.

Before external submission, Lit mode should ensure:

1. Non-public layer plaintext is not shipped to unauthorized clients.
2. Teacher/source layers are encrypted at rest or fetched only after authorization.
3. AI context construction happens after access filtering.
4. Public-writing AI tasks cannot access hidden answers or source annotations.
5. Demo data does not contain real private information.

The NASA reference demo should use public-domain or properly cited public material.
