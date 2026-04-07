# Product Requirements Document: OPSTRACKER v1.0

**Platform:** Web application (PWA-installable, not a native mobile app)
**Last updated:** April 7, 2026

---

## 1. Overview

OPSTRACKER is a lightweight, centralized task board built for high-tempo operational environments (military, emergency response, crisis management) where tasks are assigned verbally and tracked informally. It replaces memory, sticky notes, and scattered messages with a single shared source of truth.

---

## 2. Problem Statement

During fast-paced operations, tasks are assigned verbally or in passing. There is no centralized system to track ownership, status, or changes. People rely on memory or scattered notes. This leads to missed tasks, lack of accountability, coordination breakdowns, and reduced mission effectiveness.

---

## 3. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | React (Vite) + Tailwind CSS | Fast builds, component reuse, utility-first styling |
| Backend / DB | Supabase (Postgres + Realtime + Auth + Row-Level Security) | Eliminates custom API; built-in real-time sync and role-based permissions |
| Offline | Service Workers (Workbox) + IndexedDB | Full read/write offline; syncs on reconnect |
| Hosting | Vercel (frontend) + Supabase (backend) | Zero-ops deployment |
| Auth | Supabase Auth (magic link or PIN-based quick login) | Fast field login without passwords |
| PWA | Web app manifest + service worker | Installable on any device without app stores |

---

## 4. User Roles

### Admin (Commander / Team Lead)
- Can create, edit, reassign, change status, and delete **any** task
- Sees all tasks across all team members
- Access to commander dashboard view with summary metrics

### Operator (Team Member)
- Can create new tasks (assigned to anyone)
- Can change status and edit **only tasks assigned to them**
- Cannot modify, reassign, or delete other people's tasks
- Read-only access to other tasks for situational awareness
- Sees a "My Tasks" focused view by default

**Permission logic:** A user can modify a task if `role === "admin"` OR `task.assignee === currentUser`. Otherwise, the task detail view is read-only with a locked indicator explaining who can edit it.

---

## 5. Core Features

### 5.1 Quick-Capture Task Creation
- Modal overlay triggered by a prominent "+ TASK" button
- **Required fields:** Task title, Assignee (dropdown of team members)
- **Optional fields:** Priority (Critical / High / Medium / Low), Notes
- Target: task created in under 5 seconds
- Auto-focus on title field when modal opens
- Enter key submits the form

### 5.2 Task Board (Kanban View)
- Four columns representing task statuses: **New → In Progress → Blocked → Complete**
- Each column shows a count of tasks
- Cards display: title, assignee avatar/initial, priority indicator (color-coded left border), and age
- One-tap status advancement button on each card (e.g., "→ In Progress") — only visible if the user has edit permission for that task
- Click card to open detail modal

### 5.3 List View
- Tabular layout with columns: Task, Assignee, Priority, Status, Age
- Sortable by any column
- Row click opens detail modal
- Compact for scanning many tasks quickly

### 5.4 My Tasks View
- Filters to show only tasks assigned to the current user
- Same board/list toggle available
- Default view for Operator role

### 5.5 Task Detail Modal
- Shows: title, priority badge, status badge, assignee, age, notes
- **If editable:** status change buttons for all four statuses, delete button
- **If read-only:** lock indicator with message ("Only admins or [assignee name] can modify this task")

### 5.6 Filters
- Filter by assignee (dropdown, "All" default)
- Filter by priority (dropdown, "All" default)
- Filters persist across view switches (board/list/my tasks)

### 5.7 Summary Strip
- Horizontal row of status counters at the top of the main content area
- Shows count for each status (New, In Progress, Blocked, Complete)
- Color-coded to match status colors
- Responds to active filters

---

## 6. Design Direction

### Aesthetic
**Industrial / utilitarian / command-center.** Dark background, monospace typography, muted palette with sharp status-color accents. This is a tool for high-pressure environments — it should feel focused, fast, and no-nonsense. Not playful, not corporate.

### Color System
| Element | Color | Hex |
|---------|-------|-----|
| Background (page) | Near-black | `#0a0c10` |
| Background (surfaces) | Dark blue-grey | `#0d1017` / `#111620` |
| Borders | Subtle grey | `#1e2530` / `#2d3748` |
| Text (primary) | Light grey | `#e5e7eb` |
| Text (secondary) | Mid grey | `#9ca3af` |
| Text (muted) | Dark grey | `#6b7280` / `#4b5563` |
| Status: New | Green | `#4ade80` / `#6bcf6b` |
| Status: In Progress | Blue | `#3b82f6` / `#60a5fa` |
| Status: Blocked | Red | `#ef4444` / `#f87171` |
| Status: Complete | Grey | `#6b7280` / `#9ca3af` |
| Priority: Critical | Red | `#ef4444` |
| Priority: High | Amber | `#f59e0b` |
| Priority: Medium | Blue | `#3b82f6` |
| Priority: Low | Grey | `#6b7280` |
| Accent (CTA) | Green | `#4ade80` |
| Admin indicator | Amber | `#f59e0b` |

### Typography
- Monospace throughout: JetBrains Mono (primary), fallbacks: SF Mono, Fira Code, Consolas
- Labels and metadata: uppercase, letterspaced, 10–11px
- Task titles: 12–15px, medium weight
- Counters/numbers: 18px bold

### Layout
- Fixed header with app name, role selector, and user selector
- Fixed toolbar with view toggle, filters, and create button
- Scrollable main content area below
- Board view: CSS grid, responsive columns (min 240px)
- List view: grid-based table rows
- Modals: centered overlay with dark backdrop

### Interaction
- Cards lift slightly on hover (translateY -1px, border highlight)
- List rows highlight background on hover
- Status advancement button on cards for quick one-click progression
- Smooth transitions on state changes (0.15s)

---

## 7. Data Model

```
Task {
  id: string (unique)
  title: string (required)
  assignee: string (required, team member name)
  status: enum ["New", "In Progress", "Blocked", "Complete"]
  priority: enum ["Critical", "High", "Medium", "Low"]
  notes: string (optional)
  created: timestamp
}

User {
  id: string (unique)
  name: string
  role: enum ["admin", "operator"]
}
```

---

## 8. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Task creation time | < 5 seconds |
| Real-time sync latency | < 2 seconds (online) |
| Offline capability | Full read/write; sync on reconnect |
| Platform | Any modern browser; PWA-installable on mobile and desktop |
| Auth | PIN or magic-link; no passwords |
| Security | Supabase RLS enforcing role permissions; encrypted in transit |
| Responsiveness | Usable from 360px (phone) to 1920px+ (desktop) |

---

## 9. Out of Scope (v1)

- Gantt charts, task dependencies, sprint planning
- File/image attachments
- In-app chat or messaging
- Resource or budget tracking
- Operation/mission grouping (v2 candidate)
- After-action report export (v2 candidate)
- Voice-to-task input (v2 candidate)
- Activity log / audit trail (v2 candidate)

---

## 10. Success Metrics

- **Task completion rate** improves vs. verbal-only baseline
- **Zero orphan tasks** — every task has a clear owner
- **Time to awareness < 60 seconds** — assignee knows about new or changed tasks within one minute
- **Team adoption** — app becomes single source of truth within 2 weeks of rollout

---

## 11. Reference Prototype

A working React prototype has been built demonstrating the board view, list view, my tasks view, quick-capture modal, task detail modal, filters, summary strip, and admin/operator role permissions. The designer should use this as a functional reference while applying polish, responsive refinements, and any additional visual detail.
