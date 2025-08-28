import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealthStatus() {
    return {
      ok: true,
      service: 'api',
      timestamp: new Date().toISOString(),
      version: '0.1.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      message: 'Coshub API 服务运行正常 🎌'
    };
  }
}
