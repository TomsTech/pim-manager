"use client";

import { useState } from "react";
import { Settings, User, Bell, Shield, ExternalLink } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    expiryWarning: true,
    activationSuccess: true,
    emailAlerts: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage your preferences and account settings
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Card */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
            <User className="h-5 w-5 text-gray-400" />
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Profile
            </h2>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Display Name
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {user?.name || "Not available"}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Email / UPN
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {user?.username || "Not available"}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Tenant ID
              </label>
              <p className="mt-1 truncate text-sm text-gray-900 dark:text-white">
                {user?.tenantId || "Not available"}
              </p>
            </div>

            <a
              href="https://myaccount.microsoft.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Manage Microsoft Account
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
            <Bell className="h-5 w-5 text-gray-400" />
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Notifications
            </h2>
          </div>

          <div className="mt-4 space-y-4">
            {[
              {
                key: "expiryWarning",
                label: "Role Expiry Warning",
                description: "Get notified before your active roles expire",
              },
              {
                key: "activationSuccess",
                label: "Activation Success",
                description: "Show confirmation when roles are activated",
              },
              {
                key: "emailAlerts",
                label: "Email Alerts",
                description: "Receive email notifications for important events",
              },
            ].map((item) => (
              <label
                key={item.key}
                className="flex cursor-pointer items-start gap-3"
              >
                <input
                  type="checkbox"
                  checked={notifications[item.key as keyof typeof notifications]}
                  onChange={(e) =>
                    setNotifications((prev) => ({
                      ...prev,
                      [item.key]: e.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Security Card */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800 lg:col-span-2">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
            <Shield className="h-5 w-5 text-gray-400" />
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Security & Access
            </h2>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="https://entra.microsoft.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-3 rounded-lg border p-4 transition-colors",
                "border-gray-200 hover:border-blue-300 hover:bg-blue-50",
                "dark:border-gray-700 dark:hover:border-blue-700 dark:hover:bg-blue-900/20"
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Entra Admin Center
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Manage identity & access
                </p>
              </div>
              <ExternalLink className="ml-auto h-4 w-4 text-gray-400" />
            </a>

            <a
              href="https://portal.azure.com/#view/Microsoft_Azure_PIMCommon/CommonMenuBlade/~/quickstart"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-3 rounded-lg border p-4 transition-colors",
                "border-gray-200 hover:border-blue-300 hover:bg-blue-50",
                "dark:border-gray-700 dark:hover:border-blue-700 dark:hover:bg-blue-900/20"
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Azure PIM Portal
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Advanced PIM settings
                </p>
              </div>
              <ExternalLink className="ml-auto h-4 w-4 text-gray-400" />
            </a>

            <a
              href="https://mysignins.microsoft.com"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-3 rounded-lg border p-4 transition-colors",
                "border-gray-200 hover:border-blue-300 hover:bg-blue-50",
                "dark:border-gray-700 dark:hover:border-blue-700 dark:hover:bg-blue-900/20"
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                <User className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Sign-in Activity
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Review your sign-ins
                </p>
              </div>
              <ExternalLink className="ml-auto h-4 w-4 text-gray-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
