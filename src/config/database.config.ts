import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Organization } from '../entities/organization.entity';
import { Location } from '../entities/location.entity';
import { Asset } from '../entities/asset.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'asset_management',
  entities: [Organization, Location, Asset],
  synchronize: false,
  logging: true,
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true,
};
