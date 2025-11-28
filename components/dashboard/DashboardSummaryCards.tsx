"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/stores/auth-store";

const BOOKINGS_ENDPOINT = "/api/v1/flights/bookings";

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getTripBounds(flightBooked) {
  if (!flightBooked?.flightOffers?.length) return null;

  const departures = [];
  const arrivals = [];

  flightBooked.flightOffers.forEach((offer) => {
    offer?.itineraries?.forEach((itinerary) => {
      itinerary?.segments?.forEach((segment) => {
        const departure = parseDate(segment?.departure?.at);
        const arrival = parseDate(segment?.arrival?.at);

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

function calculateDashboardStats(bookings, now = new Date()) {
  const stats = {
    activeFlights: 0,
    reservations: 0,
    ticketsIssued: 0,
    cancelledFlights: 0,
  };

  if (!Array.isArray(bookings)) return stats;

  bookings.forEach((booking) => {
    const status = booking?.status;
    if (status === "reserved") stats.reservations += 1;
    if (status === "booked") stats.ticketsIssued += 1;
    if (status === "cancelled") stats.cancelledFlights += 1;

    if (status !== "issued") return;

    const bounds = getTripBounds(booking?.FlightBooked);
    if (!bounds) return;

    const { tripStart, tripEnd } = bounds;
    if (now >= tripStart && now <= tripEnd) {
      stats.activeFlights += 1;
    }
  });

  return stats;
}

export default function DashboardSummaryCards() {
    const { authFetch } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(false);

  const fetchData = async () => {
    try {
      if (!isMountedRef.current) return;
      setLoading(true);
      setError(null);
     
      const response = await authFetch(BOOKINGS_ENDPOINT, { method: "GET" });
      if (!response.ok) throw new Error("Failed to load bookings");

      const data = await response.json();
      if (!isMountedRef.current) return;
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      if (!isMountedRef.current) return;
      setError("Unable to load booking stats. Please try again.");
      setBookings([]);
    } finally {
      if (!isMountedRef.current) return;
      setLoading(false);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    const load = async () => {
      if (!isMountedRef.current) return;
      await fetchData();
    };

    load();
    const intervalId = setInterval(load, 5 * 60 * 1000);

    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
    };
  }, []);

  const computedStats = useMemo(() => calculateDashboardStats(bookings), [bookings]);

  const displayStats = useMemo(() => {
    if (loading) {
      return {
        activeFlights: "…",
        reservations: "…",
        ticketsIssued: "…",
        cancelledFlights: "…",
      };
    }

    return computedStats;
  }, [computedStats, loading]);

  const insightItems = [
    { label: "Active flights", value: displayStats.activeFlights, change: "Flights currently in progress" },
    { label: "Reservations", value: displayStats.reservations, change: "Reserved but not yet booked" },
    { label: "Tickets issued", value: displayStats.ticketsIssued, change: "All flights that have been issued" },
    { label: "Cancelled flights", value: displayStats.cancelledFlights, change: "Recently cancelled itineraries" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {insightItems.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-100 p-4">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="text-3xl font-semibold text-slate-900">{item.value}</p>
            <p className="text-xs text-slate-500">{item.change}</p>
          </div>
        ))}
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}

export { calculateDashboardStats, getTripBounds };
