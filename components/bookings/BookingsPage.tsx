"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/stores/auth-store";
import { getResponseErrorMessage, parseJSON } from "@/lib/http";
import { type IssueTicketResponse } from "./IssuedTicketPage";

export type BookingStatus = "reserved" | "issued" | "booked" | "cancelled" | "canceled" | string;

export type Booking = {
  id: string;
  bookingId?: string;
  reservationId?: string;
  passengerName: string;
  airline: string;
  status: BookingStatus;
  pnr?: string;
  createdAt?: string;
  updatedAt?: string;
  travelDate?: string;
  FlightBooked?: unknown;
};

type Filters = {
  status: string;
  search: string;
  from: string;
  to: string;
  airline: string;
};

type BookingsResponse =
  | Booking[]
  | {
      bookings?: Booking[];
      data?: Booking[];
      results?: Booking[];
    };

const STATUS_TABS: { label: string; value: Filters["status"] }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Reserved", value: "reserved" },
  { label: "Issued", value: "issued" },
  { label: "Booked", value: "booked" },
  { label: "Canceled", value: "cancelled" },
];

export default function BookingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { authFetch, user } = useAuth();
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [airlines, setAirlines] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [pendingCancellationId, setPendingCancellationId] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [issueOpen, setIssueOpen] = useState(false);

  const filters = useMemo(() => deriveFilters(searchParams), [searchParams]);
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateFilters = useCallback(
    (partial: Partial<Filters>) => {
      setLocalFilters((previous) => {
        const next = { ...previous, ...partial };
        const params = new URLSearchParams();
        if (next.status && next.status !== "all") {
          params.set("status", next.status);
        }
        if (next.search) {
          params.set("q", next.search);
        }
        if (next.from) {
          params.set("from", next.from);
        }
        if (next.to) {
          params.set("to", next.to);
        }
        if (next.airline) {
          params.set("airline", next.airline);
        }
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
        return next;
      });
    },
    [pathname, router],
  );

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/v1/flights/bookings`;
      const response = await authFetch(url);
      if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response));
      }

      const payload = await parseJSON<BookingsResponse>(response);
      const list = Array.isArray(payload)
        ? payload
        : payload?.bookings ?? payload?.data ?? payload?.results ?? [];

      const normalized = Array.isArray(list) ? list : [];
      setAllBookings(normalized);
      setAirlines(
        Array.from(
          new Set(
            normalized
              .map((booking) => booking.airline)
              .filter((value): value is string => Boolean(value)),
          ),
        ).sort(),
      );
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const filteredBookings = useMemo(() => {
    return allBookings.filter((booking) => {
      const normalizedStatus = normalizeStatus(booking.status, booking);
      const matchesStatus =
        localFilters.status === "all" || normalizeStatus(localFilters.status) === normalizedStatus;

      const query = localFilters.search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        [booking.bookingId, booking.reservationId, booking.passengerName, booking.pnr]
          .filter((value): value is string => Boolean(value))
          .some((value) => value.toLowerCase().includes(query));

      const matchesAirline = !localFilters.airline || booking.airline === localFilters.airline;

      const fromDate = localFilters.from ? new Date(localFilters.from) : null;
      const toDate = localFilters.to ? new Date(localFilters.to) : null;
      const travelDate = booking.travelDate ? new Date(booking.travelDate) : null;

      const matchesFrom = !fromDate || (travelDate && !Number.isNaN(travelDate.getTime()) && travelDate >= fromDate);
      const matchesTo = !toDate || (travelDate && !Number.isNaN(travelDate.getTime()) && travelDate <= toDate);

      return matchesStatus && matchesSearch && matchesAirline && matchesFrom && matchesTo;
    });
  }, [allBookings, localFilters.airline, localFilters.from, localFilters.search, localFilters.status, localFilters.to]);

  const handleCancelBooking = async (bookingId: string) => {
    setPendingCancellationId(bookingId);
    setFeedback(null);
    try {
      const response = await authFetch(`/bookings/${bookingId}/cancel`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response));
      }
      setFeedback({ type: "success", message: "Booking canceled successfully." });
      await loadBookings();
    } catch (actionError) {
      setFeedback({
        type: "error",
        message: actionError instanceof Error ? actionError.message : "Unable to cancel this booking.",
      });
    } finally {
      setPendingCancellationId(null);
    }
  };

  const canCancel = user?.role === "main_admin";

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Bookings</p>
            <h1 className="text-2xl font-semibold text-slate-900">Manage reservations and ticket issuance</h1>
            <p className="text-sm text-slate-500">Filter by status, airline, or travel dates to resolve every request faster.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => setCancelOpen(true)}>Cancel by ID</Button>
            <Button variant="outline" onClick={() => setIssueOpen(true)}>
              Issue by ID
            </Button>
          </div>
        </div>
      </header>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => updateFilters({ status: tab.value })}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                localFilters.status === tab.value
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <Input
              placeholder="Search booking, PNR, passenger"
              value={localFilters.search}
              onChange={(event) => updateFilters({ search: event.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase text-slate-500">
              From
              <Input
                type="date"
                value={localFilters.from}
                onChange={(event) => updateFilters({ from: event.target.value })}
              />
            </label>
            <label className="text-xs font-semibold uppercase text-slate-500">
              To
              <Input type="date" value={localFilters.to} onChange={(event) => updateFilters({ to: event.target.value })} />
            </label>
            <label className="text-xs font-semibold uppercase text-slate-500 sm:col-span-2">
              Airline
              <select
                value={localFilters.airline}
                onChange={(event) => updateFilters({ airline: event.target.value })}
                className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
              >
                <option value="">All airlines</option>
                {airlines.map((airline) => (
                  <option key={airline} value={airline}>
                    {airline}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {feedback ? (
          <div
            className={`mt-6 rounded-2xl border p-4 text-sm ${
              feedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-600"
            }`}
          >
            {feedback.message}
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">{error}</div>
        ) : null}

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Booking</th>
                <th className="px-4 py-3">Passenger</th>
                <th className="px-4 py-3">Airline</th>
                <th className="px-4 py-3">Travel date</th>
                <th className="px-4 py-3">Status</th>
                {canCancel ? <th className="px-4 py-3 text-right">Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={canCancel ? 6 : 5} className="px-4 py-6 text-center text-sm text-slate-500">
                    Loading bookings…
                  </td>
                </tr>
      ) : filteredBookings.length === 0 ? (
        <tr>
          <td colSpan={canCancel ? 6 : 5} className="px-4 py-6 text-center text-sm text-slate-500">
            No bookings match your filters.
          </td>
        </tr>
      ) : (
        filteredBookings.map((booking) => {
          const status = normalizeStatus(booking.status, booking);
          const actionsAllowed = status !== "cancelled" && status !== "completed";

          return (
            <tr key={booking.id} className="border-t border-slate-100">
              <td className="px-4 py-4">
                <p className="font-semibold text-slate-900">{booking.bookingId ?? booking.id}</p>
                <p className="text-xs text-slate-500">PNR {booking.pnr ?? "—"}</p>
              </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900">{booking.passengerName}</p>
                      <p className="text-xs text-slate-500">Created {formatDate(booking.createdAt)}</p>
                    </td>
              <td className="px-4 py-4">{booking.airline ?? "—"}</td>
              <td className="px-4 py-4">{formatDate(booking.travelDate)}</td>
              <td className="px-4 py-4">
                <StatusBadge status={status} />
              </td>
              {canCancel ? (
                <td className="px-4 py-4 text-right">
                  {!actionsAllowed ? (
                    <span className="text-xs text-slate-400">No actions</span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pendingCancellationId === booking.id}
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      {pendingCancellationId === booking.id ? "Canceling…" : "Cancel"}
                    </Button>
                  )}
                </td>
              ) : null}
            </tr>
          );
        })
      )}
            </tbody>
          </table>
        </div>
      </section>

      <BookingActionDialog
        action="cancel"
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onCompleted={(message) => setFeedback({ type: "success", message })}
        reload={loadBookings}
      />
      <BookingActionDialog
        action="issue"
        open={issueOpen}
        onClose={() => setIssueOpen(false)}
        onCompleted={(message) => setFeedback({ type: "success", message })}
        reload={loadBookings}
      />
    </div>
  );
}

type BookingActionDialogProps = {
  action: "cancel" | "issue";
  open: boolean;
  onClose: () => void;
  onCompleted: (message: string) => void;
  reload: () => Promise<void>;
};

function BookingActionDialog({ action, open, onClose, onCompleted, reload }: BookingActionDialogProps) {
  const { authFetch } = useAuth();
  const router = useRouter();
  const [reservationId, setReservationId] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setReservationId("");
      setStatus("idle");
      setMessage(null);
    }
  }, [open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");
    setMessage(null);
    setIsSubmitting(true);

    try {
      const endpoint =
        action === "cancel"
          ? `/api/v1/flights/issueCancel`
          : action === "issue"
            ? "/api/v1/flights/issueTicket"
            : "/bookings/reserve";
      const response = await authFetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ reservationId }),
      });

      if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response));
      }

      const payload = action === "issue" ? await parseJSON<IssueTicketResponse>(response) : undefined;
      const successMessage =
        action === "cancel"
          ? "Booking canceled successfully."
          : action === "issue"
            ? "Ticket issued successfully."
            : "Reservation confirmed. The traveler will receive a confirmation shortly.";
      setStatus("success");
      setMessage(successMessage);
      setReservationId("");
      await reload();
      onCompleted(successMessage);

      if (action === "issue" && payload) {
        try {
          sessionStorage.setItem("lastIssuedTicket", JSON.stringify(payload));
        } catch (storageError) {
          console.error("Unable to store issued ticket response", storageError);
        }
        router.push("/dashboard/bookings/issued-ticket");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to process this request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = action === "cancel" ? "Cancel by ID" : "Issue by ID";
  const description =
    action === "cancel"
      ? "Provide a reservation ID or record locator to cancel the flight."
      : "Provide a reservation ID to issue a paid ticket immediately.";

  return (
    <Modal open={open} onClose={onClose} title={title} description={description}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor={`${action}-reservation`} className="text-sm font-medium text-slate-700">
            Reservation ID
          </label>
          <Input
            id={`${action}-reservation`}
            placeholder="e.g. MANZ0-12345"
            required
            value={reservationId}
            onChange={(event) => setReservationId(event.target.value)}
          />
        </div>

        {message ? (
          <p className={`text-sm ${status === "success" ? "text-emerald-600" : "text-rose-600"}`}>{message}</p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing…" : action === "cancel" ? "Cancel" : "Issue"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function parseDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getTripBounds(flightBooked?: Booking["FlightBooked"]) {
  const flightOffers = (flightBooked as { flightOffers?: unknown[] } | undefined)?.flightOffers;
  if (!Array.isArray(flightOffers) || flightOffers.length === 0) return null;

  const departures: Date[] = [];
  const arrivals: Date[] = [];

  flightOffers.forEach((offer) => {
    const itineraries = (offer as { itineraries?: unknown[] } | undefined)?.itineraries;
    itineraries?.forEach((itinerary) => {
      const segments = (itinerary as { segments?: unknown[] } | undefined)?.segments;
      segments?.forEach((segment) => {
        const departure = parseDate((segment as { departure?: { at?: string } } | undefined)?.departure?.at);
        const arrival = parseDate((segment as { arrival?: { at?: string } } | undefined)?.arrival?.at);

        if (departure) departures.push(departure);
        if (arrival) arrivals.push(arrival);
      });
    });
  });

  if (!departures.length || !arrivals.length) return null;

  const tripStart = new Date(Math.min(...departures.map((date) => date.getTime())));
  const tripEnd = new Date(Math.max(...arrivals.map((date) => date.getTime())));

  if (Number.isNaN(tripStart.getTime()) || Number.isNaN(tripEnd.getTime())) return null;

  return { tripStart, tripEnd };
}

function isActiveBooking(booking?: Booking, now = new Date()) {
  if (!booking) return false;
  const bounds = getTripBounds(booking.FlightBooked);
  if (!bounds) return false;
  return now >= bounds.tripStart && now <= bounds.tripEnd;
}

function normalizeStatus(status?: BookingStatus, booking?: Booking) {
  if (isActiveBooking(booking)) return "active" as const;

  const value = typeof status === "string" ? status.toLowerCase() : "";
  if (value === "active") return "active" as const;
  if (value === "reserved") return "reserved" as const;
  if (value === "issued") return "issued" as const;
  if (value === "booked") return "booked" as const;
  if (value === "completed") return "completed" as const;
  if (value === "cancelled" || value === "canceled") return "cancelled" as const;
  return "active" as const;
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const normalized = normalizeStatus(status);
  const config: Record<ReturnType<typeof normalizeStatus>, { label: string; variant: "default" | "success" | "destructive" | "outline" }> = {
    active: { label: "Active", variant: "default" },
    reserved: { label: "Reserved", variant: "outline" },
    issued: { label: "Issued", variant: "success" },
    booked: { label: "Booked", variant: "default" },
    completed: { label: "Completed", variant: "success" },
    cancelled: { label: "Canceled", variant: "destructive" },
  };

  const { label, variant } = config[normalized] ?? config.active;
  return <Badge variant={variant}>{label}</Badge>;
}

function deriveFilters(params: ReadonlyURLSearchParams): Filters {
  return {
    status: params.get("status") ?? "all",
    search: params.get("q") ?? "",
    from: params.get("from") ?? "",
    to: params.get("to") ?? "",
    airline: params.get("airline") ?? "",
  };
}

function formatDate(value?: string) {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
