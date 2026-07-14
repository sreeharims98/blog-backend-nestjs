import { Module } from '@nestjs/common';
import { VerificationTokenService } from './verification_token.service';
import { VerificationTokenController } from './verification_token.controller';
import { MailService } from 'src/common/services/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationToken } from './entities/verification_token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationToken])],
  controllers: [VerificationTokenController],
  providers: [VerificationTokenService, MailService],
  exports: [VerificationTokenService],
})
export class VerificationTokenModule {}
