"use client";

import { useSyncExternalStore } from "react";

export type Role = "MAIN_ADMIN" | "SUB_ADMIN";

export type SubAdmin = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isActive: boolean;
  canReserveTickets: boolean;
  canIssueTickets: boolean;
  role: "SUB_ADMIN";
  createdAt: string;
};

export type CurrentUser = {
  id: string;
  name: string;
  role: Role;
};

type UsersStore = {
  currentUser: CurrentUser;
  subAdmins: SubAdmin[];
  isLoading: boolean;
  loadSubAdmins: () => Promise<SubAdmin[]>;
  toggleActive: (id: string) => Promise<void>;
  togglePermission: (
    id: string,
    key: "canReserveTickets" | "canIssueTickets",
  ) => Promise<void>;
  createSubAdmin: (input: { name: string; email: string }) => Promise<SubAdmin>;
};

type Listener = () => void;

function createStore<TState>(initialState: TState) {
  let state = initialState;
  const listeners = new Set<Listener>();

  const getState = () => state;

  const setState = (updater: Partial<TState> | ((state: TState) => TState)) => {
    const nextState =
      typeof updater === "function"
        ? (updater as (state: TState) => TState)(state)
        : ({ ...state, ...updater } as TState);

    if (Object.is(state, nextState)) {
      return;
    }

    state = nextState;
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return { getState, setState, subscribe };
}

const SAMPLE_SUB_ADMINS: SubAdmin[] = [
  {
    id: "u_001",
    name: "Ada Okoro",
    email: "ada.okoro@example.com",
    isActive: true,
    canReserveTickets: true,
    canIssueTickets: false,
    role: "SUB_ADMIN",
    createdAt: "2025-10-12T09:21:00Z",
  },
  {
    id: "u_002",
    name: "Miguel Rivera",
    email: "miguel.rivera@example.com",
    isActive: true,
    canReserveTickets: true,
    canIssueTickets: true,
    role: "SUB_ADMIN",
    createdAt: "2025-07-01T16:45:00Z",
  },
  {
    id: "u_003",
    name: "Fatima Khan",
    email: "fatima.khan@example.com",
    isActive: false,
    canReserveTickets: false,
    canIssueTickets: false,
    role: "SUB_ADMIN",
    createdAt: "2025-02-19T11:12:00Z",
  },
  {
    id: "u_004",
    name: "Liam Chen",
    email: "liam.chen@example.com",
    isActive: true,
    canReserveTickets: true,
    canIssueTickets: true,
    role: "SUB_ADMIN",
    createdAt: "2024-12-09T07:30:00Z",
  },
  {
    id: "u_005",
    name: "Sophia Martins",
    email: "sophia.martins@example.com",
    isActive: false,
    canReserveTickets: true,
    canIssueTickets: false,
    role: "SUB_ADMIN",
    createdAt: "2025-03-22T18:05:00Z",
  },
  {
    id: "u_006",
    name: "Noah Andersen",
    email: "noah.andersen@example.com",
    isActive: true,
    canReserveTickets: false,
    canIssueTickets: true,
    role: "SUB_ADMIN",
    createdAt: "2025-08-03T13:18:00Z",
  },
  {
    id: "u_007",
    name: "Harper Singh",
    email: "harper.singh@example.com",
    isActive: true,
    canReserveTickets: false,
    canIssueTickets: false,
    role: "SUB_ADMIN",
    createdAt: "2025-05-28T10:40:00Z",
  },
  {
    id: "u_008",
    name: "Jonah Ibrahim",
    email: "jonah.ibrahim@example.com",
    isActive: true,
    canReserveTickets: true,
    canIssueTickets: false,
    role: "SUB_ADMIN",
    createdAt: "2024-11-15T21:15:00Z",
  },
];

const store = createStore<UsersStore>({
  currentUser: {
    id: "current_user",
    name: "Alex Rivers",
    role: "MAIN_ADMIN",
  },
  subAdmins: [],
  isLoading: false,
  // Placeholders replaced below.
  loadSubAdmins: async () => SAMPLE_SUB_ADMINS,
  toggleActive: async () => undefined,
  togglePermission: async () => undefined,
  createSubAdmin: async () => SAMPLE_SUB_ADMINS[0],
});

function simulateDelay(min = 450, max = 950) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function loadSubAdmins() {
  store.setState((state) => ({ ...state, isLoading: true }));

  return new Promise<SubAdmin[]>((resolve, reject) => {
    setTimeout(() => {
      const shouldFail = Math.random() < 0.1;

      if (shouldFail) {
        store.setState((state) => ({ ...state, isLoading: false }));
        reject(new Error("Unable to load sub-admins"));
        return;
      }

      store.setState((state) => ({ ...state, subAdmins: SAMPLE_SUB_ADMINS, isLoading: false }));
      resolve(SAMPLE_SUB_ADMINS);
    }, simulateDelay(300, 700));
  });
}

async function toggleActive(id: string) {
  const previous = store.getState().subAdmins.map((subAdmin) => ({ ...subAdmin }));

  const updated = previous.map((subAdmin) =>
    subAdmin.id === id
      ? {
          ...subAdmin,
          isActive: !subAdmin.isActive,
        }
      : subAdmin,
  );

  store.setState((state) => ({ ...state, subAdmins: updated }));

  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      const shouldFail = Math.random() < 0.15;

      if (shouldFail) {
        store.setState((state) => ({ ...state, subAdmins: previous }));
        reject(new Error("Unable to update status"));
        return;
      }

      resolve();
    }, simulateDelay());
  });
}

async function togglePermission(
  id: string,
  key: "canReserveTickets" | "canIssueTickets",
) {
  const previous = store.getState().subAdmins.map((subAdmin) => ({ ...subAdmin }));

  const updated = previous.map((subAdmin) =>
    subAdmin.id === id
      ? {
          ...subAdmin,
          [key]: !subAdmin[key],
        }
      : subAdmin,
  );

  store.setState((state) => ({ ...state, subAdmins: updated }));

  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      const shouldFail = Math.random() < 0.15;

      if (shouldFail) {
        store.setState((state) => ({ ...state, subAdmins: previous }));
        reject(new Error("Unable to update permissions"));
        return;
      }

      resolve();
    }, simulateDelay());
  });
}

async function createSubAdmin(input: { name: string; email: string }) {
  const newSubAdmin: SubAdmin = {
    id: `u_${Math.random().toString(36).slice(2, 8)}`,
    name: input.name,
    email: input.email,
    isActive: true,
    canReserveTickets: false,
    canIssueTickets: false,
    role: "SUB_ADMIN",
    createdAt: new Date().toISOString(),
  };

  const previous = store.getState().subAdmins;
  store.setState((state) => ({ ...state, subAdmins: [newSubAdmin, ...state.subAdmins] }));

  return new Promise<SubAdmin>((resolve, reject) => {
    setTimeout(() => {
      const shouldFail = Math.random() < 0.15;

      if (shouldFail) {
        store.setState((state) => ({ ...state, subAdmins: previous }));
        reject(new Error("Unable to create sub-admin"));
        return;
      }

      resolve(newSubAdmin);
    }, simulateDelay());
  });
}

store.setState((state) => ({
  ...state,
  loadSubAdmins,
  toggleActive,
  togglePermission,
  createSubAdmin,
}));

export function useUsersStore<TSelected>(
  selector: (state: UsersStore) => TSelected,
): TSelected {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState()),
  );
}

export function getUsersState() {
  return store.getState();
}
