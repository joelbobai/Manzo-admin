"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/stores/auth-context";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login({ email, password, remember });
      router.replace("/dashboard");
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "We could not log you in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email address
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
          placeholder="••••••••"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-slate-600">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          Remember me
        </label>
        <Link href="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Forgot password?
        </Link>
      </div>

      {error ? (
        <p className="text-sm font-medium text-rose-600" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Sub-admin? {" "}
        <Link href="/signup/sub-admin" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Sign up
        </Link>
      </p>
    </form>
  );
}
