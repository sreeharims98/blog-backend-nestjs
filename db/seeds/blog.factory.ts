import { setSeederFactory } from 'typeorm-extension';
import { Blog } from '../../src/blogs/entities/blog.entity';
import { BlogStatus } from '../../src/blogs/enum/blog.enum';
import slugify from 'slugify';

export const BlogFactory = setSeederFactory(Blog, (faker) => {
  const blog = new Blog();
  const title = faker.lorem.sentence();
  blog.title = title;
  // Suffix with a short unique identifier to prevent slug collisions
  blog.slug =
    slugify(title, { lower: true, strict: true }) +
    '-' +
    faker.string.uuid().slice(0, 8);
  blog.content = faker.lorem.paragraphs(3);
  blog.status = faker.helpers.arrayElement([
    BlogStatus.DRAFT,
    BlogStatus.PUBLISHED,
  ]);
  return blog;
});
