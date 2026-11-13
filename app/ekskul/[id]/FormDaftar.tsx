"use client";

import { useActionState, useEffect, useState } from "react";
import { daftarEkskul, type HasilPendaftaran } from "@/app/actions";

const hasilAwal: HasilPendaftaran = {
  berhasil: false,
  pesan: "",
  galat: {},
  isian: {
    nama: "",
    kelas: "",
  },
};

type Props = {
  ekskulId: number;
  namaAwal: string;
  kelasAwal: string;
};

export default function FormDaftar({ ekskulId, namaAwal, kelasAwal }: Props) {
  const actionDenganId = daftarEkskul.bind(null, ekskulId);

  const [state, formAction, pending] = useActionState(actionDenganId, {
    ...hasilAwal,
    isian: {
      nama: namaAwal,
      kelas: kelasAwal,
    },
  });

  const [nama, setNama] = useState(namaAwal);
  const [kelas, setKelas] = useState(kelasAwal);

  useEffect(() => {
    setNama(state.isian.nama);
    setKelas(state.isian.kelas);
  }, [state.isian.nama, state.isian.kelas]);

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Daftar ekskul ini</h2>

      <p className="mt-1 text-sm text-slate-500">
        Isi nama dan kelas untuk mendaftar ekstrakurikuler.
      </p>

      <form action={formAction} className="mt-5 space-y-4">
        {/* Kolom Nama */}
        <div>
          <label
            htmlFor="nama"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Nama
          </label>

          <input
            id="nama"
            name="nama"
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            minLength={3}
            disabled={pending}
            placeholder="Masukkan nama lengkap"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 disabled:bg-slate-100"
          />

          {state.galat.nama && (
            <p className="mt-2 text-sm text-red-600">{state.galat.nama}</p>
          )}
        </div>

        {/* Kolom Kelas */}
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
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            required
            minLength={3}
            disabled={pending}
            placeholder="Contoh: XI TKJ 1"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 disabled:bg-slate-100"
          />

          {state.galat.kelas && (
            <p className="mt-2 text-sm text-red-600">{state.galat.kelas}</p>
          )}
        </div>

        {/* Pesan Kesalahan Umum */}
        {state.galat.umum && (
          <p className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
            {state.galat.umum}
          </p>
        )}

        {/* Pesan Berhasil */}
        {state.berhasil && (
          <p className="rounded-xl bg-green-50 p-3 text-sm font-semibold text-green-700">
            {state.pesan}
          </p>
        )}

        {/* Tombol Daftar */}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {pending ? "Memproses..." : "Daftar ekskul ini"}
        </button>
      </form>
    </section>
  );
}
