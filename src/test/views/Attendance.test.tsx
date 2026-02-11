import { describe, it, expect } from "vitest";
import * as studentsService from "@/lib/db/services/students";
import * as teachersService from "@/lib/db/services/teachers";
import * as attendanceRecordsService from "@/lib/db/services/attendanceRecords";
import {
  seedStudent,
  seedTeacher,
  seedAttendanceRecord,
} from "../utils/db-helpers";

describe("Attendance View - Dexie Service Integration", () => {
  describe("Data Loading", () => {
    it("should load active students", async () => {
      await seedStudent({ isActive: true, name: "طالب نشط" });
      await seedStudent({ isActive: false, name: "طالب غير نشط" });

      const active = await studentsService.getActive();
      expect(active).toHaveLength(1);
      expect(active[0].name).toBe("طالب نشط");
    });

    it("should load active teachers", async () => {
      await seedTeacher({ isActive: true, name: "معلم نشط" });
      await seedTeacher({ isActive: false, name: "معلم غير نشط" });

      const active = await teachersService.getActive();
      expect(active).toHaveLength(1);
      expect(active[0].name).toBe("معلم نشط");
    });

    it("should load attendance records ordered by recordDate descending", async () => {
      await seedAttendanceRecord({ recordDate: "2025-11-03" });
      await seedAttendanceRecord({ recordDate: "2025-11-05" });

      const records = await attendanceRecordsService.getAll();
      expect(records).toHaveLength(2);
      expect(records[0].recordDate).toBe("2025-11-05");
    });

    it("should return empty arrays when no data exists", async () => {
      const students = await studentsService.getActive();
      const teachers = await teachersService.getActive();
      const records = await attendanceRecordsService.getAll();

      expect(students).toEqual([]);
      expect(teachers).toEqual([]);
      expect(records).toEqual([]);
    });
  });

  describe("Record Student Attendance", () => {
    it("should create attendance records for students via batch", async () => {
      const student1 = await seedStudent({ name: "طالب أ" });
      const student2 = await seedStudent({ name: "طالب ب" });
      const teacher = await seedTeacher();

      const batchRecords = [
        {
          studentId: student1.id as string | null,
          teacherId: teacher.id,
          recordDate: "2025-11-06",
          status: "حاضر",
          notes: "حضور منتظم",
        },
        {
          studentId: student2.id as string | null,
          teacherId: teacher.id,
          recordDate: "2025-11-06",
          status: "غائب",
          notes: "غياب بدون عذر",
        },
      ];

      const created = await attendanceRecordsService.addBatch(batchRecords);
      expect(created).toHaveLength(2);

      const records = await attendanceRecordsService.getByDate("2025-11-06");
      expect(records).toHaveLength(2);
    });

    it("should handle حاضر status correctly", async () => {
      const record = await attendanceRecordsService.add({
        studentId: "student-1",
        teacherId: "teacher-1",
        recordDate: "2025-11-06",
        status: "حاضر",
        notes: "حضور منتظم",
      });

      expect(record.status).toBe("حاضر");
    });

    it("should handle غائب status correctly", async () => {
      const record = await attendanceRecordsService.add({
        studentId: "student-2",
        teacherId: "teacher-1",
        recordDate: "2025-11-06",
        status: "غائب",
        notes: "غياب بدون عذر",
      });

      expect(record.status).toBe("غائب");
    });

    it("should handle مأذون status correctly", async () => {
      const record = await attendanceRecordsService.add({
        studentId: "student-3",
        teacherId: "teacher-1",
        recordDate: "2025-11-06",
        status: "مأذون",
        notes: "غياب بعذر",
      });

      expect(record.status).toBe("مأذون");
    });
  });

  describe("Record Teacher Attendance", () => {
    it("should create attendance records for teachers (null studentId)", async () => {
      const teacher = await seedTeacher();
      const record = await attendanceRecordsService.add({
        studentId: null,
        teacherId: teacher.id,
        recordDate: "2025-11-06",
        status: "حاضر",
        notes: "حضور منتظم",
      });

      expect(record.studentId).toBeNull();
      expect(record.teacherId).toBe(teacher.id);
    });

    it("should handle مأذون status for teachers", async () => {
      const teacher = await seedTeacher();
      const record = await attendanceRecordsService.add({
        studentId: null,
        teacherId: teacher.id,
        recordDate: "2025-11-06",
        status: "مأذون",
        notes: "إجازة معتمدة",
      });

      expect(record.status).toBe("مأذون");
      expect(record.studentId).toBeNull();
    });
  });

  describe("Helper Functions", () => {
    it("should get student name from ID", async () => {
      const student1 = await seedStudent({ name: "أحمد محمد علي" });
      const student2 = await seedStudent({ name: "عمر خالد حسن" });

      const students = await studentsService.getAll();

      const getStudentName = (studentId: string | null | undefined) => {
        if (!studentId) return "-";
        const student = students.find((s) => s.id === studentId);
        return student?.name || "-";
      };

      expect(getStudentName(student1.id)).toBe("أحمد محمد علي");
      expect(getStudentName(student2.id)).toBe("عمر خالد حسن");
      expect(getStudentName("non-existent")).toBe("-");
      expect(getStudentName(null)).toBe("-");
    });

    it("should get teacher name from ID", async () => {
      const teacher1 = await seedTeacher({ name: "الشيخ خالد أحمد" });
      const teacher2 = await seedTeacher({ name: "الشيخ أحمد محمد" });

      const teachers = await teachersService.getAll();

      const getTeacherName = (teacherId: string | null | undefined) => {
        if (!teacherId) return "-";
        const teacher = teachers.find((t) => t.id === teacherId);
        return teacher?.name || "-";
      };

      expect(getTeacherName(teacher1.id)).toBe("الشيخ خالد أحمد");
      expect(getTeacherName(teacher2.id)).toBe("الشيخ أحمد محمد");
      expect(getTeacherName("non-existent")).toBe("-");
      expect(getTeacherName(null)).toBe("-");
    });

    it("should get department name in Arabic", () => {
      const getDepartmentName = (dept: string) => {
        switch (dept) {
          case "quran":
            return "قرآن";
          case "tajweed":
            return "تجويد";
          case "tarbawi":
            return "تربوي";
          default:
            return dept;
        }
      };

      expect(getDepartmentName("quran")).toBe("قرآن");
      expect(getDepartmentName("tajweed")).toBe("تجويد");
      expect(getDepartmentName("tarbawi")).toBe("تربوي");
      expect(getDepartmentName("unknown")).toBe("unknown");
    });

    it("should get status color class", () => {
      const getStatusColor = (status: string) => {
        switch (status) {
          case "حاضر":
            return "bg-green-100 text-green-800";
          case "غائب":
            return "bg-red-100 text-red-800";
          case "مأذون":
            return "bg-yellow-100 text-yellow-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
      };

      expect(getStatusColor("حاضر")).toBe("bg-green-100 text-green-800");
      expect(getStatusColor("غائب")).toBe("bg-red-100 text-red-800");
      expect(getStatusColor("مأذون")).toBe("bg-yellow-100 text-yellow-800");
      expect(getStatusColor("unknown")).toBe("bg-gray-100 text-gray-800");
    });
  });

  describe("Filtering", () => {
    it("should filter students by department", async () => {
      await seedStudent({ department: "quran", name: "طالب قرآن" });
      await seedStudent({ department: "tajweed", name: "طالب تجويد" });

      const quranStudents = await studentsService.getByDepartment("quran");
      expect(quranStudents).toHaveLength(1);
      expect(quranStudents[0].name).toBe("طالب قرآن");
    });

    it("should filter active students by department", async () => {
      await seedStudent({
        department: "quran",
        isActive: true,
        name: "طالب نشط",
      });
      await seedStudent({
        department: "quran",
        isActive: false,
        name: "طالب غير نشط",
      });

      const active = await studentsService.getActiveDepartment("quran");
      expect(active).toHaveLength(1);
      expect(active[0].name).toBe("طالب نشط");
    });

    it("should filter students by search term", async () => {
      await seedStudent({ name: "أحمد محمد" });
      await seedStudent({ name: "عمر خالد" });

      const all = await studentsService.getAll();
      const searchTerm = "أحمد";
      const filtered = all.filter((s) => s.name.includes(searchTerm));
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe("أحمد محمد");
    });

    it("should return all students when filter is 'all'", async () => {
      await seedStudent({ department: "quran" });
      await seedStudent({ department: "tajweed" });

      const all = await studentsService.getAll();
      const filterDepartment = "all";
      const filtered = all.filter(
        (s) => filterDepartment === "all" || s.department === filterDepartment
      );
      expect(filtered).toHaveLength(2);
    });
  });

  describe("Batch Operations", () => {
    it("should handle batch insert for multiple students", async () => {
      const student1 = await seedStudent();
      const student2 = await seedStudent();
      const teacher = await seedTeacher();

      const batchRecords = [
        {
          studentId: student1.id as string | null,
          teacherId: teacher.id,
          recordDate: "2025-11-06",
          status: "حاضر",
          notes: "حضور منتظم",
        },
        {
          studentId: student2.id as string | null,
          teacherId: teacher.id,
          recordDate: "2025-11-06",
          status: "حاضر",
          notes: "حضور منتظم",
        },
      ];

      const created = await attendanceRecordsService.addBatch(batchRecords);
      expect(created).toHaveLength(2);
    });

    it("should handle batch insert for multiple teachers", async () => {
      const teacher1 = await seedTeacher({ name: "معلم أ" });
      const teacher2 = await seedTeacher({ name: "معلم ب" });

      const batchRecords = [
        {
          studentId: null,
          teacherId: teacher1.id,
          recordDate: "2025-11-06",
          status: "حاضر",
          notes: "حضور منتظم",
        },
        {
          studentId: null,
          teacherId: teacher2.id,
          recordDate: "2025-11-06",
          status: "حاضر",
          notes: "حضور منتظم",
        },
      ];

      const created = await attendanceRecordsService.addBatch(batchRecords);
      expect(created).toHaveLength(2);
      expect(created.every((r) => r.studentId === null)).toBe(true);
    });
  });
});
