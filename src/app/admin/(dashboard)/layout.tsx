import Link from "next/link";
import { logout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profile", label: "Perfil" },
  { href: "/admin/experience", label: "Experiencia y educación" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/projects", label: "Proyectos" },
  { href: "/admin/settings", label: "Seguridad" },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 flex-col sm:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-border bg-surface/40 sm:w-56 sm:border-b-0 sm:border-r">
        <div className="px-5 py-5">
          <p className="font-mono text-xs text-accent">admin@portafolio</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2.5 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 p-3">
          <Link
            href="/"
            target="_blank"
            className="rounded-md px-2.5 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            Ver sitio público →
          </Link>
          <form action={logout}>
            <Button type="submit" variant="secondary" size="sm" className="w-full">
              Cerrar sesión
            </Button>
          </form>
        </div>
      </aside>
      <main className="flex-1 px-6 py-8 sm:px-10">{children}</main>
    </div>
  );
}
