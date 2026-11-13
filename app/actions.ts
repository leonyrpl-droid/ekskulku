"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { ekskul, pendaftar, JAM_SESI, tambahPendaftar } from "@/data/ekskul";

export type HasilPendaftaran = {
  berhasil: boolean;
  pesan: string;
  galat: {
    nama?: string;
    kelas?: string;
    umum?: string;
  };
  isian: {
    nama: string;
    kelas: string;
  };
};

export async function daftarEkskul(
  ekskulId: number,
  _state: HasilPendaftaran,
  formData: FormData,
): Promise<HasilPendaftaran> {
  const nama = String(formData.get("nama") ?? "").trim();
  const kelas = String(formData.get("kelas") ?? "").trim();

  // Menyimpan isian dan pesan kesalahan.
  const gagal = (
    pesan: string,
    galat: HasilPendaftaran["galat"] = {},
  ): HasilPendaftaran => ({
    berhasil: false,
    pesan,
    galat: pesan ? { ...galat, umum: pesan } : galat,
    isian: { nama, kelas },
  });

  // 1. Validasi nama dan kelas.
  if (nama.length < 3) {
    return gagal("", {
      nama: "Nama harus terdiri dari minimal 3 karakter.",
    });
  }

  if (kelas.length < 3) {
    return gagal("", {
      kelas: "Kelas harus terdiri dari minimal 3 karakter.",
    });
  }

  // 2. Periksa pendaftaran ganda.
  const sudahTerdaftar = pendaftar.some(
    (item) =>
      item.ekskulId === ekskulId &&
      item.nama.toLowerCase() === nama.toLowerCase() &&
      item.kelas.toLowerCase() === kelas.toLowerCase(),
  );

  if (sudahTerdaftar) {
    return gagal("Kamu sudah terdaftar di ekskul ini.");
  }

  // Cari ekskul yang dipilih.
  const itemEkskul = ekskul.find((item) => item.id === ekskulId);

  // 3. Periksa kuota.
  if (itemEkskul) {
    const jumlahAnggota = pendaftar.filter(
      (item) => item.ekskulId === ekskulId,
    ).length;

    if (jumlahAnggota >= itemEkskul.kuota) {
      return gagal("Maaf, kuota ekskul ini sudah penuh.");
    }

    // 4. Periksa bentrok jadwal.
    const jadwalBentrok = pendaftar.find((anggota) => {
      const ekskulLain = ekskul.find((item) => item.id === anggota.ekskulId);

      return (
        anggota.ekskulId !== ekskulId &&
        anggota.nama.toLowerCase() === nama.toLowerCase() &&
        anggota.kelas.toLowerCase() === kelas.toLowerCase() &&
        ekskulLain?.hari === itemEkskul.hari &&
        ekskulLain?.sesi === itemEkskul.sesi
      );
    });

    if (jadwalBentrok) {
      const ekskulBentrok = ekskul.find(
        (item) => item.id === jadwalBentrok.ekskulId,
      );

      return gagal(
        `Jadwal bentrok dengan ${ekskulBentrok?.nama} (${ekskulBentrok?.hari}, sesi ${ekskulBentrok?.sesi}).`,
      );
    }
  }

  // 5. Tolak ID ekskul yang tidak valid.
  if (!Number.isInteger(ekskulId) || !itemEkskul) {
    return gagal("Ekskul yang dipilih tidak valid.");
  }

  // Simpan pendaftaran baru.
  const anggotaBaru = tambahPendaftar({
    ekskulId,
    nama,
    kelas,
  });

  // Simpan nama dan kelas ke cookie.
  const cookieStore = await cookies();

  const pilihanCookie = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };

  cookieStore.set("nama", nama, pilihanCookie);
  cookieStore.set("kelas", kelas, pilihanCookie);

  // Perbarui halaman daftar dan detail.
  revalidatePath("/ekskul");
  revalidatePath(`/ekskul/${ekskulId}`);

  // Buat pesan keberhasilan.
  const jam = (JAM_SESI[itemEkskul.sesi] ?? "").replace("-", "–");

  return {
    berhasil: true,
    pesan: `Pendaftaran #${anggotaBaru.nomor} berhasil: ${itemEkskul.nama}, ${itemEkskul.hari}, sesi ${itemEkskul.sesi} (${jam}).`,
    galat: {},
    isian: { nama, kelas },
  };
}
