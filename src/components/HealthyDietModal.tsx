import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Apple } from "lucide-react";

export function HealthyDietModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-soft">
        <div className="flex items-center gap-2 mb-3">
          <Apple className="h-5 w-5 text-mint-foreground" />
          <h2 className="font-display text-lg">Dieta Saludable</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Descubrí cómo la alimentación transforma tu bienestar día a día.
        </p>
        <Button
          onClick={() => setOpen(true)}
          className="w-full rounded-2xl bg-mint hover:bg-mint/90 text-mint-foreground font-medium"
        >
          Ventajas de una Dieta Saludable
        </Button>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] p-0 overflow-hidden">
          <div className="flex flex-col max-h-[85vh]">
            <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
              <DialogTitle className="font-display text-xl">
                Ventajas de una Dieta Saludable
              </DialogTitle>
            </DialogHeader>

            <div className="px-6 pb-6 overflow-y-auto">
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                La correlación entre una alimentación sana y una vida tranquila y saludable es profunda y multidimensional, abarcando desde la energía física hasta el equilibrio emocional.
              </p>

              <ul className="list-disc list-outside pl-5 space-y-3 text-sm text-muted-foreground leading-relaxed mb-6">
                <li>
                  <strong className="text-foreground">Energía y bienestar mental:</strong> El consumo de alimentos saludables incrementa los niveles de energía y la productividad, mejorando significativamente el estado de ánimo y la felicidad general. Por el contrario, el exceso de azúcares y alimentos ultraprocesados afecta negativamente la concentración y el rendimiento.
                </li>
                <li>
                  <strong className="text-foreground">Prevención de enfermedades:</strong> Una dieta equilibrada actúa como una barrera contra enfermedades crónicas no transmisibles como la obesidad, la diabetes tipo 2 y la hipertensión, las cuales son consecuencias directas de sistemas alimentarios basados en productos procesados altos en sodio, grasas y azúcares.
                </li>
                <li>
                  <strong className="text-foreground">Equilibrio emocional y manejo del estrés:</strong> Una vida tranquila requiere un enfoque integral donde la nutrición se complementa con la actividad física y la salud emocional. Mantenerse activo y comer con conciencia ayuda a regular la glucosa en sangre, reduce el estrés y disminuye la ansiedad.
                </li>
                <li>
                  <strong className="text-foreground">Relación sana con la comida:</strong> Fomentar una relación positiva con los alimentos, basada en la moderación y la conciencia en lugar de la restricción o la culpa, es clave para evitar la angustia emocional y disfrutar plenamente de la vida.
                </li>
                <li>
                  <strong className="text-foreground">Inversión a futuro:</strong> Adquirir hábitos alimentarios conscientes desde temprana edad no solo proporciona los nutrientes necesarios para el desarrollo, sino que es una inversión en la salud futura, enseñando a las personas a realizar elecciones que les beneficiarán durante toda su vida.
                </li>
              </ul>

              <div className="rounded-xl overflow-hidden bg-black/5">
                <iframe
                  src="https://drive.google.com/file/d/1Rd87GT9aVuzW6Q_Ho54pysWhEiLPg2FA/preview"
                  width="100%"
                  height="250px"
                  style={{ border: "none", borderRadius: "8px" }}
                  allowFullScreen
                  title="Ventajas de una Dieta Saludable"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
