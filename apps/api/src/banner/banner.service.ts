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
}
