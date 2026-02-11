# Migration Plan: Supabase to Dexie.js (Local Browser Storage)

## Context

The Eqraa Center Hub currently uses Supabase for both database (PostgreSQL) and authentication. The goal is to replace Supabase entirely with **Dexie.js** (IndexedDB wrapper) for local browser storage, keeping a simple local authentication system, migrating existing data, and adding export/import backup functionality.

**Why Dexie.js:** Most popular IndexedDB wrapper (~145K weekly downloads), ~29KB gzipped, excellent TypeScript support, React hooks via `dexie-react-hooks`, simple API similar to Supabase's query builder, supports schema versioning.

**Trade-offs accepted:**
- Data is browser-local only (no cross-device sync)
- Data can be lost if browser storage is cleared (mitigated by export/import feature)
- No server-side route protection (middleware becomes pass-through)

---

## Phase 1: Foundation (New Files - No Visual Changes)

### 1.1 Install Dependencies

```bash
npm install dexie dexie-react-hooks
npm install -D fake-indexeddb
npm uninstall @supabase/ssr @supabase/supabase-js
```

### 1.2 Create Dexie Database Class

**Create: `src/lib/db/database.ts`**

- Define `EqraaDatabase extends Dexie` with all 10 tables + a `users` table (for local auth)
- Use camelCase field names throughout (no more snake_case conversion needed)
- Define indexed fields for each table (id as primary key, plus foreign keys and commonly queried fields)
- Export singleton `db` instance

### 1.3 Create Database Types

**Create: `src/lib/db/types.ts`**

- All entity interfaces in camelCase
- Add `LocalUser` type for auth: `{ id, email, name, passwordHash, createdAt }`
- Add `AppRole` type: `'admin' | 'teacher' | 'student' | 'parent' | 'viewer'`

### 1.4 Create Service Layer (Data Access)

**Create: `src/lib/db/services/` directory** with one file per entity

### 1.5 Create Local Auth System

**Create: `src/lib/auth/auth-service.ts`** and **`src/lib/auth/useAuth.ts`**

### 1.6 Create Data Migration Utility

**Create: `src/lib/db/migrate-from-supabase.ts`**

### 1.7 Create Export/Import Utility

**Create: `src/lib/db/import-export.ts`**

### 1.8 Create DB Initialization Hook

**Create: `src/hooks/useDbInit.ts`**

---

## Phase 2: Auth Migration

- Simplify `middleware.ts` (pass-through)
- Update `app/(protected)/layout.tsx` (local auth)
- Update `src/views/Login.tsx` (local signIn)
- Update `src/views/Signup.tsx` (local signUp)
- Update `src/components/PageHeader.tsx` (useAuth hook)

---

## Phase 3: Data Migration (One View at a Time)

- Students, Attendance, Quran, Educational, Tajweed, Suggestions, Meetings, Admin views
- Dashboard stats hook
- Providers (DB init)
- Settings (Export/Import UI)

---

## Phase 4: Cleanup

Delete Supabase files, remove env vars, uninstall packages

---

## Phase 5: Test Migration

Update test setup, create DB helpers, rewrite integration and view tests

---

## New Files Summary

```
src/lib/db/database.ts, types.ts, seed.ts, import-export.ts, migrate-from-supabase.ts
src/lib/db/services/{students,teachers,studentNotes,attendanceRecords,quranSessions,educationalSessions,tajweedLessons,meetings,suggestions,userRoles,index}.ts
src/lib/auth/{auth-service,useAuth}.ts
src/hooks/useDbInit.ts
src/test/utils/db-helpers.ts
```
