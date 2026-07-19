# Screenshot Approval Workflow

1. Run visual tests against staging.
2. Review actual, expected and diff artifacts.
3. For an intentional change, copy the approved PNG into `baselines/<viewport>/` and create a pending metadata JSON with its SHA-256 checksum.
4. Approve locally with `npm run qa:visual:approve -- <id> <reviewer>`.
5. Commit both baseline and approved metadata.
6. CI rejects pending approvals and checksum mismatches.

Never approve a screenshot solely because the test failed. Confirm layout, content, responsive behavior, renderer parity and absence of tenant-specific data first.
