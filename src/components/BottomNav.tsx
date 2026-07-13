import { Link, useLocation } from "@tanstack/react-router";
import { Sun, Layers, Sparkles, MapPin } from "lucide-react";
import { useSound } from "@/lib/sound";

const tabs = [
  { to: "/", label: "Mi Día", icon: Sun },
  { to: "/habitos", label: "Hábitos", icon: Layers },
  { to: "/tecnicas", label: "Técnicas", icon: Sparkles },
  { to: "/explora", label: "Explora BA", icon: MapPin },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  const sound = useSound();
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-4 pb-4 pt-2">
      <div className="flex items-center justify-around rounded-3xl border border-border bg-card/90 px-2 py-2 backdrop-blur shadow-soft">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = pathname === t.to;
          return (
            <Link
              key={t.to}
              to={t.to}
              onClick={() => { if (!active) sound("tap"); }}
              className="flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-2 py-1.5 transition-colors"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-2xl transition-all ${
                  active ? "bg-mint text-mint-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 1.8} />
              </span>
              <span className={`text-[10px] ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {t.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
