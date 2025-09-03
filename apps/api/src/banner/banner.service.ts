import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { BannerScene } from "@prisma/client";

@Injectable()
export class BannerService {
  constructor(private prisma: PrismaService) {}

  async getBanners(scene: BannerScene) {
    return this.prisma.banner.findMany({
      where: {
        scene,
        online: true,
        OR: [
          { startAt: null },
          { startAt: { lte: new Date() } }
        ],
        OR: [
          { endAt: null },
          { endAt: { gte: new Date() } }
        ]
      },
      orderBy: { priority: "desc" },
      take: 5
    });
  }
}