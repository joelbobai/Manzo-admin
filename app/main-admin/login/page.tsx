import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import MainAdminLoginForm from "@/components/auth/MainAdminLoginForm";

export default function MainAdminLoginPage() {
  return (
    <AuthCard title="Main Admin Login" subtitle="Sign in to manage the platform.">
      <div className="space-y-5">
        <MainAdminLoginForm />
        <div className="text-center text-sm text-slate-500">
          <Link href="/main-admin/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Forgot password?
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
