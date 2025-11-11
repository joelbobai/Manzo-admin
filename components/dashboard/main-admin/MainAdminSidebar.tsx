import Link from "next/link";

const items = [
  { label: "Dashboard", href: "/main-admin/dashboard" },
  { label: "Users", href: "/main-admin/dashboard/users" },
  { label: "Settings", href: "/main-admin/dashboard/settings" },
];

export default function MainAdminSidebar() {
  return (
    <aside className="flex w-64 flex-col gap-2 border-r border-slate-200 bg-slate-50 p-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Navigation</p>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto rounded-lg bg-indigo-50 p-4 text-sm text-indigo-700">
        <p className="font-semibold">System health</p>
        <p className="text-xs text-indigo-600">All services operational</p>
      </div>
    </aside>
  );
}
