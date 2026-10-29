"use client";

import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, TileLayer, useMapEvents } from "react-leaflet";

const PUSAT_INDONESIA = [-2.5, 118];

function KlikPeta({ onPilih }) {
  useMapEvents({ click: (e) => onPilih(e.latlng.lat, e.latlng.lng) });
  return null;
}

export default function PetaPilihLokasiPeta({ lat, lng, onPilih }) {
  const ada = Number.isFinite(lat) && Number.isFinite(lng);

  return (
    <MapContainer
      center={ada ? [lat, lng] : PUSAT_INDONESIA}
      zoom={ada ? 12 : 5}
      className="h-64 w-full rounded border z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <KlikPeta onPilih={onPilih} />
      {ada && <CircleMarker center={[lat, lng]} radius={8} pathOptions={{ color: "#0369a1" }} />}
    </MapContainer>
  );
}
