import { describe, it, expect } from "vitest";
import * as studentsService from "@/lib/db/services/students";
import * as studentNotesService from "@/lib/db/services/studentNotes";
import {
  seedStudent,
  seedStudentNote,
} from "../utils/db-helpers";

describe("Students View - Dexie Service Integration", () => {
  describe("Data Loading", () => {
    it("should load students ordered by createdAt descending", async () => {
      await seedStudent({
        name: "طالب أول",
        createdAt: "2025-11-01T10:00:00Z",
      });
      await seedStudent({
        name: "طالب ثاني",
        createdAt: "2025-11-02T10:00:00Z",
      });

      const students = await studentsService.getAll();
      expect(students).toHaveLength(2);
      expect(students[0].name).toBe("طالب ثاني");
      expect(students[1].name).toBe("طالب أول");
    });

    it("should load student notes ordered by noteDate descending", async () => {
      const student = await seedStudent();
      await seedStudentNote({
        studentId: student.id,
        noteDate: "2025-10-01",
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
    });

    it("should return empty arrays when no data exists", async () => {
      const students = await studentsService.getAll();
      const notes = await studentNotesService.getAll();
      expect(students).toEqual([]);
      expect(notes).toEqual([]);
    });
  });

  describe("Add Student", () => {
    it("should insert a new student with generated id and createdAt", async () => {
      const added = await studentsService.add({
        name: "طالب جديد",
        age: 10,
        grade: "الرابع ابتدائي",
        department: "quran",
        teacherId: "teacher-1",
        partsMemorized: 2,
        currentProgress: "سورة البقرة - الآية 50",
        previousProgress: "",
        attendance: 100,
        parentName: "الأب",
        parentPhone: "0512345678",
        isActive: true,
        images: null,
      });

      expect(added.id).toBeDefined();
      expect(added.createdAt).toBeDefined();
      expect(added.name).toBe("طالب جديد");

      const fetched = await studentsService.getById(added.id);
      expect(fetched?.name).toBe("طالب جديد");
      expect(fetched?.teacherId).toBe("teacher-1");
    });
  });

  describe("Edit Student", () => {
    it("should update student fields", async () => {
      const student = await seedStudent({
        name: "أحمد محمد",
        partsMemorized: 5,
      });

      await studentsService.update(student.id, {
        name: "أحمد محمد (محدث)",
        partsMemorized: 6,
        currentProgress: "سورة النساء - الآية 1",
      });

      const updated = await studentsService.getById(student.id);
      expect(updated?.name).toBe("أحمد محمد (محدث)");
      expect(updated?.partsMemorized).toBe(6);
      expect(updated?.currentProgress).toBe("سورة النساء - الآية 1");
    });
  });

  describe("Delete Student", () => {
    it("should delete a student", async () => {
      const student = await seedStudent();
      await studentsService.remove(student.id);

      const deleted = await studentsService.getById(student.id);
      expect(deleted).toBeUndefined();
    });
  });

  describe("Student Notes Operations", () => {
    it("should add a note to a student", async () => {
      const student = await seedStudent();
      const note = await studentNotesService.add({
        studentId: student.id,
        type: "إيجابي",
        content: "حفظ ممتاز اليوم",
        noteDate: "2025-11-06",
        teacherName: "الشيخ أحمد",
      });

      expect(note.id).toBeDefined();
      expect(note.content).toBe("حفظ ممتاز اليوم");

      const notes = await studentNotesService.getByStudentId(student.id);
      expect(notes).toHaveLength(1);
    });

    it("should update a student note", async () => {
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

    it("should delete a student note", async () => {
      const student = await seedStudent();
      const note = await seedStudentNote({ studentId: student.id });

      await studentNotesService.remove(note.id);

      const notes = await studentNotesService.getByStudentId(student.id);
      expect(notes).toHaveLength(0);
    });
  });

  describe("Student Images Update", () => {
    it("should update student images (Quran progress)", async () => {
      const student = await seedStudent({ images: null });

      const newImages = {
        new: "سورة المائدة - الآية 1-20",
        recent1: "سورة النساء - الآية 100-176",
        recent2: "سورة آل عمران - الآية 100-200",
        recent3: "سورة آل عمران - الآية 1-100",
        distant1: "سورة البقرة - الآية 200-286",
        distant2: "سورة البقرة - الآية 100-200",
        distant3: "سورة البقرة - الآية 1-100",
      };

      await studentsService.update(student.id, { images: newImages });

      const updated = await studentsService.getById(student.id);
      expect(updated?.images).toEqual(newImages);
    });
  });

  describe("Data Grouping", () => {
    it("should group notes by studentId", async () => {
      const student1 = await seedStudent({ name: "طالب أ" });
      const student2 = await seedStudent({ name: "طالب ب" });

      await seedStudentNote({ studentId: student1.id, content: "ملاحظة 1" });
      await seedStudentNote({ studentId: student1.id, content: "ملاحظة 2" });
      await seedStudentNote({ studentId: student2.id, content: "ملاحظة 3" });

      const allNotes = await studentNotesService.getAll();
      const notesMap: { [key: string]: typeof allNotes } = {};
      allNotes.forEach((note) => {
        if (!notesMap[note.studentId]) {
          notesMap[note.studentId] = [];
        }
        notesMap[note.studentId].push(note);
      });

      expect(notesMap[student1.id]).toHaveLength(2);
      expect(notesMap[student2.id]).toHaveLength(1);
    });
  });

  describe("Filtering", () => {
    it("should filter students by department", async () => {
      await seedStudent({ department: "quran", name: "طالب قرآن" });
      await seedStudent({ department: "tajweed", name: "طالب تجويد" });
      await seedStudent({ department: "quran", name: "طالب قرآن 2" });

      const all = await studentsService.getAll();
      const quranFiltered = all.filter((s) => s.department === "quran");
      expect(quranFiltered).toHaveLength(2);
    });

    it("should filter students by search term in name", async () => {
      await seedStudent({ name: "أحمد محمد علي" });
      await seedStudent({ name: "عمر خالد حسن" });
      await seedStudent({ name: "أحمد خالد" });

      const all = await studentsService.getAll();
      const searchTerm = "أحمد";
      const filtered = all.filter((s) => s.name.includes(searchTerm));
      expect(filtered).toHaveLength(2);
    });

    it("should return all students when filter is 'all'", async () => {
      await seedStudent({ department: "quran" });
      await seedStudent({ department: "tajweed" });
      await seedStudent({ department: "tarbawi" });

      const all = await studentsService.getAll();
      const filterDepartment = "all";
      const filtered = all.filter(
        (s) => filterDepartment === "all" || s.department === filterDepartment
      );
      expect(filtered).toHaveLength(3);
    });
  });
});
