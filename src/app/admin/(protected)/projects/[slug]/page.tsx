import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { getProject } from "@/lib/content";
import { deleteProject } from "../../../actions";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold tracking-tight">{project.title}</h2>
        <Link href={`/work/${project.slug}`} className="text-xs uppercase tracking-[0.14em] text-black/55 hover:text-brand-ink">
          View page ↗
        </Link>
      </div>

      <ProjectForm project={project} />

      <form action={deleteProject} className="mt-12 border-t border-black/10 pt-6">
        <input type="hidden" name="slug" value={project.slug} />
        <button className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink hover:underline">
          Delete this project
        </button>
      </form>
    </div>
  );
}
