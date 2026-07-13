import { Injectable } from '@nestjs/common';
import { addDays } from 'date-fns';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh_token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenService } from 'src/common/services/token-service';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly tokenService: TokenService,
  ) {}

  // Creates a brand new refresh token row
  async create(user: User, hashedRefresh: string) {
    return this.refreshTokenRepository.save({
      user,
      tokenHash: hashedRefresh,
      expiresAt: addDays(new Date(), 30),
    });
  }

  // Marks an existing token as revoked (id present → UPDATE)
  async revokeRefresh(token: RefreshToken) {
    token.revokedAt = new Date();
    return this.refreshTokenRepository.save(token);
  }

  async findRefresh(tokenHash: string) {
    return await this.refreshTokenRepository.findOne({
      where: { tokenHash },
      relations: { user: true },
    });
  }

  async revokeRefreshToken(rawRefreshToken: string) {
    const tokenHash = this.tokenService.hashToken(rawRefreshToken);
    await this.refreshTokenRepository.update(
      { tokenHash },
      { revokedAt: new Date() },
    );
  }

  async revokeAllUserTokens(userId: number) {
    await this.refreshTokenRepository.update(
      { user: { id: userId } },
      { revokedAt: new Date() },
    );
  }
}
