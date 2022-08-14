import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { User } from 'src/schemas/user.schema';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  create(
    @RequestUser() user: User,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return this.profilesService.create(createProfileDto, user.id);
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', MongoIdPipe) id: string) {
    return this.profilesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @RequestUser() user: User,
    @Param('id', MongoIdPipe) id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const profile = await this.profilesService.findOne(id);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    if (!user.roles.includes('admin') && user.id != profile.owner) {
      throw new ForbiddenException(
        'You are not allowed to delete this profile',
      );
    }

    return this.profilesService.update(id, updateProfileDto);
  }

  @Delete(':id')
  async remove(
    @RequestUser() user: User,
    @Param('id', MongoIdPipe) id: string,
  ) {
    const profile = await this.profilesService.findOne(id);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    if (!user.roles.includes('admin') && user.id != profile.owner) {
      throw new ForbiddenException(
        'You are not allowed to delete this profile',
      );
    }

    await this.profilesService.remove(id);
  }
}
