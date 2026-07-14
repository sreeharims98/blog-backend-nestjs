import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import UserSeeder from './user.seeder';
import BlogSeeder from './blog.seeder';

export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    // Run UserSeeder first to generate users
    await new UserSeeder().run(dataSource, factoryManager);

    // Run BlogSeeder to generate blogs authored by the users
    await new BlogSeeder().run(dataSource, factoryManager);
  }
}
