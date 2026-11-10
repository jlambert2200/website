import { existsSync, readFileSync } from 'node:fs';

export interface StravaData {
  fetchedAt: string;
  latest: {
    id: number;
    name: string;
    type: string;
    date: string;
    meters: number;
    movingSeconds: number;
    elevationMeters: number;
  } | null;
  weeks: { start: string; meters: number; runs: number }[];
}

// The file is written by scripts/fetch-strava.mjs during the build on GitHub.
export function loadStrava(): StravaData | null {
  const file = 'src/data/strava.json';
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

const METERS = { mi: 1609.344, km: 1000 };

export function distance(meters: number, unit: string): string {
  return (meters / METERS[unit as 'mi' | 'km']).toFixed(1);
}

export function duration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  const pad = (n: number) => String(n).padStart(2, '0');
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export function pace(meters: number, seconds: number, unit: string): string {
  if (!meters) return '–';
  const perUnit = seconds / (meters / METERS[unit as 'mi' | 'km']);
  return `${duration(perUnit)} /${unit}`;
}
