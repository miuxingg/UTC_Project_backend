import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceBase } from 'src/common/ServiceBase';
import { encryptPassword } from 'src/utils/encryptPassword';
import { MailerService } from '../services/mailer.service';
import { UserRegister } from './dto/auth.input';
import { User, UserDocument } from './schema/auth.schema';

@Injectable()
export class AuthService extends ServiceBase<UserDocument> {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailerService: MailerService,
  ) {
    super(userModel);
  }

  async register(registerDto: UserRegister) {
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
}
