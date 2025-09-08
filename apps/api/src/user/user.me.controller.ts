import { Body, Controller, Get, Put } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateUserDTO, User as UserType } from "@coshub/types";

@Controller("user")
export class UserMeController {
  constructor(private readonly prisma: PrismaService) {}

  private toUserPayload(u: any): Partial<UserType> {
    return {
      id: u.id,
      username: u.username,
      email: u.email || "",
      nickname: u.nickname || u.username,
      avatar:
        u.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`,
      bio: u.bio || "",
      level: (u.level || "regular") as any,
      location: u.city || u.location || undefined,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      isActive: true,
      isVerified: false,
    } as any;
  }

  @Get("profile")
  async getProfile() {
    // 暂用首个用户作为当前用户
    let user = await this.prisma.user.findFirst();
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          username: "demo",
          nickname: "Demo",
          email: "demo@example.com",
          avatar: "",
        } as any,
      });
    }
    return this.toUserPayload(user);
  }

  @Put("profile")
  async updateProfile(@Body() dto: UpdateUserDTO) {
    const first = await this.prisma.user.findFirst();
    if (!first) {
      throw new Error("No user found. Seed the database first.");
    }
    const updated = await this.prisma.user.update({
      where: { id: first.id },
      data: {
        nickname: dto.nickname ?? first.nickname,
        avatar: dto.avatar ?? first.avatar,
        bio: dto.bio ?? first.bio,
        city: (dto.city as any) ?? (first as any).city,
        lat: (dto.lat as any) ?? (first as any).lat,
        lng: (dto.lng as any) ?? (first as any).lng,
        location: (dto.location as any) ?? (first as any).location,
      } as any,
    });
    return this.toUserPayload(updated);
  }
}

