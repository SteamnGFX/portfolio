import { put, del } from "@vercel/blob";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

// Sin BLOB_READ_WRITE_TOKEN (típico en desarrollo local sin cuenta de Vercel aún),
// guardamos los archivos subidos en public/uploads en vez de Vercel Blob.
// En producción (con el token configurado) se usa Vercel Blob normalmente.
const useLocalStorage = !process.env.BLOB_READ_WRITE_TOKEN;

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

async function uploadSingle(file: File, prefix: string): Promise<string> {
  if (useLocalStorage) {
    const dir = path.join(process.cwd(), "public", "uploads", prefix);
    await mkdir(dir, { recursive: true });
    const filename = `${Date.now()}-${sanitizeFilename(file.name)}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), buffer);
    return `/uploads/${prefix}/${filename}`;
  }

  const blob = await put(`${prefix}/${Date.now()}-${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return blob.url;
}

export async function uploadIfPresent(entry: FormDataEntryValue | null, prefix: string) {
  if (!(entry instanceof File) || entry.size === 0) return undefined;
  return uploadSingle(entry, prefix);
}

export async function uploadMultiple(entries: FormDataEntryValue[], prefix: string): Promise<string[]> {
  const files = entries.filter((entry): entry is File => entry instanceof File && entry.size > 0);
  const uploads: string[] = [];
  for (const file of files) {
    uploads.push(await uploadSingle(file, prefix));
  }
  return uploads;
}

export async function deleteBlobSafe(url: string | null | undefined) {
  if (!url) return;

  if (url.startsWith("/uploads/")) {
    try {
      await unlink(path.join(process.cwd(), "public", url));
    } catch (error) {
      console.error("No se pudo borrar el archivo local anterior:", error);
    }
    return;
  }

  try {
    await del(url);
  } catch (error) {
    console.error("No se pudo borrar el blob anterior:", error);
  }
}
