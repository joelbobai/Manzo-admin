"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/stores/auth-store";

const NAVIGATION = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Bookings", href: "/dashboard/bookings" },
  { label: "Users", href: "/dashboard/users" },
  { label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const roleLabel = user?.role === "main_admin" ? "Main Admin" : "Sub Admin";

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-slate-100 bg-white px-6 py-8 shadow-sm lg:flex">
      <div className="space-y-1">
        {/* <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Manzo</p> */}
        <Image
          src="https://www.manzo.ng/_next/image?url=%2FManzoNavLogo.png&w=256&q=75"
          alt="Manzo Logo"
          width={128}
          height={32}
          className="h-auto w-32"
          priority
        />
        <p className="text-xl font-semibold text-slate-900">Admin Console</p>
        <p className="text-sm text-slate-500">{roleLabel}</p>
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-2">
        {NAVIGATION.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
