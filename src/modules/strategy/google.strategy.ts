import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID:
        '200970573554-v8qm3tftfsikng4l2umi1gdcb2jv2bl0.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:8000/auth/callback',
      scope: ['email', 'profile'],
      response_type: 'code',
      access_type: 'offline',
      cors: true,
      name: 'google',
      endpoints: {
        login: 'https://accounts.google.com/o/oauth2/v2/auth',
        exchangeToken: 'https://oauth2.googleapis.com/token',
        userInfo: 'https://www.googleapis.com/oauth2/v1/userinfo',
      },
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    done(null, profile);
  }

  //   authorizationParams(options: any): any {
  //     return Object.assign(options, {
  //       approval_prompt: 'force',
  //       access_type: 'offline',
  //     });
  //   }
}
