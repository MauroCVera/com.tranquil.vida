// Simple in-memory + localStorage store for the demo app.
import { useEffect, useState } from "react";

export type Mood = "great" | "good" | "meh" | "low" | "bad";
export type SummaryDay = "sunday" | "monday";

export type AppState = {
  isPremium: boolean;
  theme: "light" | "dark";
  sound: boolean;
  notifications: boolean;
  summaryDay: SummaryDay;
  geoConsent: boolean;
  mood: Mood | null;
  goals: string[];
  habitsRated: number; // count today
  servedCount: number;
  notServedCount: number;
  enableExploraPopups: boolean;
  lastExploraPopupDate: string | null;
};

const KEY = "vida-tranquila-state-v1";

const defaultState: AppState = {
  isPremium: false,
  theme: "light",
  sound: true,
  notifications: false,
  summaryDay: "sunday",
  geoConsent: false,
  mood: null,
  goals: [],
  habitsRated: 0,
  servedCount: 0,
  notServedCount: 0,
  enableExploraPopups: true,
  lastExploraPopupDate: null,
};

let state: AppState = defaultState;
const listeners = new Set<() => void>();

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...defaultState, ...JSON.parse(raw) };
  } catch {}
  applyTheme(state.theme);
}
load();

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

function applyTheme(t: "light" | "dark") {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", t === "dark");
}

export function setState(patch: Partial<AppState>) {
  state = { ...state, ...patch };
  if (patch.theme) applyTheme(patch.theme);
  persist();
  listeners.forEach((l) => l());
}

export function useAppState() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const l = () => setTick((t) => t + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return state;
}
