"use client";

import { useState } from "react";
import { ChevronRight, Clock, Play, Square, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { RoleEligibilitySchedule, RoleAssignmentSchedule } from "@/lib/graph-client";

interface RoleListItemProps {
  role: RoleEligibilitySchedule | RoleAssignmentSchedule;
  type: "eligible" | "active";
  onActivate?: (role: RoleEligibilitySchedule) => void;
  onDeactivate?: (role: RoleAssignmentSchedule) => void;
  isLoading?: boolean;
}

function formatTimeRemaining(endDateTime: string): string {
  const end = new Date(endDateTime);
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "Expired";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }
  return `${minutes}m remaining`;
}

export function RoleListItem({
  role,
  type,
  onActivate,
  onDeactivate,
  isLoading,
}: RoleListItemProps) {
  const [expanded, setExpanded] = useState(false);
  const roleName = role.roleDefinition?.displayName || "Unknown Role";
  const description = role.roleDefinition?.description || "";
  const isActive = type === "active";
  const activeRole = isActive ? (role as RoleAssignmentSchedule) : null;

  // Calculate time remaining for active roles
  const endDateTime = activeRole?.scheduleInfo?.expiration?.endDateTime;
  const timeRemaining = endDateTime ? formatTimeRemaining(endDateTime) : null;

  return (
    <div className="border-b border-gray-800 last:border-b-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[#161b22] transition-colors text-left"
      >
        {/* Status indicator */}
        <Circle
          className={cn(
            "h-5 w-5 flex-shrink-0",
            isActive
              ? "text-green-500 fill-green-500/20"
              : "text-amber-500 fill-amber-500/20"
          )}
        />

        {/* Role info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white truncate">{roleName}</span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="inline-flex items-center gap-1 text-xs text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              PIM Configured
            </span>
            {isActive && timeRemaining && (
              <span className="flex items-center gap-1 text-xs text-blue-400">
                <Clock className="h-3 w-3" />
                {timeRemaining}
              </span>
            )}
            {!isActive && (
              <span className="text-xs text-gray-500">
                No active assignment
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <ChevronRight
          className={cn(
            "h-5 w-5 text-gray-500 transition-transform",
            expanded && "rotate-90"
          )}
        />
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 py-4 bg-[#161b22] border-t border-gray-800">
          <p className="text-sm text-gray-400 mb-4">{description || "No description available."}</p>

          <div className="flex items-center gap-3">
            {isActive ? (
              <button
                onClick={() => onDeactivate?.(role as RoleAssignmentSchedule)}
                disabled={isLoading}
                className={cn(
                  "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  "bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30",
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
                  "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  "bg-blue-600 text-white hover:bg-blue-500",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                <Play className="h-4 w-4" />
                Activate
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
