import type { Language } from './types';

export interface SubjectsTranslations {
  pageTitle: string;
  subtitle: string;
  heading: string;
  /** Label map for DB Arabic subject name values */
  subjectNameLabels: {
    aqeedah: string;
    fiqh: string;
    seerah: string;
    tafseer: string;
    hadith: string;
    tarbiyah: string;
    arabic: string;
  };
  /** Label map for DB Arabic resource type values */
  resourceTypeLabels: {
    video: string;
    audio: string;
    pdf: string;
    link: string;
  };
  /** Human-readable category names for lesson type groupings */
  lessonCategories: {
    video: string;
    audio: string;
    pdf: string;
    link: string;
  };
  subjectForm: {
    addSubject: string;
    addSubjectTitle: string;
    addSubjectDescription: string;
    subjectName: string;
    subjectNamePlaceholder: string;
    description: string;
    teacher: string;
    teacherPlaceholder: string;
    cancel: string;
    submit: string;
  };
  lessonForm: {
    addLesson: string;
    addLessonTitle: string;
    addLessonDescription: string;
    lessonTitle: string;
    description: string;
    contentType: string;
    contentTypePlaceholder: string;
    contentUrl: string;
    order: string;
    cancel: string;
    submit: string;
  };
  assignmentForm: {
    addAssignment: string;
    addAssignmentTitle: string;
    addAssignmentDescription: string;
    assignmentTitle: string;
    description: string;
    dueDate: string;
    totalMarks: string;
    cancel: string;
    submit: string;
  };
  sections: {
    lessons: string;
    lessonsDescription: string;
    assignments: string;
    assignmentsDescription: string;
    questions: string;
    questionsDescription: string;
  };
  table: {
    title: string;
    dueDate: string;
    actions: string;
    order: string;
  };
  empty: {
    noLessons: string;
    noQuestions: string;
  };
  toast: {
    addSubjectSuccess: string;
    addSubjectSuccessDescription: string;
    addLessonSuccess: string;
    addLessonSuccessDescription: string;
    addAssignmentSuccess: string;
    addAssignmentSuccessDescription: string;
    viewLesson: string;
    viewLessonDescription: string;
    editLesson: string;
    editLessonDescription: string;
    deleteLesson: string;
    deleteLessonDescription: string;
    deleteLessonSuccess: string;
    deleteLessonSuccessDescription: string;
    viewAssignment: string;
    viewAssignmentDescription: string;
    editAssignment: string;
    editAssignmentDescription: string;
    deleteAssignment: string;
    deleteAssignmentDescription: string;
    deleteAssignmentSuccess: string;
    deleteAssignmentSuccessDescription: string;
    askQuestion: string;
    askQuestionDescription: string;
  };
  actions: {
    view: string;
    edit: string;
    delete: string;
    askNewQuestion: string;
  };
  lessonCount: string;
}

export const subjects: Record<Language, SubjectsTranslations> = {
  ar: {
    pageTitle: 'المواد الدراسية الشرعية',
    subtitle: 'إدارة ومتابعة جميع المواد الدراسية الشرعية والدروس المتاحة',
    heading: 'المواد الدراسية',
    subjectNameLabels: {
      aqeedah: 'عقيدة',
      fiqh: 'فقه',
      seerah: 'سيرة',
      tafseer: 'تفسير',
      hadith: 'حديث',
      tarbiyah: 'تربية',
      arabic: 'لغة عربية',
    },
    resourceTypeLabels: {
      video: 'فيديو',
      audio: 'صوت',
      pdf: 'PDF',
      link: 'رابط',
    },
    lessonCategories: {
      video: 'المرئية',
      audio: 'الصوتية',
      pdf: 'المكتوبة',
      link: 'الروابط',
    },
    subjectForm: {
      addSubject: 'إضافة مادة جديدة',
      addSubjectTitle: 'إضافة مادة جديدة',
      addSubjectDescription: 'أدخل بيانات المادة الجديدة',
      subjectName: 'اسم المادة',
      subjectNamePlaceholder: 'اختر المادة',
      description: 'الوصف',
      teacher: 'المعلم',
      teacherPlaceholder: 'اختر المعلم',
      cancel: 'إلغاء',
      submit: 'إضافة مادة',
    },
    lessonForm: {
      addLesson: 'إضافة درس',
      addLessonTitle: 'إضافة درس جديد',
      addLessonDescription: 'أدخل بيانات الدرس الجديد',
      lessonTitle: 'عنوان الدرس',
      description: 'الوصف',
      contentType: 'نوع المحتوى',
      contentTypePlaceholder: 'اختر النوع',
      contentUrl: 'رابط المحتوى',
      order: 'الترتيب',
      cancel: 'إلغاء',
      submit: 'إضافة درس',
    },
    assignmentForm: {
      addAssignment: 'إضافة واجب',
      addAssignmentTitle: 'إضافة واجب جديد',
      addAssignmentDescription: 'أدخل بيانات الواجب الجديد',
      assignmentTitle: 'عنوان الواجب',
      description: 'الوصف',
      dueDate: 'تاريخ التسليم',
      totalMarks: 'الدرجة الكاملة',
      cancel: 'إلغاء',
      submit: 'إضافة واجب',
    },
    sections: {
      lessons: 'الدروس',
      lessonsDescription: 'جميع دروس المادة المتاحة',
      assignments: 'الواجبات والاختبارات',
      assignmentsDescription: 'واجبات واختبارات المادة',
      questions: 'أسئلة موجهة للشيخ',
      questionsDescription: 'طرح الأسئلة والمشاكل على المدرس',
    },
    table: {
      title: 'العنوان',
      dueDate: 'تاريخ التسليم',
      actions: 'الإجراءات',
      order: 'الترتيب',
    },
    empty: {
      noLessons: 'لا توجد دروس متاحة لهذه المادة',
      noQuestions: 'لا توجد أسئلة حالياً',
    },
    toast: {
      addSubjectSuccess: 'تم الإضافة',
      addSubjectSuccessDescription: 'تم إضافة المادة بنجاح',
      addLessonSuccess: 'تم الإضافة',
      addLessonSuccessDescription: 'تم إضافة الدرس بنجاح',
      addAssignmentSuccess: 'تم الإضافة',
      addAssignmentSuccessDescription: 'تم إضافة الواجب بنجاح',
      viewLesson: 'عرض الدرس',
      viewLessonDescription: 'جاري فتح الدرس...',
      editLesson: 'تعديل الدرس',
      editLessonDescription: 'جاري فتح نافذة التعديل...',
      deleteLesson: 'حذف الدرس',
      deleteLessonDescription: 'جاري حذف الدرس...',
      deleteLessonSuccess: 'تم الحذف',
      deleteLessonSuccessDescription: 'تم حذف الدرس بنجاح',
      viewAssignment: 'عرض الواجب',
      viewAssignmentDescription: 'جاري فتح الواجب...',
      editAssignment: 'تعديل الواجب',
      editAssignmentDescription: 'جاري فتح نافذة التعديل...',
      deleteAssignment: 'حذف الواجب',
      deleteAssignmentDescription: 'جاري حذف الواجب...',
      deleteAssignmentSuccess: 'تم الحذف',
      deleteAssignmentSuccessDescription: 'تم حذف الواجب بنجاح',
      askQuestion: 'طرح سؤال',
      askQuestionDescription: 'جاري فتح نافذة طرح السؤال...',
    },
    actions: {
      view: 'عرض',
      edit: 'تعديل',
      delete: 'حذف',
      askNewQuestion: 'طرح سؤال جديد',
    },
    lessonCount: 'درس',
  },
  en: {
    pageTitle: 'Islamic Studies Subjects',
    subtitle: 'Manage and track all Islamic studies subjects and available lessons',
    heading: 'Subjects',
    subjectNameLabels: {
      aqeedah: 'Aqeedah',
      fiqh: 'Fiqh',
      seerah: 'Seerah',
      tafseer: 'Tafseer',
      hadith: 'Hadith',
      tarbiyah: 'Tarbiyah',
      arabic: 'Arabic Language',
    },
    resourceTypeLabels: {
      video: 'Video',
      audio: 'Audio',
      pdf: 'PDF',
      link: 'Link',
    },
    lessonCategories: {
      video: 'Video',
      audio: 'Audio',
      pdf: 'Written',
      link: 'Links',
    },
    subjectForm: {
      addSubject: 'Add New Subject',
      addSubjectTitle: 'Add New Subject',
      addSubjectDescription: 'Enter the new subject details',
      subjectName: 'Subject Name',
      subjectNamePlaceholder: 'Select subject',
      description: 'Description',
      teacher: 'Teacher',
      teacherPlaceholder: 'Select teacher',
      cancel: 'Cancel',
      submit: 'Add Subject',
    },
    lessonForm: {
      addLesson: 'Add Lesson',
      addLessonTitle: 'Add New Lesson',
      addLessonDescription: 'Enter the new lesson details',
      lessonTitle: 'Lesson Title',
      description: 'Description',
      contentType: 'Content Type',
      contentTypePlaceholder: 'Select type',
      contentUrl: 'Content URL',
      order: 'Order',
      cancel: 'Cancel',
      submit: 'Add Lesson',
    },
    assignmentForm: {
      addAssignment: 'Add Assignment',
      addAssignmentTitle: 'Add New Assignment',
      addAssignmentDescription: 'Enter the new assignment details',
      assignmentTitle: 'Assignment Title',
      description: 'Description',
      dueDate: 'Due Date',
      totalMarks: 'Total Marks',
      cancel: 'Cancel',
      submit: 'Add Assignment',
    },
    sections: {
      lessons: 'Lessons',
      lessonsDescription: 'All available lessons for the subject',
      assignments: 'Assignments & Tests',
      assignmentsDescription: 'Subject assignments and tests',
      questions: 'Questions for the Teacher',
      questionsDescription: 'Ask questions and raise issues with the teacher',
    },
    table: {
      title: 'Title',
      dueDate: 'Due Date',
      actions: 'Actions',
      order: 'Order',
    },
    empty: {
      noLessons: 'No lessons available for this subject',
      noQuestions: 'No questions at the moment',
    },
    toast: {
      addSubjectSuccess: 'Added',
      addSubjectSuccessDescription: 'Subject added successfully',
      addLessonSuccess: 'Added',
      addLessonSuccessDescription: 'Lesson added successfully',
      addAssignmentSuccess: 'Added',
      addAssignmentSuccessDescription: 'Assignment added successfully',
      viewLesson: 'View Lesson',
      viewLessonDescription: 'Opening lesson...',
      editLesson: 'Edit Lesson',
      editLessonDescription: 'Opening edit dialog...',
      deleteLesson: 'Delete Lesson',
      deleteLessonDescription: 'Deleting lesson...',
      deleteLessonSuccess: 'Deleted',
      deleteLessonSuccessDescription: 'Lesson deleted successfully',
      viewAssignment: 'View Assignment',
      viewAssignmentDescription: 'Opening assignment...',
      editAssignment: 'Edit Assignment',
      editAssignmentDescription: 'Opening edit dialog...',
      deleteAssignment: 'Delete Assignment',
      deleteAssignmentDescription: 'Deleting assignment...',
      deleteAssignmentSuccess: 'Deleted',
      deleteAssignmentSuccessDescription: 'Assignment deleted successfully',
      askQuestion: 'Ask Question',
      askQuestionDescription: 'Opening question dialog...',
    },
    actions: {
      view: 'View',
      edit: 'Edit',
      delete: 'Delete',
      askNewQuestion: 'Ask a New Question',
    },
    lessonCount: 'lesson(s)',
  },
};
