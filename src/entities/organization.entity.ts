import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Location } from './location.entity';

@Entity('organizations')
export class Organization {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the organization',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'PNS', description: 'The name of the organization' })
  @Column()
  name: string;

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

  @ApiProperty({
    type: () => [Location],
    description: 'List of locations belonging to this organization',
  })
  @OneToMany(() => Location, (location) => location.organization)
  locations: Location[];
}
