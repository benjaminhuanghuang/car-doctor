# CLAUDE.md

Car Doctor — car maintenance management, pnpm + Turborepo monorepo.

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

### apps/mobile (`car-doctor-mobile`)

- **React Native 0.81** + **Expo 54** + **expo-router** (file-based routing)

### packages

- `packages/shared`, `packages/config` — shared code/config across packages

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

- **End-to-end types + validation**: For new APIs, validate inputs on the backend with a Zod schema through the `validation` middleware, and reuse an isomorphic Zod schema on the web forms (`web/src/lib/schemas.ts`). Prefer placing schemas in `packages/shared` so front and back end share them.
- **Backend layering**: Routes only map to handlers; business logic goes in controllers/services — no logic inside routes. `throw` errors and let `errorHandler` format the response; do not hand-write try/catch responses per controller.
- **Web data layer**: All server data goes through TanStack Query (`useQuery`/`useMutation`); after a mutation `invalidateQueries` instead of manually mutating local state. Centralize API calls in `web/src/lib/api.ts`.
- **UI components**: Reuse the shadcn components in `components/ui/` first; build conditional class names with `cn()` (`lib/utils.ts`, clsx + tailwind-merge) rather than string concatenation.
- **Auth**: Wrap protected routes with `ProtectedRoute`/`AuthedRoute`; token and user state are managed by `AuthProvider`.
- **TypeScript**: strict across the repo; avoid `any`; put shared types in `packages/shared`.
- **Before committing**: run `pnpm lint` + `pnpm test`, and `pnpm format` for consistent style.

## Deployment (Render)

- Backend: <https://car-doctor-vcgx.onrender.com>
- Web: <https://car-doctor-web.onrender.com>
