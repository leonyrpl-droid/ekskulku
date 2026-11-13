"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <h2 className="mb-3 text-2xl font-bold text-red-600">
        Terjadi Kesalahan
      </h2>

      <p className="mb-6 text-gray-600">
        {error.message || "Maaf, terjadi kesalahan saat memuat data ekskul."}
      </p>

      <button
        onClick={() => reset()}
        className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
      >
        Coba lagi
      </button>
    </main>
  );
}
