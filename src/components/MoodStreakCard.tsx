import { useState } from "react";
import { X, Share2, Sparkles, HeartHandshake } from "lucide-react";
import type { StreakKind } from "@/lib/mood-streak";
import { useSound } from "@/lib/sound";
import { toast } from "sonner";

const SHARE_TEXT =
  "Llevo una racha de días excelentes usando Vida Tranquila. ¡Encontrá tu calma también!";

export function MoodStreakCard({ kind }: { kind: StreakKind }) {
  const sound = useSound();
  const [dismissed, setDismissed] = useState(false);
  if (!kind || dismissed) return null;

  async function share() {
    sound("tap");
    const data = { title: "Vida Tranquila", text: SHARE_TEXT };
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await (navigator as Navigator).share(data);
        return;
      }
    } catch {
      /* user cancelled or failed — fall through to clipboard */
    }
    try {
      await navigator.clipboard.writeText(SHARE_TEXT);
      toast.success("Mensaje copiado al portapapeles");
    } catch {
      toast.error("No se pudo compartir en este dispositivo");
    }
  }

  const isNegative = kind === "negative";

  return (
    <section
      className={`mt-4 overflow-hidden rounded-3xl border shadow-soft ${
        isNegative
          ? "bg-grapefruit/15 border-grapefruit/30"
          : "bg-mint/20 border-mint/40"
      }`}
    >
      <img
        src={
          isNegative
            ? "https://via.placeholder.com/400x200?text=Uplift+Image"
            : "https://via.placeholder.com/400x200?text=Success+Image"
        }
        alt={isNegative ? "Mensaje de aliento" : "Mensaje de logro"}
        className="h-32 w-full object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-card">
            {isNegative ? (
              <HeartHandshake className="h-4 w-4" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-display text-base font-semibold">
              {isNegative
                ? "Estamos con vos en este momento"
                : "¡Tres días brillando! 🌿"}
            </h3>
            <p className="mt-1 text-sm text-foreground/80">
              {isNegative
                ? "Sentirte así no te define. Probá una respiración corta, escribí una intención pequeña, o salí a caminar 5 minutos. Cada paso suave cuenta."
                : "Llevás una racha hermosa. Mantené el ritmo: hidratación, descanso y un objetivo simple por día sostienen este bienestar."}
            </p>
          </div>
          <button
            onClick={() => {
              sound("soft");
              setDismissed(true);
            }}
            aria-label="Cerrar"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 flex justify-end">
          {isNegative ? (
            <button
              onClick={() => {
                sound("soft");
                setDismissed(true);
              }}
              className="rounded-full bg-card px-4 py-2 text-sm font-medium shadow-card"
            >
              Cerrar
            </button>
          ) : (
            <button
              onClick={share}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-card hover:bg-primary/90"
            >
              <Share2 className="h-4 w-4" />
              Compartir mi logro
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
