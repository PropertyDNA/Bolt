# PropertyDNA

PropertyDNA gives every property a living digital twin — property owners run phone walkthroughs (Property Scan), get a component-by-component Property Score, and the AI-powered Property Health Engine estimates repair costs and risk.

## Brand

- Deep navy (~#1B2A5E) + vibrant green accents on light backgrounds, rounded cards, pill-shaped CTAs (green primary, navy secondary), Inter font. Theme tokens live in `artifacts/property-dna/src/index.css` (light mode primary).
- Logos in `artifacts/property-dna/public/`: `pdna-logo.png` (main), `pdna-feature-icons.png` (2x2 feature icon sprite). Approved marketing copy: `artifacts/property-dna/website-copy.md` (verbatim only — do not rewrite).
- Landing page: `artifacts/property-dna/src/pages/landing-page.tsx` at `/`; CTAs point to `/scan` and `/app` (placeholder routes until the app shell lands).

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm run codegen` — regenerate API hooks and Zod schemas from `lib/api-spec/openapi.yaml` (runs orval + tsc --build, updates `lib/api-zod/` and `lib/api-client-react/`)
- `pnpm --filter @workspace/db run migrate` — apply any manual SQL fixups then push DB schema changes (handles type-cast changes drizzle-kit can't auto-apply, e.g. column type changes)
- `pnpm --filter @workspace/db run push` — push DB schema changes directly (use `migrate` if you hit cast errors)
- Required env: `DATABASE_URL` — Postgres connection string
- Production env (analytics & domain): `VITE_GA_MEASUREMENT_ID` — GA4 measurement ID (e.g. `G-XXXXXXXXXX`); analytics is a silent no-op when unset. `VITE_SITE_URL` — public site origin (e.g. `https://propertydna.com`) driving canonical/OG/Twitter URL meta; change only this when connecting a custom domain.

## Analytics

- Frontend GA4: `artifacts/property-dna/src/lib/analytics.ts`. Page views are tracked automatically on route changes (see `AnalyticsTracker` in `App.tsx`). Track custom events with `trackEvent('search', { query })` — safe no-op when GA is not configured.
- Domain-readiness meta: `artifacts/property-dna/src/lib/site.ts` upserts canonical + `og:url`/`twitter:url` from `VITE_SITE_URL` on each route change.
- API metrics: `artifacts/api-server/src/lib/metrics.ts` middleware logs per-request route/status/duration via Pino; in-memory summary at `GET /api/metrics`.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- **Schema changes**: edit `lib/api-spec/openapi.yaml`, then run `pnpm run codegen` — this regenerates `lib/api-zod/src/generated/` and `lib/api-client-react/src/generated/` **and** rebuilds the `dist/` declaration files via `tsc --build`. Never hand-edit the generated or dist files.
- **Stale generated types**: if you edit `openapi.yaml` without running codegen, the validation step `codegen-drift` will catch the drift. Run `bash scripts/check-codegen-drift.sh` (or trigger the `codegen-drift` validation) to verify generated files are in sync before merging.
- **DB schema push**: if `drizzle-kit push` fails with a column-cast error, run `pnpm --filter @workspace/db run migrate` instead — it applies the USING-cast SQL fixup then calls push. Add future fixups to `lib/db/src/migrate.ts`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
