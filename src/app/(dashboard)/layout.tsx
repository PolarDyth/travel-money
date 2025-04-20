import { auth } from "@/auth";
import ClientLayout from "@/components/dashboard/dashboardLayout";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
      <ClientLayout session={session}>{children}</ClientLayout>
  );
}
