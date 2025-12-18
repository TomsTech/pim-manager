"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  PublicClientApplication,
  AccountInfo,
  EventType,
  AuthenticationResult,
} from "@azure/msal-browser";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { msalConfig, loginRequest } from "@/lib/msal-config";

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AccountInfo | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async () => {},
  logout: async () => {},
  error: null,
});

export const useAuth = () => useContext(AuthContext);

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const { instance, accounts } = useMsal();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = accounts.length > 0;
  const user = accounts[0] || null;

  useEffect(() => {
    // Handle redirect promise on page load
    instance
      .handleRedirectPromise()
      .then((response: AuthenticationResult | null) => {
        if (response) {
          instance.setActiveAccount(response.account);
        }
      })
      .catch((err) => {
        console.error("Redirect error:", err);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Set active account if one exists
    const accounts = instance.getAllAccounts();
    if (accounts.length > 0 && !instance.getActiveAccount()) {
      instance.setActiveAccount(accounts[0]);
    }
  }, [instance]);

  const login = useCallback(async () => {
    setError(null);
    try {
      const response = await instance.loginPopup(loginRequest);
      instance.setActiveAccount(response.account);
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }, [instance]);

  const logout = useCallback(async () => {
    try {
      await instance.logoutPopup({
        postLogoutRedirectUri: window.location.origin,
      });
    } catch (err) {
      console.error("Logout error:", err);
      setError(err instanceof Error ? err.message : "Logout failed");
    }
  }, [instance]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize MSAL
    msalInstance.initialize().then(() => {
      // Register event callbacks
      msalInstance.addEventCallback((event) => {
        if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
          const payload = event.payload as AuthenticationResult;
          msalInstance.setActiveAccount(payload.account);
        }
      });
      setIsInitialized(true);
    });
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <MsalProvider instance={msalInstance}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </MsalProvider>
  );
}
