import Link from "next/link";
import type { Profile, UserRole } from "@/lib/types";
import SignOutButton from "./sign-out-button";
import { Wordmark } from "./wordmark";

const NAV: Record<UserRole, { href: string; label: string }[]> = {
  requestor: [
    { href: "/requestor", label: "Home" },
    { href: "/requestor/new-request", label: "New request" },
    { href: "/requestor/requests", label: "My requests" },
    { href: "/requestor/blocklist", label: "My blocklist" },
  ],
  interpreter: [
    { href: "/interpreter", label: "Home" },
    { href: "/interpreter/profile", label: "My profile" },
    { href: "/interpreter/open-requests", label: "Open requests" },
    { href: "/interpreter/assignments", label: "My assignments" },
  ],
  coordinator: [
    { href: "/coordinator", label: "Queue" },
    { href: "/coordinator/map", label: "Map" },
    { href: "/coordinator/interpreters", label: "Interpreters" },
  ],
  admin: [
    { href: "/admin", label: "Overview" },
    { href: "/admin/approvals", label: "Approvals" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/communities", label: "Communities" },
    { href: "/admin/audit-log", label: "Audit log" },
  ],
  partner_admin: [
    { href: "/partner", label: "Home" },
    { href: "/partner/members", label: "Members" },
    { href: "/partner/activity", label: "Activity" },
  ],
};

// Admin gets a deeper-forest header; partner gets a river-blue accent.
const HEADER_TONE: Record<UserRole, string> = {
  requestor: "bg-white border-b border-sand-200",
  interpreter: "bg-white border-b border-sand-200",
  coordinator: "bg-white border-b border-brand-100",
  admin: "bg-forest-900 border-b border-forest-700 text-oat-50",
  partner_admin: "bg-river-700 border-b border-river-900 text-oat-50",
};

export default function AppShell({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const nav = NAV[profile.role];
  const isDark = profile.role === "admin" || profile.role === "partner_admin";
  return (
    <div className="min-h-screen bg-oat-50">
      <header className={HEADER_TONE[profile.role]}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            {isDark ? (
              <span className="brand-wordmark text-xl font-medium text-oat-50">
                <span className="text-brand-200">C</span>AccessRoots
              </span>
            ) : (
              <Wordmark size="sm" href={null} />
            )}
            <span
              className={`badge ml-2 capitalize ${
                isDark
                  ? "bg-forest-700 text-oat-50"
                  : "bg-brand-50 text-brand-800"
              }`}
            >
              {profile.role.replace("_", " ")}
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm ${
                  isDark
                    ? "text-oat-50/80 hover:text-oat-50 hover:bg-white/10"
                    : "text-olive-700 hover:text-forest-700 hover:bg-brand-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className={`text-sm hidden sm:inline ${isDark ? "text-oat-50/80" : "text-olive-700"}`}>
              {profile.full_name}
            </span>
            <SignOutButton variant={isDark ? "onDark" : "default"} />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
