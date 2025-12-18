import { Client } from "@microsoft/microsoft-graph-client";
import { AccountInfo, IPublicClientApplication } from "@azure/msal-browser";
import { tokenRequest } from "./msal-config";

// Types for PIM data
export interface RoleDefinition {
  id: string;
  displayName: string;
  description?: string;
  isBuiltIn: boolean;
}

export interface RoleEligibilitySchedule {
  id: string;
  principalId: string;
  roleDefinitionId: string;
  directoryScopeId: string;
  status: string;
  scheduleInfo?: {
    startDateTime?: string;
    expiration?: {
      type: string;
      endDateTime?: string;
      duration?: string;
    };
  };
  roleDefinition?: RoleDefinition;
}

export interface RoleAssignmentSchedule {
  id: string;
  principalId: string;
  roleDefinitionId: string;
  directoryScopeId: string;
  status: string;
  assignmentType: "Activated" | "Assigned";
  scheduleInfo?: {
    startDateTime?: string;
    expiration?: {
      type: string;
      endDateTime?: string;
      duration?: string;
    };
  };
  roleDefinition?: RoleDefinition;
}

export interface RoleActivationRequest {
  roleDefinitionId: string;
  principalId: string;
  directoryScopeId: string;
  justification: string;
  scheduleInfo: {
    startDateTime: string;
    expiration: {
      type: "AfterDuration";
      duration: string; // ISO 8601 duration, e.g., "PT8H"
    };
  };
  ticketInfo?: {
    ticketNumber?: string;
    ticketSystem?: string;
  };
}

// Create Graph client with auth provider
export function createGraphClient(
  msalInstance: IPublicClientApplication,
  account: AccountInfo
): Client {
  return Client.initWithMiddleware({
    authProvider: {
      getAccessToken: async () => {
        try {
          const response = await msalInstance.acquireTokenSilent({
            ...tokenRequest,
            account,
          });
          return response.accessToken;
        } catch (error) {
          // If silent fails, try interactive
          const response = await msalInstance.acquireTokenPopup(tokenRequest);
          return response.accessToken;
        }
      },
    },
  });
}

// PIM Graph API calls
export class PimService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  // Get all eligible role assignments for the current user
  async getEligibleRoles(): Promise<RoleEligibilitySchedule[]> {
    const response = await this.client
      .api("/roleManagement/directory/roleEligibilitySchedules")
      .filter("status eq 'Provisioned'")
      .expand("roleDefinition")
      .get();
    return response.value || [];
  }

  // Get all active role assignments for the current user
  async getActiveRoles(): Promise<RoleAssignmentSchedule[]> {
    const response = await this.client
      .api("/roleManagement/directory/roleAssignmentSchedules")
      .filter("status eq 'Provisioned'")
      .expand("roleDefinition")
      .get();
    return response.value || [];
  }

  // Get role definitions
  async getRoleDefinitions(): Promise<RoleDefinition[]> {
    const response = await this.client
      .api("/roleManagement/directory/roleDefinitions")
      .get();
    return response.value || [];
  }

  // Activate a role
  async activateRole(request: RoleActivationRequest): Promise<void> {
    await this.client
      .api("/roleManagement/directory/roleAssignmentScheduleRequests")
      .post({
        action: "selfActivate",
        ...request,
      });
  }

  // Deactivate a role
  async deactivateRole(
    roleDefinitionId: string,
    principalId: string,
    directoryScopeId: string
  ): Promise<void> {
    await this.client
      .api("/roleManagement/directory/roleAssignmentScheduleRequests")
      .post({
        action: "selfDeactivate",
        roleDefinitionId,
        principalId,
        directoryScopeId,
      });
  }

  // Get current user info
  async getCurrentUser(): Promise<{ id: string; displayName: string; mail: string }> {
    return await this.client.api("/me").select("id,displayName,mail").get();
  }
}
