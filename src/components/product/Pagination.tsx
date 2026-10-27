import Link from"next/link";
import { buildFilterHref } from"@/lib/buildFilterHref";

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  currentParams = {},
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  currentParams?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex gap-small justify-center mt-large">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
        page === currentPage ? (
          <span key={page} className="px-3 py-1 rounded bg-primary text-white font-bold">
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={buildFilterHref(basePath, currentParams, { sayfa: String(page) })}
            className="px-3 py-1 rounded border border-border hover:bg-bg-light"
          >
            {page}
          </Link>
        )
      )}
    </nav>
  );
}
