import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Coshub API 服务运行中！🎌";
  }
}
