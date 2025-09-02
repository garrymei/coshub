import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用 CORS（从环境变量读取，支持逗号分隔）
  const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({ origin: corsOrigins, credentials: true });

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // 节流守卫已在 AppModule 通过 APP_GUARD 全局注册

  const config = new DocumentBuilder()
    .setTitle("Coshub API")
    .setDescription("Coshub 内存实现 API 文档")
    .setVersion("0.1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  // 全局前缀
  app.setGlobalPrefix("api");

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Coshub API 服务启动成功！`);
  console.log(`📡 监听端口: ${port}`);
  console.log(`🌐 访问地址: http://localhost:${port}/api`);
  console.log(`💚 健康检查: http://localhost:${port}/api/healthz`);
}
bootstrap();
