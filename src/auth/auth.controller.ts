import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { LoginData } from 'src/interfaces/login-data.interface';
import { User } from 'src/schemas/user.schema';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): Promise<LoginData> {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('refresh')
  refresh(@Body('refresh_token') refresh_token: string) {
    return this.authService.refreshToken(refresh_token);
  }

  @Post('logout')
  logout(
    @RequestUser() user: User,
    @Body('refresh_token') refresh_token: string,
  ): Promise<void> {
    return this.authService.logout(user.id, refresh_token);
  }
}
