"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import SubAdminsPage from "@/components/dashboard/SubAdminsPage";
import { useAuth } from "@/stores/auth-store";

export default function DashboardUsersPage() {
  const router = useRouter();
  const { user, hydrated } = useAuth();

  useEffect(() => {
    if (hydrated && user?.role === "sub_admin") {
      router.replace("/dashboard");
    }
  }, [hydrated, router, user?.role]);

  if (!hydrated) {
    return null;
  }

  if (user?.role === "sub_admin") {
    return (
      <div className="rounded-3xl bg-white p-6 text-sm text-slate-500 shadow-sm">
        You do not have access to user management.
      </div>
    );
  }

  return <SubAdminsPage />;
}
