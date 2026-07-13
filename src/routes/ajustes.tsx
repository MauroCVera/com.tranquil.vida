import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { setState, useAppState } from "@/lib/app-store";
import { playSound, useSound } from "@/lib/sound";
import { useAuth, signOut } from "@/lib/use-auth";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Moon, Volume2, Sparkles, ChevronLeft, Heart, LogOut, User, CalendarRange, MessageSquare } from "lucide-react";
import { PremiumModal } from "@/components/PremiumModal";

export const Route = createFileRoute("/ajustes")({
  head: () => ({
    meta: [
      { title: "Ajustes — Vida Tranquila" },
      { name: "description", content: "Personalizá tu experiencia y gestioná Premium." },
    ],
  }),
  component: Ajustes,
});

function Ajustes() {
  const s = useAppState();
  const sound = useSound();
  const { session } = useAuth();
  const [open, setOpen] = useState(false);
  const displayName =
    (session?.user.user_metadata?.username as string | undefined) ??
    (session?.user.user_metadata?.full_name as string | undefined) ??
    session?.user.email ??
    "Invitado";

  return (
    <AppShell title="Ajustes" subtitle="Hacé tuya la experiencia">
      <Link to="/" className="-mt-2 mb-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-3.5 w-3.5" /> Volver
      </Link>

      {/* Cuenta */}
      <div className="mb-4 flex items-center gap-3 rounded-3xl border border-border bg-card p-4 shadow-card">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
          <User className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{displayName}</div>
          <div className="text-xs text-muted-foreground truncate">{session?.user.email}</div>
        </div>
        <Button
          onClick={() => { sound("tap"); void signOut(); }}
          variant="ghost"
          className="h-9 rounded-full text-xs"
        >
          <LogOut className="h-3.5 w-3.5 mr-1" /> Salir
        </Button>
      </div>


      {/* Premium CTA */}
      {!s.isPremium ? (
        <button
          onClick={() => { sound("tap"); setOpen(true); }}
          className="w-full rounded-3xl bg-gradient-premium p-5 text-left text-premium-foreground shadow-soft transition hover:opacity-95"
        >
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider opacity-90">
            <Sparkles className="h-3.5 w-3.5" /> Vida Tranquila Premium
          </div>
          <p className="mt-2 font-display text-2xl leading-tight">Actualizar a Premium</p>
          <p className="mt-1 text-sm opacity-90">Más objetivos, hábitos ilimitados, técnicas y Explora BA completo.</p>
          <span className="mt-4 inline-block rounded-full bg-card/30 px-3 py-1 text-xs">$5000 ARS/mes</span>
        </button>
      ) : (
        <div className="rounded-3xl bg-mint p-5 text-mint-foreground shadow-soft">
          <div className="flex items-center gap-2 text-xs">
            <Heart className="h-4 w-4" /> Sos Premium · gracias por apoyar la calma
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="mt-3 h-9 rounded-full bg-card text-foreground hover:bg-card/90"
          >
            Gestionar suscripción
          </Button>
        </div>
      )}

      {/* Preferences */}
      <section className="mt-6 rounded-3xl bg-card border border-border shadow-card divide-y divide-border">
        <Row
          icon={<Moon className="h-4 w-4" />}
          title="Tema oscuro"
          subtitle="Una vista más suave para la noche"
          control={
            <Switch checked={s.theme === "dark"} onCheckedChange={(v) => { playSound("toggle"); setState({ theme: v ? "dark" : "light" }); }} />
          }
        />
        <Row
          icon={<Volume2 className="h-4 w-4" />}
          title="Sonidos"
          subtitle="Pequeñas confirmaciones audibles"
          control={<Switch checked={s.sound} onCheckedChange={(v) => { setState({ sound: v }); if (v) playSound("toggle"); }} />}
        />
        <Row
          icon={<Bell className="h-4 w-4" />}
          title="Notificaciones del servidor"
          subtitle="Recordatorios diarios y novedades"
          control={
            <Switch
              checked={s.notifications}
              onCheckedChange={(v) => { playSound("toggle"); setState({ notifications: v }); }}
            />
          }
        />
        <Row
          icon={<CalendarRange className="h-4 w-4" />}
          title="Día de Resumen"
          subtitle={s.summaryDay === "sunday" ? "Domingo · cierra la semana" : "Lunes · arranca la semana"}
          control={
            <div className="inline-flex rounded-full bg-secondary p-0.5 text-[11px]">
              <button
                onClick={() => { playSound("toggle"); setState({ summaryDay: "sunday" }); }}
                className={`rounded-full px-3 py-1 transition ${s.summaryDay === "sunday" ? "bg-card shadow-card" : "text-muted-foreground"}`}
              >
                Domingo
              </button>
              <button
                onClick={() => { playSound("toggle"); setState({ summaryDay: "monday" }); }}
                className={`rounded-full px-3 py-1 transition ${s.summaryDay === "monday" ? "bg-card shadow-card" : "text-muted-foreground"}`}
              >
                Lunes
              </button>
            </div>
          }
        />
        <Row
          icon={<MessageSquare className="h-4 w-4" />}
          title="Mostrar Popups/Mensajes Emergentes"
          subtitle="Eventos de la semana en Explora BA"
          control={
            <Switch
              checked={s.enableExploraPopups}
              onCheckedChange={(v) => { playSound("toggle"); setState({ enableExploraPopups: v }); }}
            />
          }
        />
      </section>

      <p className="mt-6 text-center text-[11px] text-muted-foreground">
        Vida Tranquila · v1.0 · Hecha en Buenos Aires
      </p>

      <PremiumModal open={open} onOpenChange={setOpen} />
    </AppShell>
  );
}

function Row({
  icon,
  title,
  subtitle,
  control,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
      {control}
    </div>
  );
}
