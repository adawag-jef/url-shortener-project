import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { LoggerService } from './core/logger/logger.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { DatabaseService } from './database/database.service';
import { CacheService } from './core/cache/cache.service';
import { mockDeep } from 'jest-mock-extended';

describe('AppService', () => {
  let appService: AppService;
  let cacheService: DeepMocked<CacheService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: LoggerService,
          useValue: createMock<LoggerService>(),
        },
        {
          provide: DatabaseService,
          useValue: mockDeep<DatabaseService>(),
        },
        {
          provide: CacheService,
          useValue: createMock<CacheService>(),
        },
      ],
    }).compile();

    appService = app.get<AppService>(AppService);
    cacheService = app.get<DeepMocked<CacheService>>(CacheService);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      cacheService.get.mockResolvedValue([
        {
          id: 1,
          email: 'user@mail.com',
          createdAt: '2025-07-30T03:39:04.369Z',
          updatedAt: '2025-07-30T03:39:12.404Z',
        },
      ]);
      const result = await appService.getHello();

      expect(result).toEqual([
        {
          id: 1,
          email: 'user@mail.com',
          createdAt: '2025-07-30T03:39:04.369Z',
          updatedAt: '2025-07-30T03:39:12.404Z',
        },
      ]);
    });
  });
});
