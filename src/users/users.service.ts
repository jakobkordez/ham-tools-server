import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (await this.userModel.findOne({ username: createUserDto.username }))
      throw new BadRequestException('Username already exists');

    const user = new this.userModel(createUserDto);
    return user.save();
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  findOneByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username: username }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.username) {
      const user = await this.userModel.findOne({
        username: updateUserDto.username,
      });
      if (user && user.id !== id)
        throw new BadRequestException('Username already exists');
    }

    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  remove(id: string): Promise<User> {
    return this.userModel.findByIdAndRemove(id).exec();
  }

  async addLogin(id: string, refreshToken: string): Promise<User> {
    const hashedToken = await hash(refreshToken, 10);
    return this.userModel
      .findByIdAndUpdate(id, { $push: { logins: hashedToken } })
      .exec();
  }

  async checkRefreshToken(id: string, refreshToken: string): Promise<boolean> {
    const user = await this.userModel.findById(id);
    if (!user) return false;

    return user.logins.some((token) => compareSync(refreshToken, token));
  }

  async removeLogin(id: string, refreshToken: string): Promise<User> {
    const hashedToken = await hash(refreshToken, 10);
    return this.userModel
      .findByIdAndUpdate(id, { $pull: { logins: hashedToken } })
      .exec();
  }
}
