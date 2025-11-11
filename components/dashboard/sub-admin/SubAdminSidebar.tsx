import Link from "next/link";

const links = [
  { label: "Overview", href: "/sub-admin/dashboard" },
  { label: "Tasks", href: "/sub-admin/dashboard/tasks" },
  { label: "Profile", href: "/sub-admin/dashboard/profile" },
];

export default function SubAdminSidebar() {
  return (
    <aside className="flex h-full w-56 flex-col gap-3 rounded-3xl border border-blue-100 bg-white/70 p-6 backdrop-blur">
      <p className="text-xs uppercase tracking-wide text-blue-500">Quick links</p>
      <nav className="flex flex-col gap-2">
        {links.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl bg-blue-50 p-4 text-xs text-blue-600">
        <p className="font-semibold">Need help?</p>
        <p>Contact the main admin team anytime.</p>
      </div>
    </aside>
  );
}
