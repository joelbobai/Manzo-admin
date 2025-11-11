import { DashboardRole } from "@/components/dashboard/role-based/DashboardSidebar";

const roleCopy: Record<
  DashboardRole,
  { badge: string; name: string; secondary: string }
> = {
  "main-admin": {
    badge: "Full access",
    name: "Aspyn Dornet",
    secondary: "Platform admin",
  },
  "sub-admin": {
    badge: "Scoped access",
    name: "Taylor Reese",
    secondary: "Team admin",
  },
};

export default function DashboardNavbar({ role }: { role: DashboardRole }) {
  const copy = roleCopy[role];

  return (
    <header className="flex items-center gap-6 border-b border-slate-200 bg-white px-6 py-4">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="relative flex-1 max-w-xl">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m17 17-3.5-3.5m1.5-4a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <input
            aria-label="Search"
            placeholder="Search menu, users, tools etc"
            className="h-11 w-full rounded-full border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-600 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            type="search"
          />
        </div>
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <div className="relative h-10 w-10">
            <span className="absolute left-1 top-1 h-8 w-8 rounded-full bg-yellow-300" />
            <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-sm font-semibold text-white">
              {copy.name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </span>
          </div>
          <div className="hidden min-w-[120px] flex-col lg:flex">
            <span className="text-sm font-semibold text-slate-900">{copy.name}</span>
            <span className="text-xs text-slate-500">{copy.secondary}</span>
          </div>
          <span className="hidden rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-indigo-600 md:inline-flex">
            {copy.badge}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-slate-700"
            aria-label="Messages"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 12a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.2-.62L5 21l1.12-4.2A8.5 8.5 0 1 1 21 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 11h7m-7 3h4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-slate-700"
            aria-label="Notifications"
          >
            <span className="absolute right-3 top-3 inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21a1.8 1.8 0 0 0 1.8-1.8H10.2A1.8 1.8 0 0 0 12 21ZM18 16.2V11a6 6 0 0 0-4.5-5.8v-.7a1.5 1.5 0 1 0-3 0v.7A6 6 0 0 0 6 11v5.2L4.5 17.7v.3h15v-.3L18 16.2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
