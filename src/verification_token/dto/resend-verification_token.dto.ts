import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendVerificationTokenDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
