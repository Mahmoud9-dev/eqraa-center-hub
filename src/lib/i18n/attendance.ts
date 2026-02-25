import type { Language } from './types';

export interface AttendanceTranslations {
  pageTitle: string;
  sectionTitle: string;
  sectionDescription: string;
  status: {
    present: string;
    absent: string;
    excused: string;
    leave: string;
    active: string;
    inactive: string;
  };
  table: {
    studentName: string;
    teacher: string;
    date: string;
    status: string;
    notes: string;
    department: string;
  };
  tabs: {
    record: string;
    history: string;
    reports: string;
    students: string;
    teachers: string;
  };
  actions: {
    recordAttendance: string;
    markPresent: string;
    markAbsent: string;
    markExcused: string;
    saveAttendance: string;
    recording: string;
  };
  filter: {
    selectDate: string;
    selectTeacher: string;
    selectDepartment: string;
    allTeachers: string;
    allDepartments: string;
    dateLabel: string;
    departmentLabel: string;
    searchStudent: string;
    searchTeacher: string;
  };
  cards: {
    dailyStudentAttendance: string;
    dailyTeacherAttendance: string;
    previousRecords: string;
    todayRecord: string;
  };
  departments: {
    quran: string;
    tajweed: string;
    tarbawi: string;
  };
  units: {
    parts: string;
  };
  toast: {
    error: string;
    recordError: string;
    recorded: string;
    studentRecordedDesc: string;
    teacherRecordedDesc: string;
  };
  empty: string;
}

export const attendance: Record<Language, AttendanceTranslations> = {
  ar: {
    pageTitle: 'الحضور والانصراف',
    sectionTitle: 'الحضور والانصراف',
    sectionDescription: 'تسجيل ومتابعة حضور الطلاب والمعلمين',
    status: {
      present: 'حاضر',
      absent: 'غائب',
      excused: 'مأذون',
      leave: 'إجازة',
      active: 'نشط',
      inactive: 'غير نشط',
    },
    table: {
      studentName: 'اسم الطالب',
      teacher: 'المعلم',
      date: 'التاريخ',
      status: 'الحالة',
      notes: 'ملاحظات',
      department: 'القسم',
    },
    tabs: {
      record: 'تسجيل الحضور',
      history: 'سجل الحضور',
      reports: 'التقارير',
      students: 'حضور الطلاب',
      teachers: 'حضور المعلمين',
    },
    actions: {
      recordAttendance: 'تسجيل الحضور',
      markPresent: 'تسجيل حضور',
      markAbsent: 'تسجيل غياب',
      markExcused: 'تسجيل إذن',
      saveAttendance: 'حفظ الحضور',
      recording: 'جاري التسجيل...',
    },
    filter: {
      selectDate: 'اختر التاريخ',
      selectTeacher: 'اختر المعلم',
      selectDepartment: 'اختر القسم',
      allTeachers: 'جميع المعلمين',
      allDepartments: 'جميع الأقسام',
      dateLabel: 'التاريخ:',
      departmentLabel: 'القسم:',
      searchStudent: 'البحث عن طالب...',
      searchTeacher: 'البحث عن معلم...',
    },
    cards: {
      dailyStudentAttendance: 'تسجيل الحضور اليومي للطلاب',
      dailyTeacherAttendance: 'تسجيل الحضور اليومي للمعلمين',
      previousRecords: 'سجلات الحضور السابقة',
      todayRecord: 'سجل الحضور لليوم:',
    },
    departments: {
      quran: 'قرآن',
      tajweed: 'تجويد',
      tarbawi: 'تربوي',
    },
    units: {
      parts: 'جزء',
    },
    toast: {
      error: 'خطأ',
      recordError: 'حدث خطأ أثناء تسجيل الحضور',
      recorded: 'تم تسجيل الحضور',
      studentRecordedDesc: 'تم تسجيل حضور {{count}} طالب بنجاح',
      teacherRecordedDesc: 'تم تسجيل حضور {{count}} معلم بنجاح',
    },
    empty: 'لا توجد سجلات حضور',
  },
  en: {
    pageTitle: 'Attendance',
    sectionTitle: 'Attendance',
    sectionDescription: 'Record and track student and teacher attendance',
    status: {
      present: 'Present',
      absent: 'Absent',
      excused: 'Excused',
      leave: 'Leave',
      active: 'Active',
      inactive: 'Inactive',
    },
    table: {
      studentName: 'Student Name',
      teacher: 'Teacher',
      date: 'Date',
      status: 'Status',
      notes: 'Notes',
      department: 'Department',
    },
    tabs: {
      record: 'Record Attendance',
      history: 'Attendance History',
      reports: 'Reports',
      students: 'Student Attendance',
      teachers: 'Teacher Attendance',
    },
    actions: {
      recordAttendance: 'Record Attendance',
      markPresent: 'Mark Present',
      markAbsent: 'Mark Absent',
      markExcused: 'Mark Excused',
      saveAttendance: 'Save Attendance',
      recording: 'Recording...',
    },
    filter: {
      selectDate: 'Select date',
      selectTeacher: 'Select teacher',
      selectDepartment: 'Select department',
      allTeachers: 'All teachers',
      allDepartments: 'All departments',
      dateLabel: 'Date:',
      departmentLabel: 'Department:',
      searchStudent: 'Search for student...',
      searchTeacher: 'Search for teacher...',
    },
    cards: {
      dailyStudentAttendance: 'Daily Student Attendance',
      dailyTeacherAttendance: 'Daily Teacher Attendance',
      previousRecords: 'Previous Attendance Records',
      todayRecord: 'Today\'s Attendance:',
    },
    departments: {
      quran: 'Quran',
      tajweed: 'Tajweed',
      tarbawi: 'Tarbawi',
    },
    units: {
      parts: 'parts',
    },
    toast: {
      error: 'Error',
      recordError: 'An error occurred while recording attendance',
      recorded: 'Attendance Recorded',
      studentRecordedDesc: 'Successfully recorded attendance for {{count}} students',
      teacherRecordedDesc: 'Successfully recorded attendance for {{count}} teachers',
    },
    empty: 'No attendance records',
  },
};
