import AuthCard from "@/components/auth/AuthCard";
import MainAdminResetPasswordForm from "@/components/auth/MainAdminResetPasswordForm";

type MainAdminResetPasswordPageProps = {
  params: {
    token: string;
  };
};

export default function MainAdminResetPasswordPage({ params }: MainAdminResetPasswordPageProps) {
  return (
    <AuthCard
      title="Create a new password"
      subtitle="Secure your main admin account with a new password."
    >
      <MainAdminResetPasswordForm token={params.token} />
    </AuthCard>
  );
}
