---
product: OPSTRACKER
version: '1.0'
platform: Installable web application
lastUpdated: '2026-04-07'
date: '2026-04-07'
workflowType: 'prd'
workflow: 'edit'
classification:
  domain: general
  projectType: web_app
inputDocuments:
  - 'artifacts/stitch_file_web_ui 2/terminal_prime/DESIGN.md'
  - 'artifacts/stitch_file_web_ui 2/login_screen/code.html'
  - 'artifacts/stitch_file_web_ui 2/task_board_grey_headers/code.html'
  - 'artifacts/stitch_file_web_ui 2/quick_capture_with_assignee_type/code.html'
  - 'artifacts/stitch_file_web_ui 2/list_view_updated_style/code.html'
  - 'artifacts/stitch_file_web_ui 2/my_tasks_grey_headers/code.html'
stepsCompleted:
  - step-e-01-discovery
  - step-e-02-review
  - step-e-03-edit
lastEdited: '2026-04-07'
editHistory:
  - date: '2026-04-07'
    changes: 'Align MVP scope across journeys/SC/FR-010; add web_app requirements (browser/SEO/perf/a11y); tighten measurability and remove stack leakage from PRD.'
---

# Product Requirements Document: OPSTRACKER v1.0

## 1. Executive Summary

OPSTRACKER is a shared operational task board concept for high-tempo environments (military, emergency response, crisis management) where tasks are assigned verbally and tracked informally.

For **today’s activity**, OPSTRACKER is a **locally-run, frontend-only, highly polished MVP** intended to validate the **Kinetic Terminal** UI, information architecture, and interaction patterns using a **seeded demo dataset** (no database, no real-time backend sync, no offline persistence).

- **Target users**: Team leads (Admin) and team members (Operator) coordinating live operations.
- **Differentiator**: Fast task capture + clear permissions + “always-available” UX suitable for shared devices and unstable networks.

## 2. Problem Statement

During fast-paced operations, tasks are assigned verbally or in passing. There is no centralized system to track ownership, status, or changes. People rely on memory or scattered notes, leading to missed tasks, unclear accountability, coordination breakdowns, and reduced mission effectiveness.

## 3. Product Scope

### MVP (v1.0)
- Login + role-based UI mode (Admin / Operator)
- Quick Capture UI flow (submission may be non-persistent in this local MVP)
- Board view + List view + My Tasks view
- Task detail (read-only vs editable states demonstrated in UI)
- Filters (assignee, priority) and summary strip counters
- Seeded demo data (in-memory/static) suitable for a deterministic local demo

### Growth (v1.x)
- Optional notifications to meet awareness SLA (push/in-app)
- Lightweight analytics panel (counts/trends), if it supports operational decision-making
- Export (after-action summary), if it supports post-event review

### Vision (v2+)
- Mission/operation grouping
- Audit trail / activity log
- Voice-to-task input

## 4. Users, Roles, and Permissions

### Roles

#### Admin (Commander / Team Lead)
- Can create, edit, reassign, change status, and delete **any** task
- Can view all tasks across all units and operators

#### Operator (Team Member)
- Can create tasks (assigned to an individual or a team/unit)
- Can change status and edit **only tasks they are permitted to modify**
- Has read-only access to other tasks for situational awareness
- Default landing view is “My Tasks”

### Permission Logic

A user can modify a task if:
- Their role is **Admin**, OR
- The task is assigned to the current user as an **individual** (`assigneeType = "individual"` and `assigneeId` matches the current user).

Otherwise the task detail is read-only and shows a locked indicator explaining who can edit it.

**Note (local MVP):** Role and permission behavior is implemented as **frontend capability gating** to validate UX and information architecture. It is not a production security boundary in this iteration.

## 5. User Journeys

### 5.1 Operator: Start shift → log in → see my tasks
- Operator opens OPSTRACKER on a shared device.
- Operator selects role “Operator”.
- Operator authenticates via **PIN** or **magic link**.
- Operator lands on “My Tasks (Mine)” and can switch to “Team”.

### 5.2 Admin: Log in → create task → assign to unit → monitor execution
- Admin logs in and lands on Board view.
- Admin creates a task via Quick Capture in < 5 seconds.
- Admin assigns task to an individual or a tactical unit.
- Admin monitors status changes and can reassign if needed (local single-client MVP; no multi-client real-time sync).

### 5.3 Operator: Update assigned task
- Operator opens a task they own.
- Operator advances status and updates notes.
- UI reflects the updated status and timestamps in the local MVP (no multi-client synchronization).

### 5.4 Operator: Attempt to edit someone else’s task
- Operator opens a task assigned to another operator.
- Task is read-only with a lock message indicating who can edit.

### 5.5 Supporting flows (MVP)
- **Session timeout**: After inactivity timeout, user is returned to Login and cannot view tasks until re-authenticated. (FR-002)
- **List view usage**: User switches to List view, sorts by a column, and opens Task Detail from a row. (FR-006)
- **Filtering**: User filters tasks by assignee and priority and sees the same filters applied across Board/List/My Tasks views. (FR-009)

## 6. Functional Requirements (FR)

### FR-001 Login Screen
- Users can access a dedicated login screen before any task data is shown.
- Users can select a role: Admin or Operator.
- Users can authenticate using either:
  - **Magic link**: user enters an identifier (email-style) and requests a link, or
  - **PIN**: user enters a 6-digit PIN via keypad input.

**Acceptance criteria**
- Login screen renders without the global app shell (no sidebar/bottom nav).
- Successful authentication results in an active session and navigation to the correct landing view:
  - Admin → Board view
  - Operator → My Tasks view
- If authentication fails, user sees an error message and remains on the login screen.

### FR-002 Session Management
- Users can log out.
- Default inactivity timeout is **15 minutes** (configurable for demo).
- Inactivity timer resets on user interaction (navigation, clicks, form input).
- On session expiry, the app returns to the login screen and prevents task viewing/editing until re-authenticated.

**Acceptance criteria**
- After **15 minutes** of inactivity, user is returned to Login on next interaction.
- Deep-linking directly to any task route while logged out or expired returns to Login.
- Logging out clears the active session and returns to Login immediately.

### FR-003 Quick-Capture Task Creation (≤ 5 seconds)
- Users can access a Quick Capture modal optimized for ≤ 5 second entry for a trained user.
- Required UI fields: title, assignee type, assignee target.
- Optional UI fields: priority, notes.
- Enter submits when focus is in the title field.
- Title input autofocuses on modal open.

**Acceptance criteria**
- A task can be entered and submitted from modal open in ≤ 5 seconds for a trained user (local MVP uses seeded/demo state).
- Validation blocks submission if required fields are missing.

### FR-004 Task Status Workflow (Shared Vocabulary)

Tasks use the following status enum (consistent across board/list/my tasks):

`New → Ongoing → Closed → Archive`

**Acceptance criteria**
- Board columns reflect these four statuses.
- List view displays status as one of the four values.
- Status counters in the summary strip reflect active filters.

### FR-005 Task Board (Kanban)
- Users can view tasks grouped by status in four columns.
- Each column shows a count of tasks in that status.
- Task cards show: title, assignee display, priority indicator, and last-updated/age.
- If user has edit permission, the UI exposes quick actions to advance status.

### FR-006 List View
- Users can view tasks in a tabular layout.
- Columns: task, assignee, priority, status, age/last updated.
- Users can sort by any column.
- Selecting a row opens task detail.

### FR-007 My Tasks View (Mine/Team)
- Operators have a “My Tasks” view as default landing.
- My Tasks supports:
  - “Mine”: tasks assigned to the current user (individual assignments)
  - “Team”: tasks assigned to the operator’s unit(s)

**Acceptance criteria**
- **Mine** shows tasks where `assigneeType = "individual"` and `assigneeId` matches the current user.
- **Team** shows tasks where `assigneeType = "unit"` and `assigneeId` is one of the current user’s `unitIds`.
- If no tasks match, the view shows an empty state (no error).

### FR-008 Task Detail (Editable vs Read-Only)
- Task detail shows: title, priority, status, assignee, timestamps/age, notes.
- If editable: user can update status, edit fields allowed by role, and delete (admins only).
- If read-only: user sees a lock indicator with a reason.

### FR-009 Filtering
- Users can filter by assignee target and by priority.
- Filters persist across view switches (board/list/my tasks).

### FR-010 Real-time Awareness
- Deferred for today’s local MVP (no backend sync). UI simulates “updated” indicators and timestamps for realism within a single client session; no multi-client synchronization is required.

## 7. Data Model

```
Task {
  id: string (unique)
  title: string (required)
  assigneeType: enum ["individual", "unit"] (required)
  assigneeId: string (required; user id or unit id)
  status: enum ["New", "Ongoing", "Closed", "Archive"] (required)
  priority: enum ["Critical", "High", "Medium", "Low"] (optional; default "Medium")
  notes: string (optional)
  createdAt: timestamp
  updatedAt: timestamp
}

User {
  id: string (unique)
  name: string
  role: enum ["admin", "operator"]
  unitIds: string[] (optional)
}

Unit {
  id: string (unique)
  name: string
}
```

## 8. Non-Functional Requirements (NFR)

### Web app requirements (project type)

- **Browser support (browser matrix)**: Latest two stable versions of Chrome, Edge, and Safari. Firefox is best-effort for the local MVP demo.
- **SEO strategy**: N/A for v1.0 (authenticated, app-style UI; no public indexing).

| ID | Requirement | Target / Test Criteria |
|---|---|---|
| NFR-001 | Quick capture speed | Trained user creates a task in ≤ 5 seconds (time from modal open to successful submit) |
| NFR-002 | Local interaction responsiveness | On a typical dev laptop, view switching, filtering, and modal open/close complete in ≤ 200ms for p95 (measured with browser performance markers) using seeded demo data. |
| NFR-003 | Design system fidelity | Kinetic Terminal rules are consistently applied (0px radius, surface-based separation, uppercase label protocol; avoid 1px divider styling) |
| NFR-004 | Accessibility basics | Target WCAG 2.2 AA for primary flows (login, navigation, modal, task detail). Keyboard-only completion for those flows is required (tested manually + basic automated a11y scan). |
| NFR-005 | Responsiveness | Usable from 360px wide to 1920px+ without horizontal scrolling in primary views |
| NFR-006 | Security boundary (demo) | Unauthenticated users cannot view task UI screens; role/assignee rules control UI editability states (not a production enforcement boundary in this MVP) |

## 9. Design & UX Direction (Reference)

- **Primary reference**: “Kinetic Terminal” design system in `artifacts/stitch_file_web_ui 2/terminal_prime/DESIGN.md`
- **Wireframes**: listed in this document frontmatter (`inputDocuments`)

Design intent:
- Industrial, mission-control aesthetic optimized for rapid scanning and confident action
- High-contrast hierarchy; labels in uppercase; monolithic surfaces; no “SaaS template” feel

## 10. Out of Scope (v1.0)

- Gantt charts, task dependencies, sprint planning
- File/image attachments
- In-app chat/messaging
- Resource/budget tracking
- Mission grouping (candidate for v2)
- After-action report export (candidate for Growth)
- Voice-to-task input (candidate for v2)
- Full audit trail / activity log (candidate for v2)

## 11. Success Criteria (SMART)

- **SC-001 Orphan tasks**: 100% of tasks have an assignee target at creation time (validated by create-task form; no null assignees).
- **SC-004 Capture speed**: Median “Quick Capture” creation time ≤ 5 seconds after first week of use (measured by UI timing).

### Growth success criteria (v1.x)

- **SC-002 Awareness SLA**: For online clients, 95% of task changes propagate to other clients within ≤ 2 seconds (measured by client telemetry timestamps).
- **SC-003 Adoption**: Within 14 days of rollout to a team, ≥ 80% of active operators log in at least 3 times per week and ≥ 70% of daily tasks are created in OPSTRACKER (measured by usage events).

## 12. Implementation Notes (Non-Binding)

This section is informational only; it must not be treated as a requirement contract.

- Candidate stack and deployment approach are tracked in the Architecture document; this PRD is intentionally technology-agnostic.
