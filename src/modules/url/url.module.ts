import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { UidService } from 'src/services/uid/uid.service';

@Module({
  controllers: [UrlController],
  providers: [UrlService, UidService],
})
export class UrlModule {}
