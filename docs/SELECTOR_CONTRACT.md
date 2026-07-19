# LeadBox Stable Selector Contract v1

`data-qa` is the canonical test contract. It must describe product intent, not CSS appearance.

Required media selectors:
- `media-upload-input`
- `media-title`
- `media-industry`
- `media-topic`
- `media-publish`
- `media-publish-success`
- `media-library`
- `media-card` with `data-media-title`
- `media-industry-filter`
- `media-topic-filter`

Required authentication selectors:
- `auth-email`
- `auth-password`
- `auth-submit`
- `shop-shell`

Required Studio selectors:
- `studio-shell`
- `studio-preview`
- `studio-canvas`

Rules:
1. Never use translated labels as the primary selector.
2. Never encode visual placement such as `left-panel-button-2`.
3. Do not remove or rename a selector without updating the version profile.
4. Production markup may retain `data-qa`; it contains no secrets and has negligible cost.
5. The adapter's DOM fallback is temporary. Source-level `data-qa` is the production-quality solution.
