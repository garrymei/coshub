import { Body, Controller, Post } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly prisma: PrismaService) {}

  @Post("login")
  async login(@Body() body: { code?: string }) {
    // 暂时忽略 code，直接返回第一个用户和伪 token
    let user = await this.prisma.user.findFirst();
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          username: "demo",
          nickname: "Demo",
          email: "demo@example.com",
        } as any,
      });
    }
    const token = `dev-token-${user.id}`;
    return {
      token,
      user: {
        id: user.id,
        nickname: user.nickname || user.username,
        avatar:
          user.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
        bio: user.bio || "",
        followers: 0,
        likes: 0,
        collections: 0,
        level: "normal",
      },
    };
  }
}
