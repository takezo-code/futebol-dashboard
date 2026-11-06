import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true">
      <span className="sr-only">Carregando</span>
      <Skeleton className="h-11 w-full" />
      {Array.from({ length: 10 }, (_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}
