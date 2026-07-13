import { Link } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { useAppState } from "@/lib/app-store";

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const s = useAppState();
  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col pb-28">
        <header className="px-6 pt-10 pb-4 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Vida Tranquila</p>
            <h1 className="mt-1 font-display text-3xl leading-tight">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <Link
            to="/ajustes"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition"
            aria-label="Ajustes"
          >
            <SettingsIcon className="h-4 w-4" />
          </Link>
        </header>
        {s.isPremium && (
          <div className="mx-6 mb-3 flex items-center gap-2 rounded-full bg-gradient-premium px-3 py-1 text-[11px] text-premium-foreground w-fit">
            ✦ Premium activo
          </div>
        )}
        <main className="flex-1 px-6">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
