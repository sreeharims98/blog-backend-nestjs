import { PartialType } from '@nestjs/swagger';
import { CreateVerificationTokenDto } from './create-verification_token.dto';

export class UpdateVerificationTokenDto extends PartialType(
  CreateVerificationTokenDto,
) {}
