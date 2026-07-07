import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-foreground">Seguridad</h1>
      <p className="mb-8 text-sm text-muted">Cambia la contraseña de acceso al panel de administración.</p>
      <ChangePasswordForm />
    </div>
  );
}
