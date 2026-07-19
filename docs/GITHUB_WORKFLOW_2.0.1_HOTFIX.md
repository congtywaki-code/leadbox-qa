# LeadBox QA Integration 2.0.1 — GitHub Workflow Hotfix

## Changes

- Uses Node.js 22 in both workflows.
- Replaces `npm ci` with `npm install --no-audit --no-fund` because the repository currently has no `package-lock.json`.
- Removes `cache: npm`, which also requires a supported lock file.
- Limits both workflows to manual `workflow_dispatch` while initial staging configuration is being completed.
- Adds minimal read-only permissions, concurrency cancellation, timeout limits and clearer step names.
- Keeps production execution and write tests disabled.

## Later hardening

After a trusted `package-lock.json` is generated and committed, change dependency installation back to `npm ci` and optionally restore `cache: npm`.
