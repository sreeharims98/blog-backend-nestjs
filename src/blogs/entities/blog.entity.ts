import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { BlogStatus } from '../enum/blog.enum';
import { User } from '../../users/entities/user.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';

@Entity('blogs')
// Compound Partial Index for status and createdAt
@Index('IDX_blogs_status_createdAt', ['status', 'createdAt'], {
  where: '"deletedAt" IS NULL',
})
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    unique: true,
  })
  slug: string;

  @Column({
    type: 'text',
  })
  content: string;

  @Column({
    type: 'enum',
    enum: BlogStatus,
    default: BlogStatus.DRAFT,
  })
  status: BlogStatus;

  @ManyToOne(() => User, (user) => user.blogs)
  @JoinColumn({
    name: 'author_id',
  })
  author: User;

  @OneToMany(() => Favorite, (favorite) => favorite.blog)
  favorites: Favorite[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Add a partial index on deletedAt to optimize soft-delete queries
  @Index('IDX_blogs_deletedAt', { where: '"deletedAt" IS NULL' })
  @DeleteDateColumn()
  deletedAt: Date | null;
}
