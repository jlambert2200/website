// Builds a link that works whether the site lives at the root of a domain
// or in a sub-folder (e.g. username.github.io/my-site/).
export function url(path = '/'): string {
  if (/^(https?:|mailto:)/.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function byDateDesc<T extends { data: { date?: Date } }>(a: T, b: T): number {
  return (b.data.date?.valueOf() ?? 0) - (a.data.date?.valueOf() ?? 0);
}
