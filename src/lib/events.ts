// Curated Buenos Aires events 2026 + relaxing places, with coordinates for Google Maps.
export type Place = {
  name: string;
  neighborhood: string;
  description: string;
  emoji: string;
  lat: number;
  lng: number;
};

export type EventItem = {
  id: string;
  title: string;
  date: string; // human-readable
  month: string;
  category: string;
  venue: string;
  description?: string;
  lat: number;
  lng: number;
  source: "ocio" | "nocturna" | "ciudad" | "ferias";
  /** ISO start date (yyyy-mm-dd). First date of the event. */
  start?: string;
  /** ISO end date (yyyy-mm-dd). Last date of the event. Defaults to start. */
  end?: string;
  /** Marks recurring/permanent events that should always show. */
  recurring?: boolean;
};

/**
 * Filter events to those that are upcoming within `daysAhead` days from `now`.
 * Recurring events are always included. Multi-day events are included if any
 * portion of them falls inside the window.
 */
export function upcomingEvents(
  list: EventItem[],
  now: Date = new Date(),
  daysAhead = 15,
): EventItem[] {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const limit = new Date(today);
  limit.setDate(limit.getDate() + daysAhead);
  return list.filter((e) => {
    if (e.recurring) return true;
    if (!e.start) return false;
    const s = new Date(e.start + "T00:00:00");
    const en = new Date((e.end ?? e.start) + "T23:59:59");
    return en >= today && s <= limit;
  });
}

export const places: Place[] = [
  { name: "Jardín Japonés", neighborhood: "Palermo", description: "Estanques, lagos de carpas koi y prácticas de respiración 4-7-8.", emoji: "🪷", lat: -34.5759, lng: -58.4106 },
  { name: "Jardín Botánico Carlos Thays", neighborhood: "Palermo", description: "Invernaderos históricos. Ideal para caminar sin teléfono.", emoji: "🌿", lat: -34.5827, lng: -58.4119 },
  { name: "Reserva Ecológica Costanera Sur", neighborhood: "Puerto Madero", description: "350 ha junto al Río de la Plata. Sol matutino y aves.", emoji: "🌾", lat: -34.6118, lng: -58.3527 },
  { name: "Ecoparque Buenos Aires", neighborhood: "Palermo", description: "Caminatas contemplativas y fauna en semilibertad.", emoji: "🦒", lat: -34.5743, lng: -58.4109 },
  { name: "Rosedal de Palermo", neighborhood: "Palermo", description: "18.000 rosales, pérgola blanca y lectura analógica.", emoji: "🌹", lat: -34.5733, lng: -58.4178 },
  { name: "Parque Centenario", neighborhood: "Caballito", description: "Lago circular, anfiteatro y feria de libros.", emoji: "📖", lat: -34.6064, lng: -58.4356 },
  { name: "Parque Saavedra", neighborhood: "Saavedra", description: "Arboledas y un buen lugar para yoga matutino.", emoji: "🌳", lat: -34.5570, lng: -58.4870 },
  { name: "Parque Chacabuco", neighborhood: "Parque Chacabuco", description: "Espacios abiertos para yoga integrado y picnic.", emoji: "🧘", lat: -34.6320, lng: -58.4400 },
  { name: "Plaza Mafalda", neighborhood: "Colegiales", description: "Café tranquilo y árboles enormes.", emoji: "🌳", lat: -34.5715, lng: -58.4471 },
  { name: "Barrio Chino", neighborhood: "Belgrano", description: "Té matcha, librerías y aromas suaves.", emoji: "🍵", lat: -34.5614, lng: -58.4513 },
  { name: "Paseo de la Costa", neighborhood: "Vicente López", description: "Bicicletas, mates y brisa ribereña.", emoji: "🚴", lat: -34.5078, lng: -58.4810 },
  { name: "Quinta Trabucco", neighborhood: "Florida (GBA)", description: "Arquitectura patrimonial entre arboledas centenarias.", emoji: "🏛️", lat: -34.5165, lng: -58.4923 },
  { name: "Plaza Francia", neighborhood: "Recoleta", description: "Feria de artesanos los fines de semana.", emoji: "🎨", lat: -34.5836, lng: -58.3934 },
];

// Coordinates of the most-used venues (Google Maps verified).
const venueCoords: Record<string, { lat: number; lng: number }> = {
  "Movistar Arena": { lat: -34.5980, lng: -58.4496 },
  "La Rural": { lat: -34.5810, lng: -58.4124 },
  "Estadio River Plate": { lat: -34.5453, lng: -58.4498 },
  "Estadio Vélez Sarsfield": { lat: -34.6354, lng: -58.5208 },
  "Estadio Huracán": { lat: -34.6373, lng: -58.3990 },
  "Campo Argentino de Polo": { lat: -34.5712, lng: -58.4205 },
  "Teatro Colón": { lat: -34.6011, lng: -58.3835 },
  "Teatro Gran Rex": { lat: -34.6038, lng: -58.3789 },
  "Teatro Avenida": { lat: -34.6109, lng: -58.3845 },
  "Teatro Politeama": { lat: -34.6080, lng: -58.3937 },
  "Teatro San Martín": { lat: -34.6037, lng: -58.3870 },
  "CC 25 de Mayo": { lat: -34.6058, lng: -58.4419 },
  "CC Recoleta": { lat: -34.5836, lng: -58.3934 },
  "Planetario Galileo Galilei": { lat: -34.5697, lng: -58.4116 },
  "Parque de la Ciudad": { lat: -34.6760, lng: -58.4530 },
  "Avenida Corrientes": { lat: -34.6041, lng: -58.3870 },
  "Obelisco": { lat: -34.6037, lng: -58.3816 },
  "Microestadio Malvinas Argentinas": { lat: -34.6086, lng: -58.5151 },
  "Autódromo de la Ciudad de Buenos Aires": { lat: -34.6953, lng: -58.4684 },
  "Estadio Ferro": { lat: -34.6164, lng: -58.4540 },
  "Niceto": { lat: -34.5852, lng: -58.4360 },
  "Vita Palermo": { lat: -34.5870, lng: -58.4350 },
  "Puerto de Olivos": { lat: -34.5078, lng: -58.4905 },
  "El Muelle Costanera": { lat: -34.6118, lng: -58.3527 },
  "Mandarine Punta Carrasco": { lat: -34.5552, lng: -58.4072 },
  "Buenos Aires Ferial": { lat: -34.5680, lng: -58.4023 },
  "Velódromo de la Ciudad": { lat: -34.5715, lng: -58.4290 },
  "Feria de Mataderos": { lat: -34.6577, lng: -58.5060 },
  "Catedral Metropolitana": { lat: -34.6082, lng: -58.3729 },
  "Parque Olímpico": { lat: -34.6770, lng: -58.4670 },
  "Plaza Dorrego": { lat: -34.6204, lng: -58.3717 },
  "Espacio Cultural Julián Centeya": { lat: -34.6320, lng: -58.4148 },
  "Rosedal Estación Saludable": { lat: -34.5733, lng: -58.4178 },
  "Usina del Arte": { lat: -34.6402, lng: -58.3592 },
  "Plaza Francia Recoleta": { lat: -34.5836, lng: -58.3934 },
  "Parque Saavedra": { lat: -34.5570, lng: -58.4870 },
  "Parque Chacabuco": { lat: -34.6320, lng: -58.4400 },
  "Parque Centenario Anfiteatro": { lat: -34.6064, lng: -58.4356 },
  "Jardín Japonés": { lat: -34.5759, lng: -58.4106 },
  "Reserva Ecológica": { lat: -34.6118, lng: -58.3527 },
  "Jardín Botánico": { lat: -34.5827, lng: -58.4119 },
};

function v(name: keyof typeof venueCoords | string): { lat: number; lng: number } {
  return venueCoords[name as keyof typeof venueCoords] ?? { lat: -34.6037, lng: -58.3816 };
}

export const events: EventItem[] = [
  // — Recitales y conciertos destacados (Movistar Arena & estadios) —
  { id: "rosalia", title: "Rosalía", date: "1, 2, 4 y 6 de Agosto", month: "Agosto", category: "Recital", venue: "Movistar Arena", ...v("Movistar Arena"), source: "ciudad", start: "2026-08-01", end: "2026-08-06" },
  { id: "bad-bunny", title: "Bad Bunny", date: "13, 14 y 15 de Febrero", month: "Febrero", category: "Recital", venue: "Estadio River Plate", ...v("Estadio River Plate"), source: "ciudad", start: "2026-02-13", end: "2026-02-15" },
  { id: "soda", title: "Soda Stereo (Gracias Totales)", date: "21 y 23 de Marzo", month: "Marzo", category: "Recital", venue: "Movistar Arena", ...v("Movistar Arena"), source: "ciudad", start: "2026-03-21", end: "2026-03-23" },
  { id: "fito", title: "Fito Páez", date: "19 y 20 de Marzo", month: "Marzo", category: "Recital", venue: "Movistar Arena", ...v("Movistar Arena"), source: "ciudad", start: "2026-03-19", end: "2026-03-20" },
  { id: "tan-bionica", title: "Tan Biónica", date: "27, 28 y 29 de Marzo", month: "Marzo", category: "Recital", venue: "Estadio Vélez Sarsfield", ...v("Estadio Vélez Sarsfield"), source: "ciudad", start: "2026-03-27", end: "2026-03-29" },
  { id: "acdc", title: "AC/DC", date: "23, 27 y 31 de Marzo", month: "Marzo", category: "Recital", venue: "Estadio River Plate", ...v("Estadio River Plate"), source: "ciudad", start: "2026-03-23", end: "2026-03-31" },
  { id: "chayanne", title: "Chayanne", date: "24 y 25 de Febrero", month: "Febrero", category: "Recital", venue: "Movistar Arena", ...v("Movistar Arena"), source: "ciudad", start: "2026-02-24", end: "2026-02-25" },
  { id: "doja", title: "Doja Cat", date: "8 de Febrero", month: "Febrero", category: "Recital", venue: "Movistar Arena", ...v("Movistar Arena"), source: "ciudad", start: "2026-02-08" },
  { id: "ricky", title: "Ricky Martin", date: "17 y 18 de Abril", month: "Abril", category: "Recital", venue: "Campo Argentino de Polo", ...v("Campo Argentino de Polo"), source: "ciudad", start: "2026-04-17", end: "2026-04-18" },
  { id: "lali", title: "Lali", date: "6 y 7 de Junio", month: "Junio", category: "Recital", venue: "Estadio River Plate", ...v("Estadio River Plate"), source: "ciudad", start: "2026-06-06", end: "2026-06-07" },
  { id: "arjona", title: "Ricardo Arjona", date: "Mayo (12 funciones)", month: "Mayo", category: "Recital", venue: "Movistar Arena", ...v("Movistar Arena"), source: "ciudad", start: "2026-05-02", end: "2026-05-30" },
  { id: "drexler", title: "Jorge Drexler", date: "17 de Abril", month: "Abril", category: "Recital", venue: "Movistar Arena", ...v("Movistar Arena"), source: "ciudad", start: "2026-04-17" },
  { id: "pausini", title: "Laura Pausini", date: "12 de Abril", month: "Abril", category: "Recital", venue: "Movistar Arena", ...v("Movistar Arena"), source: "ciudad", start: "2026-04-12" },
  { id: "ultra", title: "Ultra Music Festival BA", date: "14 y 15 de Febrero", month: "Febrero", category: "Festival", venue: "Parque de la Ciudad", ...v("Parque de la Ciudad"), source: "ciudad", start: "2026-02-14", end: "2026-02-15" },
  { id: "lumineers", title: "The Lumineers", date: "29 de Abril", month: "Abril", category: "Recital", venue: "Microestadio Malvinas Argentinas", ...v("Microestadio Malvinas Argentinas"), source: "ciudad", start: "2026-04-29" },

  // — Cultura y arte —
  { id: "feria-libro", title: "50ª Feria Internacional del Libro", date: "23 Abr — 11 May", month: "Abril", category: "Cultura", venue: "La Rural", description: "Edición histórica. País invitado: Perú.", ...v("La Rural"), source: "ferias", start: "2026-04-23", end: "2026-05-11" },
  { id: "bafici", title: "BAFICI", date: "15 al 26 de Abril", month: "Abril", category: "Cine", venue: "Cines de la Ciudad", description: "Festival Internacional de Cine Independiente.", ...v("CC Recoleta"), source: "ciudad", start: "2026-04-15", end: "2026-04-26" },
  { id: "butterfly", title: "Madama Butterfly", date: "Temporada 2026", month: "Temporada", category: "Ópera", venue: "Teatro Avenida", ...v("Teatro Avenida"), source: "ocio", recurring: true },
  { id: "bebe-reno", title: "Bebé Reno (Teatro)", date: "Temporada 2026", month: "Temporada", category: "Teatro", venue: "Avenida Corrientes", ...v("Avenida Corrientes"), source: "ocio", recurring: true },
  { id: "nicki", title: "Nicki Nicole", date: "19 de Febrero", month: "Febrero", category: "Recital", venue: "Teatro Colón", ...v("Teatro Colón"), source: "ciudad", start: "2026-02-19" },
  { id: "jazz", title: "Jazz en San Martín", date: "16 al 22 de Marzo", month: "Marzo", category: "Música", venue: "Teatro San Martín", ...v("Teatro San Martín"), source: "ocio", start: "2026-03-16", end: "2026-03-22" },
  { id: "mataderos", title: "Apertura Feria de Mataderos", date: "15 de Marzo", month: "Marzo", category: "Folclore", venue: "Feria de Mataderos", ...v("Feria de Mataderos"), source: "ocio", start: "2026-03-15" },
  { id: "milonga", title: "La Milonga del CC25", date: "8 de Marzo", month: "Marzo", category: "Tango", venue: "CC 25 de Mayo", ...v("CC 25 de Mayo"), source: "ocio", start: "2026-03-08" },
  { id: "poesia", title: "6° Festival de Poesía de Boedo", date: "13 y 14 de Marzo", month: "Marzo", category: "Literatura", venue: "Espacio Julián Centeya", ...v("Espacio Cultural Julián Centeya"), source: "ocio", start: "2026-03-13", end: "2026-03-14" },

  // — Gastronomía y vida urbana —
  { id: "cafecito", title: "Cafecito BA", date: "9 y 10 de Mayo", month: "Mayo", category: "Gastronomía", venue: "Plaza República del Perú", ...v("CC Recoleta"), source: "ciudad", start: "2026-05-09", end: "2026-05-10" },
  { id: "hamburgueserias", title: "Noche de las Hamburgueserías", date: "6 de Marzo", month: "Marzo", category: "Gastronomía", venue: "Distintos puntos de la Ciudad", ...v("Obelisco"), source: "ciudad", start: "2026-03-06" },
  { id: "corrientes", title: "Corrientes 24H", date: "Cada viernes de Enero", month: "Enero", category: "Cultura", venue: "Avenida Corrientes", ...v("Avenida Corrientes"), source: "ciudad", start: "2026-01-02", end: "2026-01-30" },
  { id: "mirador", title: "Nuevo Mirador del Obelisco", date: "Apertura 2026", month: "Turismo", category: "Turismo", venue: "Obelisco", ...v("Obelisco"), source: "ocio", recurring: true },

  // — Vida nocturna —
  { id: "ink", title: "INK Buenos Aires", date: "Jueves y Sábados", month: "Permanente", category: "Boliche", venue: "Niceto Vega 5635, Palermo", description: "Disco top de BA, free pass por lista.", ...v("Niceto"), source: "nocturna", recurring: true },
  { id: "panchera", title: "Fiesta La Panchera", date: "15 de Mayo", month: "Mayo", category: "Fiesta", venue: "Vita Palermo", description: "Reggaetón, barra libre y panchos dobles.", ...v("Vita Palermo"), source: "nocturna", start: "2026-05-15" },
  { id: "barco-amigo", title: "Fiesta en Barco · Día del Amigo", date: "18 de Julio", month: "Julio", category: "Barco", venue: "Puerto de Olivos", description: "Cena + navegación en catamarán + boliche.", ...v("Puerto de Olivos"), source: "nocturna", start: "2026-07-18" },
  { id: "barco-hw", title: "Fiesta en Barco · Halloween", date: "31 de Octubre", month: "Octubre", category: "Barco", venue: "Puerto de Olivos", ...v("Puerto de Olivos"), source: "nocturna", start: "2026-10-31" },
  { id: "muelle", title: "El Muelle · Ciclo Electrónica", date: "9 de Mayo", month: "Mayo", category: "Electrónica", venue: "El Muelle Costanera", ...v("El Muelle Costanera"), source: "nocturna", start: "2026-05-09" },
  { id: "discotick", title: "Discotick · Fiesta Retro", date: "24 de Mayo", month: "Mayo", category: "Retro", venue: "Centro CABA", ...v("Obelisco"), source: "nocturna", start: "2026-05-24" },

  // — Deportes y ferias —
  { id: "colapinto", title: "Colapinto Roadshow F1", date: "26 de Abril", month: "Abril", category: "Deportes", venue: "Calles de Palermo", ...v("Campo Argentino de Polo"), source: "ferias", start: "2026-04-26" },
  { id: "premier-padel", title: "Premier Padel BA P1", date: "11 al 17 de Mayo", month: "Mayo", category: "Deportes", venue: "Parque Olímpico", ...v("Parque Olímpico"), source: "ciudad", start: "2026-05-11", end: "2026-05-17" },
  { id: "21k", title: "21K Buenos Aires", date: "23 de Agosto", month: "Agosto", category: "Deportes", venue: "Circuito Obelisco", ...v("Obelisco"), source: "ciudad", start: "2026-08-23" },
  { id: "caballos", title: "23ª Nuestros Caballos", date: "24 al 29 de Marzo", month: "Marzo", category: "Ecuestre", venue: "La Rural", ...v("La Rural"), source: "ferias", start: "2026-03-24", end: "2026-03-29" },
  { id: "garage", title: "21ª El Garage Motorshow", date: "23 al 25 de Octubre", month: "Octubre", category: "Motor", venue: "La Rural", ...v("La Rural"), source: "ferias", start: "2026-10-23", end: "2026-10-25" },

  // — Calendario AMBA 2026 (recurrentes semanales) —
  { id: "yoga-rosedal", title: "Yoga y Conexión Natural", date: "Sábados 14:00–16:00", month: "Recurrente", category: "Yoga", venue: "Rosedal de Palermo (Estación Saludable)", description: "Sesión gratuita al aire libre. Pilares: Cuerpo / Vínculos.", ...v("Rosedal Estación Saludable"), source: "ciudad", recurring: true },
  { id: "yoga-saavedra", title: "Yoga y Estiramiento Consciente", date: "Lunes y Domingos 10:00–11:30", month: "Recurrente", category: "Yoga", venue: "Parque Saavedra (García del Río y Pinto)", description: "Práctica suave a la sombra de los árboles.", ...v("Parque Saavedra"), source: "ciudad", recurring: true },
  { id: "yoga-chacabuco", title: "Yoga Integrado", date: "Martes 16:00–17:30", month: "Recurrente", category: "Yoga", venue: "Parque Chacabuco (Emilio Mitre y Asamblea)", ...v("Parque Chacabuco"), source: "ciudad", recurring: true },
  { id: "yoga-centenario", title: "Yoga Matutino (Activación Solar)", date: "Jueves 8:30–10:00", month: "Recurrente", category: "Yoga", venue: "Parque Centenario", description: "Activación solar al amanecer.", ...v("Parque Centenario Anfiteatro"), source: "ciudad", recurring: true },
  { id: "med-centenario", title: "Meditación y Yoga en el Anfiteatro", date: "Miércoles 16:30–17:45", month: "Recurrente", category: "Meditación", venue: "Anfiteatro Parque Centenario", ...v("Parque Centenario Anfiteatro"), source: "ciudad", recurring: true },
  { id: "colon-tour", title: "Visita Guiada Histórica al Teatro Colón", date: "Todos los días 9:00–17:00", month: "Recurrente", category: "Cultura", venue: "Teatro Colón (Tucumán 1171)", description: "Salidas cada 15 minutos. Arquitectura y arte.", ...v("Teatro Colón"), source: "ocio", recurring: true },
  { id: "usina-arte", title: "Recorrido Cultural y Exposiciones", date: "Viernes y Sábados 18:00–20:00", month: "Recurrente", category: "Cultura", venue: "Usina del Arte (La Boca)", ...v("Usina del Arte"), source: "ocio", recurring: true },
  { id: "feria-francia", title: "Feria de Artesanos y Caminata Reflexiva", date: "Sábados y Domingos 11:00–20:00", month: "Recurrente", category: "Feria", venue: "Plaza Francia, Recoleta", ...v("Plaza Francia Recoleta"), source: "ferias", recurring: true },
  { id: "san-telmo", title: "Caminata Histórica y Antigüedades", date: "Domingos 10:00–17:00", month: "Recurrente", category: "Feria", venue: "Feria de San Telmo (Plaza Dorrego)", ...v("Plaza Dorrego"), source: "ferias", recurring: true },
  { id: "mataderos-fer", title: "Tradiciones: Danza y Gastronomía", date: "Domingos 11:00–18:00", month: "Recurrente", category: "Folclore", venue: "Feria de Mataderos", ...v("Feria de Mataderos"), source: "ferias", recurring: true },

  // — Refugios de Calma (acceso flexible) —
  { id: "ref-japones", title: "Jardín Japonés", date: "Lun a Dom 10:00–18:45", month: "Refugio", category: "Calma", venue: "Av. Casares 3450, Palermo", description: "Lagos de carpas koi, té y respiración 4-7-8.", ...v("Jardín Japonés"), source: "ocio", recurring: true },
  { id: "ref-reserva", title: "Reserva Ecológica Costanera Sur", date: "Mar a Dom 8:00–18:00", month: "Refugio", category: "Naturaleza", venue: "Av. Tristán Achával Rodríguez 1550", description: "Sol matutino, observación de aves, horizonte amplio.", ...v("Reserva Ecológica"), source: "ocio", recurring: true },
  { id: "ref-botanico", title: "Jardín Botánico Carlos Thays", date: "Mar a Dom 8:00–18:00", month: "Refugio", category: "Calma", venue: "Av. Santa Fe 3951, CABA", description: "Invernaderos y caminata sin teléfono.", ...v("Jardín Botánico"), source: "ocio", recurring: true },
];

export function gmapsUrl(item: { lat: number; lng: number; title?: string; venue?: string; name?: string }) {
  const q = encodeURIComponent(item.title ?? item.name ?? item.venue ?? "");
  return `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}&query_place_id=&z=16` + (q ? `&q=${q}` : "");
}

export function gmapsDirections(lat: number, lng: number, label?: string) {
  const dest = label ? `${encodeURIComponent(label)}` : `${lat},${lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}&destination_place_id=&travelmode=transit`;
}
