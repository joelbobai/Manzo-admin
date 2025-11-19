import AuthCard from "@/components/auth/AuthCard";
import SubAdminSignupForm from "@/components/auth/SubAdminSignupForm";

export default function SubAdminSignupPage() {
  return (
    <AuthCard
      title="Create a sub-admin account"
      subtitle="Request access to manage reservations for your team."
    >
      <SubAdminSignupForm />
    </AuthCard>
  );
}
