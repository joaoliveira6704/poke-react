import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function Paginate({
  previous,
  next,
  currentPage,
  count,
  click,
}: {
  previous: () => void;
  next: () => void;
  currentPage: number;
  count: number;
  click: (page: number) => void;
}) {
  const maxPage = Math.ceil(count / 20);

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationLink onClick={() => click(1)} className="cursor-pointer">
              1
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationPrevious
            onClick={previous}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : undefined}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            onClick={next}
            aria-disabled={currentPage === maxPage}
            tabIndex={currentPage === maxPage ? -1 : undefined}
            className={
              currentPage === maxPage
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
        {currentPage < maxPage && (
          <PaginationItem>
            <PaginationLink
              onClick={() => click(maxPage)}
              className="cursor-pointer"
            >
              {maxPage}
            </PaginationLink>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
