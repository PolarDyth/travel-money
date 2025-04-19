import ClientLayout from "@/components/dashboard/dashboardLayout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ClientLayout>{children}</ClientLayout>
  );
}
