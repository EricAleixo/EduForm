import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configOrm } from './configOrm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [StudentModule, TypeOrmModule.forRoot(configOrm), ConfigModule.forRoot({isGlobal: true})],
  controllers: [],
  providers: [],
})
export class AppModule {}
