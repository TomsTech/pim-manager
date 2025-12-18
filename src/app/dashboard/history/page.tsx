"use client";

import { History, Clock, AlertCircle } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          History
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          View your past role activations and changes
        </p>
      </div>

      {/* Placeholder */}
      <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
        <History className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
          Coming Soon
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Role activation history and audit logs will be available in a future update.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          <Clock className="h-4 w-4" />
          Track all your privileged access activities
        </div>
      </div>
    </div>
  );
}
