import { DashboardRole } from "@/components/dashboard/role-based/DashboardSidebar";

const roleCopy: Record<DashboardRole, { title: string; badge: string }> = {
  "main-admin": {
    title: "Platform control center",
    badge: "Full access",
  },
  "sub-admin": {
    title: "Team operations",
    badge: "Scoped access",
  },
};

export default function DashboardNavbar({ role }: { role: DashboardRole }) {
  const copy = roleCopy[role];

  return (
    <header className="flex flex-col gap-2 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">{copy.title}</h1>
          <p className="text-sm text-slate-500">
            You are viewing the shared dashboard with {copy.badge.toLowerCase()}.
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
          {copy.badge}
        </span>
      </div>
    </header>
  );
}
