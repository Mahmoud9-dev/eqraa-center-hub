export type Language = 'ar' | 'en';

export interface Translations {
  home: {
    pageTitle: string;
    welcome: string;
    subtitle: string;
    footer: string;
    stats: {
      totalStudents: string;
      attendanceToday: string;
      activeCircles: string;
      upcomingExams: string;
    };
    sections: Record<string, string>;
  };
  header: {
    roles: {
      admin: string;
      teacher: string;
      student: string;
      parent: string;
      default: string;
    };
    home: string;
    logout: string;
    logoutError: string;
    logoutSuccess: string;
    openMenu: string;
    defaultUser: string;
  };
}

export const translations: Record<Language, Translations> = {
  ar: {
    home: {
      pageTitle: 'معهد فاطمة الزهراء',
      welcome: 'مرحباً بك في معهد فاطمة الزهراء للعلوم الشرعية',
      subtitle: 'اختر القسم المناسب للبدء',
      footer: 'جميع الحقوق محفوظة لمعهد فاطمة الزهراء',
      stats: {
        totalStudents: 'إجمالي الطلاب',
        attendanceToday: 'الحضور اليوم',
        activeCircles: 'الحلقات النشطة',
        upcomingExams: 'الاختبارات القادمة',
      },
      sections: {
        '/admin': 'الإدارة',
        '/quran': 'القرآن',
        '/tajweed': 'التجويد',
        '/educational': 'التربوي',
        '/exams': 'الامتحانات',
        '/subjects': 'المواد الدراسية',
        '/schedule': 'الجدول الدراسي',
        '/attendance': 'الحضور والانصراف',
        '/students': 'الطلاب',
        '/teachers': 'المدرسون',
        '/quran-circles': 'حلقات القرآن',
        '/announcements': 'الإعلانات',
        '/library': 'المكتبة العلمية',
        '/settings': 'الإعدادات',
        '/meetings': 'الاجتماعات',
        '/suggestions': 'المقترحات',
      },
    },
    header: {
      roles: {
        admin: 'مدير',
        teacher: 'معلم',
        student: 'طالب',
        parent: 'ولي أمر',
        default: 'مستخدم',
      },
      home: 'الرئيسية',
      logout: 'خروج',
      logoutError: 'خطأ في تسجيل الخروج',
      logoutSuccess: 'تم تسجيل الخروج بنجاح',
      openMenu: 'فتح القائمة',
      defaultUser: 'مستخدم',
    },
  },
  en: {
    home: {
      pageTitle: 'Fatimah Al-Zahra Institute',
      welcome: 'Welcome to Fatimah Al-Zahra Institute for Islamic Studies',
      subtitle: 'Choose a section to get started',
      footer: 'All rights reserved - Fatimah Al-Zahra Institute',
      stats: {
        totalStudents: 'Total Students',
        attendanceToday: 'Attendance Today',
        activeCircles: 'Active Circles',
        upcomingExams: 'Upcoming Exams',
      },
      sections: {
        '/admin': 'Administration',
        '/quran': 'Quran',
        '/tajweed': 'Tajweed',
        '/educational': 'Educational',
        '/exams': 'Exams',
        '/subjects': 'Subjects',
        '/schedule': 'Schedule',
        '/attendance': 'Attendance',
        '/students': 'Students',
        '/teachers': 'Teachers',
        '/quran-circles': 'Quran Circles',
        '/announcements': 'Announcements',
        '/library': 'Library',
        '/settings': 'Settings',
        '/meetings': 'Meetings',
        '/suggestions': 'Suggestions',
      },
    },
    header: {
      roles: {
        admin: 'Admin',
        teacher: 'Teacher',
        student: 'Student',
        parent: 'Parent',
        default: 'User',
      },
      home: 'Home',
      logout: 'Logout',
      logoutError: 'Logout failed',
      logoutSuccess: 'Logged out successfully',
      openMenu: 'Open menu',
      defaultUser: 'User',
    },
  },
};
