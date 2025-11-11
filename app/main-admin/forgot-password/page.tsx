import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import MainAdminForgotPasswordForm from "@/components/auth/MainAdminForgotPasswordForm";

export default function MainAdminForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter the email associated with your main admin account."
    >
      <div className="space-y-5">
        <MainAdminForgotPasswordForm />
        <div className="text-center text-sm text-slate-500">
          Remember your credentials?{" "}
          <Link href="/main-admin/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Go back to login
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
