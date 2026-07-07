import { LoginForm } from "@/components/admin/LoginForm";

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
