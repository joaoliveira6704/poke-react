import { Skeleton } from "../ui/skeleton";

export function PokemonCardSkeleton() {
  return (
    <div className="relative mx-auto w-full max-w-sm border rounded-xl overflow-hidden">
      <div className="relative aspect-video w-full bg-linear-to-br flex items-end p-3">
        <Skeleton className="absolute inset-0 w-full h-full rounded-none bg-neutral-300" />
        <div className="relative z-10 flex flex-col gap-2 w-1/2">
          <Skeleton className="h-4 w-12 bg-neutral-300" />
          <Skeleton className="h-6 w-28 bg-neutral-300" />
        </div>
      </div>
      <div className="absolute top-4 left-3 flex gap-1.5">
        <Skeleton className="h-5 w-14 rounded-full bg-neutral-300" />
        <Skeleton className="h-5 w-14 rounded-full bg-neutral-300" />
      </div>
    </div>
  );
}
