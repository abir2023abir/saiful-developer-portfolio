import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/auth";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  if (await currentAdmin()) redirect("/admin");

  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-sm">
        <div
          className="mb-8 h-28"
          style={{ background: "linear-gradient(120deg, #e8461c 0%, #c8340f 40%, #6366f1 100%)" }}
        >
          <span className="grid h-full place-items-center font-display text-xl font-bold text-white">
            Admin
          </span>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
