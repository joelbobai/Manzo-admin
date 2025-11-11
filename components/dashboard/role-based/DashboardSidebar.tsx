import Link from "next/link";

export type DashboardRole = "main-admin" | "sub-admin";

type NavigationItem = {
  label: string;
  slug?: string;
  roles: DashboardRole[];
  description?: string;
};

const NAVIGATION: NavigationItem[] = [
  { label: "Overview", roles: ["main-admin", "sub-admin"] },
  {
    label: "User management",
    slug: "users",
    roles: ["main-admin"],
    description: "Invite, suspend or review accounts",
  },
  {
    label: "Tasks",
    slug: "tasks",
    roles: ["sub-admin"],
    description: "Track assignments and daily work",
  },
  {
    label: "Reports",
    slug: "reports",
    roles: ["main-admin", "sub-admin"],
    description: "View insights that match your access",
  },
  {
    label: "Settings",
    slug: "settings",
    roles: ["main-admin"],
  },
  {
    label: "Profile",
    slug: "profile",
    roles: ["sub-admin"],
  },
];

const roleAccent: Record<DashboardRole, string> = {
  "main-admin": "text-indigo-600",
  "sub-admin": "text-blue-600",
};

function getHref(role: DashboardRole, slug?: string) {
  return `/${role}/dashboard${slug ? `/${slug}` : ""}`;
}

export default function DashboardSidebar({ role }: { role: DashboardRole }) {
  return (
    <aside className="flex h-full w-64 flex-col gap-3 border-r border-slate-200 bg-white/90 p-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Navigation
        </p>
        <p className={`mt-1 text-sm font-semibold ${roleAccent[role]}`}>
          {role === "main-admin" ? "Administrator" : "Sub-admin"} access
        </p>
      </div>
      <nav className="flex flex-col gap-1">
        {NAVIGATION.filter((item) => item.roles.includes(role)).map((item) => (
          <Link
            key={item.label}
            href={getHref(role, item.slug)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-slate-900"
          >
            <span className="block">{item.label}</span>
            {item.description ? (
              <span className="text-xs font-normal text-slate-400">
                {item.description}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>
      <div className="mt-auto rounded-lg bg-indigo-50 p-4 text-xs text-indigo-600">
        <p className="font-semibold">Need elevated access?</p>
        <p>
          The main admin can grant more permissions when required.
        </p>
      </div>
    </aside>
  );
}
