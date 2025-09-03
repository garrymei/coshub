import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateUserDTO } from "@coshub/types";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUserPreferences(userId: string, dto: UpdateUserDTO) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        city: dto.city,
        lat: dto.lat,
        lng: dto.lng,
        preferredCity: dto.preferredCity,
      },
    });
  }

  async getUserPreferences(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        city: true,
        lat: true,
        lng: true,
        preferredCity: true,
      },
    });
  }
}
