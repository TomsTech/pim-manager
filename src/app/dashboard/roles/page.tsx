"use client";

import { useState } from "react";
import { usePimData } from "@/providers/PimDataProvider";
import { RoleCard } from "@/components/pim/RoleCard";
import { ActivationModal } from "@/components/pim/ActivationModal";
import { Key, Loader2, AlertCircle, Search } from "lucide-react";
import { RoleEligibilitySchedule, RoleAssignmentSchedule } from "@/lib/graph-client";

export default function MyRolesPage() {
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "eligible" | "active">("all");

  // Combine and filter roles
  const allRoles = [
    ...eligibleRoles.map((r) => ({ ...r, _type: "eligible" as const })),
    ...activeRoles.map((r) => ({ ...r, _type: "active" as const })),
  ].filter((role) => {
    const matchesSearch = role.roleDefinition?.displayName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "eligible" && role._type === "eligible") ||
      (filter === "active" && role._type === "active");
    return matchesSearch && matchesFilter;
  });

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Roles
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            All your PIM roles in one place
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
          <Key className="h-4 w-4" />
          {eligibleRoles.length + activeRoles.length} total
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex rounded-lg border border-gray-300 p-1 dark:border-gray-600">
          {[
            { value: "all", label: "All" },
            { value: "eligible", label: "Eligible" },
            { value: "active", label: "Active" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as typeof filter)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === tab.value
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Roles Grid */}
      {allRoles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
          <Key className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
            {searchQuery || filter !== "all" ? "No matching roles" : "No roles found"}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery || filter !== "all"
              ? "Try a different search or filter"
              : "You don't have any PIM roles assigned."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {allRoles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              type={role._type}
              onActivate={
                role._type === "eligible"
                  ? () => setSelectedRole(role as RoleEligibilitySchedule)
                  : undefined
              }
              onDeactivate={
                role._type === "active"
                  ? () => handleDeactivate(role as unknown as RoleAssignmentSchedule)
                  : undefined
              }
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
