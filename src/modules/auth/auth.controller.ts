import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/libs/decorators/public.decorator';
import { decodeBase64, encodeBase64 } from 'src/utils';
import { CacheService } from '../services/cache.service';
import { AuthService } from './auth.service';
import { UserRegister } from './dto/auth.input';

@Controller('auth')
@Public()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
  ) {}
  @Post('register')
  async registerController(@Body() registerDto: UserRegister) {
    const payload = registerDto;

    const encode = encodeBase64(payload);

    const { key, ttl } = await this.cacheService.setCacheVerifyEmail(encode);
    const data = {
      ttl,
      name: payload.email,
    };
    this.authService.sendVerifyEmail(registerDto.email, data, key);
    return { status: 200, code: 'Verify' };
  }

  @Post('verify-email')
  async verifyEmailController(@Body('code') code: string) {
    const value = await this.cacheService.getValue(code);
    if (!value) throw new BadRequestException('Expired');
    const payload = decodeBase64(value);
    await this.authService.register(JSON.parse(payload));
    await this.authService.verifyEmail(JSON.parse(payload).email, 'Unknown');
  }
}
