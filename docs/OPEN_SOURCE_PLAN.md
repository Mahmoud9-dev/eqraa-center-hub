# Plan: Fork Eqraa Center Hub as Open Source Project

## Goal
Transform the private "Eqraa Center Hub" (previously branded as "معهد فاطمة الزهراء") into a generic, open-source Islamic education management system called **"إقراء | Eqraa"** with MIT license and full documentation.

**Status**: ✅ Phase 1 (Core Branding Updates) completed - all references updated to "إقراء | Eqraa"

---

## Phase 1: Core Branding Updates

### 1.1 Application Files to Modify

| File | Line(s) | Change |
|------|---------|--------|
| `app/layout.tsx` | 13-14 | Update metadata: title → "إقراء - نظام إدارة المراكز القرآنية" |
| `src/views/Login.tsx` | 53 | Replace "معهد فاطمة الزهراء" → "إقراء" |
| `src/views/Index.tsx` | 158, 164, 227 | Replace all institute references with "إقراء" |
| `src/components/auth/LoginLeftPanel.tsx` | 22, 36 | Update branding and tagline |

### 1.2 Test Files to Update

| File | Lines | Change |
|------|-------|--------|
| `src/test/e2e/homepage.spec.ts` | 7, 25-27, 42-43, 149-150, 173, 193, 206 | Update text assertions for new branding |

---

## Phase 2: Create Open Source Infrastructure

### 2.1 New Files to Create

```
LICENSE                    # MIT License
CONTRIBUTING.md            # Contribution guidelines (Arabic + English)
CODE_OF_CONDUCT.md         # Community standards (Arabic + English)
CHANGELOG.md               # Version history, start at v1.0.0
SECURITY.md                # Security policy & vulnerability reporting
docs/SETUP.md              # Database setup guide for Supabase
docs/DEPLOYMENT.md         # Deployment instructions (Netlify, Vercel, self-host)
docs/CONFIGURATION.md      # Environment variables & customization
supabase/seed.sql          # Demo data for quick start
```

### 2.2 Files to Rewrite

| File | Action |
|------|--------|
| `README.md` | Complete rewrite - bilingual (Arabic/English), badges, quick start |
| `PROJECT_FEATURES.md` | Remove specific institute references |
| `package.json` | Update name, description, license, repository, keywords |

---

## Phase 3: Documentation Content

### README.md Structure
```markdown
# إقراء - نظام إدارة المراكز القرآنية
# Eqraa - Quranic Center Management System

[Badges: MIT License, Build Status]

## Features / المميزات
- 16 functional modules
- Role-based access (admin, teacher, student, parent, viewer)
- Full Arabic RTL support

## Quick Start / البداية السريعة
1. Clone → 2. Configure .env → 3. Setup Supabase → 4. Run

## Tech Stack
Next.js 16 + React 19 + Supabase + Tailwind + shadcn/ui

## License
MIT - Free for all Islamic centers worldwide
```

### docs/SETUP.md Key Sections
- Create Supabase project
- Configure environment variables
- Run migrations (4 files in order)
- Optional: Run seed.sql for demo data

---

## Phase 4: Sample Data

Create `supabase/seed.sql` with:
- 3 sample teachers (Quran, Tajweed, Tarbawi departments)
- 3 sample students with progress data
- 1 sample meeting
- 1 sample suggestion

---

## Phase 5: Update package.json

```json
{
  "name": "eqraa",
  "version": "1.0.0",
  "description": "Open-source Quranic center management system",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/[USERNAME]/eqraa"
  },
  "keywords": ["quran", "islamic-education", "arabic", "rtl", "lms"]
}
```

---

## Phase 6: Verification

```bash
# Verify no old branding remains
grep -r "فاطمة الزهراء" src/ app/ --include="*.tsx"

# Build check
npm run build && npm run type-check

# Run tests
npm run test:unit && npm run test:e2e
```

---

## Implementation Order

### Step 1: Branding (P0)
1. [ ] `app/layout.tsx` - Update metadata
2. [ ] `src/views/Index.tsx` - Update 3 locations
3. [ ] `src/views/Login.tsx` - Update mobile header
4. [ ] `src/components/auth/LoginLeftPanel.tsx` - Update login panel

### Step 2: Legal Files (P0)
5. [ ] Create `LICENSE` (MIT)
6. [ ] Create `CODE_OF_CONDUCT.md`
7. [ ] Create `CONTRIBUTING.md`
8. [ ] Create `SECURITY.md`

### Step 3: Documentation (P1)
9. [ ] Rewrite `README.md`
10. [ ] Create `docs/SETUP.md`
11. [ ] Create `docs/DEPLOYMENT.md`
12. [ ] Create `docs/CONFIGURATION.md`
13. [ ] Create `CHANGELOG.md`
14. [ ] Update `PROJECT_FEATURES.md`

### Step 4: Database & Package (P1)
15. [ ] Create `supabase/seed.sql`
16. [ ] Update `package.json` metadata

### Step 5: Tests & Verification (P1)
17. [ ] Update `src/test/e2e/homepage.spec.ts`
18. [ ] Run verification grep
19. [ ] Run build and tests

---

## Critical Files Summary

**Must Modify:**
- `app/layout.tsx`
- `src/views/Index.tsx`
- `src/views/Login.tsx`
- `src/components/auth/LoginLeftPanel.tsx`
- `README.md`
- `package.json`
- `src/test/e2e/homepage.spec.ts`

**Must Create:**
- `LICENSE`
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `CHANGELOG.md`
- `SECURITY.md`
- `docs/SETUP.md`
- `docs/DEPLOYMENT.md`
- `docs/CONFIGURATION.md`
- `supabase/seed.sql`

---

## Out of Scope (Future Work)
- TypeScript strict mode enablement
- Replacing 50+ `any` types
- Migrating localStorage to Supabase
- Multi-language support beyond Arabic

---

## Expected Outcome
A fully open-source, MIT-licensed Islamic education management system that any mosque, Islamic center, or Quran school can deploy for free.
