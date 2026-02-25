import type { Language } from './types';

export interface ExamsTranslations {
  pageTitle: string;
  heading: string;
  headingDescription: string;
  searchPlaceholder: string;
  table: {
    title: string;
    type: string;
    subject: string;
    date: string;
    duration: string;
    status: string;
    score: string;
    totalMarks: string;
    passingMarks: string;
    description: string;
    student: string;
    grade: string;
    notes: string;
    actions: string;
    examTitle: string;
  };
  actions: {
    addExam: string;
    createExam: string;
    editExam: string;
    deleteExam: string;
    viewResults: string;
    addResult: string;
    editResult: string;
    deleteResult: string;
    edit: string;
    delete: string;
    result: string;
    saveChanges: string;
  };
  status: {
    upcoming: string;
    ongoing: string;
    completed: string;
    today: string;
    passed: string;
    failed: string;
    absent: string;
  };
  tabs: {
    quran: string;
    quranExams: string;
    tajweed: string;
    tajweedExams: string;
    educational: string;
    educationalExams: string;
    results: string;
    resultsAndStats: string;
  };
  examTypes: {
    quran: string;
    tajweed: string;
    educational: string;
  };
  form: {
    titlePlaceholder: string;
    descriptionPlaceholder: string;
    selectType: string;
    selectDate: string;
    durationPlaceholder: string;
    totalMarksPlaceholder: string;
    passingMarksPlaceholder: string;
    typeLabel: string;
    titleLabel: string;
    descriptionLabel: string;
    dateLabel: string;
    durationLabel: string;
    totalMarksLabel: string;
    passingMarksLabel: string;
    selectStudent: string;
    marksLabel: string;
    notesLabel: string;
  };
  cards: {
    examsStatus: string;
    examCount: string;
    allExamsOfType: string;
    allExamsTable: string;
    minute: string;
    mark: string;
    scoreDisplay: string;
  };
  results: {
    title: string;
    description: string;
    scoreLabel: string;
  };
  stats: {
    title: string;
    description: string;
    passRate: string;
    averageScore: string;
    totalExams: string;
  };
  addDialog: {
    title: string;
    description: string;
  };
  editDialog: {
    title: string;
    description: string;
  };
  deleteDialog: {
    title: string;
    description: string;
  };
  resultDialog: {
    title: string;
    description: string;
  };
  editResultDialog: {
    title: string;
    description: string;
  };
  deleteResultDialog: {
    title: string;
    description: string;
  };
  toasts: {
    addSuccess: string;
    addSuccessDescription: string;
    editSuccess: string;
    editSuccessDescription: string;
    deleteSuccess: string;
    deleteSuccessDescription: string;
    resultAddSuccess: string;
    resultAddSuccessDescription: string;
    resultEditSuccess: string;
    resultEditSuccessDescription: string;
    resultDeleteSuccess: string;
    resultDeleteSuccessDescription: string;
    error: string;
    requiredFields: string;
  };
  deleteConfirm: string;
  empty: string;
}

export const exams: Record<Language, ExamsTranslations> = {
  ar: {
    pageTitle: 'الامتحانات',
    heading: 'الاختبارات والتقييم',
    headingDescription: 'إدارة وتتبع امتحانات القرآن والتجويد والجانب التربوي',
    searchPlaceholder: 'البحث عن امتحان...',
    table: {
      title: 'العنوان',
      type: 'النوع',
      subject: 'المادة',
      date: 'التاريخ',
      duration: 'المدة (دقيقة)',
      status: 'الحالة',
      score: 'الدرجة',
      totalMarks: 'الدرجة الكاملة',
      passingMarks: 'درجة النجاح',
      description: 'الوصف',
      student: 'الطالب',
      grade: 'التقدير',
      notes: 'ملاحظات',
      actions: 'الإجراءات',
      examTitle: 'عنوان الامتحان',
    },
    actions: {
      addExam: 'إضافة امتحان',
      createExam: 'إنشاء امتحان جديد',
      editExam: 'تعديل امتحان',
      deleteExam: 'حذف امتحان',
      viewResults: 'عرض النتائج',
      addResult: 'إضافة نتيجة',
      editResult: 'تعديل نتيجة',
      deleteResult: 'حذف نتيجة',
      edit: 'تعديل',
      delete: 'حذف',
      result: 'نتيجة',
      saveChanges: 'حفظ التعديلات',
    },
    status: {
      upcoming: 'قادم',
      ongoing: 'جارٍ',
      completed: 'منتهي',
      today: 'اليوم',
      passed: 'ناجح',
      failed: 'راسب',
      absent: 'غائب',
    },
    tabs: {
      quran: 'قرآن',
      quranExams: 'امتحانات القرآن',
      tajweed: 'تجويد',
      tajweedExams: 'امتحانات التجويد',
      educational: 'تربوي',
      educationalExams: 'امتحانات تربوية',
      results: 'النتائج',
      resultsAndStats: 'النتائج والإحصائيات',
    },
    examTypes: {
      quran: 'قرآن',
      tajweed: 'تجويد',
      educational: 'تربوي',
    },
    form: {
      titlePlaceholder: 'أدخل عنوان الامتحان',
      descriptionPlaceholder: 'أدخل وصف الامتحان',
      selectType: 'اختر نوع الامتحان',
      selectDate: 'اختر تاريخ الامتحان',
      durationPlaceholder: 'المدة بالدقائق',
      totalMarksPlaceholder: 'الدرجة الكاملة',
      passingMarksPlaceholder: 'درجة النجاح',
      typeLabel: 'النوع',
      titleLabel: 'العنوان',
      descriptionLabel: 'الوصف',
      dateLabel: 'التاريخ',
      durationLabel: 'المدة (دقائق)',
      totalMarksLabel: 'الدرجة الكاملة',
      passingMarksLabel: 'درجة النجاح',
      selectStudent: 'اختر الطالب',
      marksLabel: 'الدرجة',
      notesLabel: 'ملاحظات',
    },
    cards: {
      examsStatus: 'الامتحانات {{status}}',
      examCount: '{{count}} امتحان',
      allExamsOfType: 'جميع امتحانات {{type}}',
      allExamsTable: 'عرض جميع الامتحانات في جدول واحد',
      minute: 'دقيقة',
      mark: 'درجة',
      scoreDisplay: 'الدرجة: {{marks}}/{{total}}',
    },
    results: {
      title: 'نتائج الامتحانات',
      description: 'عرض نتائج الطلاب في جميع الامتحانات',
      scoreLabel: 'الدرجة:',
    },
    stats: {
      title: 'إحصائيات الأداء',
      description: 'نظرة عامة على أداء الطلاب',
      passRate: 'معدل النجاح',
      averageScore: 'متوسط الدرجات',
      totalExams: 'إجمالي الامتحانات',
    },
    addDialog: {
      title: 'إنشاء امتحان جديد',
      description: 'أدخل بيانات الامتحان الجديد',
    },
    editDialog: {
      title: 'تعديل الامتحان',
      description: 'قم بتعديل بيانات الامتحان',
    },
    deleteDialog: {
      title: 'تأكيد الحذف',
      description: 'هل أنت متأكد من حذف الامتحان "{{title}}"؟ لا يمكن التراجع عن هذا الإجراء.',
    },
    resultDialog: {
      title: 'إضافة نتيجة امتحان',
      description: 'أدخل نتيجة الطالب في الامتحان',
    },
    editResultDialog: {
      title: 'تعديل نتيجة الامتحان',
      description: 'قم بتعديل درجة الطالب',
    },
    deleteResultDialog: {
      title: 'تأكيد حذف النتيجة',
      description: 'هل أنت متأكد من حذف هذه النتيجة؟ لا يمكن التراجع عن هذا الإجراء.',
    },
    toasts: {
      addSuccess: 'تم الإضافة',
      addSuccessDescription: 'تم إضافة الامتحان بنجاح',
      editSuccess: 'تم التعديل',
      editSuccessDescription: 'تم تعديل الامتحان بنجاح',
      deleteSuccess: 'تم الحذف',
      deleteSuccessDescription: 'تم حذف الامتحان بنجاح',
      resultAddSuccess: 'تم الإضافة',
      resultAddSuccessDescription: 'تم إضافة النتيجة بنجاح',
      resultEditSuccess: 'تم التعديل',
      resultEditSuccessDescription: 'تم تعديل النتيجة بنجاح',
      resultDeleteSuccess: 'تم الحذف',
      resultDeleteSuccessDescription: 'تم حذف النتيجة بنجاح',
      error: 'خطأ',
      requiredFields: 'يرجى ملء جميع الحقول المطلوبة',
    },
    deleteConfirm: 'هل أنت متأكد من حذف هذا الامتحان؟',
    empty: 'لا توجد امتحانات',
  },
  en: {
    pageTitle: 'Exams',
    heading: 'Tests & Assessment',
    headingDescription: 'Manage and track Quran, Tajweed, and educational exams',
    searchPlaceholder: 'Search for an exam...',
    table: {
      title: 'Title',
      type: 'Type',
      subject: 'Subject',
      date: 'Date',
      duration: 'Duration (min)',
      status: 'Status',
      score: 'Score',
      totalMarks: 'Total Marks',
      passingMarks: 'Passing Marks',
      description: 'Description',
      student: 'Student',
      grade: 'Grade',
      notes: 'Notes',
      actions: 'Actions',
      examTitle: 'Exam Title',
    },
    actions: {
      addExam: 'Add Exam',
      createExam: 'Create New Exam',
      editExam: 'Edit Exam',
      deleteExam: 'Delete Exam',
      viewResults: 'View Results',
      addResult: 'Add Result',
      editResult: 'Edit Result',
      deleteResult: 'Delete Result',
      edit: 'Edit',
      delete: 'Delete',
      result: 'Result',
      saveChanges: 'Save Changes',
    },
    status: {
      upcoming: 'Upcoming',
      ongoing: 'Ongoing',
      completed: 'Completed',
      today: 'Today',
      passed: 'Passed',
      failed: 'Failed',
      absent: 'Absent',
    },
    tabs: {
      quran: 'Quran',
      quranExams: 'Quran Exams',
      tajweed: 'Tajweed',
      tajweedExams: 'Tajweed Exams',
      educational: 'Educational',
      educationalExams: 'Educational Exams',
      results: 'Results',
      resultsAndStats: 'Results & Statistics',
    },
    examTypes: {
      quran: 'Quran',
      tajweed: 'Tajweed',
      educational: 'Educational',
    },
    form: {
      titlePlaceholder: 'Enter exam title',
      descriptionPlaceholder: 'Enter exam description',
      selectType: 'Select exam type',
      selectDate: 'Select exam date',
      durationPlaceholder: 'Duration in minutes',
      totalMarksPlaceholder: 'Total marks',
      passingMarksPlaceholder: 'Passing marks',
      typeLabel: 'Type',
      titleLabel: 'Title',
      descriptionLabel: 'Description',
      dateLabel: 'Date',
      durationLabel: 'Duration (min)',
      totalMarksLabel: 'Total Marks',
      passingMarksLabel: 'Passing Marks',
      selectStudent: 'Select student',
      marksLabel: 'Score',
      notesLabel: 'Notes',
    },
    cards: {
      examsStatus: '{{status}} Exams',
      examCount: '{{count}} exam(s)',
      allExamsOfType: 'All {{type}} Exams',
      allExamsTable: 'View all exams in one table',
      minute: 'min',
      mark: 'marks',
      scoreDisplay: 'Score: {{marks}}/{{total}}',
    },
    results: {
      title: 'Exam Results',
      description: 'View student results across all exams',
      scoreLabel: 'Score:',
    },
    stats: {
      title: 'Performance Statistics',
      description: 'Overview of student performance',
      passRate: 'Pass Rate',
      averageScore: 'Average Score',
      totalExams: 'Total Exams',
    },
    addDialog: {
      title: 'Create New Exam',
      description: 'Enter new exam details',
    },
    editDialog: {
      title: 'Edit Exam',
      description: 'Edit exam details',
    },
    deleteDialog: {
      title: 'Confirm Deletion',
      description: 'Are you sure you want to delete exam "{{title}}"? This action cannot be undone.',
    },
    resultDialog: {
      title: 'Add Exam Result',
      description: 'Enter student exam result',
    },
    editResultDialog: {
      title: 'Edit Exam Result',
      description: 'Edit student score',
    },
    deleteResultDialog: {
      title: 'Confirm Result Deletion',
      description: 'Are you sure you want to delete this result? This action cannot be undone.',
    },
    toasts: {
      addSuccess: 'Added',
      addSuccessDescription: 'Exam added successfully',
      editSuccess: 'Updated',
      editSuccessDescription: 'Exam updated successfully',
      deleteSuccess: 'Deleted',
      deleteSuccessDescription: 'Exam deleted successfully',
      resultAddSuccess: 'Added',
      resultAddSuccessDescription: 'Result added successfully',
      resultEditSuccess: 'Updated',
      resultEditSuccessDescription: 'Result updated successfully',
      resultDeleteSuccess: 'Deleted',
      resultDeleteSuccessDescription: 'Result deleted successfully',
      error: 'Error',
      requiredFields: 'Please fill in all required fields',
    },
    deleteConfirm: 'Are you sure you want to delete this exam?',
    empty: 'No exams found',
  },
};
