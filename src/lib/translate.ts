import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";
const TARGET_LANG = "en";

function hashSource(text: string) {
  return createHash("sha256").update(text).digest("hex");
}

// null = no se pudo traducir (sin API key o falló la llamada). Es importante
// distinguir esto de "traducido con éxito": si cacheáramos el texto original
// como si fuera la traducción, quedaría atascado ahí para siempre aunque
// después se configure/corrija la API key.
async function callDeepLBatch(texts: string[]): Promise<string[] | null> {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) return null;

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
      return null;
    }

    const data: { translations: { text: string }[] } = await res.json();
    return data.translations.map((t) => t.text);
  } catch (error) {
    console.error("Error llamando a DeepL:", error);
    return null;
  }
}

/**
 * Traduce varios textos español -> inglés en un solo lote, usando una caché
 * en base de datos (clave = hash del texto original). Si el texto en /admin
 * cambia, el hash cambia y se dispara una nueva traducción automáticamente.
 * Sin DEEPL_API_KEY configurada (o si la llamada falla), devuelve los textos
 * originales SIN guardarlos en caché, para que se reintente la traducción
 * real la próxima vez en vez de quedar atascado con el texto sin traducir.
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

    if (translatedMissing) {
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
  }

  return texts.map((t, i) => (t?.trim() ? (cacheMap.get(hashes[i]) ?? t) : t));
}
