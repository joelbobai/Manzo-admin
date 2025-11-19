"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/lib/constants";
import { getResponseErrorMessage, parseJSON } from "@/lib/http";

type SignupResponse = {
  message?: string;
};

export default function SubAdminSignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");
    setMessage(null);

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${BASE_URL}/api/v1/user/subadmin/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, password }),
      });

      if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response));
      }

      const payload = await parseJSON<SignupResponse>(response);
      setStatus("success");
      setMessage(
        payload.message ??
          "You're all set! Check your inbox for verification instructions or sign in now.",
      );
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to create the account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-sm font-medium text-slate-700">
          Full name
        </label>
        <Input
          id="fullName"
          placeholder="Amina Sule"
          autoComplete="name"
          required
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Work email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Create a strong password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
          Confirm password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
      </div>

      {message ? (
        <p
          className={`text-sm ${status === "success" ? "text-emerald-600" : "text-rose-600"}`}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>

      {status === "success" ? (
        <p className="text-center text-sm text-slate-500">
          Ready to continue?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Go to login
          </Link>
        </p>
      ) : null}
    </form>
  );
}
