export default function DashboardLoading() {
  return (
    <div className="flex w-full flex-col gap-6" role="status" aria-label="Loading dashboard">
      <div className="flex flex-col gap-2 border-b border-border pb-4">
        <div className="h-3 w-32 animate-pulse rounded bg-raised" />
        <div className="h-8 w-56 animate-pulse rounded bg-raised" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-[22px] border border-border bg-surface" />
        ))}
      </div>
      <div className="h-72 w-full animate-pulse rounded-[22px] border border-border bg-surface" />
    </div>
  );
}
