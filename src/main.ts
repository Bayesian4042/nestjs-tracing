import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { trace } from './tracing';

async function bootstrap() {
  trace();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
