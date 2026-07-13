import { useEffect, useState } from "react";
import { Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog } from "lucide-react";

type Weather = {
  now: number;
  later: number;
  code: number;
  isDay: boolean;
};

// Open-Meteo WMO weather codes -> icon + label
function describe(code: number, isDay: boolean) {
  if (code === 0) return { Icon: isDay ? Sun : Moon, label: "Despejado" };
  if (code <= 2) return { Icon: isDay ? Sun : Moon, label: "Mayormente despejado" };
  if (code === 3) return { Icon: Cloud, label: "Nublado" };
  if (code === 45 || code === 48) return { Icon: CloudFog, label: "Niebla" };
  if (code >= 51 && code <= 67) return { Icon: CloudRain, label: "Lluvia" };
  if (code >= 71 && code <= 77) return { Icon: CloudSnow, label: "Nieve" };
  if (code >= 80 && code <= 82) return { Icon: CloudRain, label: "Chubascos" };
  if (code >= 95) return { Icon: CloudLightning, label: "Tormenta" };
  return { Icon: Cloud, label: "—" };
}

export function WeatherWidget() {
  const [w, setW] = useState<Weather | null>(null);

  useEffect(() => {
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=-34.6037&longitude=-58.3816" +
      "&current=temperature_2m,weather_code,is_day&hourly=temperature_2m&forecast_days=2&timezone=America%2FArgentina%2FBuenos_Aires";
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        const times: string[] = d.hourly?.time ?? [];
        const temps: number[] = d.hourly?.temperature_2m ?? [];
        const nowIso: string = d.current?.time ?? "";
        const baseHour = nowIso.slice(0, 13); // YYYY-MM-DDTHH
        const idx = times.findIndex((t) => t.startsWith(baseHour));
        const laterIdx = idx >= 0 ? Math.min(idx + 3, temps.length - 1) : -1;
        setW({
          now: Math.round(d.current?.temperature_2m ?? 0),
          later: laterIdx >= 0 ? Math.round(temps[laterIdx]) : Math.round(d.current?.temperature_2m ?? 0),
          code: d.current?.weather_code ?? 0,
          isDay: !!d.current?.is_day,
        });
      })
      .catch(() => setW(null));
  }, []);

  if (!w) {
    return (
      <div className="rounded-2xl border border-border bg-card/50 px-4 py-3 text-xs text-muted-foreground">
        Cargando clima…
      </div>
    );
  }

  const { Icon, label } = describe(w.code, w.isDay);

  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 shadow-card">
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-foreground/80" />
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Buenos Aires</div>
          <div className="text-sm font-medium">{label}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-display text-2xl leading-none">{w.now}°</div>
        <div className="text-[11px] text-muted-foreground mt-1">en 3h · {w.later}°</div>
      </div>
    </div>
  );
}
