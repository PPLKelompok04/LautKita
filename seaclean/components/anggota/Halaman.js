import NavAnggota from "./NavAnggota";

// kerangka halaman anggota: header + konten di tengah
export function HalamanAnggota({ judul, keterangan, children }) {
  return (
    <div className="flex-1 bg-latar">
      <NavAnggota />
      <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-5">
        {judul && (
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold text-teks">{judul}</h1>
            {keterangan && <p className="text-[13px] text-redup">{keterangan}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
