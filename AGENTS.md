# Eqraa Center Hub — Agent Reference

## What This Is

Quran education center management app. Next.js 16 + Supabase + TypeScript.
Arabic-first (RTL default), bilingual AR/EN via custom i18n system.

## Tech Stack

- **Framework:** Next.js 16.1 (App Router)
- **Database:** Supabase (PostgreSQL + Auth + RLS)
- **UI:** Tailwind CSS + shadcn/ui + Radix primitives
- **Forms:** React Hook Form + Zod v4
- **State:** TanStack Query for server state
- **Testing:** Vitest (unit) + Playwright (e2e)
- **i18n:** Custom system in `src/lib/i18n/` with `useLanguage()` hook

## Quality Gates

| Check         | Command                                | Blocks Commit |
|:--------------|:---------------------------------------|:--------------|
| Lint          | `pnpm run lint`                        | Yes           |
| Type-check    | `pnpm run type-check`                 | Yes           |
| Unit tests    | `pnpm run test:unit`                  | Yes           |
| i18n audit    | `node scripts/check-i18n.js --strict` | No (advisory) |
| Full build    | `pnpm run build`                      | No (CI only)  |

## Architecture Patterns

- **Views:** `src/views/` — page-level components
- **Components:** `src/components/` — reusable UI (`ui/`, `auth/`, domain-specific)
- **i18n:** `src/lib/i18n/` — domain-split translation files, assembled in `index.ts`
- **Contexts:** `src/contexts/` — React contexts (`LanguageContext`, etc.)
- **Lib:** `src/lib/` — utilities, constants, Supabase client, Zod schemas

## i18n Rules

- No hardcoded Arabic strings in JSX — use `t.*` or `tFunc()`
- Use Tailwind logical properties (`ms-/me-`, `ps-/pe-`, `start-/end-`) not physical (`ml-/mr-`)
- DB canonical values stay Arabic; only display labels get translated

## Commit Discipline

- One logical change per commit
- Conventional commit format: `type(scope): description`
- Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `style`
- All quality gates must pass before committing

## File Naming

- Components: `PascalCase.tsx`
- Utilities/lib: `camelCase.ts`
- i18n domains: `camelCase.ts` (e.g., `students.ts`, `common.ts`)
- Tests: `*.test.ts` / `*.test.tsx` colocated in `src/test/`
