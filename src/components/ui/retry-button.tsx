"use client";

import { useRouter } from "next/navigation";

export function RetryButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.refresh()}
      className="border-border hover:bg-surface focus-visible:outline-brand rounded-md border px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      Tentar de novo
    </button>
  );
}
