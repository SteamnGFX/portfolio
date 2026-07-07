-- Experience: logo de la empresa
ALTER TABLE "Experience" ADD COLUMN "logoUrl" TEXT;

-- Project: múltiples imágenes en vez de una sola
ALTER TABLE "Project" ADD COLUMN "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Preservar la imagen existente (si la había) dentro del nuevo arreglo
UPDATE "Project" SET "images" = ARRAY["imageUrl"] WHERE "imageUrl" IS NOT NULL AND "imageUrl" != '';

ALTER TABLE "Project" DROP COLUMN "imageUrl";
