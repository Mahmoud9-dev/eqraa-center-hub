import type { Language } from './types';

export interface TajweedTranslations {
  pageTitle: string;
  lessonForm: {
    title: string;
    topic: string;
    topicPlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    submit: string;
    submitting: string;
  };
  rulesPanel: {
    title: string;
    subtitle: string;
    noonSakinah: {
      name: string;
      description: string;
    };
    madd: {
      name: string;
      description: string;
    };
    letterAttributes: {
      name: string;
      description: string;
    };
  };
  lessonList: {
    title: string;
    empty: string;
    noDate: string;
  };
  toast: {
    addLessonError: string;
    addLessonSuccess: string;
  };
}

export const tajweed: Record<Language, TajweedTranslations> = {
  ar: {
    pageTitle: 'التجويد',
    lessonForm: {
      title: 'إضافة درس تجويد',
      topic: 'موضوع الدرس',
      topicPlaceholder: 'مثال: أحكام النون الساكنة',
      description: 'شرح الدرس',
      descriptionPlaceholder: 'اشرح محتوى الدرس والنقاط المهمة',
      submit: 'إضافة الدرس',
      submitting: 'جاري الإضافة...',
    },
    rulesPanel: {
      title: 'أحكام التجويد',
      subtitle: 'دراسة وتطبيق أحكام التجويد والتلاوة الصحيحة',
      noonSakinah: {
        name: 'أحكام النون الساكنة والتنوين',
        description: 'الإظهار، الإدغام، الإقلاب، الإخفاء',
      },
      madd: {
        name: 'أحكام المدود',
        description: 'المد الطبيعي والفرعي وأنواعه',
      },
      letterAttributes: {
        name: 'صفات الحروف',
        description: 'الصفات اللازمة والعارضة',
      },
    },
    lessonList: {
      title: 'الدروس المسجلة',
      empty: 'لا توجد دروس مسجلة بعد',
      noDate: 'بدون تاريخ',
    },
    toast: {
      addLessonError: 'خطأ في إضافة الدرس',
      addLessonSuccess: 'تم إضافة الدرس بنجاح',
    },
  },
  en: {
    pageTitle: 'Tajweed',
    lessonForm: {
      title: 'Add Tajweed Lesson',
      topic: 'Lesson Topic',
      topicPlaceholder: 'e.g. Rules of Noon Sakinah',
      description: 'Lesson Description',
      descriptionPlaceholder: 'Describe the lesson content and key points',
      submit: 'Add Lesson',
      submitting: 'Adding...',
    },
    rulesPanel: {
      title: 'Tajweed Rules',
      subtitle: 'Study and apply the rules of Tajweed and proper recitation',
      noonSakinah: {
        name: 'Rules of Noon Sakinah and Tanween',
        description: 'Izhar, Idgham, Iqlab, Ikhfa',
      },
      madd: {
        name: 'Rules of Madd (Elongation)',
        description: 'Natural and secondary Madd and their types',
      },
      letterAttributes: {
        name: 'Letter Attributes',
        description: 'Permanent and temporary attributes',
      },
    },
    lessonList: {
      title: 'Recorded Lessons',
      empty: 'No lessons recorded yet',
      noDate: 'No date',
    },
    toast: {
      addLessonError: 'Failed to add lesson',
      addLessonSuccess: 'Lesson added successfully',
    },
  },
};
