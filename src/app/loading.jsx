import MultiStepLoader from "@/components/fx/multi-step-loader";

export default function Loading() {
  return (
    <div
      className="flex min-h-[75vh] items-center justify-center px-4 py-16"
      role="status"
      aria-label="Loading — Preparing your booking"
    >
      <span className="sr-only">Loading — Preparing your booking…</span>
      <MultiStepLoader />
    </div>
  );
}
