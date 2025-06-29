import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailProcessor } from './email.processor';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisConfig: any = {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
        };

        // Configurações para Redis Cloud (produção)
        const password = configService.get('REDIS_PASSWORD');
        if (password) {
          redisConfig.password = password;
        }

        const tls = configService.get('REDIS_TLS');
        if (tls === 'true') {
          redisConfig.tls = {
            rejectUnauthorized: false, // Para Redis Cloud
          };
        }

        return {
          redis: redisConfig,
          defaultJobOptions: {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 2000,
            },
            removeOnComplete: 100, // Remove jobs completados após 100
            removeOnFail: 50, // Remove jobs falhados após 50
          },
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
    EmailModule,
  ],
  controllers: [QueueController],
  providers: [EmailProcessor, QueueService],
  exports: [BullModule, QueueService],
})
export class QueueModule {} 