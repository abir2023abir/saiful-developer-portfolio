import ServicesForm from "@/components/admin/ServicesForm";
import { readContent } from "@/lib/content";
import { addService } from "../../actions";

export default async function ServicesAdminPage() {
  const { services } = await readContent();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold tracking-tight">
          Services
        </h2>
        <form action={addService}>
          <button className="bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand">
            Add a service
          </button>
        </form>
      </div>
      <ServicesForm services={services} />
    </div>
  );
}
