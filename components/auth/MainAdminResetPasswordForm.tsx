"use client";

import { FormEvent, useMemo, useState } from "react";

type MainAdminResetPasswordFormProps = {
  token: string;
};

export default function MainAdminResetPasswordForm({ token }: MainAdminResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const strengthLabel = useMemo(() => {
    const score = calculatePasswordScore(password);

    if (score >= 4) return "Strong";
    if (score >= 2) return "Medium";
    if (score > 0) return "Weak";
    return "Very weak";
  }, [password]);

  function calculatePasswordScore(value: string) {
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    return score;
  }

  async function simulatePasswordReset(resetToken: string, newPassword: string) {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (resetToken && newPassword.length >= 8) {
          resolve();
        } else {
          reject(new Error("Reset failed"));
        }
      }, 900);
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("idle");
    setMessage("");

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await simulatePasswordReset(token, password);
      setStatus("success");
      setMessage("Password reset successfully. You can now log in.");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setStatus("error");
      setMessage("We were unable to reset your password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          New password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter a new password"
        />
        <p className="text-xs text-slate-500">Strength: {strengthLabel}</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Re-enter the new password"
        />
      </div>
      {status !== "idle" ? (
        <p
          className={`text-sm ${
            status === "success" ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
      >
        {loading ? "Resetting password..." : "Reset password"}
      </button>
    </form>
  );
}
