# WordPress / Flatsome Runtime Adapter

The adapter is an optional staging-only WordPress plugin. It does not replace LeadBox and does not bypass authentication.

## Install
1. Copy `wordpress-adapter/leadbox-qa-adapter` to `wp-content/plugins/`.
2. Activate **LeadBox QA Runtime Adapter** on staging only.
3. Add to staging `wp-config.php`:

```php
define('WP_ENVIRONMENT_TYPE', 'staging');
define('LEADBOX_QA_MODE', true);
```

Never enable QA mode on production.

## Purpose
- Expose `/wp-json/leadbox-qa/v1/health`.
- Add temporary `data-qa` attributes through a configurable mapping.
- Provide a bridge while selectors are being added directly to LeadBox source.

Flatsome public pages should be tested in the real WordPress runtime. Storybook is not required for UX Builder pages. It may be added later only for isolated JavaScript/Web Components used by LeadBox.
