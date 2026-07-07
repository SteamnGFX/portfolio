export function Footer({ name }: { name: string }) {
  return (
    <footer className="border-t border-border/60 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 text-center text-xs text-muted sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {name}
        </p>
        <p className="font-mono">Construido con Next.js, Tailwind CSS y Prisma</p>
      </div>
    </footer>
  );
}
