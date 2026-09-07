"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { ActionState } from "@/app/admin/actions";

export const inputClass =
  "mt-1.5 w-full rounded-none border border-black/15 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand focus-visible:ring-2 focus-visible:ring-brand/30";

export function Field({
  label,
  name,
  defaultValue,
  hint,
  type = "text",
  rows,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  hint?: string;
  type?: string;
  rows?: number;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      {hint && (
        <span className="mt-0.5 block text-xs text-black/55">{hint}</span>
      )}
      {rows ? (
        <textarea
          name={name}
          rows={rows}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          className={`${inputClass} resize-y`}
        />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          className={inputClass}
        />
      )}
    </label>
  );
}

export function SubmitButton({
  children = "Save changes",
}: {
  children?: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

/** Wraps a server action so the form can show its own error and success text. */
export function ActionForm({
  action,
  children,
  className,
  submitLabel,
}: {
  action: (state: ActionState, form: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  className?: string;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className={className}>
      {children}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <SubmitButton>{submitLabel}</SubmitButton>
        <p aria-live="polite" className="text-sm">
          {state.ok && <span className="text-emerald-700">{state.ok}</span>}
          {state.error && <span className="text-brand-ink">{state.error}</span>}
        </p>
      </div>
    </form>
  );
}
