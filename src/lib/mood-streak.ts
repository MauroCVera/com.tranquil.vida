export type MoodEntry = { day: string; mood: string; created_at?: string };

export type StreakKind = "positive" | "negative" | null;

const NEGATIVE = new Set(["low", "bad"]);
const POSITIVE = new Set(["great", "good"]);

/**
 * Analyze mood history to detect a 3-day consecutive streak.
 * Expects entries sorted DESC by day (most recent first).
 * Requires the 3 most recent days to be consecutive calendar days
 * ending today or yesterday, and all in the same polarity set.
 */
export function detectStreak(entries: MoodEntry[]): StreakKind {
  if (entries.length < 3) return null;
  // Deduplicate by day, keep most recent per day
  const byDay = new Map<string, MoodEntry>();
  for (const e of entries) if (!byDay.has(e.day)) byDay.set(e.day, e);
  const sorted = [...byDay.values()].sort((a, b) => (a.day < b.day ? 1 : -1));
  const last3 = sorted.slice(0, 3);
  if (last3.length < 3) return null;

  // Must be consecutive days
  for (let i = 0; i < 2; i++) {
    const d1 = new Date(last3[i].day + "T00:00:00");
    const d2 = new Date(last3[i + 1].day + "T00:00:00");
    const diff = Math.round((d1.getTime() - d2.getTime()) / 86400000);
    if (diff !== 1) return null;
  }

  const moods = last3.map((e) => e.mood);
  if (moods.every((m) => NEGATIVE.has(m))) return "negative";
  if (moods.every((m) => POSITIVE.has(m))) return "positive";
  return null;
}
