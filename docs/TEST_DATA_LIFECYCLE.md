# Test Data Lifecycle
All write tests use the prefix `LBQA-<runId>`. Every created entity must be written to `fixtures/manifests/active-run.json`. Cleanup refuses to touch records without the QA prefix. Production cleanup is forbidden. Runtime deletion remains blocked until API/UI adapters are mapped.
