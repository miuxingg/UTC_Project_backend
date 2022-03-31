import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceBase } from 'src/common/ServiceBase';
import { comparePassword, encryptPassword } from 'src/utils/encryptPassword';
import { transformValidationMessage } from 'src/utils/helper';
import { MailerService } from '../services/mailer.service';
import { CredentialDto } from './dto/auth.input';
import { User, UserDocument } from './schema/auth.schema';
import * as messages from '../resources/errorMessage.json';
import { generateToken } from 'src/utils/generateToken';
@Injectable()
export class AuthService extends ServiceBase<UserDocument> {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailerService: MailerService,
  ) {
    super(userModel);
  }

  async register(registerDto: CredentialDto) {
    await this.userModel.create({
      ...registerDto,
      password: await encryptPassword(registerDto.password),
    });
  }

  async sendVerifyEmail(email, data: Record<string, any>, code: string) {
    this.mailerService.verifyEmail(email, {
      name: data.name,
      ttl: data.ttl / 60,
      link: `http://localhost:3000/verify?code=${code}`,
    });
  }

  async verifyEmail(email: string, name: string) {
    this.mailerService.verifyAccountSuccess(email, {
      link: `http://localhost:3000`,
      name,
    });
  }

  async login(loginDto: CredentialDto) {
    const _isCheckEmailExist = await this.userModel.findOne({
      email: loginDto.email,
    });

    if (!_isCheckEmailExist)
      throw new BadRequestException(
        transformValidationMessage(messages.isNotExisted, ['Email']),
      );

    const _isCheckPassword = await comparePassword(
      _isCheckEmailExist.password,
      loginDto.password,
    );

    if (!_isCheckPassword)
      throw new BadRequestException(
        transformValidationMessage(messages.incorrectCredential, ['Password']),
      );

    return { access_token: generateToken(_isCheckEmailExist._id) };
  }
}
