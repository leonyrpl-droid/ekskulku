export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 h-8 w-64 animate-pulse rounded-lg bg-gray-200" />

      <p className="mb-6 h-4 w-96 max-w-full animate-pulse rounded bg-gray-200" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="rounded-xl border border-gray-200 p-5 shadow-sm"
          >
            <div className="mb-4 h-5 w-32 animate-pulse rounded bg-gray-200" />
            <div className="mb-3 h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </main>
  );
}
