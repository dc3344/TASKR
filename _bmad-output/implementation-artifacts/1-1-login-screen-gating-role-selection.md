# Story 1.1: Login screen gating + role selection

Status: ready-for-dev

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
   **When** I select “Admin” or “Operator”  
   **Then** my role selection is captured for the authentication flow  
   **And** successful authentication routes me to the correct landing view (Admin → Board, Operator → My Tasks)

## Tasks / Subtasks

- [ ] **Implement auth gate + shell-less login** (AC: 1)
  - [ ] Define an “unauthenticated route group” that renders *only* Login (no sidebar/topbar/bottom-nav).
  - [ ] Ensure task views and task detail routes cannot render any task UI while logged out (redirect to Login).
- [ ] **Implement role selection + persistence for login attempt** (AC: 2)
  - [ ] Add a role selector (Admin / Operator) on login and persist the selected role through the authentication step.
  - [ ] On successful auth, route based on role: Admin → Board, Operator → My Tasks.
- [ ] **Implement demo-friendly auth success/failure states** (supports ACs + PRD/UX intent)
  - [ ] Provide an explicit “authenticated session” state.
  - [ ] Ensure failed auth shows an error and stays on Login (do not leak task UI).
- [ ] **Basic a11y + keyboard flows for login screen** (NFR-004)
  - [ ] Keyboard-only completion for role selection + auth action.
  - [ ] Visible focus states consistent with Kinetic Terminal constraints.

## Dev Notes

### Scope guardrails (MVP)

- This is a **frontend-only MVP**. Authentication can be **simulated**, but must demonstrate:
  - Success path establishing a session
  - Failure path showing an error
  - No task UI visible pre-auth

### UX requirements to respect (Kinetic Terminal)

- Login is a **shell-less screen** (no sidebar/bottom nav).  
- Login “Secure Access Terminal” requires:
  - Role selector Admin/Operator influencing post-login landing
  - PIN or magic-link as the auth methods (implemented fully in Stories 1.2 / 1.3)
  - Inline error near the active auth method on failure

### Architecture / project constraints (current)

- `_bmad-output/planning-artifacts/architecture.md` is currently a stub (no stack, routing, or state conventions captured yet).
- **Do not invent a bespoke architecture** in implementation. If the repo does not already have an established app scaffold, run the Architecture workflow first to lock:
  - routing approach (route-based vs modal patterns)
  - session storage + timeout interaction rules
  - state management approach for seeded demo data + filter persistence

### Testing notes

- Minimum evidence: manual verification that deep-linking to any task route while logged out redirects to Login and renders no task UI.
- Add at least lightweight unit/integration coverage for “route gating” once test tooling exists (details depend on chosen stack).

### References

- Epics Story 1.1 ACs: `_bmad-output/planning-artifacts/epics.md` (Epic 1 → Story 1.1)
- PRD FR-001: `docs/PRD_OpsTracker_v2.md` (FR-001 Login Screen)
- UX Login spec: `_bmad-output/planning-artifacts/ux-design.md` (Section 5.1 Login “Secure Access Terminal”)

## Dev Agent Record

### Agent Model Used

GPT-5.2

### Debug Log References

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created

### File List

- (to be filled by dev-story)

