import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { BaseQuery } from 'src/common/BaseDTO';
import { Public } from 'src/libs/decorators/public.decorator';
import { User } from 'src/libs/decorators/user.decorator';
import { SystemGuard } from 'src/libs/Guard/system.guard';
import { decodeBase64, encodeBase64 } from 'src/utils';
import { transformValidationMessage } from 'src/utils/helper';
import { IIAMUser } from 'src/utils/types';
import { CacheService } from '../services/cache.service';
import { AuthService } from './auth.service';
import * as messages from '../resources/errorMessage.json';
import {
  AccountEmployeelDto,
  ChangePassword,
  CredentialDto,
  FacebookLoginDto,
  ForgotPassword,
  LoginDto,
  UpdateProfileInputDto,
} from './dto/auth.input';
import {
  Authenticated,
  EmployeOutputDto,
  ProfileDto,
  ResponseDto,
} from './dto/auth.output';
import { AuthGuard } from '@nestjs/passport';
@Controller('auth')
@Public()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
  ) {}

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Get('profile')
  async getProfile(@User() iiamUser: IIAMUser) {
    if (iiamUser?.id) {
      const user = await this.authService.findById(iiamUser.id);
      return plainToClass(ProfileDto, user);
    }
    return null;
  }

  @Get('employee')
  @UseGuards(SystemGuard)
  async getEmployee(@Query() queries: BaseQuery) {
    const [employee] = await this.authService.getEmployee(queries);
    return {
      items: plainToClass(EmployeOutputDto, employee?.items ?? []),
      total: employee?.total ?? 0,
    };
  }

  @Get('employee/:id')
  @UseGuards(SystemGuard)
  async getEmployeeById(@Param('id') idEmp: string) {
    const employee = await this.authService.findById(idEmp);
    return plainToClass(EmployeOutputDto, employee);
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

  @Put('employee/:id')
  @UseGuards(SystemGuard)
  async updateEmployee(
    @Param('id') idEmp: string,
    @Body() input: AccountEmployeelDto,
  ) {
    const data = await this.authService.updateEmployee(idEmp, input);
    return plainToClass(EmployeOutputDto, data);
  }

  @Delete('employee/:id')
  @UseGuards(SystemGuard)
  async deleteEmployee(@Param('id') idEmp: string) {
    const data = await this.authService.deleteById(idEmp);
    return plainToClass(EmployeOutputDto, data);
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
    const authenticated = await this.authService.login(loginDto, false);
    return plainToClass(Authenticated, authenticated);
  }

  @Post('login-admin')
  async loginAdminController(@Body() loginDto: LoginDto) {
    const authenticated = await this.authService.login(loginDto, true);
    return plainToClass(Authenticated, authenticated);
  }

  @Post('account-employee')
  @UseGuards(SystemGuard)
  async createAccountEmployee(@Body() input: AccountEmployeelDto) {
    const data = await this.authService.createAccountEmployee(input);
    return data;
  }

  @Post('forgot-password')
  async forgotPassword(@Body() input: ForgotPassword) {
    return await this.authService.forgotPassword(input);
  }

  @Post('change-password')
  async changePassword(
    @User() iiamUser: IIAMUser,
    @Body() input: ChangePassword,
  ) {
    const user = await this.authService.findById(iiamUser?.id);
    if (!user?.id) {
      throw new BadRequestException(
        transformValidationMessage(messages.incorrectEmail, 'user', ['User']),
      );
    }
    return await this.authService.changePassword(
      user.id,
      input.currentPassword,
      input.newPassword,
    );
  }

  @Post('facebook-login')
  async facebookLogin(@Body() input: FacebookLoginDto) {
    const authenticated = await this.authService.facebookLogin(
      input.email,
      input.name,
      input.avatar,
    );
    return plainToClass(Authenticated, authenticated);
  }

  @Get('login-google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    console.log(req);
  }
}
