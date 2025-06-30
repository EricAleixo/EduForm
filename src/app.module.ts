import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configOrm } from './configOrm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configOrm(configService),
      inject: [ConfigService]
    }), 
    StudentModule, 
    CloudinaryModule, UsersModule, AuthModule,
    QueueModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
