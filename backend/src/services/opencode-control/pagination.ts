export function responsePage<T>(items: T[], page = 1, pageSize = 20) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safePageSize = Math.max(Math.min(Number(pageSize) || 20, 200), 1);
  const start = (safePage - 1) * safePageSize;
  return {
    data: items.slice(start, start + safePageSize),
    meta: { page: safePage, pageSize: safePageSize, total: items.length },
  };
}
