import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BannerService {
  constructor(private prisma: PrismaService) {}

  async getBanners(scene: string) {
    return this.prisma.banner.findMany({
      where: {
        scene: scene as any,
        online: true,
      },
      orderBy: { priority: "desc" },
      take: 5,
    });
  }

  async createBanner(bannerData: any) {
    return this.prisma.banner.create({
      data: {
        scene: bannerData.scene as any,
        imageUrl: bannerData.imageUrl,
        linkType: bannerData.linkType as any,
        linkUrl: bannerData.linkUrl,
        priority: bannerData.priority || 0,
        online: bannerData.online !== false,
      },
    });
  }
}
