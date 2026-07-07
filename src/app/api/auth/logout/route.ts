import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Route Handler plano (no Server Action) para cerrar sesión: un <form> normal
// que hace POST aquí y recibe un redirect con la cookie ya borrada en la misma
// respuesta HTTP. No depende de JavaScript del cliente ni de React, así que
// funciona sin importar el estado de hidratación de la página.
export const dynamic = "force-dynamic";

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
  // Sin esto, algunas capas de caché (CDN de Vercel incluida) pueden tratar la
  // respuesta como pública/cacheable y descartar el Set-Cookie por seguridad.
  response.headers.set("Cache-Control", "no-store, must-revalidate");

  for (const name of COOKIES_TO_CLEAR) {
    // Las cookies con prefijo __Secure-/__Host- exigen el atributo `secure`
    // en CUALQUIER Set-Cookie para ese nombre — incluido al borrarlas — o el
    // navegador descarta la instrucción entera y la cookie sigue viva.
    const isSecurePrefixed = name.startsWith("__Secure-") || name.startsWith("__Host-");
    response.cookies.set(name, "", {
      expires: new Date(0),
      path: "/",
      secure: isSecurePrefixed,
    });
  }

  return response;
}
