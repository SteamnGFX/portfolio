import type { Dictionary } from "@/lib/dictionary";

export function Footer({ name, dict }: { name: string; dict: Dictionary }) {
  return (
    <footer className="border-t border-border/60 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 text-center text-xs text-muted sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {name}
        </p>
        <p className="font-mono">{dict.footer.builtWith}</p>
      </div>
    </footer>
  );
}
