
export type Kategori =
  | "Olahraga"
  | "Seni"
  | "Akademik"
  | "Teknologi";

export type Ekskul = {
  id: number;
  nama: string;
  kategori: Kategori;
  hari: string;
  sesi: number; // 1 atau 2
  kuota: number;
  pembina: string;
};

export type Pendaftar = {
  nomor: number;
  ekskulId: number;
  nama: string;
  kelas: string;
};

export const DAFTAR_KATEGORI: Kategori[] = [
  "Olahraga",
  "Seni",
  "Akademik",
  "Teknologi",
];

export const DAFTAR_HARI = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
];

export const JAM_SESI: Record<number, string> = {
  1: "15.00-16.30",
  2: "16.30-18.00",
};

export const ekskul: Ekskul[] = [
  {
    id: 1,
    nama: "Basket",
    kategori: "Olahraga",
    hari: "Senin",
    sesi: 1,
    kuota: 30,
    pembina: "Pak Andi",
  },
  {
    id: 2,
    nama: "Futsal",
    kategori: "Olahraga",
    hari: "Rabu",
    sesi: 1,
    kuota: 20,
    pembina: "Pak Bima",
  },
  {
    id: 3,
    nama: "Paduan Suara",
    kategori: "Seni",
    hari: "Senin",
    sesi: 2,
    kuota: 25,
    pembina: "Bu Wulan",
  },
  {
    id: 4,
    nama: "Robotik",
    kategori: "Teknologi",
    hari: "Selasa",
    sesi: 2,
    kuota: 12,
    pembina: "Pak Budi",
  },
  {
    id: 5,
    nama: "Jurnalistik",
    kategori: "Akademik",
    hari: "Kamis",
    sesi: 1,
    kuota: 18,
    pembina: "Bu Sari",
  },
];

export const pendaftar: Pendaftar[] = [
  { nomor: 1, ekskulId: 1, nama: "Alya", kelas: "XII A" },
  { nomor: 2, ekskulId: 1, nama: "Budi", kelas: "XI B" },
  { nomor: 3, ekskulId: 2, nama: "Citra", kelas: "XII C" },
  { nomor: 4, ekskulId: 3, nama: "Danu", kelas: "X A" },
  { nomor: 5, ekskulId: 4, nama: "Eka", kelas: "XI A" },
  { nomor: 6, ekskulId: 5, nama: "Fajar", kelas: "XII B" },
];

export function tambahPendaftar({
  ekskulId,
  nama,
  kelas,
}: {
  ekskulId: number;
  nama: string;
  kelas: string;
}) {
  const nomorTerakhir = pendaftar.reduce(
    (nomorTertinggi, item) => Math.max(nomorTertinggi, item.nomor),
    0,
  );

  const baru: Pendaftar = {
    nomor: nomorTerakhir + 1,
    ekskulId,
    nama,
    kelas,
  };

  pendaftar.push(baru);

  return baru;
}