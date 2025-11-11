import MainAdminDashboardShell from "@/components/dashboard/main-admin/MainAdminDashboardShell";

const metrics = [
  { label: "Active Users", value: "1,248", trend: "+5.3%" },
  { label: "Pending Approvals", value: "18", trend: "-2 this week" },
  { label: "System Alerts", value: "2", trend: "Resolved within SLA" },
];

const recentActivities = [
  {
    title: "New sub-admin request",
    description: "Sarah Lee requested elevated permissions.",
    time: "2 hours ago",
  },
  {
    title: "Audit log exported",
    description: "Weekly security audit log generated.",
    time: "Yesterday",
  },
  {
    title: "Password reset completed",
    description: "Michael Chen reset credentials successfully.",
    time: "2 days ago",
  },
];

export default function MainAdminDashboardPage() {
  return (
    <MainAdminDashboardShell>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{metric.value}</p>
            <p className="mt-1 text-xs text-emerald-600">{metric.trend}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Platform overview</h2>
          <p className="mt-2 text-sm text-slate-500">
            Monitor overall platform activity, approvals, and access requests. These insights help you act quickly.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-700">Infrastructure status</p>
              <p className="mt-2 text-sm text-emerald-600">All systems operational</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-700">Upcoming maintenance</p>
              <p className="mt-2 text-sm text-slate-500">Scheduled for July 28, 11:00 PM UTC</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Recent activity</h2>
            <ul className="mt-4 space-y-4">
              {recentActivities.map((activity) => (
                <li key={activity.title} className="rounded-lg border border-slate-200 p-4">
                  <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                  <p className="text-xs text-slate-500">{activity.description}</p>
                  <p className="mt-2 text-xs text-slate-400">{activity.time}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
            <div className="mt-4 space-y-3">
              <button className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
                Invite new sub-admin
              </button>
              <button className="w-full rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50">
                Review access logs
              </button>
            </div>
          </div>
        </div>
      </section>
    </MainAdminDashboardShell>
  );
}
