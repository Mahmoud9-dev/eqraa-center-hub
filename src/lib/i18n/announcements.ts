import type { Language } from './types';

export interface AnnouncementsTranslations {
  pageTitle: string;
  sectionTitle: string;
  sectionDescription: string;
  table: {
    title: string;
    type: string;
    targetAudience: string;
    createdAt: string;
    scheduledFor: string;
    status: string;
    content: string;
    actions: string;
  };
  actions: {
    addAnnouncement: string;
    editAnnouncement: string;
    deleteAnnouncement: string;
    viewDetails: string;
    createNew: string;
    create: string;
    saveChanges: string;
    sendNotification: string;
  };
  tabs: {
    announcements: string;
    notifications: string;
    scheduled: string;
  };
  type: {
    general: string;
    warning: string;
    info: string;
    event: string;
  };
  /** Label map for DB notification type values */
  typeLabels: {
    /** DB value: إعلان عام */
    generalAnnouncement: string;
    /** DB value: تنبيه */
    alert: string;
    /** DB value: موعد حلقة */
    circleSchedule: string;
    /** DB value: موعد اختبار */
    examSchedule: string;
  };
  status: {
    active: string;
    inactive: string;
    scheduled: string;
  };
  audience: {
    all: string;
    admin: string;
    teacher: string;
    student: string;
    parent: string;
    viewer: string;
  };
  form: {
    titleLabel: string;
    titlePlaceholder: string;
    typeLabel: string;
    selectType: string;
    contentLabel: string;
    contentPlaceholder: string;
    publishDate: string;
    targetAudience: string;
    statusLabel: string;
    selectAudience: string;
    selectDate: string;
  };
  filter: {
    searchPlaceholder: string;
    allTypes: string;
  };
  cards: {
    announcementsList: string;
    announcementsListDesc: string;
    instantNotifications: string;
    instantNotificationsDesc: string;
    scheduledNotifications: string;
    scheduledNotificationsDesc: string;
    scheduledAnnouncements: string;
    scheduledAnnouncementsDesc: string;
  };
  notificationForm: {
    notificationType: string;
    selectNotificationType: string;
    generalNotification: string;
    urgentNotification: string;
    reminder: string;
    message: string;
    messagePlaceholder: string;
    recipients: string;
    selectRecipients: string;
    allRecipients: string;
    studentsOnly: string;
    teachersOnly: string;
  };
  scheduled: {
    sendDate: string;
    publishDate: string;
  };
  dialog: {
    createTitle: string;
    createDescription: string;
    editTitle: string;
    editDescription: string;
    deleteTitle: string;
    deleteDescription: string;
  };
  toast: {
    error: string;
    fillRequired: string;
    selectAudience: string;
    added: string;
    addedDesc: string;
    edited: string;
    editedDesc: string;
    deleted: string;
    deletedDesc: string;
  };
  deleteConfirm: string;
  empty: string;
}

export const announcements: Record<Language, AnnouncementsTranslations> = {
  ar: {
    pageTitle: 'الإعلانات والإشعارات',
    sectionTitle: 'الإعلانات والتنبيهات',
    sectionDescription: 'إدارة الإعلانات العامة والتنبيهات والمواعيد الهامة',
    table: {
      title: 'العنوان',
      type: 'النوع',
      targetAudience: 'الجمهور المستهدف',
      createdAt: 'تاريخ الإنشاء',
      scheduledFor: 'مجدول لـ',
      status: 'الحالة',
      content: 'المحتوى',
      actions: 'الإجراءات',
    },
    actions: {
      addAnnouncement: 'إضافة إعلان',
      editAnnouncement: 'تعديل إعلان',
      deleteAnnouncement: 'حذف إعلان',
      viewDetails: 'عرض التفاصيل',
      createNew: 'إنشاء إعلان جديد',
      create: 'إنشاء إعلان',
      saveChanges: 'حفظ التعديلات',
      sendNotification: 'إرسال التنبيه',
    },
    tabs: {
      announcements: 'الإعلانات',
      notifications: 'التنبيهات',
      scheduled: 'المجدولة',
    },
    type: {
      general: 'إعلان عام',
      warning: 'تنبيه',
      info: 'معلومة',
      event: 'فعالية',
    },
    typeLabels: {
      generalAnnouncement: 'إعلان عام',
      alert: 'تنبيه',
      circleSchedule: 'موعد حلقة',
      examSchedule: 'موعد اختبار',
    },
    status: {
      active: 'نشط',
      inactive: 'غير نشط',
      scheduled: 'مجدول',
    },
    audience: {
      all: 'الجميع',
      admin: 'الإدارة',
      teacher: 'المدرسون',
      student: 'الطلاب',
      parent: 'أولياء الأمور',
      viewer: 'المشاهدون',
    },
    form: {
      titleLabel: 'العنوان',
      titlePlaceholder: 'أدخل عنوان الإعلان',
      typeLabel: 'النوع',
      selectType: 'اختر النوع',
      contentLabel: 'المحتوى',
      contentPlaceholder: 'أدخل محتوى الإعلان',
      publishDate: 'موعد النشر',
      targetAudience: 'الجمهور المستهدف',
      statusLabel: 'الحالة',
      selectAudience: 'اختر الجمهور المستهدف',
      selectDate: 'اختر تاريخ الجدولة',
    },
    filter: {
      searchPlaceholder: 'البحث عن إعلان...',
      allTypes: 'جميع الأنواع',
    },
    cards: {
      announcementsList: 'قائمة الإعلانات',
      announcementsListDesc: 'عرض وإدارة جميع الإعلانات والتنبيهات',
      instantNotifications: 'التنبيهات الفورية',
      instantNotificationsDesc: 'إرسال تنبيهات فورية للمستخدمين',
      scheduledNotifications: 'التنبيهات المجدولة',
      scheduledNotificationsDesc: 'التنبيهات المجدولة للإرسال المستقبلي',
      scheduledAnnouncements: 'الإعلانات المجدولة',
      scheduledAnnouncementsDesc: 'الإعلانات المجدولة للنشر المستقبلي',
    },
    notificationForm: {
      notificationType: 'نوع التنبيه',
      selectNotificationType: 'اختر نوع التنبيه...',
      generalNotification: 'تنبيه عام',
      urgentNotification: 'تنبيه عاجل',
      reminder: 'تذكير',
      message: 'الرسالة',
      messagePlaceholder: 'اكتب رسالة التنبيه...',
      recipients: 'المستهدفون',
      selectRecipients: 'اختر المستهدفين...',
      allRecipients: 'الجميع',
      studentsOnly: 'الطلاب فقط',
      teachersOnly: 'المدرسون فقط',
    },
    scheduled: {
      sendDate: 'موعد الإرسال:',
      publishDate: 'موعد النشر:',
    },
    dialog: {
      createTitle: 'إنشاء إعلان جديد',
      createDescription: 'أدخل بيانات الإعلان الجديد',
      editTitle: 'تعديل الإعلان',
      editDescription: 'قم بتعديل بيانات الإعلان',
      deleteTitle: 'تأكيد الحذف',
      deleteDescription: 'هل أنت متأكد من حذف الإعلان "{{title}}"؟ لا يمكن التراجع عن هذا الإجراء.',
    },
    toast: {
      error: 'خطأ',
      fillRequired: 'يرجى ملء جميع الحقول المطلوبة',
      selectAudience: 'يرجى اختيار الجمهور المستهدف',
      added: 'تم الإضافة',
      addedDesc: 'تم إضافة الإعلان بنجاح',
      edited: 'تم التعديل',
      editedDesc: 'تم تعديل الإعلان بنجاح',
      deleted: 'تم الحذف',
      deletedDesc: 'تم حذف الإعلان بنجاح',
    },
    deleteConfirm: 'هل أنت متأكد من حذف هذا الإعلان؟',
    empty: 'لا توجد إعلانات',
  },
  en: {
    pageTitle: 'Announcements & Notifications',
    sectionTitle: 'Announcements & Alerts',
    sectionDescription: 'Manage public announcements, alerts, and important dates',
    table: {
      title: 'Title',
      type: 'Type',
      targetAudience: 'Target Audience',
      createdAt: 'Created At',
      scheduledFor: 'Scheduled For',
      status: 'Status',
      content: 'Content',
      actions: 'Actions',
    },
    actions: {
      addAnnouncement: 'Add Announcement',
      editAnnouncement: 'Edit Announcement',
      deleteAnnouncement: 'Delete Announcement',
      viewDetails: 'View Details',
      createNew: 'Create New Announcement',
      create: 'Create Announcement',
      saveChanges: 'Save Changes',
      sendNotification: 'Send Notification',
    },
    tabs: {
      announcements: 'Announcements',
      notifications: 'Notifications',
      scheduled: 'Scheduled',
    },
    type: {
      general: 'General',
      warning: 'Warning',
      info: 'Info',
      event: 'Event',
    },
    typeLabels: {
      generalAnnouncement: 'General Announcement',
      alert: 'Alert',
      circleSchedule: 'Circle Schedule',
      examSchedule: 'Exam Schedule',
    },
    status: {
      active: 'Active',
      inactive: 'Inactive',
      scheduled: 'Scheduled',
    },
    audience: {
      all: 'All',
      admin: 'Administration',
      teacher: 'Teachers',
      student: 'Students',
      parent: 'Parents',
      viewer: 'Viewers',
    },
    form: {
      titleLabel: 'Title',
      titlePlaceholder: 'Enter announcement title',
      typeLabel: 'Type',
      selectType: 'Select type',
      contentLabel: 'Content',
      contentPlaceholder: 'Enter announcement content',
      publishDate: 'Publish Date',
      targetAudience: 'Target Audience',
      statusLabel: 'Status',
      selectAudience: 'Select target audience',
      selectDate: 'Select scheduled date',
    },
    filter: {
      searchPlaceholder: 'Search announcements...',
      allTypes: 'All Types',
    },
    cards: {
      announcementsList: 'Announcements List',
      announcementsListDesc: 'View and manage all announcements and alerts',
      instantNotifications: 'Instant Notifications',
      instantNotificationsDesc: 'Send instant notifications to users',
      scheduledNotifications: 'Scheduled Notifications',
      scheduledNotificationsDesc: 'Notifications scheduled for future delivery',
      scheduledAnnouncements: 'Scheduled Announcements',
      scheduledAnnouncementsDesc: 'Announcements scheduled for future publishing',
    },
    notificationForm: {
      notificationType: 'Notification Type',
      selectNotificationType: 'Select notification type...',
      generalNotification: 'General Notification',
      urgentNotification: 'Urgent Notification',
      reminder: 'Reminder',
      message: 'Message',
      messagePlaceholder: 'Write notification message...',
      recipients: 'Recipients',
      selectRecipients: 'Select recipients...',
      allRecipients: 'Everyone',
      studentsOnly: 'Students Only',
      teachersOnly: 'Teachers Only',
    },
    scheduled: {
      sendDate: 'Send Date:',
      publishDate: 'Publish Date:',
    },
    dialog: {
      createTitle: 'Create New Announcement',
      createDescription: 'Enter the new announcement details',
      editTitle: 'Edit Announcement',
      editDescription: 'Edit the announcement details',
      deleteTitle: 'Confirm Deletion',
      deleteDescription: 'Are you sure you want to delete the announcement "{{title}}"? This action cannot be undone.',
    },
    toast: {
      error: 'Error',
      fillRequired: 'Please fill in all required fields',
      selectAudience: 'Please select the target audience',
      added: 'Added',
      addedDesc: 'Announcement added successfully',
      edited: 'Updated',
      editedDesc: 'Announcement updated successfully',
      deleted: 'Deleted',
      deletedDesc: 'Announcement deleted successfully',
    },
    deleteConfirm: 'Are you sure you want to delete this announcement?',
    empty: 'No announcements found',
  },
};
