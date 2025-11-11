export default function MainAdminNavbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Management Console</p>
        <h1 className="text-lg font-semibold text-slate-900">Main Admin Panel</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          Support
        </button>
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-indigo-100" />
          <div className="text-sm">
            <p className="font-semibold text-slate-900">Alex Morgan</p>
            <p className="text-xs text-slate-500">Main Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
