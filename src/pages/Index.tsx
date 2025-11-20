import IconButton from "@/components/IconButton";
import PageHeader from "@/components/PageHeader";

const Index = () => {
  const sections = [
    { to: "/admin", icon: "👥", label: "الإدارة" },
    { to: "/quran", icon: "📖", label: "القرآن" },
    { to: "/tajweed", icon: "🎯", label: "التجويد" },
    { to: "/educational", icon: "📚", label: "التربوي" },
    { to: "/exams", icon: "📝", label: "الامتحانات" },
    { to: "/subjects", icon: "📚", label: "المواد الدراسية" },
    { to: "/schedule", icon: "📅", label: "الجدول الدراسي" },
    { to: "/attendance", icon: "📊", label: "الحضور والانصراف" },
    { to: "/students", icon: "🧑‍🎓", label: "الطلاب" },
    { to: "/teachers", icon: "🧑‍🏫", label: "المدرسون" },
    { to: "/quran-circles", icon: "🕌", label: "حلقات القرآن" },
    { to: "/announcements", icon: "📢", label: "الإعلانات" },
    { to: "/library", icon: "🧭", label: "المكتبة العلمية" },
    { to: "/settings", icon: "⚙️", label: "الإعدادات" },
    { to: "/meetings", icon: "🤝", label: "الاجتماعات" },
    { to: "/suggestions", icon: "💡", label: "المقترحات" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="معهد فاطمة الزهراء" showBack={false} />

      <main className="container mx-auto px-3 xs:px-4 py-4 xs:py-6 sm:py-8 md:py-12">
        <div className="text-center mb-4 xs:mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 xs:mb-3">
            مرحباً بك في معهد فاطمة الزهراء للعلوم الشرعية
          </h2>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-muted-foreground">
            اختر القسم المناسب للبدء
          </p>
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-6 max-w-7xl mx-auto">
          {sections.map((section) => (
            <IconButton
              key={section.to}
              to={section.to}
              icon={section.icon}
              label={section.label}
            />
          ))}
        </div>
      </main>

      <footer className="bg-card border-t border-border py-3 xs:py-4 sm:py-6 mt-6 xs:mt-8 sm:mt-12 md:mt-16">
        <div className="container mx-auto px-3 xs:px-4 text-center">
          <p className="text-xs xs:text-sm sm:text-base text-muted-foreground">
            © {new Date().getFullYear()} معهد فاطمة الزهراء للعلوم الشرعية -
            جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
