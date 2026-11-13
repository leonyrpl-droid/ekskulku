import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { cookies } from "next/headers";

import { ambilEkskul, ambilAnggota } from "@/data/ambil";
import { JAM_SESI } from "@/data/ekskul";
import FormDaftar from "./FormDaftar";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

// Bagian daftar anggota
async function DaftarAnggota({
  ekskulId,
  kuota,
}: {
  ekskulId: number;
  kuota: number;
}) {
  const [anggota, cookieStore] = await Promise.all([
    ambilAnggota(ekskulId),
    cookies(),
  ]);

  const namaSaya = cookieStore.get("nama")?.value;

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Anggota Terdaftar
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Daftar siswa yang mengikuti ekstrakurikuler ini.
          </p>
        </div>

        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
          {anggota.length} dari {kuota} tempat terisi
        </span>
      </div>

      <div className="mb-5 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{
            width: `${
              kuota > 0 ? Math.min((anggota.length / kuota) * 100, 100) : 0
            }%`,
          }}
        />
      </div>

      {anggota.length === 0 ? (
        <div className="rounded-xl bg-slate-50 p-6 text-center">
          <p className="font-medium text-slate-600">Belum ada anggota.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {anggota.map((item) => {
            const anggotaSaya =
              namaSaya?.trim().toLowerCase() === item.nama.trim().toLowerCase();

            return (
              <div
                key={item.nomor}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                    {item.nama.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800">{item.nama}</p>
                    <p className="text-sm text-slate-500">{item.kelas}</p>
                  </div>
                </div>

                {anggotaSaya && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    Kamu
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

// Halaman detail ekskul
export default async function Page({ params }: Props) {
  const { id } = await params;
  const ekskulId = Number(id);

  if (!Number.isInteger(ekskulId) || ekskulId <= 0) {
    notFound();
  }

  const item = await ambilEkskul(ekskulId);

  if (!item) {
    notFound();
  }

  // Mengambil nama dan kelas dari cookie
  const cookieStore = await cookies();

  const namaAwal = cookieStore.get("nama")?.value ?? "";
  const kelasAwal = cookieStore.get("kelas")?.value ?? "";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/ekskul"
          className="mb-7 inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-800"
        >
          ← Kembali ke Daftar Ekskul
        </Link>

        {/* Informasi detail ekskul */}
        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
              {item.kategori}
            </span>

            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              Kuota {item.kuota} tempat
            </span>
          </div>

          <h1 className="mt-6 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            {item.nama}
          </h1>

          <p className="mt-2 text-slate-500">
            Informasi lengkap kegiatan ekstrakurikuler.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-blue-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Hari Kegiatan
              </p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {item.hari}
              </p>
            </div>

            <div className="rounded-xl bg-purple-50 p-5">
              <p className="text-sm font-medium text-slate-500">Jam Kegiatan</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {JAM_SESI[item.sesi]}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-5">
              <p className="text-sm font-medium text-slate-500">Pembina</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {item.pembina}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Kuota Anggota
              </p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {item.kuota} tempat
              </p>
            </div>
          </div>
        </section>

        {/* Form pendaftaran menggunakan Server Action */}
        <FormDaftar
          ekskulId={item.id}
          namaAwal={namaAwal}
          kelasAwal={kelasAwal}
        />

        {/* Daftar anggota dengan Suspense */}
        <Suspense
          fallback={
            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Anggota Terdaftar
              </h2>
              <p className="mt-4 animate-pulse text-sm text-blue-600">
                Memuat anggota...
              </p>
            </section>
          }
        >
          <DaftarAnggota ekskulId={item.id} kuota={item.kuota} />
        </Suspense>
      </div>
    </main>
  );
}
