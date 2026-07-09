import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { QueryUserDto } from './dto/query-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ADMIN
  @Get('admin/all')
  @Auth()
  @Roles(Role.ADMIN)
  findAllUsers(@Query() query: QueryUserDto) {
    return this.usersService.findAllUsers(query);
  }

  @Patch('admin/deactivate/:id')
  @Auth()
  @Roles(Role.ADMIN)
  deactivateUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deactivateUser(id);
  }

  // USERS
  @Get('me')
  @Auth()
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Patch('me/update')
  @Auth()
  updateMyProfile(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ) {
    return this.usersService.updateMyProfile(updateUserDto, user);
  }
}
