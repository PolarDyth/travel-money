import { auth } from "@/auth";
import ClientLayout from "@/components/dashboard/dashboardLayout";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  console.log(session)
  return (
      <ClientLayout session={session}>{children}</ClientLayout>
  );
}
