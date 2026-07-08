import { Injectable } from '@nestjs/common';
import slugify from 'slugify';

@Injectable()
export class SlugService {
  generate(text: string) {
    return slugify(text, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  async generateUniqueSlug(
    title: string,
    exists: (slug: string) => Promise<boolean>,
  ) {
    const slug = this.generate(title);
    let count = 1;
    let uniqueSlug = slug;

    while (await exists(uniqueSlug)) {
      uniqueSlug = `${slug}-${count}`;
      count++;
    }

    return uniqueSlug;
  }
}
