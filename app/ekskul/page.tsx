import Link from "next/link";
import { ambilSemuaEkskul } from "@/data/ambil";
import {
  DAFTAR_KATEGORI,
  DAFTAR_HARI,
  JAM_SESI,
  pendaftar,
} from "@/data/ekskul";

export const metadata = {
  title: "Daftar Ekskul",
};

type Props = {
  searchParams: Promise<{
    kategori?: string;
    hari?: string;
  }>;
};

export default async function HalamanEkskul({ searchParams }: Props) {
  const params = await searchParams;

  const kategoriDipilih = DAFTAR_KATEGORI.includes(
    params.kategori as (typeof DAFTAR_KATEGORI)[number],
  )
    ? params.kategori!
    : "";

  const hariDipilih = DAFTAR_HARI.includes(
    params.hari as (typeof DAFTAR_HARI)[number],
  )
    ? params.hari!
    : "";

  const semuaEkskul = await ambilSemuaEkskul();

  const ekskulTampil = semuaEkskul.filter((item) => {
    const cocokKategori = !kategoriDipilih || item.kategori === kategoriDipilih;

    const cocokHari = !hariDipilih || item.hari === hariDipilih;

    return cocokKategori && cocokHari;
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Daftar Ekstrakurikuler
        </h1>
        <p className="mt-2 text-slate-600">
          Temukan dan pilih kegiatan ekstrakurikuler yang kamu sukai.
        </p>
      </div>

      {/* Form saringan */}
      <form
        method="GET"
        action="/ekskul"
        className="mb-8 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label
            htmlFor="kategori"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Saring Kategori
          </label>

          <select
            id="kategori"
            name="kategori"
            defaultValue={kategoriDipilih}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="">Semua kategori</option>
            {DAFTAR_KATEGORI.map((kategori) => (
              <option key={kategori} value={kategori}>
                {kategori}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label
            htmlFor="hari"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Saring Hari
          </label>

          <select
            id="hari"
            name="hari"
            defaultValue={hariDipilih}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="">Semua hari</option>
            {DAFTAR_HARI.map((hari) => (
              <option key={hari} value={hari}>
                {hari}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Terapkan Saringan
        </button>

        <Link
          href="/ekskul"
          className="rounded-lg border border-slate-300 px-6 py-3 text-center font-semibold text-slate-700 hover:bg-slate-100"
        >
          Reset
        </Link>
      </form>

      {/* Daftar kartu ekskul */}
      {ekskulTampil.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <p className="text-lg font-semibold text-slate-700">
            Tidak ada ekskul yang cocok.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Coba ubah kategori atau hari yang dipilih.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ekskulTampil.map((item) => {
            const jumlahPendaftar = pendaftar.filter(
              (p) => p.ekskulId === item.id,
            ).length;

            const sisaTempat = item.kuota - jumlahPendaftar;
            const jam = JAM_SESI[item.sesi];

            return (
              <article
                key={item.id}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="mb-3 w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {item.kategori}
                </span>

                <h2 className="text-xl font-bold text-slate-900">
                  {item.nama}
                </h2>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>📅 Hari: {item.hari}</p>
                  <p>🕒 Sesi: {jam}</p>
                  <p>👨‍🏫 Pembina: {item.pembina}</p>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  {sisaTempat > 0 ? (
                    <p className="font-semibold text-green-600">
                      Sisa {sisaTempat} dari {item.kuota} tempat
                    </p>
                  ) : (
                    <p className="font-semibold text-red-600">Penuh</p>
                  )}
                </div>

                <Link
                  href={`/ekskul/${item.id}`}
                  className="mt-5 rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
                >
                  Lihat Detail
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
