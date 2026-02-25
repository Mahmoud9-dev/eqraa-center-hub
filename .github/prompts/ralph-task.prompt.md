# Ralph Loop Task Template

Use this template with `/ralph-loop` to structure autonomous tasks.

## Usage

```
/ralph-loop "$(cat .github/prompts/ralph-task.prompt.md)" --completion-promise "TASK_DONE" --max-iterations 20
```

Or inline with a specific task substituted below.

---

## Task Definition

**Objective:** [Describe the task clearly in one sentence]

**Requirements:**
1. [Requirement 1]
2. [Requirement 2]
3. [Requirement 3]

**Scope:** [Which files/directories are in scope]

**Out of scope:** [What NOT to touch]

## Verification Protocol

Every iteration MUST follow this sequence:

1. **Read context:** Read `progress.txt` and `AGENTS.md`
2. **Plan:** Identify the single next logical step from Remaining Steps
3. **Act:** Make one focused change (edit/create files)
4. **Verify:** Run quality gates:
   ```bash
   pnpm run lint --quiet && pnpm run type-check && pnpm run test:unit
   ```
5. **Update progress:** Edit `progress.txt` with what was done and what remains
6. **Commit:** If checks pass, commit with conventional format

## Constraints

- One logical change per iteration — do not bundle unrelated changes
- If a check fails, fix it in the same iteration before committing
- Follow i18n rules: no hardcoded Arabic in JSX, use logical Tailwind properties
- Follow existing patterns in the codebase — read before writing

## Escape Hatch

If stuck after 3 consecutive failed attempts on the same step:
1. Document the blocker in `progress.txt` under Blockers / Notes
2. Skip to the next step if possible
3. If no steps remain, output the completion promise with a note about unresolved blockers

## Completion

When all requirements are met and all checks pass, output:
```
<promise>TASK_DONE</promise>
```

---

## Example: i18n Extraction Task

```
/ralph-loop "
Objective: Extract all hardcoded Arabic strings from src/views/Attendance.tsx into i18n.

Requirements:
1. Add new keys to src/lib/i18n/attendance.ts (create if needed)
2. Replace hardcoded strings with t.attendance.* calls
3. All quality gates must pass
4. node scripts/check-i18n.js --strict must show no new warnings for Attendance.tsx

Scope: src/views/Attendance.tsx, src/lib/i18n/attendance.ts, src/lib/i18n/index.ts
Out of scope: All other view files

Read progress.txt first. Follow the verification protocol in .github/prompts/ralph-task.prompt.md.
" --completion-promise "TASK_DONE" --max-iterations 15
```
