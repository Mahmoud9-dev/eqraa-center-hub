import type { Language } from './types';

// ---------------------------------------------------------------------------
// Shared sub-page shape — every sub-view follows the same CRUD pattern
// ---------------------------------------------------------------------------
interface SubPageTranslations {
  pageTitle: string;
  bannerTitle: string;
  bannerSubtitle: string;
  addButton: string;
  dialog: {
    title: string;
    description: string;
    itemTitle: string;
    itemDescription: string;
    teacher: string;
    duration: string;
    durationPlaceholder: string;
    verses: string;
    versesPlaceholder: string;
    recording: string;
    recordingPlaceholder: string;
    recordingAvailable: string;
    recordingProcessing: string;
    cancel: string;
    submit: string;
  };
  card: {
    teacher: string;
    date: string;
    duration: string;
    verses: string;
    recordingAvailable: string;
    recordingProcessing: string;
    watchRecording: string;
    comingSoon: string;
    downloadMaterial: string;
    delete: string;
  };
  deleteDialog: {
    title: string;
    /** Use {{title}} as the item-title placeholder */
    message: string;
    cancel: string;
    confirm: string;
  };
  toast: {
    addSuccess: string;
    addSuccessDescription: string;
    deleteSuccess: string;
    deleteSuccessDescription: string;
    validationError: string;
    validationErrorDescription: string;
    openRecording: string;
    openRecordingDescription: string;
    recordingUnavailable: string;
    recordingUnavailableDescription: string;
    downloadMaterial: string;
    downloadMaterialDescription: string;
  };
}

export interface EducationalTranslations {
  main: {
    pageTitle: string;
    banner: {
      title: string;
      subtitle: string;
    };
    sessionForm: {
      title: string;
      student: string;
      studentPlaceholder: string;
      teacher: string;
      teacherPlaceholder: string;
      topic: string;
      topicPlaceholder: string;
      description: string;
      descriptionPlaceholder: string;
      rating: string;
      submitting: string;
      submit: string;
    };
    studentForm: {
      title: string;
      name: string;
      namePlaceholder: string;
      age: string;
      agePlaceholder: string;
      grade: string;
      gradePlaceholder: string;
      submitting: string;
      submit: string;
    };
    registeredStudents: {
      title: string;
      empty: string;
      ageLabel: string;
      yearUnit: string;
    };
    registeredSessions: {
      title: string;
      empty: string;
      studentLabel: string;
      teacherLabel: string;
    };
    toast: {
      addStudentSuccess: string;
      addStudentError: string;
      addSessionSuccess: string;
      addSessionError: string;
    };
  };
  iconLabels: {
    islamicLessons: string;
    ethicsBehavior: string;
    lifeSkills: string;
    studentActivities: string;
    familyPrograms: string;
    guidanceCounseling: string;
  };
  subPages: {
    islamicLessons: SubPageTranslations;
    ethicsBehavior: SubPageTranslations;
    lifeSkills: SubPageTranslations;
    studentActivities: SubPageTranslations;
    familyPrograms: SubPageTranslations;
    guidanceCounseling: SubPageTranslations;
  };
}

export const educational: Record<Language, EducationalTranslations> = {
  ar: {
    main: {
      pageTitle: 'التربوي',
      banner: {
        title: 'البرامج التربوية والتعليمية',
        subtitle: 'تطوير القيم الإسلامية والمهارات التربوية للطلاب',
      },
      sessionForm: {
        title: 'تسجيل حلقة تربوية',
        student: 'الطالب',
        studentPlaceholder: 'اختر الطالب',
        teacher: 'المعلم',
        teacherPlaceholder: 'اختر المعلم',
        topic: 'الموضوع',
        topicPlaceholder: 'مثال: الأخلاق الإسلامية',
        description: 'الوصف',
        descriptionPlaceholder: 'وصف الحلقة...',
        rating: 'التقييم (1-10):',
        submitting: 'جاري التسجيل...',
        submit: 'تسجيل الحلقة',
      },
      studentForm: {
        title: 'تسجيل طالب في البرنامج التربوي',
        name: 'اسم الطالب',
        namePlaceholder: 'أدخل اسم الطالب',
        age: 'العمر',
        agePlaceholder: 'أدخل العمر',
        grade: 'الصف الدراسي',
        gradePlaceholder: 'مثال: الصف الخامس',
        submitting: 'جاري التسجيل...',
        submit: 'تسجيل الطالب',
      },
      registeredStudents: {
        title: 'الطلاب المسجلون',
        empty: 'لا يوجد طلاب مسجلين في البرنامج التربوي بعد',
        ageLabel: 'العمر:',
        yearUnit: 'سنة',
      },
      registeredSessions: {
        title: 'الحلقات المسجلة',
        empty: 'لا توجد حلقات مسجلة بعد',
        studentLabel: 'الطالب:',
        teacherLabel: 'المعلم:',
      },
      toast: {
        addStudentSuccess: 'تم إضافة الطالب بنجاح',
        addStudentError: 'خطأ في إضافة الطالب',
        addSessionSuccess: 'تم إضافة الحلقة بنجاح',
        addSessionError: 'خطأ في إضافة الحلقة',
      },
    },
    iconLabels: {
      islamicLessons: 'الدروس الشرعية',
      ethicsBehavior: 'الأخلاق والسلوك',
      lifeSkills: 'المهارات الحياتية',
      studentActivities: 'الأنشطة الطلابية',
      familyPrograms: 'برامج الأسرة',
      guidanceCounseling: 'الإرشاد والتوجيه',
    },
    subPages: {
      islamicLessons: {
        pageTitle: 'الدروس الشرعية',
        bannerTitle: 'الدروس الشرعية',
        bannerSubtitle: 'دروس متخصصة في العقيدة والفقه والسيرة النبوية',
        addButton: 'إضافة درس جديد',
        dialog: {
          title: 'إضافة درس شرعي جديد',
          description: 'أدخل بيانات الدرس الجديد في النموذج أدناه',
          itemTitle: 'عنوان الدرس',
          itemDescription: 'الوصف',
          teacher: 'المعلم',
          duration: 'المدة',
          durationPlaceholder: 'مثال: 45 دقيقة',
          verses: 'الآيات',
          versesPlaceholder: 'مثال: البقرة 255-285',
          recording: 'التسجيل',
          recordingPlaceholder: 'اختر حالة التسجيل',
          recordingAvailable: 'متاح',
          recordingProcessing: 'قيد المعالجة',
          cancel: 'إلغاء',
          submit: 'إضافة الدرس',
        },
        card: {
          teacher: 'المعلم:',
          date: 'التاريخ:',
          duration: 'المدة:',
          verses: 'الآيات:',
          recordingAvailable: 'متاح التسجيل',
          recordingProcessing: 'قيد المعالجة',
          watchRecording: 'مشاهدة التسجيل',
          comingSoon: 'قريباً',
          downloadMaterial: 'تحميل المادة',
          delete: 'حذف',
        },
        deleteDialog: {
          title: 'تأكيد الحذف',
          message: 'هل أنت متأكد من حذف الدرس "{{title}}"؟ لا يمكن التراجع عن هذا الإجراء.',
          cancel: 'إلغاء',
          confirm: 'حذف',
        },
        toast: {
          addSuccess: 'تم الإضافة',
          addSuccessDescription: 'تم إضافة الدرس بنجاح',
          deleteSuccess: 'تم الحذف',
          deleteSuccessDescription: 'تم حذف الدرس بنجاح',
          validationError: 'خطأ',
          validationErrorDescription: 'يرجى ملء جميع الحقول المطلوبة',
          openRecording: 'فتح التسجيل',
          openRecordingDescription: 'جاري فتح تسجيل الدرس...',
          recordingUnavailable: 'التسجيل غير متاح',
          recordingUnavailableDescription: 'هذا الدرس قيد المعالجة وسيكون متاحاً قريباً',
          downloadMaterial: 'تحميل المادة',
          downloadMaterialDescription: 'جاري تحميل مادة الدرس...',
        },
      },
      ethicsBehavior: {
        pageTitle: 'الأخلاق والسلوك',
        bannerTitle: 'الأخلاق والسلوك',
        bannerSubtitle: 'تعزيز القيم الأخلاقية والسلوك الإسلامي في حياة الطلاب',
        addButton: 'إضافة درس جديد',
        dialog: {
          title: 'إضافة درس جديد في الأخلاق والسلوك',
          description: 'أدخل بيانات الدرس الجديد في النموذج أدناه',
          itemTitle: 'عنوان الدرس',
          itemDescription: 'الوصف',
          teacher: 'المعلم',
          duration: 'المدة',
          durationPlaceholder: 'مثال: 40 دقيقة',
          verses: 'الآيات',
          versesPlaceholder: 'مثال: الأعراف 31-36',
          recording: 'التسجيل',
          recordingPlaceholder: 'اختر حالة التسجيل',
          recordingAvailable: 'متاح',
          recordingProcessing: 'قيد المعالجة',
          cancel: 'إلغاء',
          submit: 'إضافة الدرس',
        },
        card: {
          teacher: 'المعلم:',
          date: 'التاريخ:',
          duration: 'المدة:',
          verses: 'الآيات:',
          recordingAvailable: 'متاح التسجيل',
          recordingProcessing: 'قيد المعالجة',
          watchRecording: 'مشاهدة التسجيل',
          comingSoon: 'قريباً',
          downloadMaterial: 'تحميل المادة',
          delete: 'حذف',
        },
        deleteDialog: {
          title: 'تأكيد الحذف',
          message: 'هل أنت متأكد من حذف الدرس "{{title}}"؟ لا يمكن التراجع عن هذا الإجراء.',
          cancel: 'إلغاء',
          confirm: 'حذف',
        },
        toast: {
          addSuccess: 'تم الإضافة',
          addSuccessDescription: 'تم إضافة الدرس بنجاح',
          deleteSuccess: 'تم الحذف',
          deleteSuccessDescription: 'تم حذف الدرس بنجاح',
          validationError: 'خطأ',
          validationErrorDescription: 'يرجى ملء جميع الحقول المطلوبة',
          openRecording: 'فتح التسجيل',
          openRecordingDescription: 'جاري فتح تسجيل الدرس...',
          recordingUnavailable: 'التسجيل غير متاح',
          recordingUnavailableDescription: 'هذا الدرس قيد المعالجة وسيكون متاحاً قريباً',
          downloadMaterial: 'تحميل المادة',
          downloadMaterialDescription: 'جاري تحميل مادة الدرس...',
        },
      },
      lifeSkills: {
        pageTitle: 'المهارات الحياتية',
        bannerTitle: 'المهارات الحياتية',
        bannerSubtitle: 'تطوير مهارات التواصل والقيادة والعمل الجماعي',
        addButton: 'إضافة درس جديد',
        dialog: {
          title: 'إضافة درس جديد في المهارات الحياتية',
          description: 'أدخل بيانات الدرس الجديد في النموذج أدناه',
          itemTitle: 'عنوان الدرس',
          itemDescription: 'الوصف',
          teacher: 'المعلم',
          duration: 'المدة',
          durationPlaceholder: 'مثال: 50 دقيقة',
          verses: 'الآيات',
          versesPlaceholder: 'مثال: الحجرات 11-13',
          recording: 'التسجيل',
          recordingPlaceholder: 'اختر حالة التسجيل',
          recordingAvailable: 'متاح',
          recordingProcessing: 'قيد المعالجة',
          cancel: 'إلغاء',
          submit: 'إضافة الدرس',
        },
        card: {
          teacher: 'المعلم:',
          date: 'التاريخ:',
          duration: 'المدة:',
          verses: 'الآيات:',
          recordingAvailable: 'متاح التسجيل',
          recordingProcessing: 'قيد المعالجة',
          watchRecording: 'مشاهدة التسجيل',
          comingSoon: 'قريباً',
          downloadMaterial: 'تحميل المادة',
          delete: 'حذف',
        },
        deleteDialog: {
          title: 'تأكيد الحذف',
          message: 'هل أنت متأكد من حذف الدرس "{{title}}"؟ لا يمكن التراجع عن هذا الإجراء.',
          cancel: 'إلغاء',
          confirm: 'حذف',
        },
        toast: {
          addSuccess: 'تم الإضافة',
          addSuccessDescription: 'تم إضافة الدرس بنجاح',
          deleteSuccess: 'تم الحذف',
          deleteSuccessDescription: 'تم حذف الدرس بنجاح',
          validationError: 'خطأ',
          validationErrorDescription: 'يرجى ملء جميع الحقول المطلوبة',
          openRecording: 'فتح التسجيل',
          openRecordingDescription: 'جاري فتح تسجيل الدرس...',
          recordingUnavailable: 'التسجيل غير متاح',
          recordingUnavailableDescription: 'هذا الدرس قيد المعالجة وسيكون متاحاً قريباً',
          downloadMaterial: 'تحميل المادة',
          downloadMaterialDescription: 'جاري تحميل مادة الدرس...',
        },
      },
      studentActivities: {
        pageTitle: 'الأنشطة الطلابية',
        bannerTitle: 'الأنشطة الطلابية',
        bannerSubtitle: 'مسابقات وفعاليات تربوية هادفة لتطوير مهارات الطلاب',
        addButton: 'إضافة نشاط جديد',
        dialog: {
          title: 'إضافة نشاط طلابي جديد',
          description: 'أدخل بيانات النشاط الجديد في النموذج أدناه',
          itemTitle: 'عنوان النشاط',
          itemDescription: 'الوصف',
          teacher: 'المشرف',
          duration: 'المدة',
          durationPlaceholder: 'مثال: يوم كامل',
          verses: 'الآيات',
          versesPlaceholder: 'مثال: المزمل 1-20',
          recording: 'التسجيل',
          recordingPlaceholder: 'اختر حالة التسجيل',
          recordingAvailable: 'متاح',
          recordingProcessing: 'قيد المعالجة',
          cancel: 'إلغاء',
          submit: 'إضافة النشاط',
        },
        card: {
          teacher: 'المشرف:',
          date: 'التاريخ:',
          duration: 'المدة:',
          verses: 'الآيات:',
          recordingAvailable: 'متاح التسجيل',
          recordingProcessing: 'قيد المعالجة',
          watchRecording: 'مشاهدة التسجيل',
          comingSoon: 'قريباً',
          downloadMaterial: 'تحميل المادة',
          delete: 'حذف',
        },
        deleteDialog: {
          title: 'تأكيد الحذف',
          message: 'هل أنت متأكد من حذف النشاط "{{title}}"؟ لا يمكن التراجع عن هذا الإجراء.',
          cancel: 'إلغاء',
          confirm: 'حذف',
        },
        toast: {
          addSuccess: 'تم الإضافة',
          addSuccessDescription: 'تم إضافة النشاط بنجاح',
          deleteSuccess: 'تم الحذف',
          deleteSuccessDescription: 'تم حذف النشاط بنجاح',
          validationError: 'خطأ',
          validationErrorDescription: 'يرجى ملء جميع الحقول المطلوبة',
          openRecording: 'فتح التسجيل',
          openRecordingDescription: 'جاري فتح تسجيل النشاط...',
          recordingUnavailable: 'التسجيل غير متاح',
          recordingUnavailableDescription: 'هذا النشاط قيد المعالجة وسيكون متاحاً قريباً',
          downloadMaterial: 'تحميل المادة',
          downloadMaterialDescription: 'جاري تحميل مادة النشاط...',
        },
      },
      familyPrograms: {
        pageTitle: 'برامج الأسرة',
        bannerTitle: 'برامج الأسرة',
        bannerSubtitle: 'إشراك الأسرة في العملية التربوية وتعزيز العلاقات الأسرية',
        addButton: 'إضافة برنامج جديد',
        dialog: {
          title: 'إضافة برنامج أسرة جديد',
          description: 'أدخل بيانات البرنامج الجديد في النموذج أدناه',
          itemTitle: 'عنوان البرنامج',
          itemDescription: 'الوصف',
          teacher: 'المقدم',
          duration: 'المدة',
          durationPlaceholder: 'مثال: ساعتان',
          verses: 'الآيات',
          versesPlaceholder: 'مثال: الروم 21',
          recording: 'التسجيل',
          recordingPlaceholder: 'اختر حالة التسجيل',
          recordingAvailable: 'متاح',
          recordingProcessing: 'قيد المعالجة',
          cancel: 'إلغاء',
          submit: 'إضافة البرنامج',
        },
        card: {
          teacher: 'المقدم:',
          date: 'التاريخ:',
          duration: 'المدة:',
          verses: 'الآيات:',
          recordingAvailable: 'متاح التسجيل',
          recordingProcessing: 'قيد المعالجة',
          watchRecording: 'مشاهدة التسجيل',
          comingSoon: 'قريباً',
          downloadMaterial: 'تحميل المادة',
          delete: 'حذف',
        },
        deleteDialog: {
          title: 'تأكيد الحذف',
          message: 'هل أنت متأكد من حذف البرنامج "{{title}}"؟ لا يمكن التراجع عن هذا الإجراء.',
          cancel: 'إلغاء',
          confirm: 'حذف',
        },
        toast: {
          addSuccess: 'تم الإضافة',
          addSuccessDescription: 'تم إضافة البرنامج بنجاح',
          deleteSuccess: 'تم الحذف',
          deleteSuccessDescription: 'تم حذف البرنامج بنجاح',
          validationError: 'خطأ',
          validationErrorDescription: 'يرجى ملء جميع الحقول المطلوبة',
          openRecording: 'فتح التسجيل',
          openRecordingDescription: 'جاري فتح تسجيل البرنامج...',
          recordingUnavailable: 'التسجيل غير متاح',
          recordingUnavailableDescription: 'هذا البرنامج قيد المعالجة وسيكون متاحاً قريباً',
          downloadMaterial: 'تحميل المادة',
          downloadMaterialDescription: 'جاري تحميل مادة البرنامج...',
        },
      },
      guidanceCounseling: {
        pageTitle: 'الإرشاد والتوجيه',
        bannerTitle: 'الإرشاد والتوجيه',
        bannerSubtitle: 'استشارات تربوية ونفسية للطلاب وأولياء الأمور',
        addButton: 'إضافة جلسة جديدة',
        dialog: {
          title: 'إضافة جلسة إرشاد جديدة',
          description: 'أدخل بيانات الجلسة الجديدة في النموذج أدناه',
          itemTitle: 'عنوان الجلسة',
          itemDescription: 'الوصف',
          teacher: 'المرشد',
          duration: 'المدة',
          durationPlaceholder: 'مثال: 45 دقيقة',
          verses: 'الآيات',
          versesPlaceholder: 'مثال: فاطر 18',
          recording: 'التسجيل',
          recordingPlaceholder: 'اختر حالة التسجيل',
          recordingAvailable: 'متاح',
          recordingProcessing: 'قيد المعالجة',
          cancel: 'إلغاء',
          submit: 'إضافة الجلسة',
        },
        card: {
          teacher: 'المرشد:',
          date: 'التاريخ:',
          duration: 'المدة:',
          verses: 'الآيات:',
          recordingAvailable: 'متاح التسجيل',
          recordingProcessing: 'قيد المعالجة',
          watchRecording: 'مشاهدة التسجيل',
          comingSoon: 'قريباً',
          downloadMaterial: 'تحميل المادة',
          delete: 'حذف',
        },
        deleteDialog: {
          title: 'تأكيد الحذف',
          message: 'هل أنت متأكد من حذف الجلسة "{{title}}"؟ لا يمكن التراجع عن هذا الإجراء.',
          cancel: 'إلغاء',
          confirm: 'حذف',
        },
        toast: {
          addSuccess: 'تم الإضافة',
          addSuccessDescription: 'تم إضافة الجلسة بنجاح',
          deleteSuccess: 'تم الحذف',
          deleteSuccessDescription: 'تم حذف الجلسة بنجاح',
          validationError: 'خطأ',
          validationErrorDescription: 'يرجى ملء جميع الحقول المطلوبة',
          openRecording: 'فتح التسجيل',
          openRecordingDescription: 'جاري فتح تسجيل الجلسة...',
          recordingUnavailable: 'التسجيل غير متاح',
          recordingUnavailableDescription: 'هذه الجلسة قيد المعالجة وستكون متاحة قريباً',
          downloadMaterial: 'تحميل المادة',
          downloadMaterialDescription: 'جاري تحميل مادة الجلسة...',
        },
      },
    },
  },
  en: {
    main: {
      pageTitle: 'Educational',
      banner: {
        title: 'Educational & Training Programs',
        subtitle: 'Developing Islamic values and educational skills for students',
      },
      sessionForm: {
        title: 'Register Educational Session',
        student: 'Student',
        studentPlaceholder: 'Select student',
        teacher: 'Teacher',
        teacherPlaceholder: 'Select teacher',
        topic: 'Topic',
        topicPlaceholder: 'e.g. Islamic Ethics',
        description: 'Description',
        descriptionPlaceholder: 'Session description...',
        rating: 'Rating (1-10):',
        submitting: 'Registering...',
        submit: 'Register Session',
      },
      studentForm: {
        title: 'Register Student in Educational Program',
        name: 'Student Name',
        namePlaceholder: 'Enter student name',
        age: 'Age',
        agePlaceholder: 'Enter age',
        grade: 'Grade',
        gradePlaceholder: 'e.g. Fifth Grade',
        submitting: 'Registering...',
        submit: 'Register Student',
      },
      registeredStudents: {
        title: 'Registered Students',
        empty: 'No students registered in the educational program yet',
        ageLabel: 'Age:',
        yearUnit: 'years',
      },
      registeredSessions: {
        title: 'Registered Sessions',
        empty: 'No sessions registered yet',
        studentLabel: 'Student:',
        teacherLabel: 'Teacher:',
      },
      toast: {
        addStudentSuccess: 'Student added successfully',
        addStudentError: 'Error adding student',
        addSessionSuccess: 'Session added successfully',
        addSessionError: 'Error adding session',
      },
    },
    iconLabels: {
      islamicLessons: 'Islamic Lessons',
      ethicsBehavior: 'Ethics & Behavior',
      lifeSkills: 'Life Skills',
      studentActivities: 'Student Activities',
      familyPrograms: 'Family Programs',
      guidanceCounseling: 'Guidance & Counseling',
    },
    subPages: {
      islamicLessons: {
        pageTitle: 'Islamic Lessons',
        bannerTitle: 'Islamic Lessons',
        bannerSubtitle: 'Specialized lessons in Islamic theology, jurisprudence, and prophetic biography',
        addButton: 'Add New Lesson',
        dialog: {
          title: 'Add New Islamic Lesson',
          description: 'Enter the new lesson details in the form below',
          itemTitle: 'Lesson Title',
          itemDescription: 'Description',
          teacher: 'Teacher',
          duration: 'Duration',
          durationPlaceholder: 'e.g. 45 minutes',
          verses: 'Verses',
          versesPlaceholder: 'e.g. Al-Baqarah 255-285',
          recording: 'Recording',
          recordingPlaceholder: 'Select recording status',
          recordingAvailable: 'Available',
          recordingProcessing: 'Processing',
          cancel: 'Cancel',
          submit: 'Add Lesson',
        },
        card: {
          teacher: 'Teacher:',
          date: 'Date:',
          duration: 'Duration:',
          verses: 'Verses:',
          recordingAvailable: 'Recording Available',
          recordingProcessing: 'Processing',
          watchRecording: 'Watch Recording',
          comingSoon: 'Coming Soon',
          downloadMaterial: 'Download Material',
          delete: 'Delete',
        },
        deleteDialog: {
          title: 'Confirm Deletion',
          message: 'Are you sure you want to delete the lesson "{{title}}"? This action cannot be undone.',
          cancel: 'Cancel',
          confirm: 'Delete',
        },
        toast: {
          addSuccess: 'Added',
          addSuccessDescription: 'Lesson added successfully',
          deleteSuccess: 'Deleted',
          deleteSuccessDescription: 'Lesson deleted successfully',
          validationError: 'Error',
          validationErrorDescription: 'Please fill in all required fields',
          openRecording: 'Opening Recording',
          openRecordingDescription: 'Opening lesson recording...',
          recordingUnavailable: 'Recording Unavailable',
          recordingUnavailableDescription: 'This lesson is being processed and will be available soon',
          downloadMaterial: 'Downloading Material',
          downloadMaterialDescription: 'Downloading lesson material...',
        },
      },
      ethicsBehavior: {
        pageTitle: 'Ethics & Behavior',
        bannerTitle: 'Ethics & Behavior',
        bannerSubtitle: 'Promoting ethical values and Islamic behavior in students\' lives',
        addButton: 'Add New Lesson',
        dialog: {
          title: 'Add New Ethics & Behavior Lesson',
          description: 'Enter the new lesson details in the form below',
          itemTitle: 'Lesson Title',
          itemDescription: 'Description',
          teacher: 'Teacher',
          duration: 'Duration',
          durationPlaceholder: 'e.g. 40 minutes',
          verses: 'Verses',
          versesPlaceholder: 'e.g. Al-A\'raf 31-36',
          recording: 'Recording',
          recordingPlaceholder: 'Select recording status',
          recordingAvailable: 'Available',
          recordingProcessing: 'Processing',
          cancel: 'Cancel',
          submit: 'Add Lesson',
        },
        card: {
          teacher: 'Teacher:',
          date: 'Date:',
          duration: 'Duration:',
          verses: 'Verses:',
          recordingAvailable: 'Recording Available',
          recordingProcessing: 'Processing',
          watchRecording: 'Watch Recording',
          comingSoon: 'Coming Soon',
          downloadMaterial: 'Download Material',
          delete: 'Delete',
        },
        deleteDialog: {
          title: 'Confirm Deletion',
          message: 'Are you sure you want to delete the lesson "{{title}}"? This action cannot be undone.',
          cancel: 'Cancel',
          confirm: 'Delete',
        },
        toast: {
          addSuccess: 'Added',
          addSuccessDescription: 'Lesson added successfully',
          deleteSuccess: 'Deleted',
          deleteSuccessDescription: 'Lesson deleted successfully',
          validationError: 'Error',
          validationErrorDescription: 'Please fill in all required fields',
          openRecording: 'Opening Recording',
          openRecordingDescription: 'Opening lesson recording...',
          recordingUnavailable: 'Recording Unavailable',
          recordingUnavailableDescription: 'This lesson is being processed and will be available soon',
          downloadMaterial: 'Downloading Material',
          downloadMaterialDescription: 'Downloading lesson material...',
        },
      },
      lifeSkills: {
        pageTitle: 'Life Skills',
        bannerTitle: 'Life Skills',
        bannerSubtitle: 'Developing communication, leadership, and teamwork skills',
        addButton: 'Add New Lesson',
        dialog: {
          title: 'Add New Life Skills Lesson',
          description: 'Enter the new lesson details in the form below',
          itemTitle: 'Lesson Title',
          itemDescription: 'Description',
          teacher: 'Teacher',
          duration: 'Duration',
          durationPlaceholder: 'e.g. 50 minutes',
          verses: 'Verses',
          versesPlaceholder: 'e.g. Al-Hujurat 11-13',
          recording: 'Recording',
          recordingPlaceholder: 'Select recording status',
          recordingAvailable: 'Available',
          recordingProcessing: 'Processing',
          cancel: 'Cancel',
          submit: 'Add Lesson',
        },
        card: {
          teacher: 'Teacher:',
          date: 'Date:',
          duration: 'Duration:',
          verses: 'Verses:',
          recordingAvailable: 'Recording Available',
          recordingProcessing: 'Processing',
          watchRecording: 'Watch Recording',
          comingSoon: 'Coming Soon',
          downloadMaterial: 'Download Material',
          delete: 'Delete',
        },
        deleteDialog: {
          title: 'Confirm Deletion',
          message: 'Are you sure you want to delete the lesson "{{title}}"? This action cannot be undone.',
          cancel: 'Cancel',
          confirm: 'Delete',
        },
        toast: {
          addSuccess: 'Added',
          addSuccessDescription: 'Lesson added successfully',
          deleteSuccess: 'Deleted',
          deleteSuccessDescription: 'Lesson deleted successfully',
          validationError: 'Error',
          validationErrorDescription: 'Please fill in all required fields',
          openRecording: 'Opening Recording',
          openRecordingDescription: 'Opening lesson recording...',
          recordingUnavailable: 'Recording Unavailable',
          recordingUnavailableDescription: 'This lesson is being processed and will be available soon',
          downloadMaterial: 'Downloading Material',
          downloadMaterialDescription: 'Downloading lesson material...',
        },
      },
      studentActivities: {
        pageTitle: 'Student Activities',
        bannerTitle: 'Student Activities',
        bannerSubtitle: 'Purposeful competitions and events for developing student skills',
        addButton: 'Add New Activity',
        dialog: {
          title: 'Add New Student Activity',
          description: 'Enter the new activity details in the form below',
          itemTitle: 'Activity Title',
          itemDescription: 'Description',
          teacher: 'Supervisor',
          duration: 'Duration',
          durationPlaceholder: 'e.g. Full day',
          verses: 'Verses',
          versesPlaceholder: 'e.g. Al-Muzzammil 1-20',
          recording: 'Recording',
          recordingPlaceholder: 'Select recording status',
          recordingAvailable: 'Available',
          recordingProcessing: 'Processing',
          cancel: 'Cancel',
          submit: 'Add Activity',
        },
        card: {
          teacher: 'Supervisor:',
          date: 'Date:',
          duration: 'Duration:',
          verses: 'Verses:',
          recordingAvailable: 'Recording Available',
          recordingProcessing: 'Processing',
          watchRecording: 'Watch Recording',
          comingSoon: 'Coming Soon',
          downloadMaterial: 'Download Material',
          delete: 'Delete',
        },
        deleteDialog: {
          title: 'Confirm Deletion',
          message: 'Are you sure you want to delete the activity "{{title}}"? This action cannot be undone.',
          cancel: 'Cancel',
          confirm: 'Delete',
        },
        toast: {
          addSuccess: 'Added',
          addSuccessDescription: 'Activity added successfully',
          deleteSuccess: 'Deleted',
          deleteSuccessDescription: 'Activity deleted successfully',
          validationError: 'Error',
          validationErrorDescription: 'Please fill in all required fields',
          openRecording: 'Opening Recording',
          openRecordingDescription: 'Opening activity recording...',
          recordingUnavailable: 'Recording Unavailable',
          recordingUnavailableDescription: 'This activity is being processed and will be available soon',
          downloadMaterial: 'Downloading Material',
          downloadMaterialDescription: 'Downloading activity material...',
        },
      },
      familyPrograms: {
        pageTitle: 'Family Programs',
        bannerTitle: 'Family Programs',
        bannerSubtitle: 'Engaging families in the educational process and strengthening family bonds',
        addButton: 'Add New Program',
        dialog: {
          title: 'Add New Family Program',
          description: 'Enter the new program details in the form below',
          itemTitle: 'Program Title',
          itemDescription: 'Description',
          teacher: 'Presenter',
          duration: 'Duration',
          durationPlaceholder: 'e.g. 2 hours',
          verses: 'Verses',
          versesPlaceholder: 'e.g. Ar-Rum 21',
          recording: 'Recording',
          recordingPlaceholder: 'Select recording status',
          recordingAvailable: 'Available',
          recordingProcessing: 'Processing',
          cancel: 'Cancel',
          submit: 'Add Program',
        },
        card: {
          teacher: 'Presenter:',
          date: 'Date:',
          duration: 'Duration:',
          verses: 'Verses:',
          recordingAvailable: 'Recording Available',
          recordingProcessing: 'Processing',
          watchRecording: 'Watch Recording',
          comingSoon: 'Coming Soon',
          downloadMaterial: 'Download Material',
          delete: 'Delete',
        },
        deleteDialog: {
          title: 'Confirm Deletion',
          message: 'Are you sure you want to delete the program "{{title}}"? This action cannot be undone.',
          cancel: 'Cancel',
          confirm: 'Delete',
        },
        toast: {
          addSuccess: 'Added',
          addSuccessDescription: 'Program added successfully',
          deleteSuccess: 'Deleted',
          deleteSuccessDescription: 'Program deleted successfully',
          validationError: 'Error',
          validationErrorDescription: 'Please fill in all required fields',
          openRecording: 'Opening Recording',
          openRecordingDescription: 'Opening program recording...',
          recordingUnavailable: 'Recording Unavailable',
          recordingUnavailableDescription: 'This program is being processed and will be available soon',
          downloadMaterial: 'Downloading Material',
          downloadMaterialDescription: 'Downloading program material...',
        },
      },
      guidanceCounseling: {
        pageTitle: 'Guidance & Counseling',
        bannerTitle: 'Guidance & Counseling',
        bannerSubtitle: 'Educational and psychological counseling for students and parents',
        addButton: 'Add New Session',
        dialog: {
          title: 'Add New Counseling Session',
          description: 'Enter the new session details in the form below',
          itemTitle: 'Session Title',
          itemDescription: 'Description',
          teacher: 'Counselor',
          duration: 'Duration',
          durationPlaceholder: 'e.g. 45 minutes',
          verses: 'Verses',
          versesPlaceholder: 'e.g. Fatir 18',
          recording: 'Recording',
          recordingPlaceholder: 'Select recording status',
          recordingAvailable: 'Available',
          recordingProcessing: 'Processing',
          cancel: 'Cancel',
          submit: 'Add Session',
        },
        card: {
          teacher: 'Counselor:',
          date: 'Date:',
          duration: 'Duration:',
          verses: 'Verses:',
          recordingAvailable: 'Recording Available',
          recordingProcessing: 'Processing',
          watchRecording: 'Watch Recording',
          comingSoon: 'Coming Soon',
          downloadMaterial: 'Download Material',
          delete: 'Delete',
        },
        deleteDialog: {
          title: 'Confirm Deletion',
          message: 'Are you sure you want to delete the session "{{title}}"? This action cannot be undone.',
          cancel: 'Cancel',
          confirm: 'Delete',
        },
        toast: {
          addSuccess: 'Added',
          addSuccessDescription: 'Session added successfully',
          deleteSuccess: 'Deleted',
          deleteSuccessDescription: 'Session deleted successfully',
          validationError: 'Error',
          validationErrorDescription: 'Please fill in all required fields',
          openRecording: 'Opening Recording',
          openRecordingDescription: 'Opening session recording...',
          recordingUnavailable: 'Recording Unavailable',
          recordingUnavailableDescription: 'This session is being processed and will be available soon',
          downloadMaterial: 'Downloading Material',
          downloadMaterialDescription: 'Downloading session material...',
        },
      },
    },
  },
};
