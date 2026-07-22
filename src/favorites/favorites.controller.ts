import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { QueryFavoriteDto } from './dto/query-favorite.dto';
import { FavoriteResponseDto } from './dto/favorite-response.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @Auth()
  @ApiResponse({ status: 201, type: FavoriteResponseDto })
  create(
    @Body() dto: CreateFavoriteDto,
    @CurrentUser() user: User,
  ): Promise<FavoriteResponseDto> {
    return this.favoritesService.create(dto, user);
  }

  @Get()
  @Auth()
  @ApiResponse({ status: 200, type: PaginatedResponseDto<FavoriteResponseDto> })
  findAll(
    @Query() query: QueryFavoriteDto,
    @CurrentUser() user: User,
  ): Promise<PaginatedResponseDto<FavoriteResponseDto>> {
    return this.favoritesService.findAll(query, user);
  }

  @Delete(':blogId')
  @Auth()
  remove(
    @Param('blogId', ParseIntPipe) blogId: number,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    return this.favoritesService.remove(blogId, user);
  }
}
