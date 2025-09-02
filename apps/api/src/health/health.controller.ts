import { Controller, Get } from "@nestjs/common";
import { HealthService } from "./health.service";

@Controller("healthz")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealthCheck() {
    return this.healthService.getHealthStatus();
  }
}
