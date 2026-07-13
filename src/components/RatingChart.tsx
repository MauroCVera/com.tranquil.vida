import { RATING_OPTIONS, ratingTone } from "./RatePastGoals";

export type RatingAggregate = {
  total: number;
  counts: Record<string, number>;
};

export function aggregate(rows: { rating: string | null }[]): RatingAggregate {
  const counts: Record<string, number> = {};
  for (const r of RATING_OPTIONS) counts[r] = 0;
  let total = 0;
  for (const row of rows) {
    if (!row.rating) continue;
    if (counts[row.rating] === undefined) counts[row.rating] = 0;
    counts[row.rating] += 1;
    total += 1;
  }
  return { total, counts };
}

export function RatingChart({ data, title }: { data: RatingAggregate; title?: string }) {
  const { total, counts } = data;
  const max = Math.max(1, ...Object.values(counts));
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
      {title && <h3 className="font-display text-lg mb-1">{title}</h3>}
      <p className="text-xs text-muted-foreground mb-4">
        {total === 0 ? "Sin objetivos calificados aún." : `${total} objetivos calificados`}
      </p>
      <div className="space-y-3">
        {RATING_OPTIONS.map((r) => {
          const c = counts[r] ?? 0;
          const pct = total === 0 ? 0 : Math.round((c / total) * 100);
          const wPct = total === 0 ? 0 : Math.round((c / max) * 100);
          return (
            <div key={r}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${ratingTone(r)}`}>
                  {r}
                </span>
                <span className="text-muted-foreground tabular-nums">
                  {c} · {pct}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
                  style={{ width: `${wPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
