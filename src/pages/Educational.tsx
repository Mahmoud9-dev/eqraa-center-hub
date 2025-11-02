import PageHeader from "@/components/PageHeader";

const Educational = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="التربوي" />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8 rounded-2xl shadow-[var(--shadow-soft)]">
          <h2 className="text-3xl font-bold mb-3">البرامج التربوية والتعليمية</h2>
          <p className="text-lg opacity-90">تطوير القيم الإسلامية والمهارات التربوية للطلاب</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-3 text-primary">الدروس الشرعية</h3>
            <p className="text-muted-foreground">دروس في العقيدة والفقه والسيرة النبوية</p>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="text-5xl mb-4">🤲</div>
            <h3 className="text-xl font-semibold mb-3 text-primary">الأخلاق والسلوك</h3>
            <p className="text-muted-foreground">تعزيز القيم الأخلاقية والسلوك الإسلامي</p>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-3 text-primary">المهارات الحياتية</h3>
            <p className="text-muted-foreground">تطوير مهارات التواصل والقيادة والعمل الجماعي</p>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="text-5xl mb-4">🌟</div>
            <h3 className="text-xl font-semibold mb-3 text-primary">الأنشطة الطلابية</h3>
            <p className="text-muted-foreground">مسابقات وفعاليات تربوية هادفة</p>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="text-xl font-semibold mb-3 text-primary">برامج الأسرة</h3>
            <p className="text-muted-foreground">إشراك الأسرة في العملية التربوية</p>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="text-5xl mb-4">💡</div>
            <h3 className="text-xl font-semibold mb-3 text-primary">الإرشاد والتوجيه</h3>
            <p className="text-muted-foreground">استشارات تربوية ونفسية للطلاب</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Educational;
