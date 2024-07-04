export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-8">
      <div className="inline-block min-w-2xl max-w-2xl text-center justify-center">
        {children}
      </div>
    </section>
  );
}
