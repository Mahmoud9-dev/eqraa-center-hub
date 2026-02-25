import type { Language } from './types';

export interface AdminTranslations {
  pageTitle: string;
  stats: {
    totalStudents: string;
    totalTeachers: string;
    quranStudents: string;
  };
  tabs: {
    teachers: string;
    students: string;
  };
  departments: {
    quran: string;
    tajweed: string;
    tarbawi: string;
  };
  teacherForm: {
    title: string;
    name: string;
    namePlaceholder: string;
    specialization: string;
    specializationPlaceholder: string;
    department: string;
    emailOptional: string;
    phoneOptional: string;
    submit: string;
    submitting: string;
  };
  teacherList: {
    title: string;
    empty: string;
    departmentPrefix: string;
  };
  studentList: {
    title: string;
    empty: string;
    age: string;
    partsMemorized: string;
  };
  toast: {
    validationError: string;
    addTeacherError: string;
    addTeacherSuccess: string;
  };
}

export const admin: Record<Language, AdminTranslations> = {
  ar: {
    pageTitle: 'الإدارة',
    stats: {
      totalStudents: 'إجمالي الطلاب',
      totalTeachers: 'عدد المعلمين',
      quranStudents: 'طلاب التحفيظ',
    },
    tabs: {
      teachers: 'المعلمون',
      students: 'الطلاب',
    },
    departments: {
      quran: 'القرآن',
      tajweed: 'التجويد',
      tarbawi: 'التربوي',
    },
    teacherForm: {
      title: 'إضافة معلم جديد',
      name: 'اسم المعلم',
      namePlaceholder: 'أدخل اسم المعلم',
      specialization: 'التخصص',
      specializationPlaceholder: 'مثال: تحفيظ القرآن',
      department: 'القسم',
      emailOptional: 'البريد الإلكتروني (اختياري)',
      phoneOptional: 'رقم الهاتف (اختياري)',
      submit: 'إضافة المعلم',
      submitting: 'جاري الإضافة...',
    },
    teacherList: {
      title: 'قائمة المعلمين',
      empty: 'لا يوجد معلمون مسجلون بعد',
      departmentPrefix: 'قسم',
    },
    studentList: {
      title: 'جميع الطلاب',
      empty: 'لا يوجد طلاب مسجلون بعد',
      age: 'العمر: {age} سنة',
      partsMemorized: 'محفوظ: {parts} جزء',
    },
    toast: {
      validationError: 'خطأ في البيانات',
      addTeacherError: 'خطأ في إضافة المعلم',
      addTeacherSuccess: 'تم إضافة المعلم بنجاح',
    },
  },
  en: {
    pageTitle: 'Administration',
    stats: {
      totalStudents: 'Total Students',
      totalTeachers: 'Total Teachers',
      quranStudents: 'Quran Students',
    },
    tabs: {
      teachers: 'Teachers',
      students: 'Students',
    },
    departments: {
      quran: 'Quran',
      tajweed: 'Tajweed',
      tarbawi: 'Tarbawi',
    },
    teacherForm: {
      title: 'Add New Teacher',
      name: 'Teacher Name',
      namePlaceholder: 'Enter teacher name',
      specialization: 'Specialization',
      specializationPlaceholder: 'e.g. Quran memorization',
      department: 'Department',
      emailOptional: 'Email (optional)',
      phoneOptional: 'Phone (optional)',
      submit: 'Add Teacher',
      submitting: 'Adding...',
    },
    teacherList: {
      title: 'Teachers List',
      empty: 'No teachers registered yet',
      departmentPrefix: 'Department:',
    },
    studentList: {
      title: 'All Students',
      empty: 'No students registered yet',
      age: 'Age: {age} years',
      partsMemorized: 'Memorized: {parts} parts',
    },
    toast: {
      validationError: 'Validation Error',
      addTeacherError: 'Failed to add teacher',
      addTeacherSuccess: 'Teacher added successfully',
    },
  },
};
