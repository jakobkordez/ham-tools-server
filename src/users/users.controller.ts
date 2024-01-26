import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from './role.enum';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { UserTokenData } from 'src/interfaces/user-token-data.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  getSelf(@RequestUser() user: UserTokenData) {
    return this.usersService.findOne(user.id);
  }

  @Patch('me')
  updateSelf(
    @RequestUser() user: UserTokenData,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  // @Roles(Role.Admin)
  // @Patch(':id')
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   return this.usersService.update(id, updateUserDto);
  // }

  // @Roles(Role.Admin)
  // @Delete(':id')
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.usersService.remove(id);
  // }
}
