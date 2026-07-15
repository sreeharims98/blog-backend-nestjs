import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Throttle } from '@nestjs/throttler';
import { RefreshTokenDto } from 'src/refresh_tokens/dto/refresh-token.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { VerificationTokenService } from 'src/verification_token/verification_token.service';
import { ResendVerificationTokenDto } from 'src/verification_token/dto/resend-verification_token.dto';
import { PasswordResetTokensService } from 'src/password_reset_tokens/password_reset_tokens.service';
import { ForgotPasswordDto } from 'src/password_reset_tokens/dto/forgot-password.dto';
import { ResetPasswordDto } from 'src/password_reset_tokens/dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly verificationTokenService: VerificationTokenService,
    private readonly passwordResetTokenService: PasswordResetTokensService,
  ) {}

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // stricter, prevents spam signups
  create(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('logout')
  @Auth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto);
  }

  @Post('verify-email')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }
    await this.verificationTokenService.verifyEmail(token);
    return { message: 'Email verified successfully' };
  }

  @Post('resend-verification')
  @Throttle({ default: { limit: 3, ttl: 300000 } })
  async resendVerification(@Body() dto: ResendVerificationTokenDto) {
    return await this.verificationTokenService.resendVerification(dto.email);
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 300000 } })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.passwordResetTokenService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @Throttle({ default: { limit: 3, ttl: 300000 } })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.passwordResetTokenService.resetPassword(resetPasswordDto);
  }
}
