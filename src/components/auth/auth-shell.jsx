import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/layout/logo";

const photoColumns = [
  [
    "https://images.unsplash.com/photo-1747004066130-c6531b74d353",
    "https://images.unsplash.com/photo-1775559052522-2f7a4abbce8e",
    "https://images.unsplash.com/photo-1761839257961-4dce65b72d99",
  ],
  [
    "https://images.unsplash.com/photo-1737513915304-a298b4fd5865",
    "https://images.unsplash.com/photo-1579829065292-f19b49bc2b98",
    "https://images.unsplash.com/photo-1677497533660-adca109c2f71",
  ],
  [
    "https://images.unsplash.com/photo-1778066994998-97f74a5bf901",
    "https://images.unsplash.com/photo-1759692071712-adc78a8516c8",
    "https://images.unsplash.com/photo-1563680401337-b77b5e0be9f7",
  ],
];

export default function AuthShell({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex flex-col px-6 py-8 sm:px-12 lg:px-16">
          <Link href="/" className="flex w-fit items-center gap-2 font-semibold">
            <Logo />
            <span>Equipra</span>
          </Link>

          <div className="flex flex-1 items-center py-10">
            <div className="w-full max-w-[430px]">{children}</div>
          </div>
        </div>

        <aside className="relative hidden overflow-hidden lg:block">
          <div className="absolute inset-0 rotate-[-6deg] scale-110">
            <div className="grid h-full grid-cols-3 gap-3 p-3">
              {photoColumns.map((column, columnIndex) => (
                <div
                  key={columnIndex}
                  className={
                    columnIndex === 1
                      ? "flex flex-col gap-3 pt-16"
                      : "flex flex-col gap-3"
                  }
                >
                  {column.map((src) => (
                    <div
                      key={src}
                      className="relative aspect-[4/5] overflow-hidden rounded-[14px]"
                    >
                      <Image
                        src={`${src}?w=600&q=70&auto=format&fit=crop`}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 16vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent dark:via-background/70 dark:to-background/20" />

          <div className="relative flex h-full flex-col justify-end gap-4 p-10">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary dark:text-[#FF8A57]">
              1,240+ approved listings
            </p>
            <p className="max-w-sm bg-gradient-to-b from-foreground to-muted bg-clip-text text-4xl font-bold leading-tight tracking-[-0.045em] text-transparent">
              One account. Rent gear or list your own.
            </p>
            <figure className="mt-4 rounded-[22px] border border-border/60 bg-background/70 p-5 backdrop-blur">
              <blockquote className="text-sm leading-relaxed text-foreground">
                &ldquo;Listed two generators on a Friday. Both were booked by
                Monday.&rdquo;
              </blockquote>
              <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
                Rakib U. &middot; Owner &middot; Narayanganj
              </figcaption>
            </figure>
          </div>
        </aside>
      </div>
    </div>
  );
}
