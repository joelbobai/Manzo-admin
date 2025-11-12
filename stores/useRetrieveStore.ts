"use client";

import { useSyncExternalStore } from "react";

import { normalizeFlightOrder } from "@/lib/flight-order-normalizer";
import type {
  FlightOrderResponse,
  NormalizedFlightOrder,
} from "@/lib/flight-order-normalizer";
import { SAMPLE_FLIGHT_ORDER_RESPONSE } from "@/lib/sample-flight-order";

export type RetrieveState = {
  orderIdOrPnr: string;
  loading: boolean;
  result?: NormalizedFlightOrder;
  error?: string;
  retrieve(idOrPnr: string): Promise<void>;
  clear(): void;
  setOrderIdOrPnr(value: string): void;
};

type Listener = () => void;

type Store<T> = {
  getState: () => T;
  setState: (updater: Partial<T> | ((state: T) => T)) => void;
  subscribe: (listener: Listener) => () => void;
};

function createStore<TState>(initialState: TState): Store<TState> {
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

const initialState: RetrieveState = {
  orderIdOrPnr: "",
  loading: false,
  result: undefined,
  error: undefined,
  retrieve: async () => undefined,
  clear: () => undefined,
  setOrderIdOrPnr: () => undefined,
};

const store = createStore<RetrieveState>(initialState);

store.setState((state) => ({
  ...state,
  retrieve: retrieveFlightOrder,
  clear: clearFlightOrder,
  setOrderIdOrPnr: (value: string) => {
    store.setState((current) => ({ ...current, orderIdOrPnr: value }));
  },
}));

function simulateDelay(min = 400, max = 950) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function retrieveFlightOrder(idOrPnr: string) {
  store.setState((state) => ({
    ...state,
    loading: true,
    error: undefined,
    orderIdOrPnr: idOrPnr,
  }));

  try {
    const response = await new Promise<FlightOrderResponse>((resolve, reject) => {
      setTimeout(() => {
        const shouldFail = Math.random() < 0.15;

        if (shouldFail) {
          reject(
            new Error(
              "We couldn't locate a flight order for that reference. Please verify and try again.",
            ),
          );
          return;
        }

        const payload = cloneFlightOrder(SAMPLE_FLIGHT_ORDER_RESPONSE);
        resolve(payload);
      }, simulateDelay());
    });

    const normalized = normalizeFlightOrder(response);

    store.setState((state) => ({
      ...state,
      loading: false,
      result: normalized,
      error: undefined,
    }));
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "We couldn't locate a flight order for that reference.";

    store.setState((state) => ({
      ...state,
      loading: false,
      error: message,
    }));

    throw error instanceof Error ? error : new Error(message);
  }
}

function clearFlightOrder() {
  store.setState((state) => ({
    ...state,
    orderIdOrPnr: "",
    result: undefined,
    error: undefined,
  }));
}

export function useRetrieveStore<Selected = RetrieveState>(
  selector: (state: RetrieveState) => Selected = (state) => state as Selected,
): Selected {
  const getSnapshot = () => selector(store.getState());

  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

function cloneFlightOrder(source: FlightOrderResponse): FlightOrderResponse {
  if (typeof structuredClone === "function") {
    return structuredClone(source);
  }

  return JSON.parse(JSON.stringify(source)) as FlightOrderResponse;
}

export function getRetrieveState(): RetrieveState {
  return store.getState();
}
