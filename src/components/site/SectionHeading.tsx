export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-10 flex items-baseline gap-3">
      <span className="font-mono text-sm text-accent">{eyebrow}</span>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
