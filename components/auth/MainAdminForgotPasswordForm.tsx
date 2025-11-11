"use client";

import { FormEvent, useState } from "react";

export default function MainAdminForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function simulateForgotPasswordRequest(adminEmail: string) {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (adminEmail.includes("@")) {
          resolve();
        } else {
          reject(new Error("Invalid email"));
        }
      }, 800);
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      await simulateForgotPasswordRequest(email);
      setStatus("success");
      setMessage("Password reset instructions have been sent to your email.");
    } catch {
      setStatus("error");
      setMessage("We could not process your request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="admin@example.com"
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
        {loading ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}
