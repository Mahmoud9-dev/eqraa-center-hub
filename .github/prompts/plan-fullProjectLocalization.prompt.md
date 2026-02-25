## Plan: Project-wide EN/AR Localization Rollout (DRAFT)

This plan scales your existing homepage localization to the full app using your chosen constraints: global toggle (no locale URLs), current custom i18n stack, DB values unchanged (labels translated only), and full RTL/LTR support now. The approach is to first harden the i18n foundation, then localize shared shell/components, then sweep feature modules in priority order, and finally enforce bidirectional layout and test coverage. It avoids disruptive routing changes while ensuring language and direction switch consistently across all pages and components.

**Steps**
1. Baseline and governance
   - Define translation key conventions and namespace map in [src/lib/translations.ts](src/lib/translations.ts) (for example: common, nav, auth, students, teachers, attendance, exams, settings, errors).
   - Add a short localization standard in [docs](docs) (key naming, interpolation, date/number rules, RTL class rules).
   - Confirm business constants stay canonical in [src/lib/constants.ts](src/lib/constants.ts), with UI label maps per language.

2. Strengthen core i18n runtime
   - Expand provider API in [src/contexts/LanguageContext.tsx](src/contexts/LanguageContext.tsx) to expose stable translation lookup, fallback behavior, and language metadata.
   - Keep provider wiring centralized in [src/components/providers.tsx](src/components/providers.tsx).
   - Ensure first paint uses persisted language + direction safely in [app/layout.tsx](app/layout.tsx) (server default + client sync without flicker).

3. Restructure translation assets for scale
   - Split monolithic messages from [src/lib/translations.ts](src/lib/translations.ts) into per-domain dictionaries (same folder or [src/lib/i18n](src/lib/i18n)), then re-export one typed index.
   - Add shared message primitives (common actions, validation, empty states, status labels) to reduce duplication.
   - Introduce interpolation placeholders for dynamic strings (counts, names, dates) and enforce fallback to English/Arabic defaults.

4. Build extraction workflow for hardcoded strings
   - Perform a string audit of [src/views](src/views), [src/components](src/components), [app](app) and replace literals with translation keys.
   - Start with highest-impact files: [src/views/Login.tsx](src/views/Login.tsx), [src/views/Signup.tsx](src/views/Signup.tsx), [src/views/Students.tsx](src/views/Students.tsx), [src/views/Teachers.tsx](src/views/Teachers.tsx), [src/views/Attendance.tsx](src/views/Attendance.tsx), [src/views/Exams.tsx](src/views/Exams.tsx), [src/views/Settings.tsx](src/views/Settings.tsx), [src/views/Announcements.tsx](src/views/Announcements.tsx), [app/not-found.tsx](app/not-found.tsx).
   - Add a lightweight CI/lint check to flag newly introduced user-facing hardcoded strings in app/view/component layers.

5. Standardize locale-aware formatting
   - Centralize date/number/time formatting helpers and use active language in all format calls.
   - Replace direct locale literals (ar-SA/en-US scattered usage) in views such as [src/views/Index.tsx](src/views/Index.tsx), [src/views/Announcements.tsx](src/views/Announcements.tsx), [src/views/QuranCircles.tsx](src/views/QuranCircles.tsx), [src/views/Settings.tsx](src/views/Settings.tsx).
   - Keep persisted enum/status values unchanged; map them to localized display labels at render-time.

6. Enforce full RTL/LTR compatibility
   - Audit directional classes and replace physical direction utilities with direction-safe patterns across components and views.
   - Prioritize known risky files: [src/components/auth/PasswordInput.tsx](src/components/auth/PasswordInput.tsx), [src/components/ui/toast.tsx](src/components/ui/toast.tsx), [src/views/Login.tsx](src/views/Login.tsx), plus all table/list-heavy modules.
   - Add global direction guards in [app/globals.css](app/globals.css) and align Tailwind strategy in [tailwind.config.ts](tailwind.config.ts) for consistent bidirectional behavior.

7. Guarantee consistent language switching everywhere
   - Ensure all page entry points under [app/(protected)](app/(protected)) and [app/(auth)](app/(auth)) rely on provider state and do not keep local language copies.
   - Verify shared shell controls in [src/components/language-toggle.tsx](src/components/language-toggle.tsx) and [src/components/PageHeader.tsx](src/components/PageHeader.tsx) trigger immediate re-render across mounted trees.
   - Validate persisted selection behavior on refresh, login/logout flows, and protected route transitions.

8. Testing and regression hardening
   - Update E2E assertions to support both languages and both directions, starting with [src/test/e2e/homepage.spec.ts](src/test/e2e/homepage.spec.ts).
   - Add component tests for translation key rendering and direction-based layout behavior in critical UI primitives.
   - Add smoke tests per priority module (auth, students, teachers, attendance, exams, settings) for language toggle persistence.

9. Documentation and rollout checkpoints
   - Refresh outdated references in [docs/HOMEPAGE.md](docs/HOMEPAGE.md), [PROJECT_FEATURES.md](PROJECT_FEATURES.md), and README-level localization notes.
   - Roll out in phases with acceptance gates: Foundation complete → Shell/auth complete → Priority modules complete → Full module sweep complete.

**Verification**
- Functional checks
  - Toggle language once and confirm persistence across refresh/navigation for auth + protected pages.
  - Validate dir switch affects layout, spacing, alignment, icon placement, and form controls in both EN/LTR and AR/RTL.
  - Confirm all user-visible text in target modules resolves from translation keys (no hardcoded literals left).
- Automated checks
  - Run unit and E2E suites with language scenarios enabled.
  - Run lint/static checks including hardcoded-string guard and missing-key detection.
- Manual sign-off checklist
  - App shell, auth, navigation, toasts, tables, empty states, validation errors, and not-found view verified in both languages.

**Decisions**
- Locale strategy: global toggle only (no URL locale prefixes).
- i18n architecture: keep custom context and expand it.
- Data contracts: do not change persisted Arabic/business values; localize display labels only.
- Direction support: implement full bidirectional behavior now.

If you want, I can now provide this as an execution backlog (phase-by-phase task list with estimated effort and owner split) so implementation can start immediately.

## Execution Backlog (Implementation-Ready)

### Phase 0 — Kickoff (0.5 day)
- [ ] Create branch and align team on key format (`namespace.section.item`) and ownership.
- [ ] Freeze UI text changes during extraction window to reduce merge conflicts.
- [ ] Add tracking sheet with columns: file, status, keys added, RTL checked, QA done.

**Definition of Done**
- Shared conventions approved.
- File ownership map published.

---

### Phase 1 — Foundation Hardening (1 day)

#### 1.1 Strengthen i18n core
- [ ] Update [src/contexts/LanguageContext.tsx](src/contexts/LanguageContext.tsx): stable `t()` API, fallback behavior, typed language metadata.
- [ ] Keep provider mounting in [src/components/providers.tsx](src/components/providers.tsx).
- [ ] Ensure first-paint language/dir sync in [app/layout.tsx](app/layout.tsx) remains flicker-safe.

#### 1.2 Translation architecture
- [ ] Split dictionaries by domain under `src/lib/i18n/*` (or keep in [src/lib/translations.ts](src/lib/translations.ts) with namespaced objects).
- [ ] Add shared keys (`common.*`, `validation.*`, `status.*`, `errors.*`).
- [ ] Add missing-key fallback logging (dev only).

#### 1.3 Locale formatting helpers
- [ ] Add centralized helpers (`formatDate`, `formatNumber`, `formatRelativeTime`) with active language.
- [ ] Replace direct locale literals in priority files.

**Definition of Done**
- `t()` and format helpers are available and used by at least one auth page and one protected page.
- No hydration mismatch introduced by language/dir initialization.

---

### Phase 2 — App Shell + Auth (1.5–2 days)

#### 2.1 Global shell localization
- [ ] Localize [app/not-found.tsx](app/not-found.tsx), header actions, and shared labels.
- [ ] Confirm [src/components/language-toggle.tsx](src/components/language-toggle.tsx) updates the entire tree consistently.

#### 2.2 Auth flows
- [ ] Localize [src/views/Login.tsx](src/views/Login.tsx) and [src/views/Signup.tsx](src/views/Signup.tsx).
- [ ] Localize auth components in [src/components/auth](src/components/auth).

#### 2.3 RTL/LTR corrections (auth + shell)
- [ ] Replace directional utility usage (`left/right`, `ml/mr`, `pl/pr`) with direction-safe patterns.
- [ ] Validate focus order, icon position, and form alignment in both directions.

**Definition of Done**
- Auth and shell render correctly in EN/LTR and AR/RTL.
- Toggle persists across refresh and auth route transitions.

---

### Phase 3 — Priority Feature Modules (2–3 days)

#### 3.1 Module sweep order
1. [src/views/Students.tsx](src/views/Students.tsx)
2. [src/views/Teachers.tsx](src/views/Teachers.tsx)
3. [src/views/Attendance.tsx](src/views/Attendance.tsx)
4. [src/views/Exams.tsx](src/views/Exams.tsx)
5. [src/views/Settings.tsx](src/views/Settings.tsx)
6. [src/views/Announcements.tsx](src/views/Announcements.tsx)

#### 3.2 For each module (repeatable checklist)
- [ ] Replace all user-visible literals with keys.
- [ ] Move repeated labels to `common.*` or `status.*`.
- [ ] Keep persisted values canonical; map to localized labels at render time.
- [ ] Migrate date/number rendering to shared helpers.
- [ ] Run EN/LTR + AR/RTL UI pass for spacing/alignment/tables/forms.

**Definition of Done**
- No visible hardcoded strings in listed modules.
- No RTL/LTR visual regressions in core workflows.

---

### Phase 4 — Full RTL/LTR Compliance Sweep (1–2 days)
- [ ] Audit [src/components](src/components) + [src/views](src/views) for physical direction classes.
- [ ] Apply direction-safe class strategy globally via [app/globals.css](app/globals.css) and [tailwind.config.ts](tailwind.config.ts).
- [ ] Verify overlays/toasts/dialogs/menus in both directions.

**Definition of Done**
- Direction toggle does not break layout or interaction patterns in shared UI primitives.

---

### Phase 5 — Testing + Documentation (1 day)

#### 5.1 Automated coverage
- [ ] Update [src/test/e2e/homepage.spec.ts](src/test/e2e/homepage.spec.ts) to bilingual + bidirectional checks.
- [ ] Add component tests for translation rendering and direction behavior for critical primitives.
- [ ] Add guard for missing translation keys and newly introduced hardcoded literals.

#### 5.2 Documentation updates
- [ ] Update [docs/HOMEPAGE.md](docs/HOMEPAGE.md), [PROJECT_FEATURES.md](PROJECT_FEATURES.md), and README localization section.
- [ ] Document key naming rules and contribution process for new strings.

**Definition of Done**
- Test suite passes with language switching scenarios.
- Docs reflect current architecture and workflow.

---

## Suggested Work Split (if multiple developers)
- Dev A: i18n core + formatting helpers + shell.
- Dev B: auth + students/teachers.
- Dev C: attendance/exams/settings/announcements + RTL cleanup.
- QA: bilingual regression matrix and direction-specific visual checks.

## Release Gates
1. Gate A (after Phase 1): core foundation verified on one auth + one protected route.
2. Gate B (after Phase 2): auth + shell fully bilingual and bidirectional.
3. Gate C (after Phase 3): top modules localized with no hardcoded strings.
4. Gate D (after Phase 5): tests/docs complete and ready for merge.

## Risk Controls
- Keep rollout incremental (module-by-module) to simplify review and rollback.
- Avoid DB value changes; use label maps only.
- Enforce translation keys in PR review checklist.
- Add screenshots for EN/LTR and AR/RTL in each module PR.

## First 48 Hours (Practical Start)
- Day 1 AM: Phase 0 + Phase 1.1
- Day 1 PM: Phase 1.2 + 1.3 + smoke verify
- Day 2 AM: Phase 2 shell + auth localization
- Day 2 PM: Phase 2 RTL fixes + Gate B verification
