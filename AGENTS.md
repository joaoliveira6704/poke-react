# Session Summary

## Goal
- Add frontend auth middleware that checks token validity and protects routes

## Constraints & Preferences
- Use `@tanstack/react-start` and `@tanstack/react-router` (SSR framework)
- Hardcode `BASE_URL` to the backend (`http://localhost:3000`) instead of Vite proxy
- Token stored via `localStorage` under key `auth-token`

## Done
- Created `src/lib/api.ts` — fetch wrapper with auto `Bearer` token attachment and 401 redirect to `/login`
- Created `src/lib/router-auth.ts` — `requireAuth()` middleware for `beforeLoad` route guard
- Moved `AuthProvider` from dead `App.tsx` into `__root.tsx:56` shell component so route components can use `useAuth()`
- Removed blocking loading state from `AuthProvider` (infinite loading fix), added 5s abort timeout to validate-token fetch
- Added `typeof window !== "undefined"` guards in `router-auth.ts` and `api.ts` for SSR safety
- Changed `BASE_URL` from `http://0.0.0.0:3000` to `http://localhost:3000` (modern browsers block `0.0.0.0` fetches)
- Added `_authenticated.tsx:14-18` — client-side `useEffect` auth redirect after hydration
- Added backend `GET /api/v1/auth/validate-token` endpoint and `validateToken` controller
- Updated `auth.tsx` login to parse backend response correctly (`data.id`, `data.token`, `data.username`)
- Updated `login.tsx` to use `auth.login()` from context instead of standalone fetch, with `?redirect=` param support
- `LoginForm` component: added `loading` prop, disables inputs while submitting
- Added `ssr: false` to `_authenticated` route options to prevent protected content from rendering during SSR

## Security Fix
- Protected content no longer leaks in SSR HTML — `_authenticated` route has `ssr: false`, so the server renders a `<ClientOnly>` placeholder instead of the actual layout. Client hydration triggers `beforeLoad` which checks `localStorage` and redirects if unauthenticated.

## Key Decisions
- Auth token lives in `localStorage` only (no cookies yet) — cookies would require backend changes and Vite proxy for same-origin SSR cookie reading
- `requireAuth` skips check during SSR (`typeof window` guard) — safe because `ssr: false` prevents server rendering
- Backend CORS is configured (`@fastify/cors`) allowing `http://localhost:5173`

## Relevant Files
- `frontend/src/lib/api.ts` — API client middleware (`BASE_URL`, `Bearer` token, `credentials: "include"` not used)
- `frontend/src/lib/router-auth.ts` — `requireAuth()` with `typeof window` guard
- `frontend/src/routes/_authenticated.tsx` — route guard layout with `ssr: false` + client-side `useEffect` fallback
- `frontend/src/routes/__root.tsx` — shell wraps children in `AuthProvider`, defines `MyRouterContext` (only `queryClient`)
- `frontend/src/routes/login.tsx` — login page using `auth.login()` + `?redirect=` + error state
- `frontend/src/auth.tsx` — `AuthProvider` with `login()`, `logout()`, validate-token on mount
- `frontend/src/router.tsx` — `getRouter()` exports router for TanStack Start, context has only `queryClient`
- `frontend/src/components/forms/login-form.tsx` — login form with `loading` prop support
- `backend/index.ts` — Fastify server with CORS (`origin: http://localhost:5173`)
- `backend/src/controllers/auth.controller.ts` — `login` and `validateToken` handlers
- `backend/src/routes/v1/auth.route.ts` — auth routes (`POST /login`, `GET /validate-token`)
