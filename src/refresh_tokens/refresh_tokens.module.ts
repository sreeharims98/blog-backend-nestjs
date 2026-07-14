import { Module } from '@nestjs/common';
import { RefreshTokensController } from './refresh_tokens.controller';
import { RefreshTokensService } from './refresh_tokens.service';
import { RefreshToken } from './entities/refresh_token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from 'src/common/services/token.service';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken])],
  controllers: [RefreshTokensController],
  providers: [RefreshTokensService, TokenService],
  exports: [RefreshTokensService],
})
export class RefreshTokensModule {}
