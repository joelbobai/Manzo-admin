export default function SubAdminHeader() {
  return (
    <header className="rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-8 py-10 text-white shadow-lg">
      <p className="text-sm uppercase tracking-wide text-white/80">Welcome back</p>
      <h1 className="mt-2 text-3xl font-semibold">Sub-Admin Panel</h1>
      <p className="mt-3 text-sm text-white/80">
        Manage your tasks, monitor progress, and collaborate with the main admin team.
      </p>
    </header>
  );
}
