export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section">
      <div className="container-page max-w-3xl">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
        <div className="mt-8 space-y-5 text-muted-foreground [&_h2]:mt-8 [&_h2]:font-[family-name:var(--font-heading)] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_a]:text-brand [&_a]:underline [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </section>
  );
}
