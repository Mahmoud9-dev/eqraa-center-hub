import PageHeader from "@/components/PageHeader";

const Suggestions = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="المقترحات" />
      <main className="container mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-secondary to-secondary/80 text-foreground p-8 rounded-2xl shadow-[var(--shadow-soft)] mb-8">
          <h2 className="text-3xl font-bold mb-3">صندوق المقترحات والشكاوى</h2>
          <p className="text-lg">نرحب بآرائكم ومقترحاتكم لتطوير المركز وتحسين الخدمات</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card p-8 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="text-5xl mb-4">💡</div>
            <h3 className="text-2xl font-semibold mb-4 text-primary">تقديم مقترح جديد</h3>
            <p className="text-muted-foreground mb-6">شاركنا أفكارك ومقترحاتك لتطوير المركز</p>
            
            <div className="space-y-4">
              <div className="p-4 bg-accent/20 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">📝 مقترحات تعليمية</h4>
                <p className="text-sm text-muted-foreground">أفكار لتحسين طرق التدريس والمناهج</p>
              </div>
              <div className="p-4 bg-accent/20 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">🏢 مقترحات إدارية</h4>
                <p className="text-sm text-muted-foreground">تحسين الإجراءات والعمليات الإدارية</p>
              </div>
              <div className="p-4 bg-accent/20 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">🎯 مقترحات عامة</h4>
                <p className="text-sm text-muted-foreground">أي أفكار أخرى لتطوير المركز</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-2xl font-semibold mb-4 text-primary">المقترحات الحالية</h3>
            <p className="text-muted-foreground mb-6">متابعة حالة المقترحات المقدمة</p>
            
            <div className="space-y-3">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">تحسين جدول الحلقات</h4>
                  <span className="text-xs px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">قيد الدراسة</span>
                </div>
                <p className="text-sm text-muted-foreground">مقترح بتعديل مواعيد بعض الحلقات</p>
              </div>
              
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">إضافة مكتبة رقمية</h4>
                  <span className="text-xs px-3 py-1 bg-green-100 text-green-800 rounded-full">تم التنفيذ</span>
                </div>
                <p className="text-sm text-muted-foreground">توفير مراجع إلكترونية للطلاب</p>
              </div>
              
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">برنامج تكريم المتفوقين</h4>
                  <span className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full">جديد</span>
                </div>
                <p className="text-sm text-muted-foreground">حفل سنوي لتكريم الطلاب المتميزين</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Suggestions;
