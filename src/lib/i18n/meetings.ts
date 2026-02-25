import type { Language } from './types';

export interface MeetingsTranslations {
  pageTitle: string;
  form: {
    title: string;
    meetingTitle: string;
    meetingTitlePlaceholder: string;
    meetingType: string;
    meetingTypePlaceholder: string;
    details: string;
    detailsPlaceholder: string;
    dateTime: string;
    submit: string;
    submitting: string;
    typeOptions: {
      teachers: string;
      parents: string;
      admin: string;
    };
  };
  typeCards: {
    teachers: { name: string; description: string };
    parents: { name: string; description: string };
    admin: { name: string; description: string };
  };
  /** Label map for DB Arabic status values */
  statusLabels: {
    scheduled: string;
    completed: string;
    cancelled: string;
  };
  /** Label map for DB Arabic type values */
  typeLabels: {
    teachers: string;
    parents: string;
    admin: string;
  };
  sections: {
    meetingTypes: string;
    scheduledMeetings: string;
    viewAll: string;
  };
  deleteDialog: {
    title: string;
    message: string;
    cancel: string;
    confirm: string;
  };
  empty: {
    all: string;
    filtered: string;
  };
  toast: {
    addSuccess: string;
    addError: string;
    statusUpdated: string;
    deleteSuccess: string;
    deleteError: string;
  };
  actions: {
    delete: string;
  };
}

export const meetings: Record<Language, MeetingsTranslations> = {
  ar: {
    pageTitle: 'الاجتماعات',
    form: {
      title: 'جدولة اجتماع جديد',
      meetingTitle: 'عنوان الاجتماع',
      meetingTitlePlaceholder: 'مثال: اجتماع المعلمين الأسبوعي',
      meetingType: 'نوع الاجتماع',
      meetingTypePlaceholder: 'اختر نوع الاجتماع',
      details: 'التفاصيل',
      detailsPlaceholder: 'اشرح جدول الأعمال والموضوعات',
      dateTime: 'تاريخ ووقت الاجتماع',
      submit: 'جدولة الاجتماع',
      submitting: 'جاري الإضافة...',
      typeOptions: {
        teachers: 'اجتماعات المعلمين',
        parents: 'اجتماعات أولياء الأمور',
        admin: 'اجتماعات إدارية',
      },
    },
    typeCards: {
      teachers: { name: 'اجتماعات المعلمين', description: 'تنسيق وتخطيط الحلقات' },
      parents: { name: 'اجتماعات أولياء الأمور', description: 'متابعة تقدم الأبناء' },
      admin: { name: 'اجتماعات إدارية', description: 'قرارات وتطوير المركز' },
    },
    statusLabels: {
      scheduled: 'مجدولة',
      completed: 'مكتملة',
      cancelled: 'ملغاة',
    },
    typeLabels: {
      teachers: 'المعلمين',
      parents: 'أولياء الأمور',
      admin: 'إدارية',
    },
    sections: {
      meetingTypes: 'أنواع الاجتماعات',
      scheduledMeetings: 'الاجتماعات المجدولة',
      viewAll: 'عرض جميع الاجتماعات',
    },
    deleteDialog: {
      title: 'تأكيد الحذف',
      message: 'هل أنت متأكد من حذف الاجتماع "{{title}}"؟ لا يمكن التراجع عن هذا الإجراء.',
      cancel: 'إلغاء',
      confirm: 'حذف',
    },
    empty: {
      all: 'لا توجد اجتماعات مجدولة',
      filtered: 'لا توجد اجتماعات من نوع "{{type}}" مجدولة',
    },
    toast: {
      addSuccess: 'تم إضافة الاجتماع بنجاح',
      addError: 'خطأ في إضافة الاجتماع',
      statusUpdated: 'تم تحديث الحالة',
      deleteSuccess: 'تم حذف الاجتماع بنجاح',
      deleteError: 'خطأ في حذف الاجتماع',
    },
    actions: {
      delete: 'حذف',
    },
  },
  en: {
    pageTitle: 'Meetings',
    form: {
      title: 'Schedule a New Meeting',
      meetingTitle: 'Meeting Title',
      meetingTitlePlaceholder: 'e.g. Weekly Teachers Meeting',
      meetingType: 'Meeting Type',
      meetingTypePlaceholder: 'Select meeting type',
      details: 'Details',
      detailsPlaceholder: 'Describe the agenda and topics',
      dateTime: 'Meeting Date & Time',
      submit: 'Schedule Meeting',
      submitting: 'Scheduling...',
      typeOptions: {
        teachers: 'Teachers Meetings',
        parents: 'Parents Meetings',
        admin: 'Administrative Meetings',
      },
    },
    typeCards: {
      teachers: { name: 'Teachers Meetings', description: 'Coordinate and plan sessions' },
      parents: { name: 'Parents Meetings', description: 'Follow up on children\'s progress' },
      admin: { name: 'Administrative Meetings', description: 'Decisions and center development' },
    },
    statusLabels: {
      scheduled: 'Scheduled',
      completed: 'Completed',
      cancelled: 'Cancelled',
    },
    typeLabels: {
      teachers: 'Teachers',
      parents: 'Parents',
      admin: 'Administrative',
    },
    sections: {
      meetingTypes: 'Meeting Types',
      scheduledMeetings: 'Scheduled Meetings',
      viewAll: 'View All Meetings',
    },
    deleteDialog: {
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete the meeting "{{title}}"? This action cannot be undone.',
      cancel: 'Cancel',
      confirm: 'Delete',
    },
    empty: {
      all: 'No scheduled meetings',
      filtered: 'No "{{type}}" meetings scheduled',
    },
    toast: {
      addSuccess: 'Meeting added successfully',
      addError: 'Error adding meeting',
      statusUpdated: 'Status updated',
      deleteSuccess: 'Meeting deleted successfully',
      deleteError: 'Error deleting meeting',
    },
    actions: {
      delete: 'Delete',
    },
  },
};
