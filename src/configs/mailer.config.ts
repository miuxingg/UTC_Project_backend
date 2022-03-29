import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { getEnv } from 'src/utils/getEnv';

const username = getEnv('EMAIL_USERNAME', 'bookstore.project.utc@gmail.com');
const password = getEnv('EMAIL_PASSWORD', 'ThanhBinh2k');

export const mailerOptions: MailerOptions = {
  transport: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: username,
      pass: password,
    },
  },
  defaults: {
    from: username,
  },
  template: {
    dir: process.cwd() + '/src/templates/mail/',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
