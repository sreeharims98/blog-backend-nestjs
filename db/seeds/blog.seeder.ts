import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Blog } from '../../src/blogs/entities/blog.entity';
import { User } from '../../src/users/entities/user.entity';

export default class BlogSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.log('🌱 Seeding blogs...');
    const userRepository = dataSource.getRepository(User);
    const blogRepository = dataSource.getRepository(Blog);

    const users = await userRepository.find();
    if (users.length === 0) {
      throw new Error(
        'No users found to assign as authors of blogs. Run UserSeeder first.',
      );
    }

    const blogFactory = factoryManager.get(Blog);

    // Generate random blogs and assign random authors
    const count = 100;
    const blogs: Blog[] = [];
    for (let i = 0; i < count; i++) {
      const blog = await blogFactory.make();
      blog.author = users[Math.floor(Math.random() * users.length)];
      blogs.push(blog);
    }

    const savedBlogs = await blogRepository.save(blogs);
    console.log(
      `   - Generated and saved ${savedBlogs.length} random blogs with random authors.`,
    );
  }
}
