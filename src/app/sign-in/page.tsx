"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SignInContent() {
  const searchParams = useSearchParams();

  return (
    <>
      {/* PASTE YOUR CURRENT SIGN-IN PAGE CONTENT HERE */}
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  );
}
