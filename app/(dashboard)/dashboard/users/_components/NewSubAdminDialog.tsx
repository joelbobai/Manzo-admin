"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

type NewSubAdminDialogProps = {
  onCreate: (input: { name: string; email: string }) => Promise<void>;
};

export default function NewSubAdminDialog({ onCreate }: NewSubAdminDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => {
    setName("");
    setEmail("");
  };

  const close = () => {
    setOpen(false);
    reset();
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onCreate({ name: name.trim(), email: email.trim() });
      toast({
        title: "Invitation sent",
        description: `${name.trim()} can now access the dashboard`,
      });
      close();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Could not create account",
        description:
          error instanceof Error ? error.message : "Please try again shortly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="md">
        New Sub-Admin
      </Button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">
                Invite a new sub-admin
              </h2>
              <p className="text-sm text-slate-500">
                We’ll email them instructions to finish setting up their
                account.
              </p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  htmlFor="subAdminName"
                  className="block text-sm font-medium text-slate-700"
                >
                  Full name
                </label>
                <Input
                  id="subAdminName"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Jane Doe"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="subAdminEmail"
                  className="block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>
                <Input
                  id="subAdminEmail"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="jane.doe@example.com"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={close}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending…" : "Send invite"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
