/**
 * Merges a patch of query params into the current search params and returns
 * a query string suitable for a Next.js Link href. Keys whose patch value is
 * `undefined` or `null` are removed from the result (this is how callers
 * clear a filter, e.g. { seri: undefined } to drop the series filter).
 *
 * Any key present in `current` but not mentioned in `patch` is preserved,
 * so pagination links keep active filters and filter links can combine with
 * each other.
 */
export function buildFilterHref(
  basePath: string,
  current: Record<string, string | undefined>,
  patch: Record<string, string | undefined | null>
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(current)) {
    if (value !== undefined && value !== null && value !=="") {
      params.set(key, value);
    }
  }

  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined || value === null || value ==="") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}
