import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white px-8 py-16 text-center shadow-lg sm:px-12">
        <div className="mb-6 inline-block rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
          Website Ekstrakurikuler Sekolah
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Selamat Datang di <span className="text-blue-600">EkskulKu</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Temukan kegiatan ekstrakurikuler favoritmu, kembangkan bakat, dan raih
          pengalaman baru bersama teman-teman di sekolah.
        </p>

        <div className="mt-10">
          <Link
            href="/ekskul"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white shadow-md transition hover:bg-blue-700"
          >
            Lihat Daftar Ekskul
            <span>→</span>
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-blue-50 p-5">
            <p className="text-2xl font-bold text-blue-700">Olahraga</p>
            <p className="mt-1 text-sm text-slate-600">
              Kembangkan kemampuan fisik
            </p>
          </div>

          <div className="rounded-xl bg-purple-50 p-5">
            <p className="text-2xl font-bold text-purple-700">Seni</p>
            <p className="mt-1 text-sm text-slate-600">
              Salurkan kreativitasmu
            </p>
          </div>

          <div className="rounded-xl bg-green-50 p-5">
            <p className="text-2xl font-bold text-green-700">Teknologi</p>
            <p className="mt-1 text-sm text-slate-600">Pelajari hal baru</p>
          </div>
        </div>
      </div>
    </main>
  );
}
