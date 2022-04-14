import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Public } from 'src/libs/decorators/public.decorator';
import { User } from 'src/libs/decorators/user.decorator';
import { decodeBase64, encodeBase64 } from 'src/utils';
import { IIAMUser } from 'src/utils/types';
import { CacheService } from '../services/cache.service';
import { AuthService } from './auth.service';
import {
  CredentialDto,
  LoginDto,
  UpdateProfileInputDto,
} from './dto/auth.input';
import { Authenticated, ProfileDto, ResponseDto } from './dto/auth.output';

@Controller('auth')
@Public()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
  ) {}

  @Get('profile')
  async getProfile(@User() iiamUser: IIAMUser) {
    if (iiamUser?.id) {
      const user = await this.authService.findById(iiamUser.id);
      return plainToClass(ProfileDto, user);
    }
    return null;
  }

  @Put()
  async updateProfile(
    @User() iiamUser: IIAMUser,
    @Body() data: UpdateProfileInputDto,
  ) {
    if (!iiamUser?.id) throw new BadRequestException('User not exists');
    const user = await this.authService.findById(iiamUser.id);
    const {
      firstName,
      lastName,
      avatar,
      phoneNumber,
      province,
      district,
      ward,
      privateHome,
    } = data;
    user.firstName = firstName;
    user.lastName = lastName;
    user.avatar = avatar;
    user.phoneNumber = phoneNumber;
    user.province = province;
    user.district = district;
    user.ward = ward;
    user.privateHome = privateHome;
    const newUser = await user.save();
    return plainToClass(ProfileDto, newUser);
  }

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
  async loginController(@Body() loginDto: LoginDto) {
    const authenticated = await this.authService.login(loginDto);
    return plainToClass(Authenticated, authenticated);
  }
}
