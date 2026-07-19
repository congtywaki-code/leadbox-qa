# Real authentication evidence

The setup projects create Playwright storage state locally. Integration tests then revisit protected routes and prove: HTTP success, authenticated DOM marker, final URL not redirected to login, and a screenshot. Evidence JSON redacts password, cookie, authorization, nonce, token, secret and API-key fields. Storage-state files are never included in the evidence index or committed.
