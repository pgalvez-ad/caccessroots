"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Wordmark } from "@/components/wordmark";

function SignInContent() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <main className="min-h-screen grid place-items-center px-4 bg-oat-50">
      <div className="card p-8 w-full max-w-md">
        <Link href="/" className="text-sm text-olive-600">
          ← Back
        </Link>

        <div className="mt-4 mb-2">
          <Wordmark size="sm" href={null} />
        </div>

        <h1 className="font-serif text-3xl text-forest-700 mt-2">
          Welcome back.
        </h1>

        <p className="text-sm text-olive-700 mt-1">
          Sign in to continue.
        </p>

        <form onSubmit={onSubmit} className="space-y-4 mt-6">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-terra-700 bg-terra-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-sm text-olive-700 mt-6 text-center">
          New here?{" "}
          <Link
            href="/sign-up"
            className="text-brand-700 font-medium underline-offset-2 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<main className="min-h-screen grid place-items-center">Loading...</main>}>
      <SignInContent />
    </Suspense>
  );
}
