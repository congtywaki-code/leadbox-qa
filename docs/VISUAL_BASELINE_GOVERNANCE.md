# Visual Baseline Governance

Visual baselines are controlled release artifacts, not disposable screenshots.

Rules:
1. Baselines are created only from an approved staging build and named LeadBox version profile.
2. CI may detect changes but may never auto-approve them.
3. Every approved baseline must have reviewer, timestamp, viewport, surface and SHA-256 metadata.
4. Dynamic regions must be masked; animations and caret are disabled.
5. Critical surfaces require parity checks: Superadmin template preview, Shop Admin Studio preview and public renderer.
6. Pending approvals block the visual release gate.
7. A changed screenshot is not automatically a defect; it is a review request until approved or rejected.
