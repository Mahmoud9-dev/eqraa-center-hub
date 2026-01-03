'use client';

import {
  Users,
  BookOpen,
  Target,
  GraduationCap,
  FileEdit,
  Library,
  Calendar,
  BarChart3,
  User,
  Brain,
  Building2,
  Megaphone,
  BookMarked,
  Settings,
  Handshake,
  Lightbulb,
  School,
  CheckCircle,
  CalendarDays,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import IconButton from '@/components/IconButton';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import { useHomeStats } from '@/hooks/useHomeStats';

interface Section {
  to: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  label: string;
}

const sections: Section[] = [
  {
    to: '/admin',
    icon: Users,
    iconBgColor: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-500',
    label: 'الإدارة',
  },
  {
    to: '/quran',
    icon: BookOpen,
    iconBgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconColor: 'text-emerald-500',
    label: 'القرآن',
  },
  {
    to: '/tajweed',
    icon: Target,
    iconBgColor: 'bg-red-50 dark:bg-red-900/20',
    iconColor: 'text-red-500',
    label: 'التجويد',
  },
  {
    to: '/educational',
    icon: GraduationCap,
    iconBgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
    iconColor: 'text-cyan-500',
    label: 'التربوي',
  },
  {
    to: '/exams',
    icon: FileEdit,
    iconBgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    iconColor: 'text-yellow-500',
    label: 'الامتحانات',
  },
  {
    to: '/subjects',
    icon: Library,
    iconBgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    iconColor: 'text-indigo-500',
    label: 'المواد الدراسية',
  },
  {
    to: '/schedule',
    icon: Calendar,
    iconBgColor: 'bg-red-50 dark:bg-red-900/20',
    iconColor: 'text-red-500',
    label: 'الجدول الدراسي',
  },
  {
    to: '/attendance',
    icon: BarChart3,
    iconBgColor: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-500',
    label: 'الحضور والانصراف',
  },
  {
    to: '/students',
    icon: User,
    iconBgColor: 'bg-gray-100 dark:bg-gray-800',
    iconColor: 'text-gray-700 dark:text-gray-300',
    label: 'الطلاب',
  },
  {
    to: '/teachers',
    icon: Brain,
    iconBgColor: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-600',
    label: 'المدرسون',
  },
  {
    to: '/quran-circles',
    icon: Building2,
    iconBgColor: 'bg-orange-50 dark:bg-orange-900/20',
    iconColor: 'text-orange-500',
    label: 'حلقات القرآن',
  },
  {
    to: '/announcements',
    icon: Megaphone,
    iconBgColor: 'bg-rose-50 dark:bg-rose-900/20',
    iconColor: 'text-rose-500',
    label: 'الإعلانات',
  },
  {
    to: '/library',
    icon: BookMarked,
    iconBgColor: 'bg-teal-50 dark:bg-teal-900/20',
    iconColor: 'text-teal-600',
    label: 'المكتبة العلمية',
  },
  {
    to: '/settings',
    icon: Settings,
    iconBgColor: 'bg-slate-100 dark:bg-slate-800',
    iconColor: 'text-slate-500 dark:text-slate-400',
    label: 'الإعدادات',
  },
  {
    to: '/meetings',
    icon: Handshake,
    iconBgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    iconColor: 'text-yellow-500',
    label: 'الاجتماعات',
  },
  {
    to: '/suggestions',
    icon: Lightbulb,
    iconBgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    iconColor: 'text-yellow-500',
    label: 'المقترحات',
  },
];

const Index = () => {
  const { data: stats, isLoading: statsLoading } = useHomeStats();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader title="معهد فاطمة الزهراء" showBack={false} />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-7xl">
        {/* Welcome Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">
            مرحباً بك في معهد فاطمة الزهراء للعلوم الشرعية
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            اختر القسم المناسب للبدء
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
          <StatCard
            icon={School}
            iconBgColor="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
            label="إجمالي الطلاب"
            value={stats?.totalStudents?.toLocaleString('ar-SA') || '0'}
            loading={statsLoading}
          />
          <StatCard
            icon={CheckCircle}
            iconBgColor="bg-green-100 dark:bg-green-900/30"
            iconColor="text-green-600 dark:text-green-400"
            label="الحضور اليوم"
            value={`${stats?.attendancePercentage || 0}%`}
            loading={statsLoading}
          />
          <StatCard
            icon={BookOpen}
            iconBgColor="bg-purple-100 dark:bg-purple-900/30"
            iconColor="text-purple-600 dark:text-purple-400"
            label="الحلقات النشطة"
            value={stats?.activeCircles?.toLocaleString('ar-SA') || '0'}
            loading={statsLoading}
          />
          <StatCard
            icon={CalendarDays}
            iconBgColor="bg-orange-100 dark:bg-orange-900/30"
            iconColor="text-orange-600 dark:text-orange-400"
            label="الاختبارات القادمة"
            value={stats?.upcomingExams?.toLocaleString('ar-SA') || '0'}
            loading={statsLoading}
          />
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {sections.map((section) => (
            <IconButton
              key={section.to}
              to={section.to}
              icon={section.icon}
              iconBgColor={section.iconBgColor}
              iconColor={section.iconColor}
              label={section.label}
            />
          ))}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-4 sm:py-6 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} جميع الحقوق محفوظة لمعهد فاطمة الزهراء
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Index;
