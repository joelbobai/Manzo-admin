"use client";

import { useRouter } from "next/navigation";

import { ShieldIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { Role } from "@/stores/useUsersStore";

type ForbiddenProps = {
  role: Role;
};

export default function Forbidden({ role }: ForbiddenProps) {
  const router = useRouter();

  const dashboardHref =
    role === "MAIN_ADMIN" ? "/main-admin/dashboard" : "/sub-admin/dashboard";

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="max-w-xl space-y-8 rounded-3xl bg-white p-12 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <ShieldIcon className="h-9 w-9" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">403 – Access denied</h1>
          <p className="text-sm text-slate-500">
            You need main admin access to manage sub-admin accounts. Reach out to
            your organisation’s owner if you believe this is a mistake.
          </p>
        </div>
        <Button
          onClick={() => router.push(dashboardHref)}
          className="mx-auto"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
