import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1710500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // This will be auto-generated, but for now we'll let TypeORM create tables
    // We'll enable synchronize: true ONCE, then turn it off
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback logic
  }
}
