# Localization Standard — Eqraa Center Hub

This document defines the conventions, rules, and patterns the entire project follows for internationalization (i18n). All contributors **must** read this before touching translation keys, formatted output, or directional layout.

---

## 1. Scope

- Languages supported: **Arabic (ar)** and **English (en)**.
- Default language: **Arabic (ar)**.
- Direction strategy: global toggle only — no URL locale prefixes.
- Data contracts: canonical DB values (mostly Arabic) are **never changed**; only display labels are localized.

---

## 2. Translation Key Conventions

### 2.1 Naming format

```
namespace.section.item
```

Examples:

| Key | Meaning |
|-----|---------|
| `common.save` | Generic "Save" button label |
| `students.table.name` | "Name" column header in the students table |
| `auth.login.emailLabel` | Email field label on the login page |
| `errors.notFound` | "Page not found" heading |
| `attendance.status.present` | Display label for present status |

### 2.2 Namespace map

| Namespace | Owner file(s) | Description |
|-----------|--------------|-------------|
| `common` | everywhere | Shared action verbs, generic state labels |
| `nav` | PageHeader, sidebar | Navigation link labels |
| `auth` | Login.tsx, Signup.tsx | Authentication flow strings |
| `home` | Index.tsx | Homepage stats and section labels |
| `header` | PageHeader.tsx | App shell header strings |
| `students` | Students.tsx | Student module |
| `teachers` | Teachers.tsx | Teacher module |
| `attendance` | Attendance.tsx | Attendance module |
| `exams` | Exams.tsx | Exams module |
| `settings` | Settings.tsx | Settings page |
| `errors` | not-found.tsx, error boundaries | Error and validation messages |

### 2.3 Rules

- Keys use **camelCase** at every level.
- Keys describe **purpose**, not content (e.g. `submitButton` not `clickHere`).
- Group related keys under a sub-object (e.g. `table.name`, `table.email`).
- Never duplicate a key across namespaces — use `common.*` for shared strings.
- Never commit a key with an empty-string value.

---

## 3. Interpolation

Use `{{variable}}` placeholders for dynamic content. The convention matches the project's custom `t()` helper signature:

```ts
// Key definition
students.deleteConfirm: 'هل أنت متأكد من حذف الطالب {{name}}؟'   // ar
students.deleteConfirm: 'Are you sure you want to delete {{name}}?' // en

// Usage
t('students.deleteConfirm', { name: student.name })
```

- Variable names are in **camelCase**.
- Wrap the variable in `{{ }}` with single spaces inside the braces.
- Never build sentences via string concatenation — always use placeholders.

---

## 4. Date, Number, and Time Formatting

All locale-sensitive output **must** go through the centralized helpers in `src/lib/i18n/formatters.ts` (to be created in Step 3 of the rollout):

| Helper | Usage |
|--------|-------|
| `formatDate(date, language)` | Localized date display |
| `formatNumber(n, language)` | Localized number (digits/separators) |
| `formatRelativeTime(date, language)` | "3 days ago" / "منذ 3 أيام" |

- Never scatter `new Intl.DateTimeFormat('ar-SA')` literals across view files.
- Arabic locale: `ar-SA`. English locale: `en-US`.
- Dates stored in DB are UTC ISO strings — format only at render time.

---

## 5. RTL / LTR Layout Rules

### 5.1 Direction source of truth

The active direction is driven exclusively by `LanguageContext.isRTL`. The `dir` attribute is set on `<html>` by the provider:

```ts
document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
```

### 5.2 Tailwind class strategy

Prefer **logical / direction-agnostic** Tailwind utilities over physical ones:

| Avoid (physical) | Use instead (logical) |
|------------------|-----------------------|
| `ml-4` | `ms-4` (margin-inline-start) |
| `pr-2` | `pe-2` (padding-inline-end) |
| `border-l` | `border-s` |
| `left-0` | `start-0` |
| `text-left` | `text-start` |
| `float-right` | `float-end` |

When a physical class is intentionally direction-independent (e.g., vertical spacing `mt-4`), it is allowed.

### 5.3 CSS guards

Global directional overrides belong in `app/globals.css` under the `[dir="rtl"]` and `[dir="ltr"]` selectors. Do not add directional overrides inline in component files.

### 5.4 Icons and indicators

- Use transform utilities (`rotate-180` under RTL) for directional icons (arrows, chevrons).
- Add `rtl:rotate-180` Tailwind variant, or conditionally apply classes using `isRTL`.

---

## 6. Fallback Policy

- If a translation key is missing in the active language, fall back to **English**.
- If the key is missing in English too, render the **key path** as a string (development only) or an empty string (production).
- Missing keys in development must emit a `console.warn` — this is enforced by `LanguageContext`.

---

## 7. Database Value Policy

Canonical database values (e.g., `ATTENDANCE_STATUS`, `NOTE_TYPES` in `src/lib/constants.ts`) are **Arabic strings** and must never be changed.

To display them in the active language, use the label maps:

```ts
import { ATTENDANCE_STATUS_LABELS } from '@/lib/constants';

// In a component
const label = ATTENDANCE_STATUS_LABELS[language][record.status];
```

Never pass raw DB values directly to JSX as visible text.

---

## 8. Adding a New String Checklist

1. Identify the correct namespace and choose a descriptive key name.
2. Add the key + Arabic value to the `ar` block in `src/lib/translations.ts`.
3. Add the key + English value to the `en` block.
4. Update the `Translations` interface (or the relevant namespace interface) if the key is new.
5. Use the key in the component via `t.namespace.key` or the `t()` helper.
6. Run `pnpm lint` to confirm no new hardcoded strings are flagged.

---

## 9. CI / Lint Guard (Planned)

A future lint rule will flag user-facing string literals inside `app/`, `src/views/`, and `src/components/` that are not wrapped in a translation key lookup. Until that rule lands, reviewers must manually check for hardcoded strings during code review.
