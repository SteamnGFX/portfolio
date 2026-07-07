"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="w-full"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await logout();
          router.push("/admin/login");
          router.refresh();
        });
      }}
    >
      {isPending ? "Cerrando..." : "Cerrar sesión"}
    </Button>
  );
}
