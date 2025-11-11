import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import SubAdminForgotPasswordForm from "@/components/auth/SubAdminForgotPasswordForm";

export default function SubAdminForgotPasswordPage() {
  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="Enter your sub-admin email to receive reset instructions."
    >
      <div className="space-y-5">
        <SubAdminForgotPasswordForm />
        <div className="text-center text-sm text-slate-500">
          Remember your password?{" "}
          <Link href="/sub-admin/login" className="font-semibold text-blue-600 hover:text-blue-500">
            Back to login
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
