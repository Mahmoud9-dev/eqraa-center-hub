import { describe, it, expect } from "vitest";
import {
  studentSchema,
  teacherSchema,
  quranSessionSchema,
  educationalSessionSchema,
  tajweedLessonSchema,
  meetingSchema,
  suggestionSchema,
} from "@/lib/validations";
import { z } from "zod";

describe("Validation Schemas", () => {
  describe("Student Schema", () => {
    it("should validate valid student data", () => {
      const validStudent = {
        name: "محمد أحمد",
        age: 12,
        grade: "السادس الابتدائي",
        department: "quran",
        parentName: "أحمد محمد",
        parentPhone: "0512345678",
      };

      const result = studentSchema.safeParse(validStudent);
      expect(result.success).toBe(true);
    });

    it("should reject invalid name", () => {
      const invalidStudent = {
        name: "", // Empty name
        age: 12,
        grade: "السادس الابتدائي",
        department: "quran",
      };

      const result = studentSchema.safeParse(invalidStudent);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("الاسم مطلوب");
      }
    });

    it("should reject name that is too long", () => {
      const invalidStudent = {
        name: "a".repeat(101), // 101 characters
        age: 12,
        grade: "السادس الابتدائي",
        department: "quran",
      };

      const result = studentSchema.safeParse(invalidStudent);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("أقل من 100 حرف");
      }
    });

    it("should reject age below minimum", () => {
      const invalidStudent = {
        name: "محمد أحمد",
        age: 4, // Below minimum
        grade: "السادس الابتدائي",
        department: "quran",
      };

      const result = studentSchema.safeParse(invalidStudent);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("5 سنوات على الأقل");
      }
    });

    it("should reject age above maximum", () => {
      const invalidStudent = {
        name: "محمد أحمد",
        age: 26, // Above maximum
        grade: "السادس الابتدائي",
        department: "quran",
      };

      const result = studentSchema.safeParse(invalidStudent);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("25 سنة كحد أقصى");
      }
    });

    it("should reject invalid phone number", () => {
      const invalidStudent = {
        name: "محمد أحمد",
        age: 12,
        grade: "السادس الابتدائي",
        department: "quran",
        parentPhone: "123456789", // Invalid format
      };

      const result = studentSchema.safeParse(invalidStudent);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "رقم الهاتف يجب أن يكون بصيغة صحيحة"
        );
      }
    });

    it("should accept valid phone number formats", () => {
      const validPhones = ["0512345678", "512345678"];

      validPhones.forEach((phone) => {
        const student = {
          name: "محمد أحمد",
          age: 12,
          grade: "السادس الابتدائي",
          department: "quran",
          parentPhone: phone,
        };

        const result = studentSchema.safeParse(student);
        expect(result.success).toBe(true);
      });
    });

    it("should accept empty phone number", () => {
      const student = {
        name: "محمد أحمد",
        age: 12,
        grade: "السادس الابتدائي",
        department: "quran",
        parentPhone: "",
      };

      const result = studentSchema.safeParse(student);
      expect(result.success).toBe(true);
    });
  });

  describe("Teacher Schema", () => {
    it("should validate valid teacher data", () => {
      const validTeacher = {
        name: "الشيخ أحمد محمد",
        specialization: "تجويد القرآن الكريم",
        department: "quran",
        email: "ahmed@eqraa.com",
        phone: "0512345678",
        experience: 10,
      };

      const result = teacherSchema.safeParse(validTeacher);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidTeacher = {
        name: "الشيخ أحمد محمد",
        specialization: "تجويد القرآن الكريم",
        department: "quran",
        email: "invalid-email", // Invalid email format
        phone: "0512345678",
      };

      const result = teacherSchema.safeParse(invalidTeacher);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "البريد الإلكتروني غير صحيح"
        );
      }
    });

    it("should reject negative experience", () => {
      const invalidTeacher = {
        name: "الشيخ أحمد محمد",
        specialization: "تجويد القرآن الكريم",
        department: "quran",
        experience: -1, // Negative experience
      };

      const result = teacherSchema.safeParse(invalidTeacher);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "لا يمكن أن تكون سالبة"
        );
      }
    });

    it("should reject experience above maximum", () => {
      const invalidTeacher = {
        name: "الشيخ أحمد محمد",
        specialization: "تجويد القرآن الكريم",
        department: "quran",
        experience: 51, // Above maximum
      };

      const result = teacherSchema.safeParse(invalidTeacher);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("50 سنة كحد أقصى");
      }
    });
  });

  describe("Quran Session Schema", () => {
    it("should validate valid quran session data", () => {
      const validSession = {
        surahName: "البقرة",
        versesFrom: 1,
        versesTo: 50,
        performanceRating: 8,
        notes: "حفظ جيد",
      };

      const result = quranSessionSchema.safeParse(validSession);
      expect(result.success).toBe(true);
    });

    it("should reject versesFrom greater than versesTo", () => {
      const invalidSession = {
        surahName: "البقرة",
        versesFrom: 50,
        versesTo: 1, // Less than versesFrom
        performanceRating: 8,
      };

      const result = quranSessionSchema.safeParse(invalidSession);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "رقم الآية الأولى يجب أن يكون أقل من أو يساوي"
        );
      }
    });

    it("should reject performance rating below minimum", () => {
      const invalidSession = {
        surahName: "البقرة",
        versesFrom: 1,
        versesTo: 50,
        performanceRating: 0, // Below minimum
      };

      const result = quranSessionSchema.safeParse(invalidSession);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "التقييم يجب أن يكون من 1 إلى 10"
        );
      }
    });

    it("should reject performance rating above maximum", () => {
      const invalidSession = {
        surahName: "البقرة",
        versesFrom: 1,
        versesTo: 50,
        performanceRating: 11, // Above maximum
      };

      const result = quranSessionSchema.safeParse(invalidSession);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "التقييم يجب أن يكون من 1 إلى 10"
        );
      }
    });

    it("should reject verses outside valid range", () => {
      const invalidSession1 = {
        surahName: "البقرة",
        versesFrom: 0, // Below minimum
        versesTo: 50,
      };

      const invalidSession2 = {
        surahName: "البقرة",
        versesFrom: 1,
        versesTo: 287, // Above maximum
      };

      const result1 = quranSessionSchema.safeParse(invalidSession1);
      const result2 = quranSessionSchema.safeParse(invalidSession2);

      expect(result1.success).toBe(false);
      expect(result2.success).toBe(false);
    });
  });

  describe("Educational Session Schema", () => {
    it("should validate valid educational session data", () => {
      const validSession = {
        topic: "أركان الإيمان",
        description: "شرح مفصل لأركان الإيمان الستة",
        performanceRating: 9,
        notes: "شرح ممتاز",
      };

      const result = educationalSessionSchema.safeParse(validSession);
      expect(result.success).toBe(true);
    });

    it("should reject empty topic", () => {
      const invalidSession = {
        topic: "", // Empty topic
        description: "شرح مفصل لأركان الإيمان الستة",
      };

      const result = educationalSessionSchema.safeParse(invalidSession);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("الموضوع مطلوب");
      }
    });

    it("should reject topic that is too long", () => {
      const invalidSession = {
        topic: "a".repeat(201), // 201 characters
        description: "شرح مفصل",
      };

      const result = educationalSessionSchema.safeParse(invalidSession);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("أقل من 200 حرف");
      }
    });
  });

  describe("Tajweed Lesson Schema", () => {
    it("should validate valid tajweed lesson data", () => {
      const validLesson = {
        topic: "أحكام النون الساكنة",
        description: "شرح مفصل لأحكام النون الساكنة والتنوين",
      };

      const result = tajweedLessonSchema.safeParse(validLesson);
      expect(result.success).toBe(true);
    });

    it("should reject empty description", () => {
      const invalidLesson = {
        topic: "أحكام النون الساكنة",
        description: "", // Empty description
      };

      const result = tajweedLessonSchema.safeParse(invalidLesson);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("الوصف مطلوب");
      }
    });
  });

  describe("Meeting Schema", () => {
    it("should validate valid meeting data", () => {
      const validMeeting = {
        title: "اجتماع أولياء الأمور",
        description: "مناقشة تقدم الطلاب",
        meetingDate: "2024-01-20",
      };

      const result = meetingSchema.safeParse(validMeeting);
      expect(result.success).toBe(true);
    });

    it("should reject empty meeting date", () => {
      const invalidMeeting = {
        title: "اجتماع أولياء الأمور",
        description: "مناقشة تقدم الطلاب",
        meetingDate: "", // Empty date
      };

      const result = meetingSchema.safeParse(invalidMeeting);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("تاريخ الاجتماع مطلوب");
      }
    });
  });

  describe("Suggestion Schema", () => {
    it("should validate valid suggestion data", () => {
      const validSuggestion = {
        title: "إضافة مكتبة صوتية",
        description: "أقترح إضافة مكتبة صوتية تحتوي على تلاوات قرآنية",
        suggestedBy: "أحمد محمد",
        priority: "عالي",
      };

      const result = suggestionSchema.safeParse(validSuggestion);
      expect(result.success).toBe(true);
    });

    it("should reject empty priority", () => {
      const invalidSuggestion = {
        title: "إضافة مكتبة صوتية",
        description: "أقترح إضافة مكتبة صوتية",
        priority: "", // Empty priority
      };

      const result = suggestionSchema.safeParse(invalidSuggestion);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("الأولوية مطلوبة");
      }
    });
  });
});

describe("Schema Transformations and Custom Validations", () => {
  describe("String trimming", () => {
    it("should trim whitespace from string fields", () => {
      const studentWithWhitespace = {
        name: "  محمد أحمد  ",
        age: 12,
        grade: "  السادس الابتدائي  ",
        department: "  quran  ",
      };

      const result = studentSchema.safeParse(studentWithWhitespace);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("محمد أحمد");
        expect(result.data.grade).toBe("السادس الابتدائي");
        expect(result.data.department).toBe("quran");
      }
    });
  });

  describe("Optional field handling", () => {
    it("should handle optional fields correctly", () => {
      const minimalStudent = {
        name: "محمد أحمد",
        age: 12,
        grade: "السادس الابتدائي",
        department: "quran",
      };

      const result = studentSchema.safeParse(minimalStudent);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.parentName).toBeUndefined();
        expect(result.data.parentPhone).toBeUndefined();
      }
    });
  });
});

describe("Error Message Localization", () => {
  it("should provide Arabic error messages", () => {
    const invalidStudent = {
      name: "",
      age: 3,
      grade: "",
      department: "",
    };

    const result = studentSchema.safeParse(invalidStudent);
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message);
      expect(messages.some((msg) => msg.includes("الاسم مطلوب"))).toBe(true);
      expect(messages.some((msg) => msg.includes("5 سنوات على الأقل"))).toBe(
        true
      );
      expect(messages.some((msg) => msg.includes("الصف مطلوب"))).toBe(true);
      expect(messages.some((msg) => msg.includes("القسم مطلوب"))).toBe(true);
    }
  });
});
