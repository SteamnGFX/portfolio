"use client";

import { useState, type InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export function PasswordInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input type={visible ? "text" : "password"} className={cn("pr-16", className)} {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted hover:text-foreground"
        tabIndex={-1}
      >
        {visible ? "Ocultar" : "Mostrar"}
      </button>
    </div>
  );
}
