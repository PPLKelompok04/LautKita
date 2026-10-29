"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Field, kelasInput } from "@/components/admin/Field";

// Leaflet butuh `window`, jadi peta hanya dirender di browser.
const Peta = dynamic(() => import("./PetaPilihLokasiPeta"), {
  ssr: false,
  loading: () => <div className="h-64 rounded border bg-slate-100" />,
});

// Input latitude & longitude + peta. Klik peta untuk mengisi koordinat.
export default function PetaPilihLokasi({ defaultLat, defaultLng }) {
  const [lat, setLat] = useState(defaultLat ?? "");
  const [lng, setLng] = useState(defaultLng ?? "");

  return (
    <div className="flex flex-col gap-2">
      <Peta
        lat={lat === "" ? null : Number(lat)}
        lng={lng === "" ? null : Number(lng)}
        onPilih={(a, b) => {
          setLat(a.toFixed(6));
          setLng(b.toFixed(6));
        }}
      />
      <p className="text-xs text-slate-500">Klik peta untuk menandai titik lokasi, atau isi koordinat manual.</p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Latitude">
          <input name="latitude" value={lat} onChange={(e) => setLat(e.target.value)} className={kelasInput} />
        </Field>
        <Field label="Longitude">
          <input name="longitude" value={lng} onChange={(e) => setLng(e.target.value)} className={kelasInput} />
        </Field>
      </div>
    </div>
  );
}
