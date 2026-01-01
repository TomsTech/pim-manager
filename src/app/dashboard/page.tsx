"use client";

import { useState, useMemo } from "react";
import { usePimData } from "@/providers/PimDataProvider";
import { RoleListItem } from "@/components/pim/RoleListItem";
import { ActivationModal } from "@/components/pim/ActivationModal";
import { Search, ChevronDown, Lock, Shield, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { RoleEligibilitySchedule, RoleAssignmentSchedule } from "@/lib/graph-client";

type FilterType = "all" | "eligible" | "active";

export default function DashboardPage() {
  const {
    eligibleRoles,
    activeRoles,
    isLoading,
    error,
    refreshRoles,
    activateRole,
    deactivateRole,
    isActivating,
    activationError,
  } = usePimData();

  const [selectedRole, setSelectedRole] = useState<RoleEligibilitySchedule | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Combine and filter roles
  const allRoles = useMemo(() => {
    const roles: { role: RoleEligibilitySchedule | RoleAssignmentSchedule; type: "eligible" | "active" }[] = [];

    if (filter === "all" || filter === "active") {
      activeRoles.forEach((role) => roles.push({ role, type: "active" }));
    }

    if (filter === "all" || filter === "eligible") {
      eligibleRoles.forEach((role) => roles.push({ role, type: "eligible" }));
    }

    // Filter by search query
    if (searchQuery) {
      return roles.filter(({ role }) =>
        role.roleDefinition?.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return roles;
  }, [eligibleRoles, activeRoles, filter, searchQuery]);

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
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-gray-400">
            Loading your roles...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-900/30 p-6 border border-red-800">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-400" />
          <div>
            <h3 className="font-semibold text-red-200">
              Error loading roles
            </h3>
            <p className="mt-1 text-sm text-red-300">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const filterLabels: Record<FilterType, string> = {
    all: "All Roles",
    eligible: "Eligible Only",
    active: "Active Only",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Role Overview - Left/Main Section */}
      <div className="lg:col-span-2">
        {/* Header with refresh */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Role Overview</h2>
          <button
            onClick={() => refreshRoles()}
            disabled={isLoading}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-[#161b22] border border-gray-700 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 rounded-lg bg-[#161b22] border border-gray-700 px-4 py-2 text-sm text-white hover:bg-[#21262d] transition-colors"
            >
              {filterLabels[filter]}
              <ChevronDown className="h-4 w-4" />
            </button>

            {showFilterDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowFilterDropdown(false)}
                />
                <div className="absolute right-0 z-20 mt-2 w-40 rounded-lg bg-[#161b22] border border-gray-700 py-1 shadow-lg">
                  {(Object.keys(filterLabels) as FilterType[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setFilter(key);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-[#21262d] ${
                        filter === key ? "text-blue-400" : "text-gray-300"
                      }`}
                    >
                      {filterLabels[key]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Roles List */}
        <div className="rounded-lg bg-[#161b22] border border-gray-800 overflow-hidden">
          {allRoles.length === 0 ? (
            <div className="p-8 text-center">
              <Shield className="mx-auto h-12 w-12 text-gray-600" />
              <h3 className="mt-4 text-sm font-semibold text-white">
                No roles found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery
                  ? "Try a different search term"
                  : "You don't have any PIM roles assigned"}
              </p>
            </div>
          ) : (
            <div>
              {allRoles.map(({ role, type }) => (
                <RoleListItem
                  key={role.id}
                  role={role}
                  type={type}
                  onActivate={handleActivate}
                  onDeactivate={handleDeactivate}
                  isLoading={isActivating}
                />
              ))}
            </div>
          )}
        </div>

        {/* Stats summary */}
        <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
          <span>{eligibleRoles.length} eligible</span>
          <span>{activeRoles.length} active</span>
          <span>{eligibleRoles.length + activeRoles.length} total</span>
        </div>
      </div>

      {/* Security Alerts - Right Section */}
      <div className="lg:col-span-1">
        <div className="rounded-lg bg-[#161b22] border border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-gray-400" />
            <h3 className="font-semibold text-white">Security Alerts</h3>
          </div>

          <div className="flex flex-col items-center text-center py-6">
            <div className="p-4 rounded-full bg-[#21262d] mb-4">
              <Lock className="h-8 w-8 text-gray-500" />
            </div>
            <h4 className="font-medium text-white mb-2">PIM Security Alerts</h4>
            <p className="text-sm text-gray-400 mb-4">
              View Microsoft's security recommendations for your privileged roles. Requires additional permission:
            </p>
            <code className="text-xs bg-[#21262d] px-3 py-1 rounded text-gray-300 mb-4">
              RoleManagementAlert.Read.Directory
            </code>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              <Lock className="h-4 w-4" />
              Enable Security Alerts
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 rounded-lg bg-[#161b22] border border-gray-800 p-4">
          <h4 className="text-sm font-medium text-white mb-3">Quick Stats</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Eligible Roles</span>
              <span className="text-sm font-medium text-white">{eligibleRoles.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Active Roles</span>
              <span className="text-sm font-medium text-green-400">{activeRoles.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">PIM Configured</span>
              <span className="text-sm font-medium text-green-400">{eligibleRoles.length + activeRoles.length}</span>
            </div>
          </div>
        </div>
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
