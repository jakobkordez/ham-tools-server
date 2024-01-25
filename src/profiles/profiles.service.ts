import { Injectable } from '@nestjs/common';
import { Profile } from 'src/profiles/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  create(createProfileDto: CreateProfileDto, userId: number): Promise<Profile> {
    const profile = new Profile();
    Object.assign(profile, createProfileDto);
    profile.ownerId = userId;

    return this.profilesRepository.save(profile);
  }

  findAll(userId?: number): Promise<Profile[]> {
    return this.profilesRepository.find({ where: { owner: { id: userId } } });
  }

  findOne(id: number, userId?: number): Promise<Profile> {
    return this.profilesRepository.findOneBy({ id, owner: { id: userId } });
  }

  async update(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.findOne(id);
    Object.assign(profile, updateProfileDto);
    return this.profilesRepository.save(profile);
  }

  async remove(id: number): Promise<void> {
    await this.profilesRepository.delete(id);
  }
}
