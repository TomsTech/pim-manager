"use client";

import { useState } from "react";
import { Clock, Play, Square, ChevronRight } from "lucide-react";
import { cn, formatRelativeTime, getRoleIcon } from "@/lib/utils";
import { RoleEligibilitySchedule, RoleAssignmentSchedule } from "@/lib/graph-client";

interface RoleCardProps {
  role: RoleEligibilitySchedule | RoleAssignmentSchedule;
  type: "eligible" | "active";
  onActivate?: (role: RoleEligibilitySchedule) => void;
  onDeactivate?: (role: RoleAssignmentSchedule) => void;
  isLoading?: boolean;
}

export function RoleCard({
  role,
  type,
  onActivate,
  onDeactivate,
  isLoading,
}: RoleCardProps) {
  const roleName = role.roleDefinition?.displayName || "Unknown Role";
  const scope = role.directoryScopeId === "/" ? "Directory" : role.directoryScopeId || "Unknown";
  const icon = getRoleIcon(roleName);

  const isActive = type === "active";
  const activeRole = isActive ? (role as RoleAssignmentSchedule) : null;
  const eligibleRole = !isActive ? (role as RoleEligibilitySchedule) : null;

  // Calculate time remaining for active roles
  const endDateTime = activeRole?.scheduleInfo?.expiration?.endDateTime;
  const timeRemaining = endDateTime ? formatRelativeTime(endDateTime) : null;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-gray-800",
        isActive
          ? "border-green-200 dark:border-green-800"
          : "border-gray-200 dark:border-gray-700"
      )}
    >
      {/* Status indicator */}
      <div
        className={cn(
          "absolute right-0 top-0 h-16 w-16 -translate-y-1/2 translate-x-1/2 rotate-45 transform",
          isActive ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
        )}
      />

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {roleName}
            </h3>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Scope: {scope}
            </p>
          </div>
        </div>
      </div>

      {/* Time info */}
      {isActive && timeRemaining && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-green-700 dark:text-green-300">
            Expires {timeRemaining}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        {isActive ? (
          <button
            onClick={() => onDeactivate?.(role as RoleAssignmentSchedule)}
            disabled={isLoading}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              "bg-red-50 text-red-700 hover:bg-red-100",
              "dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <Square className="h-4 w-4" />
            Deactivate
          </button>
        ) : (
          <button
            onClick={() => onActivate?.(role as RoleEligibilitySchedule)}
            disabled={isLoading}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              "bg-blue-50 text-blue-700 hover:bg-blue-100",
              "dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <Play className="h-4 w-4" />
            Activate
          </button>
        )}

        <button
          className={cn(
            "ml-auto flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-700",
            "dark:text-gray-400 dark:hover:text-gray-200"
          )}
        >
          Details
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
