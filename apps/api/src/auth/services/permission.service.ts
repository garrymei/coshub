import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  Permission,
  UserRole,
  ROLE_PERMISSIONS,
  PermissionCheck,
  PermissionResult,
} from "@coshub/types";

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async checkPermission(check: PermissionCheck): Promise<PermissionResult> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: check.userId },
        select: { role: true, id: true },
      });

      if (!user) {
        return {
          allowed: false,
          reason: "用户不存在",
        };
      }

      const userRole = user.role as UserRole || UserRole.USER;
      const hasPermission = this.hasPermission(userRole, check.permission);

      if (!hasPermission) {
        return {
          allowed: false,
          reason: `用户角色 ${userRole} 没有权限 ${check.permission}`,
          role: userRole,
        };
      }

      // 如果是资源相关权限，检查资源所有权
      if (check.resourceId && check.resourceType) {
        const isOwner = await this.checkResourceOwnership(
          check.userId,
          check.resourceId,
          check.resourceType,
        );

        if (!isOwner && !this.isAdminRole(userRole)) {
          return {
            allowed: false,
            reason: "不是资源所有者且没有管理员权限",
            role: userRole,
          };
        }
      }

      return {
        allowed: true,
        role: userRole,
      };
    } catch (error) {
      console.error("权限检查失败:", error);
      return {
        allowed: false,
        reason: "权限检查失败",
      };
    }
  }

  private hasPermission(userRole: UserRole, permission: Permission): boolean {
    const rolePermission = ROLE_PERMISSIONS.find((rp) => rp.role === userRole);
    
    if (!rolePermission) {
      return false;
    }

    return rolePermission.permissions.includes(permission);
  }

  private isAdminRole(role: UserRole): boolean {
    return role === UserRole.ADMIN || role === UserRole.MODERATOR;
  }

  private async checkResourceOwnership(
    userId: string,
    resourceId: string,
    resourceType: string,
  ): Promise<boolean> {
    try {
      switch (resourceType) {
        case "skillPost": {
          const skillPost = await this.prisma.skillPost.findUnique({
            where: { id: resourceId },
            select: { authorId: true },
          });
          return skillPost?.authorId === userId;
        }

        case "user":
          return resourceId === userId;

        case "comment": {
          const comment = await this.prisma.comment.findUnique({
            where: { id: resourceId },
            select: { authorId: true },
          });
          return comment?.authorId === userId;
        }

        default:
          return false;
      }
    } catch (error) {
      console.error("资源所有权检查失败:", error);
      return false;
    }
  }

  async getUserRole(userId: string): Promise<UserRole> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      return (user?.role as UserRole) || UserRole.USER;
    } catch (error) {
      console.error("获取用户角色失败:", error);
      return UserRole.USER;
    }
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    try {
      const userRole = await this.getUserRole(userId);
      const rolePermission = ROLE_PERMISSIONS.find((rp) => rp.role === userRole);
      
      return rolePermission?.permissions || [];
    } catch (error) {
      console.error("获取用户权限失败:", error);
      return [];
    }
  }

  async isAdmin(userId: string): Promise<boolean> {
    const role = await this.getUserRole(userId);
    return role === UserRole.ADMIN;
  }

  async isModerator(userId: string): Promise<boolean> {
    const role = await this.getUserRole(userId);
    return role === UserRole.MODERATOR || role === UserRole.ADMIN;
  }
}
