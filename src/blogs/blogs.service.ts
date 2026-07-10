import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { User } from 'src/users/entities/user.entity';
import { SlugService } from 'src/common/services/slug.service';
import { BlogResponseDto } from './dto/blog-response.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    private readonly slugService: SlugService,
  ) {}

  async findBlogById(id: number) {
    return await this.blogRepository.findOne({
      where: { id },
      relations: {
        author: true,
      },
    });
  }

  async create(dto: CreateBlogDto, author: User): Promise<BlogResponseDto> {
    const slug = await this.slugService.generateUniqueSlug(
      dto.title,
      async (slug) => {
        const exists = await this.blogRepository.exists({
          where: { slug },
        });
        return exists;
      },
    );

    const blog = this.blogRepository.create({
      ...dto,
      slug,
      author,
    });

    await this.blogRepository.save(blog);
    return {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      createdAt: blog.createdAt,
      authorName: blog.author.name,
    };
  }

  async findAll(query: QueryBlogDto) {
    const qb = this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.author', 'author')
      .select([
        'blog.id',
        'blog.title',
        'blog.slug',
        'blog.createdAt',
        'author.id',
        'author.name',
      ]);

    if (query.search) {
      qb.andWhere('blog.title ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    if (query.status) {
      qb.andWhere('blog.status = :status', {
        status: query.status,
      });
    }

    qb.orderBy(
      `blog.${query.sort}`,
      query.order.toUpperCase() as 'ASC' | 'DESC',
    );

    qb.skip((query.page - 1) * query.limit);
    qb.take(query.limit);

    const [blogs, total] = await qb.getManyAndCount();

    return new PaginatedResponseDto(blogs, query.page, query.limit, total);
  }

  async update(id: number, dto: UpdateBlogDto, user: User) {
    const blog = await this.findBlogById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    if (blog.author.id !== user.id) {
      throw new ForbiddenException('You cannot edit this blog');
    }

    blog.title = dto.title ?? blog.title;
    blog.content = dto.content ?? blog.content;

    await this.blogRepository.save(blog);

    return {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      createdAt: blog.createdAt,
      authorName: blog.author.name,
    };
  }

  async remove(id: number, user: User) {
    const blog = await this.findBlogById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    if (blog.author.id !== user.id) {
      throw new ForbiddenException('You cannot edit this blog');
    }

    await this.blogRepository.softDelete(id);
    return { message: 'Blog deleted successfully' };
  }

  async adminRemoveBlog(id: number) {
    const blog = await this.findBlogById(id);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    await this.blogRepository.softDelete(id);
    return { message: 'Blog deleted successfully' };
  }
}
