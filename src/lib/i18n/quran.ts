import type { Language } from './types';

export interface QuranTranslations {
  pageTitle: string;
  tabs: {
    sessions: string;
    students: string;
  };
  sessionForm: {
    title: string;
    studentLabel: string;
    studentPlaceholder: string;
    surahLabel: string;
    surahPlaceholder: string;
    fromVerse: string;
    toVerse: string;
    ratingLabel: string;
    submit: string;
    submitting: string;
  };
  studentForm: {
    title: string;
    nameLabel: string;
    namePlaceholder: string;
    ageLabel: string;
    agePlaceholder: string;
    teacherLabel: string;
    submit: string;
    submitting: string;
  };
  teacherCombobox: {
    placeholder: string;
    searchPlaceholder: string;
    noResults: string;
    addNew: string;
  };
  sessionList: {
    title: string;
    empty: string;
    versesRange: string;
  };
  studentList: {
    title: string;
    empty: string;
    age: string;
    teacher: string;
    partsMemorized: string;
  };
  reviewCards: {
    recent: string;
    distant: string;
    new: string;
    surah: string;
    fromVerse: string;
    toVerse: string;
  };
  toast: {
    teacherAddError: string;
    teacherAdded: string;
    selectTeacher: string;
    studentAddError: string;
    studentAdded: string;
    sessionAddError: string;
    sessionAdded: string;
    recordingStarted: string;
    recordingError: string;
    recordingErrorDescription: string;
    recordingStopped: string;
    fileUploaded: string;
  };
  audio: {
    startRecording: string;
    stopRecording: string;
  };
}

export const quran: Record<Language, QuranTranslations> = {
  ar: {
    pageTitle: 'القرآن الكريم',
    tabs: {
      sessions: 'جلسات التحفيظ',
      students: 'الطلاب',
    },
    sessionForm: {
      title: 'تسجيل جلسة تحفيظ',
      studentLabel: 'الطالب',
      studentPlaceholder: 'اختر الطالب',
      surahLabel: 'السورة',
      surahPlaceholder: 'مثال: البقرة',
      fromVerse: 'من آية',
      toVerse: 'إلى آية',
      ratingLabel: 'التقييم (1-10):',
      submit: 'تسجيل الجلسة',
      submitting: 'جاري التسجيل...',
    },
    studentForm: {
      title: 'إضافة طالب جديد',
      nameLabel: 'اسم الطالب',
      namePlaceholder: 'أدخل اسم الطالب',
      ageLabel: 'العمر',
      agePlaceholder: 'أدخل عمر الطالب',
      teacherLabel: 'الشيخ المحفظ',
      submit: 'إضافة الطالب',
      submitting: 'جاري الإضافة...',
    },
    teacherCombobox: {
      placeholder: 'اختر الشيخ أو اكتب الاسم...',
      searchPlaceholder: 'ابحث عن الشيخ أو اكتب اسماً جديداً...',
      noResults: 'لا يوجد شيخ بهذا الاسم',
      addNew: 'إضافة "{{name}}" كشيخ جديد',
    },
    sessionList: {
      title: 'الجلسات الأخيرة',
      empty: 'لا توجد جلسات مسجلة بعد',
      versesRange: 'الآيات {{from}} إلى {{to}}',
    },
    studentList: {
      title: 'قائمة الطلاب',
      empty: 'لا يوجد طلاب مسجلين بعد',
      age: 'العمر: {{age}} سنة',
      teacher: 'الشيخ: {{name}}',
      partsMemorized: 'الأجزاء المحفوظة',
    },
    reviewCards: {
      recent: 'الماضي القريب',
      distant: 'الماضي البعيد',
      new: 'الجديد',
      surah: 'السورة:',
      fromVerse: 'من آية:',
      toVerse: 'إلى آية:',
    },
    toast: {
      teacherAddError: 'خطأ في إضافة الشيخ',
      teacherAdded: 'تم إضافة الشيخ الجديد',
      selectTeacher: 'الرجاء اختيار أو إضافة شيخ',
      studentAddError: 'خطأ في إضافة الطالب',
      studentAdded: 'تم إضافة الطالب بنجاح',
      sessionAddError: 'خطأ في إضافة الجلسة',
      sessionAdded: 'تم إضافة الجلسة بنجاح',
      recordingStarted: 'بدء التسجيل الصوتي',
      recordingError: 'خطأ في التسجيل',
      recordingErrorDescription: 'يرجى السماح بالوصول للميكروفون',
      recordingStopped: 'تم إيقاف التسجيل',
      fileUploaded: 'تم رفع الملف الصوتي',
    },
    audio: {
      startRecording: 'بدء التسجيل',
      stopRecording: 'إيقاف التسجيل',
    },
  },
  en: {
    pageTitle: 'Holy Quran',
    tabs: {
      sessions: 'Memorization Sessions',
      students: 'Students',
    },
    sessionForm: {
      title: 'Record Memorization Session',
      studentLabel: 'Student',
      studentPlaceholder: 'Select student',
      surahLabel: 'Surah',
      surahPlaceholder: 'e.g. Al-Baqarah',
      fromVerse: 'From verse',
      toVerse: 'To verse',
      ratingLabel: 'Rating (1-10):',
      submit: 'Record Session',
      submitting: 'Recording...',
    },
    studentForm: {
      title: 'Add New Student',
      nameLabel: 'Student Name',
      namePlaceholder: 'Enter student name',
      ageLabel: 'Age',
      agePlaceholder: 'Enter student age',
      teacherLabel: 'Sheikh / Teacher',
      submit: 'Add Student',
      submitting: 'Adding...',
    },
    teacherCombobox: {
      placeholder: 'Select or type sheikh name...',
      searchPlaceholder: 'Search for sheikh or type a new name...',
      noResults: 'No sheikh found with this name',
      addNew: 'Add "{{name}}" as new sheikh',
    },
    sessionList: {
      title: 'Recent Sessions',
      empty: 'No sessions recorded yet',
      versesRange: 'Verses {{from}} to {{to}}',
    },
    studentList: {
      title: 'Students List',
      empty: 'No students registered yet',
      age: 'Age: {{age}} years',
      teacher: 'Sheikh: {{name}}',
      partsMemorized: 'Parts Memorized',
    },
    reviewCards: {
      recent: 'Recent Review',
      distant: 'Distant Review',
      new: 'New',
      surah: 'Surah:',
      fromVerse: 'From verse:',
      toVerse: 'To verse:',
    },
    toast: {
      teacherAddError: 'Error adding sheikh',
      teacherAdded: 'New sheikh added successfully',
      selectTeacher: 'Please select or add a sheikh',
      studentAddError: 'Error adding student',
      studentAdded: 'Student added successfully',
      sessionAddError: 'Error adding session',
      sessionAdded: 'Session added successfully',
      recordingStarted: 'Audio recording started',
      recordingError: 'Recording error',
      recordingErrorDescription: 'Please allow microphone access',
      recordingStopped: 'Recording stopped',
      fileUploaded: 'Audio file uploaded',
    },
    audio: {
      startRecording: 'Start Recording',
      stopRecording: 'Stop Recording',
    },
  },
};
