import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import SubAdminLoginForm from "@/components/auth/SubAdminLoginForm";

export default function SubAdminLoginPage() {
  return (
    <AuthCard title="Sub-Admin Login" subtitle="Access your workspace and tasks.">
      <div className="space-y-5">
        <SubAdminLoginForm />
        <div className="flex items-center justify-between text-sm text-slate-500">
          <Link href="/sub-admin/signup" className="font-semibold text-blue-600 hover:text-blue-500">
            Create account
          </Link>
          <Link href="/sub-admin/forgot-password" className="font-semibold text-blue-600 hover:text-blue-500">
            Forgot password?
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
