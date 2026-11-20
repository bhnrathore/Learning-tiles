# Learning Tiles

A tablet-friendly English learning app for ages 3-7. Twelve numbered counters, nine original lessons, an independently illustrated garden mosaic, and on-device completion tracking.

Use `learning-tiles` for the project folder and personal GitHub repository name. The local folder can be renamed independently; it does not affect saved browser progress.

## Run

Requires Node.js 22.12 or later.

```sh
npm ci
npm run dev
```

Open the URL Vite prints. It uses the next available port if the default is occupied. `npm run build` typechecks and creates the deployable `dist` directory; `npm run preview` serves that build locally. Use a static host with HTTPS for deployment, not the development server.

## GitHub Pages

The intended project address is https://bhnrathore.github.io/learning-tiles/.
This keeps the account's personal homepage separate. Build URLs are relative,
so the app supports both project Pages and a root-domain deployment.

1. Create the `bhnrathore/learning-tiles` repository on GitHub. A public repository makes the source public; private-repository Pages requires an eligible GitHub plan.
2. Push this project to its `main` branch. Do not upload `node_modules`, `dist`, or the discussion-only reference image; these are excluded by `.gitignore`.
3. In the repository's **Settings > Pages**, select **GitHub Actions** as the build and deployment source.
4. Open **Actions > Deploy To GitHub Pages** and run the workflow, or push another commit to `main`.

The workflow tests and builds the app, then publishes only `dist`. Later pushes
to `main` redeploy automatically. Browser progress from localhost does not
transfer to the hosted site. Review the release checklist before public launch.

## Verify

```sh
npm test
npx playwright install chromium
npm run test:e2e
npm run build
npm audit
```

Browser tests start a local server on port 5173 if needed. Screenshots are written to `test-results` for desktop (1366 x 768), tablet (768 x 1024), and mobile (360 x 800). Touch tests use Chromium emulation, not physical-device certification. Safari/iPadOS and real-device checks remain release tasks.

## Play

Choose a numbered tile or its question, then an answer in the tray. Tiles can also be dragged. To move a placed tile, select it and then another answer; occupied answers swap counters. A selected placed tile can be returned with the return action. Keyboard users can activate buttons with Enter; Space starts/ends keyboard dragging. All twelve must be placed before checking. Correct matches lock and reveal picture pieces; other tiles remain movable. Resetting a board does not erase completed lessons.

Grown-ups' corner contains instructions, credits, bundled font/icon licences, and a confirmed clear-progress action. Younger children will need adult help with text and may need support counting beyond ten. Guided focus highlights the active question and advances to an unplaced counter; it does not reduce the twelve-counter board or reveal answers.

## Data

Only completed lesson IDs are stored, under `twelve-tiles:progress` in localStorage. No account, name, age, DOB, cloud sync, analytics, ads, external font service, or payment system is included. Active board arrangements reset on reload. Saving failures leave play available and show a notice. Hosting and infrastructure logs must be assessed separately before launch.

## Originality And Release Gates

This is an independent prototype, not an authorised adaptation or a legal clearance. The supplied reference image is discussion-only and is not included in production assets. No original product branding, workbooks, exercise text, artwork, or checking algorithm has been incorporated intentionally. "Learning Tiles" is a provisional working name, not a cleared trademark.

Read [the design and rights checklist](docs/design-and-rights.md) before publishing. India-qualified IP review, source verification, educational review, real-device/accessibility testing, and applicable child-data compliance are commercial-release gates.
