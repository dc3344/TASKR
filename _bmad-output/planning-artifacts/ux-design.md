---
stepsCompleted: [1]
inputDocuments:
  - 'docs/PRD_OpsTracker_v2.md'
  - 'artifacts/stitch_file_web_ui 2/terminal_prime/DESIGN.md'
  - 'artifacts/stitch_file_web_ui 2/login_screen/code.html'
  - 'artifacts/stitch_file_web_ui 2/task_board_grey_headers/code.html'
  - 'artifacts/stitch_file_web_ui 2/quick_capture_with_assignee_type/code.html'
  - 'artifacts/stitch_file_web_ui 2/list_view_updated_style/code.html'
  - 'artifacts/stitch_file_web_ui 2/my_tasks_grey_headers/code.html'
workflowType: 'ux design'
project_name: 'TASKR'
user_name: 'Daniel'
date: '2026-04-07T00:00:00.000Z'
---

# UX Design Specification: OPSTRACKER (Kinetic Terminal)

This UX spec synthesizes the stitched UI artifacts (HTML) and the Kinetic Terminal design system into a single source-of-truth for implementation. It is written to support the **frontend-only MVP** described in `docs/PRD_OpsTracker_v2.md`.

## 1. Product UX North Star

- **Identity**: “Software as an instrument” (high-precision HUD), not consumer SaaS.
- **Tempo**: trained users can capture or update tasks in seconds; friction is intentionally low for high-frequency actions.
- **Clarity**: extreme hierarchy (tiny labels + huge values) and aggressive status signaling.
- **Consistency**: the same task vocabulary, status model, and filters apply across Board / List / My Tasks.

## 2. Design System Summary (Implementation Constraints)

Source: `artifacts/stitch_file_web_ui 2/terminal_prime/DESIGN.md`

- **Corner treatment**: \(borderRadius = 0\) across the system.
- **No-Line Rule**: avoid 1px separators for layout sectioning; prefer surface shifts and spacing. (If accessibility requires separation, use “ghost border” at ~15% opacity.)
- **Surface tiers** (dark, milled-metal feel):
  - **Base**: `background` (#111318 / #0c0e12 in artifacts)
  - **Panels**: `surface-container-low` (#1a1c20)
  - **Cards**: `surface-container` (#1e2024)
  - **Interactive**: `surface-container-highest` (#333539)
- **Typography**:
  - Headlines/labels: **Space Grotesk**
  - Body/data: **Inter** (unless explicitly “terminal log” tone)
  - Labels are **UPPERCASE** with wide tracking.
- **Status signaling**:
  - Status and priority are encoded by **left bars / chips**, not thin borders.
  - Updated recency gets a strong “UPDATED” chip and timestamp.

## 3. Information Architecture & Navigation

### 3.1 Global app shell rules

- **Login is a shell-less screen** (no sidebar/bottom nav).
- Once authenticated, desktop uses a **TopAppBar + left sidebar**; mobile uses **bottom nav** (or simplified nav where needed).

### 3.2 Primary views (post-login)

- **Board**: Kanban by status (New / Ongoing / Closed / Archive).
- **List**: Table layout optimized for scanning and sorting.
- **My Tasks**: Operator default; segmented “Mine / Team”.
- **Quick Capture**: modal overlay reachable from multiple views.

### 3.3 Default landing by role

Per PRD:
- **Admin** → Board
- **Operator** → My Tasks (Mine)

## 4. Core Object Model (UX-level)

Task fields surfaced in UI:
- **Title** (required)
- **Assignee type**: Individual vs Unit
- **Assignee target**: operator or unit
- **Status**: New → Ongoing → Closed → Archive
- **Priority**: Critical / High / Medium / Low
- **Notes** (optional)
- **Timestamps**: created/updated + “age”

## 5. Screen Specifications

This section defines what each stitched screen is “for”, how it behaves, and what states it must cover.

### 5.1 Login (Secure Access Terminal)

Artifact: `artifacts/stitch_file_web_ui 2/login_screen/code.html`

**Primary goal**: fast role selection + authentication (PIN or magic link) without leaking task data.

- **Role selector**: Admin / Operator. Role selection influences post-login landing.
- **Magic link**:
  - Input: identifier (email-style).
  - Action: `SEND_MAGIC_LINK`.
  - MVP behavior: may be simulated; UX must still show clear success/failure messaging.
- **PIN entry**:
  - 6-digit pad; filled dots indicate progress.
  - Backspace key is destructive and visually distinct.
  - Fingerprint key is a secondary affordance (can map to “submit” in MVP).
- **Success**:
  - Establish active session and route to landing view.
- **Failure**:
  - Inline error near the active auth method.
  - Do not navigate; preserve user input where safe.

### 5.2 Board (Mission Control / Operational Grid)

Artifact: `artifacts/stitch_file_web_ui 2/task_board_grey_headers/code.html`

**Primary goal**: status-based situational awareness and fast progression of work.

- **Summary strip**: counts per status (New/Ongoing/Closed/Archive). Counts respond to active filters.
- **Columns**:
  - Fixed order: New, Ongoing, Closed, Archive.
  - Column headers include ordinal (e.g., “01 // NEW”) and count.
- **Cards**:
  - Show: priority, updated/age indicator, title, assignee, affordance to open details.
  - Use a **left status bar** (and/or chip) to encode priority.
- **Primary CTA**: `New Task` opens Quick Capture.
- **Permission gating** (MVP UX):
  - If user can edit: show quick actions (e.g., advance status).
  - If read-only: hide destructive actions; details show locked explanation.

### 5.3 List View (Task Matrix)

Artifact: `artifacts/stitch_file_web_ui 2/list_view_updated_style/code.html`

**Primary goal**: high-density scanning, sorting, and open-detail from a deterministic table.

- **Table columns**:
  - Task, Assignee, Priority, Status, Age/Last Updated.
- **Sorting**:
  - Any column can sort.
  - Sorted column shows an icon/affordance.
- **Row affordances**:
  - Whole row is clickable to open detail.
  - “Updated” chip appears inline with title.
- **Legibility rules**:
  - Zebra striping via surface tier shifts; avoid divider lines.

### 5.4 My Tasks (Mine / Team)

Artifact: `artifacts/stitch_file_web_ui 2/my_tasks_grey_headers/code.html`

**Primary goal**: operator-focused actionable list with minimal navigation overhead.

- **Segment toggle**:
  - “Mine” (default) and “Team”.
  - Toggle is prominent, thumb-style.
- **Grouped sections**:
  - New / Ongoing / Closed / Archive headings.
  - Items show: priority, title, updated/time, and a primary action (`INITIALIZE`, `COMPLETE`, etc.) when permitted.
- **Empty states**:
  - If no tasks match: show calm empty state (no error) with guidance.

### 5.5 Quick Capture (Modal)

Artifact: `artifacts/stitch_file_web_ui 2/quick_capture_with_assignee_type/code.html`

**Primary goal**: create a task in ≤ 5 seconds (trained user).

- **Presentation**:
  - Full-screen backdrop with blur (“Glass Protocol”); modal is surface-tiered with sharp edges.
- **Autofocus**: title field focused on open.
- **Required fields**:
  - Title
  - Assignee type
  - Assignee target (unit/operator)
- **Optional fields**:
  - Priority
  - Notes
- **Keyboard affordances**:
  - Enter submits when focus is in title field (after validation).
  - Escape closes (confirm if dirty in later versions; MVP can close immediately).
- **Validation**:
  - Block submission when required values missing.
  - Use high-contrast, minimal messaging near field label.

## 6. Shared Interaction Patterns

### 6.1 Status + Priority semantics

- **Status** is a workflow stage (New/Ongoing/Closed/Archive) and drives grouping.
- **Priority** is urgency (Critical/High/Medium/Low) and drives visual emphasis.
- “Updated” is a **recency hint**; it should never be confused with status.

### 6.2 Filters (cross-view persistence)

Per PRD, filters must persist across Board/List/My Tasks.

- **Assignee filter**: targets unit or individual (depending on dataset).
- **Priority filter**: multi-select or single-select (implementation decision), but must be quick to apply and visually obvious when active.
- **Counters**: summary strip responds to filters.

### 6.3 Read-only vs editable detail

Task detail must support:
- **Editable**: admins; operators editing their own individually assigned tasks.
- **Read-only**: everyone else; show a lock indicator and “who can edit” rationale.

## 7. Responsive Behavior

- **Desktop**:
  - Sidebar navigation present (Board/List/My Tasks/Quick Capture entry).
  - Board uses multi-column layout.
  - List uses wide table with horizontal scrolling allowed.
- **Mobile**:
  - Bottom nav for primary views.
  - Board becomes stacked columns (or 2-up where feasible).
  - Quick Capture remains modal, full-bleed within safe margins.

## 8. Accessibility & Usability Requirements (MVP-ready)

- **Contrast**: verify accent-on-dark meets WCAG AA where used for essential info (status labels, buttons).
- **Focus states**:
  - Avoid “boxy” focus rings; use bottom-bar + subtle glow consistent with the system.
  - Ensure keyboard focus is always visible.
- **Hit targets**: interactive controls meet minimum size for touch.
- **Reduced motion**: pulsing indicators should be subtle and suppressible with prefers-reduced-motion.

## 9. Open Questions / Implementation Notes

- **Task Detail screen**: stitched artifacts focus on list/board/capture; detail needs a concrete layout spec (editable vs locked). Implement as a modal or routed page depending on architecture decisions.
- **Filter UI**: artifacts imply filtering; choose a consistent control (command palette, top-bar filters, or per-view filter bar) and ensure persistence.
- **Auth simulation**: in MVP, login can be “fake” but UX must still demonstrate error/success states and session timeout behavior.

