import { Module } from '@nestjs/common';
import { VerificationTokenService } from './verification_token.service';
import { VerificationTokenController } from './verification_token.controller';
import { MailService } from 'src/common/services/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationToken } from './entities/verification_token.entity';
import { UsersModule } from 'src/users/users.module';
import { CryptoService } from 'src/common/services/crypto.service';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationToken]), UsersModule],
  controllers: [VerificationTokenController],
  providers: [VerificationTokenService, MailService, CryptoService],
  exports: [VerificationTokenService],
})
export class VerificationTokenModule {}
