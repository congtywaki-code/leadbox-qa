# Tenant Isolation
Workspace A may access its own fixture. Workspace B must receive 403 or 404 for the same media id. Tests require two dedicated QA workspaces and disposable tokens; production credentials are prohibited.
