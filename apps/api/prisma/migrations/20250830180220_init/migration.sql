-- CreateEnum
CREATE TYPE "UserLevel" AS ENUM ('NEWBIE', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL', 'EXPERT');

-- CreateEnum
CREATE TYPE "SkillCategory" AS ENUM ('COSPLAY', 'PHOTOGRAPHY', 'MAKEUP', 'PROP_MAKING', 'COSTUME_MAKING', 'POST_PROCESSING', 'VIDEO_EDITING', 'VOICE_ACTING', 'DRAWING', 'WRITING', 'DANCING', 'SINGING');

-- CreateEnum
CREATE TYPE "SkillRole" AS ENUM ('COSER', 'PHOTOGRAPHER', 'MAKEUP_ARTIST', 'PROP_MAKER', 'COSTUME_MAKER', 'LOCATION_OWNER', 'POST_PROCESSOR', 'VIDEOGRAPHER', 'ORGANIZER');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('NEWBIE', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'DELETED');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('COSPLAY', 'SKILL', 'COLLABORATION', 'EVENT');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'CLOSED');

-- CreateEnum
CREATE TYPE "UrgencyLevel" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('SHARE', 'DISCUSSION', 'TUTORIAL', 'NEWS', 'EVENT');

-- CreateEnum
CREATE TYPE "PostCategory" AS ENUM ('COSPLAY_SHOW', 'TUTORIAL', 'EVENT_REPORT', 'DISCUSSION', 'NEWS', 'RESOURCE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nickname" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "level" "UserLevel" NOT NULL DEFAULT 'NEWBIE',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "reputation" INTEGER NOT NULL DEFAULT 100,
    "city" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "followerCount" INTEGER NOT NULL DEFAULT 0,
    "followingCount" INTEGER NOT NULL DEFAULT 0,
    "wechat" TEXT,
    "qq" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_posts" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "category" "SkillCategory" NOT NULL,
    "role" "SkillRole" NOT NULL,
    "experience" "ExperienceLevel" NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "price" JSONB NOT NULL,
    "images" TEXT[],
    "tags" TEXT[],
    "availability" JSONB NOT NULL,
    "contactInfo" JSONB NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'ACTIVE',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "favoriteCount" INTEGER NOT NULL DEFAULT 0,
    "contactCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "responseRate" INTEGER NOT NULL DEFAULT 100,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "skill_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "type" "RequestType" NOT NULL,
    "category" "SkillCategory",
    "city" VARCHAR(50),
    "budget" JSONB,
    "deadline" TIMESTAMP(3),
    "urgency" "UrgencyLevel" NOT NULL DEFAULT 'NORMAL',
    "images" TEXT[],
    "tags" TEXT[],
    "status" "RequestStatus" NOT NULL DEFAULT 'OPEN',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "responseCount" INTEGER NOT NULL DEFAULT 0,
    "requesterId" TEXT NOT NULL,
    "skillPostId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "type" "PostType" NOT NULL,
    "category" "PostCategory",
    "images" TEXT[],
    "videos" TEXT[],
    "tags" TEXT[],
    "status" "PostStatus" NOT NULL DEFAULT 'ACTIVE',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "skill_posts_category_idx" ON "skill_posts"("category");

-- CreateIndex
CREATE INDEX "skill_posts_role_idx" ON "skill_posts"("role");

-- CreateIndex
CREATE INDEX "skill_posts_city_idx" ON "skill_posts"("city");

-- CreateIndex
CREATE INDEX "skill_posts_status_idx" ON "skill_posts"("status");

-- CreateIndex
CREATE INDEX "skill_posts_createdAt_idx" ON "skill_posts"("createdAt");

-- CreateIndex
CREATE INDEX "requests_type_idx" ON "requests"("type");

-- CreateIndex
CREATE INDEX "requests_category_idx" ON "requests"("category");

-- CreateIndex
CREATE INDEX "requests_city_idx" ON "requests"("city");

-- CreateIndex
CREATE INDEX "requests_status_idx" ON "requests"("status");

-- CreateIndex
CREATE INDEX "requests_createdAt_idx" ON "requests"("createdAt");

-- CreateIndex
CREATE INDEX "posts_type_idx" ON "posts"("type");

-- CreateIndex
CREATE INDEX "posts_category_idx" ON "posts"("category");

-- CreateIndex
CREATE INDEX "posts_status_idx" ON "posts"("status");

-- CreateIndex
CREATE INDEX "posts_createdAt_idx" ON "posts"("createdAt");

-- AddForeignKey
ALTER TABLE "skill_posts" ADD CONSTRAINT "skill_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_skillPostId_fkey" FOREIGN KEY ("skillPostId") REFERENCES "skill_posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
