import type { CollectionEntry } from 'astro:content';

export function trainingStats(entries: CollectionEntry<'training'>[]) {
  const year = new Date().getUTCFullYear();
  const thisYear = entries.filter((e) => e.data.date.getUTCFullYear() === year);
  const distances = thisYear.map((e) => e.data.distance ?? 0);
  const total = distances.reduce((sum, d) => sum + d, 0);
  const longest = distances.length ? Math.max(...distances) : 0;
  const round = (n: number) => Math.round(n * 10) / 10;
  return { year, runs: thisYear.length, total: round(total), longest: round(longest) };
}
