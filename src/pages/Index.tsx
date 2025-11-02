import IconButton from "@/components/IconButton";
import PageHeader from "@/components/PageHeader";

const Index = () => {
  const sections = [
    { to: "/admin", icon: "👥", label: "الإدارة" },
    { to: "/quran", icon: "📖", label: "القرآن" },
    { to: "/tajweed", icon: "🎯", label: "التجويد" },
    { to: "/educational", icon: "📚", label: "التربوي" },
    { to: "/meetings", icon: "🤝", label: "الاجتماعات" },
    { to: "/suggestions", icon: "💡", label: "المقترحات" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="مركز إقرأ" showBack={false} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            مرحباً بك في نظام إدارة مركز القرآن الكريم
          </h2>
          <p className="text-xl text-muted-foreground">
            اختر القسم المناسب للبدء
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
      
      <footer className="bg-card border-t border-border py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} مركز إقرأ - جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
