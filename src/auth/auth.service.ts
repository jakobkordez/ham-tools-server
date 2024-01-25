import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserTokenPayload } from 'src/interfaces/user-token-payload.interface';
import { ConfigService } from '@nestjs/config';
import { UserTokenData } from 'src/interfaces/user-token-data.interface';
import { User } from 'src/users/entities/user.entity';
import { Login } from './entities/login.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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
  async login(user: UserTokenData) {
    const payload: UserTokenPayload = {
      username: user.username,
      sub: user.id,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.getAccessToken(payload),
      this.getRefreshToken(payload),
    ]);

    const sig = refreshToken.split('.')[2];
    const hashedToken = await bcrypt.hash(sig, 10);

    // Update refresh token
    const login = new Login();
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
    const payload = this.jwtService.decode(refreshToken) as UserTokenPayload;
    if (!payload) return null;

    const userId = payload.sub;
    if (!userId) return null;

    const user = await this.usersService.findOne(userId);
    if (!user) return null;

    const logins = await this.loginsRepository.find({ where: { user } });
    if (!logins) return null;

    const sig = refreshToken.split('.')[2];
    const currentLogin = logins.find((l) => bcrypt.compareSync(sig, l.token));
    if (!currentLogin) return null;

    const newPayload: UserTokenPayload = {
      username: payload.username,
      sub: payload.sub,
    };
    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.getAccessToken(newPayload),
      this.getRefreshToken(newPayload),
    ]);

    const newSig = newRefreshToken.split('.')[2];
    const hashedToken = await bcrypt.hash(newSig, 10);

    // Update refresh token
    currentLogin.timestamp = new Date();
    currentLogin.token = hashedToken;
    await this.loginsRepository.save(currentLogin);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Deletes all refresh tokens of user
   * @param userId User to logout
   */
  async logoutAll(userId: number) {
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

  async validateRefreshToken(token: string): Promise<boolean> {
    const payload = this.jwtService.decode(token) as UserTokenPayload;
    if (!payload) return false;

    const userId = payload.sub;
    if (!userId) return false;

    const user = await this.usersService.findOne(userId);
    if (!user) return false;

    const logins = await this.loginsRepository.find({ where: { user } });
    if (!logins) return false;

    const sig = token.split('.')[2];
    return logins.some((l) => bcrypt.compareSync(sig, l.token));
  }

  /**
   * Validate and get user
   * @param token Access token
   * @returns User of token
   */
  async validateJwt(token: string): Promise<User> {
    // Validate and decode token
    const userId = (await this.jwtVerifyAccess(token))?.sub;

    // Check userId
    if (!userId) return null;

    // Find user
    return await this.usersService.findOne(userId);
  }

  /**
   * Used to check expiration and signature
   * @param token Access token
   * @returns Raw token payload
   */
  async jwtVerifyAccess(token: string): Promise<UserTokenPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
    } catch (_) {
      return;
    }
  }

  // PRIVATE FUNCTIONS
  private async getAccessToken(payload: UserTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE'),
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  private async getRefreshToken(payload: UserTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }
}
