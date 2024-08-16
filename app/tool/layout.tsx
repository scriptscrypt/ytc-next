export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <section className="flex flex-col px-4 md:px-24 lg:px-64 gap-4 py-8 md:py-8">
          <div className="text-center">{children}</div>
        </section>
    </>
  );
}
