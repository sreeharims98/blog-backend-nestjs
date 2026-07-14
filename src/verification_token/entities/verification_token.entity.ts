import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('email_verification_tokens')
export class VerificationToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  tokenHash: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
