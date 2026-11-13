
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import {
  ambilEkskul,
  ambilAnggota,
} from "@/data/ambil";

import {
  JAM_SESI,
  tambahPendaftar,
} from "@/data/ekskul";

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
              kuota > 0
                ? Math.min((anggota.length / kuota) * 100, 100)
                : 0
            }%`,
          }}
        />
      </div>

      {anggota.length === 0 ? (
        <div className="rounded-xl bg-slate-50 p-6 text-center">
          <p className="font-medium text-slate-600">
            Belum ada anggota.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {anggota.map((item) => {
            const anggotaSaya =
              namaSaya?.trim().toLowerCase() ===
              item.nama.trim().toLowerCase();

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
                    <p className="font-semibold text-slate-800">
                      {item.nama}
                    </p>

                    <p className="text-sm text-slate-500">
                      {item.kelas}
                    </p>
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

  const ekskulTerpilih = item;

  // Proses menambahkan anggota
  async function tambahAnggota(formData: FormData) {
    "use server";

    const nama = String(formData.get("nama") ?? "").trim();
    const kelas = String(formData.get("kelas") ?? "").trim();

    if (!nama || !kelas) {
      return;
    }

    const anggotaSekarang = await ambilAnggota(ekskulTerpilih.id);

    // Periksa apakah kuota masih tersedia
    if (anggotaSekarang.length >= ekskulTerpilih.kuota) {
      return;
    }

    // Simpan anggota baru
    tambahPendaftar({
      ekskulId: ekskulTerpilih.id,
      nama,
      kelas,
    });

    // Simpan nama ke cookie
    const cookieStore = await cookies();

    cookieStore.set("nama", nama, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    // Perbarui halaman detail
    revalidatePath(`/ekskul/${ekskulTerpilih.id}`);
  }

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
              {ekskulTerpilih.kategori}
            </span>

            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              Kuota {ekskulTerpilih.kuota} tempat
            </span>
          </div>

          <h1 className="mt-6 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            {ekskulTerpilih.nama}
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
                {ekskulTerpilih.hari}
              </p>
            </div>

            <div className="rounded-xl bg-purple-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Jam Kegiatan
              </p>

              <p className="mt-2 text-lg font-bold text-slate-900">
                {JAM_SESI[ekskulTerpilih.sesi]}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Pembina
              </p>

              <p className="mt-2 text-lg font-bold text-slate-900">
                {ekskulTerpilih.pembina}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Kuota Anggota
              </p>

              <p className="mt-2 text-lg font-bold text-slate-900">
                {ekskulTerpilih.kuota} tempat
              </p>
            </div>
          </div>
        </section>

        {/* Form tambah anggota */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Tambah Anggota
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Isi nama dan kelas siswa untuk mendaftarkan anggota baru.
          </p>

          <form action={tambahAnggota} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="nama"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Nama Anggota
              </label>

              <input
                id="nama"
                name="nama"
                type="text"
                required
                placeholder="Masukkan nama anggota"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="kelas"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Kelas
              </label>

              <input
                id="kelas"
                name="kelas"
                type="text"
                required
                placeholder="Contoh: XII RPL 1"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              + Tambah Anggota
            </button>
          </form>
        </section>

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
          <DaftarAnggota
            ekskulId={ekskulTerpilih.id}
            kuota={ekskulTerpilih.kuota}
          />
        </Suspense>

      </div>
    </main>
  );
}
