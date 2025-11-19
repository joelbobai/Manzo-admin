"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { BASE_URL } from "@/lib/constants";
import { getResponseErrorMessage, parseJSON } from "@/lib/http";

export type UserRole = "main_admin" | "sub_admin";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

type PersistTarget = "local" | "session";

type LoginInput = { email: string; password: string; remember?: boolean };

const LOCAL_STORAGE_KEY = "manzo-admin-auth";
const SESSION_STORAGE_KEY = "manzo-admin-auth-session";

type AuthStoreState = {
  session?: AuthSession;
  persist: PersistTarget;
  hydrated: boolean;
  hydrate: () => void;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  authFetch: (path: string, init?: RequestInit) => Promise<Response>;
};

type StoredSession = { session: AuthSession; persist: PersistTarget };

function readStoredSession(): StoredSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const localValue = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  if (localValue) {
    try {
      const session = JSON.parse(localValue) as AuthSession;
      if (session?.accessToken && session?.refreshToken) {
        return { session, persist: "local" };
      }
    } catch {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }

  const sessionValue = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (sessionValue) {
    try {
      const session = JSON.parse(sessionValue) as AuthSession;
      if (session?.accessToken && session?.refreshToken) {
        return { session, persist: "session" };
      }
    } catch {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  return null;
}

function persistSession(session: AuthSession, target: PersistTarget) {
  if (typeof window === "undefined") {
    return;
  }

  const payload = JSON.stringify(session);

  if (target === "local") {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, payload);
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  window.sessionStorage.setItem(SESSION_STORAGE_KEY, payload);
  window.localStorage.removeItem(LOCAL_STORAGE_KEY);
}

function clearPersistedSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(LOCAL_STORAGE_KEY);
  window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

const useAuthStoreInternal = create<AuthStoreState>((set, get) => {
  const applySession = (nextSession: AuthSession, target: PersistTarget) => {
    set({ session: nextSession, persist: target });
    persistSession(nextSession, target);
  };

  const clearSession = () => {
    set({ session: undefined });
    clearPersistedSession();
  };

  const refreshTokens = async () => {
    const { session, persist } = get();
    if (!session?.refreshToken) {
      return false;
    }

    const response = await fetch(`${BASE_URL}/api/v1/user/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });

    if (!response.ok) {
      clearSession();
      return false;
    }

    type RefreshResponse = {
      accessToken: string;
      refreshToken?: string;
      user?: AuthUser;
    };

    try {
      const payload = await parseJSON<RefreshResponse>(response);
      if (!payload.accessToken) {
        clearSession();
        return false;
      }

      const nextSession: AuthSession = {
        user: payload.user ?? session.user,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken ?? session.refreshToken,
      };

      applySession(nextSession, persist);
      return nextSession.accessToken;
    } catch {
      clearSession();
      return false;
    }
  };

  return {
    session: undefined,
    persist: "local",
    hydrated: false,
    hydrate: () => {
      if (get().hydrated) {
        return;
      }

      const stored = readStoredSession();
      if (stored) {
        set({ session: stored.session, persist: stored.persist, hydrated: true });
        return;
      }

      set({ hydrated: true });
    },
    login: async ({ email, password, remember = true }: LoginInput) => {
      const response = await fetch(`${BASE_URL}/api/v1/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response));
      }

      type LoginResponse = {
        accessToken: string;
        refreshToken: string;
        user: AuthUser;
      };

      const payload = await parseJSON<LoginResponse>(response);
      if (!payload.accessToken || !payload.refreshToken || !payload.user) {
        throw new Error("Unexpected response from the server.");
      }

      applySession(
        {
          user: payload.user,
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
        },
        remember ? "local" : "session",
      );
    },
    logout: async () => {
      const session = get().session;
      if (session?.refreshToken) {
        try {
          await fetch(`${BASE_URL}/api/v1/user/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken: session.refreshToken }),
          });
        } catch {
          // Ignore network failures during logout.
        }
      }

      clearSession();
    },
    authFetch: async (path: string, init: RequestInit = {}) => {
      const session = get().session;
      if (!session?.accessToken) {
        throw new Error("You need to be signed in to continue.");
      }

      const performRequest = async (accessToken: string) => {
        const headers = new Headers(init.headers);
        if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
          headers.set("Content-Type", "application/json");
        }
        headers.set("Authorization", `Bearer ${accessToken}`);
        headers.set("Accept", "application/json");

        return fetch(`${BASE_URL}${path}`, {
          ...init,
          headers,
        });
      };

      let response = await performRequest(session.accessToken);
      if (response.status !== 401) {
        return response;
      }

      const refreshed = await refreshTokens();
      if (!refreshed) {
        await get().logout();
        throw new Error("Your session expired. Please sign in again.");
      }

      response = await performRequest(refreshed);
      if (response.status === 401) {
        await get().logout();
        throw new Error("Your session expired. Please sign in again.");
      }

      return response;
    },
  };
});

export function useAuth() {
  const { hydrate, session, hydrated, login, logout, authFetch } = useAuthStoreInternal(
    useShallow((state) => ({
      hydrate: state.hydrate,
      session: state.session,
      hydrated: state.hydrated,
      login: state.login,
      logout: state.logout,
      authFetch: state.authFetch,
    })),
  );

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return {
    user: session?.user,
    accessToken: session?.accessToken,
    refreshToken: session?.refreshToken,
    hydrated,
    isAuthenticated: Boolean(session?.accessToken),
    login,
    logout,
    authFetch,
  };
}

export type { AuthStoreState };
