import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="text-9xl font-bold text-primary">404</div>
        <h1 className="text-3xl font-bold text-foreground">الصفحة غير موجودة</h1>
        <p className="text-muted-foreground text-lg">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
