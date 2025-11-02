import PageHeader from "@/components/PageHeader";

const Quran = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="القرآن" />
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-8 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="text-5xl mb-4">📖</div>
            <h3 className="text-2xl font-semibold mb-4 text-primary">حلقات التحفيظ</h3>
            <p className="text-muted-foreground mb-4">إدارة حلقات تحفيظ القرآن الكريم ومتابعة تقدم الطلاب</p>
            <ul className="space-y-2 text-foreground">
              <li>• إضافة حلقات جديدة</li>
              <li>• تسجيل حضور الطلاب</li>
              <li>• متابعة الحفظ والمراجعة</li>
            </ul>
          </div>
          <div className="bg-card p-8 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-semibold mb-4 text-primary">الاختبارات</h3>
            <p className="text-muted-foreground mb-4">إدارة اختبارات الحفظ وتقييم الطلاب</p>
            <ul className="space-y-2 text-foreground">
              <li>• جدولة الاختبارات</li>
              <li>• تسجيل النتائج</li>
              <li>• إصدار الشهادات</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Quran;
