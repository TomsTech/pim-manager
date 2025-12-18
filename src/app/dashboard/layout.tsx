"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { PimDataProvider } from "@/providers/PimDataProvider";
import { DemoDataProvider } from "@/providers/DemoDataProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Shield, Loader2, AlertTriangle, Play } from "lucide-react";

// Microsoft logo SVG component
const MicrosoftLogo = () => (
  <svg width="21" height="21" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
    <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
    <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
    <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
  </svg>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, login, error } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  // Check if Azure credentials are configured
  const isConfigured = Boolean(process.env.NEXT_PUBLIC_AZURE_CLIENT_ID);

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
  if (!isAuthenticated && !demoMode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-slate-900">
        <div className="w-full max-w-md px-4">
          <div className="rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            {/* Logo and Title */}
            <div className="mb-8 flex flex-col items-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                PIM Manager
              </h1>
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Streamline your Microsoft Entra ID privileged role management
              </p>
            </div>

            {/* Configuration Warning */}
            {!isConfigured && (
              <div className="mb-6 rounded-lg bg-amber-50 dark:bg-amber-900/30 p-4 border border-amber-200 dark:border-amber-800">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800 dark:text-amber-200">Azure AD not configured</p>
                    <p className="mt-1 text-amber-700 dark:text-amber-300">
                      Set <code className="bg-amber-100 dark:bg-amber-800 px-1 rounded text-xs">NEXT_PUBLIC_AZURE_CLIENT_ID</code> in your environment variables to enable authentication.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-400 border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            {/* Microsoft Sign-in Button - Official Style */}
            <button
              onClick={login}
              disabled={!isConfigured}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-700"
            >
              <MicrosoftLogo />
              Sign in with Microsoft
            </button>

            {/* Demo Mode Button */}
            <div className="mt-4">
              <button
                onClick={() => setDemoMode(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
              >
                <Play className="h-4 w-4" />
                Try Demo Mode
              </button>
              <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                Explore the interface with sample data
              </p>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">or continue with</span>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <span>View eligible &amp; active roles</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span>Activate roles with justification</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                  <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span>Track activation history</span>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
              By signing in, you agree to let this app access your Entra ID PIM data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Demo mode banner component
  const DemoBanner = () => (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-center text-sm text-white">
      <span className="font-medium">Demo Mode</span> - Exploring with sample data.{" "}
      <button
        onClick={() => setDemoMode(false)}
        className="underline hover:no-underline ml-2"
      >
        Exit Demo
      </button>
    </div>
  );

  // Authenticated or Demo mode - show dashboard
  const DataProvider = demoMode ? DemoDataProvider : PimDataProvider;

  return (
    <DataProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {demoMode && <DemoBanner />}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="lg:pl-72">
          <Header onMenuClick={() => setSidebarOpen(true)} demoMode={demoMode} />

          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </DataProvider>
  );
}
