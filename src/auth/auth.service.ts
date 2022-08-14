import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { LoginData } from 'src/interfaces/login-data.interface';
import { TokenData } from 'src/interfaces/token-data.interface';
import { User } from 'src/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) return;

    if (!(await compare(password, user.password))) return;

    return user;
  }

  async login(user: User): Promise<LoginData> {
    const payload: TokenData = {
      user_id: user.id,
    };

    const refresh_token = this.jwtService.sign(payload);

    await this.usersService.addLogin(user.id, refresh_token);

    return {
      user,
      refresh_token: refresh_token,
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
    };
  }

  async refreshToken(refresh_token: string) {
    const payload = this.jwtService.decode(refresh_token) as TokenData;

    const valid = await this.usersService.checkRefreshToken(
      payload.user_id,
      refresh_token,
    );
    if (!valid) throw new BadRequestException('Invalid refresh token');

    return {
      access_token: this.jwtService.sign(
        { user_id: payload.user_id },
        { expiresIn: '1h' },
      ),
    };
  }

  async logout(userId: string, refresh_token: string): Promise<void> {
    await this.usersService.removeLogin(userId, refresh_token);
  }
}
