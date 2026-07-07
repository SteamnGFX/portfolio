import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Route Handler plano (no Server Action) para cerrar sesión: un <form> normal
// que hace POST aquí y recibe un redirect con la cookie ya borrada en la misma
// respuesta HTTP. No depende de JavaScript del cliente ni de React, así que
// funciona sin importar el estado de hidratación de la página.
const COOKIES_TO_CLEAR = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "authjs.csrf-token",
  "__Host-authjs.csrf-token",
  "authjs.callback-url",
  "__Secure-authjs.callback-url",
];

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url), { status: 303 });
  for (const name of COOKIES_TO_CLEAR) {
    response.cookies.delete(name);
  }
  return response;
}
