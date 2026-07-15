import { Controller } from '@nestjs/common';
import { PasswordResetTokensService } from './password_reset_tokens.service';

@Controller('password-reset-tokens')
export class PasswordResetTokensController {
  constructor(
    private readonly passwordResetTokensService: PasswordResetTokensService,
  ) {}
}
