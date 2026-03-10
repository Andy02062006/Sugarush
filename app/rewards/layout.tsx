export default function RewardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-off-white pb-24 md:pb-8">
      <main className="max-w-[1200px] mx-auto md:pl-64">
        {children}
      </main>
    </div>
  );
}
