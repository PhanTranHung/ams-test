import { Controller, Get, Query, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Asset } from '../entities/asset.entity';
import { Location } from '../entities/location.entity';

@ApiTags('assets')
@Controller('assets')
export class AssetsController {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get assets by location or organization' })
  @ApiQuery({
    name: 'locationId',
    required: false,
    type: Number,
    description: 'Filter assets by location ID',
  })
  @ApiQuery({
    name: 'organizationId',
    required: false,
    type: Number,
    description: 'Filter assets by organization ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of assets',
    type: [Asset],
  })
  @ApiResponse({
    status: 404,
    description: 'Location or organization not found',
  })
  async getAssets(
    @Query('locationId') locationId?: number,
    @Query('organizationId') organizationId?: number,
  ) {
    if (!locationId && !organizationId) {
      throw new NotFoundException(
        'Either locationId or organizationId must be provided',
      );
    }

    if (locationId) {
      const location = await this.locationRepository.findOne({
        where: { id: locationId },
      });

      if (!location) {
        throw new NotFoundException(`Location with ID ${locationId} not found`);
      }

      return this.assetRepository.find({
        where: { locationId },
        relations: ['location'],
      });
    }

    if (organizationId) {
      const locations = await this.locationRepository.find({
        where: { organizationId },
      });

      if (!locations.length) {
        throw new NotFoundException(
          `Organization with ID ${organizationId} not found or has no locations`,
        );
      }

      const locationIds = locations.map((loc) => loc.id);
      return this.assetRepository.find({
        where: { locationId: In(locationIds) },
        relations: ['location'],
      });
    }
  }
}
