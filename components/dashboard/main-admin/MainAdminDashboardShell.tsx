import { ReactNode } from "react";
import MainAdminNavbar from "@/components/dashboard/main-admin/MainAdminNavbar";
import MainAdminSidebar from "@/components/dashboard/main-admin/MainAdminSidebar";

type MainAdminDashboardShellProps = {
  children: ReactNode;
};

export default function MainAdminDashboardShell({ children }: MainAdminDashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <MainAdminSidebar />
      <div className="flex flex-1 flex-col">
        <MainAdminNavbar />
        <main className="flex-1 space-y-6 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
