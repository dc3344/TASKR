---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-04-07'
inputDocuments:
  - 'docs/PRD_OpsTracker_v2.md'
  - 'docs/PRD_OpsTracker_v2.validation-report.md'
  - 'artifacts/stitch_file_web_ui 2/terminal_prime/DESIGN.md'
  - 'artifacts/stitch_file_web_ui 2/login_screen/code.html'
  - 'artifacts/stitch_file_web_ui 2/task_board_grey_headers/code.html'
  - 'artifacts/stitch_file_web_ui 2/quick_capture_with_assignee_type/code.html'
  - 'artifacts/stitch_file_web_ui 2/list_view_updated_style/code.html'
  - 'artifacts/stitch_file_web_ui 2/my_tasks_grey_headers/code.html'
workflowType: 'architecture'
project_name: 'TASKR'
user_name: 'Daniel'
date: '2026-04-07T00:00:00.000Z'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (architectural implications):**
- **Auth gating + role-based entry**: route protection + a session state that prevents any task UI render while logged out/expired; role selection influences landing route.
- **Global shell rules**: login must be shell-less; post-login uses a consistent navigation shell that adapts to desktop vs mobile.
- **Shared task model + seeded dataset**: single in-memory source of truth for Tasks/Users/Units with deterministic seed + reset on reload (no persistence).
- **Multi-view consistency**: Board/List/My Tasks/Detail all consume the same task store, same status enum, and the same filter state.
- **Permission gating**: UI capability gating based on role + assignment must be centralized and reused across cards, detail, and actions.
- **“Updated” cues**: updatedAt/age logic and “updated” indicators must be derived from local events (single client session).

**Non-Functional Requirements (architecture drivers):**
- **Performance**: keep state updates + view switching lightweight; avoid heavy derived recomputation on every render; plan for profiling markers for p95 targets.
- **Accessibility**: keyboard-first flows (login, nav, modal, detail), visible focus states, reduced-motion handling.
- **Responsive layout**: structure components to support distinct nav patterns desktop vs mobile without duplicating logic.
- **Design system fidelity**: enforce no-radius, surface-tier separation, uppercase label protocol, avoid 1px dividers as layout separators.

**Scale & Complexity:**
- Primary domain: **frontend web app (installable / app-like UI)**
- Complexity level: **medium**
- Estimated architectural components: **session/auth gate**, **router + route groups**, **global shell**, **task data store + selectors**, **permission service**, **filter state**, **UI component library/system tokens**, **seed data module**, **time/age formatting utilities**

### Technical Constraints & Dependencies

- **Frontend-only MVP**: no database, no backend sync, no offline persistence.
- **Deterministic demo**: seeded dataset must be repeatable across runs; edits are session-only.
- **Design constraints from Kinetic Terminal**: surface tiers and “no-line rule” influence component composition and styling approach.
- **Browser targets**: latest two stable Chrome/Edge/Safari; Firefox best-effort.

### Cross-Cutting Concerns Identified

- **Routing vs modal patterns** (esp. Task Detail + deep-link protection)
- **State management boundaries** (session vs tasks vs filters)
- **Permission gating** (one authoritative function/source)
- **Time semantics** (updatedAt/age + “updated” cue rules)
- **A11y + keyboard flows** across all primary interactions
- **Performance** (derived data, memoization/selectors, render cost)

## Starter Template Evaluation

### Primary Technology Domain

Frontend web application (installable / app-like UI) based on project requirements analysis.

### Starter Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Next.js (create-next-app)** | Built-in App Router with route groups (ideal for shell-less login vs protected shell); file-system routing; TypeScript + Tailwind + ESLint defaults; Turbopack for fast dev | Heavier than needed for a pure SPA; some SSR concepts unused in this frontend-only MVP |
| **Vite + React (create-vite)** | Minimal and fast; no server framework baggage | Must add router (React Router), test setup (Vitest), and conventions manually |
| **Create T3 App** | Full-stack starter with auth/DB options | Overkill for frontend-only MVP; last published Nov 2025 |

### Selected Starter: Next.js 16.2 via create-next-app

**Rationale:** Next.js App Router's route groups directly support the "shell-less login" vs "authenticated app shell" pattern required by the PRD. File-system routing eliminates manual route config. Tailwind v4 CSS-variable approach aligns well with Kinetic Terminal design tokens.

**Initialization Command (executed):**

```bash
npx create-next-app@latest taskr --typescript --eslint --tailwind --app --src-dir --disable-git
```

**Architectural Decisions Provided by Starter:**

- **Language & Runtime:** TypeScript 5, React 19.2, Next.js 16.2
- **Styling:** Tailwind CSS v4 (CSS-based config via `@theme` in `globals.css`)
- **Build Tooling:** Turbopack (dev), Webpack (prod), PostCSS
- **Linting:** ESLint 9 + eslint-config-next
- **Code Organization:** `src/app/` (App Router), `src/` source root, `public/` static assets
- **Development Experience:** Hot reload via Turbopack, TypeScript strict mode, `@/*` import alias

**Note:** Project scaffold has been initialized at the repo root. The `src/app/` directory is the entry point.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- State Management approach
- Routing structure and shell patterns
- Component architecture and accessibility primitives
- Testing framework

**Important Decisions (Shape Architecture):**
- Store slicing boundaries (session vs tasks vs filters)
- Modal/overlay patterns for Task Detail
- Permission gating implementation

**Deferred Decisions (Post-MVP):**
- Hosting / deployment strategy
- CI/CD pipeline
- Monitoring and logging
- Backend / API integration

### Data Architecture

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Persistence | None (in-memory only) | Frontend-only MVP; data resets on reload per PRD |
| Data Store | Zustand 5.x | Lightweight, hook-based, minimal boilerplate; supports slicing and selectors out of the box |
| Data Modeling | TypeScript interfaces in `src/types/` | Single source of truth for Task, User, Unit, Role, Status enums |
| Seed Data | Deterministic factory in `src/data/seed.ts` | Repeatable dataset; called once at store initialization |
| Validation | Runtime type guards + TypeScript compiler | No Zod/Yup needed for a frontend-only demo app |

**Store Slicing Strategy:**
- `useSessionStore` — auth state, selected role, login status
- `useTaskStore` — task collection, CRUD mutations, derived selectors (by status, by assignee, updated cues)
- `useFilterStore` — active view filters, search term, sort order

### Authentication & Security

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth Method | Simulated session (no real backend) | Role selection at login sets session; no tokens/passwords |
| Authorization | Centralized `can(action, role, task)` utility | Single function consumed by all views to gate UI capabilities |
| Session Expiry | None for MVP | PRD specifies no persistence; session lives until tab close/reload |
| Route Protection | Next.js middleware + layout guards | Unauthenticated users redirect to login; auth layout wraps all `/app` routes |

### API & Communication Patterns

Not applicable for frontend-only MVP. All data operations are synchronous Zustand mutations against the in-memory store.

### Frontend Architecture

| Decision | Choice | Version | Rationale |
|----------|--------|---------|-----------|
| State Management | Zustand | 5.0.12 | Small footprint, excellent TS support, built-in selectors, no provider wrappers needed |
| Component Primitives | Radix UI | 2.x (per-component) | Accessible headless primitives (Dialog, DropdownMenu, Tooltip, ToggleGroup) composed with Tailwind |
| Styling | Tailwind CSS v4 | (from starter) | CSS-variable `@theme` config maps directly to Kinetic Terminal design tokens |
| Routing | Next.js App Router | 16.2 (from starter) | File-system routing with route groups for auth vs app shells |
| Testing | Vitest + Testing Library | Vitest 4.1.x, @testing-library/react latest | Vite-native test runner, Jest-compatible API, DOM testing best practices |
| Test Environment | jsdom | latest | Lightweight browser environment for component tests |

**Routing Structure:**

```
src/app/
  (auth)/          ← shell-less group (no nav, no sidebar)
    login/page.tsx
    layout.tsx      ← minimal centered layout
  (app)/           ← authenticated shell group
    layout.tsx      ← persistent nav bar + sidebar
    board/page.tsx
    list/page.tsx
    my-tasks/page.tsx
  layout.tsx        ← root layout (providers, global styles)
  page.tsx          ← redirect to /login or /board
```

**Task Detail Pattern:** Modal overlay triggered from Board/List/My Tasks views. URL does **not** change (no `/task/:id` route). State-driven via `useTaskStore.selectedTaskId`. This avoids deep-link protection complexity and keeps the shell visible behind the modal.

**Radix + Tailwind Component Pattern:**

```tsx
import * as Dialog from '@radix-ui/react-dialog';

export function TaskDetailModal({ ... }) {
  return (
    <Dialog.Root>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 ...">
          {/* content */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

### Infrastructure & Deployment

Deferred for MVP. Development uses `next dev` with Turbopack. Production build via `next build`. No hosting target selected yet.

### Decision Impact Analysis

**Implementation Sequence:**
1. Design tokens + Tailwind theme config (unblocks all UI work)
2. TypeScript types + seed data module (unblocks store)
3. Zustand stores (session, task, filter)
4. Route groups + layout shells (auth vs app)
5. Permission utility (`can()`)
6. Radix-based shared components (Button, Modal, Dropdown, etc.)
7. View pages (Board, List, My Tasks) consuming stores
8. Vitest setup + initial test suite

**Cross-Component Dependencies:**
- Stores depend on types and seed data
- All views depend on stores and permission utility
- Components depend on Radix + Tailwind theme tokens
- Route protection depends on session store

## Implementation Patterns & Consistency Rules

### Naming Patterns

**File Naming:**
- Components, hooks, utils, stores: **kebab-case** — `task-card.tsx`, `use-session.ts`, `format-date.ts`, `task-store.ts`
- Type/interface files: **kebab-case** — `task.types.ts`, `session.types.ts`
- Test files: **co-located, `.test.tsx` suffix** — `task-card.test.tsx` beside `task-card.tsx`
- Constants/enums: **kebab-case** — `status.constants.ts`
- Next.js reserved files: unchanged — `page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx`

**Export Naming:**
- React components: **PascalCase** — `export function TaskCard()`
- Hooks: **camelCase with `use` prefix** — `export function useTaskStore()`
- Utility functions: **camelCase** — `export function formatAge()`
- Types/interfaces: **PascalCase** — `export interface Task`, `export type Role`
- Constants: **UPPER_SNAKE_CASE** — `export const STATUS_LABELS`
- Enums: **PascalCase name, UPPER_SNAKE_CASE members** — `enum Status { IN_PROGRESS }`

**CSS / Tailwind:**
- Custom utility classes: **kebab-case** — `surface-tier-1`, `label-uppercase`
- CSS custom properties: **kebab-case with `--` prefix** — `--color-surface-0`, `--font-mono`

### Structure Patterns

**Component Organization (Hybrid):**

```
src/
  app/                          ← Next.js App Router (routes only)
    (auth)/login/page.tsx       ← shell-less auth routes
    (app)/board/page.tsx        ← authenticated app routes
    (app)/board/_components/    ← feature-specific components (private to route)
    layout.tsx                  ← root layout
  components/
    ui/                         ← shared design-system primitives (button, modal, dropdown)
    layout/                     ← shell, nav-bar, sidebar
  hooks/                        ← shared custom hooks
  stores/                       ← Zustand stores (session, task, filter)
  types/                        ← TypeScript interfaces and enums
  data/                         ← seed data, constants, mock datasets
  lib/                          ← pure utilities (permissions, date formatting, etc.)
```

**Private Route Components:** Feature-specific components live in `_components/` inside their route directory (Next.js convention — underscore prefix excludes from routing). Example: `src/app/(app)/board/_components/board-column.tsx`.

**Shared Components:** Anything used by 2+ routes goes into `src/components/`. If it starts in a route's `_components/` and gets reused, promote it.

**Test Location:** Co-located beside the file under test:

```
src/stores/task-store.ts
src/stores/task-store.test.ts
src/components/ui/button.tsx
src/components/ui/button.test.tsx
```

### Zustand Store Patterns

**Store File Template:**

```typescript
import { create } from 'zustand';

interface TaskState {
  tasks: Task[];
  selectedTaskId: string | null;
  // actions
  updateTaskStatus: (id: string, status: Status) => void;
  selectTask: (id: string | null) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  selectedTaskId: null,
  updateTaskStatus: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, status, updatedAt: Date.now() } : t
      ),
    })),
  selectTask: (id) => set({ selectedTaskId: id }),
}));
```

**Rules:**
- **Verb-based action names**: `login`, `logout`, `updateTaskStatus`, `setFilter` — never `handleX` or `onX` in stores.
- **No Immer**: use spread/replace for immutable updates (keeps bundle small, MVP complexity is manageable).
- **Named selector exports** for derived data:

```typescript
export const useFilteredTasks = () =>
  useTaskStore((s) => {
    const { tasks } = s;
    const filters = useFilterStore.getState();
    return tasks.filter(/* ... */);
  });
```

- **No provider wrappers**: Zustand stores are consumed directly via hooks. No `<StoreProvider>` needed.
- **Store initialization**: seed data is loaded in the root layout via a one-time `useEffect` or Zustand's `getState().initialize()` pattern.

### Component Patterns

**Radix + Tailwind Composition:**

```tsx
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function StatusDropdown({ value, onChange, disabled }: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className="px-3 py-1.5 bg-surface-1 text-xs uppercase tracking-wider"
        disabled={disabled}
      >
        {STATUS_LABELS[value]}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="bg-surface-2 border border-white/10 p-1">
          {Object.values(Status).map((s) => (
            <DropdownMenu.Item
              key={s}
              className="px-3 py-1.5 text-xs cursor-pointer hover:bg-white/5 outline-none"
              onSelect={() => onChange(s)}
            >
              {STATUS_LABELS[s]}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
```

**Rules:**
- Radix provides behavior + accessibility; Tailwind provides styling. Never mix in CSS modules or styled-components.
- Every interactive component must be keyboard-navigable (Radix handles this by default).
- Shared UI primitives (`src/components/ui/`) wrap Radix with project-specific Tailwind classes.
- Feature components in `_components/` consume shared UI primitives, not raw Radix directly (when a primitive exists).

### Permission Gating Pattern

Single authoritative function:

```typescript
export function can(action: Action, role: Role, task?: Task): boolean {
  // centralized permission matrix
}
```

**Usage in components:**

```tsx
const role = useSessionStore((s) => s.role);
// ...
{can('editStatus', role, task) && <StatusDropdown ... />}
```

**Rules:**
- Never inline permission logic in components.
- All permission checks go through `can()` in `src/lib/permissions.ts`.
- Components receive the result as a boolean prop or compute it via the hook pattern above.

### Error Handling Patterns

**Route-Level Error Boundaries:** Each route group gets an `error.tsx` file (Next.js convention):

```
src/app/(app)/board/error.tsx    ← catches errors in board view
src/app/(app)/error.tsx          ← fallback for all app routes
```

**Per-Store Loading Flags:**

```typescript
interface SessionState {
  isAuthenticating: boolean;
  authError: string | null;
  // ...
}
```

**User-Facing Errors:**
- Transient errors (action failures): **toast notification** — auto-dismiss after 5s.
- Form validation: **inline error messages** below the field.
- Fatal/unexpected: caught by `error.tsx` boundary, shows recovery UI.

### Process Patterns

**Import Order (enforced by convention):**
1. React / Next.js imports
2. Third-party libraries (Zustand, Radix)
3. Internal aliases (`@/components/...`, `@/stores/...`)
4. Relative imports (`./_components/...`)
5. Type-only imports last

**Component File Structure:**
1. Imports
2. Type definitions (if local to this file)
3. Component function
4. Helper functions (private to file)
5. Default or named export at declaration

**Prop Patterns:**
- Destructure props in function signature: `function TaskCard({ task, onSelect }: TaskCardProps)`
- Interface name = `ComponentNameProps`
- No default exports for components — always named exports (exception: Next.js page.tsx, layout.tsx, error.tsx, loading.tsx files require default exports per framework convention).

### Anti-Patterns (Forbidden)

| Do NOT | Instead |
|--------|---------|
| Use CSS modules or styled-components | Tailwind classes only |
| Put permission checks inline in JSX | Use `can()` from `src/lib/permissions.ts` |
| Create `index.ts` barrel files | Import directly from the file |
| Use default exports for components | Named exports only |
| Store derived data in Zustand | Compute via selectors |
| Use `any` type | Proper TypeScript types or `unknown` |
| Add `console.log` for debugging | Remove before committing |
| Mix Radix + non-Radix for the same primitive | One source per interactive pattern |

### Enforcement Guidelines

**All AI Agents MUST:**
- Follow file naming (kebab-case) and export naming (PascalCase components, camelCase functions) without exception.
- Place tests co-located with the source file.
- Use the `can()` permission function for all capability gating.
- Use Radix primitives for any interactive pattern where a Radix component exists (Dialog, Dropdown, Tooltip, Toggle).
- Use Tailwind for all styling — zero CSS modules, zero inline style objects.
- Type all props, state, and function signatures — no implicit `any`.

## Project Structure & Boundaries

### Complete Project Directory Structure

```
taskr/
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.ts
├── next-env.d.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── vitest.config.mts                   ← Vitest configuration (jsdom env)
├── .gitignore
├── public/
│   └── (static assets — favicon, etc.)
├── src/
│   ├── app/
│   │   ├── globals.css                 ← Tailwind base + @theme design tokens
│   │   ├── layout.tsx                  ← Root layout (providers, font, metadata)
│   │   ├── page.tsx                    ← Root redirect → /login or /board
│   │   ├── (auth)/
│   │   │   ├── layout.tsx              ← Shell-less centered layout
│   │   │   └── login/
│   │   │       ├── page.tsx            ← Login screen (role select + PIN/magic-link)
│   │   │       ├── _components/
│   │   │       │   ├── role-selector.tsx
│   │   │       │   ├── pin-pad.tsx
│   │   │       │   └── magic-link-form.tsx
│   │   │       └── page.test.tsx
│   │   ├── (app)/
│   │   │   ├── layout.tsx              ← App shell (nav bar + sidebar)
│   │   │   ├── error.tsx               ← Fallback error boundary for app routes
│   │   │   ├── board/
│   │   │   │   ├── page.tsx            ← Board / Kanban view
│   │   │   │   └── _components/
│   │   │   │       ├── board-column.tsx
│   │   │   │       ├── task-card.tsx
│   │   │   │       └── quick-action-button.tsx
│   │   │   ├── list/
│   │   │   │   ├── page.tsx            ← List / table view
│   │   │   │   └── _components/
│   │   │   │       ├── task-table.tsx
│   │   │   │       └── sortable-header.tsx
│   │   │   └── my-tasks/
│   │   │       ├── page.tsx            ← My Tasks view (Mine/Team toggle)
│   │   │       └── _components/
│   │   │           ├── mine-team-toggle.tsx
│   │   │           └── empty-state.tsx
│   ├── components/
│   │   ├── ui/                         ← Shared design-system primitives
│   │   │   ├── button.tsx
│   │   │   ├── button.test.tsx
│   │   │   ├── modal.tsx               ← Wraps Radix Dialog
│   │   │   ├── modal.test.tsx
│   │   │   ├── dropdown.tsx            ← Wraps Radix DropdownMenu
│   │   │   ├── tooltip.tsx             ← Wraps Radix Tooltip
│   │   │   ├── toggle-group.tsx        ← Wraps Radix ToggleGroup
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx               ← Priority / status badges
│   │   │   └── toast.tsx               ← Transient error notifications
│   │   ├── layout/
│   │   │   ├── app-shell.tsx           ← Nav bar + sidebar container
│   │   │   ├── nav-bar.tsx             ← Top navigation
│   │   │   ├── sidebar.tsx             ← Side navigation (desktop)
│   │   │   ├── mobile-nav.tsx          ← Bottom/hamburger nav (mobile)
│   │   │   └── summary-strip.tsx       ← Status counters strip
│   │   └── task/
│   │       ├── task-detail-modal.tsx    ← Task detail overlay (Radix Dialog)
│   │       ├── task-detail-modal.test.tsx
│   │       ├── quick-capture-modal.tsx  ← Quick Capture form modal
│   │       ├── quick-capture-modal.test.tsx
│   │       ├── status-dropdown.tsx      ← Status advance control
│   │       └── locked-indicator.tsx     ← Read-only lock badge + reason
│   ├── stores/
│   │   ├── session-store.ts            ← Auth state, role, login/logout
│   │   ├── session-store.test.ts
│   │   ├── task-store.ts               ← Task CRUD, selectors, selected task
│   │   ├── task-store.test.ts
│   │   ├── filter-store.ts             ← Active filters, search, sort
│   │   └── filter-store.test.ts
│   ├── hooks/
│   │   ├── use-inactivity-timeout.ts   ← Session timeout logic
│   │   ├── use-inactivity-timeout.test.ts
│   │   └── use-filtered-tasks.ts       ← Derived filtered task list
│   ├── types/
│   │   ├── task.types.ts               ← Task, Status, Priority, AssigneeType
│   │   ├── user.types.ts               ← User, Role, Unit
│   │   └── session.types.ts            ← Session state shape
│   ├── data/
│   │   ├── seed.ts                     ← Deterministic seed factory
│   │   ├── seed.test.ts
│   │   ├── users.ts                    ← Seeded user records
│   │   └── units.ts                    ← Seeded unit records
│   └── lib/
│       ├── permissions.ts              ← can(action, role, task) gate
│       ├── permissions.test.ts
│       ├── format-date.ts              ← Age / updatedAt formatting
│       ├── format-date.test.ts
│       └── constants.ts                ← STATUS_LABELS, TIMEOUT_MS, etc.
```

### Architectural Boundaries

**Session Boundary:**
- `useSessionStore` is the sole authority for auth state.
- Route protection middleware reads session store; no component checks auth independently.
- The `(auth)` route group has zero access to task stores or task UI components.

**Data Boundary:**
- `useTaskStore` owns all task data. No component holds its own task state.
- Mutations (`create`, `updateStatus`, `updateFields`, `delete`) are store actions only.
- Seed data is loaded once via `useTaskStore.getState().initialize(seedTasks())`.

**Filter Boundary:**
- `useFilterStore` is independent from `useTaskStore`.
- Views consume both stores and derive the filtered list via `useFilteredTasks()`.
- Filter state is view-agnostic; switching routes does not clear filters.

**Permission Boundary:**
- All capability checks go through `can()` in `src/lib/permissions.ts`.
- Components receive boolean results. No component interprets role/assignment rules directly.

**Component Boundary:**
- `src/components/ui/` — project-agnostic primitives; know nothing about tasks or sessions.
- `src/components/layout/` — app shell structure; consumes session store for logout/user display.
- `src/components/task/` — task-domain shared components (detail modal, quick capture, status dropdown).
- `src/app/(app)/*/_components/` — route-private components; only consumed by their parent page.

### Requirements to Structure Mapping

| Epic | Primary Location | Shared Dependencies |
|------|-----------------|---------------------|
| **E1: Login & Session** | `src/app/(auth)/login/`, `src/stores/session-store.ts`, `src/hooks/use-inactivity-timeout.ts` | `src/lib/permissions.ts`, `src/types/session.types.ts` |
| **E2: Fast Task Capture** | `src/components/task/quick-capture-modal.tsx` | `src/stores/task-store.ts`, `src/types/task.types.ts`, `src/components/ui/modal.tsx` |
| **E3: Board Workflow** | `src/app/(app)/board/`, `src/app/(app)/board/_components/` | `src/stores/task-store.ts`, `src/stores/filter-store.ts`, `src/lib/permissions.ts`, `src/components/task/status-dropdown.tsx` |
| **E4: List Scanning** | `src/app/(app)/list/`, `src/app/(app)/list/_components/` | `src/stores/task-store.ts`, `src/stores/filter-store.ts`, `src/components/task/task-detail-modal.tsx` |
| **E5: My Tasks** | `src/app/(app)/my-tasks/`, `src/app/(app)/my-tasks/_components/` | `src/stores/task-store.ts`, `src/stores/session-store.ts`, `src/stores/filter-store.ts` |
| **E6: Task Detail + Permissions** | `src/components/task/task-detail-modal.tsx`, `src/lib/permissions.ts` | `src/stores/task-store.ts`, `src/stores/session-store.ts`, `src/components/task/locked-indicator.tsx` |
| **E7: Cross-View Filtering** | `src/stores/filter-store.ts`, `src/hooks/use-filtered-tasks.ts` | `src/components/layout/summary-strip.tsx` |
| **E8: Seeded Data + Cues** | `src/data/seed.ts`, `src/data/users.ts`, `src/data/units.ts`, `src/lib/format-date.ts` | `src/stores/task-store.ts` |

### Cross-Cutting Concerns Mapping

| Concern | Location |
|---------|----------|
| Design tokens (Kinetic Terminal) | `src/app/globals.css` — `@theme` block with CSS variables |
| Permission gating | `src/lib/permissions.ts` → consumed by task detail, board cards, quick actions |
| Inactivity timeout | `src/hooks/use-inactivity-timeout.ts` → mounted in `src/app/(app)/layout.tsx` |
| Error boundaries | `src/app/(app)/error.tsx` (route-level), `src/components/ui/toast.tsx` (transient) |
| Responsive layout | `src/components/layout/app-shell.tsx` (desktop sidebar vs mobile nav switch) |
| Accessibility (a11y) | Radix primitives provide keyboard + ARIA by default; focus-visible styles in `globals.css` |

### Data Flow

```
User Action
    ↓
Component calls store action (e.g. useTaskStore.getState().updateTaskStatus(id, status))
    ↓
Zustand updates state immutably (set(...))
    ↓
All subscribed components re-render with new state
    ↓
Derived selectors (useFilteredTasks) recompute
    ↓
UI reflects change (board columns, list rows, counters, age indicators)
```

### Development Workflow

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Next.js dev server (Turbopack) |
| `npx vitest` | Run tests in watch mode |
| `npx vitest run` | Single test run (CI-friendly) |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |

## Architecture Validation Results

### Coherence Validation

**Decision Compatibility:** All technology choices are mutually compatible.
- Next.js 16.2 + React 19.2 + TypeScript 5 — native integration via `create-next-app`.
- Zustand 5.0.12 — requires React >= 18; React 19 fully supported.
- Radix UI 2.1.x — React 19 compatible since 2.1.0.
- Vitest 4.1.x — runs its own Vite instance; no conflict with Next.js Turbopack.
- Tailwind CSS v4 — PostCSS-based; works with Next.js out of the box.

**Pattern Consistency:** Naming conventions (kebab-case files, PascalCase exports), co-located tests, hybrid component organization, and Zustand store patterns all align with Next.js App Router conventions. No contradictions between patterns and decisions.

**Structure Alignment:** Route groups `(auth)` / `(app)` directly implement the shell-less login vs authenticated shell requirement. `_components/` convention respects Next.js private folder semantics. Store/hook/lib separation keeps concerns cleanly bounded.

### Requirements Coverage Validation

**Epic Coverage — 8/8 epics fully supported:**

| Epic | Architectural Support |
|------|----------------------|
| E1: Login & Session | `(auth)` route group, `session-store`, `use-inactivity-timeout`, `proxy.ts` |
| E2: Fast Task Capture | `quick-capture-modal`, `task-store.create`, `modal` UI primitive |
| E3: Board Workflow | `board/` route, `_components/`, `task-store`, `can()`, `status-dropdown` |
| E4: List Scanning | `list/` route, `_components/`, `task-detail-modal`, `filter-store` |
| E5: My Tasks | `my-tasks/` route, `session-store` (user/unit IDs), `filter-store` |
| E6: Task Detail + Permissions | `task-detail-modal`, `permissions.ts`, `locked-indicator` |
| E7: Cross-View Filtering | `filter-store`, `use-filtered-tasks`, `summary-strip` |
| E8: Seeded Data + Cues | `seed.ts`, `users.ts`, `units.ts`, `format-date.ts`, `task-store` |

**Functional Requirements — 12/12 covered:**
FR1–FR12 each map to at least one epic and to specific files in the project structure.

**Non-Functional Requirements — 8/8 addressed:**

| NFR | How Addressed |
|-----|--------------|
| NFR1 (Browser support) | Modern browsers; no polyfills needed |
| NFR2 (SEO) | N/A — authenticated app, no indexing |
| NFR3 (Quick capture speed) | Autofocus + Enter-submit + minimal fields |
| NFR4 (Interaction responsiveness) | Zustand selectors minimize re-renders; Turbopack dev speed |
| NFR5 (Design system fidelity) | `@theme` CSS variables in `globals.css` enforce Kinetic Terminal tokens |
| NFR6 (Accessibility) | Radix primitives provide keyboard + ARIA by default; focus-visible styles |
| NFR7 (Responsiveness) | Tailwind responsive utilities; `app-shell` switches sidebar ↔ mobile nav |
| NFR8 (Security boundary) | `proxy.ts` route protection + `session-store` auth gating |

### Gap Analysis Results

**Gaps Found: 2 (both minor, resolved below)**

1. **`src/proxy.ts` missing from project tree** — referenced in Auth & Security decisions for route protection but omitted from the directory listing.
   - **Resolution:** Added to project structure. File intercepts requests to `(app)` routes and redirects to `/login` if session is not authenticated. Note: Next.js 16.2 renamed middleware to proxy.

2. **`vitest.config.mts` listed but not yet created** — needed for jsdom environment and React plugin configuration.
   - **Resolution:** File will be created during E1 setup with jsdom environment and `@vitejs/plugin-react`.

No critical or important gaps remain.

### Architecture Completeness Checklist

**Requirements Analysis:**
- [x] Project context thoroughly analyzed (FR + NFR implications)
- [x] Scale and complexity assessed (medium — frontend-only MVP)
- [x] Technical constraints identified (no backend, deterministic seed, Kinetic Terminal rules)
- [x] Cross-cutting concerns mapped (routing, state boundaries, permissions, a11y, time semantics)

**Architectural Decisions:**
- [x] Critical decisions documented with versions (Zustand 5.0.12, Radix 2.x, Vitest 4.1.x)
- [x] Technology stack fully specified
- [x] Store slicing, routing, and modal patterns defined
- [x] Performance approach specified (selectors, minimal re-renders)

**Implementation Patterns:**
- [x] Naming conventions established (kebab-case files, PascalCase exports)
- [x] Structure patterns defined (hybrid org, co-located tests, `_components/`)
- [x] State management patterns specified (verb actions, named selectors, no Immer)
- [x] Process patterns documented (error boundaries, loading flags, import order)
- [x] Anti-patterns explicitly listed

**Project Structure:**
- [x] Complete directory structure defined (all files and directories)
- [x] Component boundaries established (ui / layout / task / route-private)
- [x] Integration points mapped (stores ↔ views ↔ permissions)
- [x] Requirements to structure mapping complete (8 epics → specific paths)

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Clean separation between auth and app shells via route groups
- Single-source permission gating via `can()`
- Zustand store slicing eliminates prop drilling and provider complexity
- Radix provides a11y compliance with minimal custom work
- Every epic has a clear home in the directory structure

**Areas for Future Enhancement (post-MVP):**
- Backend API integration (add API route handlers or external service layer)
- Persistent auth (replace simulated session with real token-based auth)
- E2E testing with Playwright (add `tests/e2e/` directory)
- CI/CD pipeline (GitHub Actions workflow)
- Performance profiling markers for p95 targets

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented in this file.
- Use implementation patterns consistently — naming, structure, store conventions.
- Respect component boundaries: `ui/` knows nothing about domain, `task/` is shared, `_components/` is route-private.
- Route all permission logic through `can()` in `src/lib/permissions.ts`.
- Co-locate tests. No component or store without a test file.

**Corrected Project Tree Addition:**

```
src/
  proxy.ts                       ← Route protection (redirects unauthenticated → /login)
```

**First Implementation Priority:** Epic 1, Story 1.1 — Login screen gating + role selection. Scaffolds the `(auth)` route group, session store, and root redirect.

