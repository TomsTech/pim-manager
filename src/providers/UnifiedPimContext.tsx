"use client";

import { createContext, useContext } from "react";
import {
  RoleEligibilitySchedule,
  RoleAssignmentSchedule,
} from "@/lib/graph-client";

export interface UnifiedPimContextType {
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

export const UnifiedPimContext = createContext<UnifiedPimContextType>({
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

export const useUnifiedPimData = () => useContext(UnifiedPimContext);
