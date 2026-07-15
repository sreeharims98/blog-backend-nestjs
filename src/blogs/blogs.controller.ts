import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ApiResponse } from '@nestjs/swagger';
import { BlogResponseDto } from './dto/blog-response.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';

@Controller('blogs')
@Auth()
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @ApiResponse({ status: 201, type: BlogResponseDto })
  create(@Body() dto: CreateBlogDto, @CurrentUser() user: User) {
    return this.blogsService.create(dto, user);
  }

  @Get()
  findAll(@Query() query: QueryBlogDto) {
    return this.blogsService.findAll(query);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBlogDto,
    @CurrentUser() user: User,
  ) {
    return this.blogsService.update(id, dto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.blogsService.remove(id, user);
  }

  @Delete('admin/:id')
  @Roles(Role.ADMIN)
  adminRemoveBlog(@Param('id') id: number) {
    return this.blogsService.adminRemoveBlog(id);
  }
}
