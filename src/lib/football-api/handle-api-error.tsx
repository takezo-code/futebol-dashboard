import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { RateLimitNotice } from "@/components/ui/rate-limit-notice";
import { NotFoundError, RateLimitError } from "./errors";

export function handleApiError(error: unknown): ReactElement {
  if (error instanceof RateLimitError) {
    return <RateLimitNotice />;
  }
  if (error instanceof NotFoundError) {
    notFound();
  }
  throw error;
}
