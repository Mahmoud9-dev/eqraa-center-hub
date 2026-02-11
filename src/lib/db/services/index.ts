/**
 * Barrel export for all Dexie.js database service modules.
 * Each module provides async functions for CRUD operations on a specific table.
 *
 * Usage:
 *   import * as studentsService from '@/lib/db/services/students';
 *   const allStudents = await studentsService.getAll();
 *
 * Or import the entire namespace:
 *   import * as services from '@/lib/db/services';
 *   const allStudents = await services.studentsService.getAll();
 */

export * as studentsService from './students';
export * as teachersService from './teachers';
export * as studentNotesService from './studentNotes';
export * as attendanceRecordsService from './attendanceRecords';
export * as quranSessionsService from './quranSessions';
export * as educationalSessionsService from './educationalSessions';
export * as tajweedLessonsService from './tajweedLessons';
export * as meetingsService from './meetings';
export * as suggestionsService from './suggestions';
export * as userRolesService from './userRoles';
