"use client";

import React, { useState, useCallback } from "react";
import {
  RoleEligibilitySchedule,
  RoleAssignmentSchedule,
} from "@/lib/graph-client";
import { UnifiedPimContext } from "./UnifiedPimContext";

// Demo data for showcasing the app
const demoEligibleRoles: RoleEligibilitySchedule[] = [
  {
    id: "demo-1",
    roleDefinitionId: "role-def-1",
    principalId: "demo-user",
    directoryScopeId: "/",
    status: "Provisioned",
    scheduleInfo: {
      startDateTime: new Date().toISOString(),
      expiration: {
        type: "NoExpiration",
      },
    },
    roleDefinition: {
      id: "role-def-1",
      displayName: "Global Administrator",
      description: "Can manage all aspects of Azure AD and Microsoft services.",
      isBuiltIn: true,
    },
  },
  {
    id: "demo-2",
    roleDefinitionId: "role-def-2",
    principalId: "demo-user",
    directoryScopeId: "/",
    status: "Provisioned",
    scheduleInfo: {
      startDateTime: new Date().toISOString(),
      expiration: {
        type: "NoExpiration",
      },
    },
    roleDefinition: {
      id: "role-def-2",
      displayName: "Security Administrator",
      description: "Can read security information and reports, and manage configuration.",
      isBuiltIn: true,
    },
  },
  {
    id: "demo-3",
    roleDefinitionId: "role-def-3",
    principalId: "demo-user",
    directoryScopeId: "/",
    status: "Provisioned",
    scheduleInfo: {
      startDateTime: new Date().toISOString(),
      expiration: {
        type: "NoExpiration",
      },
    },
    roleDefinition: {
      id: "role-def-3",
      displayName: "User Administrator",
      description: "Can manage all aspects of users and groups.",
      isBuiltIn: true,
    },
  },
  {
    id: "demo-4",
    roleDefinitionId: "role-def-4",
    principalId: "demo-user",
    directoryScopeId: "/",
    status: "Provisioned",
    scheduleInfo: {
      startDateTime: new Date().toISOString(),
      expiration: {
        type: "NoExpiration",
      },
    },
    roleDefinition: {
      id: "role-def-4",
      displayName: "Application Administrator",
      description: "Can create and manage all aspects of app registrations and enterprise apps.",
      isBuiltIn: true,
    },
  },
  {
    id: "demo-5",
    roleDefinitionId: "role-def-5",
    principalId: "demo-user",
    directoryScopeId: "/",
    status: "Provisioned",
    scheduleInfo: {
      startDateTime: new Date().toISOString(),
      expiration: {
        type: "NoExpiration",
      },
    },
    roleDefinition: {
      id: "role-def-5",
      displayName: "Exchange Administrator",
      description: "Can manage all aspects of Exchange Online.",
      isBuiltIn: true,
    },
  },
];

const initialActiveRoles: RoleAssignmentSchedule[] = [
  {
    id: "active-1",
    roleDefinitionId: "role-def-2",
    principalId: "demo-user",
    directoryScopeId: "/",
    status: "Provisioned",
    assignmentType: "Activated",
    scheduleInfo: {
      startDateTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      expiration: {
        type: "AfterDuration",
        duration: "PT8H",
        endDateTime: new Date(Date.now() + 7 * 3600000).toISOString(), // 7 hours from now
      },
    },
    roleDefinition: {
      id: "role-def-2",
      displayName: "Security Administrator",
      description: "Can read security information and reports, and manage configuration.",
      isBuiltIn: true,
    },
  },
];

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const [eligibleRoles, setEligibleRoles] = useState<RoleEligibilitySchedule[]>(demoEligibleRoles);
  const [activeRoles, setActiveRoles] = useState<RoleAssignmentSchedule[]>(initialActiveRoles);
  const [isLoading, setIsLoading] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);

  const refreshRoles = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
  }, []);

  const activateRole = useCallback(
    async (
      roleDefinitionId: string,
      directoryScopeId: string,
      justification: string,
      duration: string,
    ) => {
      setIsActivating(true);
      setActivationError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find the eligible role and move it to active
      const roleToActivate = eligibleRoles.find(
        (r) => r.roleDefinitionId === roleDefinitionId && r.directoryScopeId === directoryScopeId
      );

      if (roleToActivate) {
        // Parse duration (e.g., "PT8H" -> 8 hours)
        const hours = parseInt(duration.match(/PT(\d+)H/)?.[1] || "8");

        const newActiveRole: RoleAssignmentSchedule = {
          id: `active-${Date.now()}`,
          roleDefinitionId: roleToActivate.roleDefinitionId,
          principalId: roleToActivate.principalId,
          directoryScopeId: roleToActivate.directoryScopeId,
          status: "Provisioned",
          assignmentType: "Activated",
          scheduleInfo: {
            startDateTime: new Date().toISOString(),
            expiration: {
              type: "AfterDuration",
              duration,
              endDateTime: new Date(Date.now() + hours * 3600000).toISOString(),
            },
          },
          roleDefinition: roleToActivate.roleDefinition,
        };

        setActiveRoles((prev) => [...prev, newActiveRole]);
        setEligibleRoles((prev) =>
          prev.filter(
            (r) => !(r.roleDefinitionId === roleDefinitionId && r.directoryScopeId === directoryScopeId)
          )
        );
      }

      setIsActivating(false);
    },
    [eligibleRoles]
  );

  const deactivateRole = useCallback(
    async (roleDefinitionId: string, directoryScopeId: string) => {
      setIsActivating(true);
      setActivationError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find the active role and move it back to eligible
      const roleToDeactivate = activeRoles.find(
        (r) => r.roleDefinitionId === roleDefinitionId && r.directoryScopeId === directoryScopeId
      );

      if (roleToDeactivate) {
        const eligibleRole: RoleEligibilitySchedule = {
          id: roleToDeactivate.id,
          roleDefinitionId: roleToDeactivate.roleDefinitionId,
          principalId: roleToDeactivate.principalId,
          directoryScopeId: roleToDeactivate.directoryScopeId,
          status: "Provisioned",
          scheduleInfo: {
            startDateTime: new Date().toISOString(),
            expiration: {
              type: "NoExpiration",
            },
          },
          roleDefinition: roleToDeactivate.roleDefinition,
        };

        setEligibleRoles((prev) => [...prev, eligibleRole]);
        setActiveRoles((prev) =>
          prev.filter(
            (r) => !(r.roleDefinitionId === roleDefinitionId && r.directoryScopeId === directoryScopeId)
          )
        );
      }

      setIsActivating(false);
    },
    [activeRoles]
  );

  return (
    <UnifiedPimContext.Provider
      value={{
        eligibleRoles,
        activeRoles,
        isLoading,
        error: null,
        refreshRoles,
        activateRole,
        deactivateRole,
        isActivating,
        activationError,
      }}
    >
      {children}
    </UnifiedPimContext.Provider>
  );
}
