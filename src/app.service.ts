import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

import { CacheService } from './core/cache/cache.service';
import { LoggerService } from './core/logger/logger.service';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {
  constructor(
    private readonly logger: LoggerService,
    private readonly databaseService: DatabaseService,
    private readonly cacheService: CacheService,
  ) {}

  async getHello() {
    this.logger.log('calling log', 'App Service', { user: 123 });
    const users = await this.databaseService.user.findMany();
    await this.cacheService.set('users', users);
    const cacheValue = await this.cacheService.get('users');
    return cacheValue;
  }
}
