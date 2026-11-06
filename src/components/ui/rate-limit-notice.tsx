import { RetryButton } from "./retry-button";

export function RateLimitNotice() {
  return (
    <div
      role="status"
      className="border-border bg-surface flex flex-col items-start gap-4 rounded-lg border p-6"
    >
      <p>Muitas consultas em pouco tempo. Tente de novo em 1 minuto.</p>
      <RetryButton />
    </div>
  );
}
