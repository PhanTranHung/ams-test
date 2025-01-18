import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTables1737340757000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create organizations table
    await queryRunner.createTable(
      new Table({
        name: 'organizations',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create locations table
    await queryRunner.createTable(
      new Table({
        name: 'locations',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'organization_id',
            type: 'int',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['actived', 'unactive'],
            default: "'actived'",
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create assets table
    await queryRunner.createTable(
      new Table({
        name: 'assets',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'external_id',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'type',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'serial',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'location_id',
            type: 'int',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Add foreign keys
    await queryRunner.createForeignKey(
      'locations',
      new TableForeignKey({
        columnNames: ['organization_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'assets',
      new TableForeignKey({
        columnNames: ['location_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'locations',
        onDelete: 'CASCADE',
      }),
    );

    // Insert initial data for organizations and locations
    await queryRunner.query(`
      INSERT INTO organizations (name) VALUES 
      ('PNS'),
      ('PLJ');
    `);

    await queryRunner.query(`
      INSERT INTO locations (name, organization_id, status) VALUES 
      ('Da Nang', 1, 'actived'),
      ('Ha Noi', 1, 'unactive'),
      ('Ho Chi Minh', 1, 'actived'),
      ('Nha Trang', 2, 'actived'),
      ('Can Tho', 2, 'actived');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('assets');
    await queryRunner.dropTable('locations');
    await queryRunner.dropTable('organizations');
  }
}
