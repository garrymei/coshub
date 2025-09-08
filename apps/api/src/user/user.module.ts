import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { UserController } from "./user.controller";
import { UserMeController } from "./user.me.controller";
import { UserService } from "./user.service";

@Module({
  imports: [PrismaModule],
  controllers: [UserController, UserMeController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
