import Link from "next/link";
import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/auth";
import { readContent } from "@/lib/content";
import LoginStage from "@/components/admin/LoginStage";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  if (await currentAdmin()) redirect("/admin");
  const { site } = await readContent();

  return (
    <div className="grid min-h-screen bg-ink lg:grid-cols-[11fr_9fr]">
      <LoginStage name={site.name} />

      <div className="flex flex-col justify-center px-6 py-14 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <LoginForm />

          <p className="mt-8 text-center text-xs text-white/35">
            <Link href="/" className="transition-colors hover:text-white/70">
              ← Back to the site
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
