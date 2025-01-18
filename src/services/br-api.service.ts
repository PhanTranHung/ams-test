import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Asset } from '../entities/asset.entity';
import { Location } from '../entities/location.entity';
import { LocationStatus } from '../entities/location.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';

interface BRAsset {
  id: string;
  type: string;
  serial: string;
  status: string;
  description: string;
  created_at: number;
  updated_at: number;
  location_id: number;
}

@Injectable()
export class BrApiService {
  private readonly logger = new Logger(BrApiService.name);
  private readonly API_URL =
    'https://669ce22d15704bb0e304842d.mockapi.io/assets';

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    private readonly dataSource: DataSource,
  ) {}

  @Cron(process.env.ASSET_SYNC_CRON || CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncAssets() {
    this.logger.log('Starting asset synchronization...');

    try {
      const activeLocations = await this.locationRepository.find({
        where: { status: LocationStatus.ACTIVE },
      });

      const activeLocationIds = new Set(activeLocations.map((loc) => loc.id));
      const response = await firstValueFrom(
        this.httpService.get<BRAsset[]>(this.API_URL),
      );
      const assets = response.data;

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        for (const asset of assets) {
          // Only sync assets for active locations
          if (!activeLocationIds.has(asset.location_id)) {
            continue;
          }

          // Only sync assets created in the past
          const createdAt = new Date(asset.created_at * 1000);
          if (createdAt > new Date()) {
            continue;
          }

          const existingAsset = await this.assetRepository.findOne({
            where: { externalId: asset.id },
          });

          if (existingAsset) {
            // Update existing asset
            await this.assetRepository.update(
              { externalId: asset.id },
              {
                type: asset.type,
                serial: asset.serial,
                status: asset.status,
                description: asset.description,
                locationId: asset.location_id,
              },
            );
          } else {
            // Create new asset
            const newAsset = this.assetRepository.create({
              externalId: asset.id,
              type: asset.type,
              serial: asset.serial,
              status: asset.status,
              description: asset.description,
              locationId: asset.location_id,
            });
            await this.assetRepository.save(newAsset);
          }
        }

        await queryRunner.commitTransaction();
        this.logger.log('Asset synchronization completed successfully');
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      this.logger.error('Error during asset synchronization:', error);
    }
  }
}
