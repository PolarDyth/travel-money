import { auth } from "@/auth";

export async function WelcomeMessage() {
  const session = await auth();
  return (
    <p className="text-sm text-gray-500">
      Welcome back, {session?.user.name}!
    </p>
  );
}