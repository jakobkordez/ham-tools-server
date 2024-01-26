import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (
      await this.usersRepository.findOneBy({ username: createUserDto.username })
    )
      throw new BadRequestException('Username already exists');

    const user = new User();
    user.username = createUserDto.username;
    user.password = await hash(createUserDto.password, 10);
    user.name = createUserDto.name;

    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    return user;
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ username });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.username && user.username !== updateUserDto.username) {
      const user = await this.usersRepository.findOneBy({
        username: updateUserDto.username,
      });
      if (user) throw new BadRequestException('Username already exists');
    }

    Object.assign(user, updateUserDto);
    await this.usersRepository.save(user);
    return user;
  }

  async remove(id: number): Promise<void> {
    const user = await this.usersRepository.delete(id);
    if (!user) throw new NotFoundException('User not found');
  }

  // async addLogin(user: User, refreshToken: string): Promise<Login> {
  //   const sig = refreshToken.split('.')[2];
  //   const hashedToken = await hash(sig, 10);

  //   const login = new Login();
  //   login.user = user;
  //   login.token = hashedToken;
  //   return this.loginsRepository.save(login);
  // }

  // async checkRefreshToken(id: number, refreshToken: string): Promise<boolean> {
  //   const user = await this.usersRepository.findOneBy({ id });
  //   if (!user) return false;

  //   const rta = refreshToken.split('.');
  //   refreshToken = rta[rta.length - 1];
  //   return user.logins.some((token) => compareSync(refreshToken, token));
  // }

  // async removeLogin(id: number, refreshToken: string): Promise<User> {
  //   const user = await this.usersRepository.findOneBy({ id });
  //   if (!user) throw new NotFoundException('User not found');

  //   const rta = refreshToken.split('.');
  //   refreshToken = rta[rta.length - 1];
  //   const logins = user.logins.filter(
  //     (token) => !compareSync(refreshToken, token),
  //   );
  //   return this.usersRepository.findByIdAndUpdate(
  //     id,
  //     { logins: logins },
  //     { new: true },
  //   );
  // }
}
