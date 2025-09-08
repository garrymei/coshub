/*
  Warnings:

  - You are about to alter the column `city` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION,
ADD COLUMN     "preferredCity" VARCHAR(50),
ALTER COLUMN "city" SET DATA TYPE VARCHAR(50);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "targetType" VARCHAR(50),
    "targetId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "events_type_idx" ON "events"("type");

-- CreateIndex
CREATE INDEX "events_targetType_idx" ON "events"("targetType");

-- CreateIndex
CREATE INDEX "events_targetId_idx" ON "events"("targetId");

-- CreateIndex
CREATE INDEX "events_createdAt_idx" ON "events"("createdAt");
