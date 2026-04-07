# Story 1.1: Login screen gating + role selection

Status: done

## Story

As a user,  
I want to reach a dedicated login screen and choose Admin or Operator mode,  
so that task information is never shown before I authenticate and I enter the correct experience.

## Acceptance Criteria

1. **Given** I am not authenticated  
   **When** I open the application  
   **Then** I see the login screen without the global app shell  
   **And** I cannot view any task views or task detail content
2. **Given** I am on the login screen  
   **When** I select "Admin" or "Operator"  
   **Then** my role selection is captured for the authentication flow  
   **And** successful authentication routes me to the correct landing view (Admin → Board, Operator → My Tasks)

## Tasks / Subtasks

- [x] **Implement auth gate + shell-less login** (AC: 1)
  - [x] Define an "unauthenticated route group" that renders *only* Login (no sidebar/topbar/bottom-nav).
  - [x] Ensure task views and task detail routes cannot render any task UI while logged out (redirect to Login).
- [x] **Implement role selection + persistence for login attempt** (AC: 2)
  - [x] Add a role selector (Admin / Operator) on login and persist the selected role through the authentication step.
  - [x] On successful auth, route based on role: Admin → Board, Operator → My Tasks.
- [x] **Implement demo-friendly auth success/failure states** (supports ACs + PRD/UX intent)
  - [x] Provide an explicit "authenticated session" state.
  - [x] Ensure failed auth shows an error and stays on Login (do not leak task UI).
- [x] **Basic a11y + keyboard flows for login screen** (NFR-004)
  - [x] Keyboard-only completion for role selection + auth action.
  - [x] Visible focus states consistent with Kinetic Terminal constraints.

## Dev Notes

### Scope guardrails (MVP)

- This is a **frontend-only MVP**. Authentication can be **simulated**, but must demonstrate:
  - Success path establishing a session
  - Failure path showing an error
  - No task UI visible pre-auth

### UX requirements to respect (Kinetic Terminal)

- Login is a **shell-less screen** (no sidebar/bottom nav).  
- Login "Secure Access Terminal" requires:
  - Role selector Admin/Operator influencing post-login landing
  - PIN or magic-link as the auth methods (implemented fully in Stories 1.2 / 1.3)
  - Inline error near the active auth method on failure

### Architecture / project constraints (current)

- `_bmad-output/planning-artifacts/architecture.md` provides complete architectural guidance including stack decisions, routing structure, state management patterns, and implementation conventions.
- Architecture decisions completed during Story 1.1 implementation:
  - Next.js 16.2 App Router with route groups for auth vs app shells
  - Zustand for state management (session, task, filter stores)
  - Radix UI + Tailwind CSS v4 for components and styling
  - Vitest + Testing Library for component testing

### Testing notes

- Minimum evidence: manual verification that deep-linking to any task route while logged out redirects to Login and renders no task UI.
- Add at least lightweight unit/integration coverage for "route gating" once test tooling exists (details depend on chosen stack).

### References

- Epics Story 1.1 ACs: `_bmad-output/planning-artifacts/epics.md` (Epic 1 → Story 1.1)
- PRD FR-001: `docs/PRD_OpsTracker_v2.md` (FR-001 Login Screen)
- UX Login spec: `_bmad-output/planning-artifacts/ux-design.md` (Section 5.1 Login "Secure Access Terminal")

## Dev Agent Record

### Agent Model Used

claude-4.6-opus

### Debug Log References

- Next.js 16.2 renamed `middleware.ts` to `proxy.ts` — used `proxy.ts` with named export `proxy` per bundled docs
- Google Fonts (`Geist`, `Geist_Mono`) could not be fetched during build in this environment; switched to system font stack (Inter, ui-sans-serif)

### Implementation Plan

1. Set up project foundation: Vitest config, test script, Kinetic Terminal design tokens, TypeScript types
2. Create session store (Zustand) with role selection, login, logout, error state, and session cookie management
3. Create `(auth)` route group with shell-less layout for login
4. Create `(app)` route group with authenticated layout guard (redirects to /login when not authenticated)
5. Create `proxy.ts` for server-side route protection via session cookie
6. Create login page with role selector and PIN pad components
7. Create root page that redirects based on auth state and role
8. Create stub pages for /board and /my-tasks
9. Write comprehensive tests for session store, login page, role selector, and PIN pad

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created
- All 4 tasks implemented: auth gate, role selection, demo auth states, a11y keyboard flows
- 28 tests passing across 4 test files (session-store, login page, role-selector, pin-pad)
- Zero lint errors, clean production build
- Route protection via dual layer: server-side proxy.ts + client-side layout guard
- Kinetic Terminal design tokens applied: dark surfaces, accent color, 0px border-radius, uppercase labels
- Demo PIN is "000000" — shown on login screen for discoverability

### File List

- vitest.config.mts (new)
- src/test-setup.ts (new)
- src/types/session.types.ts (new)
- src/types/task.types.ts (new)
- src/types/user.types.ts (new)
- src/lib/constants.ts (new)
- src/stores/session-store.ts (new)
- src/stores/session-store.test.ts (new)
- src/proxy.ts (new)
- src/app/globals.css (modified — Kinetic Terminal design tokens)
- src/app/layout.tsx (modified — metadata, removed Google fonts)
- src/app/page.tsx (modified — root redirect logic)
- src/app/(auth)/layout.tsx (new — shell-less centered layout)
- src/app/(auth)/login/page.tsx (new — login page with role selector + PIN pad)
- src/app/(auth)/login/page.test.tsx (new)
- src/app/(auth)/login/_components/role-selector.tsx (new)
- src/app/(auth)/login/_components/role-selector.test.tsx (new)
- src/app/(auth)/login/_components/pin-pad.tsx (new)
- src/app/(auth)/login/_components/pin-pad.test.tsx (new)
- src/app/(app)/layout.tsx (new — authenticated shell with auth guard)
- src/app/(app)/board/page.tsx (new — stub)
- src/app/(app)/my-tasks/page.tsx (new — stub)
- package.json (modified — added test scripts)

### Review Findings

#### Patches Applied

- [x] [Review][Patch] Cookie/Zustand state desync on page refresh — Fixed: Cookie now stores userId+role payload; Zustand initializes from cookie [src/stores/session-store.ts]
- [x] [Review][Patch] PinPad submit uses stale closure state — Fixed: Using functional state update for submit validation [src/app/(auth)/login/_components/pin-pad.tsx]
- [x] [Review][Patch] setTimeout without cleanup in LoginPage — Fixed: Added cleanup with mounted ref and pending flag [src/app/(auth)/login/page.tsx]
- [x] [Review][Patch] No keyboard handlers on PinPad — Fixed: Added onKeyDown handler for digit keys, Backspace, Enter [src/app/(auth)/login/_components/pin-pad.tsx]
- [x] [Review][Patch] Double-click/resubmit race in login — Fixed: Added pending flag to prevent overlapping auth attempts [src/app/(auth)/login/page.tsx]
- [x] [Review][Patch] proxy.ts pathname.includes('.') bypass vulnerability — Fixed: Removed pathname.includes('.') check [src/proxy.ts]
- [x] [Review][Patch] Architecture doc describes middleware.ts but code uses proxy.ts — Fixed: Updated all references to proxy.ts and vitest.config.mts [architecture.md]
- [x] [Review][Patch] Story file still claims architecture.md is a stub — Fixed: Updated to reflect completed architecture [line 56]
- [x] [Review][Patch] Default export violations — Fixed: Added exception note for Next.js conventions [architecture.md]
- [x] [Review][Patch] Root page.tsx missing null role guard — Fixed: Added explicit null role check [src/app/page.tsx]
- [x] [Review][Patch] taskr-session cookie has no integrity or payload — Fixed: Cookie now stores JSON payload with userId and role [src/stores/session-store.ts]
- [x] [Review][Patch] Lint command underspecified — Fixed: Changed to "next lint --max-warnings=0" [package.json]
- [x] [Review][Patch] No tests for proxy.ts or route gating — Fixed: Added proxy.test.ts and (app)/layout.test.tsx [test files]
- [x] [Review][Patch] PIN progress dots use rounded-full vs no-radius spec — Fixed: Removed rounded-full class [src/app/(auth)/login/_components/pin-pad.tsx]

#### Deferred (Pre-existing or Minor)

- [x] [Review][Defer] Magic link not implemented — PRD FR-001 specifies both PIN and magic link; only PIN present — deferred, magic link deliberately scoped to Story 1.3 per epic breakdown; Story 1.1 validates PIN flow only
- [x] [Review][Defer] README references wrong path — Points to `app/page.tsx` instead of `src/app/page.tsx` [README.md] — deferred, minor onboarding friction
- [x] [Review][Defer] Missing trailing newlines — Multiple SVG and text files lack trailing newlines [multiple files] — deferred, cosmetic diff noise
- [x] [Review][Defer] Unused constants in constants.ts — STATUS_LABELS and TIMEOUT_MS not used in Story 1.1 [src/lib/constants.ts:3-8] — deferred, architecture prep
- [x] [Review][Defer] .gitignore excludes next-env.d.ts — Non-obvious choice lacks documentation [.gitignore:46] — deferred, common Next.js practice
- [x] [Review][Defer] AGENTS.md fragile node_modules path — Hard-codes path with no fallback [AGENTS.md:4] — deferred, minor doc helper issue
- [x] [Review][Defer] App shell minimal vs full sidebar/nav — AC1 mentions "global app shell" but stub only has thin header [src/app/(app)/layout.tsx] — deferred, acceptable stub for Story 1.1

## Change Log

- 2026-04-07: Implemented Story 1.1 — login screen gating + role selection with full test coverage
- 2026-04-07: Code review completed — 14 patches identified, 7 deferred
- 2026-04-07: All 14 patches applied — cookie/state sync fixed, keyboard handlers added, tests expanded, docs corrected
