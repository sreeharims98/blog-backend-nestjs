import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  tokenHash: string;

  @Column({ nullable: true })
  deviceName?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column()
  expiresAt: Date;

  @Column({ nullable: true })
  revokedAt?: Date;
}
