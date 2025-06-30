import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const configOrm = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: configService.get<string>('DATABASE_URL'),
    synchronize: true,
    autoLoadEntities: true,
    entities: [],
    logging: false,
    ssl: process.env.NODE_ENV === 'production' ? true : false,
    extra: process.env.NODE_ENV === 'production' ? { ssl: { rejectUnauthorized: false } } : {},
});