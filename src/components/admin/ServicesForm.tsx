"use client";

import { saveServices } from "@/app/admin/actions";
import { ActionForm, Field } from "./ui";
import type { Service } from "@/lib/types";

export default function ServicesForm({ services }: { services: Service[] }) {
  return (
    <ActionForm action={saveServices} className="space-y-6">
      {services.map((s, i) => (
        <fieldset
          key={i}
          className="space-y-4 border border-black/10 bg-white p-5"
        >
          <legend className="px-2 text-sm font-semibold">
            Service {i + 1}
          </legend>
          <div className="grid gap-4 sm:grid-cols-[6rem_1fr]">
            <Field label="Number" name={`n-${i}`} defaultValue={s.n} />
            <Field label="Title" name={`title-${i}`} defaultValue={s.title} />
          </div>
          <Field
            label="Description"
            name={`body-${i}`}
            rows={3}
            defaultValue={s.body}
          />
        </fieldset>
      ))}
      <p className="text-xs text-black/55">
        Clearing a title removes that service when you save.
      </p>
    </ActionForm>
  );
}
