# felipeplets.com

Personal site of [Felipe Plets](https://felipeplets.com) — thought leadership on building
software with high quality and efficiency in the age of vibe coding and agentic
engineering.

Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com),
deployed as a fully static site to GitHub Pages.

## Local development

Requires Node 22.12 or newer (see `.nvmrc`).

```bash
nvm use          # or any Node >= 22.12
npm install
npm run dev      # http://localhost:4321
```

| Script            | What it does                                                  |
| ----------------- | ------------------------------------------------------------- |
| `npm run dev`     | Dev server with hot reload                                     |
| `npm run build`   | Type-checks with `astro check`, then builds to `dist/`         |
| `npm run preview` | Serves the production build locally                            |
| `npm run assets`  | Regenerates `og-image.png`, `apple-touch-icon.png`, `favicon.ico` |

## Editing content

Most copy lives in a small number of files, so you rarely need to touch layout code.

- `src/consts.ts` — site title, description, Substack details, social links, nav, contact email
- `src/content/site-content.ts` — the four practice pillars, engagement formats, and the
  cited statistics (keep the `source` field accurate)
- `src/components/Hero.astro`, `About.astro`, `Thesis.astro`, `Contact.astro` — home page prose
- `src/pages/about.astro`, `src/pages/speaking.astro` — standalone page copy
- `src/assets/` — photography, optimized automatically by Astro at build time

### Writing

There is no blog in this repo. Posts live on
[All You Can Lead](https://allyoucanlead.substack.com) and the home page pulls the four
most recent from the Substack RSS feed **at build time** (`src/lib/substack.ts`). That
keeps the site fully static with no client-side fetching or CORS workarounds.

Because the fetch happens at build time, a new Substack post only appears after a rebuild.
The deploy workflow runs on a daily schedule for exactly this reason, and you can always
trigger it manually from the Actions tab. If the feed is unreachable the build still
succeeds — the section just renders the subscribe CTA without the post list.

## Design

"Midnight & Copper": a deep navy-black ground, warm copper accent, bone text. Tokens are
defined once in `src/styles/global.css` under Tailwind's `@theme` block — change them there
and the whole site follows. Display type is Fraunces, body type is Inter, both self-hosted
via `@fontsource` so no third-party font requests are made at runtime.

The site is dark-only by design. Scroll reveals are progressive enhancement: elements are
only hidden when JavaScript is available to reveal them, and all motion is disabled under
`prefers-reduced-motion`.

## Deployment

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds the site and
publishes `dist/` to GitHub Pages.

> **One-time setup:** the repository's Pages source must be set to **GitHub Actions**
> (Settings → Pages → Build and deployment → Source). This repo previously used the legacy
> "deploy from branch" mode, which ignores the workflow.

### Domains

`public/CNAME` sets the canonical domain to `felipeplets.com`. DNS for the apex should
point at GitHub Pages:

```
A     @      185.199.108.153
A     @      185.199.109.153
A     @      185.199.110.153
A     @      185.199.111.153
CNAME www    felipeplets.github.io.
```

GitHub Pages only serves one custom domain per site, so `plets.me` is handled as a
registrar- or DNS-level redirect to `felipeplets.com` rather than a second CNAME.

## Deferred by design

Two things are intentionally not implemented yet, each isolated to a single place so they
can be added without touching anything else:

- **Lead generation** — the newsletter CTA in `src/components/Newsletter.astro` currently
  links straight to Substack. The block is marked with a `LEAD GENERATION INSERTION POINT`
  comment; swap in a provider embed or form there.
- **Analytics** — no third-party scripts ship today, which keeps the site cookie-banner
  free. `src/layouts/BaseLayout.astro` has an `ANALYTICS INSERTION POINT` comment in
  `<head>` for when that changes.

## Previous versions

The 2008–2014 version of this site is preserved at the
[`v1-legacy-2014`](https://github.com/felipeplets/felipeplets.github.io/tree/v1-legacy-2014)
tag rather than kept in the working tree.
