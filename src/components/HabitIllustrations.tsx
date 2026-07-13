// Friendly pastel SVG illustrations for habits. Each is a self-contained SVG.
import type { ReactNode } from "react";

type Props = { className?: string };

function Frame({ children, bg }: { children: ReactNode; bg: string }) {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="oklch(0.95 0.04 80)" />
          <stop offset="1" stopColor={bg} />
        </linearGradient>
      </defs>
      <rect width="240" height="160" rx="22" fill="url(#sky)" />
      {children}
    </svg>
  );
}

export function Breath({}: Props) {
  return (
    <Frame bg="oklch(0.92 0.05 160)">
      <circle cx="120" cy="85" r="48" fill="oklch(0.85 0.06 160)" opacity="0.55" />
      <circle cx="120" cy="85" r="34" fill="oklch(0.96 0.03 160)" />
      <text x="120" y="92" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="22" fill="oklch(0.32 0.04 160)">4-7-8</text>
      <path d="M40 130 Q 120 110 200 130" stroke="oklch(0.78 0.06 160)" strokeWidth="2" fill="none" />
    </Frame>
  );
}

export function Walk({}: Props) {
  return (
    <Frame bg="oklch(0.95 0.04 100)">
      {/* sun */}
      <circle cx="190" cy="40" r="18" fill="oklch(0.92 0.10 80)" />
      {/* hill */}
      <path d="M0 130 Q 70 90 140 120 T 240 110 L240 160 L0 160 Z" fill="oklch(0.86 0.06 150)" />
      {/* tree */}
      <rect x="46" y="92" width="6" height="22" fill="oklch(0.45 0.04 60)" />
      <circle cx="49" cy="88" r="14" fill="oklch(0.78 0.08 150)" />
      {/* person */}
      <circle cx="135" cy="92" r="6" fill="oklch(0.55 0.05 25)" />
      <path d="M135 98 L135 116 M135 105 L128 112 M135 105 L142 112 M135 116 L130 128 M135 116 L141 128" stroke="oklch(0.40 0.05 25)" strokeWidth="3" strokeLinecap="round" fill="none" />
    </Frame>
  );
}

export function Journal({}: Props) {
  return (
    <Frame bg="oklch(0.94 0.04 60)">
      <rect x="60" y="40" width="120" height="86" rx="8" fill="oklch(0.98 0.02 80)" stroke="oklch(0.85 0.04 60)" />
      <line x1="120" y1="40" x2="120" y2="126" stroke="oklch(0.85 0.04 60)" />
      {[58, 70, 82, 94].map((y, i) => (
        <line key={i} x1="70" y1={y} x2="110" y2={y} stroke="oklch(0.80 0.04 60)" strokeWidth="1.5" />
      ))}
      <path d="M156 70 l-20 24 l-6 -6 l20 -24 z" fill="oklch(0.78 0.08 25)" />
      <circle cx="158" cy="68" r="4" fill="oklch(0.55 0.06 25)" />
    </Frame>
  );
}

export function Water({}: Props) {
  return (
    <Frame bg="oklch(0.94 0.04 200)">
      <path d="M120 36 C 90 78 88 110 120 130 C 152 110 150 78 120 36 Z" fill="oklch(0.85 0.07 220)" />
      <path d="M120 60 C 105 86 105 108 120 120" stroke="oklch(0.96 0.02 220)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </Frame>
  );
}

export function Eye({}: Props) {
  return (
    <Frame bg="oklch(0.94 0.04 280)">
      <ellipse cx="120" cy="85" rx="64" ry="34" fill="oklch(0.96 0.02 80)" />
      <circle cx="120" cy="85" r="22" fill="oklch(0.78 0.08 200)" />
      <circle cx="120" cy="85" r="9" fill="oklch(0.25 0.04 60)" />
      <circle cx="125" cy="80" r="3" fill="white" />
    </Frame>
  );
}

export function Stretch({}: Props) {
  return (
    <Frame bg="oklch(0.94 0.05 30)">
      <circle cx="120" cy="58" r="9" fill="oklch(0.55 0.06 25)" />
      <path d="M120 67 L120 110 M120 78 L92 64 M120 78 L148 64 M120 110 L100 138 M120 110 L140 138" stroke="oklch(0.40 0.05 25)" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M40 80 Q 60 70 80 80" stroke="oklch(0.78 0.06 30)" strokeWidth="2" fill="none" />
      <path d="M160 80 Q 180 70 200 80" stroke="oklch(0.78 0.06 30)" strokeWidth="2" fill="none" />
    </Frame>
  );
}

export function Focus({}: Props) {
  return (
    <Frame bg="oklch(0.94 0.04 280)">
      <rect x="86" y="40" width="68" height="100" rx="10" fill="oklch(0.30 0.02 250)" />
      <rect x="92" y="48" width="56" height="78" rx="4" fill="oklch(0.85 0.05 200)" />
      <circle cx="120" cy="134" r="3" fill="oklch(0.96 0.02 200)" />
      <path d="M170 50 l16 -8 m-16 8 l16 8" stroke="oklch(0.78 0.10 25)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="180" cy="50" r="14" fill="none" stroke="oklch(0.78 0.10 25)" strokeWidth="3" />
      <line x1="170" y1="40" x2="190" y2="60" stroke="oklch(0.78 0.10 25)" strokeWidth="3" strokeLinecap="round" />
    </Frame>
  );
}

export function Sun({}: Props) {
  return (
    <Frame bg="oklch(0.95 0.06 80)">
      <circle cx="120" cy="80" r="28" fill="oklch(0.88 0.12 80)" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        const x1 = 120 + Math.cos(a) * 38;
        const y1 = 80 + Math.sin(a) * 38;
        const x2 = 120 + Math.cos(a) * 52;
        const y2 = 80 + Math.sin(a) * 52;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="oklch(0.78 0.12 80)" strokeWidth="3" strokeLinecap="round" />;
      })}
      <path d="M0 140 Q 120 120 240 140 L240 160 L0 160 Z" fill="oklch(0.86 0.06 150)" />
    </Frame>
  );
}

export function Plate({}: Props) {
  return (
    <Frame bg="oklch(0.94 0.05 60)">
      <ellipse cx="120" cy="92" rx="64" ry="14" fill="oklch(0.55 0.04 60)" opacity="0.25" />
      <circle cx="120" cy="80" r="46" fill="oklch(0.97 0.02 80)" stroke="oklch(0.86 0.04 60)" strokeWidth="2" />
      <circle cx="120" cy="80" r="32" fill="oklch(0.93 0.04 60)" />
      <circle cx="108" cy="74" r="8" fill="oklch(0.78 0.10 30)" />
      <circle cx="128" cy="82" r="6" fill="oklch(0.82 0.10 150)" />
      <circle cx="118" cy="90" r="5" fill="oklch(0.85 0.08 80)" />
    </Frame>
  );
}

export function Book({}: Props) {
  return (
    <Frame bg="oklch(0.94 0.04 60)">
      <path d="M40 50 Q 120 38 200 50 L200 122 Q 120 110 40 122 Z" fill="oklch(0.97 0.02 80)" stroke="oklch(0.85 0.04 60)" />
      <line x1="120" y1="44" x2="120" y2="116" stroke="oklch(0.85 0.04 60)" />
      {[60, 72, 84, 96].map((y, i) => (
        <g key={i}>
          <line x1="56" y1={y} x2="108" y2={y - 1} stroke="oklch(0.82 0.04 60)" />
          <line x1="132" y1={y - 1} x2="184" y2={y} stroke="oklch(0.82 0.04 60)" />
        </g>
      ))}
    </Frame>
  );
}

export function Phone({}: Props) {
  return (
    <Frame bg="oklch(0.94 0.05 30)">
      <rect x="92" y="38" width="56" height="100" rx="10" fill="oklch(0.30 0.02 250)" />
      <rect x="98" y="46" width="44" height="78" rx="4" fill="oklch(0.86 0.07 30)" />
      <path d="M118 78 L132 92 M132 78 L118 92" stroke="oklch(0.96 0.02 80)" strokeWidth="4" strokeLinecap="round" />
      <path d="M50 70 Q 70 60 80 78" stroke="oklch(0.78 0.06 150)" strokeWidth="2" fill="none" />
      <path d="M160 88 Q 184 78 196 96" stroke="oklch(0.78 0.06 150)" strokeWidth="2" fill="none" />
    </Frame>
  );
}

export function Window({}: Props) {
  return (
    <Frame bg="oklch(0.94 0.04 200)">
      <rect x="64" y="34" width="112" height="100" rx="6" fill="oklch(0.97 0.02 80)" stroke="oklch(0.55 0.04 60)" strokeWidth="3" />
      <line x1="120" y1="34" x2="120" y2="134" stroke="oklch(0.55 0.04 60)" strokeWidth="3" />
      <line x1="64" y1="84" x2="176" y2="84" stroke="oklch(0.55 0.04 60)" strokeWidth="3" />
      <circle cx="92" cy="60" r="8" fill="oklch(0.92 0.10 80)" />
      <path d="M64 110 Q 120 96 176 110" stroke="oklch(0.85 0.05 200)" strokeWidth="3" fill="none" />
    </Frame>
  );
}

export function Tea({}: Props) {
  return (
    <Frame bg="oklch(0.94 0.05 150)">
      <path d="M70 70 h80 v36 a24 24 0 0 1 -24 24 h-32 a24 24 0 0 1 -24 -24 z" fill="oklch(0.97 0.02 80)" stroke="oklch(0.55 0.04 60)" strokeWidth="2" />
      <path d="M150 80 q 24 0 24 18 t -24 18" stroke="oklch(0.55 0.04 60)" strokeWidth="3" fill="none" />
      <path d="M96 60 q 4 -10 0 -18 M110 62 q 4 -12 0 -22 M124 60 q 4 -10 0 -18" stroke="oklch(0.78 0.06 150)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </Frame>
  );
}

export function Heart({}: Props) {
  return (
    <Frame bg="oklch(0.94 0.05 25)">
      <path d="M120 132 C 60 96 60 50 92 50 C 108 50 118 64 120 70 C 122 64 132 50 148 50 C 180 50 180 96 120 132 Z" fill="oklch(0.82 0.10 25)" />
      <path d="M104 76 q 8 -10 18 -2" stroke="oklch(0.96 0.02 80)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </Frame>
  );
}

export function Tree({}: Props) {
  return (
    <Frame bg="oklch(0.95 0.04 150)">
      <rect x="114" y="92" width="12" height="40" fill="oklch(0.45 0.04 60)" />
      <circle cx="120" cy="78" r="34" fill="oklch(0.78 0.10 150)" />
      <circle cx="98" cy="86" r="20" fill="oklch(0.80 0.08 150)" />
      <circle cx="142" cy="86" r="20" fill="oklch(0.80 0.08 150)" />
      <path d="M0 138 Q 120 124 240 138 L240 160 L0 160 Z" fill="oklch(0.86 0.06 150)" />
    </Frame>
  );
}

export function Cloud({}: Props) {
  return (
    <Frame bg="oklch(0.95 0.03 240)">
      <ellipse cx="100" cy="80" rx="34" ry="24" fill="oklch(0.97 0.02 240)" />
      <ellipse cx="140" cy="76" rx="40" ry="28" fill="oklch(0.97 0.02 240)" />
      <ellipse cx="170" cy="92" rx="26" ry="18" fill="oklch(0.97 0.02 240)" />
      <path d="M70 110 q 12 -8 20 0 q 12 -8 20 0 q 12 -8 20 0" stroke="oklch(0.85 0.04 240)" strokeWidth="2" fill="none" />
    </Frame>
  );
}

export function Hand({}: Props) {
  return (
    <Frame bg="oklch(0.94 0.05 60)">
      <path d="M88 58 v50 q 0 18 16 22 h32 q 16 -4 16 -22 v-30 h-8 v22 h-4 v-46 h-8 v44 h-4 v-50 h-8 v50 h-4 v-44 h-8 v46 h-4 v-22 h-8 v0 z" fill="oklch(0.86 0.07 30)" stroke="oklch(0.55 0.04 30)" strokeWidth="1.5" />
    </Frame>
  );
}

export function Music({}: Props) {
  return (
    <Frame bg="oklch(0.94 0.05 280)">
      <path d="M104 50 v62 a14 12 0 1 1 -10 -12 v-44 l44 -8 v50 a14 12 0 1 1 -10 -12 v-44 z" fill="oklch(0.55 0.10 280)" />
      <path d="M40 90 q 16 -10 30 0 M170 70 q 16 -10 30 0" stroke="oklch(0.78 0.08 280)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </Frame>
  );
}

export function Bath({}: Props) {
  return (
    <Frame bg="oklch(0.94 0.05 220)">
      <path d="M40 96 h160 v14 a18 18 0 0 1 -18 18 h-124 a18 18 0 0 1 -18 -18 z" fill="oklch(0.97 0.02 80)" stroke="oklch(0.55 0.04 60)" strokeWidth="2" />
      <circle cx="78" cy="78" r="14" fill="oklch(0.92 0.06 220)" opacity="0.7" />
      <circle cx="100" cy="64" r="10" fill="oklch(0.92 0.06 220)" opacity="0.7" />
      <circle cx="120" cy="80" r="8" fill="oklch(0.92 0.06 220)" opacity="0.7" />
      <path d="M170 50 v40" stroke="oklch(0.55 0.04 60)" strokeWidth="3" />
      <path d="M168 90 q 2 6 4 0" stroke="oklch(0.78 0.10 220)" strokeWidth="2" fill="none" />
    </Frame>
  );
}

export function Flower({}: Props) {
  return (
    <Frame bg="oklch(0.94 0.05 340)">
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i * Math.PI) / 3;
        return <ellipse key={i} cx={120 + Math.cos(a) * 18} cy={70 + Math.sin(a) * 18} rx="14" ry="22" fill="oklch(0.85 0.10 340)" transform={`rotate(${(i * 60)} 120 70)`} />;
      })}
      <circle cx="120" cy="70" r="10" fill="oklch(0.88 0.12 80)" />
      <path d="M120 86 q 8 30 0 50" stroke="oklch(0.55 0.08 150)" strokeWidth="3" fill="none" />
      <path d="M120 116 q -16 -8 -22 4" stroke="oklch(0.55 0.08 150)" strokeWidth="3" fill="none" />
    </Frame>
  );
}

export function Bed({}: Props) {
  return (
    <Frame bg="oklch(0.94 0.04 260)">
      <rect x="40" y="100" width="160" height="22" rx="4" fill="oklch(0.55 0.05 25)" />
      <rect x="40" y="80" width="50" height="22" rx="4" fill="oklch(0.97 0.02 80)" stroke="oklch(0.55 0.04 60)" />
      <rect x="40" y="98" width="160" height="6" fill="oklch(0.85 0.04 60)" />
      <path d="M150 56 a 8 8 0 1 0 6 14 a 12 12 0 1 1 -6 -14 z" fill="oklch(0.92 0.06 80)" />
    </Frame>
  );
}

export function Bike({}: Props) {
  return (
    <Frame bg="oklch(0.95 0.04 100)">
      <circle cx="78" cy="108" r="22" fill="none" stroke="oklch(0.40 0.04 25)" strokeWidth="3" />
      <circle cx="170" cy="108" r="22" fill="none" stroke="oklch(0.40 0.04 25)" strokeWidth="3" />
      <path d="M78 108 L120 108 L150 70 L170 108 M120 108 L140 70 L150 70" stroke="oklch(0.78 0.10 25)" strokeWidth="3" fill="none" />
      <circle cx="124" cy="108" r="3" fill="oklch(0.40 0.04 25)" />
    </Frame>
  );
}

export function Salt({}: Props) {
  return (
    <Frame bg="oklch(0.94 0.04 60)">
      <path d="M90 60 h60 v10 h-60 z" fill="oklch(0.55 0.04 60)" />
      <path d="M86 70 h68 l-8 60 a 6 6 0 0 1 -6 6 h-40 a 6 6 0 0 1 -6 -6 z" fill="oklch(0.97 0.02 80)" stroke="oklch(0.55 0.04 60)" strokeWidth="2" />
      {[112, 124, 100, 132, 108, 120].map((x, i) => (
        <circle key={i} cx={x} cy={94 + (i % 2) * 14} r="2" fill="oklch(0.55 0.04 60)" />
      ))}
    </Frame>
  );
}

export function People({}: Props) {
  return (
    <Frame bg="oklch(0.94 0.05 25)">
      <circle cx="92" cy="64" r="10" fill="oklch(0.55 0.06 25)" />
      <path d="M76 110 q 0 -28 16 -28 q 16 0 16 28" fill="oklch(0.78 0.08 25)" />
      <circle cx="148" cy="64" r="10" fill="oklch(0.55 0.06 280)" />
      <path d="M132 110 q 0 -28 16 -28 q 16 0 16 28" fill="oklch(0.78 0.08 280)" />
      <path d="M104 88 q 16 -10 32 0" stroke="oklch(0.55 0.04 60)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </Frame>
  );
}

export const illustrations = {
  Breath, Walk, Journal, Water, Eye, Stretch, Focus, Sun, Plate, Book, Phone, Window,
  Tea, Heart, Tree, Cloud, Hand, Music, Bath, Flower, Bed, Bike, Salt, People,
};
