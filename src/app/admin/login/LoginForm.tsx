"use client";

import { useActionState } from "react";
import { login } from "../actions";
import { Field, SubmitButton } from "@/components/admin/ui";

export default function LoginForm() {
  const [state, formAction] = useActionState(login, {});

  return (
    <form action={formAction} className="space-y-4 border border-black/10 bg-white p-6">
      <Field label="Username" name="username" required />
      <Field label="Password" name="password" type="password" required />
      <div className="pt-2">
        <SubmitButton>Sign in</SubmitButton>
      </div>
      <p aria-live="polite" className="min-h-[1.25rem] text-sm text-brand-ink">
        {state.error}
      </p>
    </form>
  );
}
