import { ResetPasswordForm } from "@/components/admin/ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="bg-grid flex min-h-screen flex-1 items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface/60 p-8 backdrop-blur-sm">
        <p className="mb-1 font-mono text-sm text-accent">$ reset --password</p>
        <h1 className="mb-6 text-xl font-semibold text-foreground">Nueva contraseña</h1>
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <p className="text-sm text-red-400">Enlace inválido. Solicita uno nuevo desde la página de login.</p>
        )}
      </div>
    </div>
  );
}
