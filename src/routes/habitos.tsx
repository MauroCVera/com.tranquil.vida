import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import { Check, X, Lock, RotateCcw } from "lucide-react";
import { HealthyDietModal } from "@/components/HealthyDietModal";
import { useAppState } from "@/lib/app-store";
import { useSound } from "@/lib/sound";
import { useAuth } from "@/lib/use-auth";
import { userData } from "@/lib/user-data";
import { Button } from "@/components/ui/button";
import {
  Breath, Walk, Journal, Water, Eye, Stretch, Focus, Sun, Plate, Book, Phone, Window,
  Tea, Heart, Tree, Cloud, Hand, Music, Bath, Flower, Bed, Bike, Salt, People,
} from "@/components/HabitIllustrations";

export const Route = createFileRoute("/habitos")({
  head: () => ({
    meta: [
      { title: "Hábitos — Vida Tranquila" },
      { name: "description", content: "Descubrí hábitos saludables y elegí cuáles te sirven." },
    ],
  }),
  component: Habitos,
});

type Habit = { t: string; d: string; c: string; Art: ComponentType<{ className?: string }> };

const habits: Habit[] = [
  // Calma
  { t: "Respiración 4-7-8", d: "Inhala 4s, retené 7s, exhala 8s. Tres rondas para activar el parasimpático.", c: "Calma", Art: Breath },
  { t: "Escaneo corporal", d: "Recorré tu cuerpo de pies a cabeza buscando puntos de tensión.", c: "Calma", Art: Heart },
  { t: "Desconexión térmica", d: "Lavá cara y manos con agua fría: corta el sobrepensamiento al instante.", c: "Calma", Art: Water },
  { t: "Pausa auditiva absoluta", d: "5 minutos de silencio o ruido blanco para descansar la corteza prefrontal.", c: "Calma", Art: Cloud },
  { t: "Aromaterapia", d: "Inhalá lavanda o eucalipto: el bulbo olfatorio relaja el sistema límbico.", c: "Calma", Art: Flower },
  { t: "Masaje de sienes", d: "Fricción circular suave 2 min para liberar tensión de la mandíbula.", c: "Calma", Art: Hand },
  { t: "Mirada al horizonte", d: "Mirá lejos por la ventana y relajá los músculos ciliares.", c: "Calma", Art: Window },
  { t: "Relajación muscular progresiva", d: "Tensá y relajá grupos musculares (técnica de Jacobson).", c: "Calma", Art: Stretch },
  { t: "Brain dump escrito", d: "Anotá todo lo que te preocupa sin filtro y liberá memoria de trabajo.", c: "Calma", Art: Journal },
  { t: "Anclaje 5-4-3-2-1", d: "5 cosas que ves, 4 que tocás, 3 que escuchás, 2 que olés, 1 que saboreás.", c: "Calma", Art: Eye },
  { t: "Manta de peso", d: "La presión profunda imita ser sostenido y libera serotonina.", c: "Calma", Art: Bed },
  { t: "Visualización urbana segura", d: "Imaginá recorrer un paisaje arquitectónico tranquilo.", c: "Calma", Art: Window },
  { t: "Respiración diafragmática", d: "Respirá expandiendo el abdomen, no el pecho.", c: "Calma", Art: Breath },
  { t: "Luz cálida nocturna", d: "Bajá la intensidad de luces 1h antes de dormir para preservar melatonina.", c: "Calma", Art: Bed },
  { t: "Ordenar el escritorio en 3'", d: "Orden visual externo = orden interno.", c: "Calma", Art: Window },
  { t: "Estiramiento cervical", d: "Inclinaciones suaves del cuello con respiración para evitar cefaleas.", c: "Calma", Art: Stretch },
  { t: "Lectura de ficción ligera", d: "Sumergite en una narrativa que no sea trabajo.", c: "Calma", Art: Book },
  { t: "Gratitud por tres", d: "Agradecé por tres cosas específicas del día.", c: "Calma", Art: Heart },

  // Cuerpo
  { t: "Caminar sin teléfono", d: "10 minutos prestando atención al entorno.", c: "Cuerpo", Art: Walk },
  { t: "Hidratarse al despertar", d: "Un vaso de agua antes del primer café.", c: "Cuerpo", Art: Water },
  { t: "Estirar la espalda", d: "Cinco posturas suaves al final del día.", c: "Cuerpo", Art: Stretch },
  { t: "Ergonomía consciente", d: "Ajustá la altura del monitor y la silla; ojos al borde superior.", c: "Cuerpo", Art: Focus },
  { t: "Micro-caminatas internas", d: "Levantate cada 45 minutos y dá unos pasos.", c: "Cuerpo", Art: Walk },
  { t: "Regla 20-20-20", d: "Cada 20 min, mirá a 20 pies por 20 segundos.", c: "Ojos", Art: Eye },
  { t: "Caminata post-comida", d: "10–15 minutos después de almorzar estabilizan la glucosa.", c: "Cuerpo", Art: Walk },
  { t: "Masaje podal con pelota", d: "Rodá una pelota bajo el pie para liberar la fascia plantar.", c: "Cuerpo", Art: Hand },
  { t: "Escaleras siempre", d: "Sustituí el ascensor: glúteos, cuádriceps y retorno venoso.", c: "Cuerpo", Art: Bike },
  { t: "Masticación lenta", d: "Masticá cada bocado unas 20 veces.", c: "Cuerpo", Art: Plate },
  { t: "Ducha con final frío", d: "30 segundos de agua fría al final entrenan la circulación.", c: "Cuerpo", Art: Bath },
  { t: "Rotación articular matutina", d: "Círculos suaves con muñecas y tobillos.", c: "Cuerpo", Art: Stretch },
  { t: "Caminar descalzo en casa", d: "Grounding: fortalece los músculos del pie y la propiocepción.", c: "Cuerpo", Art: Hand },
  { t: "Higiene dental completa", d: "Hilo dental todos los días reduce inflamación sistémica.", c: "Cuerpo", Art: Salt },
  { t: "Bicicleta de barrio", d: "20 minutos en bici suave por la ciudad.", c: "Cuerpo", Art: Bike },

  // Energía
  { t: "Sol matutino", d: "5–10 min de luz natural temprano para anclar el ritmo circadiano.", c: "Energía", Art: Sun },
  { t: "Café demorado 90'", d: "Esperá 90–120 min tras despertar para evitar el crash de la tarde.", c: "Energía", Art: Tea },
  { t: "Power nap de 20'", d: "Micro-siesta sin entrar en sueño profundo.", c: "Energía", Art: Bed },
  { t: "Snack estratégico", d: "Un puñado de nueces o almendras para sustento cognitivo.", c: "Energía", Art: Plate },
  { t: "Activación cardio rápida", d: "2 minutos de saltos o sentadillas despejan la mente.", c: "Energía", Art: Bike },
  { t: "Micro-victoria matutina", d: "Hacé la cama o limpiá la mesa al levantarte.", c: "Energía", Art: Sun },
  { t: "Cena ligera y temprana", d: "Terminá de comer 2h antes de dormir.", c: "Sueño", Art: Plate },
  { t: "Ambiente fresco", d: "Bajá un poco la temperatura para mantener alerta y eficiencia.", c: "Energía", Art: Cloud },
  { t: "Sin fatiga de decisión", d: "Preparate la ropa o agenda la noche anterior.", c: "Energía", Art: Focus },
  { t: "Ritual de cierre", d: "Apagá la PC y ordená el escritorio para marcar el fin del trabajo.", c: "Energía", Art: Window },

  // Mente
  { t: "Lectura analógica", d: "10 páginas en papel antes de dormir.", c: "Mente", Art: Book },
  { t: "Monotarea estricta", d: "Una sola cosa por vez para entrar en flujo profundo.", c: "Mente", Art: Focus },
  { t: "Journaling nocturno", d: "5 minutos escribiendo sobre tu día.", c: "Mente", Art: Journal },
  { t: "Bloquear apps distractoras", d: "Eliminá la tentación durante sesiones de estudio.", c: "Foco", Art: Phone },
  { t: "Resolver en papel", d: "Diseñá esquemas a mano antes de teclear.", c: "Mente", Art: Journal },
  { t: "Mapas mentales", d: "Transformá texto denso en gráficos radiales.", c: "Mente", Art: Journal },
  { t: "Pomodoro 50/10", d: "50 min de trabajo, 10 de descanso para tareas exigentes.", c: "Foco", Art: Focus },
  { t: "Visualizá el proceso", d: "Imaginá los pasos antes de empezar y bajá la resistencia inicial.", c: "Mente", Art: Eye },
  { t: "Revisión semanal", d: "Planificá tu semana los domingos.", c: "Mente", Art: Book },
  { t: "Técnica Feynman", d: "Explicá conceptos complejos en voz alta y simple.", c: "Mente", Art: Journal },
  { t: "Mano no dominante", d: "Cepillarse o usar el mouse con la mano contraria estimula el cuerpo calloso.", c: "Mente", Art: Hand },

  // Vínculos
  { t: "Llamada a alguien querido", d: "5 minutos de voz, no chat.", c: "Vínculos", Art: Phone },
  { t: "Tiempo con tu mascota", d: "Atención exclusiva: el contacto libera oxitocina.", c: "Vínculos", Art: Heart },
  { t: "Escucha activa absoluta", d: "Escuchá para comprender, no para responder.", c: "Vínculos", Art: People },
  { t: "Caminata compartida", d: "Salí a recorrer la ciudad con alguien.", c: "Vínculos", Art: Walk },
  { t: "Cenas sin pantallas", d: "Dejá los dispositivos fuera de la mesa.", c: "Vínculos", Art: Plate },
  { t: "Mensaje de apreciación", d: "Mandá un texto positivo inesperado a un colega o amigo.", c: "Vínculos", Art: Heart },
  { t: "Compartir recomendaciones", d: "Sugerí un libro, canción o serie pensando en el otro.", c: "Vínculos", Art: Music },
  { t: "Pedir ayuda", d: "Mostrá vulnerabilidad cuando lo necesites.", c: "Vínculos", Art: People },
  { t: "Disculparse rápido", d: "Asumí el error sin excusas innecesarias.", c: "Vínculos", Art: People },
  { t: "24h sin quejas", d: "Filtrá las quejas inútiles y mejorá el clima general.", c: "Vínculos", Art: Cloud },
  { t: "Preguntas significativas", d: "Evitá sí/no: '¿qué fue lo mejor de tu día?'", c: "Vínculos", Art: People },
  { t: "Cumplido sincero", d: "Elogiá una característica no evidente.", c: "Vínculos", Art: Heart },
  { t: "Celebrar al otro", d: "Festejá el éxito ajeno como propio.", c: "Vínculos", Art: People },

  // Hogar
  { t: "Una ventana abierta", d: "Renová el aire del lugar donde estás.", c: "Hogar", Art: Window },
  { t: "Una planta cerca", d: "Sumá una planta a tu escritorio o ventana.", c: "Hogar", Art: Tree },
  { t: "Té caliente sin pantalla", d: "10 minutos con una taza, observando el vapor.", c: "Hogar", Art: Tea },
  { t: "Música suave 20'", d: "Un álbum tranquilo, sin notificaciones.", c: "Hogar", Art: Music },
];

function Habitos() {
  const s = useAppState();
  const sound = useSound();
  const { session } = useAuth();
  const userId = session?.user.id;
  const dailyLimit = s.isPremium ? Infinity : 10;
  const [index, setIndex] = useState(0);
  const [exitDir, setExitDir] = useState<1 | -1 | 0>(0);
  const [ratedToday, setRatedToday] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
  const yesOpacity = useTransform(x, [20, 120], [0, 1]);
  const noOpacity = useTransform(x, [-120, -20], [1, 0]);

  useEffect(() => {
    if (!userId) return;
    userData.getHabitsToday(userId).then((rows) => setRatedToday(rows.length));
  }, [userId]);

  const current = habits[index % habits.length];
  const next = habits[(index + 1) % habits.length];
  const reachedLimit = !s.isPremium && ratedToday >= dailyLimit;

  const remaining = useMemo(
    () => (s.isPremium ? "∞" : `${Math.max(0, dailyLimit - ratedToday)} restantes hoy`),
    [s.isPremium, ratedToday, dailyLimit],
  );

  function rate(served: boolean) {
    if (reachedLimit || !userId) return;
    sound(served ? "success" : "reject");
    setExitDir(served ? 1 : -1);
    setRatedToday((n) => n + 1);
    void userData.rateHabit(userId, current.t, served);
    setIndex((i) => i + 1);
    requestAnimationFrame(() => x.set(0));
  }

  async function resetToday() {
    if (!userId) return;
    sound("tap");
    await userData.resetHabitsToday(userId);
    setRatedToday(0);
  }

  return (
    <AppShell title="Hábitos" subtitle="Deslizá para descubrir lo que te suma">
      <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{remaining}</span>
        <button
          onClick={resetToday}
          className="inline-flex items-center gap-1 hover:text-foreground"
        >
          <RotateCcw className="h-3 w-3" /> Reiniciar
        </button>
      </div>


      <div className="relative mx-auto h-[480px] w-full">
        {reachedLimit ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-secondary p-6 text-center">
            <Lock className="h-6 w-6 text-muted-foreground" />
            <p className="mt-3 font-display text-xl">Pausá. Volvé mañana.</p>
            <p className="mt-1 text-sm text-muted-foreground">Llegaste a los 10 hábitos del día. Premium te da acceso ilimitado.</p>
          </div>
        ) : (
          <>
            {/* Static placeholder behind the deck — never animates so it can't leave traces */}
            <div className="absolute inset-0 scale-[0.97] rounded-3xl bg-card/60 border border-border" />
            {/* Next card peeking underneath */}
            <div className="absolute inset-0 pointer-events-none">
              <HabitCard habit={next} muted />
            </div>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={index}
                style={{ x, rotate }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 100) rate(true);
                  else if (info.offset.x < -100) rate(false);
                }}
                initial={{ scale: 0.96, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{
                  x: exitDir * 600,
                  opacity: 0,
                  rotate: exitDir * 18,
                  transition: { duration: 0.28, ease: "easeOut" },
                }}
                className="absolute inset-0 will-change-transform"
              >
                <HabitCard habit={current}>
                  <motion.div
                    style={{ opacity: yesOpacity }}
                    className="absolute top-6 left-6 rotate-[-8deg] rounded-xl border-2 border-mint-foreground/70 px-3 py-1 text-mint-foreground text-sm font-bold pointer-events-none"
                  >
                    SIRVIÓ
                  </motion.div>
                  <motion.div
                    style={{ opacity: noOpacity }}
                    className="absolute top-6 right-6 rotate-[8deg] rounded-xl border-2 border-grapefruit-foreground/70 px-3 py-1 text-grapefruit-foreground text-sm font-bold pointer-events-none"
                  >
                    NO SIRVIÓ
                  </motion.div>
                </HabitCard>
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>

      {!reachedLimit && (
        <div className="mt-5 flex items-center justify-center gap-6">
          <Button
            onClick={() => rate(false)}
            className="h-14 w-14 rounded-full bg-card border border-border hover:bg-secondary p-0 shadow-card"
            variant="ghost"
          >
            <X className="h-5 w-5 text-grapefruit-foreground" />
          </Button>
          <Button
            onClick={() => rate(true)}
            className="h-16 w-16 rounded-full bg-mint hover:bg-mint/90 text-mint-foreground p-0 shadow-soft"
          >
            <Check className="h-6 w-6" />
          </Button>
        </div>
      )}

      <HealthyDietModal />
    </AppShell>
  );
}

function HabitCard({
  habit,
  children,
  muted,
}: {
  habit: Habit;
  children?: React.ReactNode;
  muted?: boolean;
}) {
  const Art = habit.Art;
  return (
    <div
      className={`absolute inset-0 flex flex-col rounded-3xl border border-border p-5 shadow-soft ${
        muted ? "bg-secondary opacity-60" : "bg-card"
      }`}
    >
      <span className="w-fit rounded-full bg-mint px-3 py-1 text-[11px] font-medium text-mint-foreground">
        {habit.c}
      </span>
      <div className="mt-4 h-44 w-full overflow-hidden rounded-2xl">
        <Art />
      </div>
      <h3 className="mt-4 font-display text-2xl leading-tight">{habit.t}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{habit.d}</p>
      <div className="mt-auto rounded-2xl bg-secondary/60 p-3 text-[11px] text-muted-foreground">
        Probalo hoy. Después decidinos si te sirvió → o no ←.
      </div>
      {children}
    </div>
  );
}
