# Deferred Work

This file tracks issues deferred during code reviews or implementation.

## Deferred from: code review of 1-1-login-screen-gating-role-selection (2026-04-07)

- Magic link not implemented — PRD FR-001 specifies both PIN and magic link; only PIN present — magic link deliberately scoped to Story 1.3 per epic breakdown; Story 1.1 validates PIN flow only
- README references wrong path — Points to `app/page.tsx` instead of `src/app/page.tsx` in README.md — minor onboarding friction
- Missing trailing newlines — Multiple SVG and text files lack trailing newlines — cosmetic diff noise
- Unused constants in constants.ts — STATUS_LABELS and TIMEOUT_MS not used in Story 1.1 (src/lib/constants.ts:3-8) — architecture prep for future stories
- .gitignore excludes next-env.d.ts — Non-obvious choice lacks documentation (.gitignore:46) — common Next.js practice
- AGENTS.md fragile node_modules path — Hard-codes `node_modules/next/dist/docs/` path with no fallback (AGENTS.md:4) — minor doc helper issue
- App shell minimal vs full sidebar/nav — AC1 mentions "global app shell" but current stub only has thin header (src/app/(app)/layout.tsx) — acceptable for Story 1.1, full navigation in future epics
