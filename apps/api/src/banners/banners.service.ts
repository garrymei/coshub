import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  Banner,
  CreateBannerDTO,
  UpdateBannerDTO,
  BannerQueryDTO,
} from "@coshub/types";
import { Prisma } from "../../generated/prisma";

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  // 创建Banner
  async create(createBannerDto: CreateBannerDTO): Promise<Banner> {
    const banner = await this.prisma.banner.create({
      data: {
        scene: createBannerDto.scene as any,
        imageUrl: createBannerDto.imageUrl,
        linkType: createBannerDto.linkType as any,
        linkUrl: createBannerDto.linkUrl,
        priority: createBannerDto.priority || 0,
        online: createBannerDto.online !== false, // 默认上线
      },
    });

    return this.transformBanner(banner);
  }

  // 获取Banner列表
  async findAll(query: BannerQueryDTO): Promise<Banner[]> {
    const where: Prisma.BannerWhereInput = {};

    // 应用筛选条件
    if (query.scene) {
      where.scene = query.scene as any;
    }

    if (query.online !== undefined) {
      where.online = query.online;
    }

    const banners = await this.prisma.banner.findMany({
      where,
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    return banners.map((banner) => this.transformBanner(banner));
  }

  // 获取Banner详情
  async findOne(id: string): Promise<Banner> {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException(`Banner ID ${id} 不存在`);
    }

    return this.transformBanner(banner);
  }

  // 更新Banner
  async update(id: string, updateBannerDto: UpdateBannerDTO): Promise<Banner> {
    const banner = await this.prisma.banner.update({
      where: { id },
      data: {
        ...updateBannerDto,
        updatedAt: new Date(),
      },
    });

    return this.transformBanner(banner);
  }

  // 删除Banner
  async remove(id: string): Promise<boolean> {
    await this.prisma.banner.delete({
      where: { id },
    });

    return true;
  }

  // 切换Banner上线状态
  async toggleOnline(id: string): Promise<Banner> {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException(`Banner ID ${id} 不存在`);
    }

    const updatedBanner = await this.prisma.banner.update({
      where: { id },
      data: {
        online: !banner.online,
        updatedAt: new Date(),
      },
    });

    return this.transformBanner(updatedBanner);
  }

  // 调整Banner优先级
  async updatePriority(id: string, priority: number): Promise<Banner> {
    const banner = await this.prisma.banner.update({
      where: { id },
      data: {
        priority,
        updatedAt: new Date(),
      },
    });

    return this.transformBanner(banner);
  }

  // 转换数据库模型到API模型
  private transformBanner(banner: any): Banner {
    return {
      id: banner.id,
      scene: String(banner.scene).toLowerCase(),
      imageUrl: banner.imageUrl,
      linkType: String(banner.linkType).toLowerCase(),
      linkUrl: banner.linkUrl,
      priority: banner.priority,
      online: banner.online,
      createdAt: banner.createdAt,
      updatedAt: banner.updatedAt,
    } as any;
  }
}
