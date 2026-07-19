# LeadBox QA Foundation 1.4.1 Mapping Report

Mapped application: `0.9.9.1.12-rc2-step9.9.1.12-rc2`.

## Verified from source

- Canonical Shop Admin host: `app.leadbox.vn`.
- Login route: `/login/`, using fields `log` and `pwd`.
- Shop Admin deep-link Studio route: `/capture-tools/new/studio`.
- Owner media catalog: `/?rest_route=/leadbox/v1/owner/studio/media` with pretty-route fallback.
- Superadmin Media Library: `/wp-admin/admin.php?page=leadbox-system-v2&tab=media`.
- Superadmin publish form: `[data-lb9426-builder]`.
- Shop Admin media picker: `[data-lb9426-owner-picker]`.
- Industry/topic filters: `[data-lb9426-owner-industry]` and `[data-lb9426-owner-topic]`.
- Shared preview renderer: `LeadBoxTemplateRenderer9912`.
- Preview diagnostics: `data-preview-renderer`, `data-preview-version`, `data-preview-status`.
- Upload runtime is local-first; R2 is asynchronous synchronization.

## Deliberately not marked ready

- Superadmin end-to-end upload cannot be fully automated until a stable WordPress media-modal attachment fixture is available.
- Delete/restore is not exposed by the owner media REST contract in this build.
- Tenant isolation requires two real QA workspaces.
- Visual baselines require staging screenshots and human approval.

## Required staging variables

- `LEADBOX_PROFILE=9.9.1.12-rc2`
- `LEADBOX_BASE_URL`
- `LEADBOX_APP_URL`
- `LEADBOX_PUBLIC_URL`
- `SUPERADMIN_USERNAME`, `SUPERADMIN_PASSWORD`
- `SHOPADMIN_USERNAME`, `SHOPADMIN_PASSWORD`
