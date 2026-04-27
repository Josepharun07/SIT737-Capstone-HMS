import { DataSource } from 'typeorm';

export class TestDatabaseHelper {
  private static dataSource: DataSource;

  static async setupTestDatabase(): Promise<DataSource> {
    this.dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'blueberry_admin',
      password: process.env.DB_PASSWORD || 'blueberry123',
      database: 'blueberry_hms_test',
      entities: [__dirname + '/../../src/**/*.entity{.ts,.js}'],
      synchronize: true,
      dropSchema: true,
    });

    await this.dataSource.initialize();
    return this.dataSource;
  }

  static async cleanDatabase(dataSource: DataSource): Promise<void> {
    const entities = dataSource.entityMetadatas;
    
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
    }
  }

  static async closeDatabase(dataSource: DataSource): Promise<void> {
    await dataSource.destroy();
  }
}
