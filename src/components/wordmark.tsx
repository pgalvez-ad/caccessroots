import Link from "next/link";

// CAccessRoots wordmark.
// Variants: full ("CAccessRoots") or mark ("C").
// The "C" is sage; the rest is forest ink.

export function Wordmark({
  size = "md",
  href = "/",
  showSub = false,
}: {
  size?: "sm" | "md" | "lg";
  href?: string | null;
  showSub?: boolean;
}) {
  const px =
    size === "lg" ? "text-4xl" : size === "sm" ? "text-lg" : "text-xl";

  const inner = (
    <div className="flex items-center gap-2">
      <span className={`brand-wordmark ${px} font-medium text-forest-700`}>
        <span className="accent-c">C</span>AccessRoots
      </span>
      {showSub && (
        <span className="hidden sm:inline text-xs uppercase tracking-widest text-brand-600 ml-2">
          Communication · Access · Roots
        </span>
      )}
    </div>
  );

  return href ? (
    <Link href={href} aria-label="CAccessRoots home">
      {inner}
    </Link>
  ) : (
    inner
  );
}

// Mark-only for tight spaces (favicon-style)
export function Mark({ size = 36 }: { size?: number }) {
  return (
    <div
      aria-hidden
      className="rounded-xl bg-brand-600 grid place-items-center text-oat-50 font-medium brand-wordmark"
      style={{ width: size, height: size, fontSize: size * 0.55 }}
    >
      C
    </div>
  );
}
