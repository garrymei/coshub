-- AlterTable
ALTER TABLE "skill_posts" ADD COLUMN     "geohash" VARCHAR(16),
ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "skill_posts_geohash_idx" ON "skill_posts"("geohash");
