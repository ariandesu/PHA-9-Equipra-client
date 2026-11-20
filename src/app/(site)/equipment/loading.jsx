export default function EquipmentLoading() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-16" role="status" aria-label="Loading equipment">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
        <div className="h-4 w-40 animate-pulse rounded bg-raised" />
        <div className="h-10 w-72 animate-pulse rounded bg-raised" />
        <div className="h-4 w-full max-w-md animate-pulse rounded bg-raised" />
      </div>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex h-[400px] animate-pulse flex-col overflow-hidden rounded-[22px] border border-border bg-surface"
          >
            <div className="aspect-[4/3] w-full bg-raised" />
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="h-4 w-20 rounded bg-raised" />
              <div className="h-6 w-3/4 rounded bg-raised" />
              <div className="mt-auto h-8 w-24 rounded bg-raised" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
