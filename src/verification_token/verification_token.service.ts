import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'crypto';
import { User } from 'src/users/entities/user.entity';
import { VerificationToken } from './entities/verification_token.entity';
import { Repository } from 'typeorm';
import { MailService } from 'src/common/services/email.service';
import { addHours } from 'date-fns';

@Injectable()
export class VerificationTokenService {
  constructor(
    @InjectRepository(VerificationToken)
    private readonly tokenRepository: Repository<VerificationToken>,
    private readonly mailService: MailService,
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
}
