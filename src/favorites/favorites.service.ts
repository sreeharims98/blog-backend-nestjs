import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { Blog } from 'src/blogs/entities/blog.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { QueryFavoriteDto } from './dto/query-favorite.dto';
import { FavoriteResponseDto } from './dto/favorite-response.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  async create(
    dto: CreateFavoriteDto,
    user: User,
  ): Promise<FavoriteResponseDto> {
    const blog = await this.blogRepository.findOne({
      where: { id: dto.blogId },
      relations: { author: true },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const existing = await this.favoriteRepository.findOne({
      where: { userId: user.id, blogId: dto.blogId },
    });

    if (existing) {
      throw new ConflictException('Blog is already in favorites');
    }

    const favorite = this.favoriteRepository.create({
      userId: user.id,
      blogId: dto.blogId,
    });

    await this.favoriteRepository.save(favorite);

    return {
      id: favorite.id,
      blogId: blog.id,
      title: blog.title,
      slug: blog.slug,
      authorName: blog.author.name,
      createdAt: favorite.createdAt,
    };
  }

  async findAll(
    query: QueryFavoriteDto,
    user: User,
  ): Promise<PaginatedResponseDto<FavoriteResponseDto>> {
    const qb = this.favoriteRepository
      .createQueryBuilder('favorite')
      .innerJoinAndSelect('favorite.blog', 'blog')
      .innerJoinAndSelect('blog.author', 'author')
      .where('favorite.userId = :userId', { userId: user.id })
      .select([
        'favorite.id',
        'favorite.createdAt',
        'blog.id',
        'blog.title',
        'blog.slug',
        'author.name',
      ]);

    qb.orderBy(
      `favorite.${query.sort}`,
      query.order.toUpperCase() as 'ASC' | 'DESC',
    );

    qb.skip(query.skip);
    qb.take(query.limit);

    const [favorites, total] = await qb.getManyAndCount();

    const data = favorites.map((favorite) => ({
      id: favorite.id,
      blogId: favorite.blog.id,
      title: favorite.blog.title,
      slug: favorite.blog.slug,
      authorName: favorite.blog.author.name,
      createdAt: favorite.createdAt,
    }));

    return new PaginatedResponseDto(data, query.page, query.limit, total);
  }

  async remove(blogId: number, user: User): Promise<{ message: string }> {
    const favorite = await this.favoriteRepository.findOne({
      where: { userId: user.id, blogId },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.favoriteRepository.remove(favorite);

    return { message: 'Favorite removed successfully' };
  }
}
