import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { userData } from "@/lib/user-data";
import { aggregate, RatingChart } from "./RatingChart";
import { useAppState } from "@/lib/app-store";

export type SummaryRange = "weekly" | "monthly" | "all";

const TITLES: Record<SummaryRange, string> = {
  weekly: "Resumen Semanal",
  monthly: "Resumen Mensual",
  all: "Resumen desde el principio",
};

function rangeStart(range: SummaryRange, summaryDay: "sunday" | "monday"): string | null {
  if (range === "all") return null;
  const now = new Date();
  if (range === "monthly") {
    const d = new Date(now.getFullYear(), now.getMonth(), 1);
    return d.toISOString().slice(0, 10);
  }
  // weekly: go back to the most recent summaryDay
  const target = summaryDay === "sunday" ? 0 : 1;
  const d = new Date(now);
  const diff = (d.getDay() - target + 7) % 7;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export function SummaryModal({
  range,
  onClose,
}: {
  range: SummaryRange;
  onClose: () => void;
}) {
  const { session } = useAuth();
  const s = useAppState();
  const [loading, setLoading] = useState(true);
  const [agg, setAgg] = useState({ total: 0, counts: {} as Record<string, number> });

  useEffect(() => {
    if (!session?.user.id) return;
    setLoading(true);
    const start = rangeStart(range, s.summaryDay);
    userData.getRatedGoalsSince(session.user.id, start).then((rows) => {
      setAgg(aggregate(rows));
      setLoading(false);
    });
  }, [range, session?.user.id, s.summaryDay]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-background p-4 shadow-soft animate-in slide-in-from-bottom-4 m-0 sm:m-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl">{TITLES[range]}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground p-4">Cargando…</p>
        ) : (
          <RatingChart data={agg} />
        )}
      </div>
    </div>
  );
}
