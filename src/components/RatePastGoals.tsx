import { useState } from "react";
import { userData } from "@/lib/user-data";

export const RATING_OPTIONS = [
  "Logrado",
  "Casi",
  "Me falto poco",
  "Más o menos",
  "Meh",
  "Incumplido",
] as const;
export type Rating = (typeof RATING_OPTIONS)[number];

export function ratingTone(r?: string | null) {
  switch (r) {
    case "Logrado":
      return "bg-mint text-mint-foreground";
    case "Casi":
    case "Me falto poco":
      return "bg-primary/15 text-primary";
    case "Más o menos":
    case "Meh":
      return "bg-secondary text-foreground";
    case "Incumplido":
      return "bg-destructive/15 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
}

type PastGoal = {
  id: string;
  text: string;
  day: string;
  rating: string | null;
  created_at?: string | null;
};

function formatStamp(g: PastGoal) {
  const dayStr = new Date(g.day + "T00:00:00").toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  if (!g.created_at) return `${dayStr} · venció 23:59`;
  const t = new Date(g.created_at).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dayStr} · creado ${t} · venció 23:59`;
}

/**
 * Mandatory full-screen modal: the user MUST rate every expired objective
 * before continuing. No backdrop click, no escape.
 */
export function RatePastGoalsModal({
  goals,
  onDone,
}: {
  goals: PastGoal[];
  onDone: () => void;
}) {
  const [pending, setPending] = useState<PastGoal[]>(goals);
  const [saving, setSaving] = useState<string | null>(null);

  if (pending.length === 0) return null;

  async function pick(g: PastGoal, r: Rating) {
    setSaving(g.id);
    await userData.rateGoal(g.id, r);
    const next = pending.filter((x) => x.id !== g.id);
    setPending(next);
    setSaving(null);
    if (next.length === 0) onDone();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 backdrop-blur-md p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">¿Cómo te fue con esto?</h2>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] tabular-nums">
            {pending.length} pendientes
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Tus objetivos vencidos (23:59). Calificá cada uno para continuar.
        </p>

        <div className="mt-4 space-y-4">
          {pending.map((g) => (
            <div key={g.id} className="rounded-2xl bg-secondary/60 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {formatStamp(g)}
              </div>
              <div className="text-sm font-medium mt-1">{g.text}</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {RATING_OPTIONS.map((r) => (
                  <button
                    key={r}
                    disabled={saving === g.id}
                    onClick={() => pick(g, r)}
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs hover:bg-muted transition disabled:opacity-50"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Backward-compat inline section (still used nowhere now). */
export function RatePastGoals(props: { goals: PastGoal[]; onDone: () => void }) {
  return <RatePastGoalsModal {...props} />;
}
