export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-32 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
        <span aria-hidden="true">●</span> Rent the yard
      </p>
      <h1 className="text-5xl font-bold tracking-[-0.055em] sm:text-6xl">
        Equipra
      </h1>
      <p className="max-w-md text-base leading-relaxed text-muted">
        Design tokens, fonts and providers are wired. The home page sections
        land in milestone 5.
      </p>
    </main>
  );
}
