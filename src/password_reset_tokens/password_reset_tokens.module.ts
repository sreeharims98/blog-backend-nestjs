import { Module } from '@nestjs/common';
import { PasswordResetTokensService } from './password_reset_tokens.service';
import { PasswordResetTokensController } from './password_reset_tokens.controller';
import { PasswordResetToken } from './entities/password_reset_token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { CryptoService } from 'src/common/services/crypto.service';
import { MailService } from 'src/common/services/email.service';
import { ConfigService } from '@nestjs/config';
import { PasswordService } from 'src/common/services/password.service';
import { RefreshTokensModule } from 'src/refresh_tokens/refresh_tokens.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PasswordResetToken]),
    UsersModule,
    RefreshTokensModule,
  ],
  controllers: [PasswordResetTokensController],
  providers: [
    PasswordResetTokensService,
    CryptoService,
    MailService,
    ConfigService,
    PasswordService,
  ],
  exports: [PasswordResetTokensService],
})
export class PasswordResetTokensModule {}
