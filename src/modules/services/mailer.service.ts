import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly mailer: NestMailerService) {}

  verifyEmail(to, { link, name, ttl }) {
    this.mailer.sendMail({
      to,
      subject: 'Verify email',
      template: 'verify',
      context: {
        ttl,
        link,
        name,
      },
    });
  }

  verifyAccountSuccess(to, { link, name }) {
    this.mailer.sendMail({
      to,
      subject: 'Verify Account Successfully',
      template: 'verifyAccountSuccess',
      context: {
        link,
        name,
      },
    });
  }

  thanksTo(to, { name, orderLine }) {
    this.mailer.sendMail({
      to,
      subject: 'Thank you',
      template: 'thanks',
      context: {
        orderLine,
        name,
      },
    });
  }

  employeePassword(to, { password, email }) {
    this.mailer.sendMail({
      to,
      subject: 'Your password',
      template: 'employeePassword',
      context: {
        password,
        email,
      },
    });
  }

  forgotPassword(to, { password, email }) {
    this.mailer.sendMail({
      to,
      subject: 'Your password',
      template: 'forgotPassword',
      context: {
        password,
        email,
      },
    });
  }
}
