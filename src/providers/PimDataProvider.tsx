"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useMsal } from "@azure/msal-react";
import {
  createGraphClient,
  PimService,
  RoleEligibilitySchedule,
  RoleAssignmentSchedule,
  RoleActivationRequest,
} from "@/lib/graph-client";

interface PimDataContextType {
  eligibleRoles: RoleEligibilitySchedule[];
  activeRoles: RoleAssignmentSchedule[];
  isLoading: boolean;
  error: string | null;
  refreshRoles: () => Promise<void>;
  activateRole: (
    roleDefinitionId: string,
    directoryScopeId: string,
    justification: string,
    duration: string,
    ticketNumber?: string,
    ticketSystem?: string
  ) => Promise<void>;
  deactivateRole: (
    roleDefinitionId: string,
    directoryScopeId: string
  ) => Promise<void>;
  isActivating: boolean;
  activationError: string | null;
}

const PimDataContext = createContext<PimDataContextType>({
  eligibleRoles: [],
  activeRoles: [],
  isLoading: true,
  error: null,
  refreshRoles: async () => {},
  activateRole: async () => {},
  deactivateRole: async () => {},
  isActivating: false,
  activationError: null,
});

export const usePimData = () => useContext(PimDataContext);

export function PimDataProvider({ children }: { children: React.ReactNode }) {
  const { instance, accounts } = useMsal();
  const [eligibleRoles, setEligibleRoles] = useState<RoleEligibilitySchedule[]>([]);
  const [activeRoles, setActiveRoles] = useState<RoleAssignmentSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);

  const account = accounts[0];

  const refreshRoles = useCallback(async () => {
    if (!account) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const client = createGraphClient(instance, account);
      const pimService = new PimService(client);

      const [eligible, active] = await Promise.all([
        pimService.getEligibleRoles(),
        pimService.getActiveRoles(),
      ]);

      setEligibleRoles(eligible);
      setActiveRoles(active);
    } catch (err) {
      console.error("Error fetching PIM data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch role data");
    } finally {
      setIsLoading(false);
    }
  }, [instance, account]);

  useEffect(() => {
    refreshRoles();
  }, [refreshRoles]);

  const activateRole = useCallback(
    async (
      roleDefinitionId: string,
      directoryScopeId: string,
      justification: string,
      duration: string,
      ticketNumber?: string,
      ticketSystem?: string
    ) => {
      if (!account) return;

      setIsActivating(true);
      setActivationError(null);

      try {
        const client = createGraphClient(instance, account);
        const pimService = new PimService(client);
        const user = await pimService.getCurrentUser();

        const request: RoleActivationRequest = {
          roleDefinitionId,
          principalId: user.id,
          directoryScopeId,
          justification,
          scheduleInfo: {
            startDateTime: new Date().toISOString(),
            expiration: {
              type: "AfterDuration",
              duration,
            },
          },
        };

        if (ticketNumber && ticketSystem) {
          request.ticketInfo = { ticketNumber, ticketSystem };
        }

        await pimService.activateRole(request);
        await refreshRoles();
      } catch (err) {
        console.error("Error activating role:", err);
        setActivationError(
          err instanceof Error ? err.message : "Failed to activate role"
        );
        throw err;
      } finally {
        setIsActivating(false);
      }
    },
    [instance, account, refreshRoles]
  );

  const deactivateRole = useCallback(
    async (roleDefinitionId: string, directoryScopeId: string) => {
      if (!account) return;

      setIsActivating(true);
      setActivationError(null);

      try {
        const client = createGraphClient(instance, account);
        const pimService = new PimService(client);
        const user = await pimService.getCurrentUser();

        await pimService.deactivateRole(roleDefinitionId, user.id, directoryScopeId);
        await refreshRoles();
      } catch (err) {
        console.error("Error deactivating role:", err);
        setActivationError(
          err instanceof Error ? err.message : "Failed to deactivate role"
        );
        throw err;
      } finally {
        setIsActivating(false);
      }
    },
    [instance, account, refreshRoles]
  );

  return (
    <PimDataContext.Provider
      value={{
        eligibleRoles,
        activeRoles,
        isLoading,
        error,
        refreshRoles,
        activateRole,
        deactivateRole,
        isActivating,
        activationError,
      }}
    >
      {children}
    </PimDataContext.Provider>
  );
}
