import type { Language } from './types';

export interface TeachersTranslations {
  pageTitle: string;
  sectionTitle: string;
  sectionDescription: string;
  searchPlaceholder: string;
  table: {
    name: string;
    specialization: string;
    department: string;
    email: string;
    phone: string;
    experience: string;
    status: string;
    subject: string;
    teacher: string;
    students: string;
    actions: string;
  };
  actions: {
    addTeacher: string;
    editTeacher: string;
    deleteTeacher: string;
    viewDetails: string;
    addNewTeacher: string;
    view: string;
    edit: string;
    delete: string;
    saveChanges: string;
    cancel: string;
    editProfile: string;
    viewSchedule: string;
  };
  tabs: {
    all: string;
    active: string;
    inactive: string;
    allTeachers: string;
    profiles: string;
    contact: string;
  };
  status: {
    active: string;
    inactive: string;
  };
  form: {
    namePlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
    selectDepartment: string;
    specializationPlaceholder: string;
    name: string;
    specialization: string;
    department: string;
    email: string;
    phone: string;
    experienceYears: string;
  };
  deleteConfirm: string;
  deleteConfirmMessage: string;
  confirmDelete: string;
  empty: string;
  departments: {
    all: string;
    quran: string;
    tajweed: string;
    tarbawi: string;
  };
  dialog: {
    addTitle: string;
    addDescription: string;
    editTitle: string;
    editDescription: string;
  };
  toast: {
    error: string;
    fillRequired: string;
    addSuccess: string;
    addSuccessDesc: string;
    editSuccess: string;
    editSuccessDesc: string;
    deleteSuccess: string;
    deleteSuccessDesc: string;
  };
  card: {
    teacherListTitle: string;
    teacherListDesc: string;
  };
  profile: {
    aboutTeacher: string;
    subjectsTeaching: string;
    experience: string;
    studentCount: string;
    yearUnit: string;
    studentUnit: string;
  };
  contact: {
    title: string;
    description: string;
    selectTeacher: string;
    selectTeacherPlaceholder: string;
    questionType: string;
    questionTypePlaceholder: string;
    questionTypeGeneral: string;
    questionTypeAcademic: string;
    questionTypeAdmin: string;
    questionTypePrivate: string;
    question: string;
    questionPlaceholder: string;
    sendQuestion: string;
    sendToAll: string;
  };
}

export const teachers: Record<Language, TeachersTranslations> = {
  ar: {
    pageTitle: 'المدرسون',
    sectionTitle: 'المدرسون والمشايخ',
    sectionDescription: 'إدارة بيانات المدرسين والمشايخ والمواد التي يدرسونها',
    searchPlaceholder: 'البحث عن مدرس...',
    table: {
      name: 'الاسم',
      specialization: 'التخصص',
      department: 'القسم',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      experience: 'سنوات الخبرة',
      status: 'الحالة',
      subject: 'المادة',
      teacher: 'المدرس',
      students: 'الطلاب',
      actions: 'إجراءات',
    },
    actions: {
      addTeacher: 'إضافة مدرس',
      editTeacher: 'تعديل مدرس',
      deleteTeacher: 'حذف مدرس',
      viewDetails: 'عرض التفاصيل',
      addNewTeacher: 'إضافة مدرس جديد',
      view: 'عرض',
      edit: 'تعديل',
      delete: 'حذف',
      saveChanges: 'حفظ التعديلات',
      cancel: 'إلغاء',
      editProfile: 'تعديل الملف الشخصي',
      viewSchedule: 'عرض الجدول',
    },
    tabs: {
      all: 'الكل',
      active: 'نشط',
      inactive: 'غير نشط',
      allTeachers: 'جميع المدرسين',
      profiles: 'الملفات الشخصية',
      contact: 'التواصل',
    },
    status: {
      active: 'نشط',
      inactive: 'غير نشط',
    },
    form: {
      namePlaceholder: 'أدخل اسم المدرس',
      emailPlaceholder: 'أدخل البريد الإلكتروني',
      phonePlaceholder: 'أدخل رقم الهاتف',
      selectDepartment: 'اختر القسم',
      specializationPlaceholder: 'أدخل التخصص',
      name: 'الاسم',
      specialization: 'التخصص',
      department: 'القسم',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      experienceYears: 'الخبرة (سنوات)',
    },
    deleteConfirm: 'هل أنت متأكد من حذف هذا المدرس؟',
    deleteConfirmMessage: 'هل أنت متأكد من حذف المدرس "{{name}}"؟ لا يمكن التراجع عن هذا الإجراء.',
    confirmDelete: 'تأكيد الحذف',
    empty: 'لا يوجد مدرسون مسجلون',
    departments: {
      all: 'جميع الأقسام',
      quran: 'قرآن',
      tajweed: 'تجويد',
      tarbawi: 'تربوي',
    },
    dialog: {
      addTitle: 'إضافة مدرس جديد',
      addDescription: 'أدخل بيانات المدرس الجديد',
      editTitle: 'تعديل بيانات المدرس',
      editDescription: 'قم بتعديل بيانات المدرس',
    },
    toast: {
      error: 'خطأ',
      fillRequired: 'يرجى ملء جميع الحقول المطلوبة',
      addSuccess: 'تم الإضافة',
      addSuccessDesc: 'تم إضافة المدرس بنجاح',
      editSuccess: 'تم التعديل',
      editSuccessDesc: 'تم تعديل بيانات المدرس بنجاح',
      deleteSuccess: 'تم الحذف',
      deleteSuccessDesc: 'تم حذف المدرس بنجاح',
    },
    card: {
      teacherListTitle: 'قائمة المدرسين',
      teacherListDesc: 'جميع المدرسين والمشايخ المسجلين في المركز',
    },
    profile: {
      aboutTeacher: 'نبذة عن المدرس',
      subjectsTeaching: 'المواد التي يدرسها',
      experience: 'الخبرة',
      studentCount: 'عدد الطلاب',
      yearUnit: 'سنة',
      studentUnit: 'طالب',
    },
    contact: {
      title: 'إرسال سؤال للمدرسين',
      description: 'اختر المدرس وأرسل سؤالك مباشرة',
      selectTeacher: 'اختر المدرس',
      selectTeacherPlaceholder: 'اختر المدرس...',
      questionType: 'نوع السؤال',
      questionTypePlaceholder: 'اختر نوع السؤال...',
      questionTypeGeneral: 'سؤال عام',
      questionTypeAcademic: 'سؤال أكاديمي',
      questionTypeAdmin: 'سؤال إداري',
      questionTypePrivate: 'سؤال خاص',
      question: 'السؤال',
      questionPlaceholder: 'اكتب سؤالك هنا...',
      sendQuestion: 'إرسال السؤال',
      sendToAll: 'إرسال لجميع المدرسين',
    },
  },
  en: {
    pageTitle: 'Teachers',
    sectionTitle: 'Teachers & Scholars',
    sectionDescription: 'Manage teacher data and subjects they teach',
    searchPlaceholder: 'Search for a teacher...',
    table: {
      name: 'Name',
      specialization: 'Specialization',
      department: 'Department',
      email: 'Email',
      phone: 'Phone',
      experience: 'Years of Experience',
      status: 'Status',
      subject: 'Subject',
      teacher: 'Teacher',
      students: 'Students',
      actions: 'Actions',
    },
    actions: {
      addTeacher: 'Add Teacher',
      editTeacher: 'Edit Teacher',
      deleteTeacher: 'Delete Teacher',
      viewDetails: 'View Details',
      addNewTeacher: 'Add New Teacher',
      view: 'View',
      edit: 'Edit',
      delete: 'Delete',
      saveChanges: 'Save Changes',
      cancel: 'Cancel',
      editProfile: 'Edit Profile',
      viewSchedule: 'View Schedule',
    },
    tabs: {
      all: 'All',
      active: 'Active',
      inactive: 'Inactive',
      allTeachers: 'All Teachers',
      profiles: 'Profiles',
      contact: 'Contact',
    },
    status: {
      active: 'Active',
      inactive: 'Inactive',
    },
    form: {
      namePlaceholder: 'Enter teacher name',
      emailPlaceholder: 'Enter email address',
      phonePlaceholder: 'Enter phone number',
      selectDepartment: 'Select department',
      specializationPlaceholder: 'Enter specialization',
      name: 'Name',
      specialization: 'Specialization',
      department: 'Department',
      email: 'Email',
      phone: 'Phone',
      experienceYears: 'Experience (years)',
    },
    deleteConfirm: 'Are you sure you want to delete this teacher?',
    deleteConfirmMessage: 'Are you sure you want to delete teacher "{{name}}"? This action cannot be undone.',
    confirmDelete: 'Confirm Delete',
    empty: 'No teachers registered',
    departments: {
      all: 'All Departments',
      quran: 'Quran',
      tajweed: 'Tajweed',
      tarbawi: 'Tarbawi',
    },
    dialog: {
      addTitle: 'Add New Teacher',
      addDescription: 'Enter the new teacher details',
      editTitle: 'Edit Teacher Data',
      editDescription: 'Edit teacher data',
    },
    toast: {
      error: 'Error',
      fillRequired: 'Please fill all required fields',
      addSuccess: 'Added',
      addSuccessDesc: 'Teacher added successfully',
      editSuccess: 'Updated',
      editSuccessDesc: 'Teacher data updated successfully',
      deleteSuccess: 'Deleted',
      deleteSuccessDesc: 'Teacher deleted successfully',
    },
    card: {
      teacherListTitle: 'Teacher List',
      teacherListDesc: 'All teachers and scholars registered in the center',
    },
    profile: {
      aboutTeacher: 'About the Teacher',
      subjectsTeaching: 'Subjects Teaching',
      experience: 'Experience',
      studentCount: 'Number of Students',
      yearUnit: 'years',
      studentUnit: 'students',
    },
    contact: {
      title: 'Send a Question to Teachers',
      description: 'Select a teacher and send your question directly',
      selectTeacher: 'Select Teacher',
      selectTeacherPlaceholder: 'Select a teacher...',
      questionType: 'Question Type',
      questionTypePlaceholder: 'Select question type...',
      questionTypeGeneral: 'General Question',
      questionTypeAcademic: 'Academic Question',
      questionTypeAdmin: 'Administrative Question',
      questionTypePrivate: 'Private Question',
      question: 'Question',
      questionPlaceholder: 'Write your question here...',
      sendQuestion: 'Send Question',
      sendToAll: 'Send to All Teachers',
    },
  },
};
