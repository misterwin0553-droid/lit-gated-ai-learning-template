# Lit Community Outreach Message

Use this after submitting the grant proposal, or as a pre-submission feedback request in the Lit Discord/forum/grants channel.

## Short version

Hi Lit team — I built an open-source **Lit-gated AI learning module template** and would appreciate feedback on whether it fits the Small Grants scope.

Repo: https://github.com/misterwin0553-droid/lit-gated-ai-learning-template  
Demo video: https://github.com/misterwin0553-droid/lit-gated-ai-learning-template/blob/main/recordings/lit-gated-learning-demo-recording-page-20260513-151058.mp4  
Hosted demo: https://misterwin0553-droid.github.io/lit-gated-ai-learning-template/

The template demonstrates progressive access for educational content layers: public learner observations, student clues, teacher guidance, source annotations, and AI context gating. The goal is to help developers use Lit not only for gated content, but for permission-aware AI learning applications.

Current status:

- role/layer policy implemented;
- polished visual demo implemented;
- AI context gating implemented;
- browser wallet + Lit SDK route implemented;
- Rabby wallet connection and SDK loading verified;
- current live decrypt blocker is documented as local Lit node/relayer connectivity.

I’d appreciate feedback on whether this fits the Small Grants scope and what would make it stronger for review.

---

## Longer version

Hi Lit team — I submitted / am preparing to submit a Small Grants proposal for an open-source **Lit-gated AI learning module template**.

Repo: https://github.com/misterwin0553-droid/lit-gated-ai-learning-template  
Demo video: https://github.com/misterwin0553-droid/lit-gated-ai-learning-template/blob/main/recordings/lit-gated-learning-demo-recording-page-20260513-151058.mp4  
Hosted demo: https://misterwin0553-droid.github.io/lit-gated-ai-learning-template/

The project is a developer-education artifact showing how Lit can be used for more than a simple token-gated page. The reference demo is a NASA Mars investigation with progressive content layers:

1. public learner observations;
2. student clues;
3. teacher guidance;
4. source/creator annotations;
5. AI assistant context gating based on the user/task permission.

The core pattern is:

```text
wallet / role / access condition
  → Lit-gated learning layer
  → visual knowledge stage unlocked
  → AI assistant receives only permitted context
```

Current artifact status:

- deterministic role/layer access model implemented;
- polished visual lesson demo implemented;
- AI context-gating logic implemented;
- browser wallet + Lit SDK route implemented;
- Rabby wallet connection and SDK loading verified;
- live browser decrypt currently reaches Lit network fetch/handshake but is blocked by local Lit node/relayer connectivity, documented in diagnostics.

The grant would fund hosted/network-stable Lit validation, teacher/source layer live unlock, tutorial polish, and reusable adaptation docs for other developers.

I’d appreciate any feedback on fit, review expectations, or what would make this more useful to Lit developers.
