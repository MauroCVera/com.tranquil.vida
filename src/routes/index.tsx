import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAppState } from "@/lib/app-store";
import { useSound } from "@/lib/sound";
import { useAuth } from "@/lib/use-auth";
import { userData } from "@/lib/user-data";
import { Plus, X, Lock, Check, BarChart3, CalendarDays, Infinity as InfinityIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WeatherWidget } from "@/components/WeatherWidget";
import { RatePastGoalsModal, ratingTone } from "@/components/RatePastGoals";
import { SummaryModal, type SummaryRange } from "@/components/SummaryModal";
import { detectStreak, type StreakKind, type MoodEntry } from "@/lib/mood-streak";
import { MoodStreakCard } from "@/components/MoodStreakCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mi Día — Vida Tranquila" },
      { name: "description", content: "Registrá tu ánimo y tus objetivos del día." },
    ],
  }),
  component: MiDia,
});

type Mood = "great" | "good" | "meh" | "low" | "bad";
const moods: { id: Mood; label: string; emoji: string }[] = [
  { id: "great", label: "Pleno", emoji: "🌿" },
  { id: "good", label: "Bien", emoji: "🙂" },
  { id: "meh", label: "Neutro", emoji: "😐" },
  { id: "low", label: "Bajón", emoji: "🌧️" },
  { id: "bad", label: "Mal", emoji: "💔" },
];

type Goal = { id: string; text: string; done: boolean; position: number };
type PastGoal = {
  id: string;
  text: string;
  day: string;
  rating: string | null;
  created_at?: string | null;
  done?: boolean;
};

function MiDia() {
  const s = useAppState();
  const sound = useSound();
  const { session } = useAuth();
  const userId = session?.user.id;
  const [mood, setMoodState] = useState<string | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [unrated, setUnrated] = useState<PastGoal[]>([]);
  const [history, setHistory] = useState<PastGoal[]>([]);
  const [summary, setSummary] = useState<SummaryRange | null>(null);
  const [streak, setStreak] = useState<StreakKind>(null);
  const limit = s.isPremium ? 5 : 3;
  const today = new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });

  async function refreshHistory(uid: string) {
    const h = await userData.getHistory(uid, 7);
    setHistory(h as PastGoal[]);
  }

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    Promise.all([
      userData.getToday(userId),
      userData.getUnratedPastGoals(userId),
      userData.getHistory(userId, 7),
      userData.getRecentMoods(userId, 7),
    ]).then(([d, u, h, m]) => {
      setMoodState(d.mood);
      setGoals(d.goals as Goal[]);
      setUnrated(u as PastGoal[]);
      setHistory(h as PastGoal[]);
      setStreak(detectStreak(m as MoodEntry[]));
      setLoading(false);
    });
  }, [userId]);

  async function pickMood(m: Mood) {
    if (!userId) return;
    sound("tap");
    setMoodState(m);
    await userData.setMood(userId, m);
    const recent = await userData.getRecentMoods(userId, 7);
    setStreak(detectStreak(recent as MoodEntry[]));
  }

  async function addGoal() {
    const t = draft.trim();
    if (!t || !userId || goals.length >= limit) return;
    sound("success");
    setDraft("");
    const g = await userData.addGoal(userId, t, goals.length);
    setGoals((prev) => [...prev, g as Goal]);
  }

  async function removeGoal(id: string) {
    sound("soft");
    setGoals((prev) => prev.filter((g) => g.id !== id));
    await userData.removeGoal(id);
  }

  async function toggleGoal(g: Goal) {
    sound("tap");
    const done = !g.done;
    setGoals((prev) => prev.map((x) => (x.id === g.id ? { ...x, done } : x)));
    await userData.toggleGoal(g.id, done);
  }

  // Show all 3 summary buttons; history-derived data drives the chart.
  return (
    <AppShell title="Hoy" subtitle={today.charAt(0).toUpperCase() + today.slice(1)}>
      <div className="mt-2">
        <WeatherWidget />
      </div>

      <section className="mt-4 rounded-3xl bg-gradient-calm p-5 shadow-soft">
        <h2 className="font-display text-lg">¿Cómo te sentís?</h2>
        <div className="mt-4 flex justify-between">
          {moods.map((m) => (
            <button
              key={m.id}
              onClick={() => pickMood(m.id)}
              className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 transition-all ${
                mood === m.id ? "bg-card scale-110 shadow-card" : "opacity-70 hover:opacity-100"
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-[10px] text-foreground/80">{m.label}</span>
            </button>
          ))}
        </div>
      </section>

      <MoodStreakCard kind={streak} />



      <section className="mt-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl">Objetivos</h2>
          <span className="text-xs text-muted-foreground">
            {goals.length}/{limit}
            {!s.isPremium && " · gratis"}
          </span>
        </div>

        <div className="mt-3 space-y-2">
          {loading ? (
            <p className="text-xs text-muted-foreground px-2">Cargando…</p>
          ) : (
            <>
              {goals.map((g) => (
                <div key={g.id} className="flex items-center gap-3 rounded-2xl bg-card border border-border px-4 py-3 shadow-card">
                  <button
                    onClick={() => toggleGoal(g)}
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      g.done ? "bg-mint border-mint text-mint-foreground" : "border-border"
                    }`}
                  >
                    {g.done && <Check className="h-3 w-3" />}
                  </button>
                  <span className={`flex-1 text-sm ${g.done ? "line-through text-muted-foreground" : ""}`}>{g.text}</span>
                  <button onClick={() => removeGoal(g.id)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {goals.length === 0 && (
                <p className="rounded-2xl bg-secondary px-4 py-6 text-center text-sm text-muted-foreground">
                  Empezá con una intención simple para hoy.
                </p>
              )}
            </>
          )}
        </div>

        {!loading && goals.length < limit ? (
          <div className="mt-3 flex gap-2">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addGoal()}
              placeholder="Caminar 20 minutos…"
              className="rounded-full bg-card border-border h-11"
            />
            <Button onClick={addGoal} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-11 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ) : !s.isPremium && !loading ? (
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-dashed border-border bg-secondary/60 px-4 py-3 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Llegaste al límite gratuito. Premium permite 5 objetivos.
          </div>
        ) : null}
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl">Últimos 7 días</h2>
        <p className="text-xs text-muted-foreground mt-1">Historial de objetivos</p>
        <div className="mt-3 max-h-80 overflow-y-auto space-y-2 pr-1">
          {history.length === 0 ? (
            <p className="rounded-2xl bg-secondary px-4 py-6 text-center text-sm text-muted-foreground">
              Todavía no hay historial.
            </p>
          ) : (
            history.map((g) => (
              <div
                key={g.id}
                className="flex items-start gap-3 rounded-2xl bg-card border border-border px-4 py-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {new Date(g.day + "T00:00:00").toLocaleDateString("es-AR", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                    {g.created_at && (
                      <span className="ml-1">
                        ·{" "}
                        {new Date(g.created_at).toLocaleTimeString("es-AR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                  <div className="text-sm mt-0.5 break-words">{g.text}</div>
                </div>
                {g.rating ? (
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${ratingTone(g.rating)}`}>
                    {g.rating}
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full px-2.5 py-1 text-[11px] bg-muted text-muted-foreground">
                    Sin calificar
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-6 mb-6">
        <h2 className="font-display text-lg">Resúmenes</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Visualizá tu progreso por período
        </p>
        <div className="mt-3 grid grid-cols-1 gap-2">
          <SummaryButton
            icon={<BarChart3 className="h-4 w-4" />}
            label="Resumen Semanal"
            onClick={() => {
              sound("tap");
              setSummary("weekly");
            }}
          />
          <SummaryButton
            icon={<CalendarDays className="h-4 w-4" />}
            label="Resumen Mensual"
            onClick={() => {
              sound("tap");
              setSummary("monthly");
            }}
          />
          <SummaryButton
            icon={<InfinityIcon className="h-4 w-4" />}
            label="Resumen desde el principio"
            onClick={() => {
              sound("tap");
              setSummary("all");
            }}
          />
        </div>
      </section>

      {unrated.length > 0 && (
        <RatePastGoalsModal
          goals={unrated}
          onDone={() => {
            setUnrated([]);
            if (userId) refreshHistory(userId);
          }}
        />
      )}

      {summary && <SummaryModal range={summary} onClose={() => setSummary(null)} />}
    </AppShell>
  );
}

function SummaryButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl bg-card border border-border px-4 py-3 text-left shadow-card hover:bg-secondary/50 transition"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
        {icon}
      </div>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <span className="text-xs text-muted-foreground">Ver →</span>
    </button>
  );
}
