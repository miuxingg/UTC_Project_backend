import { Module } from '@nestjs/common';

import { CacheService } from './cache.service';
import { MailerService } from './mailer.service';

@Module({
  imports: [],
  providers: [MailerService, CacheService],
  exports: [MailerService, CacheService],
})
export class ServicesModule {}
