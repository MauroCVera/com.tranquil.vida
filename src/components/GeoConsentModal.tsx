import { MapPin, ShieldCheck, X } from "lucide-react";

export function GeoConsentModal({
  onAccept,
  onClose,
}: {
  onAccept: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-card border border-border p-5 shadow-soft animate-in slide-in-from-bottom-4"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint text-mint-foreground">
            <MapPin className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-lg leading-tight">Usar tu ubicación</h2>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Privacidad ante todo
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-4 text-sm text-foreground/90 leading-relaxed">
          La información del GPS, Celular y Ubicación son solo usadas para
          recomendar actividades cercanas y nunca tienen el objetivo de tracking
          u otra tarea más que la sugerencia de estos.
        </p>

        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-full bg-secondary px-4 py-3 text-sm text-secondary-foreground hover:bg-muted"
          >
            Ahora no
          </button>
          <button
            onClick={onAccept}
            className="flex-1 rounded-full bg-primary px-4 py-3 text-sm text-primary-foreground hover:opacity-90"
          >
            Permitir
          </button>
        </div>
      </div>
    </div>
  );
}
