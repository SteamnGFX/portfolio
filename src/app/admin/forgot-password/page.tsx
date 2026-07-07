import Link from "next/link";
import { ForgotPasswordForm } from "@/components/admin/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="bg-grid flex min-h-screen flex-1 items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface/60 p-8 backdrop-blur-sm">
        <p className="mb-1 font-mono text-sm text-accent">$ reset --password</p>
        <h1 className="mb-2 text-xl font-semibold text-foreground">Recuperar contraseña</h1>
        <p className="mb-6 text-sm text-muted">
          Escribe el correo del administrador. Si coincide, te enviamos un enlace válido por 5 minutos.
        </p>
        <ForgotPasswordForm />
        <Link href="/admin/login" className="mt-6 block text-center text-sm text-muted hover:text-foreground">
          ← Volver al login
        </Link>
      </div>
    </div>
  );
}
