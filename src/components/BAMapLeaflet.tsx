import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { EventItem } from "@/lib/events";

// Fix default marker icons (Vite asset paths)
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function Recenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center[0], center[1]]);
  return null;
}

export function BAMapLeaflet({
  center,
  events,
  radiusMeters = 5000,
  onPick,
}: {
  center: { lat: number; lng: number };
  events: EventItem[];
  radiusMeters?: number;
  onPick?: (e: EventItem) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <div className="absolute inset-0 bg-gradient-calm" />;
  }
  const pos: [number, number] = [center.lat, center.lng];
  const radiusKm = radiusMeters / 1000;
  const nearby = events.filter(
    (e) => haversineKm(center, e) <= radiusKm,
  );

  return (
    <MapContainer
      center={pos}
      zoom={13}
      scrollWheelZoom={false}
      className="absolute inset-0 h-full w-full"
    >
      <Recenter center={pos} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Circle
        center={pos}
        radius={radiusMeters}
        pathOptions={{ color: "#10b981", fillColor: "#10b981", fillOpacity: 0.1 }}
      />
      <Marker position={pos}>
        <Popup>Estás aquí</Popup>
      </Marker>
      {nearby.map((e) => (
        <Marker
          key={e.id}
          position={[e.lat, e.lng]}
          eventHandlers={{
            click: () => onPick?.(e),
          }}
        >
          <Popup>
            <strong>{e.title}</strong>
            <br />
            {e.venue}
            <br />
            <span>{haversineKm(center, e).toFixed(2)} km</span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
