# Staging execution

Integration 2.0 only runs against an isolated staging environment. Set `QA_STAGING_EXECUTION=true`. Production hostnames are blocked unless `QA_ALLOW_PRODUCTION=true` is deliberately supplied; that override is not recommended. Write tests remain separately guarded by `QA_ALLOW_WRITE_TESTS=true` and the mapped profile capability.

Run `npm run qa:staging:readiness` before authentication or browser tests. A blocked result is evidence that prerequisites are absent, not a test pass.
