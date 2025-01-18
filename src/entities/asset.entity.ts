import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Location } from './location.entity';

@Entity('assets')
export class Asset {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the asset',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '1', description: 'External ID from BR API' })
  @Column({ name: 'external_id' })
  externalId: string;

  @ApiProperty({ example: 'CIA1-10', description: 'The type of the asset' })
  @Column()
  type: string;

  @ApiProperty({
    example: '0000001',
    description: 'Serial number of the asset',
  })
  @Column()
  serial: string;

  @ApiProperty({
    example: 'actived',
    description: 'Current status of the asset',
  })
  @Column()
  status: string;

  @ApiProperty({
    example: 'Asset description',
    description: 'Description of the asset',
  })
  @Column()
  description: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the location this asset belongs to',
  })
  @Column({ name: 'location_id' })
  locationId: number;

  @ApiProperty({
    example: '2025-01-18T09:25:38Z',
    description: 'Creation timestamp',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    example: '2025-01-18T09:25:38Z',
    description: 'Last update timestamp',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ type: () => Location })
  @ManyToOne(() => Location, (location) => location.assets)
  @JoinColumn({ name: 'location_id' })
  location: Location;
}
