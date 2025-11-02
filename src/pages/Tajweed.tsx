import PageHeader from "@/components/PageHeader";

const Tajweed = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="التجويد" />
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card p-8 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-2xl font-semibold mb-4 text-primary">أحكام التجويد</h3>
            <p className="text-muted-foreground mb-6">دراسة وتطبيق أحكام التجويد والتلاوة الصحيحة</p>
            <div className="space-y-3">
              <div className="p-4 bg-accent/30 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">أحكام النون الساكنة والتنوين</h4>
                <p className="text-sm text-muted-foreground">الإظهار، الإدغام، الإقلاب، الإخفاء</p>
              </div>
              <div className="p-4 bg-accent/30 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">أحكام المدود</h4>
                <p className="text-sm text-muted-foreground">المد الطبيعي والفرعي وأنواعه</p>
              </div>
              <div className="p-4 bg-accent/30 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">صفات الحروف</h4>
                <p className="text-sm text-muted-foreground">الصفات اللازمة والعارضة</p>
              </div>
            </div>
          </div>
          <div className="bg-card p-8 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="text-5xl mb-4">🎤</div>
            <h3 className="text-2xl font-semibold mb-4 text-primary">التطبيق العملي</h3>
            <p className="text-muted-foreground mb-6">ممارسة التجويد والتلاوة تحت إشراف المعلمين</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
                <div className="text-3xl">👨‍🏫</div>
                <div>
                  <h4 className="font-semibold text-primary">حلقات التلاوة</h4>
                  <p className="text-sm text-muted-foreground">تلاوة جماعية بإشراف معلمين متخصصين</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
                <div className="text-3xl">🎧</div>
                <div>
                  <h4 className="font-semibold text-primary">تسجيلات صوتية</h4>
                  <p className="text-sm text-muted-foreground">تسجيل وتقييم التلاوات</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
                <div className="text-3xl">📚</div>
                <div>
                  <h4 className="font-semibold text-primary">المراجع والدروس</h4>
                  <p className="text-sm text-muted-foreground">مكتبة شاملة لأحكام التجويد</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tajweed;
