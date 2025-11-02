import PageHeader from "@/components/PageHeader";

const Meetings = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="الاجتماعات" />
      <main className="container mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl shadow-[var(--shadow-soft)] mb-8 border border-border">
          <h2 className="text-3xl font-bold mb-4 text-primary">إدارة الاجتماعات</h2>
          <p className="text-lg text-muted-foreground">جدولة ومتابعة اجتماعات المركز والمعلمين</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">📅</div>
              <h3 className="text-xl font-semibold text-primary">الاجتماعات القادمة</h3>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-accent/20 rounded-lg border-r-4 border-primary">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">اجتماع المعلمين الأسبوعي</h4>
                  <span className="text-sm text-muted-foreground">الأحد 10:00 ص</span>
                </div>
                <p className="text-sm text-muted-foreground">مناقشة خطة الأسبوع ومتابعة الطلاب</p>
              </div>
              <div className="p-4 bg-accent/20 rounded-lg border-r-4 border-secondary">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">اجتماع مجلس الإدارة</h4>
                  <span className="text-sm text-muted-foreground">الثلاثاء 2:00 م</span>
                </div>
                <p className="text-sm text-muted-foreground">مراجعة الأداء والخطط المستقبلية</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">🤝</div>
              <h3 className="text-xl font-semibold text-primary">أنواع الاجتماعات</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <div className="text-2xl">👨‍🏫</div>
                <div>
                  <h4 className="font-semibold">اجتماعات المعلمين</h4>
                  <p className="text-sm text-muted-foreground">تنسيق وتخطيط الحلقات</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <div className="text-2xl">👥</div>
                <div>
                  <h4 className="font-semibold">اجتماعات أولياء الأمور</h4>
                  <p className="text-sm text-muted-foreground">متابعة تقدم الأبناء</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <div className="text-2xl">⚙️</div>
                <div>
                  <h4 className="font-semibold">اجتماعات إدارية</h4>
                  <p className="text-sm text-muted-foreground">قرارات وتطوير المركز</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-soft)] border border-border">
          <h3 className="text-xl font-semibold mb-4 text-primary">محاضر الاجتماعات السابقة</h3>
          <p className="text-muted-foreground">سجل شامل لجميع الاجتماعات والقرارات المتخذة</p>
        </div>
      </main>
    </div>
  );
};

export default Meetings;
