import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Public } from 'src/libs/decorators/public.decorator';
import { decodeBase64, encodeBase64 } from 'src/utils';
import { CacheService } from '../services/cache.service';
import { AuthService } from './auth.service';
import { CredentialDto } from './dto/auth.input';
import { Authenticated, ResponseDto } from './dto/auth.output';

@Controller('auth')
@Public()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
  ) {}
  @Post('register')
  async registerController(
    @Body() registerDto: CredentialDto,
  ): Promise<ResponseDto> {
    const alreadyUser = await this.authService.findOne({
      email: registerDto.email,
    });

    if (alreadyUser) {
      return { statusCode: 400, message: 'Email already', field: 'email' };
    }
    const payload = registerDto;

    const encode = encodeBase64(payload);

    const { key, ttl } = await this.cacheService.setCacheVerifyEmail(encode);
    const data = {
      ttl,
      name: payload.email,
    };
    this.authService.sendVerifyEmail(registerDto.email, data, key);
    return { statusCode: 200, message: 'Verify' };
  }

  @Post('verify-email')
  async verifyEmailController(
    @Body('code') code: string,
  ): Promise<ResponseDto> {
    const value = await this.cacheService.getValue(code);
    if (!value) throw new BadRequestException('Expired');
    const payload = decodeBase64(value);
    await this.authService.register(JSON.parse(payload));
    await this.authService.verifyEmail(JSON.parse(payload).email, 'Unknown');
    return { statusCode: 200, message: 'Success' };
  }
  @Post('login')
  async loginController(@Body() loginDto: CredentialDto) {
    const authenticated = await this.authService.login(loginDto);
    return plainToClass(Authenticated, authenticated);
  }
}
