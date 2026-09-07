"use client";

import Image from "next/image";
import { useState } from "react";
import { saveProject } from "@/app/admin/actions";
import { ActionForm, Field, inputClass } from "./ui";
import type { Project } from "@/lib/types";

const blank: Project = {
  slug: "",
  title: "",
  category: "",
  year: String(new Date().getFullYear()),
  summary: "",
  stack: [],
  tint: ["#e8461c", "#450a0a"],
};

export default function ProjectForm({ project }: { project?: Project }) {
  const p = project ?? blank;
  const [image, setImage] = useState(p.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function upload(file: File) {
    setUploading(true);
    setUploadError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      // A failing route can answer with an HTML error page, so read the body
      // defensively rather than letting JSON.parse throw over the real message.
      const json = await res.json().catch(() => null);
      if (!res.ok)
        throw new Error(json?.error ?? `Upload failed (${res.status}).`);
      setImage(json.path);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <ActionForm action={saveProject} className="space-y-6">
      <input type="hidden" name="originalSlug" value={p.slug} />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Title" name="title" defaultValue={p.title} required />
        <Field
          label="URL slug"
          name="slug"
          defaultValue={p.slug}
          hint="Leave blank to build one from the title"
          placeholder="my-project"
        />
        <Field
          label="Category"
          name="category"
          defaultValue={p.category}
          placeholder="SaaS Dashboard"
        />
        <Field label="Year" name="year" defaultValue={p.year} />
      </div>

      <Field
        label="Card summary"
        name="summary"
        rows={3}
        defaultValue={p.summary}
        hint="One or two sentences — this is what shows on the card"
      />

      <Field
        label="Stack"
        name="stack"
        defaultValue={p.stack.join(", ")}
        hint="Comma separated"
        placeholder="Next.js 16, Prisma, Postgres"
      />

      {/* Preview image */}
      <div className="border border-black/10 bg-white p-5">
        <p className="text-sm font-semibold">Preview image</p>
        <p className="mt-0.5 text-xs text-black/55">
          Shown on the project card and at the top of the case study. Without
          one the card falls back to the gradient below.
        </p>

        <div className="mt-4 flex flex-wrap items-start gap-5">
          <div className="relative h-28 w-44 shrink-0 overflow-hidden border border-black/10 bg-smoke">
            {image ? (
              <Image
                src={image}
                alt=""
                fill
                sizes="176px"
                className="object-cover object-top"
              />
            ) : (
              <span
                className="block h-full w-full"
                style={{
                  background: `linear-gradient(140deg, ${p.tint[0]}, ${p.tint[1]})`,
                }}
              />
            )}
          </div>

          <div className="flex-1 space-y-3">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) upload(file);
              }}
              className="block w-full text-sm file:mr-3 file:border file:border-ink file:bg-white file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-wider hover:file:bg-ink hover:file:text-white"
            />
            <input
              name="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/projects/my-project.jpg"
              className={inputClass}
            />
            <p aria-live="polite" className="text-xs">
              {uploading && <span className="text-black/55">Uploading…</span>}
              {uploadError && (
                <span className="text-brand-ink">{uploadError}</span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold">
              Fallback gradient — from
            </span>
            <input
              name="tintFrom"
              type="color"
              defaultValue={p.tint[0]}
              className={`${inputClass} h-11 p-1`}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">
              Fallback gradient — to
            </span>
            <input
              name="tintTo"
              type="color"
              defaultValue={p.tint[1]}
              className={`${inputClass} h-11 p-1`}
            />
          </label>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Live URL"
          name="liveUrl"
          defaultValue={p.liveUrl}
          placeholder="https://…"
        />
        <Field
          label="Repository URL"
          name="repoUrl"
          defaultValue={p.repoUrl}
          placeholder="https://github.com/…"
        />
      </div>

      <fieldset className="space-y-6 border border-black/10 bg-white p-5">
        <legend className="px-2 text-sm font-semibold">Case study</legend>
        <p className="text-xs text-black/55">
          Each filled section becomes a block on /work/{p.slug || "your-slug"}.
          Leave them empty and the page shows the summary alone.
        </p>
        <Field
          label="The problem"
          name="problem"
          rows={3}
          defaultValue={p.problem}
        />
        <Field
          label="The approach"
          name="approach"
          rows={3}
          defaultValue={p.approach}
        />
        <Field
          label="The result"
          name="result"
          rows={3}
          defaultValue={p.result}
        />
      </fieldset>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={p.featured}
          className="h-4 w-4 accent-[#e8461c]"
        />
        <span className="text-sm">
          <span className="font-semibold">Feature in the hero</span>
          <span className="ml-2 text-black/55">
            shown in the floating card on the home page
          </span>
        </span>
      </label>
    </ActionForm>
  );
}
