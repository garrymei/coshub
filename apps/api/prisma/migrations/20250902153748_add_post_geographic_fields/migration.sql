-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "city" VARCHAR(50),
ADD COLUMN     "geohash" VARCHAR(12),
ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "posts_city_idx" ON "posts"("city");
