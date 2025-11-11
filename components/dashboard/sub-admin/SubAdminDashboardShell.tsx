import { ReactNode } from "react";
import SubAdminHeader from "@/components/dashboard/sub-admin/SubAdminHeader";
import SubAdminSidebar from "@/components/dashboard/sub-admin/SubAdminSidebar";

type SubAdminDashboardShellProps = {
  children: ReactNode;
};

export default function SubAdminDashboardShell({ children }: SubAdminDashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-100/70 p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <SubAdminHeader />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[auto,1fr]">
          <SubAdminSidebar />
          <main className="rounded-3xl bg-white p-6 shadow-lg">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
