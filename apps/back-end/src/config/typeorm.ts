import 'dotenv/config';
import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'local'}`,
});

const isProd = process.env.NODE_ENV === 'production';

const config = {
  type: 'postgres',
  host: `${process.env.DB_HOST || 'localhost'}`,
  port: parseInt(`${process.env.DB_PORT || '5432'}`, 10),
  username: `${process.env.DB_USERNAME || 'test'}`,
  password: `${process.env.DB_PASSWORD || 'test'}`,
  database: `${process.env.DB_DATABASE || 'test'}`,
  entities: isProd
    ? ['dist/**/*.entity{.js,.ts}']
    : ['src/**/*.entity{.ts,.js}'],
  migrations: isProd
    ? ['dist/migrations/*{.js,.ts}']
    : ['src/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
  ssl: isProd ? { rejectUnauthorized: false } : false,
  extra: {
    ssl: isProd ? { rejectUnauthorized: false } : false,
  },
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
