import PageHeader from "@/components/PageHeader";

const Admin = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="الإدارة" />
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <h3 className="text-2xl font-semibold mb-4 text-primary">إدارة المستخدمين</h3>
            <p className="text-muted-foreground">إضافة وتعديل وحذف حسابات المعلمين والطلاب</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <h3 className="text-2xl font-semibold mb-4 text-primary">الصلاحيات</h3>
            <p className="text-muted-foreground">إدارة صلاحيات المستخدمين ومستويات الوصول</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <h3 className="text-2xl font-semibold mb-4 text-primary">التقارير</h3>
            <p className="text-muted-foreground">عرض التقارير الإحصائية والتحليلات</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
