export default function Home() {
  return (
    <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-4 px-4 py-32 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
        <span aria-hidden="true">●</span> Rent the yard
      </p>
      <h1 className="bg-gradient-to-b from-foreground to-muted bg-clip-text text-5xl font-bold tracking-[-0.055em] text-transparent sm:text-6xl">
        Equipra
      </h1>
      <p className="max-w-md text-base leading-relaxed text-muted">
        Design tokens, fonts, providers and the layout shell are wired. Home
        page sections land in milestone 5.
      </p>
    </div>
  );
}
