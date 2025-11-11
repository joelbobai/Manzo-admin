import DashboardShell, {
  DashboardRole,
} from "@/components/dashboard/role-based/DashboardShell";

const dashboardCopy: Record<DashboardRole, { title: string; subtitle: string }> = {
  "main-admin": {
    title: "Executive overview",
    subtitle:
      "Monitor platform-wide health, approvals and the requests that need your attention.",
  },
  "sub-admin": {
    title: "Daily operations",
    subtitle:
      "Review your assignments and share updates with the main admin when you are done.",
  },
};

const metrics: Record<DashboardRole, { label: string; value: string; helper: string }[]> = {
  "main-admin": [
    { label: "Active users", value: "1,248", helper: "+5.3% vs last week" },
    { label: "Pending approvals", value: "18", helper: "2 fewer than yesterday" },
    { label: "System alerts", value: "2", helper: "All resolved within SLA" },
  ],
  "sub-admin": [
    { label: "Tasks completed", value: "68%", helper: "Finish 2 more for 80%" },
    { label: "Open requests", value: "12", helper: "4 waiting for review" },
    { label: "Feedback score", value: "4.8", helper: "Great work this week" },
  ],
};

const focusAreas = [
  {
    title: "Today's tasks",
    details: "Approve four pending listings and review two flagged submissions.",
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

const quickActions: Record<DashboardRole, { label: string; variant: "primary" | "outline" }[]> = {
  "main-admin": [
    { label: "Invite new sub-admin", variant: "primary" },
    { label: "Review access logs", variant: "outline" },
  ],
  "sub-admin": [
    { label: "Submit daily report", variant: "primary" },
    { label: "Sync with teammates", variant: "outline" },
  ],
};

export default function RoleBasedDashboardPage({ role }: { role: DashboardRole }) {
  const hero = dashboardCopy[role];

  return (
    <DashboardShell role={role}>
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">{hero.title}</h2>
        <p className="max-w-3xl text-sm text-slate-500">{hero.subtitle}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics[role].map((metric) => (
          <div key={metric.label} className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {metric.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {metric.value}
            </p>
            <p className="mt-1 text-xs text-emerald-600">{metric.helper}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              {role === "main-admin" ? "Platform overview" : "Focus for today"}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {role === "main-admin"
                ? "Monitor overall platform activity, approvals and access requests. These insights help you act quickly."
                : "Keep your assignments on track and notify the main admin once completed."}
            </p>
            {role === "main-admin" ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-sm font-medium text-slate-700">
                    Infrastructure status
                  </p>
                  <p className="mt-2 text-sm text-emerald-600">
                    All systems operational
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-sm font-medium text-slate-700">
                    Upcoming maintenance
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Scheduled for July 28, 11:00 PM UTC
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {focusAreas.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800">
                        {item.title}
                      </p>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-600">
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-600">{item.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {role === "sub-admin" ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Progress overview
              </h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {metrics["sub-admin"].map((metric) => (
                  <div
                    key={`${metric.label}-progress`}
                    className="rounded-2xl bg-blue-500/10 p-4 text-center"
                  >
                    <p className="text-xl font-semibold text-blue-600">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              {role === "main-admin" ? "Recent activity" : "Notifications"}
            </h3>
            <ul className="mt-4 space-y-4">
              {(role === "main-admin" ? recentActivities : notifications).map(
                (item) => (
                  <li
                    key={item.title}
                    className="rounded-lg border border-slate-200 p-4"
                  >
                    <p className="text-sm font-medium text-slate-800">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {"message" in item ? item.message : item.description}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">{item.time}</p>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Quick actions</h3>
            <div className="mt-4 space-y-3">
              {quickActions[role].map((action) => (
                <button
                  key={action.label}
                  className={
                    action.variant === "primary"
                      ? "w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                      : "w-full rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                  }
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
