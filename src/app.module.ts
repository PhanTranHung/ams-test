import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Organization } from './entities/organization.entity';
import { Location } from './entities/location.entity';
import { Asset } from './entities/asset.entity';
import { BrApiService } from './services/br-api.service';
import { AssetsController } from './controllers/assets.controller';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([Organization, Location, Asset]),
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController, AssetsController],
  providers: [AppService, BrApiService],
})
export class AppModule {}
