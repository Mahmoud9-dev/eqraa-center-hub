import { describe, it, expect } from "vitest";
import * as studentNotesService from "@/lib/db/services/studentNotes";
import { seedStudent, seedStudentNote } from "../utils/db-helpers";

describe("Student Notes CRUD Operations", () => {
  describe("Fetch Student Notes", () => {
    it("should fetch all student notes ordered by noteDate descending", async () => {
      const student = await seedStudent();
      await seedStudentNote({
        studentId: student.id,
        noteDate: "2025-10-28",
        content: "ملاحظة قديمة",
      });
      await seedStudentNote({
        studentId: student.id,
        noteDate: "2025-11-01",
        content: "ملاحظة جديدة",
      });

      const notes = await studentNotesService.getAll();
      expect(notes).toHaveLength(2);
      expect(notes[0].noteDate).toBe("2025-11-01");
      expect(notes[1].noteDate).toBe("2025-10-28");
    });

    it("should fetch notes for a specific student", async () => {
      const student1 = await seedStudent({ name: "طالب أ" });
      const student2 = await seedStudent({ name: "طالب ب" });

      await seedStudentNote({ studentId: student1.id, content: "ملاحظة أ" });
      await seedStudentNote({ studentId: student2.id, content: "ملاحظة ب" });

      const notes = await studentNotesService.getByStudentId(student1.id);
      expect(notes).toHaveLength(1);
      expect(notes[0].studentId).toBe(student1.id);
      expect(notes[0].content).toBe("ملاحظة أ");
    });

    it("should handle empty results gracefully", async () => {
      const notes = await studentNotesService.getAll();
      expect(notes).toEqual([]);
    });

    it("should return empty array for student with no notes", async () => {
      const student = await seedStudent();
      const notes = await studentNotesService.getByStudentId(student.id);
      expect(notes).toEqual([]);
    });
  });

  describe("Create Student Note", () => {
    it("should create a new student note successfully", async () => {
      const student = await seedStudent();
      const created = await studentNotesService.add({
        studentId: student.id,
        type: "إيجابي",
        content: "مشاركة فعالة في النقاش",
        noteDate: "2025-11-05",
        teacherName: "الشيخ محمد",
      });

      expect(created.id).toBeDefined();
      expect(created.createdAt).toBeDefined();
      expect(created.content).toBe("مشاركة فعالة في النقاش");
      expect(created.type).toBe("إيجابي");
    });

    it("should create notes with type إيجابي", async () => {
      const student = await seedStudent();
      const note = await studentNotesService.add({
        studentId: student.id,
        type: "إيجابي",
        content: "حفظ ممتاز",
        noteDate: "2025-11-05",
        teacherName: "الشيخ خالد",
      });

      expect(note.type).toBe("إيجابي");
    });

    it("should create notes with type سلبي", async () => {
      const student = await seedStudent();
      const note = await studentNotesService.add({
        studentId: student.id,
        type: "سلبي",
        content: "تأخير في الحضور",
        noteDate: "2025-11-05",
        teacherName: "الشيخ خالد",
      });

      expect(note.type).toBe("سلبي");
    });
  });

  describe("Update Student Note", () => {
    it("should update a student note successfully", async () => {
      const student = await seedStudent();
      const note = await seedStudentNote({
        studentId: student.id,
        content: "محتوى أصلي",
        type: "إيجابي",
      });

      await studentNotesService.update(note.id, {
        content: "محتوى محدث",
        type: "سلبي",
      });

      const notes = await studentNotesService.getByStudentId(student.id);
      expect(notes[0].content).toBe("محتوى محدث");
      expect(notes[0].type).toBe("سلبي");
    });

    it("should only update specified fields", async () => {
      const note = await seedStudentNote({
        content: "محتوى أصلي",
        teacherName: "الشيخ خالد",
      });

      await studentNotesService.update(note.id, { content: "محتوى جديد" });

      const notes = await studentNotesService.getByStudentId(note.studentId);
      expect(notes[0].content).toBe("محتوى جديد");
      expect(notes[0].teacherName).toBe("الشيخ خالد");
    });
  });

  describe("Delete Student Note", () => {
    it("should delete a student note successfully", async () => {
      const student = await seedStudent();
      const note = await seedStudentNote({ studentId: student.id });

      await studentNotesService.remove(note.id);

      const notes = await studentNotesService.getByStudentId(student.id);
      expect(notes).toHaveLength(0);
    });

    it("should only delete the specified note", async () => {
      const student = await seedStudent();
      const note1 = await seedStudentNote({
        studentId: student.id,
        content: "ملاحظة 1",
      });
      const note2 = await seedStudentNote({
        studentId: student.id,
        content: "ملاحظة 2",
      });

      await studentNotesService.remove(note1.id);

      const notes = await studentNotesService.getByStudentId(student.id);
      expect(notes).toHaveLength(1);
      expect(notes[0].content).toBe("ملاحظة 2");
    });
  });

  describe("Note Type Filtering", () => {
    it("should be able to filter notes by type إيجابي in-memory", async () => {
      const student = await seedStudent();
      await seedStudentNote({
        studentId: student.id,
        type: "إيجابي",
        content: "ممتاز",
      });
      await seedStudentNote({
        studentId: student.id,
        type: "سلبي",
        content: "تأخير",
      });
      await seedStudentNote({
        studentId: student.id,
        type: "إيجابي",
        content: "رائع",
      });

      const allNotes = await studentNotesService.getByStudentId(student.id);
      const positive = allNotes.filter((n) => n.type === "إيجابي");

      expect(positive).toHaveLength(2);
      expect(positive.every((n) => n.type === "إيجابي")).toBe(true);
    });

    it("should be able to filter notes by type سلبي in-memory", async () => {
      const student = await seedStudent();
      await seedStudentNote({
        studentId: student.id,
        type: "إيجابي",
        content: "ممتاز",
      });
      await seedStudentNote({
        studentId: student.id,
        type: "سلبي",
        content: "تأخير",
      });

      const allNotes = await studentNotesService.getByStudentId(student.id);
      const negative = allNotes.filter((n) => n.type === "سلبي");

      expect(negative).toHaveLength(1);
      expect(negative[0].type).toBe("سلبي");
    });
  });
});
