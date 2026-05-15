"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignOutButton({
  variant = "default",
}: {
  variant?: "default" | "onDark";
}) {
  const router = useRouter();
  async function handle() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }
  const cls =
    variant === "onDark"
      ? "text-sm py-1.5 px-3 rounded-xl border border-oat-50/30 text-oat-50 hover:bg-white/10"
      : "btn-secondary text-sm py-1.5 px-3";
  return (
    <button onClick={handle} className={cls}>
      Sign out
    </button>
  );
}
