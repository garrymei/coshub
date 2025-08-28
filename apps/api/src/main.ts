import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 启用 CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  });

  // 全局前缀
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Coshub API 服务启动成功！`);
  console.log(`📡 监听端口: ${port}`);
  console.log(`🌐 访问地址: http://localhost:${port}/api`);
  console.log(`💚 健康检查: http://localhost:${port}/api/healthz`);
}
bootstrap();
