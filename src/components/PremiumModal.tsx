import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { Check, Sparkles } from "lucide-react";
import { useAppState } from "@/lib/app-store";
import { playSound } from "@/lib/sound";

const benefits = [
  "Hasta 5 objetivos diarios",
  "Hábitos ilimitados por día",
  "Acceso completo a Técnicas avanzadas",
  "Mapa Explora BA con lugares relajantes",
  "Sin anuncios, solo calma",
];

export function PremiumModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const s = useAppState();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl border-0 bg-card p-0 overflow-hidden">
        <div className="bg-gradient-premium p-6 text-premium-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-medium uppercase tracking-wider">Vida Tranquila Premium</span>
          </div>
          <h2 className="mt-3 font-display text-3xl">Más calma, sin límites.</h2>
          <p className="mt-1 text-sm opacity-90">Desbloqueá toda la experiencia.</p>
        </div>
        <div className="p-6">
          <DialogHeader className="sr-only">
            <DialogTitle>Premium</DialogTitle>
            <DialogDescription>Beneficios premium</DialogDescription>
          </DialogHeader>
          <ul className="space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-mint">
                  <Check className="h-3 w-3 text-mint-foreground" />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-2xl bg-secondary p-4 text-center">
            <div className="font-display text-3xl">$5000 <span className="text-base text-muted-foreground">ARS/mes</span></div>
            <div className="text-xs text-muted-foreground mt-1">Cancelá cuando quieras</div>
          </div>
          <a
            href="https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=a793953d430c484193988e172bc8eb7c"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playSound("soft")}
            className="mt-5 flex h-12 w-full items-center justify-center rounded-full font-sans font-semibold text-white shadow-soft transition hover:opacity-90"
            style={{ backgroundColor: "#009EE3", fontFamily: "Inter, system-ui, sans-serif" }}
          >
            {s.isPremium ? "Gestionar suscripción" : "Suscribirme con Mercado Pago"}
          </a>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Pago seguro vía Mercado Pago
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
