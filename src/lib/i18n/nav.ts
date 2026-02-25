import type { Language } from './types';

export interface NavTranslations {
  home: string;
  admin: string;
  quran: string;
  tajweed: string;
  educational: string;
  exams: string;
  subjects: string;
  schedule: string;
  attendance: string;
  students: string;
  teachers: string;
  quranCircles: string;
  announcements: string;
  library: string;
  settings: string;
  meetings: string;
  suggestions: string;
  tarbiwi: string;
}

export const nav: Record<Language, NavTranslations> = {
  ar: {
    home: 'الرئيسية',
    admin: 'الإدارة',
    quran: 'القرآن',
    tajweed: 'التجويد',
    educational: 'التربوي',
    exams: 'الامتحانات',
    subjects: 'المواد الدراسية',
    schedule: 'الجدول الدراسي',
    attendance: 'الحضور والانصراف',
    students: 'الطلاب',
    teachers: 'المدرسون',
    quranCircles: 'حلقات القرآن',
    announcements: 'الإعلانات',
    library: 'المكتبة العلمية',
    settings: 'الإعدادات',
    meetings: 'الاجتماعات',
    suggestions: 'المقترحات',
    tarbiwi: 'التربوي',
  },
  en: {
    home: 'Home',
    admin: 'Administration',
    quran: 'Quran',
    tajweed: 'Tajweed',
    educational: 'Educational',
    exams: 'Exams',
    subjects: 'Subjects',
    schedule: 'Schedule',
    attendance: 'Attendance',
    students: 'Students',
    teachers: 'Teachers',
    quranCircles: 'Quran Circles',
    announcements: 'Announcements',
    library: 'Library',
    settings: 'Settings',
    meetings: 'Meetings',
    suggestions: 'Suggestions',
    tarbiwi: 'Tarbiwi',
  },
};
