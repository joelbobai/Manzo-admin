"use client";

import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/stores/auth-store";

export default function DashboardHomePage() {
  const { user } = useAuth();
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const insights = [
    { label: "Active bookings", value: "128", change: "+12 this week" },
    { label: "Tickets issued", value: "54", change: "8 waiting approval" },
    { label: "Pending reservations", value: "32", change: "5 expiring soon" },
  ];

  const shortcuts = [
    { title: "Cancel by ID", description: "Cancel a booking instantly when a traveler calls in.", href: "/dashboard/bookings" },
    { title: "Issue by ID", description: "Issue a paid ticket instantly.", href: "/dashboard/bookings" },
    { title: "View filters", description: "Search by airline, travel date, or passenger.", href: "/dashboard/bookings" },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">{greeting}, {user?.fullName ?? "team"}</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Here’s what’s happening across bookings today</h2>
        <p className="mt-2 text-sm text-slate-500">
          Track tickets, reservations, and escalations from a single view. All stats refresh every five minutes.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {insights.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-100 p-4">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="text-3xl font-semibold text-slate-900">{item.value}</p>
              <p className="text-xs text-slate-500">{item.change}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Quick actions</h3>
            <Badge variant="outline">Bookings</Badge>
          </div>
          <div className="mt-4 space-y-4">
            {shortcuts.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="block rounded-2xl border border-slate-100 p-4 transition hover:border-slate-200 hover:bg-slate-50"
              >
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-500">{item.description}</p>
              </a>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6 text-white">
          <p className="text-sm uppercase tracking-wide text-slate-200">Status</p>
          <h3 className="mt-2 text-2xl font-semibold">All systems operational</h3>
          <p className="mt-3 text-sm text-slate-100">
            Booking webhooks, ticket issuance, and payment confirmations are healthy. We’ll notify you here if anything changes.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-center justify-between">
              <span>Reservation API</span>
              <span className="text-emerald-300">99.98% uptime</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Issuance API</span>
              <span className="text-emerald-300">Operational</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Notifications</span>
              <span className="text-emerald-300">Operational</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
