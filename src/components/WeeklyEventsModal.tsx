import { useMemo } from "react";
import { X, Calendar, MapPin } from "lucide-react";
import type { EventItem } from "@/lib/events";
import { setState } from "@/lib/app-store";
import { useSound } from "@/lib/sound";

const EXCLUDED = new Set(["permanente", "fijo", "recurrente"]);

function startOfWeek(d: Date) {
  // Monday as start of week
  const day = d.getDay(); // 0=Sun..6=Sat
  const diff = (day + 6) % 7;
  const s = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  s.setDate(s.getDate() - diff);
  return s;
}

export function filterWeeklyEvents(list: EventItem[], now = new Date()): EventItem[] {
  const ws = startOfWeek(now);
  const we = new Date(ws);
  we.setDate(we.getDate() + 7);
  return list.filter((e) => {
    if (e.recurring) return false;
    const cat = (e.category || "").toLowerCase();
    if (EXCLUDED.has(cat)) return false;
    if (!e.start) return false;
    const s = new Date(e.start + "T00:00:00");
    const en = new Date((e.end ?? e.start) + "T23:59:59");
    return en >= ws && s < we;
  });
}

function illustrationFor(e: EventItem) {
  // Stable seeded illustration per event id
  return `https://picsum.photos/seed/${encodeURIComponent(e.id)}/600/300`;
}

export function WeeklyEventsModal({
  events,
  onClose,
}: {
  events: EventItem[];
  onClose: () => void;
}) {
  const sound = useSound();
  const today = new Date().toISOString().slice(0, 10);
  const weekly = useMemo(() => filterWeeklyEvents(events), [events]);

  function close() {
    sound("soft");
    setState({ lastExploraPopupDate: today });
    onClose();
  }

  function dontShowAgain() {
    sound("tap");
    setState({ enableExploraPopups: false, lastExploraPopupDate: today });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-card shadow-soft flex flex-col"
        style={{ maxHeight: "80vh" }}
      >
        <div className="flex items-start justify-between p-5 pb-3 border-b border-border">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Esta semana</div>
            <h2 className="font-display text-xl leading-tight mt-0.5">Eventos en Buenos Aires</h2>
          </div>
          <button
            onClick={close}
            aria-label="Cerrar"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {weekly.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No hay eventos especiales esta semana. Disfrutá la calma 🌿
            </p>
          ) : (
            weekly.map((e) => (
              <article
                key={e.id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
              >
                <img
                  src={illustrationFor(e)}
                  alt=""
                  loading="lazy"
                  className="h-32 w-full object-cover"
                />
                <div className="p-3">
                  <h3 className="font-display text-base leading-tight">{e.title}</h3>
                  <p className="mt-1 text-xs text-foreground/80 flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" /> {e.date}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" /> {e.venue}
                  </p>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="p-4 border-t border-border">
          <button
            onClick={dontShowAgain}
            className="w-full rounded-full bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground hover:bg-muted transition"
          >
            No volver a mostrar
          </button>
        </div>
      </div>
    </div>
  );
}
