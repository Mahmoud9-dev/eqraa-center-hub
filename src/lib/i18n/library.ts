import type { Language } from './types';

export interface LibraryTranslations {
  pageTitle: string;
  subtitle: string;
  searchPlaceholder: string;
  allCategories: string;

  tabs: {
    books: string;
    audio: string;
    video: string;
    links: string;
    all: string;
  };

  /** Label maps for DB canonical resource type values */
  typeLabels: {
    pdf: string;
    audio: string;
    video: string;
    link: string;
  };

  /** Label maps for DB canonical category values */
  categoryLabels: {
    tafsir: string;
    hadith: string;
    fiqh: string;
    aqeedah: string;
    seerah: string;
    tajweed: string;
    usulFiqh: string;
    akhlaq: string;
    islamicHistory: string;
  };

  table: {
    title: string;
    author: string;
    type: string;
    category: string;
    addedDate: string;
    actions: string;
  };

  card: {
    authorLabel: string;
    categoryLabel: string;
    addedLabel: string;
    allResourcesTitle: string;
    allResourcesDescription: string;
  };

  actions: {
    addResource: string;
    edit: string;
    delete: string;
    download: string;
    listen: string;
    watch: string;
    visit: string;
    view: string;
    cancel: string;
    saveChanges: string;
  };

  form: {
    addTitle: string;
    addDescription: string;
    editTitle: string;
    editDescription: string;
    titleLabel: string;
    authorLabel: string;
    typeLabel: string;
    typePlaceholder: string;
    categoryLabel: string;
    categoryPlaceholder: string;
    descriptionLabel: string;
    urlLabel: string;
  };

  deleteDialog: {
    title: string;
    description: string;
  };

  toast: {
    errorTitle: string;
    requiredFields: string;
    addedTitle: string;
    addedDescription: string;
    editedTitle: string;
    editedDescription: string;
    deletedTitle: string;
    deletedDescription: string;
  };
}

export const library: Record<Language, LibraryTranslations> = {
  ar: {
    pageTitle: 'المكتبة العلمية',
    subtitle: 'كتب PDF، مقاطع صوتية للعلماء، روابط موثوقة للمراجع الشرعية',
    searchPlaceholder: 'البحث في المكتبة...',
    allCategories: 'جميع الفئات',

    tabs: {
      books: 'الكتب PDF',
      audio: 'المقاطع الصوتية',
      video: 'الفيديوهات',
      links: 'الروابط الموثوقة',
      all: 'جميع الموارد',
    },

    typeLabels: {
      pdf: 'PDF',
      audio: 'صوت',
      video: 'فيديو',
      link: 'رابط',
    },

    categoryLabels: {
      tafsir: 'تفسير',
      hadith: 'حديث',
      fiqh: 'فقه',
      aqeedah: 'عقيدة',
      seerah: 'سيرة',
      tajweed: 'تجويد',
      usulFiqh: 'أصول الفقه',
      akhlaq: 'أخلاق',
      islamicHistory: 'تاريخ الإسلام',
    },

    table: {
      title: 'العنوان',
      author: 'المؤلف',
      type: 'النوع',
      category: 'الفئة',
      addedDate: 'تاريخ الإضافة',
      actions: 'الإجراءات',
    },

    card: {
      authorLabel: 'المؤلف:',
      categoryLabel: 'الفئة:',
      addedLabel: 'إضافة:',
      allResourcesTitle: 'جميع موارد المكتبة',
      allResourcesDescription: 'عرض وإدارة جميع موارد المكتبة العلمية',
    },

    actions: {
      addResource: 'إضافة مورد جديد',
      edit: 'تعديل',
      delete: 'حذف',
      download: 'تحميل',
      listen: 'استماع',
      watch: 'مشاهدة',
      visit: 'زيارة',
      view: 'عرض',
      cancel: 'إلغاء',
      saveChanges: 'حفظ التعديلات',
    },

    form: {
      addTitle: 'إضافة مورد جديد',
      addDescription: 'أدخل بيانات المورد الجديد للمكتبة',
      editTitle: 'تعديل المورد',
      editDescription: 'قم بتعديل بيانات المورد',
      titleLabel: 'العنوان',
      authorLabel: 'المؤلف',
      typeLabel: 'النوع',
      typePlaceholder: 'اختر النوع',
      categoryLabel: 'الفئة',
      categoryPlaceholder: 'اختر الفئة',
      descriptionLabel: 'الوصف',
      urlLabel: 'الرابط',
    },

    deleteDialog: {
      title: 'تأكيد الحذف',
      description: 'هل أنت متأكد من حذف المورد "{{title}}"؟ لا يمكن التراجع عن هذا الإجراء.',
    },

    toast: {
      errorTitle: 'خطأ',
      requiredFields: 'يرجى ملء جميع الحقول المطلوبة',
      addedTitle: 'تم الإضافة',
      addedDescription: 'تم إضافة المورد بنجاح',
      editedTitle: 'تم التعديل',
      editedDescription: 'تم تعديل المورد بنجاح',
      deletedTitle: 'تم الحذف',
      deletedDescription: 'تم حذف المورد بنجاح',
    },
  },

  en: {
    pageTitle: 'Academic Library',
    subtitle: 'PDF books, audio clips by scholars, trusted links to Islamic references',
    searchPlaceholder: 'Search the library...',
    allCategories: 'All Categories',

    tabs: {
      books: 'PDF Books',
      audio: 'Audio Clips',
      video: 'Videos',
      links: 'Trusted Links',
      all: 'All Resources',
    },

    typeLabels: {
      pdf: 'PDF',
      audio: 'Audio',
      video: 'Video',
      link: 'Link',
    },

    categoryLabels: {
      tafsir: 'Tafsir',
      hadith: 'Hadith',
      fiqh: 'Fiqh',
      aqeedah: 'Aqeedah',
      seerah: 'Seerah',
      tajweed: 'Tajweed',
      usulFiqh: 'Usul al-Fiqh',
      akhlaq: 'Akhlaq',
      islamicHistory: 'Islamic History',
    },

    table: {
      title: 'Title',
      author: 'Author',
      type: 'Type',
      category: 'Category',
      addedDate: 'Date Added',
      actions: 'Actions',
    },

    card: {
      authorLabel: 'Author:',
      categoryLabel: 'Category:',
      addedLabel: 'Added:',
      allResourcesTitle: 'All Library Resources',
      allResourcesDescription: 'View and manage all academic library resources',
    },

    actions: {
      addResource: 'Add New Resource',
      edit: 'Edit',
      delete: 'Delete',
      download: 'Download',
      listen: 'Listen',
      watch: 'Watch',
      visit: 'Visit',
      view: 'View',
      cancel: 'Cancel',
      saveChanges: 'Save Changes',
    },

    form: {
      addTitle: 'Add New Resource',
      addDescription: 'Enter the details for the new library resource',
      editTitle: 'Edit Resource',
      editDescription: 'Edit the resource details',
      titleLabel: 'Title',
      authorLabel: 'Author',
      typeLabel: 'Type',
      typePlaceholder: 'Select type',
      categoryLabel: 'Category',
      categoryPlaceholder: 'Select category',
      descriptionLabel: 'Description',
      urlLabel: 'URL',
    },

    deleteDialog: {
      title: 'Confirm Delete',
      description: 'Are you sure you want to delete the resource "{{title}}"? This action cannot be undone.',
    },

    toast: {
      errorTitle: 'Error',
      requiredFields: 'Please fill in all required fields',
      addedTitle: 'Added',
      addedDescription: 'Resource added successfully',
      editedTitle: 'Updated',
      editedDescription: 'Resource updated successfully',
      deletedTitle: 'Deleted',
      deletedDescription: 'Resource deleted successfully',
    },
  },
};
