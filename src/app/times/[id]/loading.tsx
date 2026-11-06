import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-10" aria-busy="true">
      <span className="sr-only">Carregando</span>
      <div className="flex items-center gap-5">
        <Skeleton className="size-24 rounded-xl" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-10 w-64 max-w-full" />
          <Skeleton className="h-4 w-80 max-w-full" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-28" />
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-32" />
        ))}
      </div>
    </div>
  );
}
