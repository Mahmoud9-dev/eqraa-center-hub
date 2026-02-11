import { describe, it, expect } from "vitest";
import * as attendanceRecordsService from "@/lib/db/services/attendanceRecords";
import { seedAttendanceRecord } from "../utils/db-helpers";

describe("Attendance Records CRUD Operations", () => {
  describe("Fetch Attendance Records", () => {
    it("should fetch all attendance records ordered by recordDate descending", async () => {
      await seedAttendanceRecord({ recordDate: "2025-11-03" });
      await seedAttendanceRecord({ recordDate: "2025-11-05" });
      await seedAttendanceRecord({ recordDate: "2025-11-01" });

      const records = await attendanceRecordsService.getAll();
      expect(records).toHaveLength(3);
      expect(records[0].recordDate).toBe("2025-11-05");
      expect(records[1].recordDate).toBe("2025-11-03");
      expect(records[2].recordDate).toBe("2025-11-01");
    });

    it("should fetch attendance records for a specific date", async () => {
      await seedAttendanceRecord({
        recordDate: "2025-11-05",
        status: "حاضر",
      });
      await seedAttendanceRecord({
        recordDate: "2025-11-05",
        status: "غائب",
      });
      await seedAttendanceRecord({
        recordDate: "2025-11-06",
        status: "حاضر",
      });

      const records = await attendanceRecordsService.getByDate("2025-11-05");
      expect(records).toHaveLength(2);
      expect(records.every((r) => r.recordDate === "2025-11-05")).toBe(true);
    });

    it("should fetch attendance records for a specific student", async () => {
      await seedAttendanceRecord({ studentId: "student-1", recordDate: "2025-11-05" });
      await seedAttendanceRecord({ studentId: "student-1", recordDate: "2025-11-04" });
      await seedAttendanceRecord({ studentId: "student-2", recordDate: "2025-11-05" });

      const records = await attendanceRecordsService.getByStudentId("student-1");
      expect(records).toHaveLength(2);
      expect(records.every((r) => r.studentId === "student-1")).toBe(true);
    });

    it("should handle empty results gracefully", async () => {
      const records = await attendanceRecordsService.getAll();
      expect(records).toEqual([]);
    });

    it("should return empty array for date with no records", async () => {
      const records = await attendanceRecordsService.getByDate("2099-01-01");
      expect(records).toEqual([]);
    });
  });

  describe("Create Attendance Record", () => {
    it("should create a new attendance record for a student", async () => {
      const created = await attendanceRecordsService.add({
        studentId: "student-1",
        teacherId: "teacher-1",
        recordDate: "2025-11-06",
        status: "حاضر",
        notes: "حضور منتظم",
      });

      expect(created.id).toBeDefined();
      expect(created.createdAt).toBeDefined();
      expect(created.status).toBe("حاضر");
      expect(created.studentId).toBe("student-1");
    });

    it("should create multiple attendance records in batch", async () => {
      const batchRecords = [
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
          studentId: "student-3" as string | null,
          teacherId: "teacher-1",
          recordDate: "2025-11-06",
          status: "مأذون",
          notes: null,
        },
      ];

      const created = await attendanceRecordsService.addBatch(batchRecords);
      expect(created).toHaveLength(3);
      expect(created[0].status).toBe("حاضر");
      expect(created[1].status).toBe("غائب");
      expect(created[2].status).toBe("مأذون");
    });

    it("should allow null student_id for teacher attendance", async () => {
      const created = await attendanceRecordsService.add({
        studentId: null,
        teacherId: "teacher-1",
        recordDate: "2025-11-06",
        status: "حاضر",
        notes: "حضور منتظم",
      });

      expect(created.studentId).toBeNull();
      expect(created.teacherId).toBe("teacher-1");
    });

    it("should store حاضر status correctly", async () => {
      const record = await attendanceRecordsService.add({
        studentId: "student-1",
        teacherId: "teacher-1",
        recordDate: "2025-11-06",
        status: "حاضر",
        notes: null,
      });

      const fetched = await attendanceRecordsService.getByDate("2025-11-06");
      expect(fetched[0].status).toBe("حاضر");
    });

    it("should store غائب status correctly", async () => {
      const record = await attendanceRecordsService.add({
        studentId: "student-1",
        teacherId: "teacher-1",
        recordDate: "2025-11-06",
        status: "غائب",
        notes: "غياب بدون عذر",
      });

      const fetched = await attendanceRecordsService.getByDate("2025-11-06");
      expect(fetched[0].status).toBe("غائب");
    });

    it("should store مأذون status correctly", async () => {
      const record = await attendanceRecordsService.add({
        studentId: "student-1",
        teacherId: "teacher-1",
        recordDate: "2025-11-06",
        status: "مأذون",
        notes: "غياب بعذر",
      });

      const fetched = await attendanceRecordsService.getByDate("2025-11-06");
      expect(fetched[0].status).toBe("مأذون");
    });
  });

  describe("Update Attendance Record", () => {
    it("should update attendance status", async () => {
      const record = await seedAttendanceRecord({ status: "حاضر" });
      await attendanceRecordsService.update(record.id, {
        status: "مأذون",
        notes: "غياب بإذن",
      });

      const records = await attendanceRecordsService.getByDate(record.recordDate);
      const updated = records.find((r) => r.id === record.id);
      expect(updated?.status).toBe("مأذون");
      expect(updated?.notes).toBe("غياب بإذن");
    });

    it("should only update specified fields", async () => {
      const record = await seedAttendanceRecord({
        status: "حاضر",
        notes: "ملاحظة أصلية",
      });

      await attendanceRecordsService.update(record.id, { status: "غائب" });

      const records = await attendanceRecordsService.getByDate(record.recordDate);
      const updated = records.find((r) => r.id === record.id);
      expect(updated?.status).toBe("غائب");
      expect(updated?.notes).toBe("ملاحظة أصلية");
    });
  });

  describe("Delete Attendance Record", () => {
    it("should delete an attendance record successfully", async () => {
      const record = await seedAttendanceRecord();
      await attendanceRecordsService.remove(record.id);

      const records = await attendanceRecordsService.getByDate(record.recordDate);
      expect(records).toHaveLength(0);
    });

    it("should only delete the specified record", async () => {
      const record1 = await seedAttendanceRecord({ recordDate: "2025-11-05", notes: "سجل 1" });
      const record2 = await seedAttendanceRecord({ recordDate: "2025-11-05", notes: "سجل 2" });

      await attendanceRecordsService.remove(record1.id);

      const records = await attendanceRecordsService.getByDate("2025-11-05");
      expect(records).toHaveLength(1);
      expect(records[0].notes).toBe("سجل 2");
    });
  });

  describe("Status Filtering", () => {
    it("should be able to filter records by status حاضر in-memory", async () => {
      await seedAttendanceRecord({ status: "حاضر", recordDate: "2025-11-05" });
      await seedAttendanceRecord({ status: "حاضر", recordDate: "2025-11-05" });
      await seedAttendanceRecord({ status: "غائب", recordDate: "2025-11-05" });

      const allRecords = await attendanceRecordsService.getByDate("2025-11-05");
      const present = allRecords.filter((r) => r.status === "حاضر");

      expect(present).toHaveLength(2);
      expect(present.every((r) => r.status === "حاضر")).toBe(true);
    });

    it("should be able to filter records by status غائب in-memory", async () => {
      await seedAttendanceRecord({ status: "حاضر", recordDate: "2025-11-05" });
      await seedAttendanceRecord({ status: "غائب", recordDate: "2025-11-05" });

      const allRecords = await attendanceRecordsService.getByDate("2025-11-05");
      const absent = allRecords.filter((r) => r.status === "غائب");

      expect(absent).toHaveLength(1);
      expect(absent[0].status).toBe("غائب");
    });
  });

  describe("Teacher Attendance", () => {
    it("should store teacher-only attendance records (null studentId)", async () => {
      await seedAttendanceRecord({
        studentId: null,
        teacherId: "teacher-1",
        status: "حاضر",
      });
      await seedAttendanceRecord({
        studentId: null,
        teacherId: "teacher-2",
        status: "غائب",
      });

      const allRecords = await attendanceRecordsService.getAll();
      const teacherRecords = allRecords.filter((r) => r.studentId === null);

      expect(teacherRecords).toHaveLength(2);
      expect(teacherRecords.every((r) => r.studentId === null)).toBe(true);
    });
  });

  describe("Batch Operations", () => {
    it("should handle batch insert for multiple students", async () => {
      const batchRecords = [
        {
          studentId: "student-1" as string | null,
          teacherId: "teacher-1",
          recordDate: "2025-11-06",
          status: "حاضر",
          notes: "حضور منتظم",
        },
        {
          studentId: "student-2" as string | null,
          teacherId: "teacher-1",
          recordDate: "2025-11-06",
          status: "حاضر",
          notes: "حضور منتظم",
        },
      ];

      const created = await attendanceRecordsService.addBatch(batchRecords);
      expect(created).toHaveLength(2);

      const records = await attendanceRecordsService.getByDate("2025-11-06");
      expect(records).toHaveLength(2);
    });

    it("should handle batch insert for multiple teachers", async () => {
      const batchRecords = [
        {
          studentId: null,
          teacherId: "teacher-1",
          recordDate: "2025-11-06",
          status: "حاضر",
          notes: "حضور منتظم",
        },
        {
          studentId: null,
          teacherId: "teacher-2",
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
