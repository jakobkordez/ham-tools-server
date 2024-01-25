import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { UserTokenData } from 'src/interfaces/user-token-data.interface';
import { AuthToken } from 'src/decorators/auth-token.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@RequestUser() user: UserTokenData) {
    return this.authService.login(user);
  }

  @Public()
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  refresh(@AuthToken() token: string) {
    const newAuth = this.authService.refresh(token);
    if (!newAuth) throw new BadRequestException('Invalid token');

    return newAuth;
  }

  @Get('logout/all')
  logout(@RequestUser() user: UserTokenData): Promise<void> {
    return this.authService.logoutAll(user.id);
  }
}
