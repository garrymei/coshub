import { Controller, Get, Query } from "@nestjs/common";
import { BannerService } from "./banner.service";
import { BannerScene } from "@coshub/types";
import { ApiResponse } from "@coshub/types";

@Controller("banners")
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  async getBanners(@Query("scene") scene: BannerScene) {
    const banners = await this.bannerService.getBanners(scene);
    return {
      success: true,
      data: banners,
      message: "获取Banner成功"
    } as ApiResponse;
  }
}