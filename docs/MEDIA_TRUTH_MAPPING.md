# Media Truth Test Mapping

Primary rule: a Superadmin asset with public/published state must be queryable and selectable by an entitled Shop Admin.

Coverage:
1. Upload fixture.
2. Set title, industry and topic.
3. Publish.
4. Verify publish success.
5. Open Shop Admin in a separate authenticated context.
6. Verify library and taxonomy filters.
7. Verify the exact asset card by title.

The write test is disabled by default. Enable only on an isolated staging environment:
- `.env`: `QA_ALLOW_WRITE_TESTS=true`
- profile: `capabilities.mediaWriteTest=true`

Cleanup should be mapped when the official LeadBox media delete/archive endpoint is available.
