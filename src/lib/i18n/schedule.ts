import type { Language } from './types';

export interface ScheduleTranslations {
  pageTitle: string;
  subtitle: string;
  heading: string;
  dayNames: {
    sunday: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
  };
  /** Label map for DB Arabic session-type values */
  sessionTypeLabels: {
    quranCircle: string;
    tajweed: string;
    shariaSubject: string;
    review: string;
    lecture: string;
  };
  form: {
    addSession: string;
    addSessionTitle: string;
    addSessionDescription: string;
    title: string;
    day: string;
    dayPlaceholder: string;
    startTime: string;
    endTime: string;
    teacher: string;
    teacherPlaceholder: string;
    location: string;
    type: string;
    typePlaceholder: string;
    cancel: string;
    submit: string;
  };
  sections: {
    weeklySchedule: string;
    weeklyScheduleDescription: string;
    upcomingSessions: string;
    upcomingSessionsDescription: string;
  };
  editDialog: {
    title: string;
    description: string;
    save: string;
    cancel: string;
  };
  deleteDialog: {
    title: string;
    message: string;
    cancel: string;
    confirm: string;
  };
  empty: {
    noSessions: string;
  };
  toast: {
    error: string;
    fillRequired: string;
    addSuccess: string;
    addSuccessDescription: string;
    editSuccess: string;
    editSuccessDescription: string;
    deleteSuccess: string;
    deleteSuccessDescription: string;
  };
  actions: {
    edit: string;
    delete: string;
  };
}

export const schedule: Record<Language, ScheduleTranslations> = {
  ar: {
    pageTitle: 'الجدول الدراسي',
    subtitle: 'إدارة ومتابعة جداول الحلقات والمحاضرات اليومية والأسبوعية',
    heading: 'الجدول الدراسي',
    dayNames: {
      sunday: 'الأحد',
      monday: 'الإثنين',
      tuesday: 'الثلاثاء',
      wednesday: 'الأربعاء',
      thursday: 'الخميس',
      friday: 'الجمعة',
      saturday: 'السبت',
    },
    sessionTypeLabels: {
      quranCircle: 'حلقة قرآن',
      tajweed: 'تجويد',
      shariaSubject: 'مادة شرعية',
      review: 'مراجعة',
      lecture: 'محاضرة',
    },
    form: {
      addSession: 'إضافة جلسة جديدة',
      addSessionTitle: 'إضافة جلسة جديدة',
      addSessionDescription: 'أدخل بيانات الجلسة الجديدة',
      title: 'العنوان',
      day: 'اليوم',
      dayPlaceholder: 'اختر اليوم',
      startTime: 'وقت البدء',
      endTime: 'وقت الانتهاء',
      teacher: 'المعلم',
      teacherPlaceholder: 'اختر المعلم',
      location: 'المكان',
      type: 'النوع',
      typePlaceholder: 'اختر النوع',
      cancel: 'إلغاء',
      submit: 'إضافة جلسة',
    },
    sections: {
      weeklySchedule: 'الجدول الأسبوعي',
      weeklyScheduleDescription: 'جميع الحلقات والمحاضرات الأسبوعية',
      upcomingSessions: 'الحلقات القادمة',
      upcomingSessionsDescription: 'الحلقات والمحاضرات القادمة خلال 24 ساعة',
    },
    editDialog: {
      title: 'تعديل الجلسة',
      description: 'قم بتعديل بيانات الجلسة',
      save: 'حفظ التعديلات',
      cancel: 'إلغاء',
    },
    deleteDialog: {
      title: 'تأكيد الحذف',
      message: 'هل أنت متأكد من حذف الجلسة "{{title}}"؟ لا يمكن التراجع عن هذا الإجراء.',
      cancel: 'إلغاء',
      confirm: 'حذف',
    },
    empty: {
      noSessions: 'لا توجد جلسات في هذا اليوم',
    },
    toast: {
      error: 'خطأ',
      fillRequired: 'يرجى ملء جميع الحقول المطلوبة',
      addSuccess: 'تم الإضافة',
      addSuccessDescription: 'تم إضافة الجلسة بنجاح',
      editSuccess: 'تم التعديل',
      editSuccessDescription: 'تم تعديل الجلسة بنجاح',
      deleteSuccess: 'تم الحذف',
      deleteSuccessDescription: 'تم حذف الجلسة بنجاح',
    },
    actions: {
      edit: 'تعديل',
      delete: 'حذف',
    },
  },
  en: {
    pageTitle: 'Class Schedule',
    subtitle: 'Manage and track daily and weekly session and lecture schedules',
    heading: 'Class Schedule',
    dayNames: {
      sunday: 'Sunday',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
    },
    sessionTypeLabels: {
      quranCircle: 'Quran Circle',
      tajweed: 'Tajweed',
      shariaSubject: 'Sharia Subject',
      review: 'Review',
      lecture: 'Lecture',
    },
    form: {
      addSession: 'Add New Session',
      addSessionTitle: 'Add New Session',
      addSessionDescription: 'Enter the new session details',
      title: 'Title',
      day: 'Day',
      dayPlaceholder: 'Select day',
      startTime: 'Start Time',
      endTime: 'End Time',
      teacher: 'Teacher',
      teacherPlaceholder: 'Select teacher',
      location: 'Location',
      type: 'Type',
      typePlaceholder: 'Select type',
      cancel: 'Cancel',
      submit: 'Add Session',
    },
    sections: {
      weeklySchedule: 'Weekly Schedule',
      weeklyScheduleDescription: 'All weekly sessions and lectures',
      upcomingSessions: 'Upcoming Sessions',
      upcomingSessionsDescription: 'Sessions and lectures in the next 24 hours',
    },
    editDialog: {
      title: 'Edit Session',
      description: 'Modify the session details',
      save: 'Save Changes',
      cancel: 'Cancel',
    },
    deleteDialog: {
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete the session "{{title}}"? This action cannot be undone.',
      cancel: 'Cancel',
      confirm: 'Delete',
    },
    empty: {
      noSessions: 'No sessions on this day',
    },
    toast: {
      error: 'Error',
      fillRequired: 'Please fill in all required fields',
      addSuccess: 'Added',
      addSuccessDescription: 'Session added successfully',
      editSuccess: 'Updated',
      editSuccessDescription: 'Session updated successfully',
      deleteSuccess: 'Deleted',
      deleteSuccessDescription: 'Session deleted successfully',
    },
    actions: {
      edit: 'Edit',
      delete: 'Delete',
    },
  },
};
