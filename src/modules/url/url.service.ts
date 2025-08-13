import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';
import { UidService } from '../../services/uid/uid.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { GetUrlDto } from './dto/get-url.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UrlService {
  private host: string;

  constructor(
    private readonly uidService: UidService,
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.host = this.configService.getOrThrow<string>('host');
  }

  async create(createUrlDto: CreateUrlDto) {
    const randomId = this.uidService.generate(5);
    const url = await this.databaseService.url.create({
      data: {
        ...createUrlDto,
        url: `${this.host}/${randomId}`,
      },
    });
    return url;
  }

  async findAll(queryParams: GetUrlDto) {
    const filter = queryParams.filter;
    const limit = queryParams.limit || 10;
    const page = queryParams.page || 1;

    const skip = (page - 1) * limit;

    const whereClause: Prisma.UrlWhereInput = filter
      ? {
          OR: [
            {
              url: { contains: filter },
            },
            {
              redirect: { contains: filter },
            },
            {
              description: { contains: filter },
            },
          ],
        }
      : {};

    const data = await this.databaseService.url.findMany({
      where: whereClause,
      take: limit,
      skip,
    });

    if (data.length === 0) {
      return [];
    }

    let baseUrl = `${this.host}/url?limit=${limit}`;
    if (filter) {
      baseUrl += `&filter=${encodeURIComponent(filter)}`;
    }

    const currentPage = page;
    const perPage = limit;
    const totalCount = await this.databaseService.url.count({
      where: whereClause,
    });
    const totalPages = Math.ceil(totalCount / limit);

    const nextPage = page < totalPages ? `${baseUrl}&page=${page + 1}` : null;
    const prevPage = page > 1 ? `${baseUrl}&page=${page - 1}` : null;

    const meta = {
      totalCount,
      totalPages,
      currentPage,
      perPage,
      nextPage,
      prevPage,
    };

    return {
      data,
      meta,
    };
  }

  async findOne(uid: string) {
    return await this.databaseService.url.findUnique({
      where: {
        url: `${this.host}/${uid}`,
      },
    });
  }

  async update(id: number, updateUrlDto: UpdateUrlDto) {
    return await this.databaseService.url.update({
      where: { id },
      data: updateUrlDto,
    });
  }

  async remove(id: number) {
    return await this.databaseService.url.delete({
      where: { id },
    });
  }
}
