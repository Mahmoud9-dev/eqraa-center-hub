import type { Language } from './types';

export interface HomeTranslations {
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
}

export const home: Record<Language, HomeTranslations> = {
  ar: {
    pageTitle: 'إقراء',
    welcome: 'مرحباً بك في إقراء',
    subtitle: 'اختر القسم المناسب للبدء',
    footer: 'جميع الحقوق محفوظة - إقراء',
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
  en: {
    pageTitle: 'Eqraa',
    welcome: 'Welcome to Eqraa',
    subtitle: 'Choose a section to get started',
    footer: 'All rights reserved - Eqraa',
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
};
