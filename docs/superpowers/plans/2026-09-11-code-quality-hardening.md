# Code Quality Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden Watch Baba’s security and runtime quality without changing its content-provider behavior.

**Architecture:** Introduce shared fetch/error primitives and a server-side IGDB proxy, then apply cancellation and terminal UI states to the highest-risk pages. Use route-level lazy loading for bundle size, add focused regression tests and quality scripts, and retain Bun/Vite as the only package/build workflow.

**Tech Stack:** React 18, React Router 7, Vite 8, Vitest 5, Bun 1.3.6, Cloudflare Pages Functions, Axios, DOMPurify.

**Spec:** `docs/superpowers/specs/2026-09-11-code-quality-hardening-design.md`

## Global Constraints

- Keep external content providers and their existing response contracts unchanged unless a response-status or validation guard is required.
- Never expose `IGDB_ACCESS_TOKEN` or `IGDB_CLIENT_ID` through `VITE_*` browser variables.
- Use Bun for dependency, test, audit, lint, type-check, and build commands.
- Preserve `bun.lock`; do not reintroduce `package-lock.json`.
- Every behavior change must have a focused regression test written and observed failing before implementation.
- Keep the production output directory `build` for Cloudflare Pages.

---

### Task 1: Add shared request and API-boundary primitives

**Files:**
- Create: `src/services/requestJson.js`
- Create: `src/services/requestJson.test.js`
- Create: `functions/api/igdb.js`
- Create: `functions/api/igdb.test.js`
- Modify: `.env.example`
- Modify: `README.md`
- Modify: `package.json`

**Interfaces:**
- `requestJson(url, options = {})` returns parsed JSON, throws `HttpRequestError` on non-2xx responses, and rethrows `AbortError` unchanged.
- The IGDB function accepts `POST /api/igdb` with `{ query: string }` and returns the upstream IGDB JSON array or a JSON error response.

- [x] **Step 1: Write failing request-helper tests** for successful JSON, non-2xx rejection, and abort propagation.
- [x] **Step 2: Run `bun run test -- src/services/requestJson.test.js` and confirm the new tests fail because the helper is absent.**
- [x] **Step 3: Implement `HttpRequestError` and `requestJson` with status checking, JSON parsing, and signal forwarding.**
- [x] **Step 4: Write a failing IGDB boundary test** for missing credentials and successful upstream forwarding using a minimal Cloudflare `Request`/`env` fixture.
- [x] **Step 5: Implement `functions/api/igdb.js`** with method/content-type/query validation, server-only env access, upstream status handling, and no credential echoing.
- [x] **Step 6: Replace `.env.example` IGDB token guidance with `IGDB_ACCESS_TOKEN`/`IGDB_CLIENT_ID` server-secret guidance and document `POST /api/igdb`.**
- [x] **Step 7: Run the focused tests and verify they pass.**

### Task 2: Migrate browser services and remove exposed IGDB credentials

**Files:**
- Modify: `src/services/aniWatchApi.js`
- Modify: `src/services/comicApi.js`
- Modify: `src/services/anilistApi.js`
- Modify: `src/services/tmdbApi.js`
- Modify: `src/pages/GameDetails.jsx`
- Delete: `src/services/anilistApi.js` if the duplicate remains unused
- Test: `src/utils/externalLinks.test.js` and new service tests where needed

**Interfaces:**
- Browser services accept optional `{ signal }` request options without breaking existing page call sites.
- `GameDetails` calls `/api/igdb` with a public query only; it never sends an Authorization header from the browser.

- [x] **Step 1: Add failing tests** proving anime/comic request URLs encode inputs and non-OK responses reject.
- [x] **Step 2: Run the focused tests and confirm the baseline fails.**
- [x] **Step 3: Migrate fetch-based services to `requestJson` and encode all dynamic path/query values.**
- [x] **Step 4: Remove `VITE_IGDB_ACCESS_TOKEN` and `VITE_IGDB_CLIENT_ID` reads from `GameDetails`; post only the validated query to `/api/igdb`.**
- [x] **Step 5: Check IGDB response shape before reading the first game and keep the page usable when the optional enrichment is unavailable.**
- [x] **Step 6: Run the focused service/security tests and a source scan for `VITE_IGDB_ACCESS_TOKEN`, `Bearer`, and hardcoded credentials.**

### Task 3: Fix page request lifecycles, loading states, and pagination

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/pages/Movies.jsx`
- Modify: `src/pages/TvShows.jsx`
- Modify: `src/pages/SearchResults.jsx`
- Modify: `src/pages/Actors.jsx`
- Modify: `src/pages/ActorDetails.jsx`
- Modify: `src/pages/Games.jsx`
- Modify: `src/pages/Comics.jsx`
- Modify: `src/services/comicApi.js`
- Modify: `src/pages/TvShowDetails.jsx`
- Modify: `src/pages/MangaDetails.jsx`
- Modify: `src/pages/Books.jsx`
- Modify: `src/pages/Sports.jsx`

**Interfaces:**
- Each request effect owns an `AbortController` or request identity and returns cleanup.
- Loading state always reaches `false` in `finally`; failures render an explicit retry/empty state where the page already has an empty-state path.

- [x] **Step 1: Add failing tests for Home terminal loading, games page propagation/total pages, and comics API total-page fallback.**
- [x] **Step 2: Run those tests and confirm each fails for the current implementation.**
- [x] **Step 3: Add cleanup/cancellation and terminal error state to Home, Movies, TV, search, actors, books, sports, manga, and detail pages.**
- [x] **Step 4: Split stable TV metadata fetching from season/episode/server fetching.**
- [x] **Step 5: Fix games all-category page parameters, `hasNextPage` handling, empty-result clearing, and stable item keys.**
- [x] **Step 6: Replace the comics hardcoded page count with the API value and a safe `hasNextPage` fallback.**
- [x] **Step 7: Add a real Bookmark action to `MangaDetails` using the existing comic/book storage pattern, or remove the button if the API has no persistence contract; retain a regression test for the chosen behavior.**
- [x] **Step 8: Run the page regression tests and full Vitest suite.**

### Task 4: Fix resource cleanup, accessibility, and malformed UI values

**Files:**
- Modify: `src/components/VideoPlayer.jsx`
- Modify: `src/pages/GameDetails.jsx`
- Modify: `src/pages/MovieDetails.jsx`
- Modify: `src/pages/TvShowDetails.jsx`
- Modify: `src/components/Header.jsx`
- Modify: `src/components/Sidebar.jsx`
- Modify: `src/components/Topbar.jsx`
- Modify: `src/pages/AnimeDetails.jsx`
- Modify: `src/pages/SearchResults.jsx`
- Modify: `src/index.jsx`
- Create: `src/components/AppErrorBoundary.jsx`
- Test: component tests for observer cleanup, error fallback, and accessible controls

**Interfaces:**
- Global body styles are restored in effect cleanup.
- Icon-only controls expose stable `aria-label` values.
- Route rendering has a recoverable error boundary.

- [x] **Step 1: Write failing component tests** for observer cleanup, accessible icon controls, and error-boundary fallback.
- [x] **Step 2: Run them and confirm the current implementation fails.**
- [x] **Step 3: Disconnect observers and restore body overflow/zoom/orientation-related styles during cleanup.**
- [x] **Step 4: Convert click-only logo/icon controls to semantic buttons/links or add keyboard semantics and labels.**
- [x] **Step 5: Fix invalid CSS declarations, remove redundant Topbar/App state and dead service code, and make malformed API fields render safely.**
- [x] **Step 6: Add the error boundary around routes and run focused component tests.**

### Task 5: Split routes and add quality gates

**Files:**
- Modify: `src/App.jsx`
- Modify: `package.json`
- Modify: `vite.config.mjs`
- Modify: `.gitignore`
- Create: `eslint.config.js`
- Create: `jsconfig.json`
- Create: `.github/workflows/quality.yml`
- Test: `src/App.test.jsx`

**Interfaces:**
- All page components are loaded through `React.lazy` behind a shared `Suspense` fallback.
- `bun run lint`, `bun run typecheck`, `bun run test`, and `bun run build` are the local/CI quality commands.

- [x] **Step 1: Add the quality scripts/configuration and a failing check for route-level dynamic imports.**
- [x] **Step 2: Run the new checks to expose current lint/type issues.**
- [x] **Step 3: Add `React.lazy` route imports and preserve the current route paths and page components.**
- [x] **Step 4: Fix lint/type errors without broad behavioral rewrites.**
- [x] **Step 5: Ignore generated `build/` output and remove tracked generated artifacts only if the current worktree confirms they are generated and reproducible.**
- [x] **Step 6: Add a Bun-based CI workflow for install, lint, typecheck, test, audit, and build.**
- [x] **Step 7: Run all quality gates and confirm the initial bundle is materially smaller.**

### Task 6: Final verification and handoff

**Files:**
- Modify: only files changed by Tasks 1–5.

- [x] **Step 1: Run `bun install --frozen-lockfile --ignore-scripts`.**
- [x] **Step 2: Run `bun run lint`.**
- [x] **Step 3: Run `bun run typecheck`.**
- [x] **Step 4: Run `bun run test -- --reporter=dot`.**
- [x] **Step 5: Run `bun audit --audit-level=moderate`.**
- [x] **Step 6: Run `bun run build` and inspect bundle warnings.**
- [x] **Step 7: Run `git diff --check`, inspect `git diff --stat`, and confirm no secrets or generated dependency directories are staged.**
