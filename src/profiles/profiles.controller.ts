import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UserTokenData } from 'src/interfaces/user-token-data.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  async create(
    @RequestUser() user: User,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return this.profilesService.create(createProfileDto, user.id);
  }

  @Get()
  findAll(@RequestUser() user: UserTokenData) {
    return this.profilesService.findAll(user.id);
  }

  @Get(':id')
  async findOne(
    @RequestUser() user: UserTokenData,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const profile = await this.profilesService.findOne(id, user.id);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  @Patch(':id')
  async update(
    @RequestUser() user: UserTokenData,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const profile = await this.profilesService.findOne(id, user.id);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.profilesService.update(id, updateProfileDto);
  }

  // @Delete(':id')
  // async remove(
  //   @RequestUser() user: UserTokenData,
  //   @Param('id', ParseIntPipe) id: number,
  // ) {
  //   const profile = await this.profilesService.findOne(id);
  //   if (!profile) {
  //     throw new NotFoundException('Profile not found');
  //   }
  //   if (!user.roles.includes('admin') && user.id != profile.owner) {
  //     throw new ForbiddenException(
  //       'You are not allowed to delete this profile',
  //     );
  //   }

  //   await this.profilesService.remove(id);
  // }
}
