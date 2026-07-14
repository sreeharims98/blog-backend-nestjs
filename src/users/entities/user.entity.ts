import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../enums/role.enum';
import { Blog } from '../../blogs/entities/blog.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    select: false,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @OneToMany(() => Blog, (blog) => blog.author)
  blogs: Blog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    default: false,
  })
  isEmailVerified: boolean;

  @Column({
    nullable: true,
  })
  emailVerifiedAt?: Date;
}
