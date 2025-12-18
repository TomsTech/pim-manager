"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Key,
  Users,
  History,
  Settings,
  X,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Roles", href: "/dashboard/roles", icon: Key },
  { name: "Eligible Roles", href: "/dashboard/eligible", icon: Shield },
  { name: "Active Roles", href: "/dashboard/active", icon: Users },
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <Shield className="h-8 w-8 text-blue-500" />
        <span className="ml-3 text-xl font-bold text-white">PIM Manager</span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        isActive
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white",
                        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive
                            ? "text-white"
                            : "text-gray-400 group-hover:text-white",
                          "h-6 w-6 shrink-0"
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
          <li className="mt-auto">
            <div className="rounded-md bg-gray-800 p-4">
              <p className="text-xs text-gray-400">
                Manage your Entra ID privileged roles with ease.
              </p>
            </div>
          </li>
        </ul>
      </nav>
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
          className="fixed inset-0 bg-gray-900/80"
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
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {sidebarContent}
      </div>
    </>
  );
}
