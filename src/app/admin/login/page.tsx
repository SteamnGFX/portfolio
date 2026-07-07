import { LoginForm } from "@/components/admin/LoginForm";

// Fuerza esta página a no ser estática: cuando es el destino de un redirect
// desde un Server Action que también limpia una cookie (logout), una versión
// estática cacheada de esta página puede hacer que Next.js descarte el
// header Set-Cookie de esa respuesta combinada.
export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <div className="bg-grid flex min-h-screen flex-1 items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface/60 p-8 backdrop-blur-sm">
        <p className="mb-1 font-mono text-sm text-accent">$ sudo login</p>
        <h1 className="mb-6 text-xl font-semibold text-foreground">Panel de administración</h1>
        <LoginForm />
      </div>
    </div>
  );
}
