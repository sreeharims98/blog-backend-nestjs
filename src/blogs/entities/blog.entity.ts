import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { BlogStatus } from '../enum/blog.enum';
import { User } from 'src/users/entities/user.entity';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Add a partial index on deletedAt to optimize soft-delete queries
  @Index('IDX_blogs_deletedAt', { where: '"deletedAt" IS NULL' })
  @DeleteDateColumn()
  deletedAt: Date | null;
}
