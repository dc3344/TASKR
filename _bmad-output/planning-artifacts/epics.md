---
stepsCompleted:
  - "step-01-validate-prerequisites"
  - "step-02-design-epics"
inputDocuments:
  - "docs/PRD_OpsTracker_v2.md"
  - "_bmad-output/planning-artifacts/architecture.md"
---

# TASKR - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for TASKR, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Login screen renders before any task data is shown; users select Admin/Operator role and authenticate via magic link or 6-digit PIN; successful auth navigates to role-appropriate landing view; failed auth shows error and stays on login. (PRD FR-001)
FR2: Session management supports logout, 15-minute configurable inactivity timeout resetting on interaction; on expiry or deep-link attempt while logged out, app returns to login and blocks task viewing until re-authenticated. (PRD FR-002)
FR3: Quick Capture modal enables trained user task creation in ≤ 5 seconds; required fields: title, assignee type, assignee target; optional: priority, notes; Enter submits from title; autofocus title on open; validation blocks missing required fields. (PRD FR-003)
FR4: Task status workflow uses shared status enum `New → Ongoing → Closed → Archive` consistently across board/list/my tasks; board columns reflect statuses; list shows one of four; summary strip counters reflect active filters. (PRD FR-004)
FR5: Task Board (Kanban) shows tasks grouped by status in four columns with per-column counts; task cards show title, assignee display, priority indicator, last-updated/age; if user has edit permission, UI exposes quick actions to advance status. (PRD FR-005)
FR6: List View shows tasks in tabular layout with columns (task, assignee, priority, status, age/last updated); users can sort by any column; selecting a row opens task detail. (PRD FR-006)
FR7: My Tasks view is default landing for Operators and supports Mine/Team; Mine shows tasks assigned to current user via individual assignment; Team shows tasks assigned to current user’s unit(s); if no tasks match, show empty state (not error). (PRD FR-007)
FR8: Task Detail shows title, priority, status, assignee, timestamps/age, notes; if editable, user can update status, edit role-allowed fields, and admins can delete; if read-only, show lock indicator with reason. (PRD FR-008)
FR9: Filtering supports assignee target and priority; filters persist across view switches (board/list/my tasks). (PRD FR-009)
FR10: Real-time awareness is deferred for local MVP; UI simulates “updated” indicators and timestamps within a single client session; no multi-client synchronization required. (PRD FR-010)
FR11: Seeded demo data is deterministic and in-memory/static for local demo; no database, no real-time backend sync, and no offline persistence in MVP. (PRD Scope)
FR12: Role/permission behavior is implemented as frontend capability gating: Admin can modify any task; Operator can modify only individually-assigned tasks where `assigneeType="individual"` and `assigneeId` matches current user; otherwise read-only with locked indicator. (PRD Roles/Permissions)

### NonFunctional Requirements

NFR1: Browser support targets latest two stable versions of Chrome, Edge, and Safari; Firefox best-effort for local MVP demo. (PRD NFR Web app requirements)
NFR2: SEO strategy is N/A for v1.0 (authenticated app-style UI; no public indexing). (PRD NFR Web app requirements)
NFR3: Quick capture speed: trained user creates a task in ≤ 5 seconds from modal open to successful submit. (PRD NFR-001)
NFR4: Local interaction responsiveness: on typical dev laptop, view switching, filtering, and modal open/close complete in ≤ 200ms p95 using seeded demo data. (PRD NFR-002)
NFR5: Design system fidelity: Kinetic Terminal rules consistently applied (0px radius, surface-based separation, uppercase label protocol; avoid 1px divider styling). (PRD NFR-003)
NFR6: Accessibility basics: target WCAG 2.2 AA for primary flows (login, navigation, modal, task detail); keyboard-only completion required; test manually + basic automated a11y scan. (PRD NFR-004)
NFR7: Responsiveness: usable from 360px to 1920px+ without horizontal scrolling in primary views. (PRD NFR-005)
NFR8: Security boundary (demo): unauthenticated users cannot view task UI screens; role/assignee rules control UI editability states (not production enforcement). (PRD NFR-006)

### Additional Requirements

- UI is a locally-run, frontend-only MVP intended to validate the Kinetic Terminal UI and interaction patterns using seeded demo data; no backend persistence or multi-client sync in scope. (PRD Executive Summary / Scope)
- Login supports PIN or magic link (demo-friendly), and session timeout returns to login and blocks content until re-authenticated. (PRD Journeys + FR-001/002)
- Implement data models for Task/User/Unit as described (IDs, enums, timestamps) to support deterministic demo flows. (PRD Data Model)
- Ensure permission logic and “locked” read-only indicators are visible and understandable for situational awareness. (PRD Permission Logic / Journeys)

### UX Design Requirements

TBD (no standalone UX spec found; PRD references Kinetic Terminal design system and wireframes under `artifacts/`).

### FR Coverage Map

### FR Coverage Map

FR1: Epic 1 - Authenticate and enter correct role experience
FR2: Epic 1 - Manage sessions, logout, and timeout protections
FR3: Epic 2 - Create tasks quickly with required fields + validation
FR4: Epic 3 - Use shared status vocabulary across all task views
FR5: Epic 3 - Operate the board to monitor and advance work
FR6: Epic 4 - Use list view for sorting/scanning and open task detail
FR7: Epic 5 - Operators focus on “My Tasks” with Mine/Team modes
FR8: Epic 6 - View task detail with editable vs locked read-only behavior
FR9: Epic 7 - Filter tasks consistently across all views
FR10: Epic 8 - Provide “local realism” indicators without real-time sync
FR11: Epic 8 - Seed deterministic demo data (no persistence) for realism
FR12: Epic 6 - Enforce frontend capability gating + locked indicators

## Epic List

### Epic 1: Login & Session Entry (Role-Based)
Users can authenticate (PIN or magic link), choose Admin/Operator mode, and safely enter/exit a session so task UI is never visible when logged out or expired.
**FRs covered:** FR1, FR2

### Epic 2: Fast Task Capture
Users can create a new task in seconds using a Quick Capture flow that enforces required fields and supports optional priority/notes.
**FRs covered:** FR3

### Epic 3: Operational Board Workflow (Status + Kanban)
Users can monitor and move work through a shared status workflow using a board that supports rapid scanning, counts, and quick status-advance actions when permitted.
**FRs covered:** FR4, FR5

### Epic 4: List Scanning & Sort
Users can scan tasks in a sortable list and open task detail from any row for rapid triage and retrieval.
**FRs covered:** FR6

### Epic 5: Operator “My Tasks” Focus
Operators can immediately focus on their own work (Mine) or their team/unit’s workload (Team), with clear empty states when nothing matches.
**FRs covered:** FR7

### Epic 6: Task Detail + Permission-Gated Editing
Users can view task detail consistently; edits are enabled only when permitted (Admin or individual assignee), otherwise the UI is read-only with a clear locked indicator and reason.
**FRs covered:** FR8, FR12

### Epic 7: Cross-View Filtering Consistency
Users can filter by assignee target and priority, and the same filter state persists as they move between board, list, and my-tasks views.
**FRs covered:** FR9

### Epic 8: Local MVP Realism (Seeded Data + Single-Client “Updated” Cues)
The MVP feels operationally realistic using deterministic seeded demo data and simulated “updated” indicators/timestamps within a single client session, without persistence or multi-client sync.
**FRs covered:** FR10, FR11

## Epic 1: Login & Session Entry (Role-Based)

Users can authenticate (PIN or magic link), choose Admin/Operator mode, and safely enter/exit a session so task UI is never visible when logged out or expired.

### Story 1.1: Login screen gating + role selection

As a user,
I want to reach a dedicated login screen and choose Admin or Operator mode,
So that task information is never shown before I authenticate and I enter the correct experience.

**Acceptance Criteria:**

**Given** I am not authenticated
**When** I open the application
**Then** I see the login screen without the global app shell
**And** I cannot view any task views or task detail content

**Given** I am on the login screen
**When** I select “Admin” or “Operator”
**Then** my role selection is captured for the authentication flow
**And** successful authentication routes me to the correct landing view (Admin → Board, Operator → My Tasks)

### Story 1.2: PIN authentication flow (6-digit keypad)

As a user,
I want to authenticate using a 6-digit PIN via keypad input,
So that I can quickly log in on a shared device.

**Acceptance Criteria:**

**Given** I am on the login screen with role selected
**When** I enter a 6-digit PIN and submit
**Then** I am authenticated and routed to the correct landing view

**Given** I enter an invalid PIN
**When** I submit
**Then** I see an error message
**And** I remain on the login screen

### Story 1.3: Magic-link request flow (demo)

As a user,
I want to request a magic link using an identifier,
So that I can authenticate without a password in the local demo.

**Acceptance Criteria:**

**Given** I am on the login screen with role selected
**When** I enter a valid identifier and request a magic link
**Then** the UI indicates the request succeeded (demo-friendly)
**And** I can complete login and reach the correct landing view

**Given** I enter an invalid identifier
**When** I request a magic link
**Then** I see an error message
**And** I remain on the login screen

### Story 1.4: Logout, inactivity timeout, and deep-link protection

As an authenticated user,
I want my session to expire after inactivity and be able to log out,
So that access is appropriately gated on shared devices.

**Acceptance Criteria:**

**Given** I am authenticated
**When** I choose “Log out”
**Then** my session is cleared immediately
**And** I am returned to the login screen

**Given** I am authenticated
**When** I am inactive for 15 minutes (configurable) and then interact with the app
**Then** I am returned to the login screen
**And** I cannot view tasks until I authenticate again

**Given** I am logged out or my session is expired
**When** I attempt to navigate directly to a task route
**Then** I am routed to the login screen
**And** no task content is shown

## Epic 2: Fast Task Capture

Users can create a new task in seconds using a Quick Capture flow that enforces required fields and supports optional priority/notes.

### Story 2.1: Quick Capture modal shell (open/close + autofocus)

As an authenticated user,
I want to open a Quick Capture modal that focuses me immediately on entering a task title,
So that I can capture tasks rapidly.

**Acceptance Criteria:**

**Given** I am authenticated
**When** I open Quick Capture
**Then** a modal opens
**And** the title field is autofocus focused

**Given** the Quick Capture modal is open
**When** I dismiss it (close action or escape where applicable)
**Then** the modal closes
**And** no task is created

### Story 2.2: Quick Capture required fields + validation

As an authenticated user,
I want Quick Capture to require title, assignee type, and assignee target,
So that every created task is actionable and never orphaned.

**Acceptance Criteria:**

**Given** Quick Capture is open
**When** I attempt to submit with any required field missing
**Then** submission is blocked
**And** validation feedback is shown for the missing field(s)

**Given** Quick Capture is open
**When** I enter a title, choose assignee type, and choose assignee target
**Then** I can submit successfully

### Story 2.3: Quick Capture optional fields + Enter-to-submit behavior

As an authenticated user,
I want to optionally set priority and notes, and submit quickly using Enter from the title field,
So that I can capture more context without slowing down.

**Acceptance Criteria:**

**Given** Quick Capture is open and the title field has focus
**When** I press Enter
**Then** the form submits (if required fields are valid)

**Given** I submit a task with priority and notes populated
**When** the task is created
**Then** those values are stored in local demo state and visible in task views/task detail

## Epic 3: Operational Board Workflow (Status + Kanban)

Users can monitor and move work through a shared status workflow using a board that supports rapid scanning, counts, and quick status-advance actions when permitted.

### Story 3.1: Status vocabulary and transitions

As a user,
I want tasks to use a shared status vocabulary,
So that everyone interprets progress consistently across views.

**Acceptance Criteria:**

**Given** a task exists
**When** I view its status in any view
**Then** it is one of `New`, `Ongoing`, `Closed`, `Archive`

**Given** a task is in `New`
**When** a permitted user advances status
**Then** the next status becomes `Ongoing`
**And** subsequent advances follow `Ongoing → Closed → Archive`

### Story 3.2: Board columns + per-column counts

As a user,
I want a board view grouped into status columns with counts,
So that I can see workload distribution at a glance.

**Acceptance Criteria:**

**Given** I am in Board view
**When** the board renders
**Then** I see four columns labeled `New`, `Ongoing`, `Closed`, `Archive`
**And** each column shows a count of tasks in that status

### Story 3.3: Task cards show operationally relevant fields

As a user,
I want task cards to show key details (assignee, priority, age),
So that I can triage quickly without opening each task.

**Acceptance Criteria:**

**Given** tasks exist in a board column
**When** I view a task card
**Then** it displays title, assignee display, priority indicator (if set), and last-updated/age

### Story 3.4: Permission-gated quick actions on board

As a user,
I want quick actions to advance status when I’m allowed to edit the task,
So that I can execute workflow changes quickly while preserving permission rules.

**Acceptance Criteria:**

**Given** I have edit permission on a task
**When** I view the task card on the board
**Then** I can see and use quick actions to advance status

**Given** I do not have edit permission on a task
**When** I view the task card on the board
**Then** quick status-advance actions are not available for that task

## Epic 4: List Scanning & Sort

Users can scan tasks in a sortable list and open task detail from any row for rapid triage and retrieval.

### Story 4.1: List view table layout

As a user,
I want a list view with key columns,
So that I can scan many tasks efficiently.

**Acceptance Criteria:**

**Given** I am in List view
**When** the table renders
**Then** I see columns for task, assignee, priority, status, and age/last updated

### Story 4.2: Sort by any column

As a user,
I want to sort the list by any column,
So that I can quickly find the most urgent or relevant tasks.

**Acceptance Criteria:**

**Given** I am in List view
**When** I sort by a column (e.g., priority or age)
**Then** the rows reorder accordingly
**And** the sort state is visually indicated

### Story 4.3: Open task detail from a row

As a user,
I want to open task detail from the list,
So that I can view full task information when needed.

**Acceptance Criteria:**

**Given** I am in List view with tasks shown
**When** I select a row
**Then** task detail opens for that task

## Epic 5: Operator “My Tasks” Focus

Operators can immediately focus on their own work (Mine) or their team/unit’s workload (Team), with clear empty states when nothing matches.

### Story 5.1: Operator default landing to “My Tasks”

As an operator,
I want to land on “My Tasks” after login,
So that I can immediately see my workload.

**Acceptance Criteria:**

**Given** I authenticate as Operator
**When** login succeeds
**Then** I am navigated to the My Tasks view (default landing)

### Story 5.2: Mine mode (individual assignments)

As an operator,
I want a Mine mode that shows tasks assigned to me as an individual,
So that I can focus on what I personally own.

**Acceptance Criteria:**

**Given** I am in My Tasks and select Mine
**When** tasks are displayed
**Then** only tasks where `assigneeType="individual"` and `assigneeId` matches my user id are shown

**Given** no tasks match Mine
**When** Mine is selected
**Then** an empty state is shown
**And** no error is displayed

### Story 5.3: Team mode (unit assignments)

As an operator,
I want a Team mode that shows tasks assigned to my unit(s),
So that I can maintain situational awareness of team workload.

**Acceptance Criteria:**

**Given** I am in My Tasks and select Team
**When** tasks are displayed
**Then** only tasks where `assigneeType="unit"` and `assigneeId` is one of my `unitIds` are shown

**Given** no tasks match Team
**When** Team is selected
**Then** an empty state is shown
**And** no error is displayed

## Epic 6: Task Detail + Permission-Gated Editing

Users can view task detail consistently; edits are enabled only when permitted (Admin or individual assignee), otherwise the UI is read-only with a clear locked indicator and reason.

### Story 6.1: Task detail read view (fields + timestamps/age)

As an authenticated user,
I want to view full task detail information,
So that I can understand what the task is, who owns it, and its current status.

**Acceptance Criteria:**

**Given** I open a task
**When** task detail renders
**Then** I see title, priority, status, assignee, timestamps/age, and notes

### Story 6.2: Permission gating rules (Admin vs Operator individual assignee)

As a user,
I want the UI to determine whether I can edit a task based on my role and assignment,
So that edit actions are only available when permitted.

**Acceptance Criteria:**

**Given** I am an Admin
**When** I open any task detail
**Then** the UI is editable for that task

**Given** I am an Operator
**When** I open a task where `assigneeType="individual"` and `assigneeId` matches my user id
**Then** the UI is editable for that task

**Given** I am an Operator
**When** I open a task not individually assigned to me
**Then** the task detail is read-only
**And** a locked indicator is shown explaining who can edit it

### Story 6.3: Editable task detail actions (edit fields + status update)

As a permitted editor,
I want to edit task fields and update status from task detail,
So that I can keep task information accurate.

**Acceptance Criteria:**

**Given** I have edit permission on a task
**When** I update editable fields (e.g., title, assignee, priority, notes) and save
**Then** the changes persist in local demo state
**And** the updatedAt/age indicators reflect the change

**Given** I have edit permission on a task
**When** I change the status
**Then** the new status is visible across board/list/my tasks consistently

### Story 6.4: Admin-only delete from task detail

As an Admin,
I want to delete a task from task detail,
So that I can remove incorrect or obsolete tasks in the demo.

**Acceptance Criteria:**

**Given** I am an Admin viewing task detail
**When** I choose to delete the task and confirm
**Then** the task is removed from local demo state
**And** it no longer appears in any view

**Given** I am an Operator viewing task detail
**When** I view available actions
**Then** delete is not available

## Epic 7: Cross-View Filtering Consistency

Users can filter by assignee target and priority, and the same filter state persists as they move between board, list, and my-tasks views.

### Story 7.1: Filter by assignee target

As a user,
I want to filter tasks by assignee target,
So that I can focus on a specific operator or unit.

**Acceptance Criteria:**

**Given** I am viewing tasks
**When** I set an assignee target filter
**Then** only tasks matching that assignee target are shown

### Story 7.2: Filter by priority

As a user,
I want to filter tasks by priority,
So that I can focus on the most urgent work.

**Acceptance Criteria:**

**Given** I am viewing tasks
**When** I set a priority filter
**Then** only tasks matching that priority are shown

### Story 7.3: Filters persist across view switching + counters reflect filters

As a user,
I want my active filters to persist when switching views,
So that I don’t have to re-apply context while navigating.

**Acceptance Criteria:**

**Given** I have active filters applied
**When** I switch between Board, List, and My Tasks views
**Then** the same filters remain applied

**Given** I have active filters applied
**When** I view board column counts and summary strip counters
**Then** counts reflect the filtered task set (not the unfiltered total)

## Epic 8: Local MVP Realism (Seeded Data + Single-Client “Updated” Cues)

The MVP feels operationally realistic using deterministic seeded demo data and simulated “updated” indicators/timestamps within a single client session, without persistence or multi-client sync.

### Story 8.1: Deterministic seeded demo dataset (Task/User/Unit)

As a demo facilitator,
I want a deterministic seeded dataset for tasks, users, and units,
So that every local run of the app produces a consistent experience without a database.

**Acceptance Criteria:**

**Given** the app starts
**When** seeded data is loaded
**Then** a consistent set of Users, Units, and Tasks are available in memory
**And** tasks include the required fields (id, title, assigneeType/assigneeId, status, timestamps)

**Given** I reload the app
**When** the app initializes
**Then** the same seeded dataset is shown (deterministic) and prior edits are not persisted

### Story 8.2: “Updated” cues and timestamps within a single client session

As a user,
I want to see realistic updated indicators and timestamps,
So that the UI feels live even without multi-client synchronization.

**Acceptance Criteria:**

**Given** I create or edit a task locally
**When** I return to board/list/my tasks
**Then** updatedAt/age indicators reflect the most recent local change

**Given** I am using the app in the local MVP
**When** I view tasks
**Then** any “updated” cues are simulated within the single session
**And** the UI makes no claim of multi-client real-time synchronization
