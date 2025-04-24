"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  BarChart3,
  CalendarClock,
  CircleDollarSign,
  Coins,
  Globe,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Sparkles,
  User,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";

interface Props {
  children: React.ReactNode;
  session: Session | null;
}

export default function ClientLayout({ children, session }: Props) {
  return (
    <SessionProvider session={session}>
      <LayoutContent>{children}</LayoutContent>
    </SessionProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  
  return (
      <div className="flex h-screen overflow-hidden">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-card px-2 py-4 shadow-sm transition-transform duration-200 lg:static lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between px-2">
            <Link href="/" className="flex items-center space-x-2">
              <CircleDollarSign className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Travel Money</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-8 space-y-1">
            <NavItem
              href="/"
              icon={<LayoutDashboard className="h-5 w-5" />}
              label="Dashboard"
            />
            <NavItem
              href="/transaction"
              icon={<ArrowLeftRight className="h-5 w-5" />}
              label="Currency Exchange"
            />
            <NavItem
              href="/assistant"
              icon={<Sparkles className="h-5 w-5" />}
              label="Assistant"
            />
            <NavItem
              href="/orders"
              icon={<ShoppingBag className="h-5 w-5" />}
              label="Online Orders"
            />
            <NavItem
              href="/stock"
              icon={<Package className="h-5 w-5" />}
              label="Stock Management"
            />
            <NavItem
              href="/rates"
              icon={<Globe className="h-5 w-5" />}
              label="Exchange Rates"
            />
            <NavItem
              href="/overs-shorts"
              icon={<Coins className="h-5 w-5" />}
              label="Overs & Shorts"
            />
            <NavItem
              href="/transactions"
              icon={<History className="h-5 w-5" />}
              label="Transaction History"
            />
            <NavItem
              href="/reports"
              icon={<BarChart3 className="h-5 w-5" />}
              label="Reports"
            />
            <NavItem
              href="/end-of-day"
              icon={<CalendarClock className="h-5 w-5" />}
              label="End of Day"
            />
            <NavItem
              href="/settings"
              icon={<Settings className="h-5 w-5" />}
              label="Settings"
            />
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top navigation */}
          <header className="border-b bg-card px-4 py-2 shadow-sm">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-2 lg:ml-auto">
                <p className="mr-2 hidden text-sm font-medium lg:block">
                  {session?.user?.name}{" "}{session?.user?.lastName}
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function NavItem({ href, icon, label }: NavItemProps) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
