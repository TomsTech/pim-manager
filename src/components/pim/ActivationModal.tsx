"use client";

import { useState, Fragment } from "react";
import { X, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { cn, getRoleIcon } from "@/lib/utils";
import { RoleEligibilitySchedule } from "@/lib/graph-client";

interface ActivationModalProps {
  role: RoleEligibilitySchedule;
  isOpen: boolean;
  onClose: () => void;
  onActivate: (
    roleDefinitionId: string,
    directoryScopeId: string,
    justification: string,
    duration: string,
    ticketNumber?: string,
    ticketSystem?: string
  ) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const DURATION_OPTIONS = [
  { value: "PT30M", label: "30 minutes" },
  { value: "PT1H", label: "1 hour" },
  { value: "PT2H", label: "2 hours" },
  { value: "PT4H", label: "4 hours" },
  { value: "PT8H", label: "8 hours" },
];

export function ActivationModal({
  role,
  isOpen,
  onClose,
  onActivate,
  isLoading,
  error,
}: ActivationModalProps) {
  const [justification, setJustification] = useState("");
  const [duration, setDuration] = useState("PT1H");
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticketSystem, setTicketSystem] = useState("");
  const [showTicketInfo, setShowTicketInfo] = useState(false);

  if (!isOpen) return null;

  const roleName = role.roleDefinition?.displayName || "Unknown Role";
  const scope = role.directoryScopeId === "/" ? "Directory" : role.directoryScopeId || "Unknown";
  const icon = getRoleIcon(roleName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!justification.trim()) return;

    try {
      await onActivate(
        role.roleDefinitionId,
        role.directoryScopeId,
        justification,
        duration,
        ticketNumber || undefined,
        ticketSystem || undefined
      );
      onClose();
    } catch {
      // Error is handled by parent
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all dark:bg-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{icon}</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Activate Role
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {roleName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 flex items-start gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Scope info */}
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Scope:</span> {scope}
                </p>
              </div>

              {/* Duration */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Clock className="mr-1 inline h-4 w-4" />
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className={cn(
                    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm",
                    "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                    "dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  )}
                >
                  {DURATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Justification */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Justification <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Provide a reason for activating this role..."
                  rows={3}
                  required
                  className={cn(
                    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm",
                    "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                    "dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  )}
                />
              </div>

              {/* Ticket Info Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowTicketInfo(!showTicketInfo)}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {showTicketInfo ? "- Hide" : "+ Add"} ticket information
                </button>

                {showTicketInfo && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                        Ticket Number
                      </label>
                      <input
                        type="text"
                        value={ticketNumber}
                        onChange={(e) => setTicketNumber(e.target.value)}
                        placeholder="INC123456"
                        className={cn(
                          "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm",
                          "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                          "dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        )}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                        Ticket System
                      </label>
                      <input
                        type="text"
                        value={ticketSystem}
                        onChange={(e) => setTicketSystem(e.target.value)}
                        placeholder="ServiceNow"
                        className={cn(
                          "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm",
                          "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                          "dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "rounded-lg px-4 py-2.5 text-sm font-medium",
                  "text-gray-700 hover:bg-gray-100",
                  "dark:text-gray-300 dark:hover:bg-gray-700"
                )}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !justification.trim()}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium",
                  "bg-blue-600 text-white hover:bg-blue-700",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Activate Role
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
