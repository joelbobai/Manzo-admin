"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/stores/auth-store";

export default function TopBar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((value) => value[0]?.toUpperCase())
        .join("")
    : "?";

  const roleLabel = user?.role === "main_admin" ? "Main Admin" : "Sub Admin";

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-4 py-4 shadow-sm lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Dashboard</p>
        <h1 className="text-2xl font-semibold text-slate-900">Bookings control center</h1>
        <p className="text-sm text-slate-500">Monitor reservations, issue tickets, and keep every trip on track.</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{roleLabel}</span>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              {initials}
            </span>
            <span className="hidden text-left text-sm leading-tight sm:block">
              <span className="block font-semibold text-slate-900">{user?.fullName ?? "User"}</span>
              <span className="block text-xs text-slate-500">{user?.email ?? ""}</span>
            </span>
          </button>
          {menuOpen ? (
            <div className="absolute right-0 z-20 mt-3 w-56 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl">
              <div className="mb-4 text-sm">
                <p className="font-semibold text-slate-900">{user?.fullName ?? "Signed in"}</p>
                <p className="text-slate-500">{user?.email ?? ""}</p>
              </div>
              <Button onClick={handleLogout} className="w-full" variant="outline">
                Logout
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
