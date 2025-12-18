"use client";

import { useState } from "react";
import { usePimData } from "@/providers/PimDataProvider";
import { RoleCard } from "@/components/pim/RoleCard";
import { ActivationModal } from "@/components/pim/ActivationModal";
import { Shield, Key, Users, AlertCircle, Loader2 } from "lucide-react";
import { RoleEligibilitySchedule, RoleAssignmentSchedule } from "@/lib/graph-client";

export default function DashboardPage() {
  const {
    eligibleRoles,
    activeRoles,
    isLoading,
    error,
    activateRole,
    deactivateRole,
    isActivating,
    activationError,
  } = usePimData();

  const [selectedRole, setSelectedRole] = useState<RoleEligibilitySchedule | null>(null);

  const handleActivate = (role: RoleEligibilitySchedule) => {
    setSelectedRole(role);
  };

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
            Loading your roles...
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
    <div className="space-y-8">
      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Eligible Roles
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {eligibleRoles.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Active Roles
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeRoles.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
              <Key className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Roles
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {eligibleRoles.length + activeRoles.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Roles Section */}
      {activeRoles.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Active Roles
          </h2>
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
        </div>
      )}

      {/* Eligible Roles Section */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Eligible Roles
        </h2>
        {eligibleRoles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
              No eligible roles
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              You don&apos;t have any eligible PIM roles assigned.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {eligibleRoles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                type="eligible"
                onActivate={handleActivate}
                isLoading={isActivating}
              />
            ))}
          </div>
        )}
      </div>

      {/* Activation Modal */}
      {selectedRole && (
        <ActivationModal
          role={selectedRole}
          isOpen={!!selectedRole}
          onClose={() => setSelectedRole(null)}
          onActivate={activateRole}
          isLoading={isActivating}
          error={activationError}
        />
      )}
    </div>
  );
}
