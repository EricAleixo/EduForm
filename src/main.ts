import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  // Configurar validação global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  console.log(`🚀 Servidor rodando na porta ${process.env.PORT ?? 3000}`);
  console.log(`📧 Email configurado: ${process.env.EMAIL_USER || 'Não configurado'}`);
  console.log(`🔐 JWT configurado: ${process.env.JWT_SECRET ? 'Sim' : 'Não'}`);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
