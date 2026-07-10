import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './enums/role.enum';
import { QueryUserDto } from './dto/query-user.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });
  }

  async findById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateMyProfile(updateUserDto: UpdateUserDto, user: User) {
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }
    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  async adminFindAllUsers(query: QueryUserDto) {
    const qb = this.usersRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email']);

    if (query.search) {
      qb.andWhere('user.name ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    if (query.isActive) {
      qb.andWhere('user.isActive = :isActive', {
        isActive: query.isActive,
      });
    }

    qb.orderBy(
      `user.${query.sort}`,
      query.order.toUpperCase() as 'ASC' | 'DESC',
    );
    qb.skip((query.page - 1) * query.limit);
    qb.take(query.limit);

    const [users, total] = await qb.getManyAndCount();

    return new PaginatedResponseDto(users, query.page, query.limit, total);
  }

  async adminDeactivateUser(id: number) {
    const existingUser = await this.findById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found!');
    }
    if (existingUser.role === Role.ADMIN) {
      throw new ForbiddenException('Admin accounts cannot be deactivated');
    }
    if (!existingUser.isActive) {
      throw new BadRequestException('User is already deactivated');
    }
    existingUser.isActive = false;
    await this.usersRepository.save(existingUser);
    return {
      message: 'User deactivated successfully',
    };
  }
}
