import { cn } from "@/lib/utils";
import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Travel Money",
  description: "Travel Money Exchange",
  icons: {
    icon: "/favicon.svg",
  }
};

export default function RootLayout({
  children,
  auth,
  dashboard,
}: {
  children: React.ReactNode;
  auth: React.ReactNode;
  dashboard: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background antialiased", inter.className)}>
        {auth}
        {dashboard}
        {children}
      </body>
    </html>
  );
}
