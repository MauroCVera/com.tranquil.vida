import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { setState, useAppState } from "@/lib/app-store";
import { useSound } from "@/lib/sound";
import { useAuth } from "@/lib/use-auth";
import { userData } from "@/lib/user-data";
import { events, places, gmapsDirections, upcomingEvents, type EventItem } from "@/lib/events";
import { Lock, MapPin, Sparkles, ExternalLink, Calendar, Search, Heart, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GeoConsentModal } from "@/components/GeoConsentModal";
import { BAMapLeaflet, haversineKm } from "@/components/BAMapLeaflet";
import { WeeklyEventsModal, filterWeeklyEvents } from "@/components/WeeklyEventsModal";

const OBELISCO = { lat: -34.6037, lng: -58.3816 };
const RADIUS_KM = 5;

export const Route = createFileRoute("/explora")({
  head: () => ({
    meta: [
      { title: "Explora BA — Vida Tranquila" },
      { name: "description", content: "Eventos 2026 y lugares relajantes en Buenos Aires, con mapa." },
    ],
  }),
  component: Explora,
});

const tabs = ["Eventos", "Lugares"] as const;


function Explora() {
  const s = useAppState();
  const sound = useSound();
  const { session } = useAuth();
  const userId = session?.user.id;
  const locked = !s.isPremium;
  const [tab, setTab] = useState<(typeof tabs)[number]>("Eventos");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<EventItem | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null);
  const [geoModal, setGeoModal] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [weeklyOpen, setWeeklyOpen] = useState(false);

  // Conditional weekly events popup on mount
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (!s.enableExploraPopups) return;
    if (s.lastExploraPopupDate === today) return;
    if (filterWeeklyEvents(events).length === 0) return;
    setWeeklyOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userId) return;
    userData.getSaved(userId).then((rows) => {
      setSaved(new Set(rows.map((r) => `${r.item_type}:${r.item_id}`)));
    });
  }, [userId]);

  function requestGeo() {
    setGeoModal(false);
    setState({ geoConsent: true });
    if (!("geolocation" in navigator)) {
      setGeoError("Geolocalización no disponible. Usando Obelisco como referencia.");
      toast.error("Geolocalización no disponible. Usando Obelisco como referencia.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoError(null);
        sound("success");
      },
      (err) => {
        const msg = err.code === err.PERMISSION_DENIED
          ? "Permiso denegado. Mostrando Obelisco como referencia."
          : err.message || "No pudimos obtener tu ubicación.";
        setGeoError(msg);
        toast.error(msg);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 },
    );
  }

  // Auto-request on first mount
  useEffect(() => {
    if (geo) return;
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        const msg = err.code === err.PERMISSION_DENIED
          ? "Permiso de ubicación denegado. Mostrando Obelisco como referencia."
          : "No pudimos obtener tu ubicación. Usando Obelisco.";
        toast.error(msg);
        setGeoError(msg);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  async function toggleSave(itemId: string, itemType: "event" | "place") {
    if (!userId) return;
    const key = `${itemType}:${itemId}`;
    const on = !saved.has(key);
    sound(on ? "success" : "soft");
    setSaved((prev) => {
      const n = new Set(prev);
      if (on) n.add(key);
      else n.delete(key);
      return n;
    });
    await userData.toggleSaved(userId, itemId, itemType, on);
  }

  const upcoming = useMemo(() => upcomingEvents(events, new Date(), 15), []);
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    const base = t
      ? upcoming.filter((e) =>
          [e.title, e.venue, e.category, e.month].some((s) => s.toLowerCase().includes(t)),
        )
      : upcoming;
    if (geo) {
      return [...base].sort((a, b) => haversineKm(geo, a) - haversineKm(geo, b));
    }
    return base;
  }, [q, upcoming, geo]);

  const visibleEvents = locked ? filtered.slice(0, 6) : filtered;

  return (
    <AppShell title="Explora BA" subtitle="Próximos 15 días y rincones tranquilos">
      {locked && (
        <Link
          to="/ajustes"
          onClick={() => sound("tap")}
          className="block mb-4 rounded-2xl bg-gradient-premium p-4 text-premium-foreground shadow-soft"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card/30">
              <Lock className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider opacity-90">
                <Sparkles className="h-3 w-3" /> Premium
              </div>
              <p className="text-sm">Desbloqueá la agenda 2026 completa de Buenos Aires.</p>
            </div>
          </div>
        </Link>
      )}

      {/* Stylised map with event pins */}
      <div className="relative h-72 overflow-hidden rounded-3xl bg-gradient-calm shadow-soft z-0">
        <BAMapLeaflet
          center={geo ?? OBELISCO}
          events={upcoming}
          radiusMeters={RADIUS_KM * 1000}
          onPick={(e) => { sound("tap"); setActive(e); }}
        />
        <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex items-center gap-2 rounded-full bg-card/80 px-3 py-1.5 text-xs backdrop-blur z-[400]">
          <MapPin className="h-3.5 w-3.5 text-grapefruit-foreground" />
          {geo ? "Tu ubicación" : "Obelisco (referencia)"} · radio {RADIUS_KM} km
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 inline-flex rounded-full bg-secondary p-1 text-xs">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => { sound("tap"); setTab(t); }}
            className={`rounded-full px-4 py-1.5 transition ${
              tab === t ? "bg-card text-foreground shadow-card" : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Eventos" ? (
        <>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar artista, lugar, mes…"
              className="pl-9 rounded-full bg-card border-border h-10"
            />
          </div>

          <button
            onClick={() => { sound("tap"); setGeoModal(true); }}
            className={`mt-3 w-full flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs transition ${
              geo
                ? "bg-mint text-mint-foreground"
                : "bg-card border border-border hover:bg-secondary"
            }`}
          >
            <Navigation className="h-3.5 w-3.5" />
            {geo ? "Ordenado por cercanía a tu ubicación" : "Sugerir actividades cercanas"}
          </button>
          {geoError && (
            <p className="mt-2 text-[11px] text-destructive">{geoError}</p>
          )}

          <div className="mt-3 space-y-2.5">
            {visibleEvents.map((e) => {
              const isSaved = saved.has(`event:${e.id}`);
              return (
                <div
                  key={e.id}
                  className="relative w-full rounded-2xl bg-card border border-border p-4 shadow-card hover:bg-secondary/50 transition"
                >
                  <button onClick={() => { sound("tap"); setActive(e); }} className="w-full text-left">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl bg-mint text-mint-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="text-[10px] mt-0.5">{e.month.slice(0, 3)}</span>
                      </div>
                      <div className="min-w-0 flex-1 pr-8">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-display text-base leading-tight truncate">{e.title}</h3>
                          <span className="text-[10px] text-muted-foreground shrink-0">{e.category}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          <MapPin className="inline h-3 w-3 mr-1 -mt-0.5" />{e.venue}
                        </p>
                        <p className="text-[11px] text-foreground/70 mt-1">
                          {e.date}
                          {geo && (
                            <span className="ml-2 text-mint-foreground">
                              · a {haversineKm(geo, e).toFixed(1)} km
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => toggleSave(e.id, "event")}
                    aria-label="Guardar"
                    className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-secondary hover:bg-muted"
                  >
                    <Heart className={`h-3.5 w-3.5 ${isSaved ? "fill-grapefruit-foreground text-grapefruit-foreground" : "text-muted-foreground"}`} />
                  </button>
                </div>
              );
            })}

            {locked && filtered.length > visibleEvents.length && (
              <Link
                to="/ajustes"
                onClick={() => sound("tap")}
                className="block rounded-2xl border border-dashed border-border bg-secondary/60 p-4 text-center text-xs text-muted-foreground hover:bg-secondary"
              >
                <Lock className="inline h-3 w-3 mr-1" />
                +{filtered.length - visibleEvents.length} eventos más con Premium
              </Link>
            )}
          </div>
        </>
      ) : (
        <div className="mt-3 space-y-2.5">
          {places.map((p, i) => {
            const blocked = locked && i > 1;
            return (
              <div
                key={p.name}
                className="relative flex items-center gap-3 rounded-2xl bg-card border border-border p-4 shadow-card"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-2xl">
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-base truncate">{p.name}</h3>
                    <span className="text-[11px] text-muted-foreground">{p.neighborhood}</span>
                  </div>
                  <p className={`text-xs text-muted-foreground mt-0.5 ${blocked ? "blur-[3px] select-none" : ""}`}>
                    {p.description}
                  </p>
                </div>
                {blocked ? (
                  <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-secondary">
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  </div>
                ) : (
                  <a
                    href={gmapsDirections(p.lat, p.lng, `${p.name}, Buenos Aires`)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => sound("click")}
                    className="shrink-0 inline-flex items-center gap-1 rounded-full bg-mint px-3 py-1.5 text-[11px] text-mint-foreground"
                  >
                    Ir <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}

      {active && <EventSheet event={active} onClose={() => { sound("soft"); setActive(null); }} />}
      {geoModal && (
        <GeoConsentModal onAccept={requestGeo} onClose={() => setGeoModal(false)} />
      )}
      {weeklyOpen && (
        <WeeklyEventsModal events={events} onClose={() => setWeeklyOpen(false)} />
      )}
    </AppShell>
  );
}


function EventSheet({ event, onClose }: { event: EventItem; onClose: () => void }) {
  const sound = useSound();
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl bg-card p-6 shadow-soft animate-in slide-in-from-bottom-4"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          <Calendar className="h-3 w-3" /> {event.month} · {event.category}
        </div>
        <h2 className="mt-1 font-display text-2xl leading-tight">{event.title}</h2>
        <p className="mt-1 text-sm text-foreground/80">{event.date}</p>
        <div className="mt-4 rounded-2xl bg-secondary p-4">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 mt-0.5 text-grapefruit-foreground" />
            <span>{event.venue}</span>
          </div>
          {event.description && (
            <p className="mt-2 text-xs text-muted-foreground">{event.description}</p>
          )}
        </div>

        <div className="mt-5 flex gap-2">
          <a
            href={gmapsDirections(event.lat, event.lng, event.venue)}
            target="_blank"
            rel="noreferrer"
            onClick={() => sound("success")}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-mint px-4 py-3 text-sm text-mint-foreground hover:opacity-90"
          >
            Cómo llegar <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={onClose}
            className="rounded-full bg-secondary px-4 py-3 text-sm text-secondary-foreground hover:bg-muted"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
