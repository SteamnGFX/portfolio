import { getProfile } from "@/lib/data";
import { ProfileForm } from "@/components/admin/ProfileForm";

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-foreground">Perfil</h1>
      <p className="mb-8 text-sm text-muted">Información general mostrada en el hero y la sección &quot;Acerca de&quot;.</p>
      <ProfileForm profile={profile} />
    </div>
  );
}
