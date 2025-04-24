"use client";

import { cn } from "@/lib/utils";
import {
  ArrowLeftRight,
  BarChart3,
  CalendarClock,
  CircleDollarSign,
  Coins,
  Globe,
  LayoutDashboard,
  Link,
  Package,
  Settings,
  ShoppingBag,
  X,
  History,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div>
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
            label="Exchange Assistant"
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
