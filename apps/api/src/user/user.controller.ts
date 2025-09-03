import { Controller, Get, Put, Body, Param, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDTO } from "@coshub/types";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { RequirePermissions } from "../auth/decorators/permissions.decorator";
import { Permission } from "@coshub/types";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put(":id/preferences")
  @UseGuards(PermissionGuard)
  @RequirePermissions(Permission.EDIT_PROFILE)
  async updatePreferences(
    @Param("id") userId: string,
    @Body() dto: UpdateUserDTO,
  ) {
    return this.userService.updateUserPreferences(userId, dto);
  }

  @Get(":id/preferences")
  @UseGuards(PermissionGuard)
  @RequirePermissions(Permission.VIEW_PROFILE)
  async getPreferences(@Param("id") userId: string) {
    return this.userService.getUserPreferences(userId);
  }
}
