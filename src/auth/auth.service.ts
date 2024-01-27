import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RefreshTokenPayload } from 'src/interfaces/refresh-token-payload.interface';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { Login } from './entities/login.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessTokenPayload } from 'src/interfaces/access-token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(Login) private loginsRepository: Repository<Login>,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) return;

    if (!(await bcrypt.compare(password, user.password))) return;

    return user;
  }

  /**
   * Use to login user
   * @param user User to login
   * @returns Access and refresh tokens
   */
  async login(user: User) {
    const login = await this.loginsRepository.save(new Login());

    const aPayload: AccessTokenPayload = {
      username: user.username,
      sub: user.id,
    };
    const rPayload: RefreshTokenPayload = {
      username: user.username,
      sub: user.id,
      jti: login.id,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.getAccessToken(aPayload),
      this.getRefreshToken(rPayload),
    ]);

    const sig = refreshToken.split('.')[2];
    const hashedToken = await bcrypt.hash(sig, 10);

    login.userId = user.id;
    login.token = hashedToken;
    await this.loginsRepository.save(login);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Use to refresh access token
   * @param refreshToken Refresh token
   * @returns New access token and refresh token
   */
  async refresh(refreshToken: string) {
    const payload = await this.verifyRefreshJwt(refreshToken);
    if (!payload) return null;

    const aPayload: AccessTokenPayload = {
      username: payload.username,
      sub: payload.sub,
    };
    const rPayload: RefreshTokenPayload = {
      username: payload.username,
      sub: payload.sub,
      jti: payload.jti,
    };
    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.getAccessToken(aPayload),
      this.getRefreshToken(rPayload),
    ]);

    const newSig = newRefreshToken.split('.')[2];
    const hashedToken = await bcrypt.hash(newSig, 10);

    // Update refresh token
    await this.loginsRepository.update(payload.jti, {
      timestamp: new Date(),
      token: hashedToken,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Deletes all refresh tokens of user
   * @param userId User to logout
   */
  async logoutAll(userId: string) {
    this.loginsRepository.delete({ userId });
  }

  /**
   * Checks if user with username exists, if not, creates new user
   * @param createUserDto User data
   * @returns User on success
   */
  async register(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.usersService.findOneByUsername(
      createUserDto.username,
    );
    if (existing) throw new BadRequestException('Username already exists');

    return this.usersService.create(createUserDto);
  }

  /**
   * Used to check validity of refresh token
   * @param token Access token
   * @returns Raw token payload
   */
  async verifyRefreshJwt(token: string): Promise<RefreshTokenPayload> {
    let payload: RefreshTokenPayload;
    try {
      payload = this.jwtService.verify<RefreshTokenPayload>(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch (_) {
      return null;
    }

    const userId = payload.sub;
    if (!userId) return null;

    const user = await this.usersService.findOne(userId);
    if (!user) return null;

    const loginId = payload.jti;
    if (!loginId) return null;

    const login = await this.loginsRepository.findOneBy({ id: loginId });
    if (!login) return null;

    const matches = await bcrypt.compare(token.split('.')[2], login.token);
    if (!matches) return null;

    return payload;
  }

  // PRIVATE FUNCTIONS
  private async getAccessToken(payload: AccessTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE'),
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  private async getRefreshToken(payload: RefreshTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }
}
