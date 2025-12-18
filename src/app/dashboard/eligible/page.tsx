"use client";

import { useState } from "react";
import { usePimData } from "@/providers/PimDataProvider";
import { RoleCard } from "@/components/pim/RoleCard";
import { ActivationModal } from "@/components/pim/ActivationModal";
import { Shield, Loader2, AlertCircle, Search } from "lucide-react";
import { RoleEligibilitySchedule } from "@/lib/graph-client";

export default function EligibleRolesPage() {
  const {
    eligibleRoles,
    isLoading,
    error,
    activateRole,
    isActivating,
    activationError,
  } = usePimData();

  const [selectedRole, setSelectedRole] = useState<RoleEligibilitySchedule | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRoles = eligibleRoles.filter((role) =>
    role.roleDefinition?.displayName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Loading eligible roles...
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
            Eligible Roles
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Roles you can activate on-demand
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
          <Shield className="h-4 w-4" />
          {eligibleRoles.length} roles
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search roles..."
          className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Roles Grid */}
      {filteredRoles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
            {searchQuery ? "No matching roles" : "No eligible roles"}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery
              ? "Try a different search term"
              : "You don't have any eligible PIM roles assigned."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRoles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              type="eligible"
              onActivate={setSelectedRole}
              isLoading={isActivating}
            />
          ))}
        </div>
      )}

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
