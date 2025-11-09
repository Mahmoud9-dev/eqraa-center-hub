import PageHeader from "@/components/PageHeader";

const Attendance = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="الحضور والانصراف" />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            نظام الحضور والانصراف
          </h2>
          <p className="text-muted-foreground">سيتم تطوير هذا القسم قريباً</p>
        </div>
      </main>
    </div>
  );
};

export default Attendance;
