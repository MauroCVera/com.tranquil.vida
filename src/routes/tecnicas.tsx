import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAppState } from "@/lib/app-store";
import { useSound } from "@/lib/sound";
import { useAuth } from "@/lib/use-auth";
import { userData } from "@/lib/user-data";
import { Sparkles, Lock, ArrowUpRight, Check } from "lucide-react";

export const Route = createFileRoute("/tecnicas")({
  head: () => ({
    meta: [
      { title: "Técnicas — Vida Tranquila" },
      { name: "description", content: "Bloques avanzados de mejora basados en tu historial." },
    ],
  }),
  component: Tecnicas,
});

type Block = { t: string; d: string; tag: Category };
type Category = "Cognitivo" | "Ansiedad" | "Foco" | "Reflexión" | "Descanso";

const ALL: Block[] = [
  // Cognitivo
  { tag: "Cognitivo", t: "Reescribir un pensamiento", d: "Identificá un pensamiento recurrente y formulá una versión más amable y realista, basada en evidencia." },
  { tag: "Cognitivo", t: "Pensamiento de primeros principios", d: "Descomponé un problema hasta sus verdades fundamentales en lugar de razonar por analogía." },
  { tag: "Cognitivo", t: "Inversión mental", d: "Preguntate cómo garantizar el fracaso y evitá sistemáticamente esos caminos." },
  { tag: "Cognitivo", t: "Defusión cognitiva", d: "Usá la fórmula 'Estoy teniendo el pensamiento de que…' para crear distancia analítica." },
  { tag: "Cognitivo", t: "Auditoría de sesgo de confirmación", d: "Buscá activamente evidencia que refute tu hipótesis inicial." },
  { tag: "Cognitivo", t: "Cuestionamiento socrático", d: "Sometete a un interrogatorio: validez, origen y consecuencia de cada certeza." },
  { tag: "Cognitivo", t: "Consecuencias de segundo orden", d: "Preguntá '¿y después qué?' hasta tres niveles para evitar soluciones que crean nuevos problemas." },
  { tag: "Cognitivo", t: "Externalización del problema", d: "Hablá del problema en tercera persona para desvincular la carga emocional." },
  { tag: "Cognitivo", t: "Micro-reframing", d: "Cambiá 'tengo que' por 'tengo la oportunidad de'." },
  { tag: "Cognitivo", t: "Separación identidad/error", d: "El fallo está en el proceso, no en el individuo." },
  { tag: "Cognitivo", t: "Mapa de argumentación visual", d: "Dibujá premisas y conclusiones para detectar falacias circulares." },
  { tag: "Cognitivo", t: "Heurística de disponibilidad", d: "Cuestioná si algo es probable o solo fácil de recordar." },
  { tag: "Cognitivo", t: "Abogado del diablo interno", d: "Defendé con convicción la postura contraria para ver puntos ciegos." },
  { tag: "Cognitivo", t: "Zoom-out temporal", d: "¿Cómo verás este problema en 10 años? Calibrá la urgencia emocional." },
  { tag: "Cognitivo", t: "Etiquetado emocional granular", d: "Vocabulario emocional preciso: 'frustración por ambigüedad' en vez de 'enojo'." },
  { tag: "Cognitivo", t: "Pensamiento probabilístico", d: "Asigná porcentajes a los resultados esperados y desactivá el blanco/negro." },
  { tag: "Cognitivo", t: "Simulación Montecarlo mental", d: "Imaginá 10 iteraciones distintas del mismo evento." },
  { tag: "Cognitivo", t: "Regla 10/10/10", d: "Evaluá una decisión a 10 minutos, 10 meses y 10 años." },
  { tag: "Cognitivo", t: "Amenaza como desafío", d: "Recategorizá la activación fisiológica: no es pánico, es preparación." },

  // Ansiedad
  { tag: "Ansiedad", t: "Anclaje sensorial 5-4-3-2-1", d: "5 cosas que ves, 4 que tocás, 3 que escuchás, 2 que olés, 1 que saboreás." },
  { tag: "Ansiedad", t: "Suspiro fisiológico", d: "Dos inhalaciones nasales rápidas + una exhalación bucal larga (Huberman)." },
  { tag: "Ansiedad", t: "Inmersión térmica facial", d: "Sumergí la cara en agua helada 15 segundos: reflejo de inmersión mamífero." },
  { tag: "Ansiedad", t: "Estimulación bilateral (EMDR)", d: "Abrazo de mariposa: golpeteo alterno en hombros para procesar bloqueos." },
  { tag: "Ansiedad", t: "Contracción isométrica", d: "Tensá todos los músculos al 100% por 10s y soltá de golpe." },
  { tag: "Ansiedad", t: "Caja de seguridad mental", d: "Visualizá empacar la ansiedad en un contenedor estructurado y posponer el procesamiento." },
  { tag: "Ansiedad", t: "Tapping analítico (EFT)", d: "Percutí puntos meridianos describiendo verbalmente el problema." },
  { tag: "Ansiedad", t: "Ampliación del campo visual", d: "Pasá de foco puntual a visión periférica para desactivar la alerta del tronco." },
  { tag: "Ansiedad", t: "Flâneur urbano", d: "Caminata sin rumbo observando texturas y arquitectura." },
  { tag: "Ansiedad", t: "Exposición gradual imaginada", d: "Visualizá el escenario temido en incrementos de 10 segundos." },
  { tag: "Ansiedad", t: "Validación lógica del síntoma", d: "'Mi corazón late rápido porque mi cuerpo me protege': elimina el meta-miedo." },

  // Foco
  { tag: "Foco", t: "Bloque de tiempo profundo", d: "Diseñá un bloque de 90 minutos sin interrupciones para tu objetivo más importante." },
  { tag: "Foco", t: "Ondas binaurales 40Hz", d: "Audio a 40Hz para sincronizar ondas Gamma e inducir concentración profunda." },
  { tag: "Foco", t: "Eliminar fricción de inicio", d: "Dejá la herramienta abierta la noche anterior: regla de los 20 segundos." },
  { tag: "Foco", t: "Mapeo visual de dependencias", d: "Dibujá el árbol de decisiones antes de ejecutar." },
  { tag: "Foco", t: "Aislar variables", d: "Si te estancás, aislá un componente y probalo solo." },
  { tag: "Foco", t: "Definition of Done", d: "Escribí los criterios exactos para considerar terminada la sesión." },
  { tag: "Foco", t: "Restricción artificial de tiempo", d: "Asigná 30% menos del tiempo que creés necesitar (Ley de Parkinson)." },
  { tag: "Foco", t: "Modo avión total", d: "Una hora sin red ni notificaciones para tareas de alta demanda." },
  { tag: "Foco", t: "Sesgo de finalización", d: "Cerrá pendientes pequeños antes de empezar para liberar memoria de trabajo." },

  // Reflexión
  { tag: "Reflexión", t: "Inventario semanal", d: "Tres preguntas: qué me dio energía, qué me la quitó, qué quiero repetir." },
  { tag: "Reflexión", t: "Diario de decisiones", d: "Documentá qué sabías y cómo te sentías al decidir. Neutraliza el sesgo retrospectivo." },
  { tag: "Reflexión", t: "Análisis de costo de oportunidad", d: "Por cada sí, reflexioná sobre los tres no implícitos." },
  { tag: "Reflexión", t: "Resiliencia arquitectónica", d: "Identificá puntos de falla únicos en ingresos, salud o relaciones." },
  { tag: "Reflexión", t: "Autobiografía a 5 años", d: "Escribí tu vida ideal a 5 años; usá el texto como brújula semanal." },
  { tag: "Reflexión", t: "Pre-mortem", d: "Imaginá que el proyecto fracasó: enumerá las causas antes de empezar." },

  // Descanso
  { tag: "Descanso", t: "Higiene del sueño", d: "Apagar pantallas 60 min antes, luz tenue, temperatura fresca, mismo horario." },
  { tag: "Descanso", t: "Cama = dormir", d: "Si no conciliás el sueño en 20 min, levantate a hacer algo aburrido." },
  { tag: "Descanso", t: "Sincronización térmica vespertina", d: "Ducha o baño caliente 90 min antes de dormir activa el descenso de temperatura central." },
  { tag: "Descanso", t: "Ritual liminal", d: "Usá un viaje, lectura suave o estiramiento como esclusa entre trabajo y cama." },
  { tag: "Descanso", t: "Ergonomía del sueño", d: "Almohadas estratégicas entre rodillas o bajo lumbares evitan micro-despertares." },
  { tag: "Descanso", t: "Restricción de líquidos vespertina", d: "Cortá la hidratación 2h antes de acostarte para evitar despertares." },
  { tag: "Descanso", t: "Descanso vs. ocio", d: "Maratonear series no es descanso. El verdadero descanso requiere baja entrada sensorial." },
  { tag: "Descanso", t: "Siesta NSDR 10'", d: "Yoga nidra o respiración guiada para resetear sin entrar en sueño profundo." },
];

const CATS: ("Todas" | Category)[] = ["Todas", "Cognitivo", "Ansiedad", "Foco", "Reflexión", "Descanso"];

function Tecnicas() {
  const s = useAppState();
  const sound = useSound();
  const { session } = useAuth();
  const userId = session?.user.id;
  const [cat, setCat] = useState<(typeof CATS)[number]>("Todas");
  const [done, setDone] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) return;
    userData.getTechniques(userId).then((rows) => {
      setDone(new Set(rows.map((r) => r.technique_id)));
    });
  }, [userId]);

  const list = useMemo(() => (cat === "Todas" ? ALL : ALL.filter((b) => b.tag === cat)), [cat]);

  async function complete(id: string) {
    if (!userId || done.has(id)) return;
    sound("success");
    setDone((prev) => new Set(prev).add(id));
    await userData.completeTechnique(userId, id);
  }

  return (
    <AppShell title="Técnicas" subtitle={`${ALL.length} bloques avanzados · ${done.size} practicados`}>
      {!s.isPremium && (
        <Link
          to="/ajustes"
          onClick={() => sound("tap")}
          className="block mb-4 rounded-2xl bg-gradient-premium p-4 text-premium-foreground shadow-soft"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider opacity-90">
                <Sparkles className="h-3.5 w-3.5" /> Contenido Premium
              </div>
              <p className="mt-1 font-display text-lg leading-tight">Desbloqueá todas las técnicas</p>
            </div>
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </Link>
      )}

      <div className="-mx-1 mb-3 flex gap-1.5 overflow-x-auto pb-1">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => { sound("tap"); setCat(c); }}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs transition ${
              cat === c
                ? "bg-foreground text-background"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map((b, i) => {
          const idx = ALL.indexOf(b);
          const locked = !s.isPremium && idx > 1;
          const isDone = done.has(b.t);
          return (
            <article
              key={b.t}
              className={`relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-card ${
                locked ? "opacity-80" : ""
              } ${isDone ? "ring-1 ring-mint" : ""}`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">{b.tag}</span>
                <span className="text-muted-foreground">#{i + 1}</span>
              </div>
              <h3 className="mt-3 font-display text-xl leading-snug">{b.t}</h3>
              <p className={`mt-2 text-sm text-muted-foreground ${locked ? "blur-[3px] select-none" : ""}`}>
                {b.d}
              </p>
              {locked ? (
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" /> Disponible con Premium
                </div>
              ) : (
                <button
                  onClick={() => complete(b.t)}
                  disabled={isDone}
                  className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition ${
                    isDone
                      ? "bg-mint text-mint-foreground"
                      : "bg-secondary hover:bg-muted text-secondary-foreground"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                  {isDone ? "Practicada" : "Marcar practicada"}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
