"use client";

import { usePimData } from "@/providers/PimDataProvider";
import { RoleCard } from "@/components/pim/RoleCard";
import { Users, Loader2, AlertCircle, Clock } from "lucide-react";
import { RoleAssignmentSchedule } from "@/lib/graph-client";

export default function ActiveRolesPage() {
  const {
    activeRoles,
    isLoading,
    error,
    deactivateRole,
    isActivating,
  } = usePimData();

  const handleDeactivate = async (role: RoleAssignmentSchedule) => {
    if (confirm("Are you sure you want to deactivate this role?")) {
      await deactivateRole(role.roleDefinitionId, role.directoryScopeId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Loading active roles...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 dark:bg-red-900/30">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-200">
              Error loading roles
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Active Roles
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Currently activated privileged roles
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 dark:bg-green-900/50 dark:text-green-300">
          <Users className="h-4 w-4" />
          {activeRoles.length} active
        </div>
      </div>

      {/* Roles Grid */}
      {activeRoles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
            No active roles
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You don&apos;t have any active role assignments at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeRoles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              type="active"
              onDeactivate={handleDeactivate}
              isLoading={isActivating}
            />
          ))}
        </div>
      )}
    </div>
  );
}
