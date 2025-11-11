import { ReactNode } from "react";
import DashboardNavbar from "@/components/dashboard/role-based/DashboardNavbar";
import DashboardSidebar, {
  DashboardRole,
} from "@/components/dashboard/role-based/DashboardSidebar";

export type { DashboardRole } from "@/components/dashboard/role-based/DashboardSidebar";

type DashboardShellProps = {
  role: DashboardRole;
  children: ReactNode;
};

export default function DashboardShell({ role, children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <DashboardSidebar role={role} />
      <div className="flex flex-1 flex-col">
        <DashboardNavbar role={role} />
        <main className="flex-1 space-y-6 bg-slate-50 p-6">{children}</main>
      </div>
    </div>
  );
}
