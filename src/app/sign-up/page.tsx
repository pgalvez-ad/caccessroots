"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SignUpContent() {
  const searchParams = useSearchParams();

  return (
    <>
      {/* PASTE YOUR CURRENT SIGN-UP PAGE CONTENT HERE */}
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignUpContent />
    </Suspense>
  );
}
