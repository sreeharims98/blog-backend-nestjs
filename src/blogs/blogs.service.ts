import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { User } from 'src/users/entities/user.entity';
import { SlugService } from 'src/common/services/slug.service';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    private readonly slugService: SlugService,
  ) {}

  async create(dto: CreateBlogDto, author: User) {
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

    return await this.blogRepository.save(blog);
  }
}
