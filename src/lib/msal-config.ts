import { Configuration, LogLevel, PopupRequest } from "@azure/msal-browser";

// MSAL configuration for Entra ID authentication
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || "",
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID || "common"}`,
    redirectUri: typeof window !== "undefined" ? window.location.origin : "",
    postLogoutRedirectUri: typeof window !== "undefined" ? window.location.origin : "",
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
        }
      },
      logLevel: LogLevel.Warning,
    },
  },
};

// Scopes for Microsoft Graph API - PIM specific
export const graphScopes = {
  user: ["User.Read"],
  pim: [
    "RoleManagement.Read.Directory",
    "RoleManagement.ReadWrite.Directory",
    "RoleEligibilitySchedule.Read.Directory",
    "RoleEligibilitySchedule.ReadWrite.Directory",
    "RoleAssignmentSchedule.Read.Directory",
    "RoleAssignmentSchedule.ReadWrite.Directory",
  ],
  group: [
    "PrivilegedAccess.Read.AzureADGroup",
    "PrivilegedAccess.ReadWrite.AzureADGroup",
  ],
};

// Combined scopes for login
export const loginRequest: PopupRequest = {
  scopes: [...graphScopes.user, ...graphScopes.pim],
};

// Scopes for acquiring tokens
export const tokenRequest = {
  scopes: [...graphScopes.user, ...graphScopes.pim, ...graphScopes.group],
};
