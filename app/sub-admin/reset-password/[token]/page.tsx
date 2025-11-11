import AuthCard from "@/components/auth/AuthCard";
import SubAdminResetPasswordForm from "@/components/auth/SubAdminResetPasswordForm";

type SubAdminResetPasswordPageProps = {
  params: {
    token: string;
  };
};

export default function SubAdminResetPasswordPage({ params }: SubAdminResetPasswordPageProps) {
  return (
    <AuthCard
      title="Set a new password"
      subtitle="Use the secure link sent to your email to update your password."
    >
      <SubAdminResetPasswordForm token={params.token} />
    </AuthCard>
  );
}
