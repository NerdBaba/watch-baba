# Security and Code Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove committed credentials, remediate the direct dependency vulnerabilities reported by Bun, and fix the highest-impact runtime, security, test, and lint issues without changing the product’s content-provider behavior.

**Architecture:** Keep the existing React/CRA structure, but centralize validation for external URLs and browser storage. Credentials become build-time environment values documented in `.env.example`; absent optional credentials fail closed instead of sending hardcoded secrets. Dependency updates are performed with Bun, with the existing npm lockfile synchronized for the current CI configuration.

**Tech Stack:** React 18, Create React App 5, styled-components, Axios, Bun 1.3, Jest/React Testing Library.

**Spec:** User request: “fix vulnerabilites and code issues and commit and push”; Bun audit output captured on 2026-09-11.

## Global Constraints

- Do not stage or modify the pre-existing `node_modules` changes or the pre-existing untracked `bun.lock` except where dependency remediation deliberately updates the lockfile.
- Keep all external network calls on HTTPS and reject `javascript:`, `data:`, `blob:`, and malformed URLs before navigation or new-window operations.
- Do not commit API keys, OAuth tokens, or provider credentials; use `REACT_APP_*` build-time variables documented in `.env.example`.
- Run tests and builds with Bun, and run `bun audit` again before committing.

---

### Task 1: Remediate direct dependency vulnerabilities

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `bun.lock`

**Interfaces:**
- Consumes: the existing dependency manifest and Bun audit report.
- Produces: direct dependencies at or above Bun’s fixed versions: Axios `>=1.8.2`, DOMPurify `>=3.2.4`, jsPDF `>=3.0.1`, React Router DOM `>=6.30.2`, and Swiper `>=12.1.2`; removes unused `react-native`.

- [ ] **Step 1: Write the dependency verification command**

```bash
bun pm ls axios dompurify jspdf react-router-dom swiper react-native
```

- [ ] **Step 2: Run it to capture the vulnerable baseline**

Run: `bun pm ls axios dompurify jspdf react-router-dom swiper react-native`
Expected: the current vulnerable versions are shown and `react-native@0.75.2` is present as an unused direct dependency.

- [ ] **Step 3: Apply minimal Bun dependency changes**

```bash
bun add axios@^1.8.2 dompurify@^3.2.4 jspdf@^3.0.1 react-router-dom@^6.30.2 swiper@^12.1.2
bun remove react-native
```

- [ ] **Step 4: Synchronize the npm lockfile used by CI**

```bash
npm install --package-lock-only --ignore-scripts --no-audit
```

- [ ] **Step 5: Verify dependency versions and the build**

Run: `bun pm ls axios dompurify jspdf react-router-dom swiper react-native`
Expected: fixed versions are installed and `react-native` is absent.

Run: `bun run build`
Expected: exit code 0.

### Task 2: Remove committed credentials and validate external URLs

**Files:**
- Create: `.env.example`
- Create: `src/utils/externalLinks.js`
- Create: `src/utils/externalLinks.test.js`
- Modify: `src/services/tmdbApi.js`
- Modify: `src/pages/GameDetails.js`
- Modify: `src/components/GameCard.js`
- Modify: `src/components/SearchGameCard.js`
- Modify: `src/components/TorrentComponent.js`
- Modify: `src/pages/MovieDetails.js`
- Modify: `src/components/VideoPlayer.js`

**Interfaces:**
- Consumes: provider URLs and values returned by external APIs.
- Produces: `getSafeHttpUrl(value)`, `openExternalUrl(value)`, `openMagnetUrl(infoHash)`, and `decodeHtmlEntities(value)`; all return safe values or `false` without executing attacker-controlled schemes.

- [ ] **Step 1: Add failing security tests**

```js
import {
  decodeHtmlEntities,
  getSafeHttpUrl,
  openExternalUrl,
  openMagnetUrl,
} from './externalLinks';

test('rejects executable and malformed external URL schemes', () => {
  expect(getSafeHttpUrl('javascript:alert(1)')).toBe('');
  expect(getSafeHttpUrl('data:text/html,<script>alert(1)</script>')).toBe('');
  expect(getSafeHttpUrl('not a URL')).toBe('');
});

test('decodes entities without writing attacker input to innerHTML', () => {
  expect(decodeHtmlEntities('&amp; &quot;')).toBe('& "');
});

test('opens only safe HTTP URLs with opener isolation', () => {
  window.open = jest.fn(() => ({ opener: {} }));
  expect(openExternalUrl('https://example.com/path')).toBe(true);
  expect(window.open).toHaveBeenCalledWith(
    'https://example.com/path',
    '_blank',
    'noopener,noreferrer',
  );
});

test('opens only validated magnet info hashes', () => {
  window.open = jest.fn();
  expect(openMagnetUrl('not-a-hash')).toBe(false);
  expect(window.open).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run the focused test and verify it fails for the missing module**

Run: `bun run test -- --watchAll=false --runInBand src/utils/externalLinks.test.js`
Expected: FAIL because `externalLinks.js` does not exist yet.

- [ ] **Step 3: Implement the minimal URL and entity helpers**

```js
export const getSafeHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : '';
  } catch {
    return '';
  }
};
```

Implement `openExternalUrl` with `window.open(safeUrl, '_blank', 'noopener,noreferrer')` and set `opened.opener = null` when a window object is returned. Implement `openMagnetUrl` only for a 40-character hexadecimal or 32-character base32 BitTorrent info hash. Decode entities with a detached `textarea`’s `value`/`textContent` API, never `innerHTML`.

- [ ] **Step 4: Move provider credentials to environment variables**

Use `process.env.REACT_APP_TMDB_API_KEY`, `process.env.REACT_APP_IGDB_ACCESS_TOKEN`, and `process.env.REACT_APP_IGDB_CLIENT_ID`. Omit the `api_key` parameter when the TMDB variable is absent; skip the IGDB request with a clear console error when either IGDB variable is absent. Add placeholder names, not real values, to `.env.example`.

- [ ] **Step 5: Replace unsafe call sites**

Use the helper for torrent/download new windows and untrusted game links. Replace the two title entity decoders that assign `innerHTML`. Make domain checks in `VideoPlayer` compare exact hosts or dot-boundary suffixes and return `false` for malformed URLs.

- [ ] **Step 6: Run focused tests and a source scan**

Run: `bun run test -- --watchAll=false --runInBand src/utils/externalLinks.test.js`
Expected: PASS.

Run: `rg -n 'API_KEY = .+[A-Za-z0-9]|ACCESS_TOKEN = .+[A-Za-z0-9]|CLIENT_ID = .+[A-Za-z0-9]|\.innerHTML' src`
Expected: no committed credentials and no application source use of `.innerHTML`.

### Task 3: Fix storage, network, and lint correctness issues

**Files:**
- Modify: `src/utils/localStorage.js`
- Modify: `src/utils/myList.js`
- Modify: `src/utils/WishlistBooks.js`
- Modify: `src/utils/wishlistHelpers.js`
- Modify: `src/services/aniWatchApi.js`
- Modify: `src/services/comicApi.js`
- Modify: `src/App.js`
- Modify: `src/components/TorrentComponent.js`
- Modify: `src/components/BookReader.jsx`
- Modify: `src/pages/GameDetails.js`
- Modify: `src/pages/Watch.jsx`
- Modify: `tailwind.config.js`
- Modify: `src/App.test.js`

**Interfaces:**
- Consumes: malformed local storage, rejected API responses, and current lint output.
- Produces: non-throwing storage reads, encoded API parameters, response-status checks, cleaned test coverage, a configured Tailwind content scan, and no newly introduced lint warnings.

- [ ] **Step 1: Add failing tests for malformed storage and the current stale test**

Add tests that put invalid JSON in `localStorage` and assert each getter returns its empty default. Replace the placeholder “learn react” assertion with a test of the actual URL helper and a test that the app’s theme storage accepts a known theme name without throwing.

- [ ] **Step 2: Run the tests to confirm the baseline failure**

Run: `bun run test -- --watchAll=false --runInBand`
Expected: the focused security/storage assertions fail or the stale `learn react` assertion fails; record the exact failure before implementation.

- [ ] **Step 3: Implement safe storage parsing and API response handling**

Use a small `readJsonStorage(key, fallback)` helper with `try/catch` and type checks. Encode all user-controlled query/path values in the comic and anime services, and throw a descriptive error when a `fetch` response is not OK before parsing JSON.

- [ ] **Step 4: Fix the confirmed hook and configuration issues**

Clean up the stale `torrents.length` closure and clear its delayed timeout on unmount, capture `viewerRef.current` before BookReader cleanup, remove redundant App resize state assignment, add iframe titles, and configure Tailwind content for `src/**/*.{js,jsx}` and `public/index.html`. Remove unused declarations only where the existing render path proves they are dead.

- [ ] **Step 5: Run the full verification suite**

Run: `bun run test -- --watchAll=false --runInBand`
Expected: all tests pass.

Run: `bun run build`
Expected: exit code 0 with no security-related warnings; remaining warnings must be either eliminated or documented in the final handoff.

### Task 4: Audit, commit, and push

**Files:**
- Modify: only files changed by Tasks 1–3.

- [ ] **Step 1: Re-run dependency and source audits**

```bash
bun audit
rg -n 'API_KEY = .+[A-Za-z0-9]|ACCESS_TOKEN = .+[A-Za-z0-9]|CLIENT_ID = .+[A-Za-z0-9]|\.innerHTML' src
git diff --check
```

Expected: direct fixed packages are no longer reported; the source scan returns no committed credentials or unsafe `innerHTML`; diff check is clean. If Bun still reports unfixable transitive CRA advisories, record their package paths and runtime scope instead of hiding them.

- [ ] **Step 2: Review the staged file list**

```bash
git status --short -- . ':(exclude)node_modules' ':(exclude)build'
git diff --stat -- . ':(exclude)node_modules' ':(exclude)build'
```

Expected: no generated `build` output, `node_modules`, or unrelated pre-existing files are staged.

- [ ] **Step 3: Commit the scoped changes**

```bash
git add .env.example package.json package-lock.json bun.lock src docs/superpowers/plans/2026-09-11-security-and-code-hardening.md tailwind.config.js
git commit -m "fix: harden dependencies and external inputs"
```

- [ ] **Step 4: Push the current branch**

```bash
git push origin main
```

- [ ] **Step 5: Verify the pushed commit**

```bash
git status --short --branch
git log -1 --oneline --decorate
git ls-remote --heads origin main
```

Expected: the worktree is clean aside from pre-existing ignored/untracked files intentionally not staged, and `origin/main` points to the new commit.
