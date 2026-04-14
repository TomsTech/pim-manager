"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/providers/AuthProvider";
import {
  LayoutDashboard,
  FileText,
  X,
  HelpCircle,
  LogOut,
  Sun,
  Monitor,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Report", href: "/dashboard/report", icon: FileText },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  demoMode?: boolean;
  onExitDemo?: () => void;
}

export function Sidebar({ open, onClose, demoMode, onExitDemo }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = () => {
    if (demoMode && onExitDemo) {
      onExitDemo();
    } else {
      logout();
    }
  };

  const sidebarContent = (
    <div className="flex grow flex-col overflow-y-auto bg-[#0d1117] border-r border-gray-800">
      {/* Logo/Brand */}
      <div className="flex h-14 shrink-0 items-center px-4 border-b border-gray-800">
        <span className="text-lg font-semibold text-white">Entra ID PIM Manager</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-2 py-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href ||
              (item.href === "/dashboard" && pathname === "/dashboard");
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isActive
                        ? "text-blue-400"
                        : "text-gray-400 group-hover:text-white"
                    )}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="mt-auto border-t border-gray-800 px-2 py-4 space-y-2">
        {/* Theme toggles */}
        {mounted && (
          <div className="flex items-center gap-1 px-3 py-2">
            <button
              onClick={() => setTheme("light")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                theme === "light"
                  ? "bg-gray-700 text-white"
                  : "text-gray-500 hover:text-gray-300"
              )}
              title="Light mode"
            >
              <Sun className="h-4 w-4" />
            </button>
            <button
              onClick={() => setTheme("system")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                theme === "system"
                  ? "bg-gray-700 text-white"
                  : "text-gray-500 hover:text-gray-300"
              )}
              title="System mode"
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                theme === "dark"
                  ? "bg-gray-700 text-white"
                  : "text-gray-500 hover:text-gray-300"
              )}
              title="Dark mode"
            >
              <Moon className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Help link */}
        <Link
          href="/dashboard/help"
          className="flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          <HelpCircle className="h-5 w-5" />
          Help
        </Link>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium text-red-500 hover:bg-gray-800 hover:text-red-400"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={cn(
          "relative z-50 lg:hidden",
          open ? "" : "hidden"
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-black/80"
          onClick={onClose}
        />

        <div className="fixed inset-0 flex">
          <div className="relative mr-16 flex w-full max-w-xs flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button
                type="button"
                className="-m-2.5 p-2.5"
                onClick={onClose}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        {sidebarContent}
      </div>
    </>
  );
}
