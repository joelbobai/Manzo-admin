import SubAdminDashboardShell from "@/components/dashboard/sub-admin/SubAdminDashboardShell";

const focusAreas = [
  {
    title: "Today's tasks",
    details: "Approve 4 pending listings and review 2 flagged submissions.",
    status: "In progress",
  },
  {
    title: "Team collaboration",
    details: "Share weekly update with the main admin team by 5 PM.",
    status: "Planned",
  },
];

const notifications = [
  {
    title: "Reminder",
    message: "Upload compliance documents for August reporting.",
    time: "Due in 2 days",
  },
  {
    title: "Task assigned",
    message: "Review partner onboarding checklist from Alex.",
    time: "Assigned 1 hour ago",
  },
];

export default function SubAdminDashboardPage() {
  return (
    <SubAdminDashboardShell>
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Focus for today</h2>
            <p className="mt-2 text-sm text-slate-500">
              Keep your assignments on track and notify the main admin once completed.
            </p>
            <div className="mt-4 space-y-4">
              {focusAreas.map((item) => (
                <div key={item.title} className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-600">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600">{item.details}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Progress overview</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-blue-500/10 p-4 text-center">
                <p className="text-2xl font-semibold text-blue-600">68%</p>
                <p className="mt-1 text-xs text-slate-500">Tasks completed</p>
              </div>
              <div className="rounded-2xl bg-purple-500/10 p-4 text-center">
                <p className="text-2xl font-semibold text-purple-600">12</p>
                <p className="mt-1 text-xs text-slate-500">Open requests</p>
              </div>
              <div className="rounded-2xl bg-emerald-500/10 p-4 text-center">
                <p className="text-2xl font-semibold text-emerald-600">4.8</p>
                <p className="mt-1 text-xs text-slate-500">Feedback score</p>
              </div>
            </div>
          </div>
        </section>
        <aside className="space-y-6">
          <div className="rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
            <ul className="mt-4 space-y-4">
              {notifications.map((notification) => (
                <li key={notification.title} className="rounded-2xl border border-blue-100 p-4">
                  <p className="text-sm font-medium text-slate-800">{notification.title}</p>
                  <p className="text-xs text-slate-500">{notification.message}</p>
                  <p className="mt-2 text-xs text-slate-400">{notification.time}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Quick updates</h2>
            <div className="mt-4 space-y-3">
              <button className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
                Submit daily report
              </button>
              <button className="w-full rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50">
                Sync with teammates
              </button>
            </div>
          </div>
        </aside>
      </div>
    </SubAdminDashboardShell>
  );
}
