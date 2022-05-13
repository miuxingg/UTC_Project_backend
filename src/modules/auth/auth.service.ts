import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceBase } from 'src/common/ServiceBase';
import { comparePassword, encryptPassword } from 'src/utils/encryptPassword';
import { transformValidationMessage } from 'src/utils/helper';
import { MailerService } from '../services/mailer.service';
import { AccountEmployeelDto, CredentialDto } from './dto/auth.input';
import { User, UserDocument } from './schema/auth.schema';
import * as messages from '../resources/errorMessage.json';
import { generateToken } from 'src/utils/generateToken';
import { EXPRIRE_TOKEN } from 'src/configs';
import { DashboardRolesAccess, Roles } from 'src/configs/roles.config';
import { BaseQuery } from 'src/common/BaseDTO';
import { aggregateQuery } from 'src/common/Aggregate';
import { makeId } from 'src/utils/makeId';
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

  async login(loginDto: CredentialDto, isAdmin: boolean) {
    const _isCheckEmailExist = await this.userModel.findOne({
      email: loginDto.email,
    });

    if (!_isCheckEmailExist)
      throw new BadRequestException(
        transformValidationMessage(messages.incorrectEmail, 'email', ['Email']),
      );

    const _isCheckPassword = await comparePassword(
      _isCheckEmailExist.password,
      loginDto.password,
    );

    if (!_isCheckPassword)
      throw new BadRequestException(
        transformValidationMessage(messages.incorrectPassword, 'password', [
          'Password',
        ]),
      );
    if (isAdmin) {
      const _check = DashboardRolesAccess.includes(
        _isCheckEmailExist.roles as any,
      );
      if (!_check) {
        throw new BadRequestException(
          transformValidationMessage(messages.permission, 'permission'),
        );
      }
    }

    return {
      access_token: generateToken(
        _isCheckEmailExist._id,
        _isCheckEmailExist.roles,
      ),
      expires_in: EXPRIRE_TOKEN,
    };
  }

  async getEmployee(queries: BaseQuery) {
    const match = { roles: { $in: [Roles.Manager, Roles.Shipper] } };
    if (queries && queries?.search) {
      match['$text'] = { $search: queries.search };
    }
    const employee = await this.model.aggregate([
      {
        $match: match,
      },
      ...aggregateQuery(queries),
    ]);
    return employee;
  }

  async createAccountEmployee(input: AccountEmployeelDto) {
    const isAccount = await this.model.findOne({ email: input.email });
    if (isAccount) {
      throw new HttpException('Email đã tồn tại', HttpStatus.BAD_REQUEST);
      // throw new BadRequestException(
      //   transformValidationMessage('Email đã tồn tại', 'email', ['Email']),
      // );
    }
    const password = makeId(8);
    const encryptPassw = await encryptPassword(password);
    const data = await this.model.create({
      email: input.email,
      password: encryptPassw,
      firstName: input.firstName,
      lastName: input.lastName,
      roles: input.roles,
    });
    await this.mailerService.employeePassword(input.email, {
      email: input.email,
      password: password,
    });
    return data;
  }

  async updateEmployee(id: string, input: AccountEmployeelDto) {
    const employee = await this.model.findById(id);
    if (!employee) {
      throw new HttpException('Không tìm thấy user', HttpStatus.NOT_FOUND);
    }
    employee.firstName = input.firstName;
    employee.lastName = input.lastName;
    employee.roles = input.roles;
    await employee.save();
    return employee;
  }
}
