"use client";

/**
 * To preview access control, update the `currentUser` role in `stores/useUsersStore.ts`.
 */

import { useEffect, useMemo, useState } from "react";

import DashboardShell from "@/components/dashboard/role-based/DashboardShell";
import { UsersIcon } from "@/components/icons";
import { ToastProvider, useToast } from "@/components/ui/use-toast";
import Forbidden from "./_components/Forbidden";
import NewSubAdminDialog from "./_components/NewSubAdminDialog";
import SubAdminTable from "./_components/SubAdminTable";
import { useUsersStore } from "@/stores/useUsersStore";

export default function UsersPage() {
  return (
    <ToastProvider>
      <UsersPageContent />
    </ToastProvider>
  );
}

function UsersPageContent() {
  const { toast } = useToast();
  const currentUser = useUsersStore((state) => state.currentUser);
  const subAdmins = useUsersStore((state) => state.subAdmins);
  const isLoading = useUsersStore((state) => state.isLoading);
  const loadSubAdmins = useUsersStore((state) => state.loadSubAdmins);
  const toggleActive = useUsersStore((state) => state.toggleActive);
  const togglePermission = useUsersStore((state) => state.togglePermission);
  const createSubAdmin = useUsersStore((state) => state.createSubAdmin);

  const [searchTerm, setSearchTerm] = useState("");
  const [pendingActiveIds, setPendingActiveIds] = useState<Set<string>>(new Set());

  const dashboardRole =
    currentUser.role === "MAIN_ADMIN" ? "main-admin" : "sub-admin";

  useEffect(() => {
    loadSubAdmins().catch((error) => {
      toast({
        variant: "destructive",
        title: "We couldn't load the list",
        description:
          error instanceof Error ? error.message : "Please try again soon.",
      });
    });
  }, [loadSubAdmins, toast]);

  const filteredSubAdmins = useMemo(() => {
    if (!searchTerm) {
      return subAdmins;
    }

    const term = searchTerm.toLowerCase();
    return subAdmins.filter((subAdmin) =>
      [subAdmin.name, subAdmin.email]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term)),
    );
  }, [searchTerm, subAdmins]);

  const handleToggleActive = async (id: string) => {
    const previous = subAdmins.find((user) => user.id === id);
    const wasActive = previous?.isActive ?? false;

    setPendingActiveIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    try {
      await toggleActive(id);
      toast({
        title: wasActive ? "Account disabled" : "Account activated",
        description: wasActive
          ? `${previous?.name ?? "Sub-admin"} can no longer sign in.`
          : `${previous?.name ?? "Sub-admin"} now has access to the dashboard.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Could not update status",
        description:
          error instanceof Error ? error.message : "Please try again shortly.",
      });
    } finally {
      setPendingActiveIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleTogglePermission = async (
    id: string,
    key: "canReserveTickets" | "canIssueTickets",
  ) => {
    const target = subAdmins.find((user) => user.id === id);
    const wasEnabled = target?.[key] ?? false;
    const label = key === "canReserveTickets" ? "Reserve tickets" : "Issue tickets";

    try {
      await togglePermission(id, key);
      toast({
        title: wasEnabled ? `${label} disabled` : `${label} enabled`,
        description: wasEnabled
          ? `${target?.name ?? "Sub-admin"} will lose this permission.`
          : `${target?.name ?? "Sub-admin"} can now ${
              key === "canReserveTickets" ? "reserve" : "issue"
            } tickets.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Permission update failed",
        description:
          error instanceof Error ? error.message : "Please try again shortly.",
      });
    }
  };

  const handleCreateSubAdmin = (input: { name: string; email: string }) => {
    return createSubAdmin(input);
  };

  if (currentUser.role !== "MAIN_ADMIN") {
    return (
      <DashboardShell role={dashboardRole}>
        <Forbidden role={currentUser.role} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role={dashboardRole}>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
              <UsersIcon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-slate-900">Sub-Admins</h1>
              <p className="text-sm text-slate-500">
                Control who can reserve or issue tickets on behalf of your team.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <NewSubAdminDialog onCreate={handleCreateSubAdmin} />
          </div>
        </header>

        <SubAdminTable
          subAdmins={filteredSubAdmins}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onToggleActive={handleToggleActive}
          onDisable={handleToggleActive}
          onTogglePermission={handleTogglePermission}
          pendingActiveIds={pendingActiveIds}
          onResetSearch={() => setSearchTerm("")}
        />
      </div>
    </DashboardShell>
  );
}
