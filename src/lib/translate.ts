import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";
const TARGET_LANG = "en";

function hashSource(text: string) {
  return createHash("sha256").update(text).digest("hex");
}

async function callDeepLBatch(texts: string[]): Promise<string[]> {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) return texts;

  try {
    const params = new URLSearchParams();
    texts.forEach((t) => params.append("text", t));
    params.append("source_lang", "ES");
    params.append("target_lang", "EN-US");

    const res = await fetch(DEEPL_API_URL, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!res.ok) {
      console.error("DeepL translation failed:", res.status, await res.text());
      return texts;
    }

    const data: { translations: { text: string }[] } = await res.json();
    return data.translations.map((t) => t.text);
  } catch (error) {
    console.error("Error llamando a DeepL:", error);
    return texts;
  }
}

/**
 * Traduce varios textos español -> inglés en un solo lote, usando una caché
 * en base de datos (clave = hash del texto original). Si el texto en /admin
 * cambia, el hash cambia y se dispara una nueva traducción automáticamente.
 * Sin DEEPL_API_KEY configurada, devuelve los textos originales sin traducir.
 */
export async function translateAllToEnglish(texts: string[]): Promise<string[]> {
  const hashes = texts.map((t) => hashSource(t?.trim() ?? ""));

  const cachedRows = await prisma.translationCache.findMany({
    where: { sourceHash: { in: hashes }, targetLang: TARGET_LANG },
  });
  const cacheMap = new Map(cachedRows.map((r) => [r.sourceHash, r.translated]));

  const missingIndexes: number[] = [];
  const missingTexts: string[] = [];
  texts.forEach((t, i) => {
    if (!t?.trim()) return;
    if (!cacheMap.has(hashes[i])) {
      missingIndexes.push(i);
      missingTexts.push(t.trim());
    }
  });

  if (missingTexts.length > 0) {
    const translatedMissing = await callDeepLBatch(missingTexts);

    await Promise.all(
      missingIndexes.map((idx, j) =>
        prisma.translationCache
          .upsert({
            where: { sourceHash_targetLang: { sourceHash: hashes[idx], targetLang: TARGET_LANG } },
            update: { translated: translatedMissing[j] },
            create: { sourceHash: hashes[idx], targetLang: TARGET_LANG, translated: translatedMissing[j] },
          })
          .catch((error) => console.error("No se pudo guardar la traducción en caché:", error)),
      ),
    );

    missingIndexes.forEach((idx, j) => cacheMap.set(hashes[idx], translatedMissing[j]));
  }

  return texts.map((t, i) => (t?.trim() ? (cacheMap.get(hashes[i]) ?? t) : t));
}
