"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

export type DashboardRole = "main-admin" | "sub-admin";

type IconProps = { className?: string };

type NavigationItem = {
  label: string;
  slug?: string;
  roles: DashboardRole[];
  icon: ComponentType<IconProps>;
  badge?: string;
};

const NAVIGATION: NavigationItem[] = [
  {
    label: "Dashboard",
    roles: ["main-admin", "sub-admin"],
    icon: LayoutIcon,
  },
  {
    label: "Bookings",
    slug: "bookings",
    roles: ["main-admin", "sub-admin"],
    icon: CheckSquareIcon,
  },
  {
    label: "Schedule",
    slug: "schedule",
    roles: ["main-admin", "sub-admin"],
    icon: CalendarIcon,
  },
  {
    label: "Payments",
    slug: "payments",
    roles: ["main-admin", "sub-admin"],
    icon: CardIcon,
  },
  {
    label: "Messages",
    slug: "messages",
    roles: ["main-admin", "sub-admin"],
    icon: ChatIcon,
    badge: "5",
  },
  {
    label: "Flight Tracking",
    slug: "flight-tracking",
    roles: ["main-admin", "sub-admin"],
    icon: PlaneIcon,
  },
  {
    label: "Deals",
    slug: "deals",
    roles: ["main-admin", "sub-admin"],
    icon: TagIcon,
  },
];

function getHref(role: DashboardRole, slug?: string) {
  return `/${role}/dashboard${slug ? `/${slug}` : ""}`;
}

export default function DashboardSidebar({ role }: { role: DashboardRole }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-100 bg-white px-6 py-8 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-500">
          <PlaneBadgeIcon className="h-5 w-5" />
        </div>
        <span className="text-xl font-semibold text-slate-900">Skytix</span>
      </div>

      <nav className="mt-10 flex flex-col gap-2">
        {NAVIGATION.filter((item) => item.roles.includes(role)).map((item) => {
          const href = getHref(role, item.slug);
          const isActive = pathname === href;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-amber-100 text-slate-900 shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  isActive ? "text-amber-500" : "text-slate-400"
                }`}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function LayoutIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="5" rx="2" />
      <rect x="3" y="13" width="5" height="8" rx="2" />
      <rect x="10" y="13" width="11" height="8" rx="2" />
    </svg>
  );
}

function CheckSquareIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="m8 12 3 3 5-6" />
    </svg>
  );
}

function CalendarIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M8 14h2" />
    </svg>
  );
}

function CardIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.5" y="5" width="19" height="14" rx="3" />
      <path d="M2.5 10h19" />
      <path d="M7 15h3" />
    </svg>
  );
}

function ChatIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 19v-2.5A3.5 3.5 0 0 1 8.5 13H18a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H6a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h.5" />
      <path d="m5 19 3.2-1.6a2 2 0 0 1 1.8 0L13 19" />
    </svg>
  );
}

function PlaneIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 13 19-9-9 19-2.5-7.5z" />
      <path d="m10.5 12.5 3 3" />
    </svg>
  );
}

function TagIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7.5V4h3.5L20 16.5l-3.5 3.5L4 7.5z" />
      <circle cx="7.5" cy="7.5" r="1.2" />
    </svg>
  );
}

function PlaneBadgeIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3.5 12 17-7-7 17-2.5-6z" />
    </svg>
  );
}
