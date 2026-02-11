import { z } from "zod";

// Student validation
export const studentSchema = z.object({
  name: z.string().trim().min(1, "الاسم مطلوب").max(100, "الاسم يجب أن يكون أقل من 100 حرف"),
  age: z.number().min(5, "العمر يجب أن يكون 5 سنوات على الأقل").max(25, "العمر يجب أن يكون 25 سنة كحد أقصى"),
  grade: z.string().trim().min(1, "الصف مطلوب").max(50, "الصف يجب أن يكون أقل من 50 حرف"),
  department: z.string().trim().min(1, "القسم مطلوب"),
  parentName: z.string().trim().max(100, "اسم ولي الأمر يجب أن يكون أقل من 100 حرف").optional(),
  parentPhone: z.string().regex(/^(05|5)\d{8}$/, "رقم الهاتف يجب أن يكون بصيغة صحيحة (مثال: 0512345678)").optional().or(z.literal("")),
});

// Teacher validation
export const teacherSchema = z.object({
  name: z.string().trim().min(1, "الاسم مطلوب").max(100, "الاسم يجب أن يكون أقل من 100 حرف"),
  specialization: z.string().trim().min(1, "التخصص مطلوب").max(200, "التخصص يجب أن يكون أقل من 200 حرف"),
  department: z.string().trim().min(1, "القسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح").max(255, "البريد الإلكتروني يجب أن يكون أقل من 255 حرف").optional().or(z.literal("")),
  phone: z.string().regex(/^(05|5)\d{8}$/, "رقم الهاتف يجب أن يكون بصيغة صحيحة (مثال: 0512345678)").optional().or(z.literal("")),
  experience: z.number().min(0, "سنوات الخبرة لا يمكن أن تكون سالبة").max(50, "سنوات الخبرة يجب أن تكون 50 سنة كحد أقصى").optional(),
});

// Quran session validation (base schema exported for partial updates)
export const quranSessionBaseSchema = z.object({
  surahName: z.string().trim().min(1, "اسم السورة مطلوب").max(50, "اسم السورة يجب أن يكون أقل من 50 حرف"),
  versesFrom: z.number().min(1, "رقم الآية يجب أن يكون على الأقل 1").max(286, "رقم الآية يجب أن يكون 286 كحد أقصى"),
  versesTo: z.number().min(1, "رقم الآية يجب أن يكون على الأقل 1").max(286, "رقم الآية يجب أن يكون 286 كحد أقصى"),
  performanceRating: z.number().min(1, "التقييم يجب أن يكون من 1 إلى 10").max(10, "التقييم يجب أن يكون من 1 إلى 10").optional(),
  notes: z.string().max(1000, "الملاحظات يجب أن تكون أقل من 1000 حرف").optional(),
});

export const quranSessionSchema = quranSessionBaseSchema.refine((data) => data.versesFrom <= data.versesTo, {
  message: "رقم الآية الأولى يجب أن يكون أقل من أو يساوي رقم الآية الأخيرة",
  path: ["versesTo"],
});

// Educational session validation
export const educationalSessionSchema = z.object({
  topic: z.string().trim().min(1, "الموضوع مطلوب").max(200, "الموضوع يجب أن يكون أقل من 200 حرف"),
  description: z.string().trim().min(1, "الوصف مطلوب").max(1000, "الوصف يجب أن يكون أقل من 1000 حرف"),
  performanceRating: z.number().min(1, "التقييم يجب أن يكون من 1 إلى 10").max(10, "التقييم يجب أن يكون من 1 إلى 10").optional(),
  notes: z.string().max(1000, "الملاحظات يجب أن تكون أقل من 1000 حرف").optional(),
});

// Tajweed lesson validation
export const tajweedLessonSchema = z.object({
  topic: z.string().trim().min(1, "الموضوع مطلوب").max(200, "الموضوع يجب أن يكون أقل من 200 حرف"),
  description: z.string().trim().min(1, "الوصف مطلوب").max(1000, "الوصف يجب أن يكون أقل من 1000 حرف"),
});

// Meeting validation
export const meetingSchema = z.object({
  title: z.string().trim().min(1, "العنوان مطلوب").max(200, "العنوان يجب أن يكون أقل من 200 حرف"),
  description: z.string().trim().min(1, "الوصف مطلوب").max(1000, "الوصف يجب أن يكون أقل من 1000 حرف"),
  meetingDate: z.string().min(1, "تاريخ الاجتماع مطلوب"),
});

// Suggestion validation
export const suggestionSchema = z.object({
  title: z.string().trim().min(1, "العنوان مطلوب").max(200, "العنوان يجب أن يكون أقل من 200 حرف"),
  description: z.string().trim().min(1, "الوصف مطلوب").max(1000, "الوصف يجب أن يكون أقل من 1000 حرف"),
  suggestedBy: z.string().trim().max(100, "اسم المقترح يجب أن يكون أقل من 100 حرف").optional(),
  priority: z.enum(["عالي", "متوسط", "منخفض"], { message: "الأولوية يجب أن تكون عالي أو متوسط أو منخفض" }),
});

// Student note validation
export const studentNoteSchema = z.object({
  studentId: z.string().min(1, "معرّف الطالب مطلوب"),
  type: z.enum(["إيجابي", "سلبي"], { message: "نوع الملاحظة يجب أن يكون إيجابي أو سلبي" }),
  content: z.string().trim().min(1, "محتوى الملاحظة مطلوب").max(1000, "المحتوى يجب أن يكون أقل من 1000 حرف"),
  noteDate: z.string().min(1, "تاريخ الملاحظة مطلوب"),
  teacherName: z.string().trim().min(1, "اسم المعلم مطلوب").max(100, "اسم المعلم يجب أن يكون أقل من 100 حرف"),
});

// Attendance record validation
export const attendanceRecordSchema = z.object({
  recordDate: z.string().min(1, "تاريخ الحضور مطلوب"),
  status: z.enum(["حاضر", "غائب", "مأذون"], { message: "حالة الحضور يجب أن تكون حاضر أو غائب أو مأذون" }),
});
