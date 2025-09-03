-- CreateEnum
CREATE TYPE "BannerScene" AS ENUM ('FEED', 'SKILLS', 'HOME');

-- CreateEnum
CREATE TYPE "BannerLinkType" AS ENUM ('EXTERNAL', 'INTERNAL');

-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "scene" "BannerScene" NOT NULL,
    "imageUrl" VARCHAR(500) NOT NULL,
    "linkType" "BannerLinkType" NOT NULL,
    "linkUrl" VARCHAR(500) NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "online" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "banners_scene_idx" ON "banners"("scene");

-- CreateIndex
CREATE INDEX "banners_online_idx" ON "banners"("online");

-- CreateIndex
CREATE INDEX "banners_priority_idx" ON "banners"("priority");

-- CreateIndex
CREATE INDEX "banners_createdAt_idx" ON "banners"("createdAt");
