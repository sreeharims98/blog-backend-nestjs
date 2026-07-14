import { setSeederFactory } from 'typeorm-extension';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/enums/role.enum';
import * as bcrypt from 'bcrypt';

// Pre-hash password for performance in bulk seeding
const hashedPassword = bcrypt.hashSync('Password123', 10);

export const UserFactory = setSeederFactory(User, (faker) => {
  const user = new User();
  user.name = faker.person.fullName();
  user.email = faker.internet.email().toLowerCase();
  user.password = hashedPassword;
  user.role = faker.helpers.arrayElement([Role.USER, Role.ADMIN]);
  user.isActive = true;
  return user;
});
