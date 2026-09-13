# CLAUDE.md

## Overview

This is a Car maintenance management full stack application

## Tech Stack

### Engineering / Monorepo

- Package manager: **pnpm 8** (`packageManager: pnpm@8.15.0`), Node `>=22`
- Build orchestration: **Turborepo** (`turbo.json`; `build` depends on `^build` and caches outputs)
- Style: **Prettier** (`.prettierrc.mjs`) + **Stylelint** (`.stylelintrc.mjs`) + per-package **ESLint**
- Workspace: `apps/*`, `packages/*`

### apps/backend (`@car-doctor/backend`)

- **Express 5** + **TypeScript** (compiled to `dist/` via `tsc`, dev via `tsx --watch`)
- **Mongoose 9** / MongoDB
- **Zod 4** request validation (`middleware/validation.ts`)
- Auth: **jose** (JWT) + **bcryptjs** (password hashing)
- Testing: **Vitest** + **supertest**
- Layering: `routes → controllers → services/models`; cross-cutting logic in `middleware/` (`auth`, `validation`, `errorHandler`); config in `config/`; helpers in `utils/`

### apps/web (`car-doctor-web`)

- **React 19** + **Vite 7** + **TypeScript**
- **TailwindCSS 4** (`@tailwindcss/vite`) + **shadcn/ui** (`components/ui/`) + Radix + CVA + tailwind-merge/clsx
- Routing: **react-router-dom 7**
- Data fetching: **TanStack Query 5**
- Forms: **react-hook-form** + **Zod** (`@hookform/resolvers`)
- State: Context (`AuthProvider`, `ThemeProvider`)
- 3D: **three** + **@react-three/fiber** + **drei**
- Icons: lucide-react
- Testing: **Vitest** (jsdom) + **React Testing Library** + **jest-dom**; config in `vitest.config.ts`, matchers/cleanup in `src/test/setup.ts`

### apps/mobile (`car-doctor-mobile`)

- **React Native 0.81** + **Expo 54** + **expo-router** (file-based routing)

### packages

- **`packages/shared` (`@car-doctor/shared`)** — canonical Zod schemas + inferred types shared by web and backend (`carSchema`, `loginSchema`/`registerSchema`/`changePasswordSchema`, `User`/`UserProfile`). Dual build via `tsc`: `dist/cjs` (backend `require`) + `dist/esm` (web/Vite bundling); the `development` export condition points at `src` so dev needs no prebuild. Consumers extend rather than fork (e.g. web `registerSchema.extend({ confirmPassword })`, backend `registerSchema.extend({ fullName })`).
- **`packages/config` (`@car-doctor/config`)** — shared dev config consumed via subpath exports: `@car-doctor/config/tsconfig/base.json` (strict base every package extends), `@car-doctor/config/eslint/base` (flat preset for Node/TS packages) and `@car-doctor/config/eslint/react` (adds react-hooks / react-refresh + browser globals, with shadcn-`ui/**` and R3F `@ts-nocheck` exceptions). ESLint is standardized on v9 flat config + `typescript-eslint`. Mobile keeps its own `eslint-config-expo`.

## Common Commands (repo root)

```bash
pnpm dev              # dev mode for all apps
pnpm dev:mobile       # mobile only
pnpm build            # turbo build
pnpm test             # all tests
pnpm test:backend     # backend only (vitest)
pnpm lint             # lint all
pnpm format           # prettier format across repo
```

## Best Practices

- **End-to-end types + validation**: Define the canonical Zod schema once in `packages/shared`; the backend feeds it to the `validation` middleware and the web forms use it via `zodResolver`. Derive types with `z.infer` — do not hand-write parallel interfaces. Add client- or server-only fields by `.extend()`ing the shared schema, never by copying it.
- **Backend layering**: Routes only map to handlers; business logic goes in controllers/services — no logic inside routes. `throw` errors and let `errorHandler` format the response; do not hand-write try/catch responses per controller.
- **Web data layer**: All server data goes through TanStack Query (`useQuery`/`useMutation`); after a mutation `invalidateQueries` instead of manually mutating local state. Centralize API calls in `web/src/lib/api.ts`.
- **UI components**: Reuse the shadcn components in `components/ui/` first; build conditional class names with `cn()` (`lib/utils.ts`, clsx + tailwind-merge) rather than string concatenation.
- **Auth**: Wrap protected routes with `ProtectedRoute`/`AuthedRoute`; token and user state are managed by `AuthProvider`.
- **TypeScript**: strict across the repo; avoid `any`; put shared types in `packages/shared`. Each package's `tsconfig.json` extends `@car-doctor/config/tsconfig/base.json` — add compiler options there, not per package.
- **Error handling**: in catch blocks type the error as `unknown` (the default — do not annotate `: any`) and read it through `getErrorMessage` / `hasErrorCode` in `backend/src/utils/getErrorMessage.ts`.
- **ESLint**: packages consume the presets from `@car-doctor/config`; don't fork rule sets per package. Suppress a rule locally only with a documented, narrowly-scoped override.
- **Testing**: web uses Vitest + RTL — test files live next to source as `*.test.ts(x)` and are excluded from the build (`tsconfig.app.json`); prefer RTL queries by role/text over implementation details. Backend uses Vitest + supertest and needs a local MongoDB on `27017` (its `globalSetup` connects and clears collections).
- **Before committing**: run `pnpm lint` + `pnpm test`, and `pnpm format` for consistent style.

## Deployment (Render)

- Backend: <https://car-doctor-vcgx.onrender.com>
- Web: <https://car-doctor-web.onrender.com>
