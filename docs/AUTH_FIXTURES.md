# Authentication Fixtures

QA uses normal product authentication and Playwright storage state.

- Superadmin signs in through `wp-login.php`.
- Shop Admin signs in through the LeadBox app login form.
- No hard-coded cookies, no auth bypass, no shared production credentials.
- Use dedicated staging accounts with minimum required permissions.
- Store secrets in local `.env` or GitHub Actions Secrets only.
- Auth state files under `reports/.auth-*.json` are ignored by Git and must never be committed.
