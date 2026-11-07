# Playwright suite for the-internet

End-to-end tests for <https://the-internet.herokuapp.com>, focused on the
examples that are genuinely hard to automate: WebSockets, shadow DOM, network
and console events, visual diffs, and accessibility.

## Quick start

```bash
npm install
npx playwright install --with-deps   # browsers + OS dependencies
npm test                             # all projects (chromium, firefox, webkit)
npm run test:chromium                # fastest loop
```

## Commands

| Command                   | What it does                                        |
| ------------------------- | --------------------------------------------------- |
| `npm test`                | Run every spec in every browser project             |
| `npm run test:chromium`   | Run only the chromium project                       |
| `npm run test:firefox`    | Run only the firefox project                        |
| `npm run test:webkit`     | Run only the webkit project                         |
| `npm run test:headed`     | Run with a visible browser                          |
| `npm run test:trace`      | Record a trace for every test                       |
| `npm run test:grep`       | Filter tests by name (e.g. `-- "login"`)            |
| `npm run test:ui`         | Open Playwright's UI mode                           |
| `npm run typecheck`       | `tsc --noEmit`                                      |
| `npm run check`           | Lint, format check, and import sorting              |
| `npm run check:fix`       | Apply safe lint/format/import fixes                 |
| `npm run lint`            | Lint only                                           |
| `npm run lint:fix`        | Lint and apply safe fixes                           |
| `npm run format`          | Format only                                         |
| `npm run format:check`    | Check formatting without writing                    |
| `npm run baseline`        | Regenerate the visual-diff screenshot baseline      |
| `npm run clean`           | Remove dependencies and all generated reports       |
| `npm run report`          | Open the last Playwright HTML report                |
| `npm run report:allure`   | Generate the single-file Allure report and serve it |
| `npm run allure:generate` | Generate `allure-report/index.html` (single file)   |
| `npm run allure:open`     | Serve the last Allure report                        |
| `npm run allure:clean`    | Delete Allure results and the generated report      |
| `npm run codegen`         | Record actions against the site                     |

Point the suite at a different deployment with `BASE_URL`:

```bash
BASE_URL=http://localhost:3000 npm test
```

## Reports

Every run writes Playwright's HTML report to `playwright-report/` and Allure
results to `allure-results/`. Generate the Allure report with:

```bash
npm test
npm run allure:generate
```

`allure:generate` produces a self-contained, single-file report at
`allure-report/index.html` using Allure's modern **Awesome** UI. Open that file
directly in any browser — no `allure serve`, local server, or unzipping
required. The report inlines Playwright traces, screenshots, videos, and test
attachments (such as the axe JSON output), plus the base URL, Node, and OS
details captured in `playwright.config.ts`.

`npm run allure:open` is still available if you prefer the served experience.
Both result directories are ignored by Git.

Allure results are cleared at the start of every run by `src/global-setup.ts`,
so a report only contains the current run. Set `ALLURE_KEEP_RESULTS=true` to
merge results across runs.

## Code quality

[Biome](https://biomejs.dev) handles linting, formatting, and import sorting:

```bash
npm run check        # CI-style check: lint + format + imports
npm run check:fix    # apply safe fixes
npm run lint         # lint only
npm run format       # format only
```

`npm run typecheck` remains the TypeScript compiler check. CI runs both `check`
and `typecheck` before the browser matrix.

## Layout

```
playwright.config.ts     # base URL, timeouts, browsers, reporters
biome.json               # lint/format/import-sort configuration
src/
  global-setup.ts        # clears stale Allure results before each run
  pages/                 # page objects (BasePage + one per example)
  fixtures/test.ts       # test fixture with an axe-core builder
tests/
  auth.spec.ts           # basic auth + form login/logout
  accessibility.spec.ts  # axe on /accessibility_issues and its fixed variant
  dynamic-loading.spec.ts# auto-waiting instead of sleeps
  network-console.spec.ts# responses, 500s, console, pageerror, CSP
  shadow-dom.spec.ts     # nested open roots, slots, closed root, form element
  visual-diff.spec.ts    # screenshot baseline + per-variant comparison
  websocket.spec.ts      # real echo server + fully mocked with routeWebSocket
```

## What each hard example demonstrates

- **WebSocket** — the real `/websocket/echo` server (connect, echo, close code
  1000, oversized-message disconnect) and a second test that replaces the
  server entirely with `page.routeWebSocket()`.
- **Shadow DOM** — Playwright locators pierce nested _open_ roots and see
  slotted light-DOM content. Closed roots are intentionally unreachable; the
  test asserts that limitation instead of pretending otherwise.
- **Network & Console** — `waitForResponse`, `page.on('console')`,
  `page.on('pageerror')`, and the page's own `securitypolicyviolation` log.
- **Visual differences** — a stored `toHaveScreenshot` baseline, a check that
  the same URL renders byte-identically twice, and a check that every
  `?shift/?color/?font/?hide_logo/?typo` variant differs from the baseline.
- **Accessibility** — axe finds the documented broken rules on the default
  page and clears them on `?fixed=true`. `color-contrast` is reported as
  _incomplete_ (axe cannot resolve the template background), so the test
  accepts it as either a violation or an incomplete result.

## Notes and gotchas

- **Visual baselines are per browser and OS.** They are generated for chromium
  only; firefox/webkit ignore `visual-diff.spec.ts` via `testIgnore`. If you
  change machines or CI images, rerun `npm run baseline` and commit the new
  PNG.
- **The site is remote and occasionally slow.** Global timeouts are 60s per
  test / 15s per assertion. `dynamic_loading` waits up to ~8s by design.
- **Retries and traces.** Locally there are no retries; on CI there are 2.
  `trace: 'on-first-retry'` gives you a full trace for flaky runs.
- **Firefox/WebKit** need `npx playwright install firefox webkit` before
  running the full matrix.

## Continuous integration

The GitHub Actions workflow runs `npm run check`, `npm run typecheck`, and the
full Playwright matrix. It uploads both `playwright-report/` and the
single-file `allure-report.html` as artifacts and cancels superseded runs on the
same ref.

On pushes to `main`, the single-file Allure report is also published to GitHub
Pages, so it can be opened directly at
<https://chyde80.github.io/pw_automation/> without downloading anything. Pull
request runs only upload the artifacts.
