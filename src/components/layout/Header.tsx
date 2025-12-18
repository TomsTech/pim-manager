"use client";

import { useTheme } from "next-themes";
import { useAuth } from "@/providers/AuthProvider";
import {
  Sun,
  Moon,
  Menu,
  User,
  LogOut,
  Settings,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePimData } from "@/providers/PimDataProvider";

interface HeaderProps {
  onMenuClick?: () => void;
  demoMode?: boolean;
}

export function Header({ onMenuClick, demoMode }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { refreshRoles, isLoading } = usePimData();

  // Demo user info
  const displayUser = demoMode
    ? { name: "Demo User", username: "demo@contoso.com" }
    : user;
  const [mounted, setMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-900">
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden dark:text-gray-200"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden dark:bg-gray-700" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            PIM Manager
          </h1>
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Refresh button */}
          <button
            onClick={() => refreshRoles()}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
            title="Refresh roles"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          )}

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-700" />

          {/* User menu */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-x-3 text-sm"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {displayUser?.name || displayUser?.username || "User"}
                </span>
              </span>
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
                  <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                    {displayUser?.username}
                    {demoMode && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900 px-2 py-0.5 text-xs font-medium text-purple-800 dark:text-purple-200">
                        Demo
                      </span>
                    )}
                  </div>
                  <hr className="border-gray-200 dark:border-gray-700" />
                  <button
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    onClick={() => {
                      setShowUserMenu(false);
                    }}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
