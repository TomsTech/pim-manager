"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { PimDataProvider } from "@/providers/PimDataProvider";
import { DemoDataProvider } from "@/providers/DemoDataProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { Shield, Loader2, AlertTriangle, Play, Menu } from "lucide-react";

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
      <div className="flex min-h-screen items-center justify-center bg-[#0d1117]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-gray-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login
  if (!isAuthenticated && !demoMode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1117]">
        <div className="w-full max-w-md px-4">
          <div className="rounded-xl bg-[#161b22] p-8 border border-gray-800">
            {/* Logo and Title */}
            <div className="mb-8 flex flex-col items-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Entra ID PIM Manager
              </h1>
              <p className="mt-2 text-center text-sm text-gray-400">
                Streamline your privileged role management
              </p>
            </div>

            {/* Configuration Warning */}
            {!isConfigured && (
              <div className="mb-6 rounded-lg bg-amber-900/30 p-4 border border-amber-800">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-200">Azure AD not configured</p>
                    <p className="mt-1 text-amber-300">
                      Set <code className="bg-amber-800 px-1 rounded text-xs">NEXT_PUBLIC_AZURE_CLIENT_ID</code> to enable authentication.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-900/50 p-4 text-sm text-red-400 border border-red-800">
                {error}
              </div>
            )}

            {/* Microsoft Sign-in Button */}
            <button
              onClick={login}
              disabled={!isConfigured}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-600 bg-[#21262d] px-4 py-3 text-sm font-medium text-gray-200 hover:bg-[#30363d] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MicrosoftLogo />
              Sign in with Microsoft
            </button>

            {/* Demo Mode Button */}
            <div className="mt-4">
              <button
                onClick={() => setDemoMode(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <Play className="h-4 w-4" />
                Try Demo Mode
              </button>
              <p className="mt-2 text-center text-xs text-gray-500">
                Explore with sample data - no sign-in required
              </p>
            </div>

            {/* Features */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-xs text-gray-500 mb-3">Features:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  View all eligible &amp; active roles
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Activate roles with justification
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Security alerts &amp; recommendations
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-gray-600">
            Open source alternative to commercial PIM tools
          </p>
        </div>
      </div>
    );
  }

  // Demo mode banner component
  const DemoBanner = () => (
    <div className="bg-blue-600 px-4 py-2 text-center text-sm text-white">
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
      <div className="min-h-screen bg-[#0d1117]">
        {demoMode && <DemoBanner />}
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          demoMode={demoMode}
          onExitDemo={() => setDemoMode(false)}
        />

        <div className="lg:pl-64">
          {/* Mobile header */}
          <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-x-4 border-b border-gray-800 bg-[#0d1117] px-4 lg:hidden">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-400"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" />
            </button>
            <span className="text-lg font-semibold text-white">Entra ID PIM Manager</span>
          </div>

          <main className="p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </DataProvider>
  );
}
