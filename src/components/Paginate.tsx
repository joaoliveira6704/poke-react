import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function getPageNumber(url: string | null): number | null {
  if (!url) return null;
  const offset = new URL(url).searchParams.get("offset");
  return offset !== null ? Math.floor(Number(offset) / 20) + 1 : null;
}

export function Paginate({
  previous,
  next,
}: {
  previous: string | null;
  next: string | null;
}) {
  const prevPage = getPageNumber(previous);
  const nextPage = getPageNumber(next);

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={prevPage ? `?page=${prevPage}` : undefined}
            aria-disabled={!prevPage}
            tabIndex={!prevPage ? -1 : undefined}
            className={!prevPage ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href={nextPage ? `?page=${nextPage}` : undefined}
            aria-disabled={!nextPage}
            tabIndex={!nextPage ? -1 : undefined}
            className={!nextPage ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
