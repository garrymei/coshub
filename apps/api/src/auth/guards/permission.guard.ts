import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Permission, UserRole, ROLE_PERMISSIONS } from "@coshub/types";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      "permissions",
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("用户未认证");
    }

    const userRole = user.role || UserRole.USER;
    const hasPermission = this.checkPermission(userRole, requiredPermissions);

    if (!hasPermission) {
      throw new ForbiddenException(
        `用户角色 ${userRole} 没有所需权限: ${requiredPermissions.join(", ")}`,
      );
    }

    return true;
  }

  private checkPermission(
    userRole: UserRole,
    requiredPermissions: Permission[],
  ): boolean {
    const rolePermission = ROLE_PERMISSIONS.find((rp) => rp.role === userRole);

    if (!rolePermission) {
      return false;
    }

    return requiredPermissions.every((permission) =>
      rolePermission.permissions.includes(permission),
    );
  }
}
