import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: () => void) {
    res.on('finish', () => {
      const { url, method, query } = req;
      const logData = {
        url,
        method,
        query,
      };
      const { statusCode } = res;

      if (statusCode == 500) {
        this.logger.error(
          `${method} [${statusCode}] ${url}`,
          undefined,
          'HTTP',
          logData,
        );
      } else if (statusCode >= 400 && statusCode < 500) {
        this.logger.warn(`${method} [${statusCode}] ${url}`, 'HTTP', logData);
      } else {
        this.logger.log(`${method} [${statusCode}] ${url}`, 'HTTP', logData);
      }
    });

    next();
  }
}
