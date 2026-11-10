// Fetches recent Strava activity before each build and saves a small summary
// to src/data/strava.json. Runs on GitHub; the keys live in the repository's
// Secrets (STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN).
// If the keys are missing or Strava is unreachable, the site still builds and
// the Strava block is simply hidden.
import { writeFileSync, mkdirSync } from 'node:fs';

const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN } = process.env;
const OUT = 'src/data/strava.json';
const WEEKS = 6;
const RUN_TYPES = new Set(['Run', 'TrailRun', 'VirtualRun']);

function skip(reason) {
  console.log(`Strava: skipped (${reason}).`);
  process.exit(0);
}

if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET || !STRAVA_REFRESH_TOKEN) skip('keys not set');

// Monday 00:00 (UTC) of the week containing the given date
function weekStart(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d;
}

try {
  const tokenRes = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      refresh_token: STRAVA_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  if (!tokenRes.ok) skip(`could not refresh access (HTTP ${tokenRes.status})`);
  const token = await tokenRes.json();
  if (token.refresh_token && token.refresh_token !== STRAVA_REFRESH_TOKEN) {
    console.log('::warning::Strava issued a new refresh token. Re-authorize and update the STRAVA_REFRESH_TOKEN secret.');
  }

  const firstWeek = weekStart(new Date());
  firstWeek.setUTCDate(firstWeek.getUTCDate() - 7 * (WEEKS - 1));
  const after = Math.floor(firstWeek.getTime() / 1000);

  const actRes = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?after=${after}&per_page=200`,
    { headers: { Authorization: `Bearer ${token.access_token}` } },
  );
  if (!actRes.ok) skip(`could not load activities (HTTP ${actRes.status})`);

  // Only activities you have set to "Everyone" on Strava are used.
  const activities = (await actRes.json()).filter((a) => a.visibility === 'everyone' && !a.private);

  const weeks = Array.from({ length: WEEKS }, (_, i) => {
    const start = new Date(firstWeek);
    start.setUTCDate(start.getUTCDate() + 7 * i);
    return { start: start.toISOString().slice(0, 10), meters: 0, runs: 0 };
  });
  for (const a of activities) {
    if (!RUN_TYPES.has(a.sport_type ?? a.type)) continue;
    const key = weekStart(new Date(a.start_date_local)).toISOString().slice(0, 10);
    const week = weeks.find((w) => w.start === key);
    if (week) {
      week.meters += a.distance;
      week.runs += 1;
    }
  }

  const newest = activities.sort((a, b) => new Date(b.start_date) - new Date(a.start_date))[0];
  const latest = newest && {
    id: newest.id,
    name: newest.name,
    type: newest.sport_type ?? newest.type,
    date: newest.start_date_local,
    meters: newest.distance,
    movingSeconds: newest.moving_time,
    elevationMeters: newest.total_elevation_gain,
  };

  mkdirSync('src/data', { recursive: true });
  writeFileSync(OUT, JSON.stringify({ fetchedAt: new Date().toISOString(), latest: latest ?? null, weeks }, null, 2));
  console.log(`Strava: saved ${activities.length} activities across ${WEEKS} weeks.`);
} catch (err) {
  skip(`error: ${err.message}`);
}
