import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import SubAdminSignupForm from "@/components/auth/SubAdminSignupForm";

export default function SubAdminSignupPage() {
  return (
    <AuthCard title="Create a Sub-Admin account" subtitle="Join the team and start collaborating.">
      <div className="space-y-5">
        <SubAdminSignupForm />
        <div className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/sub-admin/login" className="font-semibold text-blue-600 hover:text-blue-500">
            Log in here
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
