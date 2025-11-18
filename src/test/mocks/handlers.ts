import { http, HttpResponse } from "msw";
import {
  mockTeachers,
  mockStudents,
  mockQuranSessions,
  mockTajweedLessons,
  mockEducationalContent,
  mockMeetings,
  mockExams,
  mockSubjects,
  mockAnnouncements,
  mockSuggestions,
} from "./data";

// Base URL for Supabase
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://mock-supabase-url.supabase.co";

// Authentication handlers
export const authHandlers = [
  http.post(`${SUPABASE_URL}/auth/v1/token`, async ({ request }) => {
    const url = new URL(request.url);
    const grantType = url.searchParams.get("grant_type");
    const { email, password } = (await request.json()) as any;

    if (
      grantType === "password" &&
      email === "admin@eqraa.com" &&
      password === "password123"
    ) {
      return HttpResponse.json({
        access_token: "mock-access-token",
        refresh_token: "mock-refresh-token",
        user: {
          id: "admin-user-id",
          email: "admin@eqraa.com",
          role: "admin",
          user_metadata: { role: "admin" },
        },
      });
    }

    return new HttpResponse(null, { status: 401 });
  }),

  http.get(`${SUPABASE_URL}/auth/v1/user`, () => {
    return HttpResponse.json({
      id: "admin-user-id",
      email: "admin@eqraa.com",
      role: "admin",
      user_metadata: { role: "admin" },
    });
  }),

  http.post(`${SUPABASE_URL}/auth/v1/logout`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
];

// Teachers handlers
export const teachersHandlers = [
  http.get(`${SUPABASE_URL}/rest/v1/teachers`, () => {
    return HttpResponse.json(mockTeachers);
  }),

  http.post(`${SUPABASE_URL}/rest/v1/teachers`, async ({ request }) => {
    const newTeacher = (await request.json()) as any;
    const teacherWithId = {
      ...newTeacher,
      id: `teacher-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    return HttpResponse.json(teacherWithId, { status: 201 });
  }),

  http.patch(`${SUPABASE_URL}/rest/v1/teachers`, async ({ request }) => {
    const url = new URL(request.url);
    const idParam = url.searchParams.get("id");
    const updates = (await request.json()) as any;

    if (idParam && idParam.startsWith("eq.")) {
      const teacherId = idParam.replace("eq.", "");
      const updatedTeacher = { ...mockTeachers[0], ...updates, id: teacherId };
      return HttpResponse.json(updatedTeacher);
    }

    return new HttpResponse(null, { status: 400 });
  }),

  http.delete(`${SUPABASE_URL}/rest/v1/teachers`, ({ request }) => {
    const url = new URL(request.url);
    const idParam = url.searchParams.get("id");

    if (idParam && idParam.startsWith("eq.")) {
      return new HttpResponse(null, { status: 204 });
    }

    return new HttpResponse(null, { status: 400 });
  }),
];

// Students handlers
export const studentsHandlers = [
  http.get(`${SUPABASE_URL}/rest/v1/students`, () => {
    return HttpResponse.json(mockStudents);
  }),

  http.post(`${SUPABASE_URL}/rest/v1/students`, async ({ request }) => {
    const newStudent = (await request.json()) as any;
    const studentWithId = {
      ...newStudent,
      id: `student-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    return HttpResponse.json(studentWithId, { status: 201 });
  }),

  http.patch(`${SUPABASE_URL}/rest/v1/students`, async ({ request }) => {
    const url = new URL(request.url);
    const idParam = url.searchParams.get("id");
    const updates = (await request.json()) as any;

    if (idParam && idParam.startsWith("eq.")) {
      const studentId = idParam.replace("eq.", "");
      const updatedStudent = { ...mockStudents[0], ...updates, id: studentId };
      return HttpResponse.json(updatedStudent);
    }

    return new HttpResponse(null, { status: 400 });
  }),
];

// Quran Sessions handlers
export const quranSessionsHandlers = [
  http.get(`${SUPABASE_URL}/rest/v1/quran_sessions`, () => {
    return HttpResponse.json(mockQuranSessions);
  }),

  http.post(`${SUPABASE_URL}/rest/v1/quran_sessions`, async ({ request }) => {
    const newSession = (await request.json()) as any;
    const sessionWithId = {
      ...newSession,
      id: `session-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    return HttpResponse.json(sessionWithId, { status: 201 });
  }),
];

// Educational Content handlers
export const educationalHandlers = [
  http.get(`${SUPABASE_URL}/rest/v1/educational_content`, () => {
    return HttpResponse.json(mockEducationalContent);
  }),

  http.post(
    `${SUPABASE_URL}/rest/v1/educational_content`,
    async ({ request }) => {
      const newContent = (await request.json()) as any;
      const contentWithId = {
        ...newContent,
        id: `content-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      return HttpResponse.json(contentWithId, { status: 201 });
    }
  ),
];

// Announcements handlers
export const announcementsHandlers = [
  http.get(`${SUPABASE_URL}/rest/v1/announcements`, () => {
    return HttpResponse.json(mockAnnouncements);
  }),

  http.post(`${SUPABASE_URL}/rest/v1/announcements`, async ({ request }) => {
    const newAnnouncement = (await request.json()) as any;
    const announcementWithId = {
      ...newAnnouncement,
      id: `announcement-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    return HttpResponse.json(announcementWithId, { status: 201 });
  }),
];

// Error handlers for testing error scenarios
export const errorHandlers = [
  http.get(`${SUPABASE_URL}/rest/v1/teachers`, () => {
    return new HttpResponse(null, { status: 500 });
  }),

  http.post(`${SUPABASE_URL}/rest/v1/students`, () => {
    return HttpResponse.json(
      { error: "Validation failed", details: "Invalid student data" },
      { status: 400 }
    );
  }),
];

// Combine all handlers
export const handlers = [
  ...authHandlers,
  ...teachersHandlers,
  ...studentsHandlers,
  ...quranSessionsHandlers,
  ...educationalHandlers,
  ...announcementsHandlers,
  ...errorHandlers,
];
