import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordResetToken } from './entities/password_reset_token.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CryptoService } from 'src/common/services/crypto.service';
import { addHours } from 'date-fns';
import { MailService } from 'src/common/services/email.service';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordService } from 'src/common/services/password.service';
import { RefreshTokensService } from 'src/refresh_tokens/refresh_tokens.service';

@Injectable()
export class PasswordResetTokensService {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly passwordService: PasswordService,
    private readonly refreshTokenService: RefreshTokensService,
  ) {}

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const rawToken = this.cryptoService.generateRandomString();
    const tokenHash = this.cryptoService.hashString(rawToken);

    await this.passwordResetTokenRepository.save({
      user,
      tokenHash,
      expiresAt: addHours(new Date(), 1), // link expires in 1h
    });

    const appUrl = this.configService.get<string>('mail.appUrl');
    const verifyUrl = `${appUrl}/auth/reset-password?token=${rawToken}`;

    await this.mailService.send({
      to: user.email,
      subject: 'Reset your password',
      html: `<p>Click the link below to reset your password:</p>
                 <a href="${verifyUrl}">${verifyUrl}</a>
                 <p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>`,
    });

    return {
      message: 'A password reset link has been sent to your email',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const tokenHash = this.cryptoService.hashString(resetPasswordDto.token);

    const stored = await this.passwordResetTokenRepository.findOne({
      where: { tokenHash },
      relations: { user: true },
    });

    if (!stored) {
      throw new BadRequestException('Invalid or already-used reset link');
    }
    if (stored.expiresAt < new Date()) {
      throw new BadRequestException('Reset link has expired');
    }

    const hashedPassword = await this.passwordService.hash(
      resetPasswordDto.newPassword,
    );

    // Update password
    await this.usersService.updatePassword(stored.user.id, hashedPassword);

    // Delete this token
    await this.passwordResetTokenRepository.delete({ id: stored.id });

    // Also delete any other outstanding reset tokens for this user —
    // if multiple reset emails were requested, they should all die
    // once one of them is successfully used
    await this.passwordResetTokenRepository.delete({
      user: { id: stored.user.id },
    });

    // Critical: invalidate all existing sessions. If an attacker had
    // stolen a refresh token, this forces them out the moment the
    // legitimate user regains control via password reset
    await this.refreshTokenService.revokeAllUserTokens(stored.user.id);

    return { message: 'Password reset successfully' };
  }
}
