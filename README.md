# LeadBox QA Integration 2.0

Mapped to `leadbox-crm-step9.9.1.12-rc2-media-bootstrap-catalog.zip`.

This package is a Node.js/Playwright QA runner, **not a WordPress plugin**. It executes against an isolated staging installation and preserves verifiable evidence. It does not invent PASS results when staging credentials, routes, or approved baselines are absent.

## Scope

- staging prerequisite and production-target guard;
- real Superadmin and Shop Admin authentication evidence;
- owner media API/picker visibility diagnosis;
- responsive Studio baseline candidate capture;
- manual screenshot approval with reviewer and SHA-256;
- promotion of approved images into governed baseline folders;
- evidence bundle index for release review.

## Setup

```bash
cp .env.example .env
npm install
npx playwright install
```

Fill `.env` with isolated staging URLs and QA accounts, then set:

```env
QA_STAGING_EXECUTION=true
```

## Execute Integration 2.0

```bash
npm run qa:integration:2.0
```

Run parts independently:

```bash
npm run qa:staging:readiness
npm run qa:setup
npm run qa:auth:evidence
npm run qa:media:diagnose
npm run qa:baseline:capture
npm run qa:evidence:index
```

## Approve the first baselines

Review files under `baselines/candidates/` and records under `approvals/pending/`.

```bash
npm run qa:visual:approve -- <baseline-id> "Reviewer Name"
npm run qa:baseline:promote
npm run qa:visual:gate
```

CI never approves screenshots automatically.

## Safety

Production hostnames `leadbox.vn` and `app.leadbox.vn` are blocked by default. Write tests require both `QA_ALLOW_WRITE_TESTS=true` and a mapped profile capability. Authentication state and credentials are excluded from evidence and Git.
