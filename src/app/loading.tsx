import { Skeleton } from "@/components/ui/skeleton";
import { COMPETITION_CODES } from "@/lib/competitions";

export default function Loading() {
  return (
    <section className="flex flex-col gap-6" aria-busy="true">
      <span className="sr-only">Carregando</span>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {COMPETITION_CODES.map((code) => (
          <Skeleton key={code} className="h-[90px]" />
        ))}
      </div>
    </section>
  );
}
