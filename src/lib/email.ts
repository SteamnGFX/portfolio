import { Resend } from "resend";

const FROM = "Portafolio <noreply@steamngfx.dev>";

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <p>Recibimos una solicitud para restablecer la contraseña de tu panel de administración.</p>
      <p>
        <a href="${resetUrl}" style="display:inline-block;background:#22d3ee;color:#05070d;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;">
          Restablecer contraseña
        </a>
      </p>
      <p>Este enlace vence en 5 minutos. Si tú no solicitaste esto, ignora este correo.</p>
    </div>
  `;

  if (!apiKey) {
    console.log(`[dev] Email de recuperación (RESEND_API_KEY no configurada) para ${to}:\n${resetUrl}`);
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Restablece tu contraseña",
    html,
  });

  if (error) {
    console.error("No se pudo enviar el correo de recuperación:", error);
    throw new Error("No se pudo enviar el correo");
  }
}
