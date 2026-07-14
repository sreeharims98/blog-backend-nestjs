import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../src/users/entities/user.entity';
import { Role } from '../../src/users/enums/role.enum';
import * as bcrypt from 'bcrypt';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.log('🌱 Seeding users...');
    const userRepository = dataSource.getRepository(User);

    // Create a default admin user if not exists
    const adminEmail = 'admin@blog.com';
    const adminExists = await userRepository.findOneBy({ email: adminEmail });
    if (!adminExists) {
      const admin = new User();
      admin.name = 'Admin User';
      admin.email = adminEmail;
      admin.password = await bcrypt.hash('AdminPassword123', 10);
      admin.role = Role.ADMIN;
      admin.isActive = true;
      await userRepository.save(admin);
      console.log(`   - Created default admin user: ${adminEmail}`);
    } else {
      console.log(`   - Default admin user already exists: ${adminEmail}`);
    }

    // Create a default regular user if not exists
    const userEmail = 'user@blog.com';
    const userExists = await userRepository.findOneBy({ email: userEmail });
    if (!userExists) {
      const user = new User();
      user.name = 'Normal User';
      user.email = userEmail;
      user.password = await bcrypt.hash('UserPassword123', 10);
      user.role = Role.USER;
      user.isActive = true;
      await userRepository.save(user);
      console.log(`   - Created default regular user: ${userEmail}`);
    } else {
      console.log(`   - Default regular user already exists: ${userEmail}`);
    }

    // Generate random users
    const count = 30;
    const userFactory = factoryManager.get(User);
    const createdUsers = await userFactory.saveMany(count);
    console.log(
      `   - Generated ${createdUsers.length} random users using factory.`,
    );
  }
}
