import AuthCard from "@/components/auth/AuthCard";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Forgot password"
      subtitle="Enter your email and we'll send instructions."
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
