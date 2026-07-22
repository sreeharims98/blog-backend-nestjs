import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateFavoriteDto {
  @ApiProperty({ type: Number })
  @IsInt()
  @Min(1)
  blogId: number;
}
