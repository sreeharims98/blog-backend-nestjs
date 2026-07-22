import { ApiProperty } from '@nestjs/swagger';

export class FavoriteResponseDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Number })
  blogId: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  slug: string;

  @ApiProperty({ type: String })
  authorName: string;

  @ApiProperty({ type: Date })
  createdAt: Date;
}
