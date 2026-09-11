# Code Quality Hardening Design

**Goal:** Make Watch Baba safer and more reliable in production while preserving its current content-provider behavior and Bun/Vite deployment model.

## Scope

The hardening work covers the findings from the code-quality review:

- Remove the client-side IGDB bearer-token exposure by routing IGDB requests through a server-side Cloudflare Pages Function.
- Add shared response validation and cancellation support for browser API requests.
- Fix permanent loading states, stale request races, malformed-response crashes, pagination errors, and duplicate network work.
- Clean up resource lifecycles, including iframe observers, fullscreen/body styles, and page-level async work.
- Split route bundles, add accessible names to icon-only controls, and remove invalid CSS/dead code.
- Add lint/type-quality gates and focused regression tests for the fixed behaviors.

## Non-goals

- No redesign of the existing product UI.
- No replacement of the existing external content providers.
- No migration of the entire JavaScript codebase to TypeScript in this change; type checking will be introduced incrementally through JSDoc/checkJs-compatible utility boundaries.

## Architecture

The browser will use a small shared `requestJson` helper for fetch-based services. It will check HTTP status, parse JSON, preserve abort semantics, and accept an optional `AbortSignal`. Existing Axios services will receive signals where request cancellation is needed.

IGDB credentials will exist only in a Cloudflare Pages Function at `functions/api/igdb.js`. The browser sends a validated IGDB query to that function; the function adds the server-side `IGDB_ACCESS_TOKEN` and `IGDB_CLIENT_ID`, forwards the request to IGDB, validates the upstream response, and returns a safe JSON response. The Vite app will no longer read `VITE_IGDB_ACCESS_TOKEN`.

Routes will be loaded with `React.lazy` and rendered through a shared `Suspense` fallback. Page effects will cancel or ignore outdated requests, set terminal loading/error states, and avoid refetching stable metadata when only playback controls change.

## Success criteria

- No IGDB access token or client secret is present in browser source or `VITE_*` configuration.
- Failed API responses produce terminal UI states rather than permanent loaders or render crashes.
- Rapid query/filter changes do not allow stale responses to overwrite current state.
- Comics and games pagination reflects API data without fabricated extra pages.
- No observer, interval, or global body-style side effect survives component unmount.
- Main route bundle is split so the initial entry no longer contains every page and heavy reader dependency.
- Bun tests, lint, type-check, audit, and production build pass.
