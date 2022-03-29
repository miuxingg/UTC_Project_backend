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
}
