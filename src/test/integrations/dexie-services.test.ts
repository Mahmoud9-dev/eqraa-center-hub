import { describe, it, expect } from "vitest";
import * as studentsService from "@/lib/db/services/students";
import * as teachersService from "@/lib/db/services/teachers";
import * as studentNotesService from "@/lib/db/services/studentNotes";
import * as attendanceRecordsService from "@/lib/db/services/attendanceRecords";
import * as meetingsService from "@/lib/db/services/meetings";
import * as suggestionsService from "@/lib/db/services/suggestions";
import {
  seedStudent,
  seedTeacher,
  seedStudentNote,
  seedAttendanceRecord,
  seedMeeting,
  seedSuggestion,
} from "../utils/db-helpers";

describe("Dexie Service Layer", () => {
  // ============================================================
  // Students Service
  // ============================================================
  describe("Students Service", () => {
    it("should return empty array when no students exist", async () => {
      const students = await studentsService.getAll();
      expect(students).toEqual([]);
    });

    it("should add and retrieve a student", async () => {
      const added = await studentsService.add({
        name: "طالب جديد",
        age: 10,
        grade: "الرابع",
        department: "quran",
        teacherId: null,
        partsMemorized: 2,
        currentProgress: "البقرة",
        previousProgress: "",
        isActive: true,
        parentName: "الأب",
        parentPhone: "0512345678",
        attendance: 100,
        images: null,
      });
      expect(added.id).toBeDefined();
      expect(added.createdAt).toBeDefined();

      const fetched = await studentsService.getById(added.id);
      expect(fetched?.name).toBe("طالب جديد");
    });

    it("should update a student", async () => {
      const student = await seedStudent();
      await studentsService.update(student.id, { name: "اسم محدث" });
      const updated = await studentsService.getById(student.id);
      expect(updated?.name).toBe("اسم محدث");
    });

    it("should delete a student", async () => {
      const student = await seedStudent();
      await studentsService.remove(student.id);
      const deleted = await studentsService.getById(student.id);
      expect(deleted).toBeUndefined();
    });

    it("should get active count", async () => {
      await seedStudent({ isActive: true });
      await seedStudent({ isActive: true });
      await seedStudent({ isActive: false });
      const count = await studentsService.getActiveCount();
      expect(count).toBe(2);
    });

    it("should get students by department", async () => {
      await seedStudent({ department: "quran", name: "طالب أ" });
      await seedStudent({ department: "tajweed", name: "طالب ب" });
      await seedStudent({ department: "quran", name: "طالب ج" });

      const quranStudents = await studentsService.getByDepartment("quran");
      expect(quranStudents).toHaveLength(2);

      const tajweedStudents = await studentsService.getByDepartment("tajweed");
      expect(tajweedStudents).toHaveLength(1);
    });

    it("should get attendance data for active students", async () => {
      await seedStudent({ isActive: true, attendance: 90 });
      await seedStudent({ isActive: true, attendance: 80 });
      await seedStudent({ isActive: false, attendance: 70 });

      const data = await studentsService.getAttendanceData();
      expect(data).toHaveLength(2);
      expect(data.map((d) => d.attendance).sort()).toEqual([80, 90]);
    });

    it("should get all students ordered by createdAt descending", async () => {
      await seedStudent({
        name: "أول",
        createdAt: "2025-01-01T00:00:00Z",
      });
      await seedStudent({
        name: "ثاني",
        createdAt: "2025-06-01T00:00:00Z",
      });

      const students = await studentsService.getAll();
      expect(students[0].name).toBe("ثاني");
      expect(students[1].name).toBe("أول");
    });
  });

  // ============================================================
  // Teachers Service
  // ============================================================
  describe("Teachers Service", () => {
    it("should return empty array when no teachers exist", async () => {
      const teachers = await teachersService.getAll();
      expect(teachers).toEqual([]);
    });

    it("should add and retrieve a teacher", async () => {
      const added = await teachersService.add({
        name: "معلم جديد",
        department: "quran",
        specialization: "تحفيظ",
        isActive: true,
        email: null,
        phone: null,
        experience: null,
      });
      expect(added.id).toBeDefined();

      const fetched = await teachersService.getById(added.id);
      expect(fetched?.name).toBe("معلم جديد");
    });

    it("should update a teacher", async () => {
      const teacher = await seedTeacher();
      await teachersService.update(teacher.id, { name: "معلم محدث" });
      const updated = await teachersService.getById(teacher.id);
      expect(updated?.name).toBe("معلم محدث");
    });

    it("should delete a teacher", async () => {
      const teacher = await seedTeacher();
      await teachersService.remove(teacher.id);
      const deleted = await teachersService.getById(teacher.id);
      expect(deleted).toBeUndefined();
    });

    it("should get active count", async () => {
      await seedTeacher({ isActive: true });
      await seedTeacher({ isActive: true });
      await seedTeacher({ isActive: false });
      const count = await teachersService.getActiveCount();
      expect(count).toBe(2);
    });

    it("should get teachers by department", async () => {
      await seedTeacher({ department: "quran", name: "معلم أ" });
      await seedTeacher({ department: "tarbawi", name: "معلم ب" });

      const quranTeachers = await teachersService.getByDepartment("quran");
      expect(quranTeachers).toHaveLength(1);
      expect(quranTeachers[0].name).toBe("معلم أ");
    });

    it("should get active teachers only", async () => {
      await seedTeacher({ isActive: true, name: "معلم نشط" });
      await seedTeacher({ isActive: false, name: "معلم غير نشط" });

      const active = await teachersService.getActive();
      expect(active).toHaveLength(1);
      expect(active[0].name).toBe("معلم نشط");
    });
  });

  // ============================================================
  // Student Notes Service
  // ============================================================
  describe("Student Notes Service", () => {
    it("should add and retrieve notes for a student", async () => {
      const student = await seedStudent();
      await studentNotesService.add({
        studentId: student.id,
        type: "إيجابي",
        content: "ممتاز",
        noteDate: "2025-11-05",
        teacherName: "الشيخ خالد",
      });
      const notes = await studentNotesService.getByStudentId(student.id);
      expect(notes).toHaveLength(1);
      expect(notes[0].content).toBe("ممتاز");
    });

    it("should return all notes ordered by noteDate descending", async () => {
      const student = await seedStudent();
      await seedStudentNote({
        studentId: student.id,
        noteDate: "2025-01-01",
        content: "ملاحظة قديمة",
      });
      await seedStudentNote({
        studentId: student.id,
        noteDate: "2025-06-01",
        content: "ملاحظة جديدة",
      });

      const notes = await studentNotesService.getAll();
      expect(notes[0].content).toBe("ملاحظة جديدة");
      expect(notes[1].content).toBe("ملاحظة قديمة");
    });

    it("should update a note", async () => {
      const note = await seedStudentNote();
      await studentNotesService.update(note.id, { content: "محتوى محدث" });

      const notes = await studentNotesService.getByStudentId(note.studentId);
      expect(notes[0].content).toBe("محتوى محدث");
    });

    it("should delete a note", async () => {
      const note = await seedStudentNote();
      await studentNotesService.remove(note.id);

      const notes = await studentNotesService.getByStudentId(note.studentId);
      expect(notes).toHaveLength(0);
    });
  });

  // ============================================================
  // Attendance Records Service
  // ============================================================
  describe("Attendance Records Service", () => {
    it("should add and retrieve records by date", async () => {
      await attendanceRecordsService.add({
        studentId: "student-1",
        teacherId: "teacher-1",
        recordDate: "2025-11-05",
        status: "حاضر",
        notes: null,
      });

      const records = await attendanceRecordsService.getByDate("2025-11-05");
      expect(records).toHaveLength(1);
      expect(records[0].status).toBe("حاضر");
    });

    it("should retrieve records by student ID", async () => {
      await seedAttendanceRecord({ studentId: "student-1" });
      await seedAttendanceRecord({ studentId: "student-1" });
      await seedAttendanceRecord({ studentId: "student-2" });

      const records = await attendanceRecordsService.getByStudentId("student-1");
      expect(records).toHaveLength(2);
    });

    it("should add batch records", async () => {
      const batch = [
        {
          studentId: "student-1",
          teacherId: "teacher-1",
          recordDate: "2025-11-06",
          status: "حاضر",
          notes: null,
        },
        {
          studentId: "student-2",
          teacherId: "teacher-1",
          recordDate: "2025-11-06",
          status: "غائب",
          notes: null,
        },
        {
          studentId: null,
          teacherId: "teacher-1",
          recordDate: "2025-11-06",
          status: "مأذون",
          notes: "إجازة",
        },
      ];

      const created = await attendanceRecordsService.addBatch(batch);
      expect(created).toHaveLength(3);
      expect(created[0].id).toBeDefined();
      expect(created[1].id).toBeDefined();
      expect(created[2].id).toBeDefined();

      const allRecords = await attendanceRecordsService.getAll();
      expect(allRecords).toHaveLength(3);
    });

    it("should update a record", async () => {
      const record = await seedAttendanceRecord({ status: "حاضر" });
      await attendanceRecordsService.update(record.id, { status: "مأذون", notes: "غياب بإذن" });

      const records = await attendanceRecordsService.getByDate(record.recordDate);
      const updated = records.find((r) => r.id === record.id);
      expect(updated?.status).toBe("مأذون");
      expect(updated?.notes).toBe("غياب بإذن");
    });

    it("should delete a record", async () => {
      const record = await seedAttendanceRecord();
      await attendanceRecordsService.remove(record.id);

      const records = await attendanceRecordsService.getByDate(record.recordDate);
      expect(records).toHaveLength(0);
    });

    it("should return all records ordered by recordDate descending", async () => {
      await seedAttendanceRecord({ recordDate: "2025-11-01" });
      await seedAttendanceRecord({ recordDate: "2025-11-05" });
      await seedAttendanceRecord({ recordDate: "2025-11-03" });

      const all = await attendanceRecordsService.getAll();
      expect(all[0].recordDate).toBe("2025-11-05");
      expect(all[1].recordDate).toBe("2025-11-03");
      expect(all[2].recordDate).toBe("2025-11-01");
    });
  });

  // ============================================================
  // Meetings Service
  // ============================================================
  describe("Meetings Service", () => {
    it("should add and retrieve a meeting", async () => {
      const added = await meetingsService.add({
        title: "اجتماع جديد",
        description: "وصف الاجتماع",
        meetingDate: "2025-12-01T10:00:00Z",
        attendees: ["teacher-1"],
        agenda: ["بند أول"],
        notes: null,
        status: "مجدولة",
      });
      expect(added.id).toBeDefined();

      const all = await meetingsService.getAll();
      expect(all).toHaveLength(1);
      expect(all[0].title).toBe("اجتماع جديد");
    });

    it("should update meeting status", async () => {
      const meeting = await seedMeeting({ status: "مجدولة" });
      await meetingsService.updateStatus(meeting.id, "مكتملة");

      const all = await meetingsService.getAll();
      expect(all[0].status).toBe("مكتملة");
    });

    it("should delete a meeting", async () => {
      const meeting = await seedMeeting();
      await meetingsService.remove(meeting.id);

      const all = await meetingsService.getAll();
      expect(all).toHaveLength(0);
    });
  });

  // ============================================================
  // Suggestions Service
  // ============================================================
  describe("Suggestions Service", () => {
    it("should add and retrieve a suggestion", async () => {
      const added = await suggestionsService.add({
        title: "اقتراح جديد",
        description: "وصف الاقتراح",
        status: "لم يتم",
        priority: "عالي",
        suggestedBy: "teacher-1",
      });
      expect(added.id).toBeDefined();

      const all = await suggestionsService.getAll();
      expect(all).toHaveLength(1);
      expect(all[0].title).toBe("اقتراح جديد");
    });

    it("should update suggestion status", async () => {
      const suggestion = await seedSuggestion({ status: "لم يتم" });
      await suggestionsService.updateStatus(suggestion.id, "تم");

      const all = await suggestionsService.getAll();
      expect(all[0].status).toBe("تم");
    });

    it("should delete a suggestion", async () => {
      const suggestion = await seedSuggestion();
      await suggestionsService.remove(suggestion.id);

      const all = await suggestionsService.getAll();
      expect(all).toHaveLength(0);
    });
  });
});
