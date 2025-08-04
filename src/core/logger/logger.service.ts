/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor(private readonly configService: ConfigService) {
    const isDevelopment =
      this.configService.getOrThrow<string>('environment') === 'development';
    const { combine, timestamp, json, colorize, printf } = winston.format;

    const logFormat = isDevelopment
      ? combine(
          colorize(),
          timestamp(),
          printf(({ level, message, context, timestamp, meta }) => {
            return `${timestamp} ${level} [${context}] ${message} ${meta ? JSON.stringify(meta) : ''}`;
          }),
        )
      : combine(timestamp(), json());

    this.logger = winston.createLogger({
      format: logFormat,
      transports: [new winston.transports.Console()],
    });
  }

  log(message: string, context?: string, meta?: any) {
    this.logger.info(message, { context, meta });
  }
  error(message: string, trace?: string, context?: string, meta?: any) {
    this.logger.error(message, { trace, context, meta });
  }
  warn(message: string, context?: string, meta?: any) {
    this.logger.warn(message, { context, meta });
  }
}
