import PageHeader from "@/components/PageHeader";

const Announcements = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="الإعلانات والتنبيهات" />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            الإعلانات والتنبيهات
          </h2>
          <p className="text-muted-foreground">سيتم تطوير هذا القسم قريباً</p>
        </div>
      </main>
    </div>
  );
};

export default Announcements;
