const PAGE_SIZE = 100;
const MAX_PAGES = 50;

interface PaginatedAdminResponse<T> {
  success?: boolean;
  pagination?: { page: number; limit: number; total: number; totalPages: number };
  [key: string]: unknown;
}

/** Fetch every page from a paginated admin list API. */
export async function fetchAllAdminPages<T>(
  basePath: string,
  listKey: string,
  headers: HeadersInit,
): Promise<T[]> {
  const items: T[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages && page <= MAX_PAGES) {
    const separator = basePath.includes('?') ? '&' : '?';
    const res = await fetch(`${basePath}${separator}page=${page}&limit=${PAGE_SIZE}`, { headers });
    if (res.status === 401) {
      throw new Error('Unauthorized');
    }
    if (!res.ok) break;

    const data = (await res.json()) as PaginatedAdminResponse<T>;
    if (data.success === false) break;

    const chunk = data[listKey];
    if (!Array.isArray(chunk)) break;

    items.push(...(chunk as T[]));
    totalPages = data.pagination?.totalPages ?? 1;
    page += 1;
    if (chunk.length === 0) break;
  }

  return items;
}
