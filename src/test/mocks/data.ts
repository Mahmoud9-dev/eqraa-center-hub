import type {
  Teacher,
  Student,
  QuranSession,
  TajweedLesson,
  EducationalContent,
  Meeting,
  Exam,
  SubjectData,
  Announcement,
  Suggestion,
} from "@/types";

// Mock Teachers data
export const mockTeachers: Teacher[] = [
  {
    id: "teacher-1",
    name: "الشيخ أحمد محمد",
    specialization: "تجويد القرآن الكريم",
    department: "quran",
    isActive: true,
    createdAt: new Date("2023-01-15"),
    email: "ahmed@eqraa.com",
    phone: "0512345678",
    experience: 10,
  },
  {
    id: "teacher-2",
    name: "الأستاذة فاطمة العلي",
    specialization: "التربية الإسلامية",
    department: "tarbawi",
    isActive: true,
    createdAt: new Date("2023-02-20"),
    email: "fatima@eqraa.com",
    phone: "0523456789",
    experience: 8,
  },
  {
    id: "teacher-3",
    name: "الشيخ عبدالله سالم",
    specialization: "حفظ القرآن",
    department: "quran",
    isActive: false,
    createdAt: new Date("2023-03-10"),
    email: "abdullah@eqraa.com",
    phone: "0534567890",
    experience: 15,
  },
];

// Mock Students data
export const mockStudents: Student[] = [
  {
    id: "student-1",
    name: "محمد أحمد",
    age: 12,
    grade: "السادس الابتدائي",
    teacherId: "teacher-1",
    department: "quran",
    partsMemorized: 3,
    currentProgress: "سورة البقرة الآيات 1-50",
    previousProgress: "سورة الفاتحة",
    isActive: true,
    createdAt: new Date("2023-09-01"),
    parentName: "أحمد محمد",
    parentPhone: "0545678901",
    attendance: 95,
  },
  {
    id: "student-2",
    name: "فاطمة سالم",
    age: 10,
    grade: "الرابع الابتدائي",
    teacherId: "teacher-2",
    department: "tarbawi",
    partsMemorized: 2,
    currentProgress: "سورة النساء الآيات 1-30",
    previousProgress: "سورة آل عمران",
    isActive: true,
    createdAt: new Date("2023-09-15"),
    parentName: "سالم عبدالله",
    parentPhone: "0556789012",
    attendance: 88,
  },
  {
    id: "student-3",
    name: "عبدالله خالد",
    age: 14,
    grade: "الثالث الإعدادي",
    teacherId: "teacher-1",
    department: "quran",
    partsMemorized: 5,
    currentProgress: "سورة المائدة الآيات 1-25",
    previousProgress: "سورة النساء",
    isActive: false,
    createdAt: new Date("2023-08-20"),
    parentName: "خالد محمد",
    parentPhone: "0567890123",
    attendance: 75,
  },
];

// Mock Quran Sessions data
export const mockQuranSessions: QuranSession[] = [
  {
    id: "session-1",
    studentId: "student-1",
    teacherId: "teacher-1",
    date: new Date("2024-01-15"),
    surahName: "البقرة",
    versesFrom: 1,
    versesTo: 50,
    performanceRating: 8,
    notes: "حفظ جيد، يحتاج لمراجعة التجويد",
    attendance: true,
  },
  {
    id: "session-2",
    studentId: "student-2",
    teacherId: "teacher-2",
    date: new Date("2024-01-16"),
    surahName: "النساء",
    versesFrom: 1,
    versesTo: 30,
    performanceRating: 7,
    notes: "أداء متوسط، يحتاج لممارسة أكثر",
    attendance: true,
  },
  {
    id: "session-3",
    studentId: "student-3",
    teacherId: "teacher-1",
    date: new Date("2024-01-17"),
    surahName: "المائدة",
    versesFrom: 1,
    versesTo: 25,
    performanceRating: 9,
    notes: "حفظ ممتاز وتجويد جيد",
    attendance: false,
  },
];

// Mock Tajweed Lessons data
export const mockTajweedLessons: TajweedLesson[] = [
  {
    id: "tajweed-1",
    teacher_id: "teacher-1",
    lesson_date: "2024-01-15",
    topic: "أحكام النون الساكنة والتنوين",
    description: "شرح مفصل لأحكام الإظهار، الإدغام، الإقلاب، والإخفاء",
    attendees: ["student-1", "student-3"],
    resources: ["video-1", "pdf-1"],
  },
  {
    id: "tajweed-2",
    teacher_id: "teacher-1",
    lesson_date: "2024-01-22",
    topic: "أحكام الميم الساكنة",
    description: "شرح أحكام الإخفاء الشفوي والإدغام الصغير",
    attendees: ["student-1", "student-2"],
    resources: ["video-2", "audio-1"],
  },
];

// Mock Educational Content data
export const mockEducationalContent: EducationalContent[] = [
  {
    id: "edu-1",
    teacherId: "teacher-2",
    category: "عقيدة",
    title: "أركان الإيمان",
    description: "شرح أركان الإيمان الستة وأهميتها في حياة المسلم",
    date: new Date("2024-01-10"),
    attendees: ["student-1", "student-2", "student-3"],
    resources: ["pdf-2", "video-3"],
  },
  {
    id: "edu-2",
    teacherId: "teacher-2",
    category: "سيرة",
    title: "الهجرة النبوية",
    description: "أحداث الهجرة النبوية ودروسها المستفادة",
    date: new Date("2024-01-17"),
    attendees: ["student-1", "student-2"],
    resources: ["presentation-1", "video-4"],
  },
];

// Mock Meetings data
export const mockMeetings: Meeting[] = [
  {
    id: "meeting-1",
    title: "اجتماع أولياء الأمور الشهري",
    description: "مناقشة تقدم الطلاب ومستوى الحفظ",
    date: new Date("2024-01-20"),
    attendees: ["teacher-1", "teacher-2", "parent-1", "parent-2"],
    agenda: ["مراجعة نتائج الشهر", "تخطيط البرامج القادمة", "اقتراحات التحسين"],
    notes: "تم الاتفاق على زيادة حصص المراجعة",
    status: "مكتملة",
  },
  {
    id: "meeting-2",
    title: "اجتماع هيئة التدريس",
    description: "تخطيط الفصل الدراسي الجديد",
    date: new Date("2024-01-25"),
    attendees: ["teacher-1", "teacher-2", "teacher-3"],
    agenda: ["توزيع المواد", "جدول الحصص", "الأنشطة اللاصفية"],
    status: "مجدولة",
  },
];

// Mock Exams data
export const mockExams: Exam[] = [
  {
    id: "exam-1",
    type: "قرآن",
    title: "اختبار حفظ سورة البقرة",
    description: "اختبار شامل لسورة البقرة من الآية 1-100",
    date: new Date("2024-01-30"),
    duration: 60,
    totalMarks: 100,
    passingMarks: 70,
    createdBy: "teacher-1",
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "exam-2",
    type: "تجويد",
    title: "اختبار أحكام النون الساكنة",
    description: "اختبار تطبيقي لأحكام النون الساكنة والتنوين",
    date: new Date("2024-02-05"),
    duration: 45,
    totalMarks: 50,
    passingMarks: 35,
    createdBy: "teacher-1",
    isActive: true,
    createdAt: new Date("2024-01-20"),
  },
];

// Mock Subjects data
export const mockSubjects: SubjectData[] = [
  {
    id: "subject-1",
    name: "عقيدة",
    description: "دراسة أصول العقيدة الإسلامية",
    teacherId: "teacher-2",
    isActive: true,
    createdAt: new Date("2023-09-01"),
  },
  {
    id: "subject-2",
    name: "فقه",
    description: "دراسة أحكام العبادات والمعاملات",
    teacherId: "teacher-2",
    isActive: true,
    createdAt: new Date("2023-09-01"),
  },
  {
    id: "subject-3",
    name: "سيرة",
    description: "دراسة سيرة النبي صلى الله عليه وسلم",
    teacherId: "teacher-2",
    isActive: true,
    createdAt: new Date("2023-09-01"),
  },
];

// Mock Announcements data
export const mockAnnouncements: Announcement[] = [
  {
    id: "announcement-1",
    title: "بدء التسجيل للحلقة القرآنية الجديدة",
    content:
      "سيتم بدء التسجيل للحلقة القرآنية الجديدة يوم الأحد القادم. الرجاء من جميع الطلاب المهتمين التوجه إلى الإدارة",
    type: "إعلان عام",
    targetAudience: ["student", "parent"],
    isActive: true,
    createdBy: "admin",
    createdAt: new Date("2024-01-18"),
    scheduledFor: new Date("2024-01-20"),
  },
  {
    id: "announcement-2",
    title: "موعد اختبار التجويد",
    content:
      "سيتم conducting اختبار التجويد الشهر يوم الخميس القادم الساعة 10 صباحاً. الرجاء من الطلاب الاستعداد",
    type: "موعد اختبار",
    targetAudience: ["student"],
    isActive: true,
    createdBy: "teacher-1",
    createdAt: new Date("2024-01-19"),
  },
];

// Mock Suggestions data
export const mockSuggestions: Suggestion[] = [
  {
    id: "suggestion-1",
    title: "إضافة مكتبة صوتية",
    description:
      "أقترح إضافة مكتبة صوتية تحتوي على تلاوات قرآنية ومحاضرات دينية للاستفادة منها في التعلم",
    status: "لم يتم",
    createdAt: new Date("2024-01-10"),
    suggestedBy: "teacher-2",
    priority: "متوسط",
  },
  {
    id: "suggestion-2",
    title: "تنظيم مسابقة قرآنية",
    description:
      "اقتراح تنظيم مسابقة قرآنية شهرية لتحفيز الطلاب على الحفظ والمراجعة",
    status: "تم",
    createdAt: new Date("2024-01-05"),
    suggestedBy: "teacher-1",
    priority: "عالي",
  },
];

// Utility functions for testing
export const createMockTeacher = (
  overrides: Partial<Teacher> = {}
): Teacher => ({
  id: `teacher-${Date.now()}`,
  name: "معلم تجريبي",
  specialization: "تخصص تجريبي",
  department: "quran",
  isActive: true,
  createdAt: new Date(),
  ...overrides,
});

export const createMockStudent = (
  overrides: Partial<Student> = {}
): Student => ({
  id: `student-${Date.now()}`,
  name: "طالب تجريبي",
  age: 10,
  grade: "صف تجريبي",
  teacherId: "teacher-1",
  department: "quran",
  partsMemorized: 1,
  currentProgress: "تقدم تجريبي",
  previousProgress: "سابق تجريبي",
  isActive: true,
  createdAt: new Date(),
  ...overrides,
});

export const createMockQuranSession = (
  overrides: Partial<QuranSession> = {}
): QuranSession => ({
  id: `session-${Date.now()}`,
  studentId: "student-1",
  teacherId: "teacher-1",
  date: new Date(),
  surahName: "الفاتحة",
  versesFrom: 1,
  versesTo: 7,
  performanceRating: 8,
  attendance: true,
  ...overrides,
});
