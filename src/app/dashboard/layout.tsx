"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { PimDataProvider } from "@/providers/PimDataProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Shield, Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, login, error } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md px-4">
          <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
            <div className="mb-8 flex flex-col items-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                PIM Manager
              </h1>
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Streamline your Microsoft Entra ID privileged role management
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              onClick={login}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              <svg className="h-5 w-5" viewBox="0 0 21 21" fill="currentColor">
                <path d="M0 0h10v10H0V0zm11 0h10v10H11V0zM0 11h10v10H0V11zm11 0h10v10H11V11z" />
              </svg>
              Sign in with Microsoft
            </button>

            <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
              By signing in, you agree to let this app access your Entra ID PIM data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated - show dashboard
  return (
    <PimDataProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="lg:pl-72">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </PimDataProvider>
  );
}
