# Portafolio — Angel Roberto Martínez Castro

Portafolio personal construido con Next.js. Todo el contenido (perfil, experiencia, skills, proyectos, CV) se edita desde un panel `/admin` protegido con login, se guarda en una base de datos Postgres y se publica **al instante, sin necesidad de volver a desplegar**.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** — tema oscuro "tech"
- **Prisma ORM + PostgreSQL** (Neon en producción)
- **NextAuth.js (Auth.js v5)** — login del admin (Credentials)
- **Vercel Blob** — almacenamiento de imágenes de proyectos y el CV en PDF
- **Zod** — validación de formularios
- **Server Actions** de Next.js para las mutaciones del admin

## Requisitos

- Node.js 20+
- Docker (para levantar Postgres en local) — o una base de datos Postgres ya disponible (por ejemplo, un branch de Neon)

## Setup local

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Levanta un Postgres local con Docker:

   ```bash
   docker run -d --name portfolio-postgres \
     -e POSTGRES_USER=portfolio -e POSTGRES_PASSWORD=portfolio -e POSTGRES_DB=portfolio \
     -p 5432:5432 postgres:16-alpine
   ```

3. Copia `.env.example` a `.env` y completa los valores:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL`: `postgresql://portfolio:portfolio@localhost:5432/portfolio?schema=public` (o tu connection string de Neon).
   - `AUTH_SECRET`: genera uno con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
   - `ADMIN_EMAIL`: el correo con el que vas a iniciar sesión en `/admin`.
   - `ADMIN_PASSWORD_HASH`: genera el hash con `npm run hash-password -- "tu-password"` y copia la línea completa (ya viene con los `$` escapados correctamente para el `.env`).
   - `BLOB_READ_WRITE_TOKEN`: puedes dejarlo vacío en local; solo es necesario para subir imágenes/CV (ver sección de despliegue). Sin este token, las imágenes y el CV se guardan en `public/uploads` en tu disco.
   - `NEXT_PUBLIC_SITE_URL`: en local déjalo en `http://localhost:3000`. En producción, cámbialo a tu dominio real (ver sección de SEO).

4. Aplica las migraciones y carga los datos iniciales (tu información de LinkedIn):

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. Levanta el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   - Sitio público: http://localhost:3000
   - Panel admin: http://localhost:3000/admin/login

> ⚠️ **Importante sobre `.env`**: Next.js expande automáticamente cualquier `$algo` dentro de un `.env` como si fuera una variable. Los hashes de bcrypt contienen `$` (ej. `$2b$12$...`), así que si generas un hash a mano, escapa cada `$` como `\$`. El comando `npm run hash-password` ya lo hace por ti.

## Editar el contenido (sin redeploy)

Todo el contenido del sitio vive en la base de datos y se lee en cada request (no hay caché estática de por medio), así que cualquier cambio guardado desde `/admin` se refleja de inmediato en el sitio público:

- **Perfil** (`/admin/profile`): nombre, título, ubicación, "Acerca de", foto, email, LinkedIn, GitHub y CV en PDF.
- **Experiencia y educación** (`/admin/experience`): historial laboral y estudios, con logo de empresa opcional. Se ordenan automáticamente por fecha (la más reciente/actual primero) — no depende del orden en que los captures.
- **Skills** (`/admin/skills`): tecnologías agrupadas por categoría.
- **Proyectos** (`/admin/projects`): galería con varias imágenes por proyecto (se muestran como carrusel si hay más de una), descripción, stack, links a repo/demo y flag de "destacado".

## Analítica

El dashboard (`/admin`) muestra métricas propias, sin servicios externos: visitas totales, visitas de los últimos 7 días, clics en LinkedIn/GitHub/email, descargas de CV, y una gráfica de visitas por día (últimos 14 días). Se registran automáticamente:

- Una "visita" cada vez que alguien carga el sitio público.
- Un evento cuando alguien hace clic en LinkedIn, GitHub, tu email, o descarga el CV.

Los datos viven en las tablas `PageView` y `AnalyticsEvent` de tu base de datos — puedes consultarlos también desde `npm run db:studio` si quieres ver el detalle.

## SEO

El sitio está preparado para indexarse correctamente en buscadores:

- **Metadata dinámica**: título, descripción y Open Graph se generan a partir de tu perfil real (`/admin/profile`), no están hardcodeados.
- **`/sitemap.xml`** y **`/robots.txt`**: generados automáticamente (excluyen `/admin`).
- **Imagen Open Graph** (`/opengraph-image`): se genera dinámicamente con tu nombre y título — así se ve bien al compartir el link en WhatsApp, LinkedIn, Twitter/X, etc.
- **Datos estructurados (JSON-LD)**: schema.org `Person` embebido en la página, para que Google pueda mostrar información enriquecida.

Para que todo esto apunte a tu dominio real y no a `localhost`, **es importante** que configures `NEXT_PUBLIC_SITE_URL` con tu URL de producción en Vercel (ver siguiente sección) — de lo contrario el sitemap, robots.txt y las imágenes Open Graph seguirán apuntando a `localhost:3000`.

Una vez publicado, puedes acelerar que Google lo indexe dándolo de alta en [Google Search Console](https://search.google.com/search-console) (Agregar propiedad → tu dominio → enviar `https://tu-dominio.com/sitemap.xml`).

## Seguridad del login

- **Bloqueo por intentos**: tras 5 intentos fallidos seguidos, el acceso se bloquea 15 minutos.
- **Recuperar contraseña**: en `/admin/login` hay un link "¿Olvidaste tu contraseña?" → pide tu correo → si coincide con el del admin, te llega un email con un enlace válido por **5 minutos** para poner una nueva contraseña.
- **Cambiar contraseña** ya logueado: `/admin/settings`.

La contraseña ya **no vive en una variable de entorno**: `ADMIN_EMAIL`/`ADMIN_PASSWORD_HASH` solo se usan la primera vez para crear el registro en la base de datos; de ahí en adelante se administra desde la propia app (cambiarla no requiere redeploy).

### Configurar el envío de correos (Resend)

El correo de recuperación se envía con [Resend](https://resend.com) (gratis hasta 3,000 correos/mes). Sin `RESEND_API_KEY` configurada, en local el enlace de recuperación simplemente se imprime en la consola del servidor (para poder probar el flujo sin cuenta de Resend).

1. Crea una cuenta gratis en [resend.com](https://resend.com).
2. **Domains** → **Add Domain** → escribe tu dominio (ej. `steamngfx.dev`) → te da registros DNS (TXT/CNAME para SPF/DKIM) que agregas en el DNS de tu dominio (en Vercel: **Domains** en el dashboard de tu cuenta → tu dominio → **DNS Records** — igual que hiciste para la verificación de Google Search Console).
3. Espera a que el dominio quede "Verified" en Resend (unos minutos).
4. **API Keys** → **Create API Key** → cópiala.
5. Agrégala como `RESEND_API_KEY` en tus variables de entorno de Vercel → **Redeploy**.

No necesitas un buzón de correo real ni pagar por uno — esto solo permite *enviar* correos desde `noreply@tu-dominio`, no recibirlos.

## Idioma (español / inglés automático)

El sitio detecta el idioma del navegador del visitante (español por defecto, inglés si su navegador está en inglés) y también trae un selector manual (ES/EN) en la esquina superior derecha — la elección se guarda en una cookie y se respeta en visitas futuras.

**Tú solo escribes el contenido en español en `/admin`, como siempre** — no hay que capturar nada dos veces. Cuando alguien ve el sitio en inglés, el texto (perfil, "Acerca de", experiencia, educación, proyectos) se traduce automáticamente con IA (DeepL) la primera vez, y el resultado se guarda en caché en la base de datos — las siguientes visitas en inglés son instantáneas, sin volver a traducir. Si editas un texto en español, la próxima visita en inglés genera la traducción actualizada sola.

La única excepción es el **CV**: como es un documento con formato (no texto plano), no se traduce automáticamente. En `/admin/profile` puedes subir un CV en español y, opcionalmente, uno en inglés — si no subes el de inglés, se ofrece el de español como respaldo.

### Configurar la traducción automática (DeepL)

Sin `DEEPL_API_KEY`, el sitio en inglés muestra el contenido narrativo tal cual, sin traducir (la interfaz — botones, menú, etiquetas — sí está traducida siempre, eso no depende de DeepL).

1. Crea una cuenta gratis en [deepl.com/pro-api](https://www.deepl.com/pro-api) (plan **DeepL API Free**, 500,000 caracteres/mes gratis — de sobra para un portafolio).
2. En tu cuenta, ve a **Account → API Keys** y copia tu key (termina en `:fx`).
3. Agrégala como `DEEPL_API_KEY` en tus variables de entorno de Vercel → **Redeploy**.

## Despliegue (Vercel + Neon + Vercel Blob)

1. **Crea la base de datos en Neon**: entra a [neon.tech](https://neon.tech), crea un proyecto gratuito y copia el connection string (`DATABASE_URL`).

2. **Sube el repo a GitHub** (si aún no lo has hecho):

   ```bash
   git add -A
   git commit -m "Portafolio inicial"
   git remote add origin <tu-repo-de-github>
   git push -u origin main
   ```

3. **Crea una cuenta en [vercel.com](https://vercel.com)** (puedes entrar con tu cuenta de GitHub) e importa el repositorio.

4. En la configuración del proyecto en Vercel, agrega las variables de entorno (Project Settings → Environment Variables):
   - `DATABASE_URL` (el de Neon)
   - `AUTH_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD_HASH`
   - `NEXT_PUBLIC_SITE_URL`: tu dominio real, ej. `https://tu-proyecto.vercel.app` (actualízalo si luego conectas un dominio propio)
   - `RESEND_API_KEY` (opcional): para que el correo de "recuperar contraseña" se envíe de verdad (ver sección "Seguridad del login")
   - `DEEPL_API_KEY` (opcional): para que el contenido se traduzca automáticamente al inglés (ver sección "Idioma")

5. **Activa Vercel Blob**: en tu proyecto de Vercel, ve a la pestaña **Storage → Create Database → Blob**. Al conectarlo, Vercel agrega automáticamente la variable `BLOB_READ_WRITE_TOKEN` a tu proyecto.

6. Antes del primer deploy, corre las migraciones y el seed apuntando a la base de Neon (puedes hacerlo desde tu máquina cambiando `DATABASE_URL` en tu `.env` local temporalmente, o usando `vercel env pull`):

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

7. Haz deploy (Vercel lo hace automáticamente al importar el repo, y en cada `git push` a `main` después de eso).

Después de este primer deploy, **todo lo demás se edita desde `/admin` en producción** — nunca necesitas volver a desplegar para actualizar contenido.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build de producción |
| `npm run db:migrate` | Aplica migraciones de Prisma |
| `npm run db:seed` | Carga los datos iniciales |
| `npm run db:studio` | Abre Prisma Studio para ver/editar la base de datos directamente |
| `npm run hash-password -- "password"` | Genera el hash bcrypt para `ADMIN_PASSWORD_HASH` |
