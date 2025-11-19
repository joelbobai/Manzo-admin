import AuthCard from "@/components/auth/AuthCard";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

type ResetPasswordPageProps = {
  searchParams?:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const resolvedParams = searchParams
    ? searchParams instanceof Promise
      ? await searchParams
      : searchParams
    : {};
  const tokenParam = resolvedParams?.token;
  const token = Array.isArray(tokenParam) ? tokenParam[0] ?? "" : tokenParam ?? "";

  return (
    <AuthCard
      title="Reset password"
      subtitle="Choose a new password to access the dashboard."
    >
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}
