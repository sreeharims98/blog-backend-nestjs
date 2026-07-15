import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'crypto';
import { User } from 'src/users/entities/user.entity';
import { VerificationToken } from './entities/verification_token.entity';
import { Repository } from 'typeorm';
import { MailService } from 'src/common/services/email.service';
import { addHours } from 'date-fns';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class VerificationTokenService {
  constructor(
    @InjectRepository(VerificationToken)
    private readonly tokenRepository: Repository<VerificationToken>,
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
  ) {}

  private hashToken(rawToken: string): string {
    // Deterministic hash — needed for exact-match lookup, unlike bcrypt
    return createHash('sha256').update(rawToken).digest('hex');
  }

  async sendVerificationEmail(user: User) {
    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);

    await this.tokenRepository.save({
      user,
      tokenHash,
      expiresAt: addHours(new Date(), 24), // link expires in 24h
    });

    const verifyUrl = `${process.env.APP_URL}/auth/verify-email?token=${rawToken}`;

    await this.mailService.send({
      to: user.email,
      subject: 'Verify your email address',
      html: `<p>Click the link below to verify your account:</p>
                 <a href="${verifyUrl}">${verifyUrl}</a>
                 <p>This link expires in 24 hours.</p>`,
    });
  }

  async verifyEmail(rawToken: string) {
    const tokenHash = this.hashToken(rawToken);

    const stored = await this.tokenRepository.findOne({
      where: { tokenHash },
      relations: { user: true },
    });

    if (!stored) {
      throw new BadRequestException(
        'Invalid or already-used verification link',
      );
    }
    if (stored.expiresAt < new Date()) {
      throw new BadRequestException('Verification link has expired');
    }

    stored.user.isEmailVerified = true;
    stored.user.emailVerifiedAt = new Date();
    await this.usersService.markEmailVerified(stored.user.id);

    // Token is single-use — delete it so it can't be replayed
    await this.tokenRepository.delete({ id: stored.id });
  }

  async resendVerification(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && !user.isEmailVerified) {
      await this.sendVerificationEmail(user);
    }
    return {
      message:
        'If that email exists and is unverified, a verification link has been sent',
    };
  }
}
