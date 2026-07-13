import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PasswordService } from 'src/common/services/password-service';
import { RefreshTokensService } from 'src/refresh_tokens/refresh_tokens.service';
import { TokenService } from 'src/common/services/token-service';
import { RefreshTokenDto } from 'src/refresh_tokens/dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly refreshTokenService: RefreshTokensService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordCorrect = await this.passwordService.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.tokenService.createRefreshToken();

    const hashedRefresh = this.tokenService.hashToken(refreshToken);

    await this.refreshTokenService.create(user, hashedRefresh);

    return { accessToken, refreshToken };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exist');
    }

    const hashedPassword = await this.passwordService.hash(
      registerDto.password,
    );

    await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    return {
      message: 'User registered successfully',
    };
  }

  async refreshToken(rawRefreshToken: string) {
    // Look up the token by its hash — raw tokens are never stored
    const hashedRefresh = this.tokenService.hashToken(rawRefreshToken);
    const stored = await this.refreshTokenService.findRefresh(hashedRefresh);

    if (!stored) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (stored.revokedAt) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }
    if (stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }
    if (!stored.user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Rotate: revoke old token
    await this.refreshTokenService.revokeRefresh(stored);

    // Issue a new refresh token
    const newRawRefreshToken = this.tokenService.createRefreshToken();
    const newHashedRefresh = this.tokenService.hashToken(newRawRefreshToken);
    await this.refreshTokenService.create(stored.user, newHashedRefresh);

    // Issue a new access token
    const payload = {
      sub: stored.user.id,
      email: stored.user.email,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    return { accessToken, refreshToken: newRawRefreshToken };
  }

  async logout(dto: RefreshTokenDto) {
    await this.refreshTokenService.revokeRefreshToken(dto.refreshToken);
    return { message: 'Logged out successfully' };
  }
}
