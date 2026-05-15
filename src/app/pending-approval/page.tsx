import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { Wordmark } from "@/components/wordmark";

export default async function PendingApprovalPage() {
  const profile = await requireProfile();
  return (
    <main className="min-h-screen grid place-items-center px-4 bg-oat-50">
      <div className="card p-8 max-w-md text-center">
        <div className="flex justify-center"><Wordmark size="sm" href={null} /></div>
        <h1 className="font-serif text-3xl text-forest-700 mt-4">Thanks for signing up.</h1>
        <p className="text-olive-700 mt-2">
          Hi {profile.full_name.split(" ")[0]} — your account is pending admin
          review. We typically respond within a few business days. You'll get an
          email when your account is active.
        </p>
        <Link href="/" className="btn-secondary mt-6 inline-block">
          Back to home
        </Link>
      </div>
    </main>
  );
}
