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
        '93718062531-5f4e9ntk0hcst18ke2kv26u0pr7tjurg.apps.googleusercontent.com',
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
    console.log('áds');
    done(null, profile);
  }

  //   authorizationParams(options: any): any {
  //     return Object.assign(options, {
  //       approval_prompt: 'force',
  //       access_type: 'offline',
  //     });
  //   }
}
