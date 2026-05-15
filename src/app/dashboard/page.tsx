import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";

// Role-based router. Lands every signed-in user at the right dashboard.
export default async function DashboardRouter() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/sign-in");
  if (profile.status === "pending" && profile.role !== "requestor") {
    redirect("/pending-approval");
  }
  switch (profile.role) {
    case "admin":
      redirect("/admin");
    case "coordinator":
      redirect("/coordinator");
    case "interpreter":
      redirect("/interpreter");
    case "partner_admin":
      redirect("/partner");
    case "requestor":
    default:
      redirect("/requestor");
  }
}
