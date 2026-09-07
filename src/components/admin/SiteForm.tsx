"use client";

import { saveHighlights, saveSite } from "@/app/admin/actions";
import { ActionForm, Field } from "./ui";
import type { Stat, Testimonial, SiteSettings } from "@/lib/types";

export function SiteForm({ site }: { site: SiteSettings }) {
  return (
    <ActionForm action={saveSite} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" name="name" defaultValue={site.name} required />
        <Field label="Role" name="role" defaultValue={site.role} />
        <Field
          label="Email"
          name="email"
          type="email"
          defaultValue={site.email}
        />
        <Field label="Location" name="location" defaultValue={site.location} />
      </div>

      <Field
        label="Hero tagline"
        name="tagline"
        rows={3}
        defaultValue={site.tagline.join("\n")}
        hint="One line per line. Shown in caps beside the portrait."
      />

      <Field
        label="About heading"
        name="aboutHeading"
        defaultValue={site.aboutHeading}
        hint="Separate with | — every second part is greyed, and the line wraps after it"
      />

      <Field
        label="About paragraph"
        name="aboutBody"
        rows={4}
        defaultValue={site.aboutBody}
      />

      <Field
        label="Tech marquee"
        name="stack"
        rows={2}
        defaultValue={site.stack.join(", ")}
        hint="Comma separated — this is the scrolling strip under the hero"
      />

      <div className="grid gap-6 sm:grid-cols-3">
        <Field
          label="Upwork profile"
          name="upwork"
          defaultValue={site.upwork}
          placeholder="https://www.upwork.com/freelancers/…"
        />
        <Field label="GitHub" name="github" defaultValue={site.github} />
        <Field label="LinkedIn" name="linkedin" defaultValue={site.linkedin} />
      </div>
    </ActionForm>
  );
}

export function HighlightsForm({
  stats,
  testimonial,
}: {
  stats: Stat[];
  testimonial: Testimonial;
}) {
  return (
    <ActionForm action={saveHighlights} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        {stats.map((s, i) => (
          <fieldset
            key={i}
            className="space-y-4 border border-black/10 bg-white p-5"
          >
            <legend className="px-2 text-sm font-semibold">Stat {i + 1}</legend>
            <Field
              label="Label"
              name={`stat-label-${i}`}
              defaultValue={s.label}
            />
            <Field
              label="Value"
              name={`stat-value-${i}`}
              defaultValue={s.value}
            />
            <Field
              label="Note"
              name={`stat-body-${i}`}
              rows={3}
              defaultValue={s.body}
            />
          </fieldset>
        ))}
      </div>

      <fieldset className="space-y-4 border border-black/10 bg-white p-5">
        <legend className="px-2 text-sm font-semibold">Testimonial</legend>
        <Field
          label="Quote"
          name="quote"
          rows={3}
          defaultValue={testimonial.quote}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Name" name="author" defaultValue={testimonial.name} />
          <Field
            label="Role"
            name="authorRole"
            defaultValue={testimonial.role}
          />
          <Field
            label="Rating"
            name="rating"
            defaultValue={testimonial.rating}
          />
        </div>
      </fieldset>
    </ActionForm>
  );
}
