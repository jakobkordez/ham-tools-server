import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from 'src/schemas/profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  create(createProfileDto: CreateProfileDto, userId: string): Promise<Profile> {
    const profile = new this.profileModel(createProfileDto);
    profile.owner = userId;
    return profile.save();
  }

  findAll(): Promise<Profile[]> {
    return this.profileModel.find().exec();
  }

  findOne(id: string): Promise<Profile> {
    return this.profileModel.findById(id).exec();
  }

  update(id: string, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    return this.profileModel
      .findByIdAndUpdate(id, updateProfileDto, { new: true })
      .exec();
  }

  remove(id: string): Promise<Profile> {
    return this.profileModel.findByIdAndRemove(id).exec();
  }
}
