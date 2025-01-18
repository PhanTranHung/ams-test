import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from './organization.entity';
import { Asset } from './asset.entity';

export enum LocationStatus {
  ACTIVE = 'actived',
  INACTIVE = 'unactive',
}

@Entity('locations')
export class Location {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the location',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Da Nang', description: 'The name of the location' })
  @Column()
  name: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the organization this location belongs to',
  })
  @Column({ name: 'organization_id' })
  organizationId: number;

  @ApiProperty({
    enum: LocationStatus,
    example: LocationStatus.ACTIVE,
    description: 'The status of the location',
  })
  @Column({
    type: 'enum',
    enum: LocationStatus,
    default: LocationStatus.ACTIVE,
  })
  status: LocationStatus;

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

  @ApiProperty({ type: () => Organization })
  @ManyToOne(() => Organization, (organization) => organization.locations)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ApiProperty({ type: () => [Asset] })
  @OneToMany(() => Asset, (asset) => asset.location)
  assets: Asset[];
}
