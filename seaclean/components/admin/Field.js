// Komponen form yang dipakai di semua halaman admin (gaya mengikuti mockup Figma LAUTKITA).

export const kelasInput =
  "w-full min-h-[38px] rounded-[10px] border border-garis bg-white px-[13px] py-2 text-sm text-teks placeholder:text-redup focus:border-laut focus:outline-none focus:ring-1 focus:ring-laut read-only:bg-latar";

// `wajib` menambahkan tanda * di label seperti di mockup
export function Field({ label, wajib, keterangan, children }) {
  return (
    <label className="flex flex-col gap-[7px]">
      <span className="text-[13px] font-semibold text-teks">
        {label}
        {wajib && " *"}
      </span>
      {children}
      {keterangan && <span className="text-[11px] text-redup">{keterangan}</span>}
    </label>
  );
}

export function Input({ label, wajib, keterangan, ...props }) {
  return (
    <Field label={label} wajib={wajib ?? props.required} keterangan={keterangan}>
      <input className={kelasInput} {...props} />
    </Field>
  );
}

export function Textarea({ label, wajib, keterangan, ...props }) {
  return (
    <Field label={label} wajib={wajib ?? props.required} keterangan={keterangan}>
      <textarea rows={3} className={kelasInput} {...props} />
    </Field>
  );
}

// `opsi` berupa objek { NILAI: "Label" }
export function Select({ label, wajib, keterangan, opsi, kosong, ...props }) {
  return (
    <Field label={label} wajib={wajib ?? props.required} keterangan={keterangan}>
      <select className={kelasInput} {...props}>
        {kosong !== undefined && <option value="">{kosong}</option>}
        {Object.entries(opsi).map(([nilai, teks]) => (
          <option key={nilai} value={nilai}>
            {teks}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Centang({ label, ...props }) {
  return (
    <label className="flex items-center gap-2 text-sm text-teks">
      <input type="checkbox" className="size-4 accent-laut" {...props} />
      {label}
    </label>
  );
}

export function PesanError({ pesan }) {
  if (!pesan) return null;
  return <p className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{pesan}</p>;
}
